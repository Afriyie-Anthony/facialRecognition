import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminData } from '../../contexts/AdminDataContext';
import { useToast } from '../../contexts/ToastContext';

export default function EditStudent() {
  const { id } = useParams();
  const { students, updateStudent } = useAdminData();
  const toast = useToast();
  const navigate = useNavigate();

  const student = students.find((s) => s.id === id);
  const [form, setForm] = useState({ fullName: '', className: '', indexNumber: '' });

  useEffect(() => {
    if (student) setForm({ fullName: student.fullName, className: student.className, indexNumber: student.indexNumber });
  }, [student]);

  if (!student) return <p className="text-slate-500">Student not found.</p>;

  const submit = (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.className.trim() || !form.indexNumber.trim()) {
      toast.addToast('Please complete all fields.', 'error');
      return;
    }

    updateStudent(id, { fullName: form.fullName.trim(), className: form.className.trim(), indexNumber: form.indexNumber.trim().toUpperCase() });
    toast.addToast('Student updated.', 'success');
    navigate('/admin/students');
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Edit Student</h2>
        <p className="text-sm text-slate-500">Update student details.</p>
      </header>

      <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          value={form.fullName}
          onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
          placeholder="Full Name"
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
        />
        <input
          value={form.className}
          onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))}
          placeholder="Class"
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
        />
        <input
          value={form.indexNumber}
          onChange={(e) => setForm((p) => ({ ...p, indexNumber: e.target.value }))}
          placeholder="Index"
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
        />
        <div className="flex items-center gap-3">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl">Save</button>
          <button type="button" onClick={() => navigate('/admin/students')} className="px-4 py-2 rounded-xl border">Cancel</button>
        </div>
      </form>
    </section>
  );
}
