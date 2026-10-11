import { Link } from 'react-router-dom'
import type { EventItem } from '../api/types'

type Props = { event: EventItem }

export default function EventCard({ event }: Props) {
  return (
    <li className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <Link
        to={`/events/${event.id}`}
        className="text-lg font-semibold hover:text-indigo-600"
      >
        {event.title}
      </Link>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {event.location} · {new Date(event.date).toLocaleDateString()}
      </p>
      <p className="mt-1 text-sm font-medium">${event.price}</p>
    </li>
  )
}