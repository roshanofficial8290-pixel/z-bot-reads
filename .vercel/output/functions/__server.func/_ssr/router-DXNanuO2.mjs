import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useRouter, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DXNanuO2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-T_qEJpZF.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$2 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Z-Bot Reads" },
			{
				name: "description",
				content: "Telegram Book Bot documentation and conversation flow with start menu, search, paginated results, book details, and source links."
			},
			{
				name: "author",
				content: "Z-Bot Reads"
			},
			{
				property: "og:title",
				content: "Z-Bot Reads"
			},
			{
				property: "og:description",
				content: "Telegram Book Bot documentation and conversation flow with start menu, search, paginated results, book details, and source links."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `(function(){try{var w=typeof window!=="undefined"?window:globalThis;if(!w)return;w.addEventListener("error",function(e){if(e&&e.message&&(e.message.indexOf("Cannot set property fetch")!==-1||e.message.indexOf("which has only a getter")!==-1)){e.preventDefault();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}},true);var origOnError=w.onerror;w.onerror=function(msg,url,line,col,error){if(typeof msg==="string"&&(msg.indexOf("Cannot set property fetch")!==-1||msg.indexOf("which has only a getter")!==-1)){return true;}if(origOnError)return origOnError.apply(this,arguments);};var currentFetch=w.fetch;var proto=w;while(proto){try{var d=Object.getOwnPropertyDescriptor(proto,"fetch");if(d){var origGet=d.get;var origVal=d.value;Object.defineProperty(proto,"fetch",{get:function(){return currentFetch||(origGet?origGet.call(this):origVal);},set:function(v){currentFetch=v;},configurable:true,enumerable:d.enumerable!==false});}}catch(e){}proto=Object.getPrototypeOf(proto);}try{Object.defineProperty(w,"fetch",{get:function(){return currentFetch;},set:function(v){currentFetch=v;},configurable:true,enumerable:true});}catch(e){}if(w.Window&&w.Window.prototype){try{Object.defineProperty(w.Window.prototype,"fetch",{get:function(){return currentFetch;},set:function(v){currentFetch=v;},configurable:true,enumerable:true});}catch(e){}}}catch(err){}})();` } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			suppressHydrationWarning: true,
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$2.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter = () => import("./routes-DbeoCLFj.mjs");
var TITLE = "Z-Bot Reads";
var DESC = "Telegram Book Bot documentation and conversation flow with start menu, search, paginated results, book details, and source links.";
var Route$1 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: TITLE },
		{
			name: "description",
			content: DESC
		},
		{
			property: "og:title",
			content: TITLE
		},
		{
			property: "og:description",
			content: DESC
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var MOCK_BOOKS = [
	{
		id: "mock-1",
		title: "Designing Data-Intensive Applications",
		author: "Martin Kleppmann",
		year: 2017,
		format: "EPUB / PDF",
		size: "14.2 MB",
		description: "The big ideas behind reliable, scalable, and maintainable systems. A deep dive into data storage, replication, partitioning, transactions, and distributed systems.",
		sourceUrl: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/"
	},
	{
		id: "mock-2",
		title: "Clean Code: A Handbook of Agile Software Craftsmanship",
		author: "Robert C. Martin",
		year: 2008,
		format: "PDF",
		size: "6.8 MB",
		description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Learn meaningful naming, small functions, and unit testing.",
		sourceUrl: "https://www.pearson.com/en-us/subject-catalog/p/clean-code-a-handbook-of-agile-software-craftsmanship/P200000000109"
	},
	{
		id: "mock-3",
		title: "The Pragmatic Programmer: Your Journey to Mastery",
		author: "David Thomas, Andrew Hunt",
		year: 2019,
		format: "EPUB",
		size: "8.5 MB",
		description: "20th Anniversary Edition. Pragmatic philosophy, career growth, code architecture, testing, and keeping your technical debt under control.",
		sourceUrl: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/"
	},
	{
		id: "mock-4",
		title: "Atomic Habits",
		author: "James Clear",
		year: 2018,
		format: "EPUB / MOBI",
		size: "4.1 MB",
		description: "An easy & proven way to build good habits & break bad ones. Small changes that lead to remarkable, lasting results over time.",
		sourceUrl: "https://jamesclear.com/atomic-habits"
	},
	{
		id: "mock-5",
		title: "Project Hail Mary",
		author: "Andy Weir",
		year: 2021,
		format: "EPUB",
		size: "3.2 MB",
		description: "A lone astronaut must save the earth from disaster in this incredible new science-based space adventure from the author of The Martian.",
		sourceUrl: "https://www.penguinrandomhouse.com/books/611075/project-hail-mary-by-andy-weir/"
	},
	{
		id: "mock-6",
		title: "Dune",
		author: "Frank Herbert",
		year: 1965,
		format: "EPUB",
		size: "5.4 MB",
		description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
		sourceUrl: "https://en.wikipedia.org/wiki/Dune_(novel)"
	},
	{
		id: "mock-7",
		title: "Deep Work: Rules for Focused Success in a Distracted World",
		author: "Cal Newport",
		year: 2016,
		format: "PDF / EPUB",
		size: "3.9 MB",
		description: "Deep work is the ability to focus without distraction on a cognitively demanding task. Learn actionable disciplines to achieve elite productivity.",
		sourceUrl: "https://calnewport.com/deep-work/"
	},
	{
		id: "mock-8",
		title: "Sapiens: A Brief History of Humankind",
		author: "Yuval Noah Harari",
		year: 2014,
		format: "EPUB",
		size: "11.7 MB",
		description: "How did an insignificant ape become the ruler of planet Earth? A groundbreaking narrative exploring cognitive, agricultural, and scientific revolutions.",
		sourceUrl: "https://www.ynharari.com/book/sapiens-2/"
	},
	{
		id: "mock-9",
		title: "Structure and Interpretation of Computer Programs (SICP)",
		author: "Harold Abelson, Gerald Jay Sussman",
		year: 1996,
		format: "PDF",
		size: "9.1 MB",
		description: "The classic MIT textbook on computing, functional programming, recursion, abstraction, and the mechanics of interpretation.",
		sourceUrl: "https://mitpress.mit.edu/9780262510875/structure-and-interpretation-of-computer-programs/"
	},
	{
		id: "mock-10",
		title: "1984",
		author: "George Orwell",
		year: 1949,
		format: "EPUB / PDF",
		size: "2.3 MB",
		description: "The definitive dystopian masterpiece depicting total surveillance, government propaganda, doublethink, and the erosion of individual truth.",
		sourceUrl: "https://en.wikipedia.org/wiki/Nineteen_Eighty-Four"
	}
];
var MockBookProvider = class {
	name = "MockBookProvider";
	async search(params) {
		const rawQuery = (params.query || "").trim().toLowerCase();
		const page = Math.max(1, params.page || 1);
		const limit = Math.max(1, params.limit || 5);
		const filtered = rawQuery ? MOCK_BOOKS.filter((b) => b.title.toLowerCase().includes(rawQuery) || b.author.toLowerCase().includes(rawQuery) || b.description && b.description.toLowerCase().includes(rawQuery)) : MOCK_BOOKS;
		const total = filtered.length;
		const totalPages = Math.max(1, Math.ceil(total / limit));
		const start = (page - 1) * limit;
		return {
			books: filtered.slice(start, start + limit),
			total,
			page,
			totalPages
		};
	}
	async getBookDetails(id) {
		return MOCK_BOOKS.find((b) => b.id === id) || null;
	}
	async getFeatured() {
		return MOCK_BOOKS.slice(0, 5);
	}
};
var mockProvider = new MockBookProvider();
var ZLibraryBookProvider = class {
	name = "ZLibraryBookProvider";
	authToken = null;
	tokenExpiry = 0;
	baseUrl = "https://singlelogin.re";
	getCredentials() {
		return {
			email: process.env["ZLIBRARY_EMAIL"]?.trim(),
			password: process.env["ZLIBRARY_PASSWORD"]?.trim()
		};
	}
	hasCredentials() {
		const { email, password } = this.getCredentials();
		return Boolean(email && password);
	}
	async authenticate() {
		const { email, password } = this.getCredentials();
		if (!email || !password) {
			console.warn("[ZLibrary] ZLIBRARY_EMAIL or ZLIBRARY_PASSWORD not configured. Using fallback.");
			return null;
		}
		if (this.authToken && Date.now() < this.tokenExpiry) return this.authToken;
		try {
			const res = await fetch(`${this.baseUrl}/api/v1/user/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"User-Agent": "Z-Bot-Reads/1.0"
				},
				body: JSON.stringify({
					email,
					password
				})
			});
			if (!res.ok) {
				console.warn(`[ZLibrary] Authentication failed with status ${res.status}`);
				return null;
			}
			const data = await res.json();
			const token = data.user?.remix_userkey || data.token;
			if (token) {
				this.authToken = token;
				this.tokenExpiry = Date.now() + 216e5;
				return token;
			}
			console.warn("[ZLibrary] Login response missing token:", data.error || "unknown response format");
			return null;
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			console.warn(`[ZLibrary] Login network error: ${msg}. Falling back to mock provider.`);
			return null;
		}
	}
	async search(params) {
		const { email, password } = this.getCredentials();
		if (!email || !password) return mockProvider.search(params);
		const token = await this.authenticate();
		if (!token) return mockProvider.search(params);
		try {
			const page = Math.max(1, params.page || 1);
			const limit = Math.max(1, params.limit || 5);
			const query = encodeURIComponent(params.query || "");
			const url = `${this.baseUrl}/api/v1/book/search?message=${query}&page=${page}&limit=${limit}`;
			const res = await fetch(url, { headers: {
				"User-Agent": "Z-Bot-Reads/1.0",
				Cookie: `remix_userkey=${token}`
			} });
			if (!res.ok) {
				console.warn(`[ZLibrary] Search failed with HTTP ${res.status}. Falling back to mock provider.`);
				return mockProvider.search(params);
			}
			const data = await res.json();
			if (!data.books || !Array.isArray(data.books) || data.books.length === 0) {
				const mockResult = await mockProvider.search(params);
				if (mockResult.books.length > 0) return mockResult;
				return {
					books: [],
					total: 0,
					page,
					totalPages: 1
				};
			}
			const books = data.books.map((item) => ({
				id: String(item.id || item.hash || Math.random().toString(36).slice(2)),
				title: item.title || "Untitled Book",
				author: item.author || "Unknown Author",
				year: item.year || "N/A",
				format: (item.extension || "PDF").toUpperCase(),
				size: item.filesizeString || (item.filesize ? `${(item.filesize / 1048576).toFixed(1)} MB` : "N/A"),
				description: item.description?.replace(/<[^>]+>/g, "").slice(0, 350) || "No description provided.",
				coverUrl: item.cover,
				sourceUrl: item.id ? `https://z-library.sk/book/${item.id}` : void 0
			}));
			const total = data.bookCount || books.length;
			return {
				books,
				total,
				page,
				totalPages: Math.max(1, Math.ceil(total / limit))
			};
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			console.warn(`[ZLibrary] Search exception: ${msg}. Using fallback provider.`);
			return mockProvider.search(params);
		}
	}
	async getBookDetails(id) {
		if (id.startsWith("mock-")) return mockProvider.getBookDetails(id);
		const { email, password } = this.getCredentials();
		if (!email || !password) return mockProvider.getBookDetails(id);
		const token = await this.authenticate();
		if (!token) return mockProvider.getBookDetails(id);
		try {
			const res = await fetch(`${this.baseUrl}/api/v1/book/${id}`, { headers: {
				"User-Agent": "Z-Bot-Reads/1.0",
				Cookie: `remix_userkey=${token}`
			} });
			if (!res.ok) {
				console.warn(`[ZLibrary] Book lookup failed with status ${res.status}. Falling back to mock.`);
				return mockProvider.getBookDetails(id);
			}
			const item = await res.json();
			if (!item || !item.title) return mockProvider.getBookDetails(id);
			return {
				id: String(item.id || id),
				title: item.title,
				author: item.author || "Unknown Author",
				year: item.year || "N/A",
				format: (item.extension || "PDF").toUpperCase(),
				size: item.filesizeString || "N/A",
				description: item.description?.replace(/<[^>]+>/g, "") || "No description provided.",
				coverUrl: item.cover,
				sourceUrl: `https://z-library.sk/book/${item.id || id}`
			};
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			console.warn(`[ZLibrary] getBookDetails exception: ${msg}`);
			return mockProvider.getBookDetails(id);
		}
	}
	async getFeatured() {
		return mockProvider.getFeatured();
	}
};
var zlibraryProvider = new ZLibraryBookProvider();
function getBookProvider() {
	const providerChoice = (process.env["BOOK_PROVIDER"] || "").trim().toLowerCase();
	if (providerChoice === "mock") return mockProvider;
	if (providerChoice === "zlibrary" || zlibraryProvider.hasCredentials()) return zlibraryProvider;
	return mockProvider;
}
function escapeHtml(text) {
	return (text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
async function sendTelegramRequest(method, payload) {
	const token = process.env["TELEGRAM_BOT_TOKEN"];
	if (!token) {
		console.warn(`[Telegram Bot] TELEGRAM_BOT_TOKEN is missing. Cannot call ${method}`);
		return {
			ok: false,
			description: "TELEGRAM_BOT_TOKEN is not configured"
		};
	}
	const url = `https://api.telegram.org/bot${token}/${method}`;
	try {
		const res = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		const data = await res.json();
		if (!res.ok || !data.ok) console.error(`[Telegram API error] ${method} returned ${res.status}:`, data.description || data);
		return data;
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		console.error(`[Telegram API network failure] ${method}: ${msg}`);
		return {
			ok: false,
			description: msg
		};
	}
}
async function answerCallback(callbackId, text) {
	await sendTelegramRequest("answerCallbackQuery", {
		callback_query_id: callbackId,
		text
	});
}
async function handleTelegramUpdate(update) {
	const provider = getBookProvider();
	if (update.callback_query) {
		const cb = update.callback_query;
		const data = cb.data || "";
		const chatId = cb.message?.chat.id;
		const messageId = cb.message?.message_id;
		await answerCallback(cb.id);
		if (!chatId || !messageId) return;
		if (data === "cmd:start") {
			const welcome = renderWelcomeMessage(cb.from.first_name);
			await sendTelegramRequest("editMessageText", {
				chat_id: chatId,
				message_id: messageId,
				text: welcome.text,
				parse_mode: "HTML",
				reply_markup: welcome.reply_markup
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
				reply_markup: help.reply_markup
			});
			return;
		}
		if (data === "cmd:featured") {
			const payload = renderFeaturedList(await provider.getFeatured());
			await sendTelegramRequest("editMessageText", {
				chat_id: chatId,
				message_id: messageId,
				text: payload.text,
				parse_mode: "HTML",
				reply_markup: payload.reply_markup
			});
			return;
		}
		if (data === "cmd:search_prompt") {
			await sendTelegramRequest("sendMessage", {
				chat_id: chatId,
				text: "🔍 <b>Search Books</b>\n\nPlease reply with the book title, author, or keyword you wish to search for:",
				parse_mode: "HTML"
			});
			return;
		}
		if (data.startsWith("page:")) {
			const parts = data.split(":");
			const encodedQuery = parts[1] || "";
			const pageNum = parseInt(parts[2] || "1", 10) || 1;
			const query = decodeURIComponent(encodedQuery);
			const payload = renderSearchResults(query, await provider.search({
				query,
				page: pageNum,
				limit: 5
			}));
			await sendTelegramRequest("editMessageText", {
				chat_id: chatId,
				message_id: messageId,
				text: payload.text,
				parse_mode: "HTML",
				reply_markup: payload.reply_markup
			});
			return;
		}
		if (data.startsWith("book:")) {
			const bookId = data.slice(5);
			const book = await provider.getBookDetails(bookId);
			if (!book) {
				await sendTelegramRequest("sendMessage", {
					chat_id: chatId,
					text: "⚠️ Sorry, could not find details for this book."
				});
				return;
			}
			const details = renderBookDetails(book);
			await sendTelegramRequest("sendMessage", {
				chat_id: chatId,
				text: details.text,
				parse_mode: "HTML",
				reply_markup: details.reply_markup
			});
			return;
		}
		return;
	}
	if (update.message) {
		const msg = update.message;
		const text = (msg.text || "").trim();
		if (!text) return;
		const chatId = msg.chat.id;
		if (text === "/start" || text.toLowerCase() === "start") {
			const welcome = renderWelcomeMessage(msg.from?.first_name);
			await sendTelegramRequest("sendMessage", {
				chat_id: chatId,
				text: welcome.text,
				parse_mode: "HTML",
				reply_markup: welcome.reply_markup
			});
			return;
		}
		if (text === "/help" || text.toLowerCase() === "help") {
			const help = renderHelpMessage();
			await sendTelegramRequest("sendMessage", {
				chat_id: chatId,
				text: help.text,
				parse_mode: "HTML",
				reply_markup: help.reply_markup
			});
			return;
		}
		if (text === "/featured") {
			const payload = renderFeaturedList(await provider.getFeatured());
			await sendTelegramRequest("sendMessage", {
				chat_id: chatId,
				text: payload.text,
				parse_mode: "HTML",
				reply_markup: payload.reply_markup
			});
			return;
		}
		let searchQuery = text;
		if (text.startsWith("/search")) searchQuery = text.replace(/^\/search\s*/, "").trim();
		if (!searchQuery) {
			await sendTelegramRequest("sendMessage", {
				chat_id: chatId,
				text: "💡 Please provide a search term. For example: <code>/search Dune</code> or simply send <code>Atomic Habits</code>.",
				parse_mode: "HTML"
			});
			return;
		}
		const searchResult = await provider.search({
			query: searchQuery,
			page: 1,
			limit: 5
		});
		const payload = renderSearchResults(searchQuery, searchResult);
		await sendTelegramRequest("sendMessage", {
			chat_id: chatId,
			text: payload.text,
			parse_mode: "HTML",
			reply_markup: payload.reply_markup
		});
		return;
	}
}
function renderWelcomeMessage(name) {
	return {
		text: `📚 <b>Welcome to Z-Bot Reads!</b>\n\n${name ? `Hello, <b>${escapeHtml(name)}</b>!` : "Hello!"}\nSearch millions of books, view formats, file sizes, and download/source links right inside Telegram.\n\n• Type any title or author to search.\n• Or use the buttons below to begin:`,
		reply_markup: { inline_keyboard: [[{
			text: "🔍 Search Books",
			callback_data: "cmd:search_prompt"
		}, {
			text: "🌟 Featured Books",
			callback_data: "cmd:featured"
		}], [{
			text: "ℹ️ Help & Guide",
			callback_data: "cmd:help"
		}]] }
	};
}
function renderHelpMessage() {
	return {
		text: `📖 <b>How to use Z-Bot Reads</b>\n\n1️⃣ <b>Search</b>: Simply send any book name, author, or topic (e.g. <i>"Clean Code"</i> or <i>"Dune"</i>).\n2️⃣ <b>Browse</b>: Use the ⬅️ Previous and Next ➡️ buttons to navigate pages.\n3️⃣ <b>Details</b>: Tap on any book title button to view file formats, sizes, synopsis, and direct source links.\n\nCommands:\n• /search &lt;query&gt; - Search for titles\n• /featured - Browse popular selections\n• /help - Display this guide`,
		reply_markup: { inline_keyboard: [[{
			text: "🔍 Start Searching",
			callback_data: "cmd:search_prompt"
		}, {
			text: "🌟 Featured",
			callback_data: "cmd:featured"
		}], [{
			text: "🏠 Main Menu",
			callback_data: "cmd:start"
		}]] }
	};
}
function renderFeaturedList(books) {
	let text = `🌟 <b>Featured & Recommended Books</b>\n\n`;
	const keyboard = [];
	books.forEach((book, idx) => {
		const num = idx + 1;
		text += `<b>${num}. ${escapeHtml(book.title)}</b>\n`;
		text += `   👤 ${escapeHtml(book.author)} (${book.year || "N/A"})\n`;
		text += `   📁 ${escapeHtml(book.format || "PDF")} · ${escapeHtml(book.size || "")}\n\n`;
		keyboard.push([{
			text: `📖 ${num}. ${book.title.slice(0, 30)}${book.title.length > 30 ? "..." : ""}`,
			callback_data: `book:${book.id}`
		}]);
	});
	keyboard.push([{
		text: "🔍 Search More",
		callback_data: "cmd:search_prompt"
	}, {
		text: "🏠 Main Menu",
		callback_data: "cmd:start"
	}]);
	return {
		text,
		reply_markup: { inline_keyboard: keyboard }
	};
}
function renderSearchResults(query, result) {
	if (result.books.length === 0) return {
		text: `🔍 <b>Search Results:</b> "${escapeHtml(query)}"\n\nNo books were found matching your query. Try searching for a different title or author name.`,
		reply_markup: { inline_keyboard: [[{
			text: "🔍 Try Another Search",
			callback_data: "cmd:search_prompt"
		}, {
			text: "🌟 Featured Books",
			callback_data: "cmd:featured"
		}]] }
	};
	let text = `📚 <b>Results for:</b> "<i>${escapeHtml(query)}</i>"\n`;
	text += `📄 Page <b>${result.page}</b> of <b>${result.totalPages}</b> (Total: ${result.total})\n\n`;
	const keyboard = [];
	result.books.forEach((book, idx) => {
		const num = (result.page - 1) * 5 + idx + 1;
		text += `<b>${num}. ${escapeHtml(book.title)}</b>\n`;
		text += `   👤 ${escapeHtml(book.author)} (${book.year || "N/A"})\n`;
		text += `   📁 ${escapeHtml(book.format || "PDF")} · 💾 ${escapeHtml(book.size || "N/A")}\n\n`;
		keyboard.push([{
			text: `📖 ${num}. ${book.title.slice(0, 30)}${book.title.length > 30 ? "..." : ""}`,
			callback_data: `book:${book.id}`
		}]);
	});
	const navRow = [];
	const encQuery = encodeURIComponent(query);
	if (result.page > 1) navRow.push({
		text: "⬅️ Prev",
		callback_data: `page:${encQuery}:${result.page - 1}`
	});
	navRow.push({
		text: `• ${result.page}/${result.totalPages} •`,
		callback_data: "noop"
	});
	if (result.page < result.totalPages) navRow.push({
		text: "Next ➡️",
		callback_data: `page:${encQuery}:${result.page + 1}`
	});
	keyboard.push(navRow);
	keyboard.push([{
		text: "🔍 New Search",
		callback_data: "cmd:search_prompt"
	}, {
		text: "🏠 Main Menu",
		callback_data: "cmd:start"
	}]);
	return {
		text,
		reply_markup: { inline_keyboard: keyboard }
	};
}
function renderBookDetails(book) {
	let text = `📖 <b>${escapeHtml(book.title)}</b>\n\n`;
	text += `👤 <b>Author:</b> ${escapeHtml(book.author)}\n`;
	text += `📅 <b>Year:</b> ${escapeHtml(String(book.year || "N/A"))}\n`;
	text += `📁 <b>Format:</b> ${escapeHtml(book.format || "PDF")}\n`;
	text += `💾 <b>Size:</b> ${escapeHtml(book.size || "N/A")}\n\n`;
	if (book.description) text += `📝 <b>Description:</b>\n<i>${escapeHtml(book.description)}</i>\n\n`;
	const keyboard = [];
	if (book.sourceUrl) keyboard.push([{
		text: "🔗 Open Source / Download Page",
		url: book.sourceUrl
	}]);
	keyboard.push([{
		text: "🔍 Search Again",
		callback_data: "cmd:search_prompt"
	}, {
		text: "🏠 Main Menu",
		callback_data: "cmd:start"
	}]);
	return {
		text,
		reply_markup: { inline_keyboard: keyboard }
	};
}
var Route = createFileRoute("/api/webhook")({ server: { handlers: {
	GET: async () => {
		const tokenConfigured = Boolean(process.env["TELEGRAM_BOT_TOKEN"]);
		const zlibConfigured = Boolean(process.env["ZLIBRARY_EMAIL"] && process.env["ZLIBRARY_PASSWORD"]);
		return new Response(JSON.stringify({
			ok: true,
			status: "webhook active",
			telegramTokenConfigured: tokenConfigured,
			zlibraryConfigured: zlibConfigured
		}), {
			status: 200,
			headers: { "content-type": "application/json" }
		});
	},
	POST: async ({ request }) => {
		const secret = process.env["TELEGRAM_WEBHOOK_SECRET"];
		if (secret) {
			if (request.headers.get("x-telegram-bot-api-secret-token") !== secret) {
				console.warn("[Webhook] Unauthorized request: secret token mismatch");
				return new Response("Unauthorized", { status: 401 });
			}
		}
		try {
			const body = await request.json();
			if (!body || !body.message && !body.callback_query) return new Response(JSON.stringify({
				ok: true,
				ignored: true
			}), {
				status: 200,
				headers: { "content-type": "application/json" }
			});
			await handleTelegramUpdate(body);
			return new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { "content-type": "application/json" }
			});
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			console.error("[Webhook Error] Failed to process Telegram update:", msg);
			return new Response(JSON.stringify({
				ok: true,
				error: msg
			}), {
				status: 200,
				headers: { "content-type": "application/json" }
			});
		}
	}
} } });
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$2
	}),
	ApiWebhookRoute: Route.update({
		id: "/api/webhook",
		path: "/api/webhook",
		getParentRoute: () => Route$2
	})
};
var routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
