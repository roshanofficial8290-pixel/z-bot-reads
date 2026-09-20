import { createFileRoute } from "@tanstack/react-router";

import { getConfig } from "../../bot/config";
import { handleUpdate } from "../../bot/handlers";
import { defaultProviderName, getBookProvider } from "../../bot/providers";
import { getZLibraryProviderInstance } from "../../bot/providers/zlibrary";
import { TelegramClient, type TelegramUpdate } from "../../bot/telegram";

/** Constant-time string compare (no node:crypto dependency). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const Route = createFileRoute("/api/webhook")({
  server: {
    handlers: {
      GET: async () => {
        // Secret values are NEVER returned — only sanitized status, presence flags, and endpoint connectivity.
        const providerName = process.env["BOOK_PROVIDER"] ?? defaultProviderName();
        const zlibDiagnostics =
          providerName === "zlibrary" ? getZLibraryProviderInstance().getDiagnostics() : undefined;

        return Response.json({
          ok: true,
          status: "webhook active",
          botTokenConfigured: Boolean(process.env["TELEGRAM_BOT_TOKEN"]),
          webhookSecretConfigured: Boolean(process.env["TELEGRAM_WEBHOOK_SECRET"]),
          provider: providerName,
          diagnostics: zlibDiagnostics,
        });
      },
      POST: async ({ request }) => {
        const secret = process.env["TELEGRAM_WEBHOOK_SECRET"];
        if (secret) {
          const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");
          if (!headerSecret || !safeEqual(headerSecret, secret)) {
            console.error("[telegram] rejected update: bad or missing secret token");
            return new Response("Unauthorized", { status: 401 });
          }
        }

        let update: TelegramUpdate | undefined;
        try {
          update = (await request.json()) as TelegramUpdate;
        } catch (err) {
          console.error("[telegram] invalid JSON body", err);
          return Response.json({ ok: true, ignored: true });
        }

        if (!update || typeof update.update_id !== "number") {
          return Response.json({ ok: true, ignored: true });
        }

        try {
          const config = getConfig();
          console.info(
            `[telegram] update ${update.update_id}`,
            update.message?.text ? `text=${update.message.text.slice(0, 40)}` : "",
            update.callback_query ? `callback=${update.callback_query.data}` : "",
          );
          // Finish all work before responding — the function may freeze afterwards.
          await handleUpdate(
            {
              tg: new TelegramClient(config.botToken),
              provider: getBookProvider(config.providerName),
              config,
            },
            update,
          );
          console.info(`[telegram] update ${update.update_id} handled`);
        } catch (err) {
          // Always 200 so Telegram doesn't retry a poison update forever.
          console.error(
            `[telegram] update ${update.update_id} failed:`,
            err instanceof Error ? `${err.message}\n${err.stack ?? ""}` : String(err),
          );
        }

        return Response.json({ ok: true });
      },
    },
  },
});
