import type { Book, BookProvider, BookSearchParams, BookSearchResult } from "./types";
import { mockProvider } from "./mock";

interface ZLibBookItem {
  id?: number | string;
  hash?: string;
  title?: string;
  author?: string;
  year?: string | number;
  extension?: string;
  filesizeString?: string;
  filesize?: number;
  description?: string;
  cover?: string;
}

interface ZLibSearchResponse {
  success?: boolean;
  books?: ZLibBookItem[];
  bookCount?: number;
  error?: string;
}

export class ZLibraryBookProvider implements BookProvider {
  public readonly name = "ZLibraryBookProvider";
  private authToken: string | null = null;
  private tokenExpiry = 0;
  private readonly baseUrl = "https://singlelogin.re";

  private getCredentials(): { email: string | undefined; password: string | undefined } {
    return {
      email: process.env["ZLIBRARY_EMAIL"]?.trim(),
      password: process.env["ZLIBRARY_PASSWORD"]?.trim(),
    };
  }

  public hasCredentials(): boolean {
    const { email, password } = this.getCredentials();
    return Boolean(email && password);
  }

  private async authenticate(): Promise<string | null> {
    const { email, password } = this.getCredentials();
    if (!email || !password) {
      console.warn("[ZLibrary] ZLIBRARY_EMAIL or ZLIBRARY_PASSWORD not configured. Using fallback.");
      return null;
    }

    if (this.authToken && Date.now() < this.tokenExpiry) {
      return this.authToken;
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Z-Bot-Reads/1.0",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        console.warn(`[ZLibrary] Authentication failed with status ${res.status}`);
        return null;
      }

      const data = (await res.json()) as { user?: { remix_userkey?: string }; token?: string; error?: string };
      const token = data.user?.remix_userkey || data.token;
      if (token) {
        this.authToken = token;
        // Cache token for 6 hours
        this.tokenExpiry = Date.now() + 6 * 60 * 60 * 1000;
        return token;
      }

      console.warn("[ZLibrary] Login response missing token:", data.error || "unknown response format");
      return null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[ZLibrary] Login network error: ${msg}. Falling back to mock provider.`);
      return null;
    }
  }

  async search(params: BookSearchParams): Promise<BookSearchResult> {
    const { email, password } = this.getCredentials();
    if (!email || !password) {
      return mockProvider.search(params);
    }

    const token = await this.authenticate();
    if (!token) {
      return mockProvider.search(params);
    }

    try {
      const page = Math.max(1, params.page || 1);
      const limit = Math.max(1, params.limit || 5);
      const query = encodeURIComponent(params.query || "");

      const url = `${this.baseUrl}/api/v1/book/search?message=${query}&page=${page}&limit=${limit}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Z-Bot-Reads/1.0",
          Cookie: `remix_userkey=${token}`,
        },
      });

      if (!res.ok) {
        console.warn(`[ZLibrary] Search failed with HTTP ${res.status}. Falling back to mock provider.`);
        return mockProvider.search(params);
      }

      const data = (await res.json()) as ZLibSearchResponse;
      if (!data.books || !Array.isArray(data.books) || data.books.length === 0) {
        // If real provider returned 0 results, check if mock has anything or return empty
        const mockResult = await mockProvider.search(params);
        if (mockResult.books.length > 0) {
          return mockResult;
        }
        return {
          books: [],
          total: 0,
          page,
          totalPages: 1,
        };
      }

      const books: Book[] = data.books.map((item) => ({
        id: String(item.id || item.hash || Math.random().toString(36).slice(2)),
        title: item.title || "Untitled Book",
        author: item.author || "Unknown Author",
        year: item.year || "N/A",
        format: (item.extension || "PDF").toUpperCase(),
        size: item.filesizeString || (item.filesize ? `${(item.filesize / (1024 * 1024)).toFixed(1)} MB` : "N/A"),
        description: item.description?.replace(/<[^>]+>/g, "").slice(0, 350) || "No description provided.",
        coverUrl: item.cover,
        sourceUrl: item.id ? `https://z-library.sk/book/${item.id}` : undefined,
      }));

      const total = data.bookCount || books.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      return {
        books,
        total,
        page,
        totalPages,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[ZLibrary] Search exception: ${msg}. Using fallback provider.`);
      return mockProvider.search(params);
    }
  }

  async getBookDetails(id: string): Promise<Book | null> {
    // If it's a mock id, resolve with mock provider immediately
    if (id.startsWith("mock-")) {
      return mockProvider.getBookDetails(id);
    }

    const { email, password } = this.getCredentials();
    if (!email || !password) {
      return mockProvider.getBookDetails(id);
    }

    const token = await this.authenticate();
    if (!token) {
      return mockProvider.getBookDetails(id);
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/v1/book/${id}`, {
        headers: {
          "User-Agent": "Z-Bot-Reads/1.0",
          Cookie: `remix_userkey=${token}`,
        },
      });

      if (!res.ok) {
        console.warn(`[ZLibrary] Book lookup failed with status ${res.status}. Falling back to mock.`);
        return mockProvider.getBookDetails(id);
      }

      const item = (await res.json()) as ZLibBookItem;
      if (!item || !item.title) {
        return mockProvider.getBookDetails(id);
      }

      return {
        id: String(item.id || id),
        title: item.title,
        author: item.author || "Unknown Author",
        year: item.year || "N/A",
        format: (item.extension || "PDF").toUpperCase(),
        size: item.filesizeString || "N/A",
        description: item.description?.replace(/<[^>]+>/g, "") || "No description provided.",
        coverUrl: item.cover,
        sourceUrl: `https://z-library.sk/book/${item.id || id}`,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[ZLibrary] getBookDetails exception: ${msg}`);
      return mockProvider.getBookDetails(id);
    }
  }

  async getFeatured(): Promise<Book[]> {
    return mockProvider.getFeatured();
  }
}

export const zlibraryProvider = new ZLibraryBookProvider();
