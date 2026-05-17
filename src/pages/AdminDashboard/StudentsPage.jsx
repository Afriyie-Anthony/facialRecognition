import { useMemo, useState } from 'react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { useToast } from '../../contexts/ToastContext';

export default function StudentsPage() {
  const { students, addStudent: ctxAddStudent, deleteStudent: ctxDeleteStudent } = useAdminData();
  const toast = useToast();
  const [form, setForm] = useState({ fullName: '', className: '', indexNumber: '' });
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');

  const classOptions = useMemo(
    () => Array.from(new Set(students.map((student) => student.className))).sort(),
    [students]
  );

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchMatch =
        student.fullName.toLowerCase().includes(search.toLowerCase()) ||
        student.indexNumber.toLowerCase().includes(search.toLowerCase());
      const classMatch = classFilter === 'All' || student.className === classFilter;
      return searchMatch && classMatch;
    });
  }, [students, search, classFilter]);

  const addStudent = (e) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.className.trim() || !form.indexNumber.trim()) {
      toast.addToast('Please complete all student fields.', 'error');
      return;
    }

    const normalizedIndex = form.indexNumber.trim().toUpperCase();
    const exists = students.some((student) => student.indexNumber === normalizedIndex);
    if (exists) {
      toast.addToast('Index number already exists.', 'error');
      return;
    }

    const newStudent = {
      id: crypto.randomUUID(),
      fullName: form.fullName.trim(),
      className: form.className.trim(),
      indexNumber: normalizedIndex,
    };

    ctxAddStudent(newStudent);
    setForm({ fullName: '', className: '', indexNumber: '' });
    toast.addToast('Student added successfully.', 'success');
  };

  const deleteStudent = (id) => {
    ctxDeleteStudent(id);
    toast.addToast('Student removed.', 'info');
  };

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Students Management</h2>
          <p className="text-slate-500 mt-2 font-medium">Add, find, and manage all enrolled students.</p>
        </div>
      </header>

      {/* Add Student Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Register New Student</h3>
        <form onSubmit={addStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            placeholder="Full Name (e.g., John Doe)"
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full text-slate-700"
          />
          <input
            type="text"
            value={form.className}
            onChange={(e) => setForm((prev) => ({ ...prev, className: e.target.value }))}
            placeholder="Class (e.g., Form 1 A)"
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full text-slate-700"
          />
          <input
            type="text"
            value={form.indexNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, indexNumber: e.target.value }))}
            placeholder="Index (e.g., STU001)"
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full text-slate-700"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
          >
            Add Student
          </button>
        </form>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/2 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or index..."
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-full text-slate-700 shadow-sm"
          />
        </div>
        <div className="w-full md:w-auto flex items-center gap-2">
          <label className="text-sm font-medium text-slate-500 whitespace-nowrap">Filter Class:</label>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-slate-700 min-w-[150px]"
          >
            <option value="All">All Classes</option>
            {classOptions.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* global toasts are used for messages */}

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Index Number</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {student.fullName.charAt(0)}
                      </div>
                      {student.fullName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {student.className}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{student.indexNumber}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => deleteStudent(student.id)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg font-medium transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      <p>No students found matching your criteria.</p>
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
