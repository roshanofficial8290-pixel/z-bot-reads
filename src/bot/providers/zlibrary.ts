import type { Book, BookProvider, SearchResult } from "./types";

/**
 * Real Z-Library backend.
 *
 * Z-Library has no public JSON API, so this mirrors the approach of the
 * open-source client https://github.com/sertraline/zlibrary:
 *   1. POST credentials to /rpc.php and keep the remix_* session cookies
 *   2. GET /s/<query> and scrape the <z-bookcard> elements
 *   3. GET /book/<id>/<hash> for details + the download link
 *
 * Implemented with fetch + regex only, so it runs in the edge/serverless runtime.
 */

const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** Z-Library serves a fixed number of results per HTML page. */
const REMOTE_PAGE_SIZE = 50;

interface Attrs {
  [key: string]: string;
}

function attrs(openingTag: string): Attrs {
  const out: Attrs = {};
  const re = /([a-zA-Z0-9_:-]+)\s*=\s*"([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(openingTag))) out[m[1]!] = m[2]!;
  return out;
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)));
}

function parseSize(raw?: string): number | undefined {
  if (!raw) return undefined;
  const m = /([\d.]+)\s*(B|KB|MB|GB)/i.exec(raw);
  if (!m) return undefined;
  const units: Record<string, number> = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 };
  return Math.round(Number(m[1]) * (units[m[2]!.toLowerCase()] ?? 1));
}

/** "/book/123456/abc123/some-slug.html" -> "123456/abc123" (short enough for callback_data) */
function hrefToId(href: string): string | undefined {
  const m = /\/book\/(\d+)(?:\/([A-Za-z0-9]+))?/.exec(href);
  if (!m) return undefined;
  return m[2] ? `${m[1]}/${m[2]}` : m[1]!;
}

export class ZLibraryProvider implements BookProvider {
  readonly name = "zlibrary";

  private readonly mirror: string;
  private readonly email: string | undefined;
  private readonly password: string | undefined;
  private cookie: string | undefined;
  private loginPromise: Promise<string> | undefined;

  constructor() {
    const domain = process.env["ZLIBRARY_DOMAIN"] ?? "https://z-library.sk";
    this.mirror = domain.replace(/\/+$/, "");
    this.email = process.env["ZLIBRARY_EMAIL"];
    this.password = process.env["ZLIBRARY_PASSWORD"];
  }

  // ---------- auth ----------

