// callback_data must be <= 64 bytes. We keep the bot stateless by encoding
// the action, page and (truncated) query straight into the button payload.

const MAX_BYTES = 64;
const SEP = "|";

export type Callback =
  | { kind: "home" }
  | { kind: "help" }
  | { kind: "prompt" }
  | { kind: "featured" }
  | { kind: "noop" }
  | { kind: "search"; query: string; page: number }
  | { kind: "book"; id: string; query: string; page: number };

function byteLength(s: string) {
  return Buffer.byteLength(s, "utf8");
}

/** Trim `query` until the whole payload fits in 64 bytes. */
function fit(prefix: string, query: string): string {
  let q = query;
  while (byteLength(prefix + q) > MAX_BYTES && q.length > 0) q = q.slice(0, -1);
  return prefix + q;
}

export const cb = {
  home: () => "h",
  help: () => "?",
  prompt: () => "p",
  featured: () => "f",
  noop: () => "-",
  search: (query: string, page: number) => fit(`s${SEP}${page}${SEP}`, query),
  book: (id: string, query: string, page: number) => fit(`b${SEP}${id}${SEP}${page}${SEP}`, query),
};

export function parseCallback(data: string | undefined): Callback | null {
  if (!data) return null;
  switch (data) {
    case "h":
      return { kind: "home" };
    case "?":
      return { kind: "help" };
    case "p":
      return { kind: "prompt" };
    case "f":
      return { kind: "featured" };
    case "-":
      return { kind: "noop" };
  }

  const parts = data.split(SEP);
  if (parts[0] === "s" && parts.length >= 3) {
    const page = Number(parts[1]);
    return { kind: "search", page: Number.isFinite(page) ? page : 1, query: parts.slice(2).join(SEP) };
  }
  if (parts[0] === "b" && parts.length >= 4) {
    const page = Number(parts[2]);
    return {
      kind: "book",
      id: parts[1],
      page: Number.isFinite(page) ? page : 1,
      query: parts.slice(3).join(SEP),
    };
  }
  return null;
}
