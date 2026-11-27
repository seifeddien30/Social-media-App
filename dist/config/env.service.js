"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(`./.env.${process.env.NODE_ENV}`) });
const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;
const salt = process.env.SALT;
const userTokenKey = process.env.USER_TOKEN_KEY;
const adminTokenKey = process.env.ADMIN_TOKEN_KEY;
const userRefreshTokenKey = process.env.USER_REFRESH_TOKEN_KEY;
const adminRefreshTokenKey = process.env.ADMIN_REFRESH_TOKEN_KEY;
const userAud = process.env.USER_AUD;
const adminAud = process.env.ADMIN_AUD;
const emailService = process.env.EMAIL_SERVICE;
const emailPassword = process.env.EMAIL_PASSWORD;
const redisUrl = process.env.REDIS_URL;
const mood = process.env.MOOD;
const google = process.env.GOOGLE_CLIENT_ID;
exports.env = {
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
