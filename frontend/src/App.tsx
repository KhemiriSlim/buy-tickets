import {Routes, Route} from 'react-router-dom'
import EventsPage from './pages/EventsPage'
import EventDetailsPage from './pages/EventDetailsPage'
function App() {
  return (
    <Routes>
      <Route path="/" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailsPage />} />
    </Routes>
  )
}

export default App;

