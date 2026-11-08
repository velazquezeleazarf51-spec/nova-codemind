// Platform values are read at use time.
// Soporta Manus (MANUS_*) o OpenAI / APIs compatibles (OPENAI_*).
export const ENV = {
  get appId() { return process.env.MANUS_PROJECT_ID ?? ""; },
  get cookieSecret() { return process.env.MANUS_JWT_SECRET ?? process.env.JWT_SECRET ?? "nova-dev-secret-change-me"; },
  get databaseUrl() { return process.env.DATABASE_URL ?? ""; },
  get oAuthServerUrl() { return process.env.MANUS_OAUTH_API_URL ?? ""; },
  get ownerOpenId() { return process.env.OWNER_OPEN_ID ?? ""; },
  get isProduction() { return process.env.NODE_ENV === "production"; },
  // Prioridad: MANUS_API_URL → OPENAI_BASE_URL → api.openai.com
  get forgeApiUrl() {
    return (
      process.env.MANUS_API_URL?.trim() ||
      process.env.OPENAI_BASE_URL?.trim() ||
      process.env.OPENAI_API_BASE?.trim() ||
      "https://api.openai.com"
    );
  },
  // Prioridad: MANUS_API_KEY → OPENAI_API_KEY
  get forgeApiKey() {
    return (
      process.env.MANUS_API_KEY?.trim() ||
      process.env.OPENAI_API_KEY?.trim() ||
      ""
    );
  },
};
