import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TakeAttendance from './pages/TakeAttendance'
import { AdminDataProvider } from './contexts/AdminDataContext'
import { ToastProvider } from './contexts/ToastContext'
import AdminLayout from './pages/AdminDashboard/AdminLayout'
import DashboardPage from './pages/AdminDashboard/DashboardPage'
import StudentsPage from './pages/AdminDashboard/StudentsPage'
import AddStudent from './pages/AdminDashboard/AddStudent'
import EditStudent from './pages/AdminDashboard/EditStudent'
import ViewStudent from './pages/AdminDashboard/ViewStudent'
import StudentAttendance from './pages/AdminDashboard/StudentAttendance'
import AttendancePage from './pages/AdminDashboard/AttendancePage'
import AnalyticsPage from './pages/AdminDashboard/AnalyticsPage'
import SettingsPage from './pages/AdminDashboard/SettingsPage'
import ProfilePage from './pages/AdminDashboard/ProfilePage'

function App() {

  return (
    <AdminDataProvider>
      <ToastProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<TakeAttendance/>} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="students/add" element={<AddStudent />} />
            <Route path="students/:id" element={<ViewStudent />} />
            <Route path="students/:id/edit" element={<EditStudent />} />
            <Route path="students/:id/attendance" element={<StudentAttendance />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AdminDataProvider>
  )
}

export default App
