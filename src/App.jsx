import React, { useState, useEffect, useRef } from 'react';
import { Peer } from 'peerjs';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Ornamen Melayang Romantis
const LiveOrnaments = React.memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0.2 + Math.random() * 0.4 }}
        animate={{ y: "-10vh", rotate: Math.random() * 360 }}
        transition={{
          duration: 12 + Math.random() * 15,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 10
        }}
        className="absolute text-xl sm:text-2xl"
        style={{ fontSize: `${Math.random() * 15 + 20}px` }}
      >
        {['💖', '✨', '📸', '🌸', '🎀', '🧸', '💌', '⭐'][Math.floor(Math.random() * 8)]}
      </motion.div>
    ))}
  </div>
));

export default function LiveLoveRoomWithPhotobooth() {
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Setup Room & Nama
  const [mode, setMode] = useState('menu'); 
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [myName, setMyName] = useState('');
  const [partnerName, setPartnerName] = useState('Ayang');
  const [statusText, setStatusText] = useState('Menunggu koneksi...');

  // Navigasi Dashboard ('chat', 'photobooth', atau 'notes')
  const [activeTab, setActiveTab] = useState('chat');

  // Fitur Live Chat & Mood
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [partnerMood, setPartnerMood] = useState('😊 Normal / Senang');
  const [myMood, setMyMood] = useState('😊 Normal / Senang');

  // Fitur Love Notes (Catatan Hati) State
  const [notes, setNotes] = useState([]);
  const [inputNote, setInputNote] = useState('');

  // Fitur Photobooth Custom Layout & Ornamen State
  const [selectedLayout, setSelectedLayout] = useState('1x2'); 
  const [selectedTheme, setSelectedTheme] = useState('rose'); 
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState(null);
  
  const [myPhotos, setMyPhotos] = useState([]);
  const [partnerPhotos, setPartnerPhotos] = useState([]);
  
  const [boothStep, setBoothStep] = useState('select-layout'); 
  const [finalStripUrl, setFinalStripUrl] = useState(null);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 1. BUAT ROOM (HOST)
  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!myName.trim()) {
      alert('Masukkan nama kamu dulu ya!');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);
    setMode('waiting-host');

    const newPeer = new Peer(`bucin-room-${code}`);
    
    newPeer.on('open', () => {
      setStatusText(`Room aktif! Bagikan kode ${code} ke pasanganmu.`);
    });

    newPeer.on('connection', (connection) => {
      setConn(connection);
      setupConnection(connection);
    });

    setPeer(newPeer);
  };

  // 2. GABUNG ROOM (CLIENT)
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!myName.trim() || !inputCode.trim()) {
      alert('Masukkan nama dan kode room!');
      return;
    }
    setRoomCode(inputCode);
    setMode('connecting');
    setStatusText('Menghubungkan ke ruangan...');

    const newPeer = new Peer();

    newPeer.on('open', () => {
      const connection = newPeer.connect(`bucin-room-${inputCode}`);
      setConn(connection);
      setupConnection(connection);
    });

    newPeer.on('error', () => {
      alert('Gagal terhubung! Pastikan kode room benar.');
      setMode('join');
    });

    setPeer(newPeer);
  };

  const setupConnection = (connection) => {
    connection.on('open', () => {
      setIsConnected(true);
      setStatusText('Terhubung dengan Ayang! ❤️');
      connection.send({ type: 'init', name: myName, mood: myMood });
    });

    connection.on('data', (data) => {
      if (data.type === 'init') {
        setPartnerName(data.name);
        setPartnerMood(data.mood);
      } else if (data.type === 'chat') {
        setMessages((prev) => [...prev, { sender: 'partner', text: data.text, time: data.time }]);
      } else if (data.type === 'mood') {
        setPartnerMood(data.mood);
      } else if (data.type === 'love-tap') {
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
      } else if (data.type === 'love-note') {
        setNotes((prev) => [data.note, ...prev]);
      } else if (data.type === 'photobooth-start-sync') {
        setSelectedLayout(data.layout);
        setSelectedTheme(data.theme);
        startCapturingSequence();
      } else if (data.type === 'photobooth-package') {
        setPartnerPhotos(data.photos);
      }
    });

    connection.on('close', () => {
      setIsConnected(false);
      setStatusText('Pasangan terputus / keluar room.');
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !conn) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgObj = { type: 'chat', text: inputMessage, time: timeStr };

    conn.send(msgObj);
    setMessages((prev) => [...prev, { sender: 'me', text: inputMessage, time: timeStr }]);
    setInputMessage('');
  };

  const handleSendNote = (e) => {
    e.preventDefault();
    if (!inputNote.trim()) return;

    const newNote = {
      id: Date.now(),
      sender: myName,
      text: inputNote,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: ['bg-pink-100 text-pink-900', 'bg-yellow-100 text-yellow-900', 'bg-purple-100 text-purple-900', 'bg-rose-100 text-rose-900'][Math.floor(Math.random() * 4)]
    };

    setNotes((prev) => [newNote, ...prev]);
    if (conn) {
      conn.send({ type: 'love-note', note: newNote });
    }
    setInputNote('');
  };

  const handleMoodChange = (newMood) => {
    setMyMood(newMood);
    if (conn) {
      conn.send({ type: 'mood', mood: newMood });
    }
  };

  const handleSendLoveTap = () => {
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    if (conn) {
      conn.send({ type: 'love-tap' });
    }
  };

  // --- PHOTOBOOTH LOGIC BERSIH & BENAR ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }, 
        audio: false 
      });
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(e => console.log("Play interrupted:", e));
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
      alert("Tidak dapat mengakses kamera. Pastikan izin kamera aktif!");
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  const getRequiredPhotosCount = () => {
    if (selectedLayout === '1x2') return 2;
    if (selectedLayout === '1x3') return 3;
    if (selectedLayout === '2x2') return 2;
    if (selectedLayout === 'polaroid') return 1;
    return 2;
  };

  const handleInitiateCapture = () => {
    if (conn) {
      conn.send({
        type: 'photobooth-start-sync',
        layout: selectedLayout,
        theme: selectedTheme
      });
    }
    startCapturingSequence();
  };

  const startCapturingSequence = async () => {
    setBoothStep('capturing');
    await startCamera();
    takePhotosLoop(0, []);
  };

  const takePhotosLoop = (index, accumulatedPhotos) => {
    const total = getRequiredPhotosCount();
    if (index >= total) {
      stopCamera();
      setMyPhotos(accumulatedPhotos);
      setBoothStep('waiting');

      if (conn) {
        conn.send({
          type: 'photobooth-package',
          photos: accumulatedPhotos
        });
      }
      return;
    }

    setCountdown(3);
    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        setCountdown(null);

        if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 480;
          const ctx = canvas.getContext('2d');
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          
          const photoData = canvas.toDataURL('image/jpeg', 0.7);
          const nextPhotos = [...accumulatedPhotos, photoData];
          
          setTimeout(() => {
            takePhotosLoop(index + 1, nextPhotos);
          }, 800);
        }
      }
    }, 1000);
  };

  useEffect(() => {
    if (myPhotos.length > 0 && partnerPhotos.length > 0) {
      setBoothStep('ready');
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
      generatePhotoboothCanvas();
    }
  }, [myPhotos, partnerPhotos]);

  const generatePhotoboothCanvas = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let themeConfig = {
      bg: '#fff1f2',
      border: '#f43f5e',
      accent: '#fb7185',
      text: '#881337',
      cardBg: '#ffffff'
    };

    if (selectedTheme === 'purple') {
      themeConfig = { bg: '#f3e8ff', border: '#9333ea', accent: '#a855f7', text: '#581c87', cardBg: '#ffffff' };
    } else if (selectedTheme === 'peach') {
      themeConfig = { bg: '#ffedd5', border: '#ea580c', accent: '#f97316', text: '#7c2d12', cardBg: '#ffffff' };
    } else if (selectedTheme === 'mono') {
      themeConfig = { bg: '#f5f5f4', border: '#292524', accent: '#78716c', text: '#1c1917', cardBg: '#ffffff' };
    }

    canvas.width = 700;
    canvas.height = 1250;

    ctx.fillStyle = themeConfig.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12;

    ctx.fillStyle = themeConfig.cardBg;
    const boxX = 35;
    const boxY = 35;
    const boxW = 630;
    const boxH = 1180;
    const boxRadius = 40;

    ctx.beginPath();
    ctx.moveTo(boxX + boxRadius, boxY);
    ctx.lineTo(boxX + boxW - boxRadius, boxY);
    ctx.quadraticCurveTo(boxX + boxW, boxY, boxX + boxW, boxY + boxRadius);
    ctx.lineTo(boxX + boxW, boxY + boxH - boxRadius);
    ctx.quadraticCurveTo(boxX + boxW, boxY + boxH, boxX + boxW - boxRadius, boxY + boxH);
    ctx.lineTo(boxX + boxRadius, boxY + boxH);
    ctx.quadraticCurveTo(boxX, boxY + boxH, boxX, boxY + boxH - boxRadius);
    ctx.lineTo(boxX, boxY + boxRadius);
    ctx.quadraticCurveTo(boxX, boxY, boxX + boxRadius, boxY);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.lineWidth = 12;
    ctx.strokeStyle = themeConfig.border;
    ctx.stroke();

    ctx.fillStyle = themeConfig.text;
    ctx.font = '900 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ OUR LOVELY PHOTOBOOTH ✨', canvas.width / 2, 90);

    ctx.font = '22px sans-serif';
    ctx.fillText('💖 🧸 🎀 📸 🌟 🌸', canvas.width / 2, 125);

    let combinedPhotos = [...myPhotos, ...partnerPhotos];

    const loadImage = (src) => {
      return new Promise((resolve) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    };

    const drawCoverImage = async (photoSrc, x, y, width, height, radius) => {
      const img = await loadImage(photoSrc);
      if (!img) return;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.clip();

      const imgRatio = img.width / img.height;
      const targetRatio = width / height;
      let sWidth = img.width;
      let sHeight = img.height;
      let sX = 0;
      let sY = 0;

      if (imgRatio > targetRatio) {
        sWidth = img.height * targetRatio;
        sX = (img.width - sWidth) / 2;
      } else {
        sHeight = img.width / targetRatio;
        sY = (img.height - sHeight) / 2;
      }

      ctx.drawImage(img, sX, sY, sWidth, sHeight, x, y, width, height);
      ctx.restore();
      
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = themeConfig.border;
      ctx.stroke();
      ctx.restore();
    };

    if (selectedLayout === '1x2') {
      await drawCoverImage(combinedPhotos[0], 75, 155, 550, 390, 25);
      await drawCoverImage(combinedPhotos[1] || combinedPhotos[0], 75, 565, 550, 390, 25);
    } else if (selectedLayout === '1x3') {
      await drawCoverImage(combinedPhotos[0], 85, 150, 530, 260, 20);
      await drawCoverImage(combinedPhotos[1] || combinedPhotos[0], 85, 430, 530, 260, 20);
      await drawCoverImage(combinedPhotos[2] || combinedPhotos[0], 85, 710, 530, 260, 20);
    } else if (selectedLayout === '2x2') {
      await drawCoverImage(combinedPhotos[0], 70, 155, 265, 380, 20);
      await drawCoverImage(combinedPhotos[1] || combinedPhotos[0], 365, 155, 265, 380, 20);
      await drawCoverImage(combinedPhotos[2] || combinedPhotos[0], 70, 560, 265, 380, 20);
      await drawCoverImage(combinedPhotos[3] || combinedPhotos[1] || combinedPhotos[0], 365, 560, 265, 380, 20);
    } else if (selectedLayout === 'polaroid') {
      await drawCoverImage(combinedPhotos[0], 100, 155, 500, 600, 15);
      ctx.fillStyle = '#1c1917';
      ctx.font = 'italic 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`"Our Sweet Moment Together"`, canvas.width / 2, 800);
    }

    ctx.beginPath();
    ctx.moveTo(70, 1020);
    ctx.lineTo(630, 1020);
    ctx.lineWidth = 2;
    ctx.strokeStyle = themeConfig.accent;
    ctx.stroke();

    ctx.fillStyle = themeConfig.border;
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎀  MADE WITH LOVE & FOREVER TOGETHER  🎀', canvas.width / 2, 1065);

    ctx.fillStyle = '#57534e';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`👥 ${myName} & ${partnerName}`, 75, 1120);

    ctx.textAlign = 'right';
    const today = new Date();
    ctx.fillText(`📅 ${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}`, 625, 1120);

    setFinalStripUrl(canvas.toDataURL('image/png', 1.0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-purple-200 flex items-center justify-center p-4 overflow-hidden relative font-sans text-stone-800">
      <LiveOrnaments />

      <AnimatePresence mode="wait">
        
        {/* MENU UTAMA */}
        {mode === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_15px_50px_rgba(244,63,94,0.15)] border border-rose-100 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <div className="text-5xl mb-2">📸💞</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Live Space & Photobooth
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Ruang interaktif real-time. Ngobrol, ubah status mood, catatan hati, dan ambil foto photobooth bareng pasangan!
            </p>

            <div className="space-y-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('create')}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-md transition cursor-pointer text-sm"
              >
                ✨ Buat Room Baru
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('join')}
                className="w-full py-4 bg-white hover:bg-rose-50 text-rose-600 border-2 border-rose-200 font-bold rounded-2xl transition cursor-pointer text-sm"
              >
                🔗 Gabung ke Room Pasangan
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* BUAT ROOM */}
        {mode === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_15px_50px_rgba(244,63,94,0.15)] border border-rose-100 max-w-md w-full space-y-5 relative z-10 text-left"
          >
            <h2 className="text-xl font-bold text-stone-900 text-center">Buat Room Baru</h2>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Nama Kamu:</label>
                <input 
                  type="text"
                  value={myName}
                  onChange={(e) => setMyName(e.target.value)}
                  placeholder="Cth: Arif"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-medium bg-stone-50 text-sm"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 bg-rose-500 text-white font-bold rounded-2xl shadow-md text-sm cursor-pointer"
              >
                Generate Kode Room 🚀
              </motion.button>
              <button
                type="button"
                onClick={() => setMode('menu')}
                className="w-full text-xs text-stone-400 hover:text-stone-700 font-medium text-center pt-2"
              >
                ← Kembali
              </button>
            </form>
          </motion.div>
        )}

        {/* MENUNGGU PASANGAN (HOST) */}
        {mode === 'waiting-host' && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_15px_50px_rgba(244,63,94,0.15)] border border-rose-100 max-w-md w-full space-y-6 text-center relative z-10"
          >
            <div className="text-4xl animate-pulse">⏳</div>
            <h3 className="text-lg font-bold text-stone-900">Bagikan Kode Ini ke Pasanganmu:</h3>
            <div className="bg-rose-50 border-2 border-dashed border-rose-300 py-4 rounded-2xl">
              <span className="text-4xl font-black text-rose-600 tracking-widest">{roomCode}</span>
            </div>
            <p className="text-xs text-stone-500 animate-pulse">{statusText}</p>
            {isConnected && (
              <button
                onClick={() => setMode('dashboard')}
                className="w-full py-3.5 bg-green-500 text-white font-bold rounded-2xl shadow-md text-sm cursor-pointer"
              >
                Masuk ke Ruang Live Sekarang! 🎉
              </button>
            )}
            <button
              onClick={() => setMode('menu')}
              className="text-xs text-stone-400 underline pt-2"
            >
              Batal / Keluar
            </button>
          </motion.div>
        )}

        {/* GABUNG ROOM */}
        {mode === 'join' && (
          <motion.div
            key="join"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_15px_50px_rgba(244,63,94,0.15)] border border-rose-100 max-w-md w-full space-y-5 relative z-10 text-left"
          >
            <h2 className="text-xl font-bold text-stone-900 text-center">Gabung ke Room Pasangan</h2>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Nama Kamu:</label>
                <input 
                  type="text"
                  value={myName}
                  onChange={(e) => setMyName(e.target.value)}
                  placeholder="Cth: Rini"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-medium bg-stone-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Masukkan 4 Digit Kode Room:</label>
                <input 
                  type="text"
                  maxLength="4"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Cth: 4821"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-bold text-center tracking-widest text-lg bg-stone-50"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 bg-rose-500 text-white font-bold rounded-2xl shadow-md text-sm cursor-pointer"
              >
                Hubungkan Sekarang 🔗
              </motion.button>
              <button
                type="button"
                onClick={() => setMode('menu')}
                className="w-full text-xs text-stone-400 hover:text-stone-700 font-medium text-center pt-2"
              >
                ← Kembali
              </button>
            </form>
          </motion.div>
        )}

        {/* STATUS MENGHUBUNGKAN */}
        {mode === 'connecting' && (
          <motion.div key="conn" className="bg-white/80 p-8 rounded-3xl text-center space-y-4 max-w-sm w-full">
            <div className="text-4xl animate-spin">💫</div>
            <h3 className="font-bold text-stone-800">{statusText}</h3>
            {isConnected && (
              <button
                onClick={() => setMode('dashboard')}
                className="w-full py-3 bg-green-500 text-white font-bold rounded-xl text-sm"
              >
                Masuk Ruang Live ✨
              </button>
            )}
          </motion.div>
        )}

        {/* DASHBOARD UTAMA */}
        {(mode === 'dashboard' || isConnected) && (
          <motion.div
            key="dash"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl shadow-[0_15px_50px_rgba(244,63,94,0.15)] border border-rose-100 max-w-lg w-full space-y-4 relative z-10 flex flex-col h-[90vh]"
          >
            {/* Header & Tabs */}
            <div className="flex justify-between items-center border-b border-stone-100 pb-3 shrink-0">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-green-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Terhubung Live
                </span>
                <h2 className="text-sm font-bold text-stone-900">{myName} & {partnerName}</h2>
              </div>

              <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold gap-1">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-2.5 py-1.5 rounded-lg transition ${activeTab === 'chat' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-2.5 py-1.5 rounded-lg transition ${activeTab === 'notes' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}
                >
                  💌 Notes
                </button>
                <button
                  onClick={() => setActiveTab('photobooth')}
                  className={`px-2.5 py-1.5 rounded-lg transition ${activeTab === 'photobooth' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}
                >
                  📸 Booth
                </button>
              </div>
            </div>

            {/* TAB 1: CHAT */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
                <div className="grid grid-cols-2 gap-2 shrink-0">
                  <select
                    value={myMood}
                    onChange={(e) => handleMoodChange(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-stone-50 text-stone-800 focus:outline-none"
                  >
                    <option value="😊 Senang">😊 Senang</option>
                    <option value="🥺 Lagi Kangen">🥺 Lagi Kangen</option>
                    <option value="☕ Lagi Santai">☕ Lagi Santai</option>
                    <option value="😴 Mengantuk">😴 Mengantuk</option>
                    <option value="😡 Lagi Ngambek">😡 Lagi Ngambek</option>
                  </select>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendLoveTap}
                    className="py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer"
                  >
                    💖 Kirim Hati / Peluk
                  </motion.button>
                </div>

                <div className="flex-1 bg-stone-50 border border-stone-200/80 rounded-2xl p-3 overflow-y-auto space-y-2.5 flex flex-col">
                  {messages.length === 0 ? (
                    <div className="my-auto text-center text-xs text-stone-400">
                      Kirim sapaan pertamamu ke {partnerName}! 👋
                    </div>
                  ) : (
                    messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col max-w-[80%] ${m.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div
                          className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-medium ${
                            m.sender === 'me'
                              ? 'bg-rose-500 text-white rounded-br-none shadow-sm'
                              : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-sm'
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-[9px] text-stone-400 mt-0.5 px-1">{m.time}</span>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Ketik pesan ke ${partnerName}...`}
                    className="flex-1 px-4 py-3 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-medium bg-stone-50 text-xs sm:text-sm"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-5 py-3 bg-stone-900 text-white font-semibold rounded-2xl text-xs sm:text-sm shadow-sm cursor-pointer"
                  >
                    Kirim ✈️
                  </motion.button>
                </form>
              </div>
            )}

            {/* TAB 2: LOVE NOTES (CATATAN HATI) */}
            {activeTab === 'notes' && (
              <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
                <div className="text-center shrink-0">
                  <h3 className="font-bold text-stone-900 text-sm">💌 Papan Catatan Hati</h3>
                  <p className="text-[11px] text-stone-500">Tinggalkan pesan manis yang langsung nempel di layar kalian berdua!</p>
                </div>

                <form onSubmit={handleSendNote} className="flex gap-2 shrink-0">
                  <input
                    type="text"
                    value={inputNote}
                    onChange={(e) => setInputNote(e.target.value)}
                    placeholder="Tulis pesan/catatan romantis..."
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-medium bg-stone-50 text-xs"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2.5 bg-rose-500 text-white font-bold rounded-2xl text-xs shadow-sm cursor-pointer"
                  >
                    Tempel 📌
                  </motion.button>
                </form>

                <div className="flex-1 bg-stone-50 border border-stone-200/80 rounded-2xl p-3 overflow-y-auto space-y-2.5">
                  {notes.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center text-xs text-stone-400">
                      Belum ada catatan hati. Yuk tulis pesan pertamamu! ✨
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5">
                      {notes.map((note) => (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={note.id}
                          className={`p-3.5 rounded-2xl shadow-xs border border-white/50 ${note.color} flex flex-col justify-between`}
                        >
                          <p className="text-xs sm:text-sm font-medium whitespace-pre-wrap">{note.text}</p>
                          <div className="flex justify-between items-center mt-2 pt-1 border-t border-black/5 text-[10px] opacity-75">
                            <span className="font-bold">— {note.sender}</span>
                            <span>{note.time}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: PHOTOBOOTH SINKRONASI OTOMATIS */}
            {activeTab === 'photobooth' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 overflow-y-auto p-1">
                
                {boothStep === 'select-layout' && (
                  <div className="space-y-3 w-full max-w-xs text-left my-auto">
                    <div className="text-center">
                      <h3 className="font-bold text-stone-900 text-base">Pilih Ukuran & Tema Strip 📸</h3>
                      <p className="text-xs text-stone-500">Pilihanmu otomatis menyamakan perangkat pasanganmu!</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">Pilih Layout:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: '1x2', label: '1x2 (2 Cut Besar)' },
                          { id: '1x3', label: '1x3 (3 Cut Strip)' },
                          { id: '2x2', label: '2x2 (4 Grid)' },
                          { id: 'polaroid', label: '🖼️ Polaroid Solo' }
                        ].map((layout) => (
                          <button
                            key={layout.id}
                            onClick={() => setSelectedLayout(layout.id)}
                            className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              selectedLayout === layout.id
                                ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {layout.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">Pilih Tema & Ornamen:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'rose', label: '🌸 Rose Pink' },
                          { id: 'purple', label: '💜 Lilac Dream' },
                          { id: 'peach', label: '🍑 Warm Peach' },
                          { id: 'mono', label: '🖤 Aesthetic Mono' }
                        ].map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setSelectedTheme(theme.id)}
                            className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              selectedTheme === theme.id
                                ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {theme.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleInitiateCapture}
                      className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl shadow-md text-xs cursor-pointer mt-1"
                    >
                      Mulai Sesi Foto Bersama 🎬
                    </motion.button>
                  </div>
                )}

                {boothStep === 'capturing' && (
                  <div className="space-y-3 w-full text-center my-auto">
                    <div className="relative w-full max-w-[280px] h-[210px] mx-auto bg-stone-900 rounded-2xl overflow-hidden border-4 border-rose-300 shadow-md flex items-center justify-center">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                      
                      {countdown !== null && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                          <span className="text-7xl font-black text-white drop-shadow-lg animate-bounce">{countdown}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-rose-600 animate-pulse">Senyum terbaikmu! Sedang mengambil foto...</p>
                  </div>
                )}

                {boothStep === 'waiting' && (
                  <div className="space-y-4 text-center my-auto">
                    <div className="text-4xl animate-spin">⏳</div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-stone-800 text-sm">Foto kamu berhasil diambil!</h3>
                      <p className="text-xs text-stone-500 animate-pulse">Menunggu foto dari {partnerName}...</p>
                    </div>
                  </div>
                )}

                {boothStep === 'ready' && finalStripUrl && (
                  <div className="space-y-3 w-full flex flex-col items-center my-auto pt-2">
                    <div className="w-[230px] drop-shadow-2xl">
                      <img src={finalStripUrl} alt="Hasil Photobooth Estetik" className="w-full h-auto object-contain rounded-2xl" />
                    </div>

                    <div className="flex gap-2 w-full max-w-[260px] pt-1">
                      <a
                        href={finalStripUrl}
                        download={`Photobooth_${myName}_dan_${partnerName}.png`}
                        className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl shadow-md text-xs text-center block cursor-pointer hover:scale-105 transition"
                      >
                        📥 Download Strip (PNG)
                      </a>
                      <button
                        onClick={() => {
                          setMyPhotos([]);
                          setPartnerPhotos([]);
                          setFinalStripUrl(null);
                          setBoothStep('select-layout');
                        }}
                        className="px-4 py-3 bg-stone-200 text-stone-600 font-bold rounded-xl text-xs hover:bg-stone-300 transition cursor-pointer"
                      >
                        Ulangi 🔄
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}