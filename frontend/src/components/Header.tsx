import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getToken, clearToken } from '../api/token'

function Header() {
  useLocation() 
  const navigate = useNavigate()
  const loggedIn = Boolean(getToken())

  function handleLogout() {
    clearToken()
    navigate('/login')
  }

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold">
          Tickets
        </Link>
        <div>
          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header