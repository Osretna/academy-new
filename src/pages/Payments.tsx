import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  CreditCard, 
  Users, 
  CheckCircle2, 
  Calendar,
  MessageSquare
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format } from 'date-fns';

export default function Payments() {
  const [searchPhone, setSearchPhone] = useState('');
  const [foundPlayer, setFoundPlayer] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load recent payments
  useEffect(() => {
    const q = query(collection(db, 'payments'), serverTimestamp() ? where('date', '!=', null) : where('amount', '>', 0)); // simple placeholder
    const unsubscribe = onSnapshot(collection(db, 'payments'), (snapshot) => {
      const pData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPayments(pData.sort((a: any, b: any) => b.date?.seconds - a.date?.seconds).slice(0, 5));
    });
    return unsubscribe;
  }, []);

  const handleSearch = async () => {
    if (!searchPhone) return;
    setLoading(true);
    setFoundPlayer(null);
    try {
      const q = query(collection(db, 'players'), where('phone', '==', searchPhone));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setFoundPlayer({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        alert("لم يتم العثور على اللاعب. يرجى التحقق من الرقم.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async (e: any) => {
    e.preventDefault();
    if (!foundPlayer || !amount) return;

    try {
      await addDoc(collection(db, 'payments'), {
        playerId: foundPlayer.id,
        playerName: foundPlayer.name,
        amount: Number(amount),
        date: serverTimestamp(),
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFoundPlayer(null);
      setSearchPhone('');
      setAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-3xl font-bold font-display text-white">الاشتراكات والتحصيل</h2>
        <p className="text-white/60 font-display">إدارة المدفوعات والاشتراكات الشهرية</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Collection Section */}
        <div className="space-y-6">
          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
              <CreditCard className="text-brand-primary" size={20} />
              <span>تحصيل اشتراك</span>
            </h3>

            <div className="flex gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input 
                  type="text" 
                  placeholder="ابحث برقم الهاتف (05xxxxxxxx)..."
                  className="w-full glass-input pr-12"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="glass-button px-8 whitespace-nowrap disabled:opacity-50"
              >
                {loading ? 'جاري البحث...' : 'بحث'}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {foundPlayer && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-brand-primary/20">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10">
                      {foundPlayer.photoUrl ? (
                        <img src={foundPlayer.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          <Users size={32} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold font-display">{foundPlayer.name}</h4>
                      <p className="text-sm text-white/40 font-display">الفئة: {foundPlayer.ageCategory}</p>
                    </div>
                  </div>

                  <form onSubmit={handleCollect} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-white/60 font-display">المبلغ المراد تحصيله ($)</label>
                      <input 
                        type="number" 
                        required 
                        className="w-full glass-input text-2xl font-bold py-4 text-center text-brand-primary"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="w-full glass-button font-bold py-4 justify-center text-lg">
                      تأكيد التحصيل وإرسال الإشعار
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {success && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/30 text-brand-primary"
              >
                <CheckCircle2 size={24} />
                <span className="font-display font-bold text-sm">تم التحصيل بنجاح! تم إرسال رسالة نصية تفصيلية.</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="space-y-6">
          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
              <Calendar className="text-brand-secondary" size={20} />
              <span>آخر العمليات</span>
            </h3>

            <div className="space-y-4">
              {payments.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <h4 className="font-display font-medium text-white">{p.playerName}</h4>
                        <p className="text-xs text-white/40">
                          {p.date ? format(p.date.toDate(), 'yyyy/MM/dd • hh:mm a') : 'جاري المعالجة...'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-brand-primary font-display">${p.amount}</span>
                      <p className="text-[10px] text-white/30 uppercase tracking-tighter">مدفوع</p>
                    </div>
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <div className="text-center py-12 text-white/20">
                  <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-display">لا توجد عمليات تحصيل بعد</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
