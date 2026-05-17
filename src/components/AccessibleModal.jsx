import React, { useEffect, useRef } from 'react';

// Props: open, onClose, title, description, children, actions (array of {label,onClick,variant}), hideClose
export default function AccessibleModal({ open, onClose, title, description, children, actions = [], hideClose = false }) {
  const modalRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement;
    const modal = modalRef.current;
    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = modal ? Array.from(modal.querySelectorAll(focusableSelector)) : [];
    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];

    if (firstEl) firstEl.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        if (!firstEl || !lastEl) return;
        if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        } else if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    // prevent body scroll while modal open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      try { previouslyFocused.current && previouslyFocused.current.focus(); } catch (e) {}
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc" tabIndex={-1} className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl p-6">
        {title && <h2 id="modal-title" className="text-xl font-semibold mb-2">{title}</h2>}
        {description && <div id="modal-desc" className="text-sm text-slate-700 mb-3">{description}</div>}
        <div className="mt-2">{children}</div>
        <div className="mt-4 flex gap-3 justify-end">
          {actions.map((a, i) => (
            <button key={i} onClick={a.onClick} className={`${a.variant === 'primary' ? 'bg-blue-600 text-white' : a.variant === 'danger' ? 'bg-red-500 text-white' : 'bg-gray-200 text-slate-800'} px-4 py-2 rounded`}>
              {a.label}
            </button>
          ))}
          {!hideClose && (
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Close</button>
          )}
        </div>
      </div>
    </div>
  );
}
