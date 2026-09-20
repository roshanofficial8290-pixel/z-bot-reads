import type { Book, BookProvider, SearchResult } from "./types";

/**
 * Placeholder for the real backend. Kept so BOOK_PROVIDER=zlibrary fails loudly
 * instead of silently falling back to mock data.
 */
export class ZLibraryProvider implements BookProvider {
  readonly name = "zlibrary";

  async search(_query: string, _page: number, _pageSize: number): Promise<SearchResult> {
    throw new Error("ZLibraryProvider.search is not implemented yet");
  }

  async getById(_id: string): Promise<Book | null> {
    throw new Error("ZLibraryProvider.getById is not implemented yet");
  }
}
