import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Telegram Book Bot — Vercel project";
const DESC =
  "A Telegram book search bot: start menu, button navigation, paginated results, book details and source links, built on a pluggable BookProvider.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const FLOW = [
  ["/start", "Welcome card with Search, Featured and Help buttons"],
  ["Search", "Type a title or author, or /search <query>"],
  ["Results", "Numbered list, Prev / Next pages, New search"],
  ["Book", "Cover, author, year, format, size, description"],
  ["Sources", "One link button per source, Back to results"],
];

const FILES = [
  ["api/webhook.ts", "Telegram webhook (secret-verified)"],
  ["src/handlers.ts", "Commands, text search, button callbacks"],
  ["src/providers/mock.ts", "MockBookProvider — works today"],
  ["src/providers/zlibrary.ts", "Stub for the real backend"],
];

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Bot project · deploy target: Vercel
        </p>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight">
          Telegram Book Bot
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The bot source lives in your Files as <code className="font-mono text-foreground">telegram-book-bot</code>.
          This page only documents the flow.
        </p>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-medium">Conversation flow</h2>
          <ol className="mt-4 divide-y divide-border rounded-md border border-border bg-card">
            {FLOW.map(([step, text], i) => (
              <li key={step} className="flex items-baseline gap-4 px-5 py-3">
                <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span className="w-24 shrink-0 font-medium">{step}</span>
                <span className="text-muted-foreground">{text}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-medium">Key files</h2>
          <ul className="mt-4 divide-y divide-border rounded-md border border-border bg-card">
            {FILES.map(([file, text]) => (
              <li key={file} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3">
                <code className="font-mono text-sm">{file}</code>
                <span className="text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-md bg-accent px-5 py-4 text-accent-foreground">
          <p className="font-medium">Next step</p>
          <p className="mt-1 text-sm">
            Deploy to Vercel, set <code className="font-mono">TELEGRAM_BOT_TOKEN</code> and{" "}
            <code className="font-mono">TELEGRAM_WEBHOOK_SECRET</code>, run{" "}
            <code className="font-mono">npm run set-webhook</code>. Swap{" "}
            <code className="font-mono">BOOK_PROVIDER</code> once the real provider is implemented.
          </p>
        </section>
      </div>
    </main>
  );
}