  private async login(): Promise<string> {
    if (!this.email || !this.password) {
      throw new Error("ZLIBRARY_EMAIL and ZLIBRARY_PASSWORD are not configured");
    }
    const body = new URLSearchParams({
      isModal: "true",
      email: this.email,
      password: this.password,
      site_mode: "books",
      action: "login",
      isSingleLogin: "1",
      redirectUrl: "",
      gg_json_mode: "1",
    });

    const res = await fetch(`${this.mirror}/rpc.php`, {
      method: "POST",
      headers: {
        "User-Agent": UA,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/plain, */*",
      },
      body,
      redirect: "manual",
    });

    const text = await res.text();
    if (text.includes("validationError")) {
      throw new Error("Z-Library rejected the credentials (validationError)");
    }

    const raw = res.headers.getSetCookie?.() ?? [];
    const jar: string[] = [];
    for (const c of raw) {
      const pair = c.split(";")[0]!;
      if (/^remix_/.test(pair)) jar.push(pair);
    }
    if (!jar.length) {
      // Some mirrors return the keys in the JSON payload instead of Set-Cookie.
      const key = /"remix_userkey"\s*:\s*"([^"]+)"/.exec(text)?.[1];
      const uid = /"remix_userid"\s*:\s*"?(\d+)"?/.exec(text)?.[1];
      if (key && uid) jar.push(`remix_userkey=${key}`, `remix_userid=${uid}`);
    }
    if (!jar.length) throw new Error("Z-Library login returned no session cookies");

    this.cookie = jar.join("; ");
    return this.cookie;
  }

  private async session(): Promise<string> {
    if (this.cookie) return this.cookie;
    if (!this.loginPromise) {
      this.loginPromise = this.login().finally(() => {
        this.loginPromise = undefined;
      });
    }
    return this.loginPromise;
  }

  private async get(path: string, retry = true): Promise<string> {
    const cookie = await this.session();
    const res = await fetch(`${this.mirror}${path}`, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
        Cookie: cookie,
      },
      redirect: "follow",
    });
    const html = await res.text();
    const expired = res.status === 401 || res.status === 403 || /id="loginForm"/.test(html);
    if (expired && retry) {
      this.cookie = undefined;
      return this.get(path, false);
    }
    if (!res.ok) throw new Error(`Z-Library GET ${path} failed with ${res.status}`);
    return html;
  }

  // ---------- search ----------

  async search(query: string, page: number, pageSize: number): Promise<SearchResult> {
    const safePage = Math.max(1, Math.trunc(page) || 1);
    const offset = (safePage - 1) * pageSize;
    const remotePage = Math.floor(offset / REMOTE_PAGE_SIZE) + 1;
    const localOffset = offset % REMOTE_PAGE_SIZE;

    const html = await this.get(
      `/s/${encodeURIComponent(query)}?page=${remotePage}&order=popular`,
    );

    if (/class="notFound"/.test(html)) {
      return { items: [], page: safePage, pageSize, total: 0, hasNext: false, hasPrev: safePage > 1 };
    }

    const all = this.parseCards(html);
    const pagesTotal = Number(/pagesTotal\s*:\s*(\d+)/.exec(html)?.[1] ?? 1) || 1;
    const items = all.slice(localOffset, localOffset + pageSize);

    const moreOnThisPage = all.length > localOffset + pageSize;
    const hasNext = moreOnThisPage || remotePage < pagesTotal;
    const total = pagesTotal > 1 ? pagesTotal * REMOTE_PAGE_SIZE : all.length;

    return {
      items,
      page: safePage,
      pageSize,
      total,
      hasNext,
      hasPrev: safePage > 1,
    };
  }

  private parseCards(html: string): Book[] {
    const box = /id="searchResultBox"([\s\S]*)$/.exec(html)?.[1] ?? html;
    const books: Book[] = [];
    const re = /<z-bookcard([^>]*)>([\s\S]*?)<\/z-bookcard>/g;
    let m: RegExpExecArray | null;

    while ((m = re.exec(box))) {
      const a = attrs(m[1]!);
      const inner = m[2]!;
      const href = a["href"] ?? "";
      const id = hrefToId(href) ?? a["id"];
      if (!id) continue;

      const title =
        stripTags(/<div[^>]*slot="title"[^>]*>([\s\S]*?)<\/div>/.exec(inner)?.[1] ?? "") ||
        "Untitled";
      const authorsRaw = stripTags(
        /<div[^>]*slot="author"[^>]*>([\s\S]*?)<\/div>/.exec(inner)?.[1] ?? "",
      );
      const cover =
        /<img[^>]*data-src="([^"]+)"/.exec(inner)?.[1] ?? /<img[^>]*src="([^"]+)"/.exec(inner)?.[1];

      books.push({
        id,
        title,
        authors: authorsRaw ? authorsRaw.split(/[;,]/).map((s) => s.trim()).filter(Boolean) : [],
        year: a["year"] ? Number(a["year"]) : undefined,
        language: a["language"],
        format: a["extension"]?.toUpperCase(),
        fileSizeBytes: parseSize(a["filesize"]),
        coverUrl: cover ? this.absolute(cover) : undefined,
        sources: [{ label: "Open on Z-Library", url: this.absolute(href || `/book/${id}`) }],
      });
    }
    return books;
  }

  // ---------- details ----------

  async getById(id: string): Promise<Book | null> {
    if (!/^\d+(\/[A-Za-z0-9]+)?$/.test(id)) return null;
    const html = await this.get(`/book/${id}`);
    if (/class="notFound"/.test(html) || /404/.test(html.slice(0, 200))) return null;

    const title =
      stripTags(/<h1[^>]*itemprop="name"[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? "") ||
      attrs(/<z-cover([^>]*)>/.exec(html)?.[1] ?? "")["title"] ||
      stripTags(/<title>([\s\S]*?)<\/title>/.exec(html)?.[1] ?? "") ||
      "Untitled";

    const authors = [
      ...(/<i[^>]*class="[^"]*authors?[^"]*"[^>]*>([\s\S]*?)<\/i>/.exec(html)?.[1] ?? "").matchAll(
        /<a[^>]*>([\s\S]*?)<\/a>/g,
      ),
    ]
      .map((m) => stripTags(m[1]!))
      .filter(Boolean);

    const property = (name: string) =>
      stripTags(
        new RegExp(
          `class="property_${name}"[\\s\\S]*?class="property_value"[^>]*>([\\s\\S]*?)</div>`,
        ).exec(html)?.[1] ?? "",
      ) || undefined;

    const fileInfo = stripTags(
      /class="property__file"[\s\S]*?class="property_value"[^>]*>([\s\S]*?)<\/div>/.exec(html)?.[1] ??
        "",
    );
    const [extRaw, sizeRaw] = fileInfo.split(",").map((s) => s.trim());

    const description = stripTags(
      /id="bookDescriptionBox"[^>]*>([\s\S]*?)<\/div>/.exec(html)?.[1] ?? "",
    );
    const cover =
      /<z-cover[\s\S]{0,400}?<img[^>]*src="([^"]+)"/.exec(html)?.[1] ??
      /<div[^>]*class="[^"]*z-book-cover[^"]*"[\s\S]{0,300}?src="([^"]+)"/.exec(html)?.[1];

    const dl = /<a[^>]*class="[^"]*addDownloadedBook[^"]*"[^>]*>/.exec(html)?.[0];
    const dlHref = dl ? attrs(dl)["href"] : undefined;
    const unavailable = !dlHref || /unavailable/i.test(dl ?? "");

    const format = (property("extension") ?? extRaw)?.toUpperCase();
    const sources: Book["sources"] = [];
    if (!unavailable && dlHref) {
      sources.push({ label: `Download${format ? ` ${format}` : ""}`, url: this.absolute(dlHref) });
    }
    sources.push({ label: "Open on Z-Library", url: `${this.mirror}/book/${id}` });

    const yearRaw = property("year");
    return {
      id,
      title,
      authors,
      year: yearRaw ? Number(yearRaw.replace(/\D/g, "")) || undefined : undefined,
      language: property("language"),
      format,
      fileSizeBytes: parseSize(property("size") ?? sizeRaw),
      description: description || undefined,
      coverUrl: cover ? this.absolute(cover) : undefined,
      sources,
    };
  }

  private absolute(url: string): string {
    if (/^https?:\/\//.test(url)) return url;
    return `${this.mirror}${url.startsWith("/") ? "" : "/"}${url}`;
  }
}
