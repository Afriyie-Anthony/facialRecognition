import React from 'react';

function Toast({ toast, onClose }) {
  const { id, message, type } = toast;
  const bg = type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-800';
  return (
    <div className={`w-full max-w-sm mx-auto ${bg} border rounded-lg p-3 shadow-md flex items-start gap-3`} role="status">
      <div className="flex-1 text-sm">{message}</div>
      <button onClick={() => onClose(id)} className="text-slate-500 hover:text-slate-700">Close</button>
    </div>
  );
}

export default function ToastContainer({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
}
