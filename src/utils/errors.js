// Turns a server reply into a short message for the student.
// Plain text is shown as it is; raw JSON (like {"status":500,...}) is never shown.
export function friendlyError(text, fallback) {
  if (!text || !text.trim()) {
    return fallback;
  }

  const value = text.trim();

  if (value.startsWith("{") || value.startsWith("<")) {
    return "Something went wrong on the server. Please try again.";
  }

  return value;
}
