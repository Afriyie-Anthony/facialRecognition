import { useMemo, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { useAdminData } from '../../contexts/AdminDataContext';

export default function AnalyticsPage() {
  const { students, attendance } = useAdminData();
  const [dateRange, setDateRange] = useState('all');

  // Filter attendance based on date range
  const filteredAttendance = useMemo(() => {
    if (dateRange === 'all') return attendance;
    
    const now = new Date();
    const filterDate = new Date();
    
    if (dateRange === '7days') filterDate.setDate(now.getDate() - 7);
    if (dateRange === '30days') filterDate.setDate(now.getDate() - 30);
    
    return attendance.filter(entry => new Date(entry.date) >= filterDate);
  }, [attendance, dateRange]);

  // Analytics by class
  const byClass = useMemo(() => {
    const classMap = new Map();

    students.forEach((student) => {
      if (!classMap.has(student.className)) {
        classMap.set(student.className, { total: 0, present: 0, absent: 0 });
      }
      classMap.get(student.className).total += 1;
    });

    filteredAttendance.forEach((entry) => {
      if (!classMap.has(entry.className)) {
        classMap.set(entry.className, { total: 0, present: 0, absent: 0 });
      }
      if (entry.status === 'present') classMap.get(entry.className).present += 1;
      if (entry.status === 'absent') classMap.get(entry.className).absent += 1;
    });

    return Array.from(classMap.entries()).map(([className, values]) => {
      const totalMarked = values.present + values.absent;
      const rate = totalMarked > 0 ? Math.round((values.present / totalMarked) * 100) : 0;
      return { className, ...values, attendanceRate: rate, totalMarked };
    }).sort((a, b) => b.attendanceRate - a.attendanceRate);
  }, [students, filteredAttendance]);

  // Overall statistics
  const overallStats = useMemo(() => {
    const totalPresent = filteredAttendance.filter(e => e.status === 'present').length;
    const totalAbsent = filteredAttendance.filter(e => e.status === 'absent').length;
    const totalRecords = totalPresent + totalAbsent;
    const overallRate = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;
    
    return { totalPresent, totalAbsent, totalRecords, overallRate };
  }, [filteredAttendance]);

  // Daily attendance trend
  const dailyTrend = useMemo(() => {
    const dateMap = {};
    filteredAttendance.forEach(entry => {
      if (!dateMap[entry.date]) {
        dateMap[entry.date] = { date: entry.date, present: 0, absent: 0, rate: 0 };
      }
      if (entry.status === 'present') dateMap[entry.date].present++;
      else dateMap[entry.date].absent++;
    });

    return Object.values(dateMap)
      .map(day => ({
        ...day,
        rate: day.present + day.absent > 0 
          ? Math.round((day.present / (day.present + day.absent)) * 100)
          : 0
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredAttendance]);

  // Top and bottom performers
  const topPerformers = useMemo(() => byClass.slice(0, 3), [byClass]);
  const bottomPerformers = useMemo(() => byClass.slice(-3).reverse(), [byClass]);

  // Attendance distribution chart data
  const attendanceDistribution = useMemo(() => {
    return byClass.map(item => ({
      name: item.className,
      attendance: item.attendanceRate,
    }));
  }, [byClass]);

  return (
    <section className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight break-words">Analytics & Insights</h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium">Comprehensive attendance trends and class performance analysis.</p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 bg-white p-1 rounded-lg border border-slate-200 w-full sm:w-auto overflow-x-auto">
          {['all', '7days', '30days'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition-all text-xs sm:text-sm whitespace-nowrap ${
                dateRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {range === 'all' ? 'All' : range === '7days' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </header>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Overall Attendance Rate */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 sm:p-6 border border-indigo-200">
          <p className="text-xs sm:text-sm font-semibold text-indigo-600 uppercase tracking-wider">Overall Rate</p>
          <p className="text-3xl sm:text-4xl font-bold text-indigo-900 mt-2">{overallStats.overallRate}%</p>
          <p className="text-xs text-indigo-700 mt-2">System-wide attendance</p>
        </div>

        {/* Total Present */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 sm:p-6 border border-emerald-200">
          <p className="text-xs sm:text-sm font-semibold text-emerald-600 uppercase tracking-wider">Total Present</p>
          <p className="text-3xl sm:text-4xl font-bold text-emerald-900 mt-2">{overallStats.totalPresent}</p>
          <p className="text-xs text-emerald-700 mt-2">Attendance marks</p>
        </div>

        {/* Total Absent */}
        <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-4 sm:p-6 border border-rose-200">
          <p className="text-xs sm:text-sm font-semibold text-rose-600 uppercase tracking-wider">Total Absent</p>
          <p className="text-3xl sm:text-4xl font-bold text-rose-900 mt-2">{overallStats.totalAbsent}</p>
          <p className="text-xs text-rose-700 mt-2">Absence records</p>
        </div>

        {/* Total Records */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-4 sm:p-6 border border-amber-200">
          <p className="text-xs sm:text-sm font-semibold text-amber-600 uppercase tracking-wider">Total Entries</p>
          <p className="text-3xl sm:text-4xl font-bold text-amber-900 mt-2">{overallStats.totalRecords}</p>
          <p className="text-xs text-amber-700 mt-2">Attendance records</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Daily Attendance Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Attendance Trend</h3>
          {dailyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dailyTrend}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area type="monotone" dataKey="present" stroke="#10b981" fill="url(#colorPresent)" />
                <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="url(#colorAbsent)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-250 flex items-center justify-center text-slate-500">
              <p className="text-sm">No data available</p>
            </div>
          )}
        </div>

        {/* Attendance Rate by Class */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Class Performance</h3>
          {attendanceDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" domain={[0, 100]} style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="attendance" fill="#6366f1" radius={[8, 8, 0, 0]}>
                  {attendanceDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.attendance >= 80 ? '#10b981' : entry.attendance >= 50 ? '#f59e0b' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-250 flex items-center justify-center text-slate-500">
              <p className="text-sm">No data available</p>
            </div>
          )}
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">🏆 Top Classes</h3>
          <div className="space-y-2 sm:space-y-3">
            {topPerformers.length > 0 ? (
              topPerformers.map((item, index) => (
                <div key={item.className} className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-transparent rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="text-lg sm:text-xl font-bold text-emerald-600 flex-shrink-0">#{index + 1}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-xs sm:text-sm truncate">{item.className}</p>
                      <p className="text-xs text-slate-500 truncate">{item.totalMarked} marked</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-lg sm:text-2xl font-bold text-emerald-600">{item.attendanceRate}%</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-6 sm:py-8 text-sm">No data available</p>
            )}
          </div>
        </div>

        {/* Bottom Performers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">⚠️ Needs Attention</h3>
          <div className="space-y-2 sm:space-y-3">
            {bottomPerformers.length > 0 ? (
              bottomPerformers.map((item, index) => (
                <div key={item.className} className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-transparent rounded-lg border border-rose-200">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="text-lg sm:text-xl font-bold text-rose-600 flex-shrink-0">•</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-xs sm:text-sm truncate">{item.className}</p>
                      <p className="text-xs text-slate-500 truncate">{item.totalMarked} marked</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-lg sm:text-2xl font-bold text-rose-600">{item.attendanceRate}%</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-6 sm:py-8 text-sm">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Class Analytics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6">All Classes Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {byClass.map((item, index) => (
            <article 
              key={item.className} 
              className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Background accent */}
              <div className={`absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity -translate-y-1/2 translate-x-1/3 ${
                item.attendanceRate >= 80 ? 'bg-emerald-100' :
                item.attendanceRate >= 50 ? 'bg-amber-100' : 'bg-rose-100'
              }`}></div>

              <div className="flex items-center justify-between relative z-10 mb-4">
                <h4 className="font-bold text-sm sm:text-lg text-slate-800 truncate">{item.className}</h4>
                <span className={`text-xs sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg flex-shrink-0 ml-2 ${
                  item.attendanceRate >= 80 ? 'bg-emerald-100 text-emerald-700' :
                  item.attendanceRate >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {item.attendanceRate}%
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 sm:h-2.5 bg-slate-200 rounded-full overflow-hidden relative z-10 p-0.5 mb-4 sm:mb-5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    item.attendanceRate >= 80 ? 'bg-emerald-500' :
                    item.attendanceRate >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${item.attendanceRate}%` }}
                />
              </div>

              {/* Statistics grid */}
              <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-200 pt-3 sm:pt-4 relative z-10">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Total</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">{item.total}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Present</p>
                  <p className="text-base sm:text-lg font-bold text-emerald-600">{item.present}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Absent</p>
                  <p className="text-base sm:text-lg font-bold text-rose-600">{item.absent}</p>
                </div>
              </div>

              {/* Additional info */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 relative z-10">
                <p className="text-xs text-slate-500">
                  <span className="font-semibold">{item.totalMarked}</span> records marked
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Summary Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-200 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800">📊 Analytics Summary</h3>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            This analytics dashboard provides a comprehensive view of attendance patterns across all classes. 
            Use the date range filters to focus on specific periods. Classes with attendance rates above 80% are performing well, 
            while those below 50% may require intervention.
          </p>
        </div>
      </div>
    </section>
  );
}
