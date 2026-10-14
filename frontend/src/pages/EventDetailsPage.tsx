import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { EventDetails } from '../api/types'
import { getEventById } from '../api/event'
import { buyTicket } from '../api/tickets'
import { getToken } from '../api/token'
import {payForTickets} from "../api/payment"
function EventDetailsPage() {
  const { id } = useParams()
  const eventId = Number(id)
  const invalidId = !Number.isInteger(eventId)

  const [event, setEvent] = useState<EventDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [quantity, setQuantity] = useState(1)
  const [buying, setBuying] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageIsError, setMessageIsError] = useState(false)

  useEffect(() => {
    if (invalidId) return

    getEventById(eventId)
      .then((data) => setEvent(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [eventId, invalidId])

  if (invalidId) return <p className="p-8">Invalid event id</p>
  if (loading) return <p className="p-8">Loading...</p>
  if (error) return <p className="p-8 text-red-700">Error: {error}</p>
  if (!event) return null

  const loggedIn = Boolean(getToken())

 async function handleBuy() {
  if (!event) return

  setBuying(true)
  setMessage(null)

  try {
    setMessageIsError(false)
    setMessage('Confirm the payment in MetaMask...')
    const hash = await payForTickets(event.price, quantity)

    setMessage('Payment confirmed. Creating your ticket...')
    await buyTicket(eventId, quantity, hash)

    setMessage('Ticket(s) purchased successfully!')
    const updated = await getEventById(eventId)
    setEvent(updated)
    setQuantity(1)
  } catch (err) {
    setMessageIsError(true)
    setMessage(err instanceof Error ? err.message : 'Something went wrong')
  } finally {
    setBuying(false)
  }
}

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link
        to="/"
        className="text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400"
      >
        ← Back to events
      </Link>

      <article className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-3xl font-bold">{event.title}</h1>

        {event.description && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {event.description}
          </p>
        )}

        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Location
            </dt>
            <dd className="mt-1 font-medium">{event.location}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Date
            </dt>
            <dd className="mt-1 font-medium">
              {new Date(event.date).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Price
            </dt>
            <dd className="mt-1 font-medium">{event.price} ETH</dd>
          </div>
        </dl>

        <div className="mt-6">
          {event.remaining > 0 ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-950 dark:text-green-300">
              {event.remaining} of {event.capacity} seats left
            </span>
          ) : (
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-950 dark:text-red-300">
              Sold out
            </span>
          )}
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-800" />

        {loggedIn ? (
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              min={1}
              max={event.remaining}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={event.remaining === 0}
              className="w-24 rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 dark:border-gray-700"
            />
            <button
              type="button"
              onClick={handleBuy}
              disabled={
                buying ||
                event.remaining === 0 ||
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                quantity > event.remaining
              }
              className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {buying ? 'Buying...' : 'Buy tickets'}
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:underline"
            >
              Log in
            </Link>{' '}
            to buy tickets.
          </p>
        )}

        {message && (
          <p
            className={`mt-4 rounded-lg px-3 py-2 text-sm ${
              messageIsError
                ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                : 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
            }`}
          >
            {message}
          </p>
        )}
      </article>
    </main>
  )
}

export default EventDetailsPage