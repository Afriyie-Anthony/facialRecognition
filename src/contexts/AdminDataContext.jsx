import React, { createContext, useContext, useState } from 'react';
import { initialStudents, initialAttendance } from '../pages/AdminDashboard/adminMockData';

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const [students, setStudents] = useState(initialStudents);
  const [attendance, setAttendance] = useState(initialAttendance);

  const addStudent = (student) => setStudents((prev) => [student, ...prev]);
  const deleteStudent = (id) => setStudents((prev) => prev.filter((s) => s.id !== id));

  const addAttendance = (entry) => setAttendance((prev) => [entry, ...prev]);
  const deleteAttendance = (id) => setAttendance((prev) => prev.filter((e) => e.id !== id));

  return (
    <AdminDataContext.Provider
      value={{ students, attendance, addStudent, deleteStudent, addAttendance, deleteAttendance }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
}
