import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      // For demo purposes, we'll just navigate.
      // In a real app, we'd use Firebase Auth.
      localStorage.setItem('isAuth', 'true');
      navigate('/');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-dark-bg/50 rtl" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-10 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-secondary/10 rounded-full blur-3xl" />

        <div className="text-center mb-10 relative">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary mx-auto flex items-center justify-center text-dark-bg mb-4 shadow-lg shadow-brand-primary/20">
            <BarChart3 size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">تسجيل الدخول</h1>
          <p className="text-white/60 font-display">أكاديمية المحترفين الرياضية</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative">
          <div className="space-y-2">
            <label className="text-sm text-white/60 font-display pr-1">اسم المستخدم</label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" 
                required 
                className="w-full glass-input pr-12" 
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/60 font-display pr-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="password" 
                required 
                className="w-full glass-input pr-12" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm font-display text-center"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit" 
            className="w-full py-4 rounded-xl bg-brand-primary text-dark-bg font-bold font-display shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            دخول النظام
          </button>
        </form>

        <div className="mt-10 text-center relative border-t border-white/10 pt-6">
          <p className="text-white/30 text-xs font-display">
            جميع الحقوق محفوظة © 2024 نظام إدارة الأكاديميات
          </p>
        </div>
      </motion.div>
    </div>
  );
}
