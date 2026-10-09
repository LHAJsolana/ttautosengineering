const INDEXNOW_KEY = "5f0b7d8e9c2a41f6b3d4e5a6c7b8d9e0";

export function GET() {
  return new Response(INDEXNOW_KEY, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
