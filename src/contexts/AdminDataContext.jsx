import React, { createContext, useContext, useState, useEffect } from 'react';
import { studentAPI, attendanceAPI } from '../services/endpoints';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const { token } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      setStudents([]);
      setAttendance([]);
      setClasses([]);
    }
  }, [token]);

  const fetchData = async () => {
    try {
      // Make sure endpoints.js has classAPI exported!
      const { classAPI } = await import('../services/endpoints');
      const [studentsRes, attendanceRes, classesRes] = await Promise.all([
        studentAPI.getAll(),
        attendanceAPI.getAll(),
        classAPI.getAll()
      ]);
      
      const mappedStudents = studentsRes.data.map(s => ({
        id: s.id,
        fullName: s.name,
        className: s.class_name || 'Unassigned',
        classId: s.class_id,
        indexNumber: s.student_id,
        faceEnrolled: s.face_enrolled
      }));
      setStudents(mappedStudents);

      const mappedAttendance = attendanceRes.data.map(a => ({
        id: a.id,
        className: a.class_name || 'Unknown',
        studentName: a.student_name || '',
        indexNumber: a.student_id || '',
        date: a.attendance_date ? a.attendance_date.split('T')[0] : '',
        time: a.created_at ? new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        status: a.status || 'present',
      }));
      setAttendance(mappedAttendance);
      setClasses(classesRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
      toast.addToast('Failed to load dashboard data', 'error');
    }
  };

  const addStudent = async (student) => {
    try {
      const res = await studentAPI.create({
        name: student.fullName,
        classId: student.classId,
        studentId: student.indexNumber,
        imageBase64: student.faceData
      });
      if (res.data.success) {
        await fetchData(); // Refresh list to get the new DB ID and class_name
        toast.addToast('Student registered successfully', 'success');
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to add student';
      toast.addToast(msg, 'error');
      return false;
    }
  };

  const deleteStudent = async (id) => {
    try {
      await studentAPI.delete(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.addToast('Student deleted', 'success');
    } catch (error) {
      toast.addToast('Failed to delete student', 'error');
    }
  };

  const updateStudent = async (id, updates) => {
    try {
      // Map updates to backend schema
      const backendPayload = {
        name: updates.fullName,
        class_id: updates.classId,
        student_id: updates.indexNumber
      };
      const res = await studentAPI.update(id, backendPayload);
      if (res.data.success) {
        await fetchData();
        toast.addToast('Student updated successfully', 'success');
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to update student';
      toast.addToast(msg, 'error');
      return false;
    }
  };

  const addClass = async (name) => {
    try {
      // Need to dynamically import classAPI or just use it from endpoints if we import it at the top
      const { classAPI } = await import('../services/endpoints');
      const res = await classAPI.create({ name });
      if (res.data.success) {
        await fetchData();
        toast.addToast(`Class "${name}" created`, 'success');
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to add class';
      toast.addToast(msg, 'error');
      return false;
    }
  };

  const updateClass = async (id, name) => {
    try {
      const { classAPI } = await import('../services/endpoints');
      const res = await classAPI.update(id, { name });
      if (res.data.success) {
        await fetchData();
        toast.addToast('Class updated', 'success');
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to update class';
      toast.addToast(msg, 'error');
      return false;
    }
  };

  const deleteClass = async (id) => {
    try {
      const { classAPI } = await import('../services/endpoints');
      const res = await classAPI.delete(id);
      if (res.data.success) {
        await fetchData();
        toast.addToast('Class deleted', 'success');
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to delete class';
      toast.addToast(msg, 'error');
      return false;
    }
  };

  const addAttendance = (entry) => setAttendance((prev) => [entry, ...prev]);
  const deleteAttendance = async (id) => {
    try {
      await attendanceAPI.delete(id);
      setAttendance((prev) => prev.filter((e) => e.id !== id));
      toast.addToast('Attendance record deleted', 'success');
    } catch (error) {
      toast.addToast('Failed to delete attendance record', 'error');
    }
  };

  return (
    <AdminDataContext.Provider
      value={{
        students,
        attendance,
        classes,
        addStudent,
        deleteStudent,
        updateStudent,
        addAttendance,
        deleteAttendance,
        addClass,
        updateClass,
        deleteClass,
        refreshData: fetchData
      }}
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

