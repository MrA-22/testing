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
  
  // Setup Room & Nama (Persistent dengan LocalStorage)
  const [mode, setMode] = useState(() => localStorage.getItem('bucin_mode') || 'menu'); 
  const [roomCode, setRoomCode] = useState(() => localStorage.getItem('bucin_roomCode') || '');
  const [inputCode, setInputCode] = useState('');
  const [myName, setMyName] = useState(() => localStorage.getItem('bucin_myName') || '');
  const [partnerName, setPartnerName] = useState(() => localStorage.getItem('bucin_partnerName') || 'Ayang');
  const [statusText, setStatusText] = useState('Menunggu koneksi...');

  // Navigasi Dashboard Tabs
  const [activeTab, setActiveTab] = useState('chat');

  // Fitur Live Chat, Mood, Voice Note, & Kado Virtual
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [partnerMood, setPartnerMood] = useState('😊 Normal / Senang');
  const [myMood, setMyMood] = useState('😊 Normal / Senang');
  
  // Voice Note States
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderAudioRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Animasi Floating Love & Gift Effect
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [activeGiftPopup, setActiveGiftPopup] = useState(null);

  // Fitur Love Notes (Catatan Hati)
  const [notes, setNotes] = useState([]);
  const [inputNote, setInputNote] = useState('');

  // Fitur Photobooth Bergantian (Turn-Based) dengan Sinkronisasi Penuh
  const [selectedLayout, setSelectedLayout] = useState('1x2'); 
  const [selectedTheme, setSelectedTheme] = useState('rose'); 
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [allPhotos, setAllPhotos] = useState([]);
  const allPhotosRef = useRef([]);
  const [boothStep, setBoothStep] = useState('select-layout'); 
  const [currentStep, setCurrentStep] = useState(0);
  const [isLeader, setIsLeader] = useState(false);
  const [finalStripUrl, setFinalStripUrl] = useState(null);

  // --- FITUR COUNTER JADIAN ---
  const [anniversaryDate, setAnniversaryDate] = useState(() => localStorage.getItem('bucin_anniversary') || '2024-01-01');
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // --- FITUR QUIZ SEBERAPA KENAL ---
  const quizQuestions = [
    { q: "Apa makanan kesukaan atau jajanan favoritku?", options: ["Seblak/Pedas", "Manis/Dessert", "Makanan Berkuah", "Fast Food"] },
    { q: "Kalau lagi ngambek, biasanya aku paling suka digimanain?", options: ["Diemin dulu", "Dipujuk & ditenangin", "Dikasih makanan", "Diajak ngelawak"] },
    { q: "Tempat impian yang pengen banget kita kunjungi bareng?", options: ["Pegunungan / Villa sejuk", "Pantai / Sunset", "Keliling Luar Negeri", "Taman Bermain / Cafe aesthetic"] }
  ];
  const [quizAnswers, setQuizAnswers] = useState({});
  const [partnerQuizAnswers, setPartnerQuizAnswers] = useState({});

  // --- FITUR MUSIC PLAYER ---
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);

  // --- FITUR BUCKET LIST & DATE IDEAS ---
  const [bucketList, setBucketList] = useState([
    { id: 1, text: "Nonton bioskop genre horor berdua 🍿", done: false },
    { id: 2, text: "Masak malam romantis bersama 🍝", done: false },
    { id: 3, text: "Roadtrip santai sore hari 🛵", done: false }
  ]);
  const [newBucketItem, setNewBucketItem] = useState('');
  const dateIdeas = [
    "Piknik sore di taman kota pakai alas aesthetic 🧺",
    "Belanja cemilan minimarket beda pilihan lalu tukar 🍫",
    "Marathon film masa kecil atau anime favorit 🎬",
    "Karaoke duet lagu romantis di kamar 🎤",
    "Membuat kerajinan tangan / melukis kanvas kecil bareng 🎨"
  ];
  const [randomDateIdea, setRandomDateIdea] = useState("Klik tombol untuk memutar ide kencan! ✨");

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('bucin_mode', mode);
    localStorage.setItem('bucin_roomCode', roomCode);
    localStorage.setItem('bucin_myName', myName);
    localStorage.setItem('bucin_partnerName', partnerName);
    localStorage.setItem('bucin_anniversary', anniversaryDate);
  }, [mode, roomCode, myName, partnerName, anniversaryDate]);

  useEffect(() => {
    allPhotosRef.current = allPhotos;
  }, [allPhotos]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(anniversaryDate);
      const now = new Date();
      const diff = now - start;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeTogether({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // --- FITUR KELUAR SESI / DISCONNECT ---
  const handleLeaveSession = () => {
    if (window.confirm("Yakin ingin keluar dari sesi ruangan ini?")) {
      if (conn) conn.close();
      if (peer) peer.destroy();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      localStorage.removeItem('bucin_mode');
      localStorage.removeItem('bucin_roomCode');
      localStorage.removeItem('bucin_partnerName');

      setMode('menu');
      setRoomCode('');
      setInputCode('');
      setConn(null);
      setPeer(null);
      setIsConnected(false);
      setMessages([]);
      setNotes([]);
      setAllPhotos([]);
      setFinalStripUrl(null);
    }
  };

  // 1. BUAT ROOM (HOST)
  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!myName.trim()) {
      alert('Masukkan nama kamu dulu ya!');
      return;
    }
    const code = roomCode || Math.floor(1000 + Math.random() * 9000).toString();
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
      } else if (data.type === 'chat-voice') {
        setMessages((prev) => [...prev, { sender: 'partner', audio: data.audio, time: data.time, isVoice: true }]);
      } else if (data.type === 'virtual-gift') {
        showGiftPopup(data.giftName, data.giftEmoji, data.sender);
      } else if (data.type === 'mood') {
        setPartnerMood(data.mood);
      } else if (data.type === 'love-tap') {
        triggerLoveEffect();
      } else if (data.type === 'love-note') {
        setNotes((prev) => [data.note, ...prev]);
      } else if (data.type === 'quiz-sync') {
        setPartnerQuizAnswers(data.answers);
      } else if (data.type === 'bucket-sync') {
        setBucketList(data.list);
      } else if (data.type === 'pb-config-sync') {
        setSelectedLayout(data.layout);
        setSelectedTheme(data.theme);
      } else if (data.type === 'pb-start') {
        setSelectedLayout(data.layout);
        setSelectedTheme(data.theme);
        setIsLeader(false);
        setCurrentStep(0);
        setAllPhotos([]);
        setBoothStep('capturing');
      } else if (data.type === 'pb-next-step') {
        const updated = [...allPhotosRef.current, data.photo];
        setAllPhotos(updated);
        setCurrentStep(data.step + 1);
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

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderAudioRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result;
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const voiceMsg = {
            type: 'chat-voice',
            audio: base64Audio,
            time: timeStr
          };
          if (conn) {
            conn.send(voiceMsg);
          }
          setMessages((prev) => [...prev, { sender: 'me', audio: base64Audio, time: timeStr, isVoice: true }]);
        };

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Gagal akses mikrofon:", err);
      alert("Tidak dapat mengakses mikrofon. Pastikan izin mikrofon diizinkan di browser!");
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderAudioRef.current && isRecording) {
      mediaRecorderAudioRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- KADOKU / VIRTUAL GIFT SYSTEM ---
  const sendVirtualGift = (giftName, giftEmoji) => {
    showGiftPopup(giftName, giftEmoji, myName);
    if (conn) {
      conn.send({ type: 'virtual-gift', giftName, giftEmoji, sender: myName });
    }
  };

  const showGiftPopup = (giftName, giftEmoji, sender) => {
    confetti({
      particleCount: 120,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#ff4d6d', '#ffd166', '#06d6a0', '#118ab2', '#ef476f']
    });

    setActiveGiftPopup({ sender, giftName, giftEmoji });
    setTimeout(() => {
      setActiveGiftPopup(null);
    }, 3500);
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

  const triggerLoveEffect = () => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#ff758f', '#ffb3c6', '#fb6f92', '#e63946', '#ffffff']
    });

    const newHearts = Array.from({ length: 18 }).map(() => ({
      id: Math.random(),
      x: Math.random() * 85 + 5,
      emoji: ['❤️', '💖', '💗', '💓', '💕', '💘', '✨'][Math.floor(Math.random() * 7)]
    }));

    setFloatingHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter(h => !newHearts.includes(h)));
    }, 2000);
  };

  const handleSendLoveTap = () => {
    triggerLoveEffect();
    if (conn) {
      conn.send({ type: 'love-tap' });
    }
  };

  const handleLayoutChange = (layoutId) => {
    setSelectedLayout(layoutId);
    if (conn) {
      conn.send({ type: 'pb-config-sync', layout: layoutId, theme: selectedTheme });
    }
  };

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    if (conn) {
      conn.send({ type: 'pb-config-sync', layout: selectedLayout, theme: themeId });
    }
  };

  const startCamera = async () => {
    try {
      if (mediaStreamRef.current) return;
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
    if (selectedLayout === '2x2') return 4;
    if (selectedLayout === 'polaroid') return 1;
    return 2;
  };

  const handleInitiateCapture = () => {
    setIsLeader(true);
    setCurrentStep(0);
    setAllPhotos([]);
    setBoothStep('capturing');
    if (conn) {
      conn.send({ type: 'pb-start', layout: selectedLayout, theme: selectedTheme });
    }
  };

  useEffect(() => {
    if (boothStep === 'capturing') {
      runStep();
    }
  }, [boothStep, currentStep]);

  const runStep = async () => {
    const total = getRequiredPhotosCount();
    if (currentStep >= total) {
      stopCamera();
      setBoothStep('ready');
      generatePhotoboothCanvas(allPhotosRef.current);
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
      return;
    }

    const myTurn = (currentStep % 2 === 0 && isLeader) || (currentStep % 2 !== 0 && !isLeader);

    if (myTurn) {
      await startCamera();
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
            const updated = [...allPhotosRef.current, photoData];
            setAllPhotos(updated);

            if (conn) {
              conn.send({ type: 'pb-next-step', step: currentStep, photo: photoData });
            }
            setCurrentStep(prev => prev + 1);
          }
        }
      }, 1000);
    } else {
      stopCamera();
    }
  };

  const generatePhotoboothCanvas = async (photosToUse) => {
    const photos = photosToUse || allPhotosRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let themeConfig = { bg: '#fff1f2', border: '#f43f5e', accent: '#fb7185', text: '#881337', cardBg: '#ffffff' };
    if (selectedTheme === 'purple') themeConfig = { bg: '#f3e8ff', border: '#9333ea', accent: '#a855f7', text: '#581c87', cardBg: '#ffffff' };
    else if (selectedTheme === 'peach') themeConfig = { bg: '#ffedd5', border: '#ea580c', accent: '#f97316', text: '#7c2d12', cardBg: '#ffffff' };
    else if (selectedTheme === 'mono') themeConfig = { bg: '#f5f5f4', border: '#292524', accent: '#78716c', text: '#1c1917', cardBg: '#ffffff' };

    canvas.width = 700;
    canvas.height = 1250;
    ctx.fillStyle = themeConfig.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 30;
    ctx.fillStyle = themeConfig.cardBg;
    ctx.beginPath();
    ctx.roundRect(35, 35, 630, 1180, 40);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.lineWidth = 12;
    ctx.strokeStyle = themeConfig.border;
    ctx.stroke();

    ctx.fillStyle = themeConfig.text;
    ctx.font = '900 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ OUR LOVELY PHOTOBOOTH ✨', canvas.width / 2, 90);
    ctx.font = '22px sans-serif';
    ctx.fillText('💖 🧸 🎀 📸 🌟 🌸', canvas.width / 2, 125);

    const loadImage = (src) => new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });

    const drawCoverImage = async (photoSrc, x, y, width, height, radius) => {
      const img = await loadImage(photoSrc);
      if (!img) return;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
      ctx.clip();
      const imgRatio = img.width / img.height;
      const targetRatio = width / height;
      let sWidth = img.width, sHeight = img.height, sX = 0, sY = 0;
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
      ctx.roundRect(x, y, width, height, radius);
      ctx.lineWidth = 5;
      ctx.strokeStyle = themeConfig.border;
      ctx.stroke();
      ctx.restore();
    };

    if (selectedLayout === '1x2') {
      await drawCoverImage(photos[0], 75, 155, 550, 390, 25);
      await drawCoverImage(photos[1] || photos[0], 75, 565, 550, 390, 25);
    } else if (selectedLayout === '1x3') {
      await drawCoverImage(photos[0], 85, 150, 530, 260, 20);
      await drawCoverImage(photos[1] || photos[0], 85, 430, 530, 260, 20);
      await drawCoverImage(photos[2] || photos[0], 85, 710, 530, 260, 20);
    } else if (selectedLayout === '2x2') {
      await drawCoverImage(photos[0], 70, 155, 265, 380, 20);
      await drawCoverImage(photos[1] || photos[0], 365, 155, 265, 380, 20);
      await drawCoverImage(photos[2] || photos[0], 70, 560, 265, 380, 20);
      await drawCoverImage(photos[3] || photos[1] || photos[0], 365, 560, 265, 380, 20);
    } else if (selectedLayout === 'polaroid') {
      await drawCoverImage(photos[0], 100, 155, 500, 600, 15);
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

      {/* FLOATING HEARTS OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingHearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ y: "85vh", x: `${h.x}vw`, opacity: 1, scale: 0.5 }}
            animate={{ y: "15vh", opacity: 0, scale: 2, rotate: Math.random() * 60 - 30 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute text-4xl sm:text-5xl"
          >
            {h.emoji}
          </motion.div>
        ))}
      </div>

      {/* VIRTUAL GIFT POPUP OVERLAY */}
      <AnimatePresence>
        {activeGiftPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs pointer-events-none"
          >
            <div className="bg-white/95 border-2 border-rose-300 p-6 rounded-3xl shadow-2xl text-center max-w-xs w-full space-y-3">
              <div className="text-6xl animate-bounce">{activeGiftPopup.giftEmoji}</div>
              <h3 className="text-lg font-black text-rose-600">Kado Spesial Datang! 🎁</h3>
              <p className="text-xs font-semibold text-stone-700">
                <span className="text-rose-500 font-bold">{activeGiftPopup.sender}</span> mengirimkanmu <span className="font-bold underline">{activeGiftPopup.giftName}</span>! ❤️
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUDIO BACKGROUND MUSIC PLAYER */}
      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf756.mp3?filename=lofi-study-112191.mp3" loop />
      <div className="absolute top-4 right-4 z-40 flex gap-2">
        <button
          onClick={() => {
            if (isPlayingMusic) {
              audioRef.current.pause();
            } else {
              audioRef.current.play();
            }
            setIsPlayingMusic(!isPlayingMusic);
          }}
          className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-rose-200 flex items-center gap-2 text-xs font-bold text-rose-600 hover:scale-105 transition cursor-pointer"
        >
          <span>{isPlayingMusic ? '🎶 Pause' : '▶️ Music'}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* MENU UTAMA */}
        {mode === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-rose-100 text-center max-w-md w-full space-y-6 relative z-10">
            <div className="text-5xl mb-2">📸💞</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Live Space & Photobooth</h1>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">Ruang interaktif real-time. Ngobrol, Counter Jadian, Quiz, Bucket List, dan Photobooth bareng pasangan!</p>
            <div className="space-y-3 pt-2">
              <button onClick={() => setMode('create')} className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-md transition cursor-pointer text-sm">✨ Buat Room Baru</button>
              <button onClick={() => setMode('join')} className="w-full py-4 bg-white hover:bg-rose-50 text-rose-600 border-2 border-rose-200 font-bold rounded-2xl transition cursor-pointer text-sm">🔗 Gabung ke Room Pasangan</button>
            </div>
          </motion.div>
        )}

        {/* BUAT ROOM */}
        {mode === 'create' && (
          <motion.div key="create" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-rose-100 max-w-md w-full space-y-5 relative z-10 text-left">
            <h2 className="text-xl font-bold text-stone-900 text-center">Buat Room Baru</h2>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Nama Kamu:</label>
                <input type="text" value={myName} onChange={(e) => setMyName(e.target.value)} placeholder="Cth: Arif" required className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-medium bg-stone-50 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Tanggal Jadian (Anniversary):</label>
                <input type="date" value={anniversaryDate} onChange={(e) => setAnniversaryDate(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-medium bg-stone-50 text-sm" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-rose-500 text-white font-bold rounded-2xl shadow-md text-sm cursor-pointer">Generate Kode Room 🚀</button>
              <button type="button" onClick={() => setMode('menu')} className="w-full text-xs text-stone-400 hover:text-stone-700 font-medium text-center pt-2">← Kembali</button>
            </form>
          </motion.div>
        )}

        {/* MENUNGGU PASANGAN */}
        {mode === 'waiting-host' && (
          <motion.div key="waiting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-rose-100 max-w-md w-full space-y-6 text-center relative z-10">
            <div className="text-4xl animate-pulse">⏳</div>
            <h3 className="text-lg font-bold text-stone-900">Bagikan Kode Ini ke Pasanganmu:</h3>
            <div className="bg-rose-50 border-2 border-dashed border-rose-300 py-4 rounded-2xl">
              <span className="text-4xl font-black text-rose-600 tracking-widest">{roomCode}</span>
            </div>
            <p className="text-xs text-stone-500 animate-pulse">{statusText}</p>
            {isConnected && (
              <button onClick={() => setMode('dashboard')} className="w-full py-3.5 bg-green-500 text-white font-bold rounded-2xl shadow-md text-sm cursor-pointer">Masuk ke Ruang Live Sekarang! 🎉</button>
            )}
            <button onClick={() => setMode('menu')} className="text-xs text-stone-400 underline pt-2">Batal / Keluar</button>
          </motion.div>
        )}

        {/* GABUNG ROOM */}
        {mode === 'join' && (
          <motion.div key="join" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-rose-100 max-w-md w-full space-y-5 relative z-10 text-left">
            <h2 className="text-xl font-bold text-stone-900 text-center">Gabung ke Room Pasangan</h2>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Nama Kamu:</label>
                <input type="text" value={myName} onChange={(e) => setMyName(e.target.value)} placeholder="Cth: Rini" required className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-medium bg-stone-50 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Masukkan 4 Digit Kode Room:</label>
                <input type="text" maxLength="4" value={inputCode} onChange={(e) => setInputCode(e.target.value)} placeholder="Cth: 4821" required className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-bold text-center tracking-widest text-lg bg-stone-50" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-rose-500 text-white font-bold rounded-2xl shadow-md text-sm cursor-pointer">Hubungkan Sekarang 🔗</button>
              <button type="button" onClick={() => setMode('menu')} className="w-full text-xs text-stone-400 hover:text-stone-700 font-medium text-center pt-2">← Kembali</button>
            </form>
          </motion.div>
        )}

        {/* STATUS MENGHUBUNGKAN */}
        {mode === 'connecting' && (
          <motion.div key="conn" className="bg-white/80 p-8 rounded-3xl text-center space-y-4 max-w-sm w-full">
            <div className="text-4xl animate-spin">💫</div>
            <h3 className="font-bold text-stone-800">{statusText}</h3>
            {isConnected && (
              <button onClick={() => setMode('dashboard')} className="w-full py-3 bg-green-500 text-white font-bold rounded-xl text-sm">Masuk Ruang Live ✨</button>
            )}
          </motion.div>
        )}

        {/* DASHBOARD UTAMA */}
        {mode === 'dashboard' && (
          <motion.div key="dash" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-2xl border border-rose-100 max-w-lg w-full space-y-3 relative z-10 flex flex-col h-[92vh]">
            
            {/* Header & Tabs Navigasi */}
            <div className="flex justify-between items-center border-b border-stone-100 pb-2 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-green-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Terhubung Live
                  </span>
                  <button
                    onClick={handleLeaveSession}
                    className="px-2 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-[10px] font-bold transition cursor-pointer"
                  >
                    🚪 Keluar Room
                  </button>
                </div>
                <h2 className="text-sm font-bold text-stone-900 mt-0.5">{myName} & {partnerName}</h2>
              </div>

              {/* Scrollable Tabs */}
              <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold gap-1 overflow-x-auto max-w-[210px]">
                <button onClick={() => setActiveTab('chat')} className={`px-2 py-1 rounded-lg transition whitespace-nowrap ${activeTab === 'chat' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}>💬 Chat</button>
                <button onClick={() => setActiveTab('counter')} className={`px-2 py-1 rounded-lg transition whitespace-nowrap ${activeTab === 'counter' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}>⏳ Counter</button>
                <button onClick={() => setActiveTab('quiz')} className={`px-2 py-1 rounded-lg transition whitespace-nowrap ${activeTab === 'quiz' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}>❓ Quiz</button>
                <button onClick={() => setActiveTab('bucket')} className={`px-2 py-1 rounded-lg transition whitespace-nowrap ${activeTab === 'bucket' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}>🎡 Bucket</button>
                <button onClick={() => setActiveTab('notes')} className={`px-2 py-1 rounded-lg transition whitespace-nowrap ${activeTab === 'notes' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}>💌 Notes</button>
                <button onClick={() => setActiveTab('photobooth')} className={`px-2 py-1 rounded-lg transition whitespace-nowrap ${activeTab === 'photobooth' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}>📸 Booth</button>
              </div>
            </div>

            {/* TAB 1: CHAT, VOICE NOTE, & KADO VIRTUAL */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
                <div className="grid grid-cols-2 gap-2 shrink-0">
                  <select value={myMood} onChange={(e) => handleMoodChange(e.target.value)} className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-stone-50 text-stone-800 focus:outline-none">
                    <option value="😊 Senang">😊 Senang</option>
                    <option value="🥺 Lagi Kangen">🥺 Lagi Kangen</option>
                    <option value="☕ Lagi Santai">☕ Lagi Santai</option>
                    <option value="😴 Mengantuk">😴 Mengantuk</option>
                    <option value="😡 Lagi Ngambek">😡 Lagi Ngambek</option>
                  </select>
                  <button onClick={handleSendLoveTap} className="py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer hover:scale-105 transition">💖 Kirim Hati / Peluk</button>
                </div>

                {/* Kirim Kado Virtual Cepat */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 text-xs">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">Kado:</span>
                  <button onClick={() => sendVirtualGift("Bunga Mawar", "🌹")} className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-xl font-bold shrink-0 transition">🌹 Bunga</button>
                  <button onClick={() => sendVirtualGift("Cokelat Manis", "🍫")} className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold shrink-0 transition">🍫 Cokelat</button>
                  <button onClick={() => sendVirtualGift("Cincin Romantis", "💍")} className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl font-bold shrink-0 transition">💍 Cincin</button>
                  <button onClick={() => sendVirtualGift("Boneka Beruang", "🧸")} className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold shrink-0 transition">🧸 Boneka</button>
                </div>

                <div className="flex-1 bg-stone-50 border border-stone-200/80 rounded-2xl p-3 overflow-y-auto space-y-2.5 flex flex-col">
                  {messages.length === 0 ? (
                    <div className="my-auto text-center text-xs text-stone-400">Kirim sapaan, voice note, atau kado virtual ke {partnerName}! 👋</div>
                  ) : (
                    messages.map((m, idx) => (
                      <div key={idx} className={`flex flex-col max-w-[85%] ${m.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                        {m.isVoice ? (
                          <div className={`p-2.5 rounded-2xl shadow-sm border ${m.sender === 'me' ? 'bg-rose-500 text-white border-rose-600 rounded-br-none' : 'bg-white text-stone-800 border-stone-200 rounded-bl-none'}`}>
                            <div className="text-[10px] font-bold mb-1 opacity-80">{m.sender === 'me' ? '🎤 Voice Note Kamu' : `🎤 Voice Note ${partnerName}`}</div>
                            <audio controls src={m.audio} className="w-44 sm:w-52 h-8" />
                          </div>
                        ) : (
                          <div className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-medium ${m.sender === 'me' ? 'bg-rose-500 text-white rounded-br-none shadow-sm' : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-sm'}`}>{m.text}</div>
                        )}
                        <span className="text-[9px] text-stone-400 mt-0.5 px-1">{m.time}</span>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat & Voice Input Form */}
                <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0 items-center">
                  <button
                    type="button"
                    onClick={isRecording ? stopAudioRecording : startAudioRecording}
                    className={`p-3 rounded-2xl text-white font-bold text-xs transition cursor-pointer flex items-center justify-center shrink-0 shadow-sm ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-rose-500 hover:bg-rose-600'}`}
                    title={isRecording ? "Klik untuk Berhenti & Kirim Voice Note" : "Rekam Voice Note"}
                  >
                    {isRecording ? '⏹️' : '🎙️'}
                  </button>
                  <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder={isRecording ? "Sedang merekam suara... 🎙️" : `Ketik pesan ke ${partnerName}...`} disabled={isRecording} className="flex-1 px-4 py-3 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-medium bg-stone-50 text-xs sm:text-sm" />
                  <button type="submit" disabled={isRecording} className="px-4 py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-2xl text-xs sm:text-sm shadow-sm cursor-pointer">Kirim ✈️</button>
                </form>
              </div>
            )}

            {/* TAB 2: COUNTER JADIAN */}
            {activeTab === 'counter' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 overflow-y-auto p-4 text-center">
                <div className="text-4xl">💖⏳</div>
                <h3 className="font-bold text-stone-900 text-base">Waktu Kebersamaan Kita</h3>
                <p className="text-xs text-stone-500">Sejak hari pertama kita resmi bersama ❤️</p>
                
                <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl">
                    <span className="text-2xl font-black text-rose-600">{timeTogether.days}</span>
                    <p className="text-[11px] font-bold text-stone-600 mt-1">Hari</p>
                  </div>
                  <div className="bg-pink-50 border border-pink-200 p-3 rounded-2xl">
                    <span className="text-2xl font-black text-pink-600">{timeTogether.hours}</span>
                    <p className="text-[11px] font-bold text-stone-600 mt-1">Jam</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl">
                    <span className="text-2xl font-black text-purple-600">{timeTogether.minutes}</span>
                    <p className="text-[11px] font-bold text-stone-600 mt-1">Menit</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl">
                    <span className="text-2xl font-black text-amber-600">{timeTogether.seconds}</span>
                    <p className="text-[11px] font-bold text-stone-600 mt-1">Detik</p>
                  </div>
                </div>

                <div className="pt-2 w-full max-w-xs">
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Ubah Tanggal Jadian:</label>
                  <input type="date" value={anniversaryDate} onChange={(e) => setAnniversaryDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-stone-50 text-center" />
                </div>
              </div>
            )}

            {/* TAB 3: QUIZ */}
            {activeTab === 'quiz' && (
              <div className="flex-1 flex flex-col space-y-3 overflow-y-auto p-2">
                <div className="text-center shrink-0">
                  <h3 className="font-bold text-stone-900 text-sm">❓ Seberapa Kenal Kamu Sama Aku?</h3>
                  <p className="text-[11px] text-stone-500">Jawab pertanyaan di bawah, lalu lihat jawaban pasanganmu!</p>
                </div>

                <div className="space-y-4">
                  {quizQuestions.map((item, idx) => (
                    <div key={idx} className="bg-stone-50 border border-stone-200 p-3 rounded-2xl space-y-2">
                      <p className="text-xs font-bold text-stone-800">{idx + 1}. {item.q}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {item.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => {
                              const updated = { ...quizAnswers, [idx]: opt };
                              setQuizAnswers(updated);
                              if (conn) conn.send({ type: 'quiz-sync', answers: updated });
                            }}
                            className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition ${quizAnswers[idx] === opt ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {partnerQuizAnswers[idx] && (
                        <p className="text-[10px] text-rose-600 font-semibold pt-1">💬 Jawaban {partnerName}: <span className="underline">{partnerQuizAnswers[idx]}</span></p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: BUCKET LIST */}
            {activeTab === 'bucket' && (
              <div className="flex-1 flex flex-col space-y-3 overflow-y-auto p-2">
                <div className="text-center shrink-0">
                  <h3 className="font-bold text-stone-900 text-sm">🎡 Ide Kencan & Bucket List</h3>
                  <p className="text-[11px] text-stone-500">Rencanakan momen seru bersama pasanganmu!</p>
                </div>

                <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-3.5 rounded-2xl shadow-sm text-center space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-90">🎲 Putar Ide Kencan Hari Ini</p>
                  <p className="text-xs font-medium bg-white/20 p-2.5 rounded-xl">{randomDateIdea}</p>
                  <button
                    onClick={() => {
                      const rand = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
                      setRandomDateIdea(rand);
                    }}
                    className="py-1.5 px-4 bg-white text-rose-600 font-bold rounded-xl text-xs shadow hover:scale-105 transition cursor-pointer"
                  >
                    Acak Ide Kencan ✨
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  <h4 className="font-bold text-stone-800 text-xs">📋 Our Bucket List:</h4>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newBucketItem.trim()) return;
                    const updated = [...bucketList, { id: Date.now(), text: newBucketItem, done: false }];
                    setBucketList(updated);
                    setNewBucketItem('');
                    if (conn) conn.send({ type: 'bucket-sync', list: updated });
                  }} className="flex gap-2">
                    <input type="text" value={newBucketItem} onChange={(e) => setNewBucketItem(e.target.value)} placeholder="Tambah impian baru..." className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50" />
                    <button type="submit" className="px-3 py-2 bg-rose-500 text-white font-bold rounded-xl text-xs">Tambah</button>
                  </form>

                  <div className="space-y-1.5 pt-1">
                    {bucketList.map((item) => (
                      <div key={item.id} className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${item.done ? 'bg-emerald-50 border-emerald-200 text-emerald-800 line-through' : 'bg-stone-50 border-stone-200 text-stone-800'}`}>
                        <span>{item.text}</span>
                        <button
                          onClick={() => {
                            const updated = bucketList.map(b => b.id === item.id ? { ...b, done: !b.done } : b);
                            setBucketList(updated);
                            if (conn) conn.send({ type: 'bucket-sync', list: updated });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${item.done ? 'bg-emerald-200 text-emerald-800' : 'bg-stone-200 text-stone-700'}`}
                        >
                          {item.done ? 'Selesai ✔️' : 'Belum'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: LOVE NOTES */}
            {activeTab === 'notes' && (
              <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
                <div className="text-center shrink-0">
                  <h3 className="font-bold text-stone-900 text-sm">💌 Papan Catatan Hati</h3>
                  <p className="text-[11px] text-stone-500">Tinggalkan pesan manis yang langsung nempel di layar kalian berdua!</p>
                </div>

                <form onSubmit={handleSendNote} className="flex gap-2 shrink-0">
                  <input type="text" value={inputNote} onChange={(e) => setInputNote(e.target.value)} placeholder="Tulis pesan/catatan romantis..." className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-medium bg-stone-50 text-xs" />
                  <button type="submit" className="px-4 py-2.5 bg-rose-500 text-white font-bold rounded-2xl text-xs shadow-sm cursor-pointer">Tempel 📌</button>
                </form>

                <div className="flex-1 bg-stone-50 border border-stone-200/80 rounded-2xl p-3 overflow-y-auto space-y-2.5">
                  {notes.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center text-xs text-stone-400">Belum ada catatan hati. Yuk tulis pesan pertamamu! ✨</div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5">
                      {notes.map((note) => (
                        <div key={note.id} className={`p-3.5 rounded-2xl shadow-xs border border-white/50 ${note.color} flex flex-col justify-between`}>
                          <p className="text-xs sm:text-sm font-medium whitespace-pre-wrap">{note.text}</p>
                          <div className="flex justify-between items-center mt-2 pt-1 border-t border-black/5 text-[10px] opacity-75">
                            <span className="font-bold">— {note.sender}</span>
                            <span>{note.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: PHOTOBOOTH */}
            {activeTab === 'photobooth' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 overflow-y-auto p-1">
                {boothStep === 'select-layout' && (
                  <div className="space-y-3 w-full max-w-xs text-left my-auto">
                    <div className="text-center">
                      <h3 className="font-bold text-stone-900 text-base">Pilih Ukuran & Tema Strip 📸</h3>
                      <p className="text-xs text-stone-500">Pilihanmu otomatis tersinkron ke perangkat pasanganmu!</p>
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
                          <button key={layout.id} onClick={() => handleLayoutChange(layout.id)} className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${selectedLayout === layout.id ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'}`}>{layout.label}</button>
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
                          <button key={theme.id} onClick={() => handleThemeChange(theme.id)} className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${selectedTheme === theme.id ? 'bg-stone-900 text-white border-stone-900 shadow-sm' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'}`}>{theme.label}</button>
                        ))}
                      </div>
                    </div>
                    <button onClick={handleInitiateCapture} className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl shadow-md text-xs cursor-pointer mt-1">Mulai Sesi Foto Bergantian 🎬</button>
                  </div>
                )}

                {boothStep === 'capturing' && (
                  <div className="space-y-3 w-full text-center my-auto">
                    <div className="relative w-full max-w-[280px] h-[210px] mx-auto bg-stone-900 rounded-2xl overflow-hidden border-4 border-rose-300 shadow-md flex items-center justify-center">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                      {((currentStep % 2 === 0 && isLeader) || (currentStep % 2 !== 0 && !isLeader)) && countdown !== null && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                          <span className="text-7xl font-black text-white drop-shadow-lg animate-bounce">{countdown}</span>
                        </div>
                      )}
                      {!((currentStep % 2 === 0 && isLeader) || (currentStep % 2 !== 0 && !isLeader)) && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                          <div className="text-3xl animate-bounce mb-1">⏳</div>
                          <p className="text-white text-xs font-bold">Giliran {partnerName} yang berfoto...</p>
                          <p className="text-rose-200 text-[10px] mt-1">Foto ke-{currentStep + 1} dari {getRequiredPhotosCount()}</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-rose-600 animate-pulse">
                      {((currentStep % 2 === 0 && isLeader) || (currentStep % 2 !== 0 && !isLeader)) ? `Giliran Kamu! Foto ke-${currentStep + 1} dari ${getRequiredPhotosCount()}` : `Menunggu ${partnerName} mengambil foto...`}
                    </p>
                  </div>
                )}

                {boothStep === 'ready' && finalStripUrl && (
                  <div className="space-y-3 w-full flex flex-col items-center my-auto pt-2">
                    <div className="w-[230px] drop-shadow-2xl">
                      <img src={finalStripUrl} alt="Hasil Photobooth Estetik" className="w-full h-auto object-contain rounded-2xl" />
                    </div>
                    <div className="flex gap-2 w-full max-w-[260px] pt-1">
                      <a href={finalStripUrl} download={`Photobooth_${myName}_dan_${partnerName}.png`} className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl shadow-md text-xs text-center block cursor-pointer hover:scale-105 transition">📥 Download Strip (PNG)</a>
                      <button onClick={() => { setAllPhotos([]); setFinalStripUrl(null); setBoothStep('select-layout'); }} className="px-4 py-3 bg-stone-200 text-stone-600 font-bold rounded-xl text-xs hover:bg-stone-300 transition cursor-pointer">Ulangi 🔄</button>
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