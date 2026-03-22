import { useMemo } from 'react';
import { initialAttendance, initialStudents } from './adminMockData';

export default function DashboardPage() {
  const stats = useMemo(() => {
    const classes = new Set(initialStudents.map((student) => student.className)).size;
    const today = '2026-03-21';
    const todayRecords = initialAttendance.filter((entry) => entry.date === today);

    return {
      totalStudents: initialStudents.length,
      totalClasses: classes,
      presentToday: todayRecords.filter((entry) => entry.status === 'present').length,
      absentToday: todayRecords.filter((entry) => entry.status === 'absent').length,
      attendanceRecords: initialAttendance.length,
    };
  }, []);

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-500 mt-2 font-medium">Quick summary of students and attendance for today.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 inline-flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-semibold text-slate-700">System Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        
        {/* Total Students Card */}
        <article className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-16 h-16 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Total Students</p>
            <p className="text-4xl font-extrabold text-slate-800 mt-2">{stats.totalStudents}</p>
          </div>
        </article>

        {/* Total Classes Card */}
        <article className="relative overflow-hidden rounded-2xl border border-violet-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-16 h-16 text-violet-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider">Total Classes</p>
            <p className="text-4xl font-extrabold text-slate-800 mt-2">{stats.totalClasses}</p>
          </div>
        </article>

        {/* Present Today Card */}
        <article className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-br from-white to-emerald-50 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group xl:col-span-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-16 h-16 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Present Today</p>
            <p className="text-4xl font-extrabold text-slate-800 mt-2">{stats.presentToday}</p>
          </div>
        </article>

        {/* Absent Today Card */}
        <article className="relative overflow-hidden rounded-2xl border border-rose-100 bg-linear-to-br from-white to-rose-50 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group xl:col-span-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-16 h-16 text-rose-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-rose-600 uppercase tracking-wider">Absent Today</p>
            <p className="text-4xl font-extrabold text-slate-800 mt-2">{stats.absentToday}</p>
          </div>
        </article>

        {/* Total Records Card */}
        <article className="relative overflow-hidden rounded-2xl border border-amber-100 bg-linear-to-br from-white to-amber-50 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group xl:col-span-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-16 h-16 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-amber-600 uppercase tracking-wider">Total Records</p>
            <p className="text-4xl font-extrabold text-slate-800 mt-2">{stats.attendanceRecords}</p>
          </div>
        </article>

      </div>

      <div className="rounded-2xl border border-slate-200 p-8 bg-white shadow-sm mt-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-linear-to-br from-indigo-100 to-violet-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-slate-800">Welcome Back, Administrator</h3>
          <p className="text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Your facial recognition system is running smoothly. Use the side menu to manage students, review attendance logs, and dive into analytics. 
          </p>
          <button className="mt-5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
            Quick Action: Add Student
          </button>
        </div>
      </div>
    </section>
  );
}
