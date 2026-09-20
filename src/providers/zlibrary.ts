import { getZLibraryProviderInstance } from "../bot/providers/zlibrary";
import { mockProvider } from "./mock";
import type { Book, BookProvider, BookSearchParams, BookSearchResult } from "./types";

export class ZLibraryBookProvider implements BookProvider {
  public readonly name = "ZLibraryBookProvider";

  public hasCredentials(): boolean {
    const email = process.env["ZLIBRARY_EMAIL"]?.trim();
    const password = process.env["ZLIBRARY_PASSWORD"]?.trim();
    const direct = Boolean(
      process.env["ZLIBRARY_COOKIE"] ||
      (process.env["ZLIBRARY_REMIX_USERKEY"] &&
        (process.env["ZLIBRARY_REMIX_USERID"] || process.env["ZLIBRARY_USERID"])),
    );
    return Boolean((email && password) || direct);
  }

  async search(params: BookSearchParams): Promise<BookSearchResult> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 5);

    try {
      const botProvider = getZLibraryProviderInstance();
      const res = await botProvider.search(params.query, page, limit);

      if (res.items.length === 0 && !this.hasCredentials()) {
        // If unconfigured and no results, provide mock fallback for preview
        return mockProvider.search(params);
      }

      const books: Book[] = res.items.map((b) => ({
        id: b.id,
        title: b.title,
        author: b.authors.join(", "),
        year: b.year,
        format: b.format,
        size: b.fileSizeBytes ? `${Math.round(b.fileSizeBytes / 1024)} KB` : undefined,
        description: b.description,
        coverUrl: b.coverUrl,
        downloadUrl: b.sources.find((s) => s.label.includes("Download"))?.url,
        sourceUrl: b.sources.find((s) => s.label.includes("Z-Library"))?.url,
      }));

      const totalPages = Math.max(1, Math.ceil(res.total / limit));

      return {
        books,
        total: res.total,
        page,
        totalPages,
      };
    } catch (err) {
      console.warn("[ZLibrary] Search failed, falling back to mock provider:", err);
      return mockProvider.search(params);
    }
  }

  async getBookDetails(id: string): Promise<Book | null> {
    try {
      const botProvider = getZLibraryProviderInstance();
      const b = await botProvider.getById(id);
      if (!b) return mockProvider.getBookDetails(id);

      return {
        id: b.id,
        title: b.title,
        author: b.authors.join(", "),
        year: b.year,
        format: b.format,
        size: b.fileSizeBytes ? `${Math.round(b.fileSizeBytes / 1024)} KB` : undefined,
        description: b.description,
        coverUrl: b.coverUrl,
        downloadUrl: b.sources.find((s) => s.label.includes("Download"))?.url,
        sourceUrl: b.sources.find((s) => s.label.includes("Z-Library"))?.url,
      };
    } catch {
      return mockProvider.getBookDetails(id);
    }
  }

  async getFeatured(): Promise<Book[]> {
    try {
      const botProvider = getZLibraryProviderInstance();
      const list = await botProvider.featured();
      if (list.length === 0) return mockProvider.getFeatured();

      return list.map((b) => ({
        id: b.id,
        title: b.title,
        author: b.authors.join(", "),
        year: b.year,
        format: b.format,
        size: b.fileSizeBytes ? `${Math.round(b.fileSizeBytes / 1024)} KB` : undefined,
        description: b.description,
        coverUrl: b.coverUrl,
        downloadUrl: b.sources.find((s) => s.label.includes("Download"))?.url,
        sourceUrl: b.sources.find((s) => s.label.includes("Z-Library"))?.url,
      }));
    } catch {
      return mockProvider.getFeatured();
    }
  }
}

export const zlibraryProvider = new ZLibraryBookProvider();
