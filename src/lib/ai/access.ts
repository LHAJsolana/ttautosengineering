const PREVIEW_COOKIE = "tt_ai_garage_preview";
type CookieReader = { get(name: string): { value: string } | undefined };
type HeaderReader = { get(name: string): string | null };

export function isAiGaragePublicEnabled() {
  return process.env.AI_GARAGE_PUBLIC_ENABLED === "true";
}

function previewToken() {
  return process.env.AI_GARAGE_PREVIEW_TOKEN?.trim() || "";
}

function constantTimeEqual(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

function tokenFromHeaders(headers: HeaderReader) {
  const authorization = headers.get("authorization") ?? "";
  if (authorization.toLowerCase().startsWith("bearer ")) return authorization.slice(7).trim();
  return headers.get("x-ai-garage-preview-token")?.trim() ?? "";
}

export function isAiGaragePreviewAuthorized(headers: HeaderReader, cookies?: CookieReader) {
  const expected = previewToken();
  if (!expected) return false;
  const supplied = tokenFromHeaders(headers) || cookies?.get(PREVIEW_COOKIE)?.value || "";
  return constantTimeEqual(supplied, expected);
}

export function canAccessAiGarage(headers: HeaderReader, cookies?: CookieReader) {
  return isAiGaragePublicEnabled() || isAiGaragePreviewAuthorized(headers, cookies);
}

export { PREVIEW_COOKIE };
