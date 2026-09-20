import { defaultProviderName } from "./providers";

export interface BotConfig {
  botToken: string;
  webhookSecret: string;
  providerName: string;
  pageSize: number;
}

export function getConfig(): BotConfig {
  const botToken = process.env["TELEGRAM_BOT_TOKEN"];
  if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN is not set");

  // Webhook secret is optional; Telegram only sends it if configured during setWebhook.
  const webhookSecret = process.env["TELEGRAM_WEBHOOK_SECRET"] ?? "";

  const pageSizeRaw = Number(process.env["PAGE_SIZE"] ?? 5);
  const pageSize = Number.isFinite(pageSizeRaw) ? Math.min(10, Math.max(1, pageSizeRaw)) : 5;

  return {
    botToken,
    webhookSecret,
    providerName: process.env["BOOK_PROVIDER"] ?? defaultProviderName(),
    pageSize,
  };
}
