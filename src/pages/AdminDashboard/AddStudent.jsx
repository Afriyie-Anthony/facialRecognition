import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useAdminData } from '../../contexts/AdminDataContext';
import { useToast } from '../../contexts/ToastContext';

export default function RegisterNewStudent() {
  const { addStudent, students } = useAdminData();
  const toast = useToast();
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [form, setForm] = useState({ fullName: '', className: '', indexNumber: '' });
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedFace, setCapturedFace] = useState(null);
  const [isMirror, setIsMirror] = useState(true);

  const captureFace = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedFace(imageSrc);
        setCameraActive(false);
        toast.addToast('Face captured successfully!', 'success');
      }
    }
  };

  const retakeFace = () => {
    setCapturedFace(null);
    setCameraActive(true);
  };

  const clearFace = () => {
    setCapturedFace(null);
    setCameraActive(false);
  };

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.fullName.trim() || !form.className.trim() || !form.indexNumber.trim()) {
      toast.addToast('Please complete all student fields.', 'error');
      setLoading(false);
      return;
    }

    const normalizedIndex = form.indexNumber.trim().toUpperCase();
    const exists = students.some((s) => s.indexNumber === normalizedIndex);
    if (exists) {
      toast.addToast('Index number already exists.', 'error');
      setLoading(false);
      return;
    }

    addStudent({
      id: crypto.randomUUID(),
      fullName: form.fullName.trim(),
      className: form.className.trim(),
      indexNumber: normalizedIndex,
      faceData: capturedFace, // Store the face image
    });

    toast.addToast('Student registered successfully!', 'success');
    setForm({ fullName: '', className: '', indexNumber: '' });
    setCapturedFace(null);
    setCameraActive(false);
    setTimeout(() => {
      setLoading(false);
      navigate('/admin/students');
    }, 600);
  };

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Register New Student</h2>
        <p className="text-slate-500 mt-2 font-medium">Add a new student to the system. All fields are required.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-600"></div>

            <div className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                  placeholder="e.g., John Doe"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
                  disabled={loading}
                />
                <p className="text-xs text-slate-500 mt-1">Student's full name as it appears in records</p>
              </div>

              {/* Class */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Class</label>
                <input
                  type="text"
                  value={form.className}
                  onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))}
                  placeholder="e.g., Form 1 A"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
                  disabled={loading}
                />
                <p className="text-xs text-slate-500 mt-1">Student's class or form</p>
              </div>

              {/* Index Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Student ID / Index Number</label>
                <input
                  type="text"
                  value={form.indexNumber}
                  onChange={(e) => setForm((p) => ({ ...p, indexNumber: e.target.value }))}
                  placeholder="e.g., STU001"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700 uppercase"
                  disabled={loading}
                />
                <p className="text-xs text-slate-500 mt-1">Unique identifier (automatically converted to uppercase)</p>
              </div>

              {/* Face Capture Section */}
              <div className="border-t pt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Student Face <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                </label>

                {!capturedFace && !cameraActive ? (
                  <button
                    type="button"
                    onClick={() => setCameraActive(true)}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 hover:text-indigo-600 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Start Camera
                  </button>
                ) : null}

                {cameraActive && !capturedFace && (
                  <div className="space-y-2">
                    <div className="bg-black rounded-xl overflow-hidden border-2 border-indigo-500">
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: isMirror ? 'user' : 'environment' }}
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={captureFace}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Capture Face
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsMirror(!isMirror)}
                        disabled={loading}
                        className="px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all text-slate-700 font-medium disabled:opacity-50"
                        title="Toggle camera"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraActive(false)}
                        disabled={loading}
                        className="px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all text-slate-700 font-medium disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {capturedFace && (
                  <div className="space-y-2">
                    <div className="bg-slate-100 rounded-xl overflow-hidden border-2 border-emerald-500">
                      <img src={capturedFace} alt="Captured face" className="w-full aspect-square object-cover" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={retakeFace}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 border border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all disabled:opacity-50"
                      >
                        Retake Photo
                      </button>
                      <button
                        type="button"
                        onClick={clearFace}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 border border-rose-600 text-rose-600 font-semibold rounded-xl hover:bg-rose-50 transition-all disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-sm text-emerald-700">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Face captured successfully
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Register Student
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/students')}
                  disabled={loading}
                  className="px-6 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-6 rounded-2xl border border-indigo-200/50 sticky top-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Registration Info
            </h3>
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <p className="font-semibold text-slate-800 mb-1">📋 What is needed?</p>
                <p className="text-slate-600">All three fields (Full Name, Class, and Student ID) are mandatory for registration.</p>
              </div>
              <div className="border-t border-indigo-200 pt-4">
                <p className="font-semibold text-slate-800 mb-1">📸 Face Capture</p>
                <p className="text-slate-600">Face photo is optional but recommended for facial recognition in attendance system.</p>
              </div>
              <div className="border-t border-indigo-200 pt-4">
                <p className="font-semibold text-slate-800 mb-1">🔑 Student ID</p>
                <p className="text-slate-600">Must be unique. Duplicate IDs will be rejected.</p>
              </div>
              <div className="border-t border-indigo-200 pt-4">
                <p className="font-semibold text-slate-800 mb-1">✨ After Registration</p>
                <p className="text-slate-600">You'll be redirected to the students list where you can view, edit, or manage attendance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
