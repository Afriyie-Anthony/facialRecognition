import { useState } from 'react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: 'School Admin',
    email: 'admin@school.edu',
    phone: '+233 20 000 0000',
    role: 'Administrator',
  });
  const [message, setMessage] = useState('');

  const updateProfile = (e) => {
    e.preventDefault();
    console.log('Profile updated:', profile);
    setMessage('Profile updated successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Profile</h2>
          <p className="text-slate-500 mt-2 font-medium">Manage your personal account details and credentials.</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 h-32 relative">
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-90"></div>
           {/* Decorative pattern */}
           <svg className="absolute inset-0 h-full w-full text-white/10" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="0,100 100,0 100,100"/></svg>
        </div>
        
        <div className="px-6 md:px-8 pb-8 relative">
          <div className="relative -mt-16 mb-6 flex items-end justify-between">
            <div className="w-32 h-32 rounded-2xl border-4 border-white bg-slate-100 shadow-md flex items-center justify-center text-4xl font-bold text-slate-400">
               {profile.fullName.charAt(0)}
            </div>
          </div>

          <form onSubmit={updateProfile} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Role</label>
                <input
                  type="text"
                  value={profile.role}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                />
              </div>

            </div>

            <div className="pt-6 mt-6 flex items-center justify-between border-t border-slate-100">
              {message ? (
                <div className="text-sm font-medium text-emerald-600 flex items-center gap-2 animate-in fade-in">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  {message}
                </div>
              ) : <div></div>}
              
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
