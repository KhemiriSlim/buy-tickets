import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is missing");

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (typeof payload === "string" || typeof payload.id !== "number") {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.userId = payload.id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const onlyAdmin = async (req:Request, res: Response, next: NextFunction)=>{
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Missing user ID" });
  }
  try{
    const user = await prisma.user.findUnique({where:{id:userId},select:{role:true}});
    if(!user  || user.role !== "ADMIN"){
      return res.status(403).json({ error: "you are not the admin" });
    }
    return next();
  }
  catch(error){
    return res.status(500).json({ error: "yFailed to check permissions" });
  }
}

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

app.get("/events/:id", async (req, res) => {
  const eventId = Number(req.params.id);
  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "Event ID must be a whole number" });
  }

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const sold = await prisma.ticket.aggregate({
      where: { eventId },
      _sum: { quantity: true },
    });
    const remaining = event.capacity - (sold._sum.quantity ?? 0);

    res.json({ ...event, remaining });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

app.post("/events",authMiddleware,onlyAdmin, async (req, res) => {
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

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to login" });
  }
});

app.post("/tickets", authMiddleware, async (req, res) => {
  const { eventId, quantity } = req.body ?? {};
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "eventId must be a whole number" });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ error: "Quantity must be a whole number of at least 1" });
  }

  try {
    const ticket = await prisma.$transaction(
      async (tx) => {
        const event = await tx.event.findUnique({ where: { id: eventId } });
        if (!event) throw new Error("EVENT_NOT_FOUND");

        const user = await tx.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("USER_NOT_FOUND");

        const sold = await tx.ticket.aggregate({
          where: { eventId },
          _sum: { quantity: true },
        });
        const remaining = event.capacity - (sold._sum.quantity ?? 0);
        if (quantity > remaining) throw new Error(`SOLD_OUT:${remaining}`);

        return tx.ticket.create({
          data: { userId, eventId, quantity },
        });
      },
      { isolationLevel: "Serializable" }
    );

    res.status(201).json(ticket);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "EVENT_NOT_FOUND") {
        return res.status(404).json({ error: "Event not found" });
      }
      if (error.message === "USER_NOT_FOUND") {
        return res.status(404).json({ error: "User not found" });
      }
      if (error.message.startsWith("SOLD_OUT:")) {
        const remaining = error.message.split(":")[1];
        return res.status(409).json({ error: `Only ${remaining} tickets left` });
      }
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2034"
    ) {
      return res.status(409).json({ error: "Too many purchases at once, please try again" });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to buy ticket" });
  }
});

app.get("/tickets/me",authMiddleware,async (req,res)=>{
  const userId= req.userId;
  if(!userId){
    return res.status(401).json({ error: "Unauthorized" });
  }
  try{
    const tickets = await prisma.ticket.findMany({where:{userId},include:{event:true},orderBy:{createdAt:"desc"}});
    res.status(200).json(tickets);
  }

  catch(error){
    res.status(500).json({ error: "Failed to fetch tickets" })
    console.error(error);
  }
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});