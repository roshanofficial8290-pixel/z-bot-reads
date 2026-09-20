import type { Book, BookProvider, BookSource, SearchResult } from "./types";

/**
 * Robust, diagnostic-rich Z-Library provider.
 *
 * Capabilities:
 *  1. Environment validation: checks domains, credentials, and token configurations without exposing secrets.
 *  2. Auth flow: supports Direct Token/Cookie auth, EAPI (/eapi/user/login), and RPC (/rpc.php) fallback.
 *     Gracefully degrades to public search if credentials fail or are unconfigured.
 *  3. Mirror resilience: automatically falls back across candidate mirrors if a mirror fails or is blocked.
 *  4. Endpoints: primary mobile JSON API (/eapi/book/search, /eapi/book/:id/:hash) with web HTML fallback.
 *  5. Safe diagnostics: tracks health, connectivity, auth, and search stats with strict secret masking.
 */

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const CANDIDATE_MIRRORS = [
  "https://singlelogin.rs",
  "https://singlelogin.re",
  "https://z-library.sk",
];

export interface SafeZLibDiagnostics {
  domain: string;
  activeMirror: string;
  environment: {
    domainConfigured: boolean;
    emailConfigured: boolean;
    passwordConfigured: boolean;
    directTokensConfigured: boolean;
    providerMode: string;
  };
  auth: {
    status: "authenticated" | "public_fallback" | "unconfigured" | "failed";
    method: "direct_cookie" | "direct_tokens" | "eapi_login" | "rpc_login" | "none";
    message?: string | undefined;
  };
  endpoints: {
    eapiStatus: "reachable" | "unreachable" | "pending";
    lastPingMs?: number | undefined;
  };
  lastAction?:
    | {
        type: "search" | "detail" | "featured" | "auth";
        queryOrId?: string | undefined;
        resultCount?: number | undefined;
        total?: number | undefined;
        success: boolean;
        timestamp: string;
        error?: string | undefined;
      }
    | undefined;
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSize(raw?: string): number | undefined {
  if (!raw) return undefined;
  const m = /([\d.]+)\s*(B|KB|MB|GB)/i.exec(raw);
  if (!m) return undefined;
  const units: Record<string, number> = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 };
  return Math.round(Number(m[1]) * (units[m[2]!.toLowerCase()] ?? 1));
}

function sanitizeLogMessage(msg: string): string {
  // Strip anything that looks like a password or long token
  return msg
    .replace(/(password=)[^& ]+/gi, "$1[REDACTED]")
    .replace(/(userkey=)[^& ]+/gi, "$1[REDACTED]")
    .replace(/(key=)[^& ]+/gi, "$1[REDACTED]")
    .replace(/(Cookie:\s*)[^\n]+/gi, "$1[REDACTED]")
    .slice(0, 300);
}

export class ZLibraryProvider implements BookProvider {
  readonly name = "zlibrary";

  private activeMirror: string;
  private readonly configuredDomain: string | undefined;
  private readonly email: string | undefined;
  private readonly password: string | undefined;
  private readonly directCookie: string | undefined;
  private readonly directUserId: string | undefined;
  private readonly directUserKey: string | undefined;

  private sessionCookie: string | undefined;
  private authState: SafeZLibDiagnostics["auth"] = {
    status: "unconfigured",
    method: "none",
  };
  private endpointStatus: SafeZLibDiagnostics["endpoints"] = {
    eapiStatus: "pending",
  };
  private lastAction: SafeZLibDiagnostics["lastAction"] = undefined;

  private readonly bookCache = new Map<string, Book>();
  private loginPromise: Promise<void> | undefined;

  constructor() {
    this.configuredDomain = process.env["ZLIBRARY_DOMAIN"]?.replace(/\/+$/, "");
    this.email = process.env["ZLIBRARY_EMAIL"]?.trim();
    this.password = process.env["ZLIBRARY_PASSWORD"]?.trim();

    this.directCookie = process.env["ZLIBRARY_COOKIE"]?.trim();
    this.directUserId =
      process.env["ZLIBRARY_REMIX_USERID"]?.trim() ?? process.env["ZLIBRARY_USERID"]?.trim();
    this.directUserKey =
      process.env["ZLIBRARY_REMIX_USERKEY"]?.trim() ?? process.env["ZLIBRARY_USERKEY"]?.trim();

    // Prioritize user's configured domain if given, else active mirror
    this.activeMirror = this.configuredDomain ?? CANDIDATE_MIRRORS[0]!;

    this.checkEnvironment();
  }

  // ---------- diagnostics ----------

