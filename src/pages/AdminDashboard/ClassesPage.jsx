import { useState } from 'react';
import { useAdminData } from '../../contexts/AdminDataContext';
import AccessibleModal from '../../components/AccessibleModal';
import { useToast } from '../../contexts/ToastContext';

export default function ClassesPage() {
  const { classes, addClass, updateClass, deleteClass } = useAdminData();
  const [newClassName, setNewClassName] = useState('');
  const [editingClass, setEditingClass] = useState(null);
  const [editName, setEditName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      toast.addToast('Please enter a class name', 'error');
      return;
    }
    setIsSubmitting(true);
    const success = await addClass(newClassName.trim());
    if (success) setNewClassName('');
    setIsSubmitting(false);
  };

  const handleEditClass = async () => {
    if (!editName.trim()) {
      toast.addToast('Class name cannot be empty', 'error');
      return;
    }
    setIsSubmitting(true);
    const success = await updateClass(editingClass.id, editName.trim());
    if (success) {
      setEditingClass(null);
      setEditName('');
    }
    setIsSubmitting(false);
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm('Are you sure you want to delete this class? This cannot be undone.')) {
      await deleteClass(id);
    }
  };

  return (
    <section className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Classes</h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium">Manage all school classes and forms.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Class Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Class</h3>
            <form onSubmit={handleAddClass} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Class Name</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g., Form 1A"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all"
              >
                {isSubmitting ? 'Adding...' : 'Add Class'}
              </button>
            </form>
          </div>
        </div>

        {/* Class List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {classes.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p>No classes found. Add your first class to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {classes.map((cls) => (
                  <div key={cls.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{cls.name}</h4>
                      <p className="text-sm text-slate-500 mt-1">
                        {cls.student_count || 0} student{(cls.student_count || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingClass(cls);
                          setEditName(cls.name);
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Class"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Class"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AccessibleModal
        open={!!editingClass}
        onClose={() => setEditingClass(null)}
        title="Edit Class Name"
        actions={[
          { label: 'Cancel', onClick: () => setEditingClass(null), variant: 'secondary' },
          { label: isSubmitting ? 'Saving...' : 'Save Changes', onClick: handleEditClass, variant: 'primary' }
        ]}
      >
        <div className="space-y-4 pt-4">
          <label className="block text-sm font-semibold text-slate-700">New Name</label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700"
            autoFocus
          />
        </div>
      </AccessibleModal>
    </section>
  );
}
