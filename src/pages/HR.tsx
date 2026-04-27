import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserRound, 
  Calendar, 
  Clock, 
  Search, 
  Plus, 
  Award,
  CircleCheck,
  CircleX
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const StaffCard = ({ staff }: any) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-panel p-6 flex flex-col items-center text-center"
  >
    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 relative overflow-hidden group">
      <UserRound size={48} className="text-white/20" />
      <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Award size={32} className="text-brand-primary" />
      </div>
    </div>
    <h3 className="text-xl font-bold font-display">{staff.name}</h3>
    <p className="text-brand-primary text-sm font-display mb-4">{staff.role}</p>
    
    <div className="grid grid-cols-2 gap-2 w-full">
      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
        <p className="text-xs text-white/40 mb-1 font-display">الحضور</p>
        <p className="font-bold text-white font-display">95%</p>
      </div>
      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
        <p className="text-xs text-white/40 mb-1 font-display">المهمات</p>
        <p className="font-bold text-white font-display">12</p>
      </div>
    </div>

    <button className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-display">
      سجل الحضور الكامل
    </button>
  </motion.div>
);

export default function HR() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Placeholder data since we might not have staff yet
    const placeholderStaff = [
      { id: 1, name: 'كابتن أحمد سليم', role: 'مدرب أول - كرة قدم', attendance: '98%' },
      { id: 2, name: 'د. سارة محمود', role: 'أخصائية تغذية', attendance: '92%' },
      { id: 3, name: 'م. خالد العتيبي', role: 'إداري عام', attendance: '100%' },
      { id: 4, name: 'كابتن يوسف علي', role: 'مدرب لياقة', attendance: '88%' },
    ];
    setStaffList(placeholderStaff);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-white">الموارد البشرية</h2>
          <p className="text-white/60 font-display">إدارة طاقم العمل والمدربين والحضور</p>
        </div>
        <button className="glass-button">
          <Plus size={20} />
          <span>إضافة موظف/مدرب</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-primary/20 text-brand-primary">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-white/40 font-display">متوسط الحضور اليوم</p>
            <h4 className="text-2xl font-bold font-display">94%</h4>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-secondary/20 text-brand-secondary">
            <UserRound size={24} />
          </div>
          <div>
            <p className="text-sm text-white/40 font-display">إجمالي الموظفين</p>
            <h4 className="text-2xl font-bold font-display">24</h4>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-yellow-500/20 text-yellow-500">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm text-white/40 font-display">مدرب الشهر</p>
            <h4 className="text-2xl font-bold font-display">كابتن أحمد</h4>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="البحث عن موظف..."
            className="w-full glass-input pr-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {staffList.filter(s => s.name.includes(search)).map((staff) => (
            <StaffCard key={staff.id} staff={staff} />
          ))}
        </AnimatePresence>
      </div>

      <div className="glass-panel p-8">
        <h3 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
          <Calendar className="text-brand-primary" size={20} />
          <span>سجل الحضور اليومي</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-white/40 text-sm border-b border-white/10">
                <th className="pb-4 font-display font-medium">الموظف</th>
                <th className="pb-4 font-display font-medium">الوقت</th>
                <th className="pb-4 font-display font-medium">الحالة</th>
                <th className="pb-4 font-display font-medium">ملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 font-display font-medium">كابتن عمر خالد</td>
                  <td className="py-4 text-white/60 font-mono">08:15 AM</td>
                  <td className="py-4">
                    <span className="flex items-center gap-2 text-brand-primary text-sm font-display">
                      <CircleCheck size={16} />
                      حاضر
                    </span>
                  </td>
                  <td className="py-4 text-white/40 text-sm font-display">-</td>
                </tr>
              ))}
              <tr>
                <td className="py-4 font-display font-medium">ليلى محمد</td>
                <td className="py-4 text-white/60 font-mono">-</td>
                <td className="py-4">
                  <span className="flex items-center gap-2 text-red-400 text-sm font-display">
                    <CircleX size={16} />
                    غائب
                  </span>
                </td>
                <td className="py-4 text-white/40 text-sm font-display">إجازة سنوية</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
