type EliteHostingErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type EliteHostingEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: EliteHostingErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __elitehostingEvents?: EliteHostingEvents;
  }
}

export function reportEliteHostingError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__elitehostingEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
