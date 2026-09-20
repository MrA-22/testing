import React, { useState, useEffect, useRef } from 'react';
import { Peer } from 'peerjs';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// 8 Pilihan Tema Background Studio
const bgThemes = {
  sunset: { name: 'Sunset', emoji: '🌅', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=80' },
  pantai: { name: 'Pantai', emoji: '🏖️', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  gunung: { name: 'Gunung', emoji: '⛰️', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' },
  cafe: { name: 'Cafe Aesthetic', emoji: '☕', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80' },
  city: { name: 'Neon City', emoji: '🌆', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80' },
  galaxy: { name: 'Galaxy Space', emoji: '🌌', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80' },
  sakura: { name: 'Sakura Park', emoji: '🌸', url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=80' },
  autumn: { name: 'Autumn Woods', emoji: '🍁', url: 'https://images.unsplash.com/photo-1507783590520-64746b074a3c?auto=format&fit=crop&w=1200&q=80' }
};

export default function LiveLoveRoomWithPhotobooth() {
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Setup Room & Nama
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

  // Gift Popup Effect
  const [activeGiftPopup, setActiveGiftPopup] = useState(null);

  // Fitur Love Notes
  const [notes, setNotes] = useState([]);
  const [inputNote, setInputNote] = useState('');

  // Fitur Photobooth & Studio Kamera
  const [selectedLayout, setSelectedLayout] = useState('1x2'); 
  const [selectedTheme, setSelectedTheme] = useState('rose'); 
  const [cameraBgTheme, setCameraBgTheme] = useState('sunset');
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [allPhotos, setAllPhotos] = useState([]);
  const allPhotosRef = useRef([]);
  const [boothStep, setBoothStep] = useState('select-layout'); 
  const [currentStep, setCurrentStep] = useState(0);
  const [finalStripUrl, setFinalStripUrl] = useState(null);
  
  // Ready States
  const [iAmReady, setIAmReady] = useState(false);
  const [partnerIsReady, setPartnerIsReady] = useState(false);

  // Editor States
  const [stripCaption, setStripCaption] = useState('Our Sweet Moment Together ❤️');
  const [selectedSticker, setSelectedSticker] = useState('🧸');

  // WebRTC Media Stream
  const localStreamRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const remoteStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const currentCallRef = useRef(null);
  const peerInstanceRef = useRef(null);

  // Canvas & Dual MediaPipe Refs
  const previewCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const localSegmentationRef = useRef(null);
  const remoteSegmentationRef = useRef(null);
  const localResultsRef = useRef(null);
  const remoteResultsRef = useRef(null);
  const bgImageLoadedRef = useRef(null);
  const [isSegmentationLoaded, setIsSegmentationLoaded] = useState(false);

  // --- COUNTER JADIAN ---
  const [anniversaryDate, setAnniversaryDate] = useState(() => localStorage.getItem('bucin_anniversary') || '2024-01-01');
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // --- QUIZ ---
  const quizQuestions = [
    { q: "Apa makanan kesukaan atau jajanan favoritku?", options: ["Seblak/Pedas", "Manis/Dessert", "Makanan Berkuah", "Fast Food"] },
    { q: "Kalau lagi ngambek, biasanya aku paling suka digimanain?", options: ["Diemin dulu", "Dipujuk & ditenangin", "Dikasih makanan", "Diajak ngelawak"] },
    { q: "Tempat impian yang pengen banget kita kunjungi bareng?", options: ["Pegunungan / Villa sejuk", "Pantai / Sunset", "Keliling Luar Negeri", "Taman Bermain / Cafe aesthetic"] }
  ];
  const [quizAnswers, setQuizAnswers] = useState({});
  const [partnerQuizAnswers, setPartnerQuizAnswers] = useState({});

  // --- BUCKET LIST ---
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

  const messagesEndRef = useRef(null);

  // Load Dual MediaPipe Selfie Segmentation via CDN Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js";
    script.async = true;
    script.onload = async () => {
      if (window.SelfieSegmentation) {
        const segLocal = new window.SelfieSegmentation({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        });
        segLocal.setOptions({ modelSelection: 1 });
        segLocal.onResults((results) => {
          localResultsRef.current = results;
        });
        await segLocal.initialize();
        localSegmentationRef.current = segLocal;

        const segRemote = new window.SelfieSegmentation({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        });
        segRemote.setOptions({ modelSelection: 1 });
        segRemote.onResults((results) => {
          remoteResultsRef.current = results;
        });
        await segRemote.initialize();
        remoteSegmentationRef.current = segRemote;

        setIsSegmentationLoaded(true);
      }
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  // Muat gambar background tema aktif
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = bgThemes[cameraBgTheme]?.url || bgThemes.sunset.url;
    img.onload = () => {
      bgImageLoadedRef.current = img;
    };
  }, [cameraBgTheme]);

  useEffect(() => {
    if (localStreamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.play().catch(e => console.log(e));
    }
  }, [boothStep, cameraActive]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteStreamRef.current = remoteStream;
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(e => console.log(e));
    }
  }, [remoteStream, boothStep]);

  // Real-time Render Loop AI Dual Background Removal & Komposisi Studio
  useEffect(() => {
    if ((boothStep === 'preview' || boothStep === 'capturing') && isSegmentationLoaded && cameraActive) {
      const renderLoop = async () => {
        const localVid = localVideoRef.current;
        const remoteVid = remoteVideoRef.current;
        const localSeg = localSegmentationRef.current;
        const remoteSeg = remoteSegmentationRef.current;

        if (localVid && localSeg && localVid.readyState >= 2) {
          try {
            await localSeg.send({ image: localVid });
          } catch (e) {
            console.error(e);
          }
        }

        const activeRemoteStream = remoteStream || remoteStreamRef.current;
        if (remoteVid && remoteSeg && activeRemoteStream && remoteVid.readyState >= 2) {
          try {
            if (remoteVid.paused) {
              await remoteVid.play().catch(e => console.log(e));
            }
            await remoteSeg.send({ image: remoteVid });
          } catch (e) {
            console.error(e);
          }
        }

        drawCompositeFrame();

        animationFrameRef.current = requestAnimationFrame(renderLoop);
      };
      renderLoop();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [boothStep, isSegmentationLoaded, cameraBgTheme, remoteStream, partnerName, myName, cameraActive]);

  const getVideoCropParams = (video, destW, destH) => {
    if (!video) return { sX: 0, sY: 0, sW: 640, sH: 480 };
    const vW = video.videoWidth || 640;
    const vH = video.videoHeight || 480;

    const vdRatio = vW / vH;
    const cnRatio = destW / destH;

    let sW = vW;
    let sH = vH;
    let sX = 0;
    let sY = 0;

    if (vdRatio > cnRatio) {
      sW = sH * cnRatio;
      sX = (vW - sW) / 2;
    } else {
      sH = sW / cnRatio;
      sY = (vH - sH) / 2;
    }

    return { sX, sY, sW, sH };
  };

  const drawCompositeFrame = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const halfW = w / 2;

    if (bgImageLoadedRef.current) {
      ctx.drawImage(bgImageLoadedRef.current, 0, 0, w, h);
    } else {
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, w, h);
    }

    const localVid = localVideoRef.current;
    const localRes = localResultsRef.current;
    if (localVid && localVid.readyState >= 2) {
      const { sX, sY, sW, sH } = getVideoCropParams(localVid, halfW, h);

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = halfW;
      tempCanvas.height = h;
      const tCtx = tempCanvas.getContext('2d');

      tCtx.save();
      tCtx.translate(halfW, 0);
      tCtx.scale(-1, 1);
      tCtx.drawImage(localVid, sX, sY, sW, sH, 0, 0, halfW, h);
      tCtx.restore();

      if (localRes && localRes.segmentationMask) {
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = halfW;
        maskCanvas.height = h;
        const mCtx = maskCanvas.getContext('2d');

        mCtx.save();
        mCtx.translate(halfW, 0);
        mCtx.scale(-1, 1);
        mCtx.drawImage(localRes.segmentationMask, sX, sY, sW, sH, 0, 0, halfW, h);
        mCtx.restore();

        tCtx.globalCompositeOperation = 'destination-in';
        tCtx.drawImage(maskCanvas, 0, 0);
      }

      ctx.drawImage(tempCanvas, 0, 0);
    }

    const remoteVid = remoteVideoRef.current;
    const remoteRes = remoteResultsRef.current;
    const activeRemoteStream = remoteStream || remoteStreamRef.current;

    if (remoteVid && activeRemoteStream && remoteVid.readyState >= 2) {
      const { sX, sY, sW, sH } = getVideoCropParams(remoteVid, halfW, h);

      const tempCanvasR = document.createElement('canvas');
      tempCanvasR.width = halfW;
      tempCanvasR.height = h;
      const rCtx = tempCanvasR.getContext('2d');

      rCtx.save();
      rCtx.drawImage(remoteVid, sX, sY, sW, sH, 0, 0, halfW, h);
      rCtx.restore();

      if (remoteRes && remoteRes.segmentationMask) {
        const maskCanvasR = document.createElement('canvas');
        maskCanvasR.width = halfW;
        maskCanvasR.height = h;
        const rmCtx = maskCanvasR.getContext('2d');

        rmCtx.save();
        rmCtx.drawImage(remoteRes.segmentationMask, sX, sY, sW, sH, 0, 0, halfW, h);
        rmCtx.restore();

        rCtx.globalCompositeOperation = 'destination-in';
        rCtx.drawImage(maskCanvasR, 0, 0);
      }

      ctx.drawImage(tempCanvasR, halfW, 0);
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(halfW, 0, halfW, h);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Menunggu ${partnerName}...`, halfW + (halfW / 2), h / 2 - 10);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#fda4af';
      ctx.fillText(`(Klik Hubungkan Ulang di atas)`, halfW + (halfW / 2), h / 2 + 12);
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.roundRect(20, h - 45, 130, 32, 10);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`👤 Kamu (${myName})`, 30, h - 25);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.roundRect(halfW + 20, h - 45, 140, 32, 10);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`👤 ${partnerName}`, halfW + 30, h - 25);

    ctx.restore();
  };

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

  // Fungsi untuk mematikan kamera sepenuhnya
  const stopCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const initializeCameraAndCall = async () => {
    try {
      let stream = localStreamRef.current;
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }, 
          audio: false 
        });
        localStreamRef.current = stream;
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play().catch(e => console.log(e));
      }
      setCameraActive(true);

      if (peerInstanceRef.current && conn && conn.peer) {
        const call = peerInstanceRef.current.call(conn.peer, stream);
        currentCallRef.current = call;
        call.on('stream', (remoteStreamFeed) => {
          remoteStreamRef.current = remoteStreamFeed;
          setRemoteStream(remoteStreamFeed);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStreamFeed;
            remoteVideoRef.current.play().catch(e => console.log(e));
          }
        });
      }
      return stream;
    } catch (err) {
      console.error("Gagal kamera:", err);
      alert("Tidak dapat mengakses kamera. Pastikan izin kamera aktif!");
      return null;
    }
  };

  const handleReconnectCall = async () => {
    const stream = await initializeCameraAndCall();
    if (stream && conn && conn.peer) {
      conn.send({ type: 'request-video-sync' });
      alert("Permintaan sinkronisasi video dikirim ke pasangan! 🔄");
    }
  };

  const handleLeaveSession = () => {
    if (window.confirm("Yakin ingin keluar dari sesi ruangan ini?")) {
      if (conn) conn.close();
      if (peer) peer.destroy();
      stopCamera();
      
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
    peerInstanceRef.current = newPeer;
    
    newPeer.on('open', () => {
      setStatusText(`Room aktif! Bagikan kode ${code} ke pasanganmu.`);
    });

    newPeer.on('connection', (connection) => {
      setConn(connection);
      setupConnection(connection, newPeer);
    });

    newPeer.on('call', async (call) => {
      const stream = localStreamRef.current;
      call.answer(stream || undefined);
      currentCallRef.current = call;
      call.on('stream', (remoteStreamFeed) => {
        remoteStreamRef.current = remoteStreamFeed;
        setRemoteStream(remoteStreamFeed);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStreamFeed;
          remoteVideoRef.current.play().catch(e => console.log(e));
        }
      });
    });

    setPeer(newPeer);
  };

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
    peerInstanceRef.current = newPeer;

    newPeer.on('open', async () => {
      const connection = newPeer.connect(`bucin-room-${inputCode}`);
      setConn(connection);
      setupConnection(connection, newPeer);
    });

    newPeer.on('call', async (call) => {
      const stream = localStreamRef.current;
      call.answer(stream || undefined);
      currentCallRef.current = call;
      call.on('stream', (remoteStreamFeed) => {
        remoteStreamRef.current = remoteStreamFeed;
        setRemoteStream(remoteStreamFeed);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStreamFeed;
          remoteVideoRef.current.play().catch(e => console.log(e));
        }
      });
    });

    newPeer.on('error', () => {
      alert('Gagal terhubung! Pastikan kode room benar.');
      setMode('join');
    });

    setPeer(newPeer);
  };

  const setupConnection = (connection, currentPeerInstance) => {
    connection.on('open', async () => {
      setIsConnected(true);
      setStatusText('Terhubung dengan Ayang! ❤️');
      connection.send({ type: 'init', name: myName, mood: myMood });
    });

    connection.on('data', async (data) => {
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
      } else if (data.type === 'love-note') {
        setNotes((prev) => [data.note, ...prev]);
      } else if (data.type === 'quiz-sync') {
        setPartnerQuizAnswers(data.answers);
      } else if (data.type === 'bucket-sync') {
        setBucketList(data.list);
      } else if (data.type === 'pb-config-sync') {
        setSelectedLayout(data.layout);
        setSelectedTheme(data.theme);
      } else if (data.type === 'pb-bg-theme-sync') {
        setCameraBgTheme(data.theme);
      } else if (data.type === 'pb-preview-mode') {
        // HANYA mengganti step preview tanpa menyalakan kamera secara otomatis
        setSelectedLayout(data.layout);
        setSelectedTheme(data.theme);
        setBoothStep('preview');
        setIAmReady(false);
        setPartnerIsReady(false);
      } else if (data.type === 'request-video-sync') {
        if (localStreamRef.current && currentPeerInstance && connection.peer) {
          const call = currentPeerInstance.call(connection.peer, localStreamRef.current);
          currentCallRef.current = call;
          call.on('stream', (remoteStreamFeed) => {
            remoteStreamRef.current = remoteStreamFeed;
            setRemoteStream(remoteStreamFeed);
          });
        }
      } else if (data.type === 'pb-ready-status') {
        setPartnerIsReady(data.ready);
      } else if (data.type === 'pb-start-countdown') {
        setBoothStep('capturing');
        setCurrentStep(0);
      } else if (data.type === 'pb-dual-snapshot') {
        const updated = [...allPhotosRef.current, data.photo];
        setAllPhotos(updated);
        setCurrentStep(data.step + 1);
      } else if (data.type === 'pb-edit-sync') {
        setStripCaption(data.caption);
        setSelectedSticker(data.sticker);
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
          const voiceMsg = { type: 'chat-voice', audio: base64Audio, time: timeStr };
          if (conn) conn.send(voiceMsg);
          setMessages((prev) => [...prev, { sender: 'me', audio: base64Audio, time: timeStr, isVoice: true }]);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Gagal akses mikrofon:", err);
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderAudioRef.current && isRecording) {
      mediaRecorderAudioRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendVirtualGift = (giftName, giftEmoji) => {
    if (!conn) return;
    conn.send({ type: 'virtual-gift', giftName, giftEmoji, sender: myName });
  };

  const showGiftPopup = (giftName, giftEmoji, sender) => {
    confetti({ particleCount: 120, spread: 120, origin: { y: 0.5 } });
    setActiveGiftPopup({ sender, giftName, giftEmoji });
    setTimeout(() => setActiveGiftPopup(null), 4000);
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
    if (conn) conn.send({ type: 'love-note', note: newNote });
    setInputNote('');
  };

  const handleMoodChange = (newMood) => {
    setMyMood(newMood);
    if (conn) conn.send({ type: 'mood', mood: newMood });
  };

  const handleLayoutChange = (layoutId) => {
    setSelectedLayout(layoutId);
    if (conn) conn.send({ type: 'pb-config-sync', layout: layoutId, theme: selectedTheme });
  };

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    if (conn) conn.send({ type: 'pb-config-sync', layout: selectedLayout, theme: themeId });
  };

  const handleCameraBgChange = (bgId) => {
    setCameraBgTheme(bgId);
    if (conn) {
      conn.send({ type: 'pb-bg-theme-sync', theme: bgId });
    }
  };

  const getRequiredPhotosCount = () => {
    if (selectedLayout === '1x2') return 2;
    if (selectedLayout === '1x3') return 3;
    if (selectedLayout === '2x2') return 4;
    if (selectedLayout === 'polaroid' || selectedLayout === 'photocard') return 1;
    return 2;
  };

  const handleOpenLivePreview = async () => {
    await initializeCameraAndCall();
    setAllPhotos([]);
    setBoothStep('preview');
    setIAmReady(false);
    setPartnerIsReady(false);
    if (conn) {
      conn.send({ type: 'pb-preview-mode', layout: selectedLayout, theme: selectedTheme });
    }
  };

  const handleToggleReady = () => {
    const nextStatus = !iAmReady;
    setIAmReady(nextStatus);
    if (conn) conn.send({ type: 'pb-ready-status', ready: nextStatus });
    if (nextStatus && partnerIsReady) triggerStartCountdown();
  };

  useEffect(() => {
    if (boothStep === 'preview' && iAmReady && partnerIsReady) {
      triggerStartCountdown();
    }
  }, [iAmReady, partnerIsReady, boothStep]);

  const triggerStartCountdown = () => {
    setBoothStep('capturing');
    setCurrentStep(0);
    setAllPhotos([]);
    if (conn) conn.send({ type: 'pb-start-countdown' });
  };

  useEffect(() => {
    if (boothStep === 'capturing') {
      runDualCaptureStep();
    }
  }, [boothStep, currentStep]);

  const loadImage = (src) => new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

  const runDualCaptureStep = async () => {
    const total = getRequiredPhotosCount();
    if (currentStep >= total) {
      setBoothStep('ready');
      stopCamera(); // Matikan kamera otomatis setelah selesai jepret
      generatePhotoboothCanvas(allPhotosRef.current);
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
      return;
    }

    setCountdown(3);
    let count = 3;
    const timer = setInterval(async () => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        setCountdown(null);

        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 800, 600);
        grad.addColorStop(0, '#fff1f2');
        grad.addColorStop(1, '#ffe4e6');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#881337';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`✨ ${myName} & ${partnerName} • ${bgThemes[cameraBgTheme]?.name} ✨`, 400, 38);

        if (previewCanvasRef.current) {
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.roundRect(40, 60, 720, 450, 20);
          ctx.clip();
          ctx.drawImage(previewCanvasRef.current, 0, 0, 1280, 720, 40, 60, 720, 450);
          ctx.restore();
        }

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(40, 60, 720, 450, 20);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#fda4af';
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#9f1239';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💖 Our Sweet Love Story 💖', 400, 545);

        const photoData = canvas.toDataURL('image/jpeg', 0.9);
        const updated = [...allPhotosRef.current, photoData];
        setAllPhotos(updated);

        if (conn) {
          conn.send({ type: 'pb-dual-snapshot', step: currentStep, photo: photoData });
        }

        setCurrentStep(currentStep + 1);
      }
    }, 1000);
  };

  const generatePhotoboothCanvas = async (photosToUse) => {
    const photos = photosToUse || allPhotosRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let themeConfig = { bg: '#fff1f2', border: '#f43f5e', accent: '#fb7185', text: '#881337', cardBg: '#ffffff' };
    if (selectedTheme === 'purple') themeConfig = { bg: '#f3e8ff', border: '#9333ea', accent: '#a855f7', text: '#581c87', cardBg: '#ffffff' };
    else if (selectedTheme === 'peach') themeConfig = { bg: '#ffedd5', border: '#ea580c', accent: '#f97316', text: '#7c2d12', cardBg: '#ffffff' };
    else if (selectedTheme === 'mono') themeConfig = { bg: '#f5f5f4', border: '#292524', accent: '#78716c', text: '#1c1917', cardBg: '#ffffff' };

    const drawCoverImage = async (photoSrc, x, y, width, height, radius) => {
      const img = await loadImage(photoSrc);
      if (!img) return;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
      ctx.clip();
      ctx.drawImage(img, x, y, width, height);
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
      ctx.lineWidth = 4;
      ctx.strokeStyle = themeConfig.border;
      ctx.stroke();
      ctx.restore();
    };

    if (selectedLayout === 'photocard') {
      canvas.width = 600;
      canvas.height = 950;
      ctx.fillStyle = themeConfig.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 25;
      ctx.fillStyle = themeConfig.cardBg;
      ctx.beginPath();
      ctx.roundRect(40, 40, 520, 870, 35);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.lineWidth = 8;
      ctx.strokeStyle = themeConfig.border;
      ctx.stroke();

      if (photos[0]) {
        await drawCoverImage(photos[0], 65, 65, 470, 580, 20);
      }

      ctx.font = '40px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(selectedSticker, canvas.width / 2, 690);

      ctx.fillStyle = themeConfig.text;
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`✨ ${myName} & ${partnerName} ✨`, canvas.width / 2, 740);
      ctx.font = 'italic 16px sans-serif';
      ctx.fillStyle = themeConfig.accent;
      ctx.fillText(`"${stripCaption}"`, canvas.width / 2, 780);
    } else {
      canvas.width = 700;
      canvas.height = 1300;
      ctx.fillStyle = themeConfig.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
      ctx.shadowBlur = 30;
      ctx.fillStyle = themeConfig.cardBg;
      ctx.beginPath();
      ctx.roundRect(35, 35, 630, 1230, 40);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.lineWidth = 10;
      ctx.strokeStyle = themeConfig.border;
      ctx.stroke();

      ctx.fillStyle = themeConfig.text;
      ctx.font = '900 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ STUDIO LOVE STRIP ✨', canvas.width / 2, 85);
      ctx.font = '22px sans-serif';
      ctx.fillText(`💖 ${selectedSticker} 🎀 📸 🌟 🌸`, canvas.width / 2, 120);

      if (selectedLayout === '1x2') {
        if (photos[0]) await drawCoverImage(photos[0], 75, 145, 550, 380, 20);
        if (photos[1] || photos[0]) await drawCoverImage(photos[1] || photos[0], 75, 545, 550, 380, 20);
      } else if (selectedLayout === '1x3') {
        if (photos[0]) await drawCoverImage(photos[0], 85, 140, 530, 250, 15);
        if (photos[1] || photos[0]) await drawCoverImage(photos[1] || photos[0], 85, 410, 530, 250, 15);
        if (photos[2] || photos[0]) await drawCoverImage(photos[2] || photos[0], 85, 680, 530, 250, 15);
      } else if (selectedLayout === '2x2') {
        if (photos[0]) await drawCoverImage(photos[0], 70, 145, 265, 370, 15);
        if (photos[1] || photos[0]) await drawCoverImage(photos[1] || photos[0], 365, 145, 265, 370, 15);
        if (photos[2] || photos[0]) await drawCoverImage(photos[2] || photos[0], 70, 535, 265, 370, 15);
        if (photos[3] || photos[1] || photos[0]) await drawCoverImage(photos[3] || photos[1] || photos[0], 365, 535, 265, 370, 15);
      } else if (selectedLayout === 'polaroid') {
        if (photos[0]) await drawCoverImage(photos[0], 90, 145, 520, 580, 15);
        ctx.fillStyle = '#1c1917';
        ctx.font = 'italic 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`"${stripCaption}"`, canvas.width / 2, 780);
      }

      ctx.beginPath();
      ctx.moveTo(70, 1020);
      ctx.lineTo(630, 1020);
      ctx.lineWidth = 2;
      ctx.strokeStyle = themeConfig.accent;
      ctx.stroke();

      ctx.fillStyle = themeConfig.border;
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(stripCaption, canvas.width / 2, 1065);

      ctx.fillStyle = '#57534e';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`👥 ${myName} & ${partnerName}`, 75, 1120);

      ctx.textAlign = 'right';
      const today = new Date();
      ctx.fillText(`📅 ${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}`, 625, 1120);
    }

    setFinalStripUrl(canvas.toDataURL('image/png', 1.0));
  };

  useEffect(() => {
    if (boothStep === 'ready' && allPhotos.length > 0) {
      generatePhotoboothCanvas(allPhotos);
    }
  }, [stripCaption, selectedSticker]);

  const handleUpdateEditor = (newCaption, newSticker) => {
    setStripCaption(newCaption);
    setSelectedSticker(newSticker);
    if (conn) {
      conn.send({ type: 'pb-edit-sync', caption: newCaption, sticker: newSticker });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-purple-200 flex items-center justify-center p-4 overflow-hidden relative font-sans text-stone-800">

      {/* ELEMEN VIDEO STREAM UTAMA (TERSEMBUNYI PERMANEN) */}
      <video ref={localVideoRef} autoPlay playsInline muted className="hidden" />
      <video ref={remoteVideoRef} autoPlay playsInline className="hidden" />

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

      <AnimatePresence mode="wait">
        
        {/* MENU UTAMA */}
        {mode === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-rose-100 text-center max-w-md w-full space-y-6 relative z-10">
            <div className="text-5xl mb-2">📸💞</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Live Space & Photobooth</h1>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">Ruang interaktif real-time. Ngobrol, Counter Jadian, Quiz, Bucket List, dan Photobooth studio bersama pasangan!</p>
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

            {/* TAB 1: CHAT */}
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
                  <button onClick={() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 } })} className="py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer hover:scale-105 transition">💖 Kirim Hati / Peluk</button>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 text-xs">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">Kirim Kado:</span>
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

                <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0 items-center">
                  <button
                    type="button"
                    onClick={isRecording ? stopAudioRecording : startAudioRecording}
                    className={`p-3 rounded-2xl text-white font-bold text-xs transition cursor-pointer flex items-center justify-center shrink-0 shadow-sm ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-rose-500 hover:bg-rose-600'}`}
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

            {/* TAB 6: PHOTOBOOTH STUDIO 1 FRAME */}
            {activeTab === 'photobooth' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3 overflow-y-auto p-1">
                
                {/* 1. PILIH LAYOUT & TEMA AWAL */}
                {boothStep === 'select-layout' && (
                  <div className="space-y-3 w-full max-w-xs text-left my-auto">
                    <div className="text-center">
                      <h3 className="font-bold text-stone-900 text-base">Photobooth Studio Bersama 📸</h3>
                      <p className="text-xs text-stone-500">Pilih layout strip foto dan gaya warna frame!</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">Pilih Layout:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: '1x2', label: '1x2 (2 Cut)' },
                          { id: '1x3', label: '1x3 (3 Cut)' },
                          { id: '2x2', label: '2x2 (4 Grid)' },
                          { id: 'polaroid', label: '🖼️ Polaroid' },
                          { id: 'photocard', label: '💳 Photocard' }
                        ].map((layout) => (
                          <button key={layout.id} onClick={() => handleLayoutChange(layout.id)} className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${selectedLayout === layout.id ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'}`}>{layout.label}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">Pilih Tema Warna Frame:</label>
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
                    <button onClick={handleOpenLivePreview} className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl shadow-md text-xs cursor-pointer mt-1">Buka Studio Live 1 Frame 🎥</button>
                  </div>
                )}

                {/* 2. TAHAP LIVE PREVIEW + GANTI TEMA REAL-TIME */}
                {boothStep === 'preview' && (
                  <div className="space-y-3 w-full text-center my-auto">
                    <p className="text-xs font-bold text-stone-700">✨ Atur Pose & Pilih Tema di Bawah Ini Secara Real-Time! ✨</p>
                    
                    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-2 border-rose-200 p-3 rounded-3xl shadow-lg max-w-[480px] mx-auto space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[11px] font-bold text-rose-700 tracking-wide">💖 {myName} & {partnerName} • {bgThemes[cameraBgTheme]?.emoji} {bgThemes[cameraBgTheme]?.name} 💖</span>
                        {cameraActive && (
                          <button onClick={handleReconnectCall} className="text-[10px] bg-rose-200 hover:bg-rose-300 text-rose-800 font-bold px-2 py-1 rounded-lg transition cursor-pointer">🔄 Hubungkan Ulang Video</button>
                        )}
                      </div>
                      
                      {/* Kanvas Live Studio Gabungan / Tombol Nyalakan Kamera */}
                      <div className="relative bg-stone-900 rounded-2xl overflow-hidden border-2 border-rose-300 h-[210px] flex items-center justify-center shadow-inner">
                        {cameraActive ? (
                          <canvas ref={previewCanvasRef} width={1280} height={720} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4 space-y-2">
                            <p className="text-xs text-stone-300">Kamera belum aktif untuk menghemat baterai & kuota.</p>
                            <button 
                              onClick={initializeCameraAndCall}
                              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow transition cursor-pointer"
                            >
                              🎥 Nyalakan Kamera Saya
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 8 PILIHAN TEMA BACKGROUND REAL-TIME */}
                      <div className="pt-1">
                        <span className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Pilih Tema Background Real-Time:</span>
                        <div className="grid grid-cols-4 gap-1">
                          {Object.keys(bgThemes).map((key) => {
                            const bg = bgThemes[key];
                            return (
                              <button
                                key={key}
                                onClick={() => handleCameraBgChange(key)}
                                className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition cursor-pointer flex flex-col items-center gap-0.5 ${cameraBgTheme === key ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-105' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'}`}
                              >
                                <span className="text-xs">{bg.emoji}</span>
                                <span className="text-[9px] truncate w-full">{bg.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Status Saling Menunggu */}
                    <div className="bg-white/90 border border-stone-200 p-2 rounded-2xl max-w-[320px] mx-auto text-xs space-y-1 shadow-xs">
                      <div className="flex justify-between items-center px-2">
                        <span>Status Kamu:</span>
                        <span className={`font-bold ${iAmReady ? 'text-emerald-600' : 'text-amber-600'}`}>{iAmReady ? '✔️ Siap!' : '⏳ Belum Siap'}</span>
                      </div>
                      <div className="flex justify-between items-center px-2">
                        <span>Status {partnerName}:</span>
                        <span className={`font-bold ${partnerIsReady ? 'text-emerald-600' : 'text-amber-600'}`}>{partnerIsReady ? '✔️ Siap!' : '⏳ Belum Siap'}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 max-w-[320px] mx-auto pt-1">
                      <button onClick={() => { stopCamera(); setBoothStep('select-layout'); }} className="py-2 px-3 bg-stone-200 text-stone-700 font-bold rounded-xl text-xs">← Menu Utama</button>
                      <button 
                        onClick={handleToggleReady} 
                        className={`flex-1 py-2 font-bold rounded-xl shadow-md text-xs cursor-pointer transition ${iAmReady ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white animate-pulse'}`}
                      >
                        {iAmReady ? 'Batal Siap ❌' : '✨ Mulai / Saya Sudah Siap!'}
                      </button>
                    </div>
                    {iAmReady && !partnerIsReady && (
                      <p className="text-[11px] text-rose-500 font-medium animate-pulse">Menunggu {partnerName} menekan tombol mulai juga...</p>
                    )}
                  </div>
                )}

                {/* 3. TAHAP KAPTUR / HITUNG MUNDUR */}
                {boothStep === 'capturing' && (
                  <div className="space-y-3 w-full text-center my-auto">
                    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-2 border-rose-200 p-3 rounded-3xl shadow-lg max-w-[460px] mx-auto space-y-2">
                      <div className="relative bg-stone-900 rounded-2xl overflow-hidden border-2 border-rose-300 h-[220px] flex items-center justify-center">
                        <canvas ref={previewCanvasRef} width={1280} height={720} className="w-full h-full object-cover" />
                      </div>
                    </div>

                    {countdown !== null && (
                      <div className="text-7xl font-black text-rose-600 animate-bounce">{countdown}</div>
                    )}
                    <p className="text-xs font-semibold text-rose-600 animate-pulse">
                      Menjepret foto studio bersama ({currentStep + 1}/{getRequiredPhotosCount()})...
                    </p>
                  </div>
                )}

                {/* 4. TAHAP HASIL & EDITOR */}
                {boothStep === 'ready' && finalStripUrl && (
                  <div className="space-y-2 w-full flex flex-col items-center my-auto pt-1">
                    <div className="w-[180px] drop-shadow-xl">
                      <img src={finalStripUrl} alt="Hasil Photobooth" className="w-full h-auto object-contain rounded-xl" />
                    </div>

                    <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-2xl w-full max-w-[280px] space-y-2 text-left">
                      <p className="text-[11px] font-bold text-stone-700 text-center">✨ Studio Editor Foto Bersama</p>
                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">Ubah Caption / Pesan:</label>
                        <input 
                          type="text" 
                          value={stripCaption} 
                          onChange={(e) => handleUpdateEditor(e.target.value, selectedSticker)} 
                          className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs bg-white font-medium focus:outline-none focus:border-rose-400" 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-stone-500">Pilih Stiker:</span>
                        <div className="flex gap-1">
                          {['🧸', '💖', '✨', '🌹', '👑'].map((stk) => (
                            <button 
                              key={stk} 
                              onClick={() => handleUpdateEditor(stripCaption, stk)}
                              className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center border transition ${selectedSticker === stk ? 'bg-rose-500 border-rose-500 scale-110 shadow-sm' : 'bg-white border-stone-200'}`}
                            >
                              {stk}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full max-w-[280px]">
                      <a href={finalStripUrl} download={`StudioPhotobooth_${myName}_${partnerName}.png`} className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl shadow-md text-xs text-center block cursor-pointer hover:scale-105 transition">📥 Download (PNG)</a>
                      <button onClick={handleOpenLivePreview} className="px-3 py-2.5 bg-stone-200 text-stone-600 font-bold rounded-xl text-xs hover:bg-stone-300 transition cursor-pointer">Ulangi 🔄</button>
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