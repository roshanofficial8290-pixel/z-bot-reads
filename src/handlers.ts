import { getBookProvider } from "./providers";
import type { Book } from "./providers/types";

export interface TelegramUser {
  id: number;
  first_name?: string;
  username?: string;
}

export interface TelegramChat {
  id: number;
  type?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  text?: string;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export interface InlineKeyboardButton {
  text: string;
  callback_data?: string;
  url?: string;
}

export interface SendMessagePayload {
  chat_id: number;
  text: string;
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2";
  reply_markup?: {
    inline_keyboard?: InlineKeyboardButton[][];
  };
}

export interface EditMessageTextPayload {
  chat_id: number;
  message_id: number;
  text: string;
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2";
  reply_markup?: {
    inline_keyboard?: InlineKeyboardButton[][];
  };
}

function escapeHtml(text: string): string {
  return (text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendTelegramRequest(
  method: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; description?: string; result?: unknown }> {
  const token = process.env["TELEGRAM_BOT_TOKEN"];
  if (!token) {
    console.warn(`[Telegram Bot] TELEGRAM_BOT_TOKEN is missing. Cannot call ${method}`);
    return { ok: false, description: "TELEGRAM_BOT_TOKEN is not configured" };
  }

  const url = `https://api.telegram.org/bot${token}/${method}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as { ok: boolean; description?: string; result?: unknown };
    if (!res.ok || !data.ok) {
      console.error(
        `[Telegram API error] ${method} returned ${res.status}:`,
        data.description || data,
      );
    }
    return data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Telegram API network failure] ${method}: ${msg}`);
    return { ok: false, description: msg };
  }
}

export async function answerCallback(callbackId: string, text?: string): Promise<void> {
  await sendTelegramRequest("answerCallbackQuery", {
    callback_query_id: callbackId,
    text,
  });
}

export async function handleTelegramUpdate(update: TelegramUpdate): Promise<void> {
  const provider = getBookProvider();

  // 1. Handle Callback Queries (inline button clicks)
  if (update.callback_query) {
    const cb = update.callback_query;
    const data = cb.data || "";
    const chatId = cb.message?.chat.id;
    const messageId = cb.message?.message_id;

    await answerCallback(cb.id);

    if (!chatId || !messageId) {
      return;
    }

    if (data === "cmd:start") {
      const welcome = renderWelcomeMessage(cb.from.first_name);
      await sendTelegramRequest("editMessageText", {
        chat_id: chatId,
        message_id: messageId,
        text: welcome.text,
        parse_mode: "HTML",
        reply_markup: welcome.reply_markup,
      });
      return;
    }

    if (data === "cmd:help") {
      const help = renderHelpMessage();
      await sendTelegramRequest("editMessageText", {
        chat_id: chatId,
        message_id: messageId,
        text: help.text,
        parse_mode: "HTML",
        reply_markup: help.reply_markup,
      });
      return;
    }

    if (data === "cmd:featured") {
      const featured = await provider.getFeatured();
      const payload = renderFeaturedList(featured);
      await sendTelegramRequest("editMessageText", {
        chat_id: chatId,
        message_id: messageId,
        text: payload.text,
        parse_mode: "HTML",
        reply_markup: payload.reply_markup,
      });
      return;
    }

    if (data === "cmd:search_prompt") {
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: "🔍 <b>Search Books</b>\n\nPlease reply with the book title, author, or keyword you wish to search for:",
        parse_mode: "HTML",
      });
      return;
    }

    if (data.startsWith("page:")) {
      // format: page:encodedQuery:pageNum
      const parts = data.split(":");
      const encodedQuery = parts[1] || "";
      const pageNum = parseInt(parts[2] || "1", 10) || 1;
      const query = decodeURIComponent(encodedQuery);

      const searchResult = await provider.search({ query, page: pageNum, limit: 5 });
      const payload = renderSearchResults(query, searchResult);
      await sendTelegramRequest("editMessageText", {
        chat_id: chatId,
        message_id: messageId,
        text: payload.text,
        parse_mode: "HTML",
        reply_markup: payload.reply_markup,
      });
      return;
    }

