import { Routes, Route, Link } from 'react-router-dom'
import Layout from './components/Layout'
import EventsPage from './pages/EventsPage'
import EventDetailsPage from './pages/EventDetailsPage'
import MyTicketsPage from './pages/MyTicketsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route
          path="*"
          element={
            <p>
              Page not found.{' '}
              <Link to="/" className="font-medium text-indigo-600 hover:underline">
                Back to events
              </Link>
            </p>
          }
        />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App