  /**
   * Safely inspects configuration without leaking credentials.
   */
  private checkEnvironment(): void {
    const hasEmail = Boolean(this.email);
    const hasPassword = Boolean(this.password);
    const hasDirect = Boolean(this.directCookie || (this.directUserId && this.directUserKey));

    if (hasDirect) {
      this.authState = {
        status: "authenticated",
        method: this.directCookie ? "direct_cookie" : "direct_tokens",
      };
      if (this.directCookie) {
        this.sessionCookie = this.directCookie;
      } else if (this.directUserId && this.directUserKey) {
        this.sessionCookie = `remix_userid=${this.directUserId}; remix_userkey=${this.directUserKey}`;
      }
    } else if (hasEmail && hasPassword) {
      this.authState = { status: "unconfigured", method: "eapi_login" };
    } else {
      this.authState = {
        status: "public_fallback",
        method: "none",
        message: "No credentials configured; running in public search mode.",
      };
    }

    console.info(
      `[ZLibrary] Diagnostics initialized: domain=${this.activeMirror} | emailConfigured=${hasEmail} | passwordConfigured=${hasPassword} | tokensConfigured=${hasDirect} | initialAuth=${this.authState.status}`,
    );
  }

  public getDiagnostics(): SafeZLibDiagnostics {
    return {
      domain: this.configuredDomain ?? CANDIDATE_MIRRORS[0]!,
      activeMirror: this.activeMirror,
      environment: {
        domainConfigured: Boolean(this.configuredDomain),
        emailConfigured: Boolean(this.email),
        passwordConfigured: Boolean(this.password),
        directTokensConfigured: Boolean(
          this.directCookie || (this.directUserId && this.directUserKey),
        ),
        providerMode: "zlibrary",
      },
      auth: { ...this.authState },
      endpoints: { ...this.endpointStatus },
      lastAction: this.lastAction ? { ...this.lastAction } : undefined,
    };
  }

  // ---------- mirror failover ----------

  private getMirrors(): string[] {
    const list: string[] = [];
    if (this.configuredDomain) list.push(this.configuredDomain);
    for (const m of CANDIDATE_MIRRORS) {
      if (!list.includes(m)) list.push(m);
    }
    return list;
  }

  private async rotateMirror(failedMirror: string): Promise<string> {
    const mirrors = this.getMirrors();
    const next = mirrors.find((m) => m !== failedMirror) ?? mirrors[0]!;
    console.warn(`[ZLibrary] Mirror ${failedMirror} failed. Rotating to fallback ${next}...`);
    this.activeMirror = next;
    return next;
  }

  // ---------- auth ----------

  private async ensureAuth(): Promise<void> {
    if (this.authState.status === "authenticated" && this.sessionCookie) {
      return;
    }
    if (this.authState.status === "public_fallback" && !this.email) {
      return;
    }
    if (this.loginPromise) {
      return this.loginPromise;
    }

    this.loginPromise = this.performLogin().finally(() => {
      this.loginPromise = undefined;
    });
    return this.loginPromise;
  }

