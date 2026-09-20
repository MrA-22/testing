import React, { useState, useEffect, useRef } from 'react';
import { Peer } from 'peerjs';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const bgThemes = {
  tokyo: { name: 'Tokyo Street', emoji: '🗼', type: 'image', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80' },
  seoul: { name: 'Seoul Hanok', emoji: '🏯', type: 'image', url: 'https://images.unsplash.com/photo-1538485399060-071c360ca4fa?auto=format&fit=crop&w=1200&q=80' },
  ny: { name: 'New York City', emoji: '🗽', type: 'image', url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80' },
  paris: { name: 'Paris Eiffel', emoji: '✨', type: 'image', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
  santorini: { name: 'Santorini Greece', emoji: '🏛️', type: 'image', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80' },
  swiss: { name: 'Swiss Alps', emoji: '⛰️', type: 'image', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80' },
  kyoto: { name: 'Kyoto Bamboo', emoji: '🎋', type: 'image', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
  london: { name: 'London Big Ben', emoji: '🇬🇧', type: 'image', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80' },
  venice: { name: 'Venice Canal', emoji: '🛶', type: 'image', url: 'https://images.unsplash.com/photo-1514896856522-8f35f299c8bf?auto=format&fit=crop&w=1200&q=80' },
  la: { name: 'Los Angeles', emoji: '🌴', type: 'image', url: 'https://images.unsplash.com/photo-1534190760960-a298ff1e1548?auto=format&fit=crop&w=1200&q=80' },
  bali: { name: 'Bali Resort', emoji: '🌺', type: 'image', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
  aurora: { name: 'Aurora Norway', emoji: '🌌', type: 'image', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80' },
  amsterdam: { name: 'Amsterdam', emoji: '🚲', type: 'image', url: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80' },
  cappadocia: { name: 'Cappadocia', emoji: '🎈', type: 'image', url: 'https://images.unsplash.com/photo-1641128324970-23021dd0668d?auto=format&fit=crop&w=1200&q=80' },
  tajmahal: { name: 'Taj Mahal', emoji: '🕌', type: 'image', url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80' },
  sydney: { name: 'Sydney Opera', emoji: '🇦🇺', type: 'image', url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80' },
  dubai: { name: 'Dubai Skyline', emoji: '🏙️', type: 'image', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
  rome: { name: 'Rome Colosseum', emoji: '🏛️', type: 'image', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80' },
  prague: { name: 'Prague Bridge', emoji: '🏰', type: 'image', url: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80' },
  hawaii: { name: 'Hawaii Beach', emoji: '🏄', type: 'image', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  maldives: { name: 'Maldives Overwater', emoji: '🏝️', type: 'image', url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80' },
  iceland: { name: 'Iceland Waterfall', emoji: '🌊', type: 'image', url: 'https://images.unsplash.com/photo-1504893524553-eef25d3a958e?auto=format&fit=crop&w=1200&q=80' },
  ibiza: { name: 'Ibiza Sunset', emoji: '🌅', type: 'image', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  banff: { name: 'Banff National Park', emoji: '🌲', type: 'image', url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80' },
  rio: { name: 'Rio de Janeiro', emoji: '🇧🇷', type: 'image', url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80' },
  cuba: { name: 'Havana Cuba', emoji: '🚗', type: 'image', url: 'https://images.unsplash.com/photo-1508401616614-b7c3d995c57a?auto=format&fit=crop&w=1200&q=80' },
  marrakech: { name: 'Marrakech Morocco', emoji: '🏜️', type: 'image', url: 'https://images.unsplash.com/photo-1539650116574-75c1c38541e2?auto=format&fit=crop&w=1200&q=80' },
  fiordland: { name: 'New Zealand Fiord', emoji: '🏔️', type: 'image', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80' },
  osaka: { name: 'Osaka Castle', emoji: '🏯', type: 'image', url: 'https://images.unsplash.com/photo-1590559899731-a388b15264e2?auto=format&fit=crop&w=1200&q=80' },
  lisbon: { name: 'Lisbon Tram', emoji: '🚊', type: 'image', url: 'https://images.unsplash.com/photo-1513603131605-e14112e47264?auto=format&fit=crop&w=1200&q=80' }
};

const layoutOptions = [
  { id: '1x2', label: '1x2 (2 Cut Vertikal)' },
  { id: '1x3', label: '1x3 (3 Cut Vertikal)' },
  { id: '2x2', label: '2x2 (4 Grid Kotak)' },
  { id: 'polaroid', label: '🖼️ Polaroid Klasik' },
  { id: 'photocard', label: '💳 Photocard' },
  { id: 'strip4', label: '🎞️ Strip 4 Cut' },
  { id: 'duo_horizontal', label: '👥 Duo Horizontal' },
  { id: 'triple_grid', label: '📐 3 Grid Asimetris' },
  { id: 'mini_polaroid', label: '📌 Mini Polaroid Duo' },
  { id: 'heart_frame', label: '💖 Love Grid' }
];

const frameThemes = [
  { id: 'rose', name: '🌸 Rose Pink', border: '#f43f5e', accent: '#fb7185', text: '#881337', cardBg: '#ffffff', softBg: '#fff1f2' },
  { id: 'purple', name: '💜 Lilac Dream', border: '#9333ea', accent: '#a855f7', text: '#581c87', cardBg: '#ffffff', softBg: '#faf5ff' },
  { id: 'peach', name: '🍑 Warm Peach', border: '#ea580c', accent: '#f97316', text: '#7c2d12', cardBg: '#ffffff', softBg: '#fff7ed' },
  { id: 'mono', name: '🖤 Aesthetic Mono', border: '#292524', accent: '#78716c', text: '#1c1917', cardBg: '#ffffff', softBg: '#f5f5f4' },
  { id: 'matcha', name: '🍵 Matcha Green', border: '#15803d', accent: '#22c55e', text: '#14532d', cardBg: '#f0fdf4', softBg: '#dcfce7' },
  { id: 'sky', name: '☁️ Sky Blue', border: '#0284c7', accent: '#38bdf8', text: '#0369a1', cardBg: '#f0f9ff', softBg: '#e0f2fe' },
  { id: 'sunset_glow', name: '🌅 Sunset Glow', border: '#c2410c', accent: '#fb923c', text: '#7c2d12', cardBg: '#fff7ed', softBg: '#ffedd5' },
  { id: 'neon_cyber', name: '⚡ Neon Cyber', border: '#db2777', accent: '#f43f5e', text: '#831843', cardBg: '#18181b', softBg: '#27272a' },
  { id: 'choco_latte', name: '☕ Choco Latte', border: '#78350f', accent: '#92400e', text: '#451a03', cardBg: '#fdf8f6', softBg: '#fbe7c6' },
  { id: 'galaxy_night', name: '🌌 Galaxy Night', border: '#4f46e5', accent: '#818cf8', text: '#312e81', cardBg: '#0f172a', softBg: '#1e293b' },

  { id: 'sp_spiderman', name: '🕷️ Spider Hero Web', border: '#dc2626', accent: '#1d4ed8', text: '#991b1b', cardBg: '#fef2f2', softBg: '#fee2e2', isSpecial: true, pattern: 'spiderweb', badge: '🕷️ SPIDER-WEB' },
  { id: 'sp_pikachu', name: '⚡ Pikachu Thunder', border: '#ca8a04', accent: '#facc15', text: '#713f12', cardBg: '#fefce8', softBg: '#fef9c3', isSpecial: true, pattern: 'thunder', badge: '⚡ THUNDER' },
  { id: 'sp_naruto', name: '🍥 Uzumaki Scroll', border: '#ea580c', accent: '#0284c7', text: '#7c2d12', cardBg: '#fff7ed', softBg: '#ffedd5', isSpecial: true, pattern: 'naruto', badge: '🍥 UZUMAKI' },
  { id: 'sp_luffy', name: '🏴‍☠️ Pirate Strawhat', border: '#b91c1c', accent: '#15803d', text: '#7f1d1d', cardBg: '#fef2f2', softBg: '#dcfce7', isSpecial: true, pattern: 'pirate', badge: '🏴‍☠️ STRAP' },
  { id: 'sp_gojo', name: '👁️ Infinite Void', border: '#1e1b4b', accent: '#38bdf8', text: '#312e81', cardBg: '#f8fafc', softBg: '#e0f2fe', isSpecial: true, pattern: 'gojo', badge: '👁️ INFINITY' },
  { id: 'sp_demonslayer', name: '👺 Demon Slayer', border: '#991b1b', accent: '#14532d', text: '#450a0a', cardBg: '#fff5f5', softBg: '#dcfce7', isSpecial: true, pattern: 'demonslayer', badge: '👺 KIMETSU' },
  { id: 'sp_hellokitty', name: '🎀 Hello Kitty Ribbon', border: '#f43f5e', accent: '#fb7185', text: '#9f1239', cardBg: '#fff1f2', softBg: '#ffe4e6', isSpecial: true, pattern: 'kitty', badge: '🎀 RIBBON' },
  { id: 'sp_cinnamon', name: '☁️ Cinnamoroll Cloud', border: '#0284c7', accent: '#38bdf8', text: '#0369a1', cardBg: '#f0f9ff', softBg: '#e0f2fe', isSpecial: true, pattern: 'cloud', badge: '☁️ CLOUDS' },
  { id: 'sp_melody', name: '🐰 My Melody Floral', border: '#ec4899', accent: '#f472b6', text: '#831843', cardBg: '#fdf2f8', softBg: '#fce7f3', isSpecial: true, pattern: 'floral', badge: '🐰 MELODY' },
  { id: 'sp_kuromi', name: '🖤 Kuromi Punk Skull', border: '#581c87', accent: '#a855f7', text: '#3b0764', cardBg: '#faf5ff', softBg: '#f3e8ff', isSpecial: true, pattern: 'skull', badge: '🖤 PUNK' },
  { id: 'sp_stitch', name: '💙 Stitch Ohana Wave', border: '#1d4ed8', accent: '#60a5fa', text: '#1e3a8a', cardBg: '#eff6ff', softBg: '#dbeafe', isSpecial: true, pattern: 'wave', badge: '💙 OHANA' },
  { id: 'sp_pooh', name: '🍯 Winnie Honeycomb', border: '#d97706', accent: '#fbbf24', text: '#78350f', cardBg: '#fffbeb', softBg: '#fef3c7', isSpecial: true, pattern: 'honey', badge: '🍯 HONEY' },
  { id: 'sp_mickey', name: '🐭 Mickey Classic', border: '#18181b', accent: '#dc2626', text: '#09090b', cardBg: '#f4f4f5', softBg: '#f1f5f9', isSpecial: true, pattern: 'mickey', badge: '🐭 MICKEY' },
  { id: 'sp_batman', name: '🦇 Dark Knight Bat', border: '#09090b', accent: '#eab308', text: '#27272a', cardBg: '#18181b', softBg: '#27272a', isSpecial: true, pattern: 'bat', badge: '🦇 GOTHAM' },
  { id: 'sp_deadpool', name: '⚔️ Deadpool Slash', border: '#b91c1c', accent: '#18181b', text: '#7f1d1d', cardBg: '#fef2f2', softBg: '#f3f4f6', isSpecial: true, pattern: 'slash', badge: '⚔️ DEADPOOL' },
  { id: 'sp_ironman', name: '🦾 Stark Arc Reactor', border: '#b91c1c', accent: '#eab308', text: '#7f1d1d', cardBg: '#fffbeb', softBg: '#fef3c7', isSpecial: true, pattern: 'arc', badge: '🦾 STARK' },
  { id: 'sp_goku', name: '🔥 Super Saiyan Aura', border: '#ea580c', accent: '#2563eb', text: '#7c2d12', cardBg: '#fff7ed', softBg: '#dbeafe', isSpecial: true, pattern: 'aura', badge: '🔥 SAIYAN' },
  { id: 'sp_sailormoon', name: '🌙 Sailor Moon Crystal', border: '#db2777', accent: '#facc15', text: '#831843', cardBg: '#fdf2f8', softBg: '#fef9c3', isSpecial: true, pattern: 'crystal', badge: '🌙 CRYSTAL' },
  { id: 'sp_totoro', name: '🌳 Totoro Leaf', border: '#15803d', accent: '#4ade80', text: '#14532d', cardBg: '#f0fdf4', softBg: '#dcfce7', isSpecial: true, pattern: 'leaf', badge: '🌳 TOTORO' },
  { id: 'sp_doraemon', name: '🔔 Doraemon Pocket', border: '#0284c7', accent: '#f43f5e', text: '#0369a1', cardBg: '#f0f9ff', softBg: '#fff1f2', isSpecial: true, pattern: 'pocket', badge: '🔔 POCKET' },
  { id: 'sp_sponge', name: '🍍 Bikini Bottom Bubble', border: '#ca8a04', accent: '#0284c7', text: '#713f12', cardBg: '#fefce8', softBg: '#e0f2fe', isSpecial: true, pattern: 'bubbles', badge: '🍍 SPONGE' },
  { id: 'sp_barbie', name: '💖 Barbie Diamond', border: '#ec4899', accent: '#f472b6', text: '#831843', cardBg: '#fdf2f8', softBg: '#fce7f3', isSpecial: true, pattern: 'diamond', badge: '💖 BARBIE' },
  { id: 'sp_harry', name: '⚡ Hogwarts Magic', border: '#78350f', accent: '#b45309', text: '#451a03', cardBg: '#fdf8f6', softBg: '#fef3c7', isSpecial: true, pattern: 'magic', badge: '⚡ HOGWARTS' },
  { id: 'sp_frozen', name: '❄️ Frozen Snowflake', border: '#0284c7', accent: '#9333ea', text: '#0369a1', cardBg: '#f0f9ff', softBg: '#f3e8ff', isSpecial: true, pattern: 'snowflake', badge: '❄️ FROZEN' },
  { id: 'sp_minecraft', name: '🟩 Pixel Craft', border: '#15803d', accent: '#78716c', text: '#14532d', cardBg: '#f0fdf4', softBg: '#f5f5f4', isSpecial: true, pattern: 'pixel', badge: '🟩 CRAFT' },
  { id: 'sp_cherry', name: '🌸 Sakura Blossom', border: '#f43f5e', accent: '#fda4af', text: '#881337', cardBg: '#fff1f2', softBg: '#ffe4e6', isSpecial: true, pattern: 'sakura', badge: '🌸 SAKURA' },
  { id: 'sp_matchacat', name: '🍵 Neko Matcha', border: '#15803d', accent: '#d97706', text: '#14532d', cardBg: '#f0fdf4', softBg: '#fef3c7', isSpecial: true, pattern: 'matcha', badge: '🍵 MATCHA' },
  { id: 'sp_cyberpunk', name: '🌆 Neo Cyber Grid', border: '#9333ea', accent: '#db2777', text: '#3b0764', cardBg: '#faf5ff', softBg: '#fce7f3', isSpecial: true, pattern: 'cyber', badge: '🌆 CYBER' },
  { id: 'sp_sunsetglow', name: '🌇 Golden Hour Sun', border: '#c2410c', accent: '#fb923c', text: '#7c2d12', cardBg: '#fff7ed', softBg: '#ffedd5', isSpecial: true, pattern: 'sun', badge: '🌇 SUNSET' },
  { id: 'sp_lovelock', name: '🔐 Eternal Lock', border: '#991b1b', accent: '#f43f5e', text: '#450a0a', cardBg: '#fff5f5', softBg: '#fff1f2', isSpecial: true, pattern: 'lock', badge: '🔐 ETERNAL' }
];

const stickerOptions = ['🧸', '💖', '✨', '🌹', '👑', '💐', '🍫', '💍', '💋', '💌', '🍓', '🎀', '⭐', '🦋', '🧊', '🍰', '🐱', '🐥', '🍀', '🔥'];

export default function LiveLoveRoomWithPhotobooth() {
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const [mode, setMode] = useState('menu'); 
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [myName, setMyName] = useState('');
  const [partnerName, setPartnerName] = useState('Ayang');
  const [statusText, setStatusText] = useState('Menunggu koneksi...');

  const [activeTab, setActiveTab] = useState('chat');

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [partnerMood, setPartnerMood] = useState('😊 Normal / Senang');
  const [myMood, setMyMood] = useState('😊 Normal / Senang');
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderAudioRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [activeGiftPopup, setActiveGiftPopup] = useState(null);
  const [notes, setNotes] = useState([]);
  const [inputNote, setInputNote] = useState('');

  // Photobooth States
  const [selectedLayout, setSelectedLayout] = useState('1x2'); 
  const [selectedTheme, setSelectedTheme] = useState('rose'); 
  const [cameraBgTheme, setCameraBgTheme] = useState('sunset');
  const [customBgUrl, setCustomBgUrl] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [flashActive, setFlashActive] = useState(false);
  const [allPhotos, setAllPhotos] = useState([]);
  const allPhotosRef = useRef([]);
  const [boothStep, setBoothStep] = useState('select-layout'); 
  const [currentStep, setCurrentStep] = useState(0);
  const [finalStripUrl, setFinalStripUrl] = useState(null);
  
  const [iAmReady, setIAmReady] = useState(false);
  const [partnerIsReady, setPartnerIsReady] = useState(false);

  // Editor States
  const [stripCaption, setStripCaption] = useState('Our Sweet Moment Together');
  const [captionPos, setCaptionPos] = useState({ x: 50, y: 88, size: 16 }); 
  const [placedStickers, setPlacedStickers] = useState([
    { id: 1, emoji: '🧸', x: 50, y: 78, size: 40 }
  ]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const stickerContainerRef = useRef(null);

  const localStreamRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const remoteStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const currentCallRef = useRef(null);
  const peerInstanceRef = useRef(null);

  const previewCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const localSegmentationRef = useRef(null);
  const remoteSegmentationRef = useRef(null);
  const localResultsRef = useRef(null);
  const remoteResultsRef = useRef(null);
  const bgImageLoadedRef = useRef(null);
  const [isSegmentationLoaded, setIsSegmentationLoaded] = useState(false);

  const [anniversaryDate, setAnniversaryDate] = useState('2024-01-01');
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const quizQuestions = [
    { q: "Apa makanan kesukaan atau jajanan favoritku?", options: ["Seblak/Pedas", "Manis/Dessert", "Makanan Berkuah", "Fast Food"] },
    { q: "Kalau lagi ngambek, biasanya aku paling suka digimanain?", options: ["Diemin dulu", "Dipujuk & ditenangin", "Dikasih makanan", "Diajak ngelawak"] },
    { q: "Tempat impian yang pengen banget kita kunjungi bareng?", options: ["Pegunungan / Villa sejuk", "Pantai / Sunset", "Keliling Luar Negeri", "Taman Bermain / Cafe aesthetic"] }
  ];
  const [quizAnswers, setQuizAnswers] = useState({});
  const [partnerQuizAnswers, setPartnerQuizAnswers] = useState({});

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

  const playShutterSoundAndFlash = () => {
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = audioCtx.sampleRate * 0.05;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1200;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.7, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (window.SelfieSegmentation) {
      initMediaPipe();
      return;
    }
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js";
    script.async = true;
    script.onload = () => {
      initMediaPipe();
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  const initMediaPipe = async () => {
    if (window.SelfieSegmentation && !localSegmentationRef.current) {
      try {
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
      } catch (e) {
        console.error("Gagal inisialisasi MediaPipe:", e);
      }
    }
  };

  useEffect(() => {
    bgImageLoadedRef.current = null;
    const theme = bgThemes[cameraBgTheme];
    let targetUrl = null;

    if (cameraBgTheme === 'custom' && customBgUrl) {
      targetUrl = customBgUrl;
    } else if (theme && theme.type === 'image') {
      targetUrl = theme.url;
    }

    if (targetUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = targetUrl;
      img.onload = () => {
        bgImageLoadedRef.current = img;
      };
      img.onerror = () => {
        bgImageLoadedRef.current = null;
      };
    }
  }, [cameraBgTheme, customBgUrl]);

  useEffect(() => {
    if (localStreamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.play().catch(e => console.log(e));
    }
  }, [boothStep, cameraActive]);

  useEffect(() => {
    if (remoteStream) {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch(e => console.log(e));
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.play().catch(e => console.log(e));
      }
    }
  }, [remoteStream, boothStep]);

  useEffect(() => {
    if ((boothStep === 'preview' || boothStep === 'capturing') && isSegmentationLoaded && cameraActive) {
      let isCancelled = false;

      const renderLoop = async () => {
        if (isCancelled) return;
        const localVid = localVideoRef.current;
        const remoteVid = remoteVideoRef.current;
        const localSeg = localSegmentationRef.current;
        const remoteSeg = remoteSegmentationRef.current;

        if (localVid && localSeg && localVid.readyState >= 2) {
          try {
            await localSeg.send({ image: localVid });
          } catch (e) {}
        }

        const activeRemoteStream = remoteStream || remoteStreamRef.current;
        if (remoteVid && remoteSeg && activeRemoteStream && remoteVid.readyState >= 2) {
          try {
            if (remoteVid.paused) {
              await remoteVid.play().catch(e => console.log(e));
            }
            await remoteSeg.send({ image: remoteVid });
          } catch (e) {}
        }

        drawCompositeFrame();

        if (!isCancelled) {
          animationFrameRef.current = requestAnimationFrame(renderLoop);
        }
      };
      renderLoop();

      return () => {
        isCancelled = true;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
    }
  }, [boothStep, isSegmentationLoaded, cameraBgTheme, customBgUrl, remoteStream, partnerName, myName, cameraActive]);

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

    const currentTheme = cameraBgTheme === 'custom' ? { type: 'image' } : bgThemes[cameraBgTheme];
    
    if (bgImageLoadedRef.current) {
      ctx.drawImage(bgImageLoadedRef.current, 0, 0, w, h);
    } else if (currentTheme) {
      if (currentTheme.type === 'color') {
        ctx.fillStyle = currentTheme.value;
        ctx.fillRect(0, 0, w, h);
      } else if (currentTheme.type === 'gradient') {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, currentTheme.c1);
        grad.addColorStop(1, currentTheme.c2);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, w, h);
      }
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

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
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
          audio: true 
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
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStreamFeed;
            remoteAudioRef.current.play().catch(e => console.log(e));
          }
        });
      }
      return stream;
    } catch (err) {
      console.error("Gagal kamera/audio:", err);
      alert("Tidak dapat mengakses kamera/mikrofon. Pastikan izin aktif!");
      return null;
    }
  };

  const handleReconnectCall = async () => {
    const stream = await initializeCameraAndCall();
    if (stream && conn && conn.peer) {
      conn.send({ type: 'request-video-sync' });
      alert("Permintaan sinkronisasi video & suara dikirim ke pasangan! 🔄");
    }
  };

  const resetToMainMenu = () => {
    if (conn) conn.close();
    if (peer) peer.destroy();
    stopCamera();

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
  };

  const handleLeaveSession = () => {
    if (window.confirm("Yakin ingin keluar dari sesi ruangan ini?")) {
      resetToMainMenu();
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
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStreamFeed;
          remoteAudioRef.current.play().catch(e => console.log(e));
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
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStreamFeed;
          remoteAudioRef.current.play().catch(e => console.log(e));
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
      } else if (data.type === 'pb-bg-custom-sync') {
        setCustomBgUrl(data.url);
        setCameraBgTheme('custom');
      } else if (data.type === 'pb-preview-mode') {
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
            if (remoteAudioRef.current) {
              remoteAudioRef.current.srcObject = remoteStreamFeed;
              remoteAudioRef.current.play().catch(e => console.log(e));
            }
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
        setCaptionPos(data.captionPos);
        setPlacedStickers(data.stickers);
      }
    });

    connection.on('close', () => {
      alert("Pasangan telah keluar dari room. Kembali ke menu utama.");
      resetToMainMenu();
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

  const handleCustomBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        setCustomBgUrl(url);
        setCameraBgTheme('custom');
        if (conn) {
          conn.send({ type: 'pb-bg-custom-sync', url });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getRequiredPhotosCount = () => {
    if (selectedLayout === '1x2' || selectedLayout === 'duo_horizontal' || selectedLayout === 'mini_polaroid') return 2;
    if (selectedLayout === '1x3' || selectedLayout === 'triple_grid') return 3;
    if (selectedLayout === '2x2' || selectedLayout === 'strip4' || selectedLayout === 'heart_frame') return 4;
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
      stopCamera();
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

        playShutterSoundAndFlash();

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
        const activeThemeName = cameraBgTheme === 'custom' ? 'Custom Background' : (bgThemes[cameraBgTheme]?.name || 'Studio');
        ctx.fillText(`✨ ${myName} & ${partnerName} • ${activeThemeName} ✨`, 400, 38);

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

    const currentTheme = frameThemes.find(t => t.id === selectedTheme) || frameThemes[0];

    const drawCoverImage = async (photoSrc, x, y, width, height, radius) => {
      const img = await loadImage(photoSrc);
      if (!img) return;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
      ctx.clip();

      const imgRatio = img.width / img.height;
      const targetRatio = width / height;
      let sW = img.width;
      let sH = img.height;
      let sX = 0;
      let sY = 0;

      if (imgRatio > targetRatio) {
        sW = img.height * targetRatio;
        sX = (img.width - sW) / 2;
      } else {
        sH = img.width / targetRatio;
        sY = (img.height - sH) / 2;
      }

      ctx.drawImage(img, sX, sY, sW, sH, x, y, width, height);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
      ctx.lineWidth = 4;
      ctx.strokeStyle = currentTheme.border;
      ctx.stroke();
      ctx.restore();
    };

    const drawSpecialPattern = () => {
      if (!currentTheme.isSpecial || !currentTheme.pattern) return;
      ctx.save();
      ctx.strokeStyle = currentTheme.accent;
      ctx.fillStyle = currentTheme.accent;
      ctx.lineWidth = 2;

      const pattern = currentTheme.pattern;
      if (pattern === 'spiderweb') {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.moveTo(30 + i * 100, 15);
          ctx.lineTo(30 + i * 100, 830);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(315, 420, 180, 0, Math.PI * 2);
        ctx.stroke();
      } else if (pattern === 'thunder') {
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('⚡ ⚡ ⚡ ⚡ ⚡ ⚡ ⚡ ⚡ ⚡', 40, 40);
        ctx.fillText('⚡ ⚡ ⚡ ⚡ ⚡ ⚡ ⚡ ⚡ ⚡', 40, 815);
      } else if (pattern === 'pocket' || pattern === 'wave') {
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('🔵 🔔 🔵 🔔 🔵 🔔 🔵 🔔 🔵', 40, 40);
        ctx.fillText('🔵 🔔 🔵 🔔 🔵 🔔 🔵 🔔 🔵', 40, 815);
      } else if (pattern === 'bubbles') {
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('🍍 💧 🍍 💧 🍍 💧 🍍 💧 🍍', 40, 40);
        ctx.fillText('🍍 💧 🍍 💧 🍍 💧 🍍 💧 🍍', 40, 815);
      } else {
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('✨ 💖 ✨ 💖 ✨ 💖 ✨ 💖 ✨', 45, 40);
        ctx.fillText('✨ 💖 ✨ 💖 ✨ 💖 ✨ 💖 ✨', 45, 815);
      }
      ctx.restore();
    };

    if (selectedLayout === 'photocard') {
      canvas.width = 520;
      canvas.height = 740;
      ctx.fillStyle = currentTheme.cardBg;
      ctx.beginPath();
      ctx.roundRect(0, 0, 520, 740, 30);
      ctx.fill();

      ctx.lineWidth = 8;
      ctx.strokeStyle = currentTheme.border;
      ctx.stroke();

      if (photos[0]) {
        await drawCoverImage(photos[0], 30, 30, 460, 680, 20);
      }
    } else {
      canvas.width = 630;
      canvas.height = 840;

      ctx.fillStyle = currentTheme.cardBg;
      ctx.beginPath();
      ctx.roundRect(0, 0, 630, 840, 35);
      ctx.fill();

      ctx.save();
      ctx.lineWidth = 10;
      ctx.strokeStyle = currentTheme.border;
      ctx.beginPath();
      ctx.roundRect(15, 15, 600, 810, 25);
      ctx.stroke();
      ctx.restore();

      drawSpecialPattern();

      ctx.fillStyle = currentTheme.text;
      ctx.font = '900 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentTheme.isSpecial ? `✨ ${currentTheme.name} ✨` : 'STUDIO LOVE STRIP', canvas.width / 2, 40);

      if (selectedLayout === '1x2' || selectedLayout === 'mini_polaroid') {
        if (photos[0]) await drawCoverImage(photos[0], 55, 55, 520, 345, 12);
        if (photos[1] || photos[0]) await drawCoverImage(photos[1] || photos[0], 55, 410, 520, 345, 12);
      } else if (selectedLayout === 'duo_horizontal') {
        if (photos[0]) await drawCoverImage(photos[0], 55, 60, 520, 335, 12);
        if (photos[1] || photos[0]) await drawCoverImage(photos[1] || photos[0], 55, 405, 520, 335, 12);
      } else if (selectedLayout === '1x3') {
        if (photos[0]) await drawCoverImage(photos[0], 55, 50, 520, 235, 10);
        if (photos[1] || photos[0]) await drawCoverImage(photos[1] || photos[0], 55, 295, 520, 235, 10);
        if (photos[2] || photos[0]) await drawCoverImage(photos[2] || photos[0], 55, 540, 520, 235, 10);
      } else if (selectedLayout === '2x2') {
        if (photos[0]) await drawCoverImage(photos[0], 45, 55, 260, 340, 10);
        if (photos[1] || photos[0]) await drawCoverImage(photos[1] || photos[0], 325, 55, 260, 340, 10);
        if (photos[2] || photos[0]) await drawCoverImage(photos[2] || photos[0], 45, 405, 260, 340, 10);
        if (photos[3] || photos[1] || photos[0]) await drawCoverImage(photos[3] || photos[1] || photos[0], 325, 405, 260, 340, 10);
      } else if (selectedLayout === 'polaroid') {
        if (photos[0]) await drawCoverImage(photos[0], 65, 55, 500, 680, 15);
      } else if (selectedLayout === 'strip4') {
        if (photos[0]) await drawCoverImage(photos[0], 75, 50, 480, 175, 8);
        if (photos[1] || photos[0]) await drawCoverImage(photos[1] || photos[0], 75, 235, 480, 175, 8);
        if (photos[2] || photos[0]) await drawCoverImage(photos[2] || photos[0], 75, 420, 480, 175, 8);
        if (photos[3] || photos[1] || photos[0]) await drawCoverImage(photos[3] || photos[1] || photos[0], 75, 605, 480, 175, 8);
      } else if (selectedLayout === 'triple_grid') {
        if (photos[0]) await drawCoverImage(photos[0], 55, 50, 520, 345, 10);
        if (photos[1] || photos[0]) await drawCoverImage(photos[1] || photos[0], 55, 405, 250, 340, 10);
        if (photos[2] || photos[0]) await drawCoverImage(photos[2] || photos[0], 325, 405, 250, 340, 10);
      } else if (selectedLayout === 'heart_frame') {
        if (photos[0]) await drawCoverImage(photos[0], 55, 55, 520, 690, 20);
      }
    }

    placedStickers.forEach(stk => {
      ctx.font = `${stk.size || 36}px sans-serif`;
      ctx.textAlign = 'center';
      const canvasX = (stk.x / 100) * canvas.width;
      const canvasY = (stk.y / 100) * canvas.height;
      ctx.fillText(stk.emoji, canvasX, canvasY);
    });

    const captionX = (captionPos.x / 100) * canvas.width;
    const captionY = (captionPos.y / 100) * canvas.height;
    ctx.fillStyle = currentTheme.border;
    ctx.font = `bold ${captionPos.size || 16}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(stripCaption, captionX, captionY);

    setFinalStripUrl(canvas.toDataURL('image/png', 1.0));
  };

  useEffect(() => {
    if (boothStep === 'ready' && allPhotos.length > 0) {
      generatePhotoboothCanvas(allPhotos);
    }
  }, [stripCaption, captionPos, placedStickers, selectedLayout, selectedTheme]);

  const handleUpdateEditor = (newCaption, newCaptionPos, newStickers) => {
    setStripCaption(newCaption);
    setCaptionPos(newCaptionPos);
    setPlacedStickers(newStickers);
    if (conn) {
      conn.send({ type: 'pb-edit-sync', caption: newCaption, captionPos: newCaptionPos, stickers: newStickers });
    }
  };

  const addStickerToCard = (emoji) => {
    const newStickers = [...placedStickers, { id: Date.now(), emoji, x: 50, y: 75, size: 40 }];
    handleUpdateEditor(stripCaption, captionPos, newStickers);
    setSelectedElementId(newStickers[newStickers.length - 1].id);
  };

  const removeSticker = (id) => {
    const newStickers = placedStickers.filter(s => s.id !== id);
    handleUpdateEditor(stripCaption, captionPos, newStickers);
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const updateElementSize = (id, delta) => {
    if (id === 'caption') {
      const newSize = Math.max(10, Math.min(40, (captionPos.size || 16) + delta));
      const newPos = { ...captionPos, size: newSize };
      setCaptionPos(newPos);
      handleUpdateEditor(stripCaption, newPos, placedStickers);
    } else {
      const newStickers = placedStickers.map(s => {
        if (s.id === id) {
          const newSize = Math.max(20, Math.min(120, (s.size || 40) + delta));
          return { ...s, size: newSize };
        }
        return s;
      });
      handleUpdateEditor(stripCaption, captionPos, newStickers);
    }
  };

  const activePinchRef = useRef(null);

  const handleElementPointerDown = (e, id) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setSelectedElementId(id);
  };

  const handleElementPointerMove = (e, id) => {
    e.stopPropagation();
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const container = stickerContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    if (id === 'caption') {
      const newPos = { ...captionPos, x, y };
      setCaptionPos(newPos);
    } else {
      const updated = placedStickers.map(stk => stk.id === id ? { ...stk, x, y } : stk);
      setPlacedStickers(updated);
    }
  };

  const handleElementPointerUp = (e, id) => {
    e.stopPropagation();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch(err) {}
    handleUpdateEditor(stripCaption, captionPos, placedStickers);
  };

  const handleTouchStart = (e, item) => {
    if (e.touches.length === 2) {
      setSelectedElementId(item.id || 'caption');
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      activePinchRef.current = { 
        id: item.id || 'caption', 
        initialDist: dist, 
        initialSize: item.id === 'caption' ? (captionPos.size || 16) : (item.size || 40) 
      };
    }
  };

  const handleTouchMove = (e, item) => {
    if (e.touches.length === 2 && activePinchRef.current && activePinchRef.current.id === (item.id || 'caption')) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = dist / activePinchRef.current.initialDist;
      
      if (item.id === 'caption') {
        const newSize = Math.max(10, Math.min(40, Math.round(activePinchRef.current.initialSize * scale)));
        setCaptionPos(prev => ({ ...prev, size: newSize }));
      } else {
        const newSize = Math.max(20, Math.min(120, Math.round(activePinchRef.current.initialSize * scale)));
        const updated = placedStickers.map(stk => stk.id === item.id ? { ...stk, size: newSize } : stk);
        setPlacedStickers(updated);
      }
    }
  };

  const handleTouchEnd = () => {
    if (activePinchRef.current) {
      activePinchRef.current = null;
      handleUpdateEditor(stripCaption, captionPos, placedStickers);
    }
  };

  const handleWheel = (e, item) => {
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 3 : -3;
    if (item.id === 'caption') {
      const newSize = Math.max(10, Math.min(40, (captionPos.size || 16) + delta));
      const newPos = { ...captionPos, size: newSize };
      setCaptionPos(newPos);
      handleUpdateEditor(stripCaption, newPos, placedStickers);
    } else {
      const newSize = Math.max(20, Math.min(120, (item.size || 40) + delta));
      const updated = placedStickers.map(stk => stk.id === item.id ? { ...stk, size: newSize } : stk);
      handleUpdateEditor(stripCaption, captionPos, updated);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-purple-200 flex items-center justify-center p-2 sm:p-4 overflow-hidden relative font-sans text-stone-800">

      <AnimatePresence>
        {flashActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <video ref={localVideoRef} autoPlay playsInline muted className="hidden" />
      <video ref={remoteVideoRef} autoPlay playsInline className="hidden" />
      <audio ref={remoteAudioRef} autoPlay />

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
        
        {mode === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white/90 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-rose-200 text-center max-w-md w-full space-y-6 relative z-10">
            <div className="text-6xl mb-2 animate-pulse">📸💞</div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Live Space & Photobooth</h1>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">Ruang interaktif real-time. Ngobrol, Counter Jadian, Quiz, Bucket List, dan Photobooth studio bersama pasangan!</p>
            <div className="space-y-3 pt-2">
              <button onClick={() => setMode('create')} className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg transition cursor-pointer text-sm">✨ Buat Room Baru</button>
              <button onClick={() => setMode('join')} className="w-full py-4 bg-white hover:bg-rose-50 text-rose-600 border-2 border-rose-200 font-bold rounded-2xl transition cursor-pointer text-sm">🔗 Gabung ke Room Pasangan</button>
            </div>
          </motion.div>
        )}

        {mode === 'create' && (
          <motion.div key="create" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="bg-white/90 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-rose-200 max-w-md w-full space-y-5 relative z-10 text-left">
            <h2 className="text-xl font-bold text-stone-900 text-center">Buat Room Baru</h2>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Nama Kamu:</label>
                <input type="text" value={myName} onChange={(e) => setMyName(e.target.value)} placeholder="Cth: Goreng" required className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-medium bg-stone-50 text-sm" />
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

        {mode === 'waiting-host' && (
          <motion.div key="waiting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/90 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-rose-200 max-w-md w-full space-y-6 text-center relative z-10">
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

        {mode === 'join' && (
          <motion.div key="join" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="bg-white/90 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-rose-200 max-w-md w-full space-y-5 relative z-10 text-left">
            <h2 className="text-xl font-bold text-stone-900 text-center">Gabung ke Room Pasangan</h2>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Nama Kamu:</label>
                <input type="text" value={myName} onChange={(e) => setMyName(e.target.value)} placeholder="Cth: Ayam" required className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-medium bg-stone-50 text-sm" />
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

        {mode === 'connecting' && (
          <motion.div key="conn" className="bg-white/90 p-8 rounded-3xl text-center space-y-4 max-w-sm w-full shadow-2xl border border-rose-100">
            <div className="text-4xl animate-spin">💫</div>
            <h3 className="font-bold text-stone-800">{statusText}</h3>
            {isConnected && (
              <button onClick={() => setMode('dashboard')} className="w-full py-3 bg-green-500 text-white font-bold rounded-xl text-sm">Masuk Ruang Live ✨</button>
            )}
          </motion.div>
        )}

        {mode === 'dashboard' && (
          <motion.div key="dash" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/95 backdrop-blur-2xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-rose-200 max-w-md w-full space-y-2 relative z-10 flex flex-col h-[94vh] max-h-[780px]">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-1.5 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-green-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Terhubung Live (Suara Aktif 🎙️)
                  </span>
                  <button
                    onClick={handleLeaveSession}
                    className="px-2 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-[10px] font-bold transition cursor-pointer"
                  >
                    🚪 Keluar
                  </button>
                </div>
                <h2 className="text-xs font-bold text-stone-900 mt-0.5">{myName} & {partnerName}</h2>
              </div>

              <div className="flex bg-stone-100 p-1 rounded-xl text-[11px] font-bold gap-1 overflow-x-auto max-w-[190px]">
                <button onClick={() => setActiveTab('chat')} className={`px-2 py-0.5 rounded-lg transition whitespace-nowrap ${activeTab === 'chat' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}>💬 Chat</button>
                <button onClick={() => setActiveTab('counter')} className={`px-2 py-0.5 rounded-lg transition whitespace-nowrap ${activeTab === 'counter' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}>⏳</button>
                <button onClick={() => setActiveTab('quiz')} className={`px-2 py-0.5 rounded-lg transition whitespace-nowrap ${activeTab === 'quiz' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}>❓</button>
                <button onClick={() => setActiveTab('bucket')} className={`px-2 py-0.5 rounded-lg transition whitespace-nowrap ${activeTab === 'bucket' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}>🎡</button>
                <button onClick={() => setActiveTab('notes')} className={`px-2 py-0.5 rounded-lg transition whitespace-nowrap ${activeTab === 'notes' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}>💌</button>
                <button onClick={() => setActiveTab('photobooth')} className={`px-2 py-0.5 rounded-lg transition whitespace-nowrap ${activeTab === 'photobooth' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'}`}>📸 Booth</button>
              </div>
            </div>

            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col space-y-2 overflow-hidden">
                <div className="grid grid-cols-2 gap-2 shrink-0">
                  <select value={myMood} onChange={(e) => handleMoodChange(e.target.value)} className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold bg-stone-50 text-stone-800 focus:outline-none">
                    <option value="😊 Senang">😊 Senang</option>
                    <option value="🥺 Lagi Kangen">🥺 Lagi Kangen</option>
                    <option value="☕ Lagi Santai">☕ Lagi Santai</option>
                    <option value="😴 Mengantuk">😴 Mengantuk</option>
                    <option value="😡 Lagi Ngambek">😡 Lagi Ngambek</option>
                  </select>
                  <button onClick={() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 } })} className="py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer">💖 Kirim Hati</button>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 shrink-0 text-xs">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">Kado:</span>
                  <button onClick={() => sendVirtualGift("Bunga Mawar", "🌹")} className="px-2 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-xl font-bold shrink-0 text-[11px]">🌹 Bunga</button>
                  <button onClick={() => sendVirtualGift("Cokelat Manis", "🍫")} className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold shrink-0 text-[11px]">🍫 Cokelat</button>
                  <button onClick={() => sendVirtualGift("Cincin Romantis", "💍")} className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl font-bold shrink-0 text-[11px]">💍 Cincin</button>
                  <button onClick={() => sendVirtualGift("Boneka Beruang", "🧸")} className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold shrink-0 text-[11px]">🧸 Boneka</button>
                </div>

                <div className="flex-1 bg-stone-50 border border-stone-200/80 rounded-2xl p-2.5 overflow-y-auto space-y-2 flex flex-col">
                  {messages.length === 0 ? (
                    <div className="my-auto text-center text-xs text-stone-400">Kirim sapaan atau voice note ke {partnerName}! 👋</div>
                  ) : (
                    messages.map((m, idx) => (
                      <div key={idx} className={`flex flex-col max-w-[85%] ${m.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                        {m.isVoice ? (
                          <div className={`p-2.5 rounded-2xl shadow-sm border ${m.sender === 'me' ? 'bg-rose-500 text-white border-rose-600 rounded-br-none' : 'bg-white text-stone-800 border-stone-200 rounded-bl-none'}`}>
                            <div className="text-[10px] font-bold mb-1 opacity-80">{m.sender === 'me' ? '🎤 Kamu' : `🎤 ${partnerName}`}</div>
                            <audio controls src={m.audio} className="w-40 sm:w-48 h-8" />
                          </div>
                        ) : (
                          <div className={`px-3 py-1.5 rounded-2xl text-xs font-medium ${m.sender === 'me' ? 'bg-rose-500 text-white rounded-br-none shadow-sm' : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-sm'}`}>{m.text}</div>
                        )}
                        <span className="text-[9px] text-stone-400 mt-0.5 px-1">{m.time}</span>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-1.5 shrink-0 items-center">
                  <button
                    type="button"
                    onClick={isRecording ? stopAudioRecording : startAudioRecording}
                    className={`p-2.5 rounded-2xl text-white font-bold text-xs transition cursor-pointer flex items-center justify-center shrink-0 shadow-sm ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-rose-500 hover:bg-rose-600'}`}
                  >
                    {isRecording ? '⏹️' : '🎙️'}
                  </button>
                  <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder={isRecording ? "Merekam..." : `Pesan ke ${partnerName}...`} disabled={isRecording} className="flex-1 px-3 py-2.5 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 font-medium bg-stone-50 text-xs" />
                  <button type="submit" disabled={isRecording} className="px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-2xl text-xs shadow-sm cursor-pointer">Kirim</button>
                </form>
              </div>
            )}

            {activeTab === 'counter' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3 overflow-y-auto p-3 text-center">
                <div className="text-3xl">💖⏳</div>
                <h3 className="font-bold text-stone-900 text-sm">Waktu Kebersamaan Kita</h3>
                
                <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs">
                  <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-2xl">
                    <span className="text-xl font-black text-rose-600">{timeTogether.days}</span>
                    <p className="text-[10px] font-bold text-stone-600">Hari</p>
                  </div>
                  <div className="bg-pink-50 border border-pink-200 p-2.5 rounded-2xl">
                    <span className="text-xl font-black text-pink-600">{timeTogether.hours}</span>
                    <p className="text-[10px] font-bold text-stone-600">Jam</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-2.5 rounded-2xl">
                    <span className="text-xl font-black text-purple-600">{timeTogether.minutes}</span>
                    <p className="text-[10px] font-bold text-stone-600">Menit</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl">
                    <span className="text-xl font-black text-amber-600">{timeTogether.seconds}</span>
                    <p className="text-[10px] font-bold text-stone-600">Detik</p>
                  </div>
                </div>

                <div className="w-full max-w-xs pt-1">
                  <label className="block text-[10px] font-bold text-stone-600 mb-1">Tanggal Jadian:</label>
                  <input type="date" value={anniversaryDate} onChange={(e) => setAnniversaryDate(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold bg-stone-50 text-center" />
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="flex-1 flex flex-col space-y-2.5 overflow-y-auto p-1">
                <div className="text-center shrink-0">
                  <h3 className="font-bold text-stone-900 text-xs">❓ Seberapa Kenal Kamu Sama Aku?</h3>
                </div>

                <div className="space-y-3">
                  {quizQuestions.map((item, idx) => (
                    <div key={idx} className="bg-stone-50 border border-stone-200 p-2.5 rounded-2xl space-y-1.5">
                      <p className="text-[11px] font-bold text-stone-800">{idx + 1}. {item.q}</p>
                      <div className="grid grid-cols-2 gap-1">
                        {item.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => {
                              const updated = { ...quizAnswers, [idx]: opt };
                              setQuizAnswers(updated);
                              if (conn) conn.send({ type: 'quiz-sync', answers: updated });
                            }}
                            className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition ${quizAnswers[idx] === opt ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-white text-stone-700 border-stone-200'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {partnerQuizAnswers[idx] && (
                        <p className="text-[10px] text-rose-600 font-semibold">Jawaban {partnerName}: <span className="underline">{partnerQuizAnswers[idx]}</span></p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bucket' && (
              <div className="flex-1 flex flex-col space-y-2.5 overflow-y-auto p-1">
                <div className="text-center shrink-0">
                  <h3 className="font-bold text-stone-900 text-xs">🎡 Ide Kencan & Bucket List</h3>
                </div>

                <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-3 rounded-2xl shadow-md text-center space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">🎲 Putar Ide Kencan</p>
                  <p className="text-[11px] font-medium bg-white/20 p-2 rounded-xl">{randomDateIdea}</p>
                  <button
                    onClick={() => {
                      const rand = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
                      setRandomDateIdea(rand);
                    }}
                    className="py-1 px-3 bg-white text-rose-600 font-bold rounded-xl text-[10px] shadow cursor-pointer"
                  >
                    Acak Ide ✨
                  </button>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-stone-800 text-[11px]">📋 Our Bucket List:</h4>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newBucketItem.trim()) return;
                    const updated = [...bucketList, { id: Date.now(), text: newBucketItem, done: false }];
                    setBucketList(updated);
                    setNewBucketItem('');
                    if (conn) conn.send({ type: 'bucket-sync', list: updated });
                  }} className="flex gap-1.5">
                    <input type="text" value={newBucketItem} onChange={(e) => setNewBucketItem(e.target.value)} placeholder="Impian baru..." className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-stone-50" />
                    <button type="submit" className="px-3 py-1.5 bg-rose-500 text-white font-bold rounded-xl text-xs">Tambah</button>
                  </form>

                  <div className="space-y-1 pt-0.5">
                    {bucketList.map((item) => (
                      <div key={item.id} className={`flex items-center justify-between p-2 rounded-xl border text-[11px] ${item.done ? 'bg-emerald-50 border-emerald-200 text-emerald-800 line-through' : 'bg-stone-50 border-stone-200 text-stone-800'}`}>
                        <span>{item.text}</span>
                        <button
                          onClick={() => {
                            const updated = bucketList.map(b => b.id === item.id ? { ...b, done: !b.done } : b);
                            setBucketList(updated);
                            if (conn) conn.send({ type: 'bucket-sync', list: updated });
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${item.done ? 'bg-emerald-200 text-emerald-800' : 'bg-stone-200 text-stone-700'}`}
                        >
                          {item.done ? 'Selesai' : 'Belum'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="flex-1 flex flex-col space-y-2 overflow-hidden">
                <div className="text-center shrink-0">
                  <h3 className="font-bold text-stone-900 text-xs">💌 Papan Catatan Hati</h3>
                </div>

                <form onSubmit={handleSendNote} className="flex gap-1.5 shrink-0">
                  <input type="text" value={inputNote} onChange={(e) => setInputNote(e.target.value)} placeholder="Tulis catatan romantis..." className="flex-1 px-3 py-2 rounded-2xl border border-stone-200 focus:border-rose-400 focus:outline-none text-stone-900 bg-stone-50 text-xs" />
                  <button type="submit" className="px-3 py-2 bg-rose-500 text-white font-bold rounded-2xl text-xs shadow-sm cursor-pointer">Tempel</button>
                </form>

                <div className="flex-1 bg-stone-50 border border-stone-200/80 rounded-2xl p-2.5 overflow-y-auto space-y-2">
                  {notes.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center text-xs text-stone-400">Belum ada catatan hati. ✨</div>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className={`p-3 rounded-2xl shadow-sm border border-white/50 ${note.color} flex flex-col justify-between`}>
                        <p className="text-xs font-medium whitespace-pre-wrap">{note.text}</p>
                        <div className="flex justify-between items-center mt-2 pt-1 border-t border-black/5 text-[9px] opacity-75">
                          <span className="font-bold">— {note.sender}</span>
                          <span>{note.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'photobooth' && (
              <div className="flex-1 flex flex-col items-center justify-between space-y-1 overflow-y-auto p-1">
                
                {boothStep === 'select-layout' && (
                  <div className="space-y-2.5 w-full text-left my-auto overflow-y-auto max-h-[70vh] pr-1">
                    <div className="text-center">
                      <h3 className="font-bold text-stone-900 text-sm">Photobooth Studio Bersama 📸</h3>
                      <p className="text-[11px] text-stone-500">Pilih 10 Layout & 30 Bingkai Spesial (Pikachu, Spider, Anime, dll)!</p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Pilih Layout:</label>
                      <div className="grid grid-cols-2 gap-1 max-h-[110px] overflow-y-auto pr-1">
                        {layoutOptions.map((layout) => (
                          <button key={layout.id} onClick={() => handleLayoutChange(layout.id)} className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition cursor-pointer ${selectedLayout === layout.id ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'}`}>{layout.label}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Pilih Bingkai & Warna (30 Pilihan):</label>
                      <div className="grid grid-cols-2 gap-1 max-h-[130px] overflow-y-auto pr-1">
                        {frameThemes.map((theme) => (
                          <button key={theme.id} onClick={() => handleThemeChange(theme.id)} className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition cursor-pointer flex items-center justify-between ${selectedTheme === theme.id ? 'bg-stone-900 text-white border-stone-900 shadow-sm' : theme.isSpecial ? 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'}`}>
                            <span className="truncate">{theme.name}</span>
                            {theme.isSpecial && <span className="text-[8px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full shrink-0">Spesial</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button onClick={handleOpenLivePreview} className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl shadow-md text-xs cursor-pointer mt-1">Buka Studio Live 🎥</button>
                  </div>
                )}

                {boothStep === 'preview' && (
                  <div className="space-y-2 w-full text-center my-auto">
                    <p className="text-[11px] font-bold text-stone-700">✨ Atur Pose & Pilih dari 30 Destinasi Wisata Dunia! ✨</p>
                    
                    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-2 border-rose-200 p-2 rounded-3xl shadow-lg max-w-[420px] mx-auto space-y-1.5">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-rose-700 tracking-wide">
                          💖 {myName} & {partnerName} • {cameraBgTheme === 'custom' ? '🖼️ Custom' : (bgThemes[cameraBgTheme]?.emoji + ' ' + bgThemes[cameraBgTheme]?.name)}
                        </span>
                        {cameraActive && (
                          <button onClick={handleReconnectCall} className="text-[9px] bg-rose-200 hover:bg-rose-300 text-rose-800 font-bold px-2 py-0.5 rounded-lg transition cursor-pointer">🔄 Hubungkan</button>
                        )}
                      </div>
                      
                      <div className="relative bg-stone-900 rounded-2xl overflow-hidden border-2 border-rose-300 h-[170px] flex items-center justify-center shadow-inner">
                        {cameraActive ? (
                          <canvas ref={previewCanvasRef} width={1280} height={720} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-3 space-y-1.5">
                            <p className="text-[11px] text-stone-300">Kamera & suara belum aktif.</p>
                            <button 
                              onClick={initializeCameraAndCall}
                              className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-[11px] shadow transition cursor-pointer"
                            >
                              🎥 Nyalakan Kamera
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-rose-200 shadow-xs">
                        <span className="text-[10px] font-bold text-stone-700">📁 Pakai Background Sendiri:</span>
                        <label className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-xs">
                          Pilih Foto 📤
                          <input type="file" accept="image/*" onChange={handleCustomBgUpload} className="hidden" />
                        </label>
                      </div>

                      <div className="pt-0.5">
                        <span className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-1">Pilih dari 30 Destinasi Wisata Dunia:</span>
                        <div className="grid grid-cols-5 gap-1 max-h-[90px] overflow-y-auto pr-1">
                          {Object.keys(bgThemes).map((key) => {
                            const bg = bgThemes[key];
                            return (
                              <button
                                key={key}
                                onClick={() => handleCameraBgChange(key)}
                                className={`py-1.5 px-1 rounded-xl text-[9px] font-bold border transition cursor-pointer flex flex-col items-center gap-0.5 ${cameraBgTheme === key ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-105' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'}`}
                              >
                                <span className="text-xs">{bg.emoji}</span>
                                <span className="text-[7px] truncate w-full">{bg.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/90 border border-stone-200 p-1.5 rounded-2xl max-w-[290px] mx-auto text-[11px] space-y-0.5 shadow-xs">
                      <div className="flex justify-between items-center px-1">
                        <span>Kamu:</span>
                        <span className={`font-bold ${iAmReady ? 'text-emerald-600' : 'text-amber-600'}`}>{iAmReady ? '✔️ Siap!' : '⏳ Belum'}</span>
                      </div>
                      <div className="flex justify-between items-center px-1">
                        <span>{partnerName}:</span>
                        <span className={`font-bold ${partnerIsReady ? 'text-emerald-600' : 'text-amber-600'}`}>{partnerIsReady ? '✔️ Siap!' : '⏳ Belum'}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 max-w-[290px] mx-auto pt-0.5">
                      <button onClick={() => { stopCamera(); setBoothStep('select-layout'); }} className="py-1.5 px-3 bg-stone-200 text-stone-700 font-bold rounded-xl text-xs">← Menu</button>
                      <button 
                        onClick={handleToggleReady} 
                        className={`flex-1 py-1.5 font-bold rounded-xl shadow-md text-xs cursor-pointer transition ${iAmReady ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white animate-pulse'}`}
                      >
                        {iAmReady ? 'Batal Siap ❌' : '✨ Saya Siap!'}
                      </button>
                    </div>
                  </div>
                )}

                {boothStep === 'capturing' && (
                  <div className="space-y-3 w-full text-center my-auto">
                    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-2 border-rose-200 p-2.5 rounded-3xl shadow-lg max-w-[420px] mx-auto space-y-2">
                      <div className="relative bg-stone-900 rounded-2xl overflow-hidden border-2 border-rose-300 h-[200px] flex items-center justify-center">
                        <canvas ref={previewCanvasRef} width={1280} height={720} className="w-full h-full object-cover" />
                      </div>
                    </div>

                    {countdown !== null && (
                      <div className="text-6xl font-black text-rose-600 animate-bounce">{countdown}</div>
                    )}
                    <p className="text-xs font-semibold text-rose-600 animate-pulse">
                      Menjepret foto studio bersama ({currentStep + 1}/{getRequiredPhotosCount()})...
                    </p>
                  </div>
                )}

                {boothStep === 'ready' && finalStripUrl && (
                  <div className="w-full flex-1 flex flex-col items-center justify-center space-y-1 my-auto">
                    
                    <div 
                      ref={stickerContainerRef} 
                      className="w-[170px] sm:w-[190px] relative rounded-2xl shadow-2xl overflow-hidden select-none touch-none border-2 border-rose-300 bg-white shrink-0 my-auto"
                    >
                      <img src={finalStripUrl} alt="Hasil Photobooth" className="w-full h-auto object-contain block pointer-events-none" />
                      
                      <div
                        onPointerDown={(e) => handleElementPointerDown(e, 'caption')}
                        onPointerMove={(e) => handleElementPointerMove(e, 'caption')}
                        onPointerUp={(e) => handleElementPointerUp(e, 'caption')}
                        onTouchStart={(e) => handleTouchStart(e, { id: 'caption' })}
                        onTouchMove={(e) => handleTouchMove(e, { id: 'caption' })}
                        onTouchEnd={handleTouchEnd}
                        onWheel={(e) => handleWheel(e, { id: 'caption' })}
                        onClick={() => setSelectedElementId('caption')}
                        style={{
                          position: 'absolute',
                          left: `${captionPos.x}%`,
                          top: `${captionPos.y}%`,
                          transform: 'translate(-50%, -50%)',
                          fontSize: `${(captionPos.size || 16) * 0.55}px`,
                          touchAction: 'none'
                        }}
                        className={`cursor-grab active:cursor-grabbing px-1.5 py-0.5 rounded text-center transition-all whitespace-nowrap ${selectedElementId === 'caption' ? 'ring-2 ring-rose-500 bg-white/90 shadow-md' : ''}`}
                      >
                        <span className="font-bold text-rose-700 drop-shadow-xs block">{stripCaption}</span>
                      </div>

                      {placedStickers.map((s) => (
                        <div
                          key={s.id}
                          onPointerDown={(e) => handleElementPointerDown(e, s.id)}
                          onPointerMove={(e) => handleElementPointerMove(e, s.id)}
                          onPointerUp={(e) => handleElementPointerUp(e, s.id)}
                          onTouchStart={(e) => handleTouchStart(e, s)}
                          onTouchMove={(e) => handleTouchMove(e, s)}
                          onTouchEnd={handleTouchEnd}
                          onWheel={(e) => handleWheel(e, s)}
                          onClick={() => setSelectedElementId(s.id)}
                          style={{
                            position: 'absolute',
                            left: `${s.x}%`,
                            top: `${s.y}%`,
                            transform: 'translate(-50%, -50%)',
                            fontSize: `${(s.size || 40) * 0.48}px`,
                            touchAction: 'none'
                          }}
                          className={`cursor-grab active:cursor-grabbing p-0.5 transition-transform ${selectedElementId === s.id ? 'ring-2 ring-rose-500 rounded bg-white/70 shadow-md' : ''}`}
                        >
                          {s.emoji}
                        </div>
                      ))}
                    </div>

                    <div className="bg-stone-50 border border-stone-200 p-1.5 rounded-2xl w-full max-w-[300px] space-y-1 text-left shadow-sm shrink-0">
                      <p className="text-[9px] font-bold text-stone-700 text-center">✨ Editor (Cubit 2 jari teks/stiker untuk besar/kecil)</p>
                      
                      <div>
                        <label className="block text-[9px] font-semibold text-stone-500 mb-0.5">Ubah Teks Caption:</label>
                        <input 
                          type="text" 
                          value={stripCaption} 
                          onChange={(e) => handleUpdateEditor(e.target.value, captionPos, placedStickers)} 
                          className="w-full px-2 py-1 rounded-xl border border-stone-200 text-xs bg-white font-medium focus:outline-none focus:border-rose-400" 
                        />
                      </div>

                      <div>
                        <span className="block text-[9px] font-semibold text-stone-500 mb-0.5">Tambah Stiker:</span>
                        <div className="grid grid-cols-10 gap-1 max-h-[45px] overflow-y-auto p-1 bg-white rounded-xl border border-stone-200 shadow-inner">
                          {stickerOptions.map((stk) => (
                            <button 
                              key={stk} 
                              onClick={() => addStickerToCard(stk)}
                              className="w-5 h-5 rounded-lg text-xs flex items-center justify-center hover:bg-rose-100 transition cursor-pointer"
                            >
                              {stk}
                            </button>
                          ))}
                        </div>
                      </div>

                      {selectedElementId && (
                        <div className="bg-rose-50 border border-rose-200 p-1 rounded-xl flex items-center justify-between text-xs">
                          <span className="font-bold text-rose-700 text-[10px]">Atur {selectedElementId === 'caption' ? 'Teks' : 'Stiker'}:</span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateElementSize(selectedElementId, -4)} className="px-1.5 py-0.5 bg-white border border-rose-300 font-bold rounded shadow-xs text-[10px]">➖</button>
                            <button onClick={() => updateElementSize(selectedElementId, 4)} className="px-1.5 py-0.5 bg-white border border-rose-300 font-bold rounded shadow-xs text-[10px]">➕</button>
                            {selectedElementId !== 'caption' && (
                              <button onClick={() => removeSticker(selectedElementId)} className="px-1.5 py-0.5 bg-red-500 text-white font-bold rounded shadow-xs text-[10px]">Hapus</button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 w-full max-w-[300px] shrink-0 pt-0.5">
                      <a href={finalStripUrl} download={`StudioPhotobooth_${myName}_${partnerName}.png`} className="flex-1 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl shadow-md text-xs text-center block cursor-pointer hover:scale-105 transition">📥 Download (PNG)</a>
                      <button onClick={handleOpenLivePreview} className="px-3 py-1.5 bg-stone-200 text-stone-600 font-bold rounded-xl text-xs hover:bg-stone-300 transition cursor-pointer shadow-xs">Ulangi 🔄</button>
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