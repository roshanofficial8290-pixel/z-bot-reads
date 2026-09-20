import type { Book, SearchResult } from "./providers/types";

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function formatSize(bytes?: number): string | undefined {
  if (!bytes || bytes <= 0) return undefined;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

export function welcomeText(firstName: string): string {
  return [
    `📚 <b>Hi ${esc(firstName)}!</b>`,
    "",
    "I can help you find books. Send me a title or an author name, or tap a button below.",
  ].join("\n");
}

export function helpText(): string {
  return [
    "<b>How to use this bot</b>",
    "",
    "• Just type a title or author, e.g. <code>Dracula</code>",
    "• Or use <code>/search jane austen</code>",
    "• Tap a number to open a book, then use the links to get it",
    "",
    "Commands: /start · /search · /help",
  ].join("\n");
}

export function promptText(): string {
  return "🔍 What are you looking for? Send me a <b>title</b> or <b>author</b>.";
}

export function resultsText(query: string, result: SearchResult): string {
  const offset = (result.page - 1) * result.pageSize;
  const lines = result.items.map((b, i) => {
    const meta = [b.year, b.format, formatSize(b.fileSizeBytes)].filter(Boolean).join(" · ");
    return `<b>${offset + i + 1}.</b> ${esc(b.title)}\n     <i>${esc(b.authors.join(", "))}</i>${
      meta ? ` — ${esc(meta)}` : ""
    }`;
  });
  return [
    `🔎 Results for <b>${esc(query)}</b> — ${result.total} found`,
    "",
    ...lines,
    "",
    "Tap a number to see details.",
  ].join("\n");
}

export function noResultsText(query: string): string {
  return `😕 Nothing found for <b>${esc(query)}</b>. Try a shorter title or just the author's last name.`;
}

/** Telegram caption limit is 1024 chars; message limit is 4096. */
export function bookText(book: Book, limit = 1024): string {
  const meta: string[] = [];
  if (book.year) meta.push(`📅 ${book.year}`);
  if (book.language) meta.push(`🌐 ${esc(book.language)}`);
  const file = [book.format, formatSize(book.fileSizeBytes)].filter(Boolean).join(", ");
  if (file) meta.push(`📄 ${esc(file)}`);

  const head = [
    `<b>${esc(book.title)}</b>`,
    `<i>${esc(book.authors.join(", "))}</i>`,
    meta.length ? "" : undefined,
    meta.length ? meta.join("   ") : undefined,
  ]
    .filter((l): l is string => l !== undefined)
    .join("\n");

  if (!book.description) return head;
  const room = limit - head.length - 2;
  return `${head}\n\n${esc(truncate(book.description, Math.max(0, room)))}`;
}
