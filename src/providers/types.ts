export interface Book {
  id: string;
  title: string;
  author: string;
  year?: string | number | undefined;
  format?: string | undefined;
  size?: string | undefined;
  description?: string | undefined;
  coverUrl?: string | undefined;
  downloadUrl?: string | undefined;
  sourceUrl?: string | undefined;
}

export interface BookSearchParams {
  query: string;
  page?: number | undefined;
  limit?: number | undefined;
}

export interface BookSearchResult {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
}

export interface BookProvider {
  name: string;
  search(params: BookSearchParams): Promise<BookSearchResult>;
  getBookDetails(id: string): Promise<Book | null>;
  getFeatured(): Promise<Book[]>;
}
