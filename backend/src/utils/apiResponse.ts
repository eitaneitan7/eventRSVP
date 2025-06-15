import { Response } from "express";

export const successResponse = <T>(
  res: Response,
  data: T,
  message?: string,
  status: number = 200
) => {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
};

export const errorResponse = (
  res: Response,
  code: number,
  message: string
) => {
  return res.status(code).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};
