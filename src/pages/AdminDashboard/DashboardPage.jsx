import { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useAdminData } from '../../contexts/AdminDataContext';

export default function DashboardPage() {
  const { students, attendance } = useAdminData();

  const stats = useMemo(() => {
    const classes = new Set(students.map((student) => student.className)).size;
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendance.filter((entry) => entry.date === today);

    return {
      totalStudents: students.length,
      totalClasses: classes,
      presentToday: todayRecords.filter((entry) => entry.status === 'present').length,
      absentToday: todayRecords.filter((entry) => entry.status === 'absent').length,
      attendanceRecords: attendance.length,
    };
  }, [students, attendance]);

  // Chart data: Students per class
  const studentsByClass = useMemo(() => {
    const classMap = {};
    students.forEach((student) => {
      classMap[student.className] = (classMap[student.className] || 0) + 1;
    });
    return Object.entries(classMap).map(([name, count]) => ({
      name,
      students: count,
    }));
  }, [students]);

  // Chart data: Attendance status (present vs absent)
  const attendanceStatus = useMemo(() => {
    const present = attendance.filter((e) => e.status === 'present').length;
    const absent = attendance.filter((e) => e.status === 'absent').length;
    return [
      { name: 'Present', value: present, fill: '#10b981' },
      { name: 'Absent', value: absent, fill: '#ef4444' },
    ];
  }, [attendance]);

  // Chart data: Attendance trend (last 7 days)
  const attendanceTrend = useMemo(() => {
    const dates = {};
    attendance.forEach((entry) => {
      if (!dates[entry.date]) {
        dates[entry.date] = { date: entry.date, present: 0, absent: 0 };
      }
      if (entry.status === 'present') dates[entry.date].present++;
      else dates[entry.date].absent++;
    });
    return Object.values(dates)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7);
  }, [attendance]);

  // Recent attendance records
  const recentAttendance = useMemo(() => {
    return attendance
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [attendance]);

  return (
    <section className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight break-words">Dashboard Overview</h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium">Complete analytics of students and attendance system.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 inline-flex items-center gap-2 whitespace-nowrap">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-700">System Online</span>
        </div>
      </header>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
        {/* Total Students Card */}
        <article className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-12 sm:w-16 h-12 sm:h-16 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
          </div>
          <div className="relative z-10">
            <p className="text-xs sm:text-sm font-semibold text-indigo-600 uppercase tracking-wider">Total Students</p>
            <p className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">{stats.totalStudents}</p>
          </div>
        </article>

        {/* Total Classes Card */}
        <article className="relative overflow-hidden rounded-2xl border border-violet-100 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-12 sm:w-16 h-12 sm:h-16 text-violet-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
          </div>
          <div className="relative z-10">
            <p className="text-xs sm:text-sm font-semibold text-violet-600 uppercase tracking-wider">Total Classes</p>
            <p className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">{stats.totalClasses}</p>
          </div>
        </article>

        {/* Present Today Card */}
        <article className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-12 sm:w-16 h-12 sm:h-16 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          </div>
          <div className="relative z-10">
            <p className="text-xs sm:text-sm font-semibold text-emerald-600 uppercase tracking-wider">Present Today</p>
            <p className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">{stats.presentToday}</p>
          </div>
        </article>

        {/* Absent Today Card */}
        <article className="relative overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-12 sm:w-16 h-12 sm:h-16 text-rose-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
          </div>
          <div className="relative z-10">
            <p className="text-xs sm:text-sm font-semibold text-rose-600 uppercase tracking-wider">Absent Today</p>
            <p className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">{stats.absentToday}</p>
          </div>
        </article>

        {/* Total Records Card */}
        <article className="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-12 sm:w-16 h-12 sm:h-16 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
          </div>
          <div className="relative z-10">
            <p className="text-xs sm:text-sm font-semibold text-amber-600 uppercase tracking-wider">Total Records</p>
            <p className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">{stats.attendanceRecords}</p>
          </div>
        </article>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Attendance Trend Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Attendance Trend (Last 7 Days)</h3>
          {attendanceTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-250 flex items-center justify-center text-slate-500">
              <p className="text-sm">No attendance data available</p>
            </div>
          )}
        </div>

        {/* Students Per Class Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Students Per Class</h3>
          {studentsByClass.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={studentsByClass}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-250 flex items-center justify-center text-slate-500">
              <p className="text-sm">No student data available</p>
            </div>
          )}
        </div>

        {/* Attendance Status Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Overall Attendance Status</h3>
          {attendanceStatus.some((s) => s.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={attendanceStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-250 flex items-center justify-center text-slate-500">
              <p className="text-sm">No attendance data available</p>
            </div>
          )}
        </div>

        {/* Recent Attendance Records */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Recent Attendance</h3>
          {recentAttendance.length > 0 ? (
            <div className="space-y-2 sm:space-y-3 max-h-80 overflow-y-auto pr-2">
              {recentAttendance.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-2 sm:p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors gap-2">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{record.indexNumber}</p>
                    <p className="text-xs text-slate-500 truncate">{record.className} • {record.date}</p>
                  </div>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                      record.status === 'present'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {record.status === 'present' ? '✓ Present' : '✗ Absent'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-250 flex items-center justify-center text-slate-500">
              <p className="text-sm">No attendance records</p>
            </div>
          )}
        </div>
      </div>

      {/* Welcome Section */}
      <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-sm mt-6 sm:mt-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-br from-indigo-100 to-violet-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800">Welcome Back, Administrator</h3>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Your facial recognition system is running smoothly. All charts and analytics are updated in real-time. Use the side menu to manage students, review attendance logs, and access detailed reports.
          </p>
          <button className="mt-4 sm:mt-5 px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
            View Full Analytics
          </button>
        </div>
      </div>
    </section>
  );
}
