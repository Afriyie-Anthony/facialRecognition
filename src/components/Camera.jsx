
import { useRef } from 'react';
import Webcam from 'react-webcam';

export default function Camera({ onCapture }) {
  const webcamRef = useRef(null);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      onCapture(imageSrc);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={300}
          height={300}
          className="w-full"
        />
      </div>
      <button
        onClick={capturePhoto}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
      >
        Capture Photo
      </button>
    </div>
  );
}