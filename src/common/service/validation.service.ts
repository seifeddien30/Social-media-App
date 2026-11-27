import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { BadRequestException } from "../exceptions/error.exception";

type ValidationKey = keyof Request;
type ValidationSchema = Partial<Record<ValidationKey, ZodType>>;

export const validation = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let validationError: { key: ValidationKey; issue: ZodError["issues"] }[] =
      [];
    for (const key of Object.keys(schema) as ValidationKey[]) {
      if (!schema[key]) {
        continue;
      }
      const result = schema[key].safeParse(req[key]);
      if (!result.success) {
        validationError.push({ key, issue: result.error.issues });
      }
    }
    if (validationError.length > 0) {
      throw new BadRequestException("Validation Error", validationError);
    }
    next();
  };
};
