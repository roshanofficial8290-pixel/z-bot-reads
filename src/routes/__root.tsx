import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import "../lib/patch-fetch";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Z-Bot Reads" },
      {
        name: "description",
        content:
          "Telegram Book Bot documentation and conversation flow with start menu, search, paginated results, book details, and source links.",
      },
      { name: "author", content: "Z-Bot Reads" },
      { property: "og:title", content: "Z-Bot Reads" },
      {
        property: "og:description",
        content:
          "Telegram Book Bot documentation and conversation flow with start menu, search, paginated results, book details, and source links.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var w=typeof window!=="undefined"?window:globalThis;if(!w)return;w.addEventListener("error",function(e){if(e&&e.message&&(e.message.indexOf("Cannot set property fetch")!==-1||e.message.indexOf("which has only a getter")!==-1)){e.preventDefault();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}},true);var origOnError=w.onerror;w.onerror=function(msg,url,line,col,error){if(typeof msg==="string"&&(msg.indexOf("Cannot set property fetch")!==-1||msg.indexOf("which has only a getter")!==-1)){return true;}if(origOnError)return origOnError.apply(this,arguments);};var currentFetch=w.fetch;var proto=w;while(proto){try{var d=Object.getOwnPropertyDescriptor(proto,"fetch");if(d){var origGet=d.get;var origVal=d.value;Object.defineProperty(proto,"fetch",{get:function(){return currentFetch||(origGet?origGet.call(this):origVal);},set:function(v){currentFetch=v;},configurable:true,enumerable:d.enumerable!==false});}}catch(e){}proto=Object.getPrototypeOf(proto);}try{Object.defineProperty(w,"fetch",{get:function(){return currentFetch;},set:function(v){currentFetch=v;},configurable:true,enumerable:true});}catch(e){}if(w.Window&&w.Window.prototype){try{Object.defineProperty(w.Window.prototype,"fetch",{get:function(){return currentFetch;},set:function(v){currentFetch=v;},configurable:true,enumerable:true});}catch(e){}}}catch(err){}})();`,
          }}
        />
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
