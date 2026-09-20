import { parseCallback } from "./callbacks";
import type { BotConfig } from "./config";
import { bookText, helpText, noResultsText, promptText, resultsText, welcomeText } from "./format";
import {
  backHomeKeyboard,
  bookKeyboard,
  featuredKeyboard,
  homeKeyboard,
  resultsKeyboard,
} from "./keyboards";
import type { BookProvider } from "./providers/types";
import type {
  InlineKeyboardMarkup,
  TelegramCallbackQuery,
  TelegramClient,
  TelegramMessage,
  TelegramUpdate,
} from "./telegram";

export interface BotContext {
  tg: TelegramClient;
  provider: BookProvider;
  config: BotConfig;
}

const MAX_QUERY_LEN = 100;

export async function handleUpdate(ctx: BotContext, update: TelegramUpdate): Promise<void> {
  if (update.callback_query) return handleCallback(ctx, update.callback_query);
  const message = update.message ?? update.edited_message;
  if (message?.text) return handleText(ctx, message);
}

// ---------- messages ----------

async function handleText(ctx: BotContext, msg: TelegramMessage) {
  const chatId = msg.chat.id;
  const text = msg.text!.trim();
  const firstName = msg.from?.first_name ?? "there";

  if (text.startsWith("/start")) {
    await ctx.tg.sendMessage(chatId, welcomeText(firstName), homeKeyboard());
    return;
  }
  if (text.startsWith("/help")) {
    await ctx.tg.sendMessage(chatId, helpText(), backHomeKeyboard());
    return;
  }
  if (text.startsWith("/search")) {
    const q = text.replace(/^\/search(@\w+)?/, "").trim();
    if (!q) {
      await ctx.tg.sendMessage(chatId, promptText(), backHomeKeyboard());
      return;
    }
    await sendSearch(ctx, chatId, q, 1);
    return;
  }
  if (text.startsWith("/")) {
    await ctx.tg.sendMessage(chatId, "Unknown command. Try /help.", backHomeKeyboard());
    return;
  }

  await sendSearch(ctx, chatId, text, 1);
}

// ---------- callbacks ----------

async function handleCallback(ctx: BotContext, cq: TelegramCallbackQuery) {
  const action = parseCallback(cq.data);
  const msg = cq.message;
  if (!action || !msg) {
    await ctx.tg.answerCallbackQuery(cq.id);
    return;
  }
  const chatId = msg.chat.id;
  // Photo messages (book cards) can't be edited into text — replace them instead.
  const isPhoto = Array.isArray(msg.photo) && msg.photo.length > 0;

  const show = async (text: string, keyboard: InlineKeyboardMarkup) => {
    if (isPhoto) {
      await ctx.tg.deleteMessage(chatId, msg.message_id);
      await ctx.tg.sendMessage(chatId, text, keyboard);
    } else {
      await ctx.tg.editMessageText(chatId, msg.message_id, text, keyboard).catch(async (err) => {
        // "message is not modified" is harmless; anything else -> send fresh.
        if (!String(err).includes("not modified")) await ctx.tg.sendMessage(chatId, text, keyboard);
      });
    }
  };

  try {
    switch (action.kind) {
      case "noop":
        break;
      case "home":
        await show(welcomeText(cq.from.first_name), homeKeyboard());
        break;
      case "help":
        await show(helpText(), backHomeKeyboard());
        break;
      case "prompt":
        await show(promptText(), backHomeKeyboard());
        break;
      case "featured": {
        const books = ctx.provider.featured ? await ctx.provider.featured() : [];
        if (!books.length) {
          await show("No featured books right now.", backHomeKeyboard());
        } else {
          await show(
            "⭐ <b>Featured books</b>\n\nPick one to see details.",
            featuredKeyboard(books),
          );
        }
        break;
      }
      case "search": {
        const result = await ctx.provider.search(action.query, action.page, ctx.config.pageSize);
        if (!result.items.length) {
          await show(noResultsText(action.query), backHomeKeyboard());
        } else {
          await show(resultsText(action.query, result), resultsKeyboard(action.query, result));
        }
        break;
      }
      case "book": {
        const book = await ctx.provider.getById(action.id);
        if (!book) {
          await ctx.tg.answerCallbackQuery(cq.id, "This book is no longer available.");
          return;
        }
        await ctx.tg.sendChatAction(chatId, "upload_photo");
        const keyboard = bookKeyboard(book, action.query, action.page);
        // Keep the results list in place; the card is a new message the user can dismiss with Back.
        if (isPhoto) await ctx.tg.deleteMessage(chatId, msg.message_id);
        await sendBookCard(ctx, chatId, book, keyboard);
        break;
      }
    }
    await ctx.tg.answerCallbackQuery(cq.id);
  } catch (err) {
    console.error("callback failed", err);
    await ctx.tg.answerCallbackQuery(cq.id, "Something went wrong. Please try again.");
  }
}

// ---------- shared ----------

async function sendSearch(ctx: BotContext, chatId: number, rawQuery: string, page: number) {
  const query = rawQuery.slice(0, MAX_QUERY_LEN);
  await ctx.tg.sendChatAction(chatId, "typing");
  try {
    const result = await ctx.provider.search(query, page, ctx.config.pageSize);
    if (!result.items.length) {
      await ctx.tg.sendMessage(chatId, noResultsText(query), backHomeKeyboard());
      return;
    }
    await ctx.tg.sendMessage(chatId, resultsText(query, result), resultsKeyboard(query, result));
  } catch (err) {
    console.error("search failed", err);
    await ctx.tg.sendMessage(
      chatId,
      "⚠️ The book service is unavailable right now. Please try again in a moment.",
      backHomeKeyboard(),
    );
  }
}

async function sendBookCard(
  ctx: BotContext,
  chatId: number,
  book: Parameters<typeof bookText>[0],
  keyboard: InlineKeyboardMarkup,
) {
  if (book.coverUrl) {
    try {
      await ctx.tg.sendPhoto(chatId, book.coverUrl, bookText(book, 1024), keyboard);
      return;
    } catch (err) {
      console.warn("sendPhoto failed, falling back to text", err);
    }
  }
  await ctx.tg.sendMessage(chatId, bookText(book, 4096), keyboard);
}
