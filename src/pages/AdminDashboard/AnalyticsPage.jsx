import { useMemo } from 'react';
import { useAdminData } from '../../contexts/AdminDataContext';

export default function AnalyticsPage() {
  const { students, attendance } = useAdminData();

  const byClass = useMemo(() => {
    const classMap = new Map();

    students.forEach((student) => {
      if (!classMap.has(student.className)) {
        classMap.set(student.className, { total: 0, present: 0, absent: 0 });
      }
      classMap.get(student.className).total += 1;
    });

    attendance.forEach((entry) => {
      if (!classMap.has(entry.className)) {
        classMap.set(entry.className, { total: 0, present: 0, absent: 0 });
      }
      if (entry.status === 'present') classMap.get(entry.className).present += 1;
      if (entry.status === 'absent') classMap.get(entry.className).absent += 1;
    });

    return Array.from(classMap.entries()).map(([className, values]) => {
      const totalMarked = values.present + values.absent;
      const rate = totalMarked > 0 ? Math.round((values.present / totalMarked) * 100) : 0;
      return { className, ...values, attendanceRate: rate };
    });
  }, [students, attendance]);

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Analytics & Trends</h2>
          <p className="text-slate-500 mt-2 font-medium">Review attendance rates and class-level performance metrics.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {byClass.map((item, index) => (
          <article 
            key={item.className} 
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Subtle background accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity -translate-y-1/2 translate-x-1/3 delay-${index * 100}`}></div>

            <div className="flex items-center justify-between relative z-10">
              <h3 className="font-bold text-lg text-slate-800">{item.className}</h3>
              <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                item.attendanceRate >= 80 ? 'bg-emerald-100 text-emerald-700' :
                item.attendanceRate >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {item.attendanceRate}%
              </span>
            </div>
            
            <div className="mt-5 h-2.5 bg-slate-100 rounded-full overflow-hidden relative z-10 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  item.attendanceRate >= 80 ? 'bg-emerald-500' :
                  item.attendanceRate >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${item.attendanceRate}%` }}
              />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-4 relative z-10">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Total</p>
                <p className="text-lg font-bold text-slate-800">{item.total}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Present</p>
                <p className="text-lg font-bold text-emerald-600">{item.present}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Absent</p>
                <p className="text-lg font-bold text-rose-600">{item.absent}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
