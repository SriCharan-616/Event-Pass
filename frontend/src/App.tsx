import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OrganizerDashboard from './pages/organizer/OrganizerDashboard'
import EventSummaryPage from './pages/organizer/EventSummaryPage'
import TopEventsPage from './pages/organizer/TopEventsPage'
import EventsListPage from './pages/participant/EventsListPage'
import MyRegistrationsPage from './pages/participant/MyRegistrationsPage'
import CheckInPage from './pages/participant/CheckInPage'
import EventSummaryViewPage from './pages/participant/EventSummaryViewPage'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute allowedRole="ORGANIZER" />}>
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/organizer/events/:id/summary" element={<EventSummaryPage />} />
          <Route path="/organizer/top-events" element={<TopEventsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRole="PARTICIPANT" />}>
          <Route path="/events" element={<EventsListPage />} />
          <Route path="/events/:id/summary" element={<EventSummaryViewPage />} />
          <Route path="/my-registrations" element={<MyRegistrationsPage />} />
          <Route path="/my-registrations/:eventId/checkin" element={<CheckInPage />} />
        </Route>
      </Routes>
    </>
  )
}
