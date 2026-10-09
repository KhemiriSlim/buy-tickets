import {PrismaClient} from "../generated/prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

const prismaAdapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

export const prisma = new PrismaClient({
    adapter: prismaAdapter
});

export type PrismaClientType = typeof prisma;