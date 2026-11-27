import express from "express";
interface IError extends Error {
  statusCode?: number;
}
export const globalErrorHandling = (
  err: IError,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) => {
  console.error(err.stack);
  let stack = err.stack || "";
  let message = err.message || "Internal Server Error";
  let cause = err.cause || "";
  let statusCode = err.statusCode || 500;

  res.status(statusCode).json({ stack, message, cause });
};
