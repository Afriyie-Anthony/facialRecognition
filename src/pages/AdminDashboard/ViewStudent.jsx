import { useNavigate, useParams } from 'react-router-dom';
import { useAdminData } from '../../contexts/AdminDataContext';

export default function ViewStudent() {
  const { id } = useParams();
  const { students } = useAdminData();
  const navigate = useNavigate();

  const student = students.find((s) => s.id === id);
  if (!student) return <p className="text-slate-500">Student not found.</p>;

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Student Details</h2>
        <p className="text-sm text-slate-500">View student information and attendance.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm text-slate-500">Full Name</h3>
            <p className="font-medium text-slate-800">{student.fullName}</p>
          </div>
          <div>
            <h3 className="text-sm text-slate-500">Class</h3>
            <p className="font-medium text-slate-800">{student.className}</p>
          </div>
          <div>
            <h3 className="text-sm text-slate-500">Index</h3>
            <p className="font-mono font-medium text-slate-800">{student.indexNumber}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={() => navigate(`/admin/students/${id}/edit`)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Edit</button>
          <button onClick={() => navigate(`/admin/students/${id}/attendance`)} className="px-4 py-2 rounded-xl border">View Attendance</button>
        </div>
      </div>
    </section>
  );
}
