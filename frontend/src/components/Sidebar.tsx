import { NavLink, useLocation } from 'react-router-dom'
import { getToken } from '../api/token'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
  }`

function Sidebar() {
  useLocation() // re-render on navigation, so the token check stays fresh
  const loggedIn = Boolean(getToken())

  return (
    <aside className="sticky top-0 hidden w-56 shrink-0 self-start p-4 md:block">
      <nav className="flex flex-col gap-1">
        <NavLink to="/" end className={linkClass}>
          Events
        </NavLink>
        {loggedIn && (
          <NavLink to="/my-tickets" className={linkClass}>
            My tickets
          </NavLink>
        )}
      </nav>
    </aside>
  )
}

export default Sidebar