import "dotenv/config"
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";


const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


app.get("/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});