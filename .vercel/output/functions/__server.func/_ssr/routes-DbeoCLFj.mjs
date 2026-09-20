import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DbeoCLFj.js
var import_jsx_runtime = require_jsx_runtime();
var FLOW = [
	["/start", "Welcome card with Search, Featured and Help buttons"],
	["Search", "Type a title or author, or /search <query>"],
	["Results", "Numbered list, Prev / Next pages, New search"],
	["Book", "Cover, author, year, format, size, description"],
	["Sources", "One link button per source, Back to results"]
];
var FILES = [
	["api/webhook.ts", "Telegram webhook (secret-verified)"],
	["src/handlers.ts", "Commands, text search, button callbacks"],
	["src/providers/mock.ts", "MockBookProvider — works today"],
	["src/providers/zlibrary.ts", "Stub for the real backend"]
];
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-background text-foreground font-sans",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl px-6 py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
					children: "Bot project · deploy target: Vercel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-serif text-5xl font-semibold leading-tight",
					children: "Telegram Book Bot"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-lg text-muted-foreground",
					children: [
						"The bot source lives in your Files as",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "font-mono text-foreground",
							children: "telegram-book-bot"
						}),
						". This page only documents the flow."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl font-medium",
						children: "Conversation flow"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 divide-y divide-border rounded-md border border-border bg-card",
						children: FLOW.map(([step, text], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline gap-4 px-5 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm text-primary",
									children: String(i + 1).padStart(2, "0")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-24 shrink-0 font-medium",
									children: step
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: text
								})
							]
						}, step))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl font-medium",
						children: "Key files"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 divide-y divide-border rounded-md border border-border bg-card",
						children: FILES.map(([file, text]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "font-mono text-sm",
								children: file
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: text
							})]
						}, file))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10 rounded-md bg-accent px-5 py-4 text-accent-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Next step"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm",
						children: [
							"Deploy to Vercel, set ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "font-mono",
								children: "TELEGRAM_BOT_TOKEN"
							}),
							" and",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "font-mono",
								children: "TELEGRAM_WEBHOOK_SECRET"
							}),
							", run",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "font-mono",
								children: "npm run set-webhook"
							}),
							". Swap",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "font-mono",
								children: "BOOK_PROVIDER"
							}),
							" once the real provider is implemented."
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { Index as component };
