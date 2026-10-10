import type{ EventDetails, EventItem } from "./types";

export async function getEvents(): Promise<EventItem[]> {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/events`);
    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }
    const data = await res.json();
    return data;
    
    
}

export async function getEventById(id: number): Promise<EventDetails> {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`);
    if (res.status === 404) {
        throw new Error("Event not found");
    }
    if (!res.ok) {
        throw new Error("Failed to fetch event");
    }
    const data = await res.json();
    return data;
}