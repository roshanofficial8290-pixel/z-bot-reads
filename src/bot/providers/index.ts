import { MockBookProvider } from "./mock";
import type { BookProvider } from "./types";
import { ZLibraryProvider } from "./zlibrary";

export type { Book, BookProvider, BookSource, SearchResult } from "./types";

let cached: BookProvider | undefined;

/** Real Z-Library is used automatically once credentials are configured. */
function defaultProviderName(): string {
  const explicit = process.env["BOOK_PROVIDER"];
  if (explicit) return explicit;
  return process.env["ZLIBRARY_EMAIL"] && process.env["ZLIBRARY_PASSWORD"] ? "zlibrary" : "mock";
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
