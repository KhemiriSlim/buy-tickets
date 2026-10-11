import { getToken } from './token'
import type { TicketItem } from './types'

export async function buyTicket(eventId: number, quantity: number): Promise<void> {
    const token = getToken();
    if(!token){
        throw new Error("User is not authenticated")
    }
    const res = await fetch(`${import.meta.env.VITE_API_URL}/tickets`, {
        method : "POST",
        headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ eventId, quantity }),
    });
    const data = await res.json();
    if (!res.ok){
        throw new Error(data.error ?? "User is not authenticated")
    }
}


export async function getTickets(): Promise<TicketItem[]> {
    const token = getToken();
    if (!token){
        throw new Error("User is not authenticated")
    }
    const res = await fetch(`${import.meta.env.VITE_API_URL}/tickets/me`, {
        headers: { "Authorization": `Bearer ${token}` },
    })
    const data = await res.json();
    if(!res.ok){
        throw  new Error(data.error ?? "Failed to load tickets")
    }
    return data; 
}
