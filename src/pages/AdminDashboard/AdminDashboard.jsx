import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../contexts/AdminDataContext';
import { useToast } from '../../contexts/ToastContext';

export default function AdminDashboard() {
  const { students, attendance, addStudent: ctxAddStudent, deleteStudent: ctxDeleteStudent, addAttendance: ctxAddAttendance, deleteAttendance: ctxDeleteAttendance } = useAdminData();
  const toast = useToast();

  const [studentForm, setStudentForm] = useState({
    fullName: '',
    className: '',
    indexNumber: '',
  });

  const [studentFilter, setStudentFilter] = useState({
    search: '',
    className: 'All',
  });

  const [attendanceForm, setAttendanceForm] = useState({
    className: '',
    indexNumber: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
  });

  const [attendanceFilter, setAttendanceFilter] = useState({
    className: 'All',
    date: '',
  });

  const classOptions = useMemo(() => {
    const fromStudents = students.map((student) => student.className);
    const fromAttendance = attendance.map((entry) => entry.className);
    return Array.from(new Set([...fromStudents, ...fromAttendance])).sort();
  }, [students, attendance]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchMatch =
        student.fullName.toLowerCase().includes(studentFilter.search.toLowerCase()) ||
        student.indexNumber.toLowerCase().includes(studentFilter.search.toLowerCase());
      const classMatch =
        studentFilter.className === 'All' || student.className === studentFilter.className;
      return searchMatch && classMatch;
    });
  }, [students, studentFilter]);

  const filteredAttendance = useMemo(() => {
    return attendance.filter((entry) => {
      const classMatch =
        attendanceFilter.className === 'All' || entry.className === attendanceFilter.className;
      const dateMatch = attendanceFilter.date === '' || entry.date === attendanceFilter.date;
      return classMatch && dateMatch;
    });
  }, [attendance, attendanceFilter]);

  const today = new Date().toISOString().split('T')[0];

  const dashboardStats = useMemo(() => {
    const todayAttendance = attendance.filter((entry) => entry.date === today);
    const presentToday = todayAttendance.filter((entry) => entry.status === 'present').length;
    const absentToday = todayAttendance.filter((entry) => entry.status === 'absent').length;

    return {
      totalStudents: students.length,
      totalClasses: classOptions.length,
      presentToday,
      absentToday,
      totalAttendanceRecords: attendance.length,
    };
  }, [attendance, students, today, classOptions.length]);

  const onStudentFormChange = (e) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
  };

  const addStudent = (e) => {
    e.preventDefault();

    if (!studentForm.fullName.trim() || !studentForm.className.trim() || !studentForm.indexNumber.trim()) {
      toast.addToast('Please fill Full Name, Class, and Index Number.', 'error');
      return;
    }

    const normalizedIndex = studentForm.indexNumber.trim().toUpperCase();
    const exists = students.some((student) => student.indexNumber === normalizedIndex);

    if (exists) {
      toast.addToast('A student with this index number already exists.', 'error');
      return;
    }

    const newStudent = {
      id: crypto.randomUUID(),
      fullName: studentForm.fullName.trim(),
      className: studentForm.className.trim(),
      indexNumber: normalizedIndex,
    };

    ctxAddStudent(newStudent);
    setStudentForm({ fullName: '', className: '', indexNumber: '' });
    toast.addToast('Student added successfully.', 'success');
  };

  const deleteStudent = (id) => {
    ctxDeleteStudent(id);
    toast.addToast('Student removed.', 'info');
  };

  const onAttendanceFormChange = (e) => {
    const { name, value } = e.target;
    setAttendanceForm((prev) => ({ ...prev, [name]: value }));
  };

  const addAttendanceEntry = (e) => {
    e.preventDefault();

    if (!attendanceForm.className || !attendanceForm.indexNumber.trim() || !attendanceForm.date) {
      toast.addToast('Please fill Class, Index Number, and Date for attendance.', 'error');
      return;
    }

    const normalizedIndex = attendanceForm.indexNumber.trim().toUpperCase();

    const hasStudent = students.some(
      (student) =>
        student.className === attendanceForm.className &&
        student.indexNumber === normalizedIndex
    );

    if (!hasStudent) {
      toast.addToast('Student not found in selected class. Add the student first.', 'error');
      return;
    }

    const alreadyMarked = attendance.some(
      (entry) =>
        entry.className === attendanceForm.className &&
        entry.indexNumber === normalizedIndex &&
        entry.date === attendanceForm.date
    );

    if (alreadyMarked) {
      toast.addToast('Attendance already marked for this student on selected date.', 'error');
      return;
    }

    const newEntry = {
      id: crypto.randomUUID(),
      className: attendanceForm.className,
      indexNumber: normalizedIndex,
      date: attendanceForm.date,
      status: attendanceForm.status,
    };

    ctxAddAttendance(newEntry);
    setAttendanceForm((prev) => ({ ...prev, indexNumber: '', status: 'present' }));
    toast.addToast('Attendance entry added successfully.', 'success');
  };

  const deleteAttendanceEntry = (id) => {
    ctxDeleteAttendance(id);
    toast.addToast('Attendance entry removed.', 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-teal-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">Manage all students and attendance records.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/admin/students"
                className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition"
              >
                Student Register
              </Link>
              <Link
                to="/takeattendance"
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Take Attendance
              </Link>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <article className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-500">Total Students</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{dashboardStats.totalStudents}</p>
          </article>
          <article className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-500">Classes</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{dashboardStats.totalClasses}</p>
          </article>
          <article className="rounded-xl border border-emerald-200 p-4 shadow-sm bg-emerald-50">
            <p className="text-xs text-emerald-700">Present Today</p>
            <p className="text-2xl font-bold text-emerald-800 mt-1">{dashboardStats.presentToday}</p>
          </article>
          <article className="rounded-xl border border-rose-200 p-4 shadow-sm bg-rose-50">
            <p className="text-xs text-rose-700">Absent Today</p>
            <p className="text-2xl font-bold text-rose-800 mt-1">{dashboardStats.absentToday}</p>
          </article>
          <article className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-500">Attendance Records</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{dashboardStats.totalAttendanceRecords}</p>
          </article>
        </section>

        {/* Global toasts replace inline messages */}

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <article className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Manage Students</h2>

            <form onSubmit={addStudent} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                name="fullName"
                value={studentForm.fullName}
                onChange={onStudentFormChange}
                placeholder="Full Name"
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <input
                type="text"
                name="className"
                value={studentForm.className}
                onChange={onStudentFormChange}
                placeholder="Class"
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <input
                type="text"
                name="indexNumber"
                value={studentForm.indexNumber}
                onChange={onStudentFormChange}
                placeholder="Index Number"
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <button
                type="submit"
                className="md:col-span-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Add Student
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={studentFilter.search}
                onChange={(e) =>
                  setStudentFilter((prev) => ({ ...prev, search: e.target.value }))
                }
                placeholder="Search by name or index number"
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <select
                value={studentFilter.className}
                onChange={(e) =>
                  setStudentFilter((prev) => ({ ...prev, className: e.target.value }))
                }
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="All">All Classes</option>
                {classOptions.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">Name</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">Class</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">Index Number</th>
                    <th className="text-right px-3 py-2 font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-800">{student.fullName}</td>
                        <td className="px-3 py-2 text-slate-700">{student.className}</td>
                        <td className="px-3 py-2 text-slate-700">{student.indexNumber}</td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => deleteStudent(student.id)}
                            className="text-rose-600 hover:text-rose-700 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-3 py-5 text-center text-slate-500">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Manage Attendance</h2>

            <form onSubmit={addAttendanceEntry} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                name="className"
                value={attendanceForm.className}
                onChange={onAttendanceFormChange}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select Class</option>
                {classOptions.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="indexNumber"
                value={attendanceForm.indexNumber}
                onChange={onAttendanceFormChange}
                placeholder="Index Number"
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <input
                type="date"
                name="date"
                value={attendanceForm.date}
                onChange={onAttendanceFormChange}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <select
                name="status"
                value={attendanceForm.status}
                onChange={onAttendanceFormChange}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
              <button
                type="submit"
                className="md:col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Add Attendance Entry
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={attendanceFilter.className}
                onChange={(e) =>
                  setAttendanceFilter((prev) => ({ ...prev, className: e.target.value }))
                }
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="All">All Classes</option>
                {classOptions.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={attendanceFilter.date}
                onChange={(e) =>
                  setAttendanceFilter((prev) => ({ ...prev, date: e.target.value }))
                }
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">Class</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">Index Number</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">Date</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">Status</th>
                    <th className="text-right px-3 py-2 font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((entry) => (
                      <tr key={entry.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-700">{entry.className}</td>
                        <td className="px-3 py-2 text-slate-700">{entry.indexNumber}</td>
                        <td className="px-3 py-2 text-slate-700">{entry.date}</td>
                        <td
                          className={`px-3 py-2 font-medium ${
                            entry.status === 'present' ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {entry.status}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => deleteAttendanceEntry(entry.id)}
                            className="text-rose-600 hover:text-rose-700 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-3 py-5 text-center text-slate-500">
                        No attendance entries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