    if (data.startsWith("book:")) {
      const bookId = data.slice(5);
      const book = await provider.getBookDetails(bookId);
      if (!book) {
        await sendTelegramRequest("sendMessage", {
          chat_id: chatId,
          text: "⚠️ Sorry, could not find details for this book.",
        });
        return;
      }
      const details = renderBookDetails(book);
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: details.text,
        parse_mode: "HTML",
        reply_markup: details.reply_markup,
      });
      return;
    }

    return;
  }

  // 2. Handle standard Messages
  if (update.message) {
    const msg = update.message;
    const text = (msg.text || "").trim();
    if (!text) {
      return;
    }
    const chatId = msg.chat.id;

    if (text === "/start" || text.toLowerCase() === "start") {
      const welcome = renderWelcomeMessage(msg.from?.first_name);
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: welcome.text,
        parse_mode: "HTML",
        reply_markup: welcome.reply_markup,
      });
      return;
    }

    if (text === "/help" || text.toLowerCase() === "help") {
      const help = renderHelpMessage();
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: help.text,
        parse_mode: "HTML",
        reply_markup: help.reply_markup,
      });
      return;
    }

    if (text === "/featured") {
      const featured = await provider.getFeatured();
      const payload = renderFeaturedList(featured);
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: payload.text,
        parse_mode: "HTML",
        reply_markup: payload.reply_markup,
      });
      return;
    }

    // Book Search (either `/search query` or plain text)
    let searchQuery = text;
    if (text.startsWith("/search")) {
      searchQuery = text.replace(/^\/search\s*/, "").trim();
    }

    if (!searchQuery) {
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: "💡 Please provide a search term. For example: <code>/search Dune</code> or simply send <code>Atomic Habits</code>.",
        parse_mode: "HTML",
      });
      return;
    }

    const searchResult = await provider.search({ query: searchQuery, page: 1, limit: 5 });
    const payload = renderSearchResults(searchQuery, searchResult);
    await sendTelegramRequest("sendMessage", {
      chat_id: chatId,
      text: payload.text,
      parse_mode: "HTML",
      reply_markup: payload.reply_markup,
    });
    return;
  }
}

function renderWelcomeMessage(name?: string) {
  const greeting = name ? `Hello, <b>${escapeHtml(name)}</b>!` : "Hello!";
  return {
    text: `📚 <b>Welcome to Z-Bot Reads!</b>\n\n${greeting}\nSearch millions of books, view formats, file sizes, and download/source links right inside Telegram.\n\n• Type any title or author to search.\n• Or use the buttons below to begin:`,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🔍 Search Books", callback_data: "cmd:search_prompt" },
          { text: "🌟 Featured Books", callback_data: "cmd:featured" },
        ],
        [{ text: "ℹ️ Help & Guide", callback_data: "cmd:help" }],
      ],
    },
  };
}

function renderHelpMessage() {
  return {
    text: `📖 <b>How to use Z-Bot Reads</b>\n\n1️⃣ <b>Search</b>: Simply send any book name, author, or topic (e.g. <i>"Clean Code"</i> or <i>"Dune"</i>).\n2️⃣ <b>Browse</b>: Use the ⬅️ Previous and Next ➡️ buttons to navigate pages.\n3️⃣ <b>Details</b>: Tap on any book title button to view file formats, sizes, synopsis, and direct source links.\n\nCommands:\n• /search &lt;query&gt; - Search for titles\n• /featured - Browse popular selections\n• /help - Display this guide`,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🔍 Start Searching", callback_data: "cmd:search_prompt" },
          { text: "🌟 Featured", callback_data: "cmd:featured" },
        ],
        [{ text: "🏠 Main Menu", callback_data: "cmd:start" }],
      ],
    },
  };
}

