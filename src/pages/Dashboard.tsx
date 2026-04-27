import { motion } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  UserCheck, 
  Wallet 
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-panel p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <span className="text-white/40 text-sm font-display">اليوم</span>
    </div>
    <h3 className="text-3xl font-bold text-white mb-1 font-display">{value}</h3>
    <p className="text-white/60 text-sm font-display">{title}</p>
  </motion.div>
);

export default function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-white">لوحة التحكم السريعة</h2>
          <p className="text-white/60 font-display">مرحباً بك في نظام إدارة الأكاديمية</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-panel px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-sm font-display">النظام يعمل كالمعتاد</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي اللاعبين" value="1,284" icon={Users} color="bg-brand-primary" />
        <StatCard title="المشتركين النشطين" value="956" icon={UserCheck} color="bg-brand-secondary" />
        <StatCard title="الاشتراكات الجديدة" value="48" icon={TrendingUp} color="bg-purple-500" />
        <StatCard title="تحصيلات الشهر" value="45,200$" icon={Wallet} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-xl font-bold font-display mb-6">نشاط الأكاديمية الأخير</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Users size={18} className="text-white/60" />
                  </div>
                  <div>
                    <h4 className="font-display font-medium">تم تسجيل لاعب جديد</h4>
                    <p className="text-xs text-white/40">محمد أحمد • قبل 10 دقائق</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  i % 2 === 0 ? 'bg-brand-primary/20 text-brand-primary' : 'bg-brand-secondary/20 text-brand-secondary'
                }`}>
                  {i % 2 === 0 ? 'كرة قدم' : 'كرة سلة'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-xl font-bold font-display mb-6">إحصائيات الفئات العمرية</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2 font-display">
                <span>براعم (تحت 10)</span>
                <span className="text-brand-primary">45%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  className="h-full bg-brand-primary shadow-[0_0_10px_rgba(0,255,136,0.5)]"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2 font-display">
                <span>ناشئين (10-15)</span>
                <span className="text-brand-secondary">35%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '35%' }}
                  className="h-full bg-brand-secondary shadow-[0_0_10px_rgba(0,170,255,0.5)]"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2 font-display">
                <span>شباب (15-20)</span>
                <span className="text-purple-500">20%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '20%' }}
                  className="h-full bg-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
