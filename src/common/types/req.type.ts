import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        email?: string | undefined;
        password?: string | undefined;
      };
    }
  }
}

export interface IReq extends Request {}