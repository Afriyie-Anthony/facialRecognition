import { useParams } from 'react-router-dom';
import { useAdminData } from '../../contexts/AdminDataContext';

export default function StudentAttendance() {
  const { id } = useParams();
  const { students, attendance } = useAdminData();

  const student = students.find((s) => s.id === id);
  if (!student) return <p className="text-slate-500">Student not found.</p>;

  const entries = attendance.filter((e) => e.indexNumber === student.indexNumber);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Attendance for {student.fullName}</h2>
        <p className="text-sm text-slate-500">Showing records for {student.indexNumber}</p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        {entries.length === 0 ? (
          <p className="text-slate-500">No attendance records for this student.</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-3 text-slate-700">{e.date}</td>
                  <td className="px-4 py-3 text-slate-700">{e.className}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${e.status === 'present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                      {e.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
