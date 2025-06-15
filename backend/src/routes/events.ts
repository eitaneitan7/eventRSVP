import express from "express";
import {
  getAllEvents,
  getEventById,
  rsvpToEvent,
  updateRsvp,
  cancelRsvp
} from "../controllers/eventController";

import { validateEventId, validateGuestCount } from "../utils/validation";

const router = express.Router();

// Get
router.get("/", getAllEvents);
router.get("/:id", validateEventId, getEventById);

// Post
router.post("/:id/rsvp", validateEventId, rsvpToEvent);

// Patch
router.patch("/:id/rsvp", validateEventId, validateGuestCount, updateRsvp);

// Delete
router.delete("/:id/rsvp", validateEventId, cancelRsvp);

export default router;