function renderFeaturedList(books: Book[]) {
  let text = `🌟 <b>Featured & Recommended Books</b>\n\n`;
  const keyboard: InlineKeyboardButton[][] = [];

  books.forEach((book, idx) => {
    const num = idx + 1;
    text += `<b>${num}. ${escapeHtml(book.title)}</b>\n`;
    text += `   👤 ${escapeHtml(book.author)} (${book.year || "N/A"})\n`;
    text += `   📁 ${escapeHtml(book.format || "PDF")} · ${escapeHtml(book.size || "")}\n\n`;

    keyboard.push([
      {
        text: `📖 ${num}. ${book.title.slice(0, 30)}${book.title.length > 30 ? "..." : ""}`,
        callback_data: `book:${book.id}`,
      },
    ]);
  });

  keyboard.push([
    { text: "🔍 Search More", callback_data: "cmd:search_prompt" },
    { text: "🏠 Main Menu", callback_data: "cmd:start" },
  ]);

  return { text, reply_markup: { inline_keyboard: keyboard } };
}

function renderSearchResults(
  query: string,
  result: { books: Book[]; total: number; page: number; totalPages: number },
) {
  if (result.books.length === 0) {
    return {
      text: `🔍 <b>Search Results:</b> "${escapeHtml(query)}"\n\nNo books were found matching your query. Try searching for a different title or author name.`,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🔍 Try Another Search", callback_data: "cmd:search_prompt" },
            { text: "🌟 Featured Books", callback_data: "cmd:featured" },
          ],
        ],
      },
    };
  }

  let text = `📚 <b>Results for:</b> "<i>${escapeHtml(query)}</i>"\n`;
  text += `📄 Page <b>${result.page}</b> of <b>${result.totalPages}</b> (Total: ${result.total})\n\n`;

  const keyboard: InlineKeyboardButton[][] = [];

  result.books.forEach((book, idx) => {
    const num = (result.page - 1) * 5 + idx + 1;
    text += `<b>${num}. ${escapeHtml(book.title)}</b>\n`;
    text += `   👤 ${escapeHtml(book.author)} (${book.year || "N/A"})\n`;
    text += `   📁 ${escapeHtml(book.format || "PDF")} · 💾 ${escapeHtml(book.size || "N/A")}\n\n`;

    keyboard.push([
      {
        text: `📖 ${num}. ${book.title.slice(0, 30)}${book.title.length > 30 ? "..." : ""}`,
        callback_data: `book:${book.id}`,
      },
    ]);
  });

  // Pagination navigation row
  const navRow: InlineKeyboardButton[] = [];
  const encQuery = encodeURIComponent(query);

  if (result.page > 1) {
    navRow.push({
      text: "⬅️ Prev",
      callback_data: `page:${encQuery}:${result.page - 1}`,
    });
  }

  navRow.push({
    text: `• ${result.page}/${result.totalPages} •`,
    callback_data: "noop",
  });

  if (result.page < result.totalPages) {
    navRow.push({
      text: "Next ➡️",
      callback_data: `page:${encQuery}:${result.page + 1}`,
    });
  }

  keyboard.push(navRow);
  keyboard.push([
    { text: "🔍 New Search", callback_data: "cmd:search_prompt" },
    { text: "🏠 Main Menu", callback_data: "cmd:start" },
  ]);

  return { text, reply_markup: { inline_keyboard: keyboard } };
}

function renderBookDetails(book: Book) {
  let text = `📖 <b>${escapeHtml(book.title)}</b>\n\n`;
  text += `👤 <b>Author:</b> ${escapeHtml(book.author)}\n`;
  text += `📅 <b>Year:</b> ${escapeHtml(String(book.year || "N/A"))}\n`;
  text += `📁 <b>Format:</b> ${escapeHtml(book.format || "PDF")}\n`;
  text += `💾 <b>Size:</b> ${escapeHtml(book.size || "N/A")}\n\n`;

  if (book.description) {
    text += `📝 <b>Description:</b>\n<i>${escapeHtml(book.description)}</i>\n\n`;
  }

  const keyboard: InlineKeyboardButton[][] = [];

  if (book.sourceUrl) {
    keyboard.push([
      {
        text: "🔗 Open Source / Download Page",
        url: book.sourceUrl,
      },
    ]);
  }

  keyboard.push([
    { text: "🔍 Search Again", callback_data: "cmd:search_prompt" },
    { text: "🏠 Main Menu", callback_data: "cmd:start" },
  ]);

  return { text, reply_markup: { inline_keyboard: keyboard } };
}
