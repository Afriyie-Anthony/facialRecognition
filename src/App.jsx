import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TakeAttendance from './pages/TakeAttendance'
import AdminLayout from './pages/AdminDashboard/AdminLayout'
import DashboardPage from './pages/AdminDashboard/DashboardPage'
import StudentsPage from './pages/AdminDashboard/StudentsPage'
import AttendancePage from './pages/AdminDashboard/AttendancePage'
import AnalyticsPage from './pages/AdminDashboard/AnalyticsPage'
import SettingsPage from './pages/AdminDashboard/SettingsPage'
import ProfilePage from './pages/AdminDashboard/ProfilePage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TakeAttendance/>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
