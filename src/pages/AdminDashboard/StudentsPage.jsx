import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminData } from '../../contexts/AdminDataContext';
import { useToast } from '../../contexts/ToastContext';

export default function StudentsPage() {
  const { students, deleteStudent: ctxDeleteStudent } = useAdminData();
  const toast = useToast();
  const navigate = useNavigate();
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

  const deleteStudent = (id) => {
    ctxDeleteStudent(id);
    toast.addToast('Student removed.', 'info');
  };

  return (
    <section className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight break-words">Students Management</h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium">View, edit, and manage all enrolled students.</p>
        </div>
        <button
          onClick={() => navigate('/admin/students/add')}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-2.5 px-4 sm:px-6 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center whitespace-nowrap text-sm sm:text-base"
        >
          <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Register New
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
        <div className="w-full relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or index..."
            className="pl-10 pr-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-full text-sm sm:text-base text-slate-700 shadow-sm"
          />
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label className="text-xs sm:text-sm font-medium text-slate-500 whitespace-nowrap">Filter:</label>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-slate-700 text-xs sm:text-base w-full sm:w-auto"
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
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Student</th>
                <th className="hidden sm:table-cell px-6 py-4">Class</th>
                <th className="hidden md:table-cell px-6 py-4">ID</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-slate-800 flex items-center gap-2">
                      <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs flex-shrink-0">
                        {student.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs sm:text-sm">{student.fullName}</p>
                        <p className="text-xs text-slate-500 sm:hidden truncate">{student.className} • {student.indexNumber}</p>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-slate-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {student.className}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-slate-600 font-mono text-xs">{student.indexNumber}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Link
                          to={`/admin/students/${student.id}`}
                          title="View"
                          className="text-slate-400 hover:text-indigo-600 px-1.5 sm:px-2 py-1 rounded-lg font-medium transition-colors text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">View</span>
                          <span className="sm:hidden">👁️</span>
                        </Link>
                        <Link
                          to={`/admin/students/${student.id}/edit`}
                          title="Edit"
                          className="text-slate-400 hover:text-emerald-600 px-1.5 sm:px-2 py-1 rounded-lg font-medium transition-colors text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Edit</span>
                          <span className="sm:hidden">✏️</span>
                        </Link>
                        <Link
                          to={`/admin/students/${student.id}/attendance`}
                          title="Attendance"
                          className="text-slate-400 hover:text-cyan-600 px-1.5 sm:px-2 py-1 rounded-lg font-medium transition-colors text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Attend</span>
                          <span className="sm:hidden">📋</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteStudent(student.id)}
                          title="Delete"
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-1.5 sm:px-2 py-1.5 rounded-lg font-medium transition-colors text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Delete</span>
                          <span className="sm:hidden">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 sm:px-6 py-8 sm:py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-10 sm:w-12 h-10 sm:h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      <p className="text-xs sm:text-sm">No students found matching your criteria.</p>
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