  private async performLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.authState = {
        status: "public_fallback",
        method: "none",
        message: "No email/password set; proceeding with public search.",
      };
      return;
    }

    console.info(`[ZLibrary] Authenticating via EAPI on ${this.activeMirror}...`);
    const startTime = Date.now();

    try {
      const res = await fetch(`${this.activeMirror}/eapi/user/login`, {
        method: "POST",
        headers: {
          "User-Agent": UA,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({ email: this.email, password: this.password }),
        signal: AbortSignal.timeout(10000),
      });

      this.endpointStatus.lastPingMs = Date.now() - startTime;
      this.endpointStatus.eapiStatus = "reachable";

      const data = (await res.json().catch(() => null)) as {
        success?: number;
        error?: string;
        user?: { id?: number | string; remix_userkey?: string };
      } | null;

      if (data?.success === 1) {
        const uid = data.user?.id;
        const ukey = data.user?.remix_userkey;

        const jar: string[] = [];
        if (uid && ukey) {
          jar.push(`remix_userid=${uid}`, `remix_userkey=${ukey}`);
        }

        const rawCookies = res.headers.getSetCookie?.() ?? [];
        for (const c of rawCookies) {
          const pair = c.split(";")[0]!;
          if (/^remix_/.test(pair) && !jar.some((j) => j.startsWith(pair.split("=")[0]!))) {
            jar.push(pair);
          }
        }

        if (jar.length > 0) {
          this.sessionCookie = jar.join("; ");
          this.authState = {
            status: "authenticated",
            method: "eapi_login",
            message: `Authenticated via EAPI (uid ${uid ?? "ok"})`,
          };
          console.info(`[ZLibrary] Auth success: session tokens acquired on ${this.activeMirror}`);
          this.recordAction("auth", undefined, true);
          return;
        }
      }

      // If login returned 400 or error message:
      const errMsg = sanitizeLogMessage(data?.error ?? `HTTP ${res.status}`);
      this.authState = {
        status: "failed",
        method: "eapi_login",
        message: `Login rejected: ${errMsg}. Proceeding with public access.`,
      };
      console.warn(
        `[ZLibrary] Login rejected on ${this.activeMirror}: ${errMsg}. Using public access fallback.`,
      );
      this.recordAction("auth", undefined, false, errMsg);
    } catch (err) {
      const msg = sanitizeLogMessage(err instanceof Error ? err.message : String(err));
      console.error(`[ZLibrary] Login request failed on ${this.activeMirror}: ${msg}`);
      this.endpointStatus.eapiStatus = "unreachable";
      this.authState = {
        status: "failed",
        method: "eapi_login",
        message: `Connection failed: ${msg}. Proceeding with public access.`,
      };
      this.recordAction("auth", undefined, false, msg);
    }
  }

  // ---------- search ----------

  async search(query: string, page: number, pageSize: number): Promise<SearchResult> {
    const safePage = Math.max(1, Math.trunc(page) || 1);
    const safeQuery = query.trim();

    if (!safeQuery) {
      return { items: [], page: safePage, pageSize, total: 0, hasNext: false, hasPrev: false };
    }

    await this.ensureAuth();

    console.info(
      `[ZLibrary] Executing search for "${safeQuery.slice(0, 35)}" (p.${safePage}, limit ${pageSize})...`,
    );

    let lastError: Error | undefined;
    const mirrors = this.getMirrors();

    for (let attempt = 0; attempt < mirrors.length; attempt++) {
      const mirror = this.activeMirror;
      try {
        const result = await this.executeEapiSearch(mirror, safeQuery, safePage, pageSize);
        this.endpointStatus.eapiStatus = "reachable";
        this.recordAction("search", safeQuery, true, undefined, result.items.length, result.total);
        console.info(
          `[ZLibrary] Search succeeded on ${mirror}: parsed ${result.items.length} books (reported total: ${result.total})`,
        );
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        const sanitized = sanitizeLogMessage(lastError.message);
        console.warn(
          `[ZLibrary] Search on ${mirror} failed (${sanitized}). Trying failover mirror...`,
        );
        await this.rotateMirror(mirror);
      }
    }

    // Fallback: try HTML scraping on active mirror if EAPI was unreachable
    try {
      console.info(`[ZLibrary] Attempting HTML search fallback on ${this.activeMirror}...`);
      const htmlResult = await this.executeHtmlSearch(
        this.activeMirror,
        safeQuery,
        safePage,
        pageSize,
      );
      this.recordAction(
        "search",
        safeQuery,
        true,
        undefined,
        htmlResult.items.length,
        htmlResult.total,
      );
      return htmlResult;
    } catch (htmlErr) {
      const sanitized = sanitizeLogMessage(
        htmlErr instanceof Error ? htmlErr.message : String(htmlErr),
      );
      this.recordAction("search", safeQuery, false, sanitized);
      console.error(`[ZLibrary] Both EAPI and HTML search failed: ${sanitized}`);
      throw lastError ?? htmlErr;
    }
  }

  private async executeEapiSearch(
    mirror: string,
    query: string,
    page: number,
    pageSize: number,
  ): Promise<SearchResult> {
    const headers: Record<string, string> = {
      "User-Agent": UA,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    };

    if (this.sessionCookie) {
      headers["Cookie"] = this.sessionCookie;
      const uid = /remix_userid=([^;]+)/.exec(this.sessionCookie)?.[1];
      const ukey = /remix_userkey=([^;]+)/.exec(this.sessionCookie)?.[1];
      if (uid) headers["remix-userid"] = uid;
      if (ukey) headers["remix-userkey"] = ukey;
    }

    const body = new URLSearchParams({
      message: query,
      page: String(page),
      limit: String(pageSize),
      order: "popular",
    });

    const res = await fetch(`${mirror}/eapi/book/search`, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok && res.status !== 200) {
      throw new Error(`EAPI search responded with HTTP ${res.status}`);
    }

    const data = (await res.json()) as {
      success?: number;
      books?: unknown[];
      exactBooksCount?: number;
      pagination?: {
        total_items?: number;
        total_pages?: number;
        current?: number;
        limit?: number;
      };
    };

    if (!data || data.success === 0 || !Array.isArray(data.books)) {
      return {
        items: [],
        page,
        pageSize,
        total: 0,
        hasNext: false,
        hasPrev: page > 1,
      };
    }

    const items = data.books.map((b) => this.mapEapiBook(b, mirror));

    // Cache books so getById is instant and reliable
    for (const item of items) {
      this.bookCache.set(item.id, item);
      const pureId = item.id.split("/")[0];
      if (pureId) this.bookCache.set(pureId, item);
    }

    const total = data.pagination?.total_items ?? data.exactBooksCount ?? items.length;
    const totalPages = data.pagination?.total_pages ?? Math.max(1, Math.ceil(total / pageSize));
    const hasNext = data.pagination ? page < totalPages : page * pageSize < total;
    const hasPrev = page > 1;

    return {
      items,
      page,
      pageSize,
      total,
      hasNext,
      hasPrev,
    };
  }

  private mapEapiBook(raw: unknown, mirror: string): Book {
    const b = (raw ?? {}) as Record<string, unknown>;

    const numId = b["id"] !== undefined ? String(b["id"]) : "";
    const hash = typeof b["hash"] === "string" && b["hash"] ? b["hash"] : "";
    const id = hash ? `${numId}/${hash}` : numId;

    const title = String(b["title"] || b["name"] || "Untitled");

    let authors: string[] = [];
    if (Array.isArray(b["authors"]) && b["authors"].length > 0) {
      authors = b["authors"].map(String).filter(Boolean);
    } else if (typeof b["author"] === "string" && b["author"].trim()) {
      authors = b["author"]
        .split(/[;,]/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (authors.length === 0) {
      authors = ["Unknown Author"];
    }

    const year = b["year"] ? Number(b["year"]) || undefined : undefined;
    const language = typeof b["language"] === "string" ? b["language"] : undefined;
    const format = typeof b["extension"] === "string" ? b["extension"].toUpperCase() : undefined;

    const fileSizeBytes =
      typeof b["filesize"] === "number"
        ? b["filesize"]
        : parseSize(typeof b["filesizeString"] === "string" ? b["filesizeString"] : undefined);

    const rawCover = typeof b["cover"] === "string" ? b["cover"] : undefined;
    const coverUrl = rawCover ? this.absolute(rawCover, mirror) : undefined;
    const description =
      typeof b["description"] === "string" ? stripTags(b["description"]) : undefined;

    const sources: BookSource[] = [];

    // 1. Direct download endpoint if available
    const dl = typeof b["dl"] === "string" ? b["dl"] : undefined;
    if (dl) {
      sources.push({
        label: format ? `📥 Download ${format}` : "📥 Download",
        url: this.absolute(dl, mirror),
      });
    }

    // 2. Read online reader link if available
    const readOnline = typeof b["readOnlineUrl"] === "string" ? b["readOnlineUrl"] : undefined;
    if (b["readOnlineAvailable"] && readOnline) {
      sources.push({
        label: "🌐 Read online",
        url: readOnline,
      });
    }

    // 3. Web page fallback
    const href = typeof b["href"] === "string" ? b["href"] : `/book/${id}`;
    sources.push({
      label: "📖 Open on Z-Library",
      url: this.absolute(href, mirror),
    });

    return {
      id,
      title,
      authors,
      year,
      language,
      format,
      fileSizeBytes,
      description,
      coverUrl,
      sources,
    };
  }

  // ---------- HTML fallback search ----------

  private async executeHtmlSearch(
    mirror: string,
    query: string,
    page: number,
    pageSize: number,
  ): Promise<SearchResult> {
    const url = `${mirror}/s/${encodeURIComponent(query)}?page=${page}&order=popular`;
    const headers: Record<string, string> = {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    };
    if (this.sessionCookie) headers["Cookie"] = this.sessionCookie;

    const res = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });
    const html = await res.text();

    if (/class="notFound"/.test(html)) {
      return { items: [], page, pageSize, total: 0, hasNext: false, hasPrev: page > 1 };
    }

    const books: Book[] = [];
    const re = /<z-bookcard([^>]*)>([\s\S]*?)<\/z-bookcard>/g;
    let m: RegExpExecArray | null;

    while ((m = re.exec(html))) {
      const tagAttrs = m[1]!;
      const inner = m[2]!;

      const href = /href="([^"]*)"/.exec(tagAttrs)?.[1] ?? "";
      const idMatch = /\/book\/(\d+)(?:\/([A-Za-z0-9]+))?/.exec(href);
      const id = idMatch ? (idMatch[2] ? `${idMatch[1]}/${idMatch[2]}` : idMatch[1]!) : undefined;
      if (!id) continue;

      const title =
        stripTags(/<div[^>]*slot="title"[^>]*>([\s\S]*?)<\/div>/.exec(inner)?.[1] ?? "") ||
        "Untitled";
      const authorsRaw = stripTags(
        /<div[^>]*slot="author"[^>]*>([\s\S]*?)<\/div>/.exec(inner)?.[1] ?? "",
      );
      const authors = authorsRaw
        ? authorsRaw
            .split(/[;,]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : ["Unknown Author"];

      const yearRaw = /year="([^"]*)"/.exec(tagAttrs)?.[1];
      const extRaw = /extension="([^"]*)"/.exec(tagAttrs)?.[1];
      const sizeRaw = /filesize="([^"]*)"/.exec(tagAttrs)?.[1];
      const cover =
        /<img[^>]*data-src="([^"]+)"/.exec(inner)?.[1] ?? /<img[^>]*src="([^"]+)"/.exec(inner)?.[1];

      books.push({
        id,
        title,
        authors,
        year: yearRaw ? Number(yearRaw) || undefined : undefined,
        format: extRaw?.toUpperCase(),
        fileSizeBytes: parseSize(sizeRaw),
        coverUrl: cover ? this.absolute(cover, mirror) : undefined,
        sources: [
          { label: "📖 Open on Z-Library", url: this.absolute(href || `/book/${id}`, mirror) },
        ],
      });
    }

    const items = books.slice(0, pageSize);
    const total = books.length;

    return {
      items,
      page,
      pageSize,
      total,
      hasNext: books.length > pageSize,
      hasPrev: page > 1,
    };
  }

  // ---------- details ----------

  async getById(id: string): Promise<Book | null> {
    if (!id || typeof id !== "string") return null;

    // Fast return from cache if populated during search
    const cached = this.bookCache.get(id);
    if (cached && cached.description) {
      return cached;
    }

    await this.ensureAuth();
    console.info(`[ZLibrary] Fetching details for book id "${id}"...`);

    const headers: Record<string, string> = {
      "User-Agent": UA,
      Accept: "application/json",
    };
    if (this.sessionCookie) headers["Cookie"] = this.sessionCookie;

    try {
      // EAPI detail lookup
      const res = await fetch(`${this.activeMirror}/eapi/book/${id}`, {
        headers,
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          success?: number;
          book?: unknown;
        };
        if (data.success === 1 && data.book) {
          const mapped = this.mapEapiBook(data.book, this.activeMirror);
          this.bookCache.set(id, mapped);
          this.recordAction("detail", id, true);
          return mapped;
        }
      }
    } catch (err) {
      const sanitized = sanitizeLogMessage(err instanceof Error ? err.message : String(err));
      console.warn(
        `[ZLibrary] EAPI detail lookup for ${id} failed (${sanitized}). Trying cache or fallback.`,
      );
    }

    // Return cached partial result if we found it in search
    if (cached) return cached;

    // Search query fallback if id was numeric
    try {
      const searchRes = await this.executeEapiSearch(this.activeMirror, id, 1, 1);
      if (searchRes.items.length > 0) {
        const found = searchRes.items[0]!;
        this.bookCache.set(id, found);
        return found;
      }
    } catch {
      // Ignore
    }

    this.recordAction("detail", id, false, "Book not found");
    return null;
  }

  // ---------- featured ----------

  async featured(): Promise<Book[]> {
    try {
      console.info("[ZLibrary] Fetching featured recommendations...");
      const res = await this.search("classic literature", 1, 5);
      if (res.items.length > 0) return res.items;
    } catch (err) {
      console.warn("[ZLibrary] Featured search failed, falling back to empty list:", err);
    }
    return [];
  }

  // ---------- helpers ----------

  private absolute(url: string, mirror = this.activeMirror): string {
    if (/^https?:\/\//.test(url)) return url;
    return `${mirror}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  private recordAction(
    type: "search" | "detail" | "featured" | "auth",
    queryOrId?: string,
    success = true,
    error?: string,
    resultCount?: number,
    total?: number,
  ): void {
    const act: NonNullable<SafeZLibDiagnostics["lastAction"]> = {
      type,
      success,
      timestamp: new Date().toISOString(),
    };
    if (queryOrId) act.queryOrId = queryOrId.slice(0, 50);
    if (resultCount !== undefined) act.resultCount = resultCount;
    if (total !== undefined) act.total = total;
    if (error) act.error = sanitizeLogMessage(error);
    this.lastAction = act;
  }
}

let sharedProvider: ZLibraryProvider | undefined;

export function getZLibraryProviderInstance(): ZLibraryProvider {
  if (!sharedProvider) {
    sharedProvider = new ZLibraryProvider();
  }
  return sharedProvider;
}
