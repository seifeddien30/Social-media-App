import express from "express";

export const successResponse = ({
  res,
  message = "Operation successful",
  statusCode = 200,
  data,
}: {
  res: express.Response;
  message?: string;
  statusCode?: number;
  data?: unknown;
}) => {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};
