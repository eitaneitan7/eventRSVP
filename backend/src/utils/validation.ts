import { Request, Response, NextFunction } from "express";
import events from "../data/events.json";
import { errorResponse } from "./apiResponse";

export const validateEventId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  const event = events.find((e) => e.id === id);
  if (!event) {
    errorResponse(res, 404, "Event not found");
    return;
  }
  next();
};

export const validateGuestCount = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { guestCount } = req.body;
  if (typeof guestCount !== "number" || guestCount < 0) {
    errorResponse(res, 400, "Invalid guest count");
    return;
  }
  next();
};
