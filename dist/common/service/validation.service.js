"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const error_exception_1 = require("../exceptions/error.exception");
const validation = (schema) => {
    return (req, res, next) => {
        let validationError = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key]) {
                continue;
            }
            const result = schema[key].safeParse(req[key]);
            if (!result.success) {
                validationError.push({ key, issue: result.error.issues });
            }
        }
        if (validationError.length > 0) {
            throw new error_exception_1.BadRequestException("Validation Error", validationError);
        }
        next();
    };
};
exports.validation = validation;
