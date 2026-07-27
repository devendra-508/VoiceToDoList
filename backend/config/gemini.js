// Central place for Gemini configuration so it's easy to swap models/keys.
module.exports = {
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  baseUrl: "https://generativelanguage.googleapis.com/v1beta/models",
};
