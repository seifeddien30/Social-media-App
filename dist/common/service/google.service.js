"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleIdToken = void 0;
const google_auth_library_1 = require("google-auth-library");
const env_service_1 = require("../../config/env.service");
const error_exception_1 = require("../exceptions/error.exception");
const clint = new google_auth_library_1.OAuth2Client(env_service_1.env.google);
const verifyGoogleIdToken = async (idToken) => {
    if (!idToken) {
        throw new error_exception_1.BadRequestException("Google idToken is required");
    }
    const ticket = await clint.verifyIdToken({
        idToken,
        audience: env_service_1.env.google,
    });
    const payLoad = ticket.getPayload();
    if (!payLoad || !payLoad.email) {
        throw new error_exception_1.BadRequestException("Invalid Google token payload");
    }
    return {
        email: payLoad.email,
        name: payLoad.name,
        googleId: payLoad.sub,
        picture: payLoad.picture,
        emailVerified: payLoad.email_verified,
    };
};
exports.verifyGoogleIdToken = verifyGoogleIdToken;
