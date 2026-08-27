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
        {['💖', '✨', '📸', '🌸', '💬', '✨'][Math.floor(Math.random() * 6)]}
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

  // Navigasi Dashboard ('chat' atau 'photobooth')
  const [activeTab, setActiveTab] = useState('chat');

  // Fitur Live Chat & Mood
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [partnerMood, setPartnerMood] = useState('😊 Normal / Senang');
  const [myMood, setMyMood] = useState('😊 Normal / Senang');

  // Fitur Photobooth State
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [myPhoto, setMyPhoto] = useState(null);
  const [partnerPhoto, setPartnerPhoto] = useState(null);
  const [boothStatus, setBoothStatus] = useState('idle'); 
  const [finalStripUrl, setFinalStripUrl] = useState(null); // URL Gambar Photobooth Gabungan

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      } else if (data.type === 'photobooth-photo') {
        setPartnerPhoto(data.photo);
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

  // --- PHOTOBOOTH LOGIC ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
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

  const triggerCountdownAndCapture = () => {
    setCountdown(3);
    setBoothStatus('countdown');

    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        setCountdown(null);
        capturePhoto();
      }
    }, 1000);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    // Atur resolusi sedikit lebih besar agar tidak pecah
    canvas.width = 640; 
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    // Balik gambar (mirror) agar terlihat natural
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    setMyPhoto(photoData);
    setBoothStatus('waiting');
    stopCamera();

    if (conn) {
      conn.send({ type: 'photobooth-photo', photo: photoData });
    }
  };

  // Fungsi Pembantu untuk menggambar gambar dengan border-radius pada Canvas murni
  const drawRoundedImage = (ctx, img, x, y, width, height, radius) => {
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
    
    ctx.drawImage(img, x, y, width, height);
    ctx.restore();
    
    // Gambar border di sekeliling foto
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
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffe4e6'; // Warna rose-100 (mirip digambar)
    ctx.stroke();
    ctx.restore();
  };

  // FUNGSI UTAMA: MENGGABUNGKAN KEDUA FOTO MENJADI 1 GAMBAR STRIP CANVAS MURNI (Desain Persis SS)
  useEffect(() => {
    if (myPhoto && partnerPhoto) {
      setBoothStatus('ready');
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.5 } });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Ukuran Kanvas Mengikuti Desain (Sekitar Rasio Kartu Photobooth)
      canvas.width = 600;
      canvas.height = 1000;

      // 1. Gambar Background Utama (Putih dengan Border Bulat Pink Tebal)
      // Tambah shadow efek
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
      
      // Background Putih Box
      ctx.fillStyle = '#ffffff';
      const boxX = 30;
      const boxY = 30;
      const boxW = 540;
      const boxH = 940;
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

      // Reset Shadow
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Gambar Border Pink Luar
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#fbcfe8'; // Warna pink lembut seperti di SS
      ctx.stroke();

      // 2. Header Teks Photobooth
      ctx.fillStyle = '#f43f5e'; // Warna pink tua/merah untuk judul
      ctx.font = '900 24px sans-serif'; // Bold
      ctx.textAlign = 'center';
      ctx.fillText('OUR PHOTOBOOTH DATE 📸 ✨', canvas.width / 2, 110);

      // 3. Load & Gambar Foto 1 (Kamu)
      const img1 = new Image();
      img1.crossOrigin = 'anonymous';
      img1.src = myPhoto;
      img1.onload = () => {
        // Koordinat dan Ukuran Foto 1
        drawRoundedImage(ctx, img1, 80, 160, 440, 310, 30);
        
        // 4. Load & Gambar Foto 2 (Pasangan)
        const img2 = new Image();
        img2.crossOrigin = 'anonymous';
        img2.src = partnerPhoto;
        img2.onload = () => {
          // Koordinat dan Ukuran Foto 2
          drawRoundedImage(ctx, img2, 80, 500, 440, 310, 30);

          // 5. Garis Pemisah (Divider)
          ctx.beginPath();
          ctx.moveTo(80, 860);
          ctx.lineTo(520, 860);
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#fecdd3';
          ctx.stroke();

          // 6. Footer Teks (Nama & Tanggal)
          ctx.fillStyle = '#a8a29e'; // Warna teks abu kecoklatan
          ctx.font = '900 18px sans-serif'; // Bold
          ctx.textAlign = 'left';
          ctx.fillText(`${myName} & ${partnerName}`, 80, 910);

          ctx.textAlign = 'right';
          const today = new Date();
          const dateString = `${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}`;
          ctx.fillText(dateString, 520, 910);

          // Simpan hasil gabungan menjadi URL Gambar (Kualitas Tinggi)
          setFinalStripUrl(canvas.toDataURL('image/png', 1.0));
        };
      };
    }
  }, [myPhoto, partnerPhoto]);

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
              Ruang interaktif real-time. Ngobrol, ubah status mood, dan ambil foto photobooth bareng pasangan secara jarak jauh!
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

              <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'chat' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => {
                    setActiveTab('photobooth');
                    if (!cameraActive && !myPhoto) startCamera();
                  }}
                  className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'photobooth' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}
                >
                  📸 Photobooth
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

            {/* TAB 2: PHOTOBOOTH */}
            {activeTab === 'photobooth' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 overflow-y-auto p-1">
                
                {/* 1. BELUM FOTO */}
                {!myPhoto && (
                  <div className="space-y-3 w-full text-center">
                    <div className="relative w-full max-w-[280px] h-[210px] mx-auto bg-black rounded-2xl overflow-hidden border-4 border-rose-200 shadow-md">
                      {/* PENTING: Tambahkan transform: scaleX(-1) pada video agar kamera HP depan tidak terbalik! */}
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                      
                      {countdown !== null && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                          <span className="text-7xl font-black text-white animate-bounce">{countdown}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-stone-500">Posisikan wajahmu dengan manis di depan kamera!</p>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={triggerCountdownAndCapture}
                      disabled={countdown !== null}
                      className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-md text-sm cursor-pointer disabled:opacity-50"
                    >
                      📸 Ambil Foto Sekarang!
                    </motion.button>
                  </div>
                )}

                {/* 2. MENUNGGU PASANGAN */}
                {myPhoto && boothStatus === 'waiting' && (
                  <div className="space-y-4 text-center my-auto">
                    <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-rose-300 shadow">
                      <img src={myPhoto} alt="My Photo" className="w-full h-full object-cover transform scale-x-100" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl animate-spin">⏳</div>
                      <h3 className="font-bold text-stone-800 text-sm">Foto kamu berhasil diambil!</h3>
                      <p className="text-xs text-stone-500 animate-pulse">Menunggu foto dari {partnerName}...</p>
                    </div>
                  </div>
                )}

                {/* 3. TAMPILAN GAMBAR CANVAS JADI & TOMBOL DOWNLOAD */}
                {boothStatus === 'ready' && finalStripUrl && (
                  <div className="space-y-4 w-full flex flex-col items-center my-auto pt-4">
                    
                    {/* Tampilkan TEPAT DARI CANVAS (sudah ada frame pink, judul, dll) */}
                    <div className="w-[280px] drop-shadow-2xl">
                      <img src={finalStripUrl} alt="Hasil Photobooth" className="w-full h-auto object-contain" />
                    </div>

                    <div className="flex gap-2 w-full max-w-[280px] pt-2">
                      <a
                        href={finalStripUrl}
                        download={`Photobooth_${myName}_dan_${partnerName}.png`}
                        className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl shadow-md text-xs text-center cursor-pointer block hover:scale-105 transition"
                      >
                        📥 Download (PNG)
                      </a>
                      <button
                        onClick={() => {
                          setMyPhoto(null);
                          setPartnerPhoto(null);
                          setFinalStripUrl(null);
                          setBoothStatus('idle');
                          startCamera();
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