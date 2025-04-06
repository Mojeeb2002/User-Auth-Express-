import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT, MONGO_URI, GMAIL_USER, GMAIL_PASS, SESSION_SECRET_KEY, APP_URL } =
  process.env;
