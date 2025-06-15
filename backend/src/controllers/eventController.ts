import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/apiResponse";
import {
  findEventById,
  getEvents,
  saveEventsToDisk,
} from "../utils/eventUtils";

export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const page = parseInt(String(req.query.page || "1"));
  const limit = parseInt(String(req.query.limit || "10"));

  const allEvents = getEvents();
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedEvents = allEvents.slice(start, end);

  successResponse(res, {
    data: paginatedEvents,
    page,
    totalPages: Math.ceil(allEvents.length / limit),
    total: allEvents.length,
  });

  return;
};

export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const event = findEventById(req.params.id);

  if (!event) {
    errorResponse(res, 404, "Event not found");
    return;
  }

  successResponse(res, event);
  return;
};

export const rsvpToEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { guestCount = 1 } = req.body;
  const event = findEventById(req.params.id);

  if (!event) {
    errorResponse(res, 404, "Event not found");
    return;
  }

  if (event.hasUserRsvped) {
    errorResponse(res, 400, "User already RSVPed");
    return;
  }

  event.rsvpCount += guestCount;
  event.guestCount = guestCount;
  event.hasUserRsvped = true;
  console.log("RSVP'ed , Push demo");
  saveEventsToDisk();
  successResponse(res, event, "RSVP confirmed");
};

export const updateRsvp = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { guestCount = 1 } = req.body;
  const event = findEventById(req.params.id);
  //demo delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (!event) {
    errorResponse(res, 404, "Event not found");
    return;
  }

  if (!event.hasUserRsvped) {
    errorResponse(res, 400, "RSVP not found for this user");
    return;
  }

  const previousCount = event.guestCount || 1;
  const diff = guestCount - previousCount;

  event.guestCount = guestCount;
  event.rsvpCount = Math.max(0, event.rsvpCount + diff);

  saveEventsToDisk();
  successResponse(res, event, "RSVP updated");
};

export const cancelRsvp = async (
  req: Request,
  res: Response
): Promise<void> => {
  const event = findEventById(req.params.id);

  if (!event) {
    errorResponse(res, 404, "Event not found");
    return;
  }

  if (!event.hasUserRsvped) {
    errorResponse(res, 404, "RSVP not found");
    return;
  }

  const countToRemove = event.guestCount || 1;
  event.rsvpCount = Math.max(0, event.rsvpCount - countToRemove);
  event.guestCount = 0;
  event.hasUserRsvped = false;

  saveEventsToDisk();
  successResponse(res, event, "RSVP cancelled");
};
