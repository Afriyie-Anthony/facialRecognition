import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    schoolName: 'Springfield Senior High',
    defaultClassSession: 'Morning',
    attendanceCutoffTime: '09:00',
    allowLateMarking: true,
  });
  const [message, setMessage] = useState('');

  const saveSettings = (e) => {
    e.preventDefault();
    console.log('Settings saved:', settings);
    setMessage('Settings saved successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">System Settings</h2>
          <p className="text-slate-500 mt-2 font-medium">Configure global attendance limits and school preferences.</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-2 h-full bg-slate-800"></div>
        <div className="p-6 md:p-8">
          <form onSubmit={saveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">School Name</label>
                <input
                  type="text"
                  value={settings.schoolName}
                  onChange={(e) => setSettings((prev) => ({ ...prev, schoolName: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Default Session</label>
                <select
                  value={settings.defaultClassSession}
                  onChange={(e) => setSettings((prev) => ({ ...prev, defaultClassSession: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Attendance Cutoff Time</label>
                <input
                  type="time"
                  value={settings.attendanceCutoffTime}
                  onChange={(e) => setSettings((prev) => ({ ...prev, attendanceCutoffTime: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800"
                />
              </div>

            </div>

            <div className="pt-4 mt-6 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.allowLateMarking}
                    onChange={(e) => setSettings((prev) => ({ ...prev, allowLateMarking: e.target.checked }))}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                  Allow late attendance marking
                </span>
              </label>
              <p className="text-xs text-slate-500 mt-2 ml-14">If enabled, students arriving after the cutoff time can still be marked present.</p>
            </div>

            <div className="pt-6 mt-6 flex items-center justify-between">
              {message ? (
                <div className="text-sm font-medium text-emerald-600 flex items-center gap-2 animate-in fade-in">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  {message}
                </div>
              ) : <div></div>}
              
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
