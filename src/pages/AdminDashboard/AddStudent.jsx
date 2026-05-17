import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../contexts/AdminDataContext';
import { useToast } from '../../contexts/ToastContext';

export default function AddStudent() {
  const { addStudent, students } = useAdminData();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', className: '', indexNumber: '' });

  const submit = (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.className.trim() || !form.indexNumber.trim()) {
      toast.addToast('Please complete all student fields.', 'error');
      return;
    }

    const normalizedIndex = form.indexNumber.trim().toUpperCase();
    const exists = students.some((s) => s.indexNumber === normalizedIndex);
    if (exists) {
      toast.addToast('Index number already exists.', 'error');
      return;
    }

    addStudent({
      id: crypto.randomUUID(),
      fullName: form.fullName.trim(),
      className: form.className.trim(),
      indexNumber: normalizedIndex,
    });

    toast.addToast('Student added successfully.', 'success');
    navigate('/admin/students');
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Add Student</h2>
        <p className="text-sm text-slate-500">Create a new student record.</p>
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
          placeholder="Class (e.g., Form 1A)"
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
        />
        <input
          value={form.indexNumber}
          onChange={(e) => setForm((p) => ({ ...p, indexNumber: e.target.value }))}
          placeholder="Index (e.g., STU001)"
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
        />
        <div className="flex items-center gap-3">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl">Create</button>
          <button type="button" onClick={() => navigate('/admin/students')} className="px-4 py-2 rounded-xl border">Cancel</button>
        </div>
      </form>
    </section>
  );
}
