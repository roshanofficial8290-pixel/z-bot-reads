import { cb } from "./callbacks";
import type { Book, SearchResult } from "./providers/types";
import type { InlineKeyboardButton, InlineKeyboardMarkup } from "./telegram";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function homeKeyboard(): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: "🔍 Search books", callback_data: cb.prompt() }],
      [
        { text: "⭐ Featured", callback_data: cb.featured() },
        { text: "ℹ️ Help", callback_data: cb.help() },
      ],
    ],
  };
}

export function backHomeKeyboard(): InlineKeyboardMarkup {
  return { inline_keyboard: [[{ text: "🏠 Home", callback_data: cb.home() }]] };
}

export function resultsKeyboard(query: string, result: SearchResult): InlineKeyboardMarkup {
  const offset = (result.page - 1) * result.pageSize;
  const numberButtons: InlineKeyboardButton[] = result.items.map((book, i) => ({
    text: String(offset + i + 1),
    callback_data: cb.book(book.id, query, result.page),
  }));

  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const nav: InlineKeyboardButton[] = [
    result.hasPrev
      ? { text: "◀️ Prev", callback_data: cb.search(query, result.page - 1) }
      : { text: " ", callback_data: cb.noop() },
    { text: `${result.page} / ${totalPages}`, callback_data: cb.noop() },
    result.hasNext
      ? { text: "Next ▶️", callback_data: cb.search(query, result.page + 1) }
      : { text: " ", callback_data: cb.noop() },
  ];

  return {
    inline_keyboard: [
      ...chunk(numberButtons, 5),
      nav,
      [
        { text: "🔍 New search", callback_data: cb.prompt() },
        { text: "🏠 Home", callback_data: cb.home() },
      ],
    ],
  };
}

export function featuredKeyboard(books: Book[]): InlineKeyboardMarkup {
  const rows = books.map((b) => [
    { text: `📖 ${b.title}`.slice(0, 60), callback_data: cb.book(b.id, "", 0) },
  ]);
  return { inline_keyboard: [...rows, [{ text: "🏠 Home", callback_data: cb.home() }]] };
}

export function bookKeyboard(book: Book, query: string, page: number): InlineKeyboardMarkup {
  const sourceRows = chunk(
    book.sources.map((s) => ({ text: s.label, url: s.url })),
    2,
  );
  const back: InlineKeyboardButton[] =
    page > 0 && query
      ? [
          { text: "◀️ Back to results", callback_data: cb.search(query, page) },
          { text: "🏠 Home", callback_data: cb.home() },
        ]
      : [
          { text: "⭐ Featured", callback_data: cb.featured() },
          { text: "🏠 Home", callback_data: cb.home() },
        ];
  return { inline_keyboard: [...sourceRows, back] };
}
