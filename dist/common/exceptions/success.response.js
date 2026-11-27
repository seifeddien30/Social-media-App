"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = void 0;
const successResponse = ({ res, message = "Operation successful", statusCode = 200, data, }) => {
    res.status(statusCode).json({
        status: "success",
        message,
        data,
    });
};
exports.successResponse = successResponse;
