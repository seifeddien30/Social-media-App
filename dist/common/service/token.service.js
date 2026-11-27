"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.generateToken = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_service_1 = require("../../config/env.service");
const error_exception_js_1 = require("../exceptions/error.exception.js");
const auth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        throw new error_exception_js_1.UnauthorizedException("token not found");
    }
    const [flag, token] = authorization.split(" ");
    if (!token) {
        throw new error_exception_js_1.BadRequestException("Invalid authorization header");
    }
    switch (flag) {
        case "Basic":
            const basicData = Buffer.from(token, "base64").toString();
            let [email, password] = basicData.split(":");
            req.user = { email, password };
            next();
            break;
        case "Bearer":
            let decodedData = jsonwebtoken_1.default.decode(token);
            if (!decodedData || typeof decodedData !== "object") {
                throw new error_exception_js_1.BadRequestException("Invalid token");
            }
            let signature = "";
            switch (decodedData.aud) {
                case env_service_1.env.adminAud:
                    signature = env_service_1.env.adminTokenKey;
                    break;
                case env_service_1.env.userAud:
                    signature = env_service_1.env.userTokenKey;
                    break;
            }
            if (!signature) {
                throw new error_exception_js_1.BadRequestException("Invalid token audience");
            }
            const decoded = jsonwebtoken_1.default.verify(token, signature);
            if (decoded) {
                req.userId = decoded.id;
                next();
            }
            else {
                throw new error_exception_js_1.BadRequestException("Invalid token");
            }
            break;
        default:
            throw new error_exception_js_1.BadRequestException("Invalid authorization type");
    }
};
exports.auth = auth;
const generateToken = (user) => {
    switch (user.role) {
        case 0: {
            let token = jsonwebtoken_1.default.sign({ id: user._id }, env_service_1.env.adminTokenKey, {
                expiresIn: "1h",
                audience: env_service_1.env.adminAud,
            });
            let refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, env_service_1.env.adminRefreshTokenKey, {
                expiresIn: "1y",
                audience: env_service_1.env.adminAud,
            });
            return { token, refreshToken };
        }
        case 1: {
            let userToken = jsonwebtoken_1.default.sign({ id: user._id }, env_service_1.env.userTokenKey, {
                expiresIn: "1h",
                audience: env_service_1.env.userAud,
            });
            let userRefreshToken = jsonwebtoken_1.default.sign({ id: user._id }, env_service_1.env.userRefreshTokenKey, {
                expiresIn: "1y",
                audience: env_service_1.env.userAud,
            });
            return { token: userToken, refreshToken: userRefreshToken };
        }
        default:
            throw new Error(`Invalid or missing user role: ${user.role}`);
    }
};
exports.generateToken = generateToken;
const generateAccessToken = (token) => {
    let decodedData = jsonwebtoken_1.default.decode(token);
    if (!decodedData || !decodedData.aud) {
        throw new error_exception_js_1.BadRequestException("Invalid token structure");
    }
    let refreshSignature;
    let accessSignature;
    switch (decodedData.aud) {
        case env_service_1.env.adminAud:
            refreshSignature = env_service_1.env.adminRefreshTokenKey;
            accessSignature = env_service_1.env.adminTokenKey;
            break;
        case env_service_1.env.userAud:
            refreshSignature = env_service_1.env.userRefreshTokenKey;
            accessSignature = env_service_1.env.userTokenKey;
            break;
        default:
            throw new error_exception_js_1.BadRequestException("Invalid token audience");
    }
    let decoded = jsonwebtoken_1.default.verify(token, refreshSignature);
    let newToken = jsonwebtoken_1.default.sign({ id: decoded.id }, accessSignature, {
        expiresIn: "30m",
        audience: decodedData.aud,
    });
    return newToken;
};
exports.generateAccessToken = generateAccessToken;
