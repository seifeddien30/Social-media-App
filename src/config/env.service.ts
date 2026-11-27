import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(`./.env.${process.env.NODE_ENV}`) });

const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL as string;
const salt = process.env.SALT as string;
const userTokenKey = process.env.USER_TOKEN_KEY as string;
const adminTokenKey = process.env.ADMIN_TOKEN_KEY as string;
const userRefreshTokenKey = process.env.USER_REFRESH_TOKEN_KEY as string;
const adminRefreshTokenKey = process.env.ADMIN_REFRESH_TOKEN_KEY as string;
const userAud = process.env.USER_AUD as string;
const adminAud = process.env.ADMIN_AUD as string;
const emailService = process.env.EMAIL_SERVICE as string;
const emailPassword = process.env.EMAIL_PASSWORD as string;
const redisUrl = process.env.REDIS_URL as string;
const mood = process.env.MOOD as string;
const google = process.env.GOOGLE_CLIENT_ID as string;
export let env = {
  port,
  databaseUrl,
  salt,
  userTokenKey,
  adminTokenKey,
  userRefreshTokenKey,
  adminRefreshTokenKey,
  userAud,
  adminAud,
  mood,
  emailService,
  emailPassword,
  redisUrl,
  google,
};
