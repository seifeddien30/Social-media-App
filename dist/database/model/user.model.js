"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.UserEnum = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
var UserEnum;
(function (UserEnum) {
    UserEnum[UserEnum["Admin"] = 0] = "Admin";
    UserEnum[UserEnum["User"] = 1] = "User";
})(UserEnum || (exports.UserEnum = UserEnum = {}));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    age: {
        type: String,
    },
    isVerified: {
        type: zod_1.boolean,
        default: false,
    },
    role: {
        type: Number,
        enum: UserEnum,
        default: UserEnum.User,
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
    },
    bio: {
        type: String,
    },
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
});
exports.userModel = mongoose_1.default.model("user", userSchema);
