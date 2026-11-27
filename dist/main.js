"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_controller_1 = __importDefault(require("./module/auth/auth.controller"));
const error_1 = require("./common/utility/error");
const env_service_1 = require("./config/env.service");
const database_connection_1 = require("./database/database.connection");
const redis_service_1 = require("./common/service/redis.service");
const user_controller_1 = __importDefault(require("./module/user/user.controller"));
const follow_controller_1 = __importDefault(require("./module/follow/follow.controller"));
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({ origin: "*" }));
exports.app.use(express_1.default.json());
exports.app.use("/auth", auth_controller_1.default);
exports.app.use("/user", user_controller_1.default);
exports.app.use("/follow", follow_controller_1.default);
exports.app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
(0, database_connection_1.databaseConnection)();
redis_service_1.redisService.connect();
exports.app.use(error_1.globalErrorHandling);
exports.app.listen(env_service_1.env.port, () => {
    console.log(`Server is running on port ${env_service_1.env.port}`);
});
