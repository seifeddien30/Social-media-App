"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandling = void 0;
const globalErrorHandling = (err, _req, res, _next) => {
    console.error(err.stack);
    let stack = err.stack || "";
    let message = err.message || "Internal Server Error";
    let cause = err.cause || "";
    let statusCode = err.statusCode || 500;
    res.status(statusCode).json({ stack, message, cause });
};
exports.globalErrorHandling = globalErrorHandling;
