import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TakeAttendance from './pages/TakeAttendance'
import { AdminDataProvider } from './contexts/AdminDataContext'
import { ToastProvider } from './contexts/ToastContext'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import AdminLayout from './pages/AdminDashboard/AdminLayout'
import DashboardPage from './pages/AdminDashboard/DashboardPage'
import StudentsPage from './pages/AdminDashboard/StudentsPage'
import AddStudent from './pages/AdminDashboard/AddStudent'
import EditStudent from './pages/AdminDashboard/EditStudent'
import ViewStudent from './pages/AdminDashboard/ViewStudent'
import ClassesPage from './pages/AdminDashboard/ClassesPage'
import StudentAttendance from './pages/AdminDashboard/StudentAttendance'
import AttendancePage from './pages/AdminDashboard/AttendancePage'
import AnalyticsPage from './pages/AdminDashboard/AnalyticsPage'
import SettingsPage from './pages/AdminDashboard/SettingsPage'
import ProfilePage from './pages/AdminDashboard/ProfilePage'

function App() {

  return (
    <ToastProvider>
      <AuthProvider>
        <AdminDataProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<TakeAttendance/>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="students/add" element={<AddStudent />} />
              <Route path="students/:id" element={<ViewStudent />} />
              <Route path="students/:id/edit" element={<EditStudent />} />
              <Route path="classes" element={<ClassesPage />} />
              <Route path="students/:id/attendance" element={<StudentAttendance />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
          </BrowserRouter>
        </AdminDataProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
