

import { useState } from 'react';
import Camera from '../components/Camera';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    class: '',
    indexNumber: '',
    image: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCapturePhoto = (imageSrc) => {
    setFormData(prev => ({
      ...prev,
      image: imageSrc
    }));
    setPhotoPreview(imageSrc);
    setMessage('');
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      setMessage('Please enter your full name');
      return;
    }
    if (!formData.class.trim()) {
      setMessage('Please select your class');
      return;
    }
    if (!formData.indexNumber.trim()) {
      setMessage('Please enter your index number');
      return;
    }
    if (!formData.image) {
      setMessage('Please capture a photo');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // TODO: Replace with your actual API endpoint
      // const response = await axios.post('/api/register', {
      //   fullName: formData.fullName,
      //   class: formData.class,
      //   indexNumber: formData.indexNumber,
      //   image: formData.image
      // });

      console.log('Form submitted:', formData);
      setMessage('Registration successful! Please wait...', 'success');

      // Reset form
      setTimeout(() => {
        setFormData({
          fullName: '',
          class: '',
          indexNumber: '',
          image: null,
        });
        setPhotoPreview(null);
      }, 2000);
    } catch (error) {
      setMessage('Error during registration. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Student Registration
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Register your face for attendance tracking
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              placeholder="e.g., Form 1 A, Form 2 B"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Index Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Index Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="indexNumber"
              value={formData.indexNumber}
              onChange={handleInputChange}
              placeholder="e.g., STU001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Camera Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Capture Your Photo <span className="text-red-500">*</span>
            </label>

            {photoPreview ? (
              <div className="flex flex-col items-center gap-4">
                <div className="border-2 border-green-500 rounded-lg overflow-hidden">
                  <img
                    src={photoPreview}
                    alt="Captured"
                    className="w-64 h-64 object-cover"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                  >
                    Retake Photo
                  </button>
                </div>
              </div>
            ) : (
              <Camera onCapture={handleCapturePhoto} />
            )}
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${
              message.includes('successful')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition duration-200"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}