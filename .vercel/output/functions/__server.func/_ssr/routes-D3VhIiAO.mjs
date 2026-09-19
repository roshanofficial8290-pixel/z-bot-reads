import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D3VhIiAO.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "min-h-screen bg-background text-foreground font-sans",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto max-w-2xl px-6 py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
					children: "Bot project · deploy target: Vercel"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 6,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "mt-4 font-serif text-5xl font-semibold leading-tight",
					children: "Telegram Book Bot"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 9,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-4 text-lg text-muted-foreground",
					children: [
						"The bot source lives in your Files as",
						" ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
							className: "font-mono text-foreground",
							children: "telegram-book-bot"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 12,
							columnNumber: 11
						}, this),
						". This page only documents the flow."
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 10,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-12",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "font-serif text-2xl font-medium",
						children: "Conversation flow"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 17,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
						className: "mt-4 divide-y divide-border rounded-md border border-border bg-card",
						children: FLOW.map(([step, text], i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
							className: "flex items-baseline gap-4 px-5 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-mono text-sm text-primary",
									children: String(i + 1).padStart(2, "0")
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 20,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "w-24 shrink-0 font-medium",
									children: step
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 23,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground",
									children: text
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 24,
									columnNumber: 17
								}, this)
							]
						}, step, true, {
							fileName: _jsxFileName,
							lineNumber: 19,
							columnNumber: 44
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 18,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 16,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "font-serif text-2xl font-medium",
						children: "Key files"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 30,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
						className: "mt-4 divide-y divide-border rounded-md border border-border bg-card",
						children: FILES.map(([file, text]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
							className: "flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
								className: "font-mono text-sm",
								children: file
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 33,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-muted-foreground",
								children: text
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 34,
								columnNumber: 17
							}, this)]
						}, file, true, {
							fileName: _jsxFileName,
							lineNumber: 32,
							columnNumber: 42
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 31,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 29,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-10 rounded-md bg-accent px-5 py-4 text-accent-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "font-medium",
						children: "Next step"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 40,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-1 text-sm",
						children: [
							"Deploy to Vercel, set ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
								className: "font-mono",
								children: "TELEGRAM_BOT_TOKEN"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 42,
								columnNumber: 35
							}, this),
							" and",
							" ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
								className: "font-mono",
								children: "TELEGRAM_WEBHOOK_SECRET"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 43,
								columnNumber: 13
							}, this),
							", run",
							" ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
								className: "font-mono",
								children: "npm run set-webhook"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 44,
								columnNumber: 13
							}, this),
							". Swap",
							" ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
								className: "font-mono",
								children: "BOOK_PROVIDER"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 45,
								columnNumber: 13
							}, this),
							" once the real provider is implemented."
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 41,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 39,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 5,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 4,
		columnNumber: 10
	}, this);
}
//#endregion
export { Index as component };
