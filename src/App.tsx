/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  UserRound, 
  LayoutDashboard, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';
import { useState } from 'react';

// Pages (to be implemented)
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Payments from './pages/Payments';
import HR from './pages/HR';
import Login from './pages/Login';

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const location = useLocation();

  const links = [
    { name: 'لوحة التحكم', path: '/', icon: LayoutDashboard },
    { name: 'اللاعبين', path: '/players', icon: Users },
    { name: 'الاشتراكات', path: '/payments', icon: CreditCard },
    { name: 'الموارد البشرية', path: '/hr', icon: UserRound },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={toggle}
        className="fixed top-4 right-4 z-50 p-2 glass-panel md:hidden text-brand-primary"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? '260px' : '0px', x: isOpen ? 0 : 300 }}
        className={`fixed top-0 right-0 h-full z-40 glass-panel border-r-0 border-l border-white/10 overflow-hidden md:relative md:w-64 md:translate-x-0`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-display font-bold text-brand-primary mb-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-dark-bg">
              <BarChart3 size={20} />
            </div>
            <span>PRO HUB</span>
          </h1>

          <nav className="space-y-4">
            {links.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  location.pathname === link.path 
                    ? 'bg-brand-primary text-dark-bg font-bold shadow-lg shadow-brand-primary/20' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <link.icon size={20} />
                <span className="font-display">{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-8 left-0 right-0 px-6">
          <button className="flex items-center gap-3 p-3 rounded-lg w-full text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={20} />
            <span className="font-display">تسجيل الخروج</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="flex min-h-screen rtl overflow-hidden relative" dir="rtl">
        {/* Immersive Background Aura */}
        <div className="bg-aura" />

        {/* Only show sidebar if not on login page */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={
            <>
              <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
              <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen relative z-10">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/players" element={<Players />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/hr" element={<HR />} />
                  </Routes>
                </AnimatePresence>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}
