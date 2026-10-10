import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { EventDetails } from '../api/types'
import { getEventById } from '../api/event'

function EventDetailsPage() {
  const { id } = useParams()
  const eventId = Number(id)
  const invalidId = !Number.isInteger(eventId)

  const [event, setEvent] = useState<EventDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (invalidId) return

    getEventById(eventId)
      .then((data) => setEvent(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [eventId, invalidId])

  if (invalidId) return <p>Invalid event id</p>
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!event) return null

  return (
    <div>
      <Link to="/">← Back to events</Link>
      <h1>{event.title}</h1>
      {event.description && <p>{event.description}</p>}
      <p>Location: {event.location}</p>
      <p>Date: {new Date(event.date).toLocaleString()}</p>
      <p>Price: ${event.price}</p>
      <p>
        {event.remaining > 0
          ? `${event.remaining} of ${event.capacity} seats left`
          : 'Sold out'}
      </p>
    </div>
  )
}

export default EventDetailsPage