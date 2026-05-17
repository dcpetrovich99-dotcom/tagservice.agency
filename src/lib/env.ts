// Централізований доступ до змінних оточення з безпечними дефолтами.
// Жодних секретів у коді — лише читання process.env.

export const env = {
  authSecret: process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me",
  appHost: process.env.APP_HOST ?? "localhost:3000",
  allowedHosts: (process.env.APP_ALLOWED_HOSTS ?? "localhost:3000,127.0.0.1:3000")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean),
  tgManager: process.env.NEXT_PUBLIC_TG_MANAGER ?? "https://t.me/your_manager",
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
  telegramChatId: process.env.TELEGRAM_CHAT_ID ?? "",
  uploadDir: process.env.UPLOAD_DIR ?? "./public/uploads",
  isProd: process.env.NODE_ENV === "production",
};
