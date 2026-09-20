import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/webhook")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(JSON.stringify({ ok: true, status: "webhook active" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
      POST: async ({ request }) => {
        const secret = process.env['TELEGRAM_WEBHOOK_SECRET'];
        if (secret) {
          const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");
          if (headerSecret !== secret) {
            return new Response("Unauthorized", { status: 401 });
          }
        }
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
