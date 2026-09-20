import type { BookProvider } from "./types";
import { mockProvider } from "./mock";
import { zlibraryProvider } from "./zlibrary";

export function getBookProvider(): BookProvider {
  const providerChoice = (process.env["BOOK_PROVIDER"] || "").trim().toLowerCase();

  if (providerChoice === "mock") {
    return mockProvider;
  }

  // If zlibrary is explicitly selected or if credentials are configured
  if (providerChoice === "zlibrary" || zlibraryProvider.hasCredentials()) {
    return zlibraryProvider;
  }

  // Default fallback is mock provider
  return mockProvider;
}

export * from "./types";
export { mockProvider } from "./mock";
export { zlibraryProvider } from "./zlibrary";
