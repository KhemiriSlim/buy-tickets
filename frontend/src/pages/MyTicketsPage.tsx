import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { TicketItem } from '../api/types'
import { getTickets } from '../api/tickets'

function MyTicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getTickets()
      .then((data) => setTickets(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <main className="mx-auto max-w-3xl px-4 py-8">Loading...</main>
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 text-red-700">
        Error: {error}
      </main>
    )
  }

  if (tickets.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold">My tickets</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          You have no tickets yet.{' '}
          <Link to="/" className="font-medium text-indigo-600 hover:underline">
            Browse events
          </Link>
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">My tickets</h1>

      <ul className="mt-4 flex flex-col gap-3">
        {tickets.map((ticket) => (
          <li
            key={ticket.id}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-start justify-between gap-4">
              <Link
                to={`/events/${ticket.event.id}`}
                className="text-lg font-semibold hover:text-indigo-600"
              >
                {ticket.event.title}
              </Link>
              <span className="whitespace-nowrap rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                {ticket.quantity} {ticket.quantity === 1 ? 'ticket' : 'tickets'}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {ticket.event.location} ·{' '}
              {new Date(ticket.event.date).toLocaleDateString()}
            </p>

            <p className="mt-2 text-sm">
              Total: ${(Number(ticket.event.price) * ticket.quantity).toFixed(2)}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Bought on {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default MyTicketsPage