import { useState, useEffect } from 'react';
import { settingsAPI } from '../../services/endpoints';
import { useToast } from '../../contexts/ToastContext';

export default function SettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = useState({
    schoolName: '',
    defaultClassSession: 'Morning',
    attendanceCutoffTime: '09:00',
    allowLateMarking: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await settingsAPI.get();
      const data = res.data;
      if (data && Object.keys(data).length > 0) {
        setSettings({
          schoolName: data.school_name || '',
          defaultClassSession: data.default_session || 'Morning',
          // MySQL returns TIME columns with seconds (e.g. 09:00:00). Input type="time" prefers HH:mm.
          attendanceCutoffTime: data.cutoff_time ? data.cutoff_time.slice(0, 5) : '09:00',
          allowLateMarking: Boolean(data.allow_late_marking),
        });
      }
    } catch (error) {
      toast.addToast('Failed to load settings', 'error');
    } finally {
      setFetching(false);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsAPI.update({
        schoolName: settings.schoolName,
        defaultSession: settings.defaultClassSession,
        cutoffTime: settings.attendanceCutoffTime,
        allowLateMarking: settings.allowLateMarking
      });
      toast.addToast('Settings saved successfully.', 'success');
    } catch (error) {
      toast.addToast('Failed to save settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">System Settings</h2>
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
                <input
                  type="text"
                  value={settings.defaultClassSession}
                  onChange={(e) => setSettings((prev) => ({ ...prev, defaultClassSession: e.target.value }))}
                  placeholder="e.g. 2025/2026"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800"
                />
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
              <div></div>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
