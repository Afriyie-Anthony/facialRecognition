import { useMemo, useState } from 'react';
import { initialAttendance, initialStudents } from './adminMockData';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [form, setForm] = useState({
    className: '',
    indexNumber: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
  });
  const [filterClass, setFilterClass] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  const [message, setMessage] = useState('');

  const classOptions = useMemo(
    () => Array.from(new Set(initialStudents.map((student) => student.className))).sort(),
    []
  );

  const filteredAttendance = useMemo(() => {
    return attendance.filter((entry) => {
      const classMatch = filterClass === 'All' || entry.className === filterClass;
      const dateMatch = filterDate === '' || entry.date === filterDate;
      return classMatch && dateMatch;
    });
  }, [attendance, filterClass, filterDate]);

  const addAttendance = (e) => {
    e.preventDefault();

    if (!form.className || !form.indexNumber.trim() || !form.date) {
      setMessage('Please fill all attendance fields.');
      return;
    }

    const normalizedIndex = form.indexNumber.trim().toUpperCase();
    const hasStudent = initialStudents.some(
      (student) => student.className === form.className && student.indexNumber === normalizedIndex
    );

    if (!hasStudent) {
      setMessage('Student not found in selected class.');
      return;
    }

    const alreadyExists = attendance.some(
      (entry) =>
        entry.className === form.className &&
        entry.indexNumber === normalizedIndex &&
        entry.date === form.date
    );

    if (alreadyExists) {
      setMessage('Attendance already marked for this student on this date.');
      return;
    }

    setAttendance((prev) => [
      {
        id: crypto.randomUUID(),
        className: form.className,
        indexNumber: normalizedIndex,
        date: form.date,
        status: form.status,
      },
      ...prev,
    ]);

    setForm((prev) => ({ ...prev, indexNumber: '', status: 'present' }));
    setMessage('Attendance entry added.');
    setTimeout(() => setMessage(''), 3000);
  };

  const deleteEntry = (id) => {
    setAttendance((prev) => prev.filter((entry) => entry.id !== id));
    setMessage('Attendance entry removed.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Attendance Records</h2>
          <p className="text-slate-500 mt-2 font-medium">Manage attendance logs by class, date, and student.</p>
        </div>
      </header>

      {/* Add Attendance Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Manual Attendance Entry</h3>
        <form onSubmit={addAttendance} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-1 md:col-span-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Class</label>
            <select
              value={form.className}
              onChange={(e) => setForm((prev) => ({ ...prev, className: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700"
            >
              <option value="">Select Class</option>
              {classOptions.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1 md:col-span-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Index Number</label>
            <input
              type="text"
              value={form.indexNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, indexNumber: e.target.value }))}
              placeholder="e.g. STU001"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700"
            />
          </div>
          <div className="space-y-1 md:col-span-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700"
            />
          </div>
          <div className="space-y-1 md:col-span-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full md:col-span-1 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
          >
            Mark
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-100/50 p-4 rounded-2xl border border-slate-200/60">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          <span className="text-sm font-semibold text-slate-600 uppercase">Filters:</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full flex-1">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700 shadow-sm"
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
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700 shadow-sm"
          />
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {message}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Index Number</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-slate-800 font-medium">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 border border-slate-200">
                        {entry.className}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{entry.indexNumber}</td>
                    <td className="px-6 py-4 text-slate-600">{entry.date}</td>
                    <td className="px-6 py-4">
                      {entry.status === 'present' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Absent
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => deleteEntry(entry.id)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg font-medium transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p>No attendance records found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
