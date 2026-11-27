"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const error_exception_1 = require("../../common/exceptions/error.exception");
const encreption_service_1 = require("../../common/service/encreption.service");
const google_service_1 = require("../../common/service/google.service");
const redis_service_1 = require("../../common/service/redis.service");
const sendEmail_service_1 = require("../../common/service/sendEmail.service");
const token_service_1 = require("../../common/service/token.service");
const user_model_1 = require("../../database/model/user.model");
const database_reposatory_1 = require("../../database/reposaiory/database.reposatory");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    authRepository;
    constructor() {
        this.authRepository = new database_reposatory_1.DatabaseRepository(user_model_1.userModel);
    }
    async login(data) {
        let { email, password } = data;
        let existedUser = await this.authRepository.findOne({ filter: { email } });
        if (!existedUser) {
            throw new error_exception_1.NotFoundException("User not found");
        }
        if (!password || !existedUser.password) {
            throw new error_exception_1.BadRequestException("Password is required");
        }
        let passwordMatched = await (0, encreption_service_1.compareHash)({
            planText: password,
            hashedPassword: existedUser.password,
        });
        if (!passwordMatched) {
            throw new error_exception_1.BadRequestException("password not matched");
        }
        let { token, refreshToken } = (0, token_service_1.generateToken)(existedUser);
        return {
            message: "Login successful",
            data: { token, refreshToken },
        };
    }
    async signup(data) {
        let { phone, email, name, password, userName, confirmPassword, age, gender, } = data;
        if (!password || !confirmPassword) {
            throw new error_exception_1.BadRequestException("Password and confirmation are required");
        }
        if (!phone) {
            throw new error_exception_1.BadRequestException("Phone is required");
        }
        if (password !== confirmPassword) {
            throw new error_exception_1.BadRequestException("confirmPassword is not matched");
        }
        let existedUser = await this.authRepository.findOne({ filter: { email } });
        if (existedUser) {
            throw new error_exception_1.ConflictException("User already exists");
        }
        let checkUserName = await this.authRepository.findOne({
            filter: { userName },
        });
        if (checkUserName) {
            throw new error_exception_1.ConflictException("someone has the same user name");
        }
        let hashedPassword = await (0, encreption_service_1.generateHash)({ planText: password });
        if (!hashedPassword) {
            throw new error_exception_1.BadRequestException("something went wrong");
        }
        let otp = Math.round(Math.random() * 1000000);
        let user = await this.authRepository.create({
            email,
            name,
            password: hashedPassword,
            age,
            phone,
            gender,
            userName,
        });
        await redis_service_1.redisService.set(`otp::${user._id}`, otp, 5 * 60);
        await (0, sendEmail_service_1.sendEmail)({
            to: `${user.email}`,
            subject: "Verify your email",
            html: `<h1>Your OTP is ${otp}</h1>`,
        });
        return {
            message: "Signup successful",
            data: { email, name, age, gender, phone },
        };
    }
    async refreshToken(body) {
        let { refreshToken } = body;
        if (!refreshToken) {
            throw new error_exception_1.UnauthorizedException("Refresh token is required");
        }
        const newToken = await (0, token_service_1.generateAccessToken)(refreshToken);
        if (!newToken) {
            throw new error_exception_1.UnauthorizedException("Invalid or expired refresh token");
        }
        return { token: newToken };
    }
    async googleLogin(idToken) {
        const googleUser = await (0, google_service_1.verifyGoogleIdToken)(idToken);
        let user = await this.authRepository.findOne({
            filter: { email: googleUser.email },
        });
        if (!user) {
            if (!googleUser.name) {
                throw new error_exception_1.BadRequestException("Google account name is missing");
            }
            const hashedPassword = await bcrypt_1.default.hash(crypto_1.default.randomUUID(), 10);
            const newUserData = {
                email: googleUser.email,
                name: googleUser.name,
                password: hashedPassword,
                googleId: googleUser.googleId,
                ...(googleUser.emailVerified !== undefined
                    ? { isVerified: googleUser.emailVerified }
                    : {}),
                role: 1,
                userName: googleUser.name,
            };
            user = await this.authRepository.create(newUserData);
        }
        if (!user) {
            throw new error_exception_1.BadRequestException("Unable to authenticate with Google");
        }
        if (!user._id) {
            throw new error_exception_1.BadRequestException("User ID is missing");
        }
        if (user.role === undefined) {
            throw new error_exception_1.BadRequestException("User role is missing");
        }
        const tokens = (0, token_service_1.generateToken)({ _id: user._id, role: user.role });
        return {
            user,
            ...tokens,
        };
    }
}
exports.authService = new AuthService();
