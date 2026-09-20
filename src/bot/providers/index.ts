import { MockBookProvider } from "./mock";
import type { BookProvider } from "./types";
import { ZLibraryProvider } from "./zlibrary";

export type { Book, BookProvider, BookSource, SearchResult } from "./types";

let cached: BookProvider | undefined;

/** Real Z-Library is used automatically once credentials or tokens are configured. */
export function defaultProviderName(): string {
  const explicit = process.env["BOOK_PROVIDER"];
  if (explicit) return explicit;
  const hasCreds = Boolean(process.env["ZLIBRARY_EMAIL"] && process.env["ZLIBRARY_PASSWORD"]);
  const hasTokens = Boolean(
    process.env["ZLIBRARY_COOKIE"] ||
    (process.env["ZLIBRARY_REMIX_USERKEY"] &&
      (process.env["ZLIBRARY_REMIX_USERID"] || process.env["ZLIBRARY_USERID"])),
  );
  return hasCreds || hasTokens ? "zlibrary" : "mock";
}

export function getBookProvider(name = defaultProviderName()): BookProvider {
  if (cached && cached.name === name) return cached;

  switch (name) {
    case "mock":
      cached = new MockBookProvider();
      break;
    case "zlibrary":
      cached = new ZLibraryProvider();
      break;
    default:
      throw new Error(`Unknown BOOK_PROVIDER "${name}". Use "mock" or "zlibrary".`);
  }
  return cached;
}
