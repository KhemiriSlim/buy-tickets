import { useState, useEffect } from 'react'
import type { EventItem } from '../api/types'
import { getEvents } from '../api/event'
import EventCard from '../components/EventCard'



function EventsPage() {
    const [events, setEvents] = useState<EventItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(()=>{
        getEvents()
        .then((data) => setEvents(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    },[])
    return(
        <div>
            <h1>Events</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <ul>
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
            ))}
            </ul>
        </div>
    )
}

export default EventsPage