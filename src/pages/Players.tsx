import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Camera, 
  Search, 
  Trash2, 
  MoreVertical,
  QrCode as QrIcon
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc,
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { QRCodeSVG } from 'qrcode.react';

export default function Players() {
  const [players, setPlayers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load players
  useEffect(() => {
    const q = query(collection(db, 'players'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const toggleCamera = async () => {
    if (!showCamera) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setShowCamera(true);
      } catch (err) {
        console.error("Camera error:", err);
        alert("لا يمكن الوصول للكاميرا");
      }
    } else {
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/webp');
        setPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      ageCategory: formData.get('category'),
      photoUrl: photo,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'players'), data);
      setIsAdding(false);
      setPhoto(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPlayers = players.filter(p => 
    p.name?.includes(search) || p.phone?.includes(search)
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 pb-20"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-white">إدارة اللاعبين</h2>
          <p className="text-white/60 font-display">عرض، إضافة، وتعديل بيانات لاعبي الأكاديمية</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="glass-button bg-brand-primary/20 text-brand-primary"
        >
          <UserPlus size={20} />
          <span>إضافة لاعب جديد</span>
        </button>
      </header>

      <div className="glass-panel relative">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="ابحث بالاسم أو رقم الهاتف..."
          className="w-full glass-input pr-12 focus:border-brand-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPlayers.map((player) => (
            <motion.div 
              key={player.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel overflow-hidden group"
            >
              <div className="h-32 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 relative">
                {player.photoUrl ? (
                  <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-100" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users size={48} className="text-white/10" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <QRCodeSVG value={player.id} size={40} bgColor="transparent" fgColor="white" />
                </div>
              </div>
              <div className="p-6 pt-12 relative">
                <div className="absolute -top-10 right-6 w-20 h-20 rounded-2xl border-4 border-dark-bg bg-white/10 backdrop-blur-md overflow-hidden">
                   {player.photoUrl ? (
                    <img src={player.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <Users size={32} />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-display">{player.name}</h3>
                    <p className="text-sm text-white/40">{player.phone}</p>
                  </div>
                  <button 
                    onClick={() => deleteDoc(doc(db, 'players', player.id))}
                    className="p-2 text-white/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-lg bg-white/5 text-[10px] text-white/60 font-display">
                    {player.ageCategory || 'غير محدد'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Player Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if(!showCamera) setIsAdding(false); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-xl p-8 relative z-10"
            >
              <h3 className="text-2xl font-bold font-display mb-6">تسجيل لاعب جديد</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden glass-panel border-2 border-brand-primary/20 relative group">
                    {photo ? (
                      <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <Users size={48} />
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={toggleCamera}
                      className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <Camera size={32} className="text-brand-primary" />
                    </button>
                  </div>
                  <p className="text-sm text-white/40 font-display">التقط صورة اللاعب</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/60 font-display">الاسم الكامل</label>
                    <input name="name" required className="w-full glass-input" placeholder="اسم اللاعب" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/60 font-display">رقم الهاتف</label>
                    <input name="phone" required className="w-full glass-input" placeholder="05xxxxxxxx" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/60 font-display">الفئة العمرية</label>
                    <select name="category" className="w-full glass-input bg-dark-bg">
                      <option value="براعم">براعم (تحت 10)</option>
                      <option value="ناشئين">ناشئين (10-15)</option>
                      <option value="شباب">شباب (15-20)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 glass-button font-bold py-3 justify-center">حفظ البيانات</button>
                  <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 rounded-lg border border-white/10 text-white/60 hover:bg-white/5">إلغاء</button>
                </div>
              </form>

              {/* Camera Overlay */}
              {showCamera && (
                <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 p-4">
                  <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden glass-panel border border-brand-primary/50">
                    <video ref={videoRef} autoPlay playsInline className="w-full bg-black" />
                    <div className="absolute inset-x-0 bottom-8 flex justify-center gap-8">
                      <button 
                        onClick={capturePhoto}
                        className="w-16 h-16 rounded-full bg-brand-primary text-dark-bg flex items-center justify-center shadow-lg shadow-brand-primary/40 hover:scale-110 transition-transform"
                      >
                        <Camera size={32} />
                      </button>
                      <button 
                         onClick={stopCamera}
                         className="p-4 rounded-xl glass-panel text-white hover:bg-white/10"
                      >
                        إغلاق
                      </button>
                    </div>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
