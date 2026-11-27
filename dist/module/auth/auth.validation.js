"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupSchema = {
    body: zod_1.default
        .object({
        name: zod_1.default.string(),
        email: zod_1.default.string().email(),
        password: zod_1.default.string().min(6),
        confirmPassword: zod_1.default.string().min(6),
        age: zod_1.default.number().min(18).max(90),
        phone: zod_1.default.string()
    })
        .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "confirmPassword doesn't match",
                path: ["confirmPassword"],
            });
        }
    }),
};
exports.loginSchema = {
    body: zod_1.default.object({
        email: zod_1.default.string().email(),
        password: zod_1.default.string().min(6),
    }),
};
