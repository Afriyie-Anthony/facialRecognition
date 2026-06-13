import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Link } from "react-router-dom";
import AccessibleModal from '../components/AccessibleModal';
import { attendanceAPI } from '../services/endpoints';

export default function TakeAttendance() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null); // { name, indexNumber, studentClass, time }
  const [message, setMessage] = useState("");

  const formatDayTime = (iso) => {
    const d = new Date(iso);
    const day = d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    return { day, time };
  };

  const captureAndRecognize = async () => {
    setMessage("");
    setStatus("idle");

    if (!webcamRef.current) {
      setMessage("Camera is not ready yet.");
      setStatus("error");
      return;
    }

    const image = webcamRef.current.getScreenshot();
    if (!image) {
      setMessage("Unable to capture photo. Please allow camera access.");
      setStatus("error");
      return;
    }

    setCapturedImage(image);
    setStatus("loading");

    try {
      const res = await attendanceAPI.take({ imageBase64: image });
      const data = res.data;
      
      const now = new Date().toISOString();
      if (data.success || data.alreadyMarked) {
        setResult({
          name: data.student?.name || "Student",
          indexNumber: data.student?.student_id || "Unknown",
          studentClass: data.student?.class_name || "Unknown",
          time: now,
          attendanceStatus: data.status || 'present'
        });
        setStatus("success");
        setMessage(data.message || "Attendance recorded.");
      } else {
        setResult(null);
        setStatus("error");
        setMessage("Face not recognized. Please try again or register the student.");
      }
    } catch (e) {
      setResult(null);
      setStatus("error");
      const errMsg = e.response?.data?.error || "Error taking attendance. Please try again.";
      setMessage(errMsg);
    }
  };

  const handleRetake = () => {
    setCapturedImage("");
    setResult(null);
    setStatus("idle");
    setMessage("");
  };

  const closePopup = () => {
    setStatus("idle");
    setMessage("");
    setResult(null);
    setCapturedImage("");
  };

  // modal refs removed; using AccessibleModal component

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10 px-4 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8">
        <Link 
          to="/login" 
          className="bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-800 hover:bg-emerald-50 px-4 py-2 rounded-xl font-semibold shadow-sm transition-all text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
          Admin Login
        </Link>
      </div>
      <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8 mt-8 sm:mt-0">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Take Attendance</h1>
        <p className="text-gray-600 mt-2 mb-6">Capture the student's face to mark attendance.</p>

        <div className="border border-gray-300 rounded-lg overflow-hidden bg-black">
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full" videoConstraints={{ facingMode: "user" }} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={captureAndRecognize} className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition">
            {status === "loading" ? "Recognizing..." : "Capture & Recognize"}
          </button>
          {capturedImage && (
            <button type="button" onClick={handleRetake} className="col-span-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition">
              Retake Photo
            </button>
          )}
        </div>

        {capturedImage && (
          <div className="mt-4 flex items-start gap-4">
            <img src={capturedImage} alt="Captured preview" className="w-24 h-24 object-cover rounded-lg border border-gray-300" />
            <div className="flex-1">
              {status === "success" && result && (
                (() => {
                  const { day, time } = formatDayTime(result.time);
                  return (
                    <div className={`p-3 rounded-lg border text-sm ${result.attendanceStatus === 'late' ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-green-200 bg-green-50 text-green-800'}`}>
                      <div className="font-semibold text-lg flex items-center justify-between">
                        {result.name}
                        {result.attendanceStatus === 'late' && (
                          <span className="text-xs px-2 py-1 bg-amber-200 text-amber-900 rounded-full ml-2">Late</span>
                        )}
                      </div>
                      <div className="text-sm">Index: {result.indexNumber}</div>
                      <div className="text-sm">Class: {result.studentClass}</div>
                      <div className="text-sm mt-2">{day} at {time}</div>
                    </div>
                  );
                })()
              )}
              
            </div>
          </div>
        )}

        {!capturedImage && message && (
          <div className="mt-4 p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm" aria-live="polite">{message}</div>
        )}
      </div>
      <AccessibleModal
        open={status === 'success' || status === 'error'}
        onClose={closePopup}
        title={status === 'success' ? (result?.attendanceStatus === 'late' ? 'Attendance Recorded (Late)' : 'Attendance Recorded') : 'Face Not Recognized'}
        description={status === 'success' ? result?.name : message}
        actions={
          status === 'error'
            ? [{ label: 'Retake', onClick: handleRetake, variant: 'danger' }]
            : []
        }
      >
        {status === 'success' && result && (
          <div>
            <div className="text-sm text-slate-600">Index: {result.indexNumber}</div>
            <div className="text-sm text-slate-600">Class: {result.studentClass}</div>
            <div className="text-sm text-slate-600 mt-2">{formatDayTime(result.time).day} at {formatDayTime(result.time).time}</div>
            {result.attendanceStatus === 'late' && (
              <div className="mt-3 p-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                Marked as Late
              </div>
            )}
          </div>
        )}
      </AccessibleModal>
    </div>
  );
}
