export interface BookSource {
  /** Button label, e.g. "EPUB", "Read online", "Open Library" */
  label: string;
  url: string;
}

export interface Book {
  /** Keep short: it is embedded in inline-button callback_data (64-byte limit). */
  id: string;
  title: string;
  authors: string[];
  year?: number;
  language?: string;
  /** e.g. "EPUB", "PDF", "MOBI" */
  format?: string;
  fileSizeBytes?: number;
  description?: string;
  coverUrl?: string;
  sources: BookSource[];
}

export interface SearchResult {
  items: Book[];
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BookProvider {
  readonly name: string;
  search(query: string, page: number, pageSize: number): Promise<SearchResult>;
  getById(id: string): Promise<Book | null>;
  /** Optional: books to show under the "Featured" button. */
  featured?(): Promise<Book[]>;
}
