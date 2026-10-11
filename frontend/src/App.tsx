import {Routes, Route} from 'react-router-dom'
import EventsPage from './pages/EventsPage'
import EventDetailsPage from './pages/EventDetailsPage'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'
function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
    </>
  )
}

export default App;

