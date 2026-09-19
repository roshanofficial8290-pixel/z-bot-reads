/**
 * In sandboxed iframe environments or under certain browser extensions,
 * window.fetch may be configured with only a getter on Window.prototype
 * or window without a setter.
 *
 * This throws "TypeError: Cannot set property fetch of #<Window> which has only a getter"
 * when extensions or dev tools attempt to wrap window.fetch.
 *
 * This patch ensures fetch has both a getter and a setter so that assignments
 * to window.fetch succeed without crashing the application.
 */
export function ensureFetchHasSetter() {
  if (typeof window === "undefined") return;
  try {
    const win = window as unknown as Record<string, unknown> & {
      fetch: typeof fetch;
      Window?: { prototype?: { fetch?: typeof fetch } };
    };

    // 1. Suppress uncaught error events if an external script tries to assign to a read-only fetch
    window.addEventListener(
      "error",
      (event: ErrorEvent) => {
        if (
          event &&
          event.message &&
          (event.message.includes("Cannot set property fetch") ||
            event.message.includes("which has only a getter"))
        ) {
          event.preventDefault();
          event.stopImmediatePropagation?.();
        }
      },
      true,
    );

    const origOnError = window.onerror;
    window.onerror = function (
      msg: string | Event,
      url?: string,
      line?: number,
      col?: number,
      error?: Error,
    ) {
      if (
        typeof msg === "string" &&
        (msg.includes("Cannot set property fetch") || msg.includes("which has only a getter"))
      ) {
        return true;
      }
      if (origOnError) {
        return origOnError.call(this, msg, url, line, col, error);
      }
    };

    // 2. Walk entire prototype chain of window to patch all occurrences of fetch
    let currentFetch = win.fetch;
    let proto: object | null = win;
    while (proto) {
      try {
        const desc = Object.getOwnPropertyDescriptor(proto, "fetch");
        if (desc) {
          const origGet = desc.get;
          const origVal = desc.value as typeof fetch | undefined;
          Object.defineProperty(proto, "fetch", {
            get() {
              return currentFetch || (origGet ? origGet.call(this) : origVal);
            },
            set(v: typeof fetch) {
              currentFetch = v;
            },
            configurable: true,
            enumerable: desc.enumerable !== false,
          });
        }
      } catch {
        // Continue up chain
      }
      proto = Object.getPrototypeOf(proto);
    }

    // 3. Ensure own property setter on window itself
    try {
      Object.defineProperty(win, "fetch", {
        get() {
          return currentFetch;
        },
        set(v: typeof fetch) {
          currentFetch = v;
        },
        configurable: true,
        enumerable: true,
      });
    } catch {
      // Silently ignore
    }

    // 4. Ensure on Window.prototype if accessible
    if (win.Window?.prototype) {
      try {
        Object.defineProperty(win.Window.prototype, "fetch", {
          get() {
            return currentFetch;
          },
          set(v: typeof fetch) {
            currentFetch = v;
          },
          configurable: true,
          enumerable: true,
        });
      } catch {
        // Silently ignore
      }
    }
  } catch {
    // Silently ignore
  }
}

// Automatically invoke on module evaluation in browser
ensureFetchHasSetter();
