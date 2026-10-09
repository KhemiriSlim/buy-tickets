import "dotenv/config"
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import bcrypt from "bcrypt";

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


app.post("/events", async (req, res) => {
  const { title, description, location, date, price, capacity } = req.body ?? {};

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  if (typeof location !== "string" || !location.trim()) {
    return res.status(400).json({ error: "Location is required" });
  }

  const eventDate = new Date(date);
  if (!date || isNaN(eventDate.getTime())) {
    return res.status(400).json({ error: "A valid date is required" });
  }

  const priceNumber = Number(price);
  if (price === undefined || price === null || price === "" || isNaN(priceNumber) || priceNumber < 0) {
    return res.status(400).json({ error: "Price must be a number, 0 or more" });
  }

  const capacityNumber = Number(capacity);
  if (!Number.isInteger(capacityNumber) || capacityNumber <= 0) {
    return res.status(400).json({ error: "Capacity must be a whole number greater than 0" });
  }

  try {
    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: typeof description === "string" ? description : undefined,
        location: location.trim(),
        date: eventDate,
        price: priceNumber,
        capacity: capacityNumber,
      },
    });
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create event" });
  }
});



app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return res.status(409).json({ error: "Email already registered" });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to register user" });
  }
});



app.post("/tickets", async(req,res) =>{
  const {userId,eventId,quantity} = req.body ?? {};
  if (!userId || !eventId || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be a positive number" });
  }
  try{
    const ticket = await prisma.ticket.create({
      data : {
        userId,
        eventId,
        quantity : Number(quantity)
      }
    });
    res.status(201).json(ticket);
  }
  catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to buy ticket" });
  }

})



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});