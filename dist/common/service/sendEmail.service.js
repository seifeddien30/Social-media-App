"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_service_js_1 = require("../../config/env.service.js");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: env_service_js_1.env.emailService,
        pass: env_service_js_1.env.emailPassword,
    },
});
const sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: "socialMediaApp@gmail.com",
        to,
        subject,
        html,
    });
};
exports.sendEmail = sendEmail;
