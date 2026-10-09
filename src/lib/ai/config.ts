export const aiConfig = {
  enabled: process.env.AI_GARAGE_ENABLED !== "false",
  openAiApiKey: process.env.OPENAI_API_KEY,
  textModel: process.env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
  maxInputChars: Number(process.env.AI_MAX_INPUT_CHARS || 6000),
  maxOutputTokens: Number(process.env.AI_MAX_OUTPUT_TOKENS || 900),
  maxRequestsPerWindow: Number(process.env.AI_MAX_REQUESTS_PER_WINDOW || 30),
  rateLimitWindowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
};
