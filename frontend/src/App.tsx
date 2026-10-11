import {Routes, Route} from 'react-router-dom'
import EventsPage from './pages/EventsPage'
import EventDetailsPage from './pages/EventDetailsPage'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'
import RegisterPage from './pages/RegisterPage'
function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
    </>
  )
}

export default App;

