import { MockBookProvider } from "./mock";
import type { BookProvider } from "./types";
import { ZLibraryProvider } from "./zlibrary";

export type { Book, BookProvider, BookSource, SearchResult } from "./types";

let cached: BookProvider | undefined;

export function getBookProvider(name = process.env['BOOK_PROVIDER'] ?? "mock"): BookProvider {
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
