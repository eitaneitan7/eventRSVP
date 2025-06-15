import express from "express";
import cors from "cors";
import morgan from "morgan";
import eventsRouter from "./routes/events";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/events", eventsRouter);

// Test server is on
app.get("/", (_req, res) => {
  res.send("API on");
});

export default app;
