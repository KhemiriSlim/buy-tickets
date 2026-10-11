import { useState, useEffect } from 'react'
import type { EventItem } from '../api/types'
import { getEvents } from '../api/event'
import EventCard from '../components/EventCard'

function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getEvents()
      .then((data) => setEvents(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold">Upcoming events</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Pick an event and grab your seats.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {loading && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <li
              key={n}
              className="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </ul>
      )}

      {!loading && !error && events.length === 0 && (
        <p className="mt-6 text-gray-600 dark:text-gray-400">No events yet.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default EventsPage