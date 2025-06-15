import path from "path";
import fs from "fs";
import { Event } from "./contentModel";
import rawEvents from "../data/events.json";

const events: Event[] = rawEvents;

export const getEvents = (): Event[] => events;

export const findEventById = (id: string): Event | undefined => {
  return events.find((e) => e.id === id);
};

export const saveEventsToDisk = (): void => {
  try {
    const filePath = path.join(__dirname, "../data/events.json");

    fs.writeFileSync(filePath, JSON.stringify(events, null, 2), "utf-8");
    console.log("✅ Events saved to disk successfully.");
  } catch (err) {
    console.error("❌ Failed to save events to disk:", err);
  }
};
