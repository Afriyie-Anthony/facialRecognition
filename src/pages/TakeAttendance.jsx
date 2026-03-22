import { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function TakeAttendance() {
  const webcamRef = useRef(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [capturedImage, setCapturedImage] = useState("");
  const [message, setMessage] = useState("");

  const classes = ["Form 1 A", "Form 1 B", "Form 1 C", "Form 2 A", "Form 2 B"];

  const captureImage = () => {
    if (!webcamRef.current) {
      setMessage("Camera is not ready yet.");
      return;
    }

    const image = webcamRef.current.getScreenshot();
    if (!image) {
      setMessage("Unable to capture photo. Please allow camera access.");
      return;
    }

    setCapturedImage(image);
    setMessage("Photo captured successfully.");
  };

  const handleMarkAttendance = (e) => {
    e.preventDefault();

    if (!selectedClass) {
      setMessage("Please select a class.");
      return;
    }

    if (!indexNumber.trim()) {
      setMessage("Please enter an index number.");
      return;
    }

    if (!capturedImage) {
      setMessage("Please capture a photo before marking attendance.");
      return;
    }

    const normalizedIndex = indexNumber.trim().toUpperCase();

    // TODO: Replace with backend call.
    // await axios.post('/api/attendance', {
    //   className: selectedClass,
    //   indexNumber: normalizedIndex,
    //   photo: capturedImage,
    //   time: new Date().toISOString(),
    // });
    console.log("Attendance submitted:", {
      className: selectedClass,
      indexNumber: normalizedIndex,
      photo: capturedImage,
      time: new Date().toISOString(),
    });

    setIndexNumber("");
    setCapturedImage("");
    setMessage(`Attendance marked for ${normalizedIndex}.`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Take Attendance
        </h1>
        <p className="text-gray-600 mt-2 mb-6">
          Mark students present using only class and index number.
        </p>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <form
              onSubmit={handleMarkAttendance}
              className="grid grid-cols-1 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="">Select class</option>
                  {classes.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Index Number
                </label>
                <input
                  type="text"
                  value={indexNumber}
                  onChange={(e) => setIndexNumber(e.target.value)}
                  placeholder="e.g. STU001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </form>
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Camera
            </p>
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-black">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full"
                videoConstraints={{ facingMode: "user" }}
              />
            </div>
            <button
              type="button"
              onClick={captureImage}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
            >
              Capture Photo
            </button>

            {capturedImage && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Captured Preview</p>
                <img
                  src={capturedImage}
                  alt="Captured student"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className="mt-4 p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
