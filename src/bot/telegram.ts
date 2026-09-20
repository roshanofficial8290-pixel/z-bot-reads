// Minimal Telegram Bot API client. No SDK, just fetch.

export interface InlineKeyboardButton {
  text: string;
  callback_data?: string;
  url?: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

export interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
}

export interface TelegramMessage {
  message_id: number;
  chat: { id: number; type: string };
  from?: TelegramUser;
  text?: string;
  photo?: unknown[];
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
  edited_message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export class TelegramApiError extends Error {
  constructor(
    public readonly method: string,
    public readonly status: number,
    public readonly body: string,
  ) {
    super(`Telegram ${method} failed [${status}]: ${body}`);
  }
}

export class TelegramClient {
  private readonly base: string;

  constructor(token: string) {
    this.base = `https://api.telegram.org/bot${token}`;
  }

  async call<T = unknown>(method: string, payload: Record<string, unknown>): Promise<T> {
    const res = await fetch(`${this.base}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (!res.ok) throw new TelegramApiError(method, res.status, text);
    const json = JSON.parse(text) as { ok: boolean; result: T; description?: string };
    if (!json.ok) throw new TelegramApiError(method, res.status, json.description ?? text);
    return json.result;
  }

  sendMessage(chatId: number, text: string, replyMarkup?: InlineKeyboardMarkup) {
    return this.call<TelegramMessage>("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: replyMarkup,
    });
  }

  editMessageText(
    chatId: number,
    messageId: number,
    text: string,
    replyMarkup?: InlineKeyboardMarkup,
  ) {
    return this.call("editMessageText", {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: replyMarkup,
    });
  }

  sendPhoto(chatId: number, photo: string, caption: string, replyMarkup?: InlineKeyboardMarkup) {
    return this.call<TelegramMessage>("sendPhoto", {
      chat_id: chatId,
      photo,
      caption,
      parse_mode: "HTML",
      reply_markup: replyMarkup,
    });
  }

  deleteMessage(chatId: number, messageId: number) {
    return this.call("deleteMessage", { chat_id: chatId, message_id: messageId }).catch(
      () => undefined,
    );
  }

  answerCallbackQuery(id: string, text?: string) {
    return this.call("answerCallbackQuery", { callback_query_id: id, text }).catch(() => undefined);
  }

  sendChatAction(chatId: number, action: "typing" | "upload_photo") {
    return this.call("sendChatAction", { chat_id: chatId, action }).catch(() => undefined);
  }
}
