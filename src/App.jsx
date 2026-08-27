import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

// KOMPONEN ORNAMEN: Tema Biru/Indigo & Maskulin
const FloatingOrnaments = React.memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0.2 + Math.random() * 0.5 }}
        animate={{ y: "-10vh", rotate: Math.random() * 360 }}
        transition={{
          duration: 12 + Math.random() * 20,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 10
        }}
        className="absolute text-2xl drop-shadow-md"
        style={{ fontSize: `${Math.random() * 20 + 20}px` }}
      >
        {['💙', '✨', '🌌', '🚀', '🎮', '😎'][Math.floor(Math.random() * 6)]}
      </motion.div>
    ))}
  </div>
));

export default function BucinWebsiteCowok() {
  const [step, setStep] = useState(1);
  const [boyName, setBoyName] = useState('');
  const [crushInput, setCrushInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  
  const [countdown, setCountdown] = useState(5);

  const [quizGombalAnswer, setQuizGombalAnswer] = useState('');
  const [quizGombalError, setQuizGombalError] = useState('');
  const [quizChoiceError, setQuizChoiceError] = useState('');
  
  const [foodChoice, setFoodChoice] = useState('');
  const [dateChoice, setDateChoice] = useState('');
  const [loveLanguage, setLoveLanguage] = useState('');
  const [petName, setPetName] = useState('');
  const [apologyStyle, setApologyStyle] = useState('');
  const [movieChoice, setMovieChoice] = useState('');
  const [rainChoice, setRainChoice] = useState('');
  const [giftChoice, setGiftChoice] = useState('');
  
  const [firstImpression, setFirstImpression] = useState('');
  const [kissReaction, setKissReaction] = useState('');

  const [loveInput, setLoveInput] = useState('');
  const [loveError, setLoveError] = useState('');
  const [promiseAnswer, setPromiseAnswer] = useState('');
  const [promiseError, setPromiseError] = useState('');

  // T&C Pra-Jadian Versi Cowok
  const [terms, setTerms] = useState({
    t1: false,
    t2: false,
    t3: false,
    t4: false,
  });

  const [noQuizBtnPos, setNoQuizBtnPos] = useState({ x: 0, y: 0 });
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [loveMeter, setLoveMeter] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const audioRef = useRef(null);
  const finalCardRef = useRef(null);
  
  // NAMA TARGET (NAMA CEWEKNYA)
  const targetName = "Alya"; // Ganti dengan nama target cewek yang diinginkan

  const allTermsChecked = terms.t1 && terms.t2 && terms.t3 && terms.t4;

  useEffect(() => {
    let timer;
    if (step === 1.5) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setStep(2);
      }
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const playSoundEffect = (type) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    } catch (e) {
      console.log('Audio Context Error:', e);
    }
  };

  const funnyResponses = [
    "SALAH BANGEEEET! Masa nama cewek secantik dia lupa?! 😤",
    "Bukan itu woy! Ketik yang bener! 🙄",
    "Dih, pura-pura lupa. Awas aja kalau ketahuan cewek lain! 🔥",
    "Cepetan panggil nama tuan putri yang bener! 🤏",
    `Capek ah salah terus, tak auto-correct aja jadi ${targetName} ya! 🤪`
  ];

  const handleDownloadScreenshot = async () => {
    if (!finalCardRef.current) return;
    setIsSaving(true);
    try {
      const canvas = await html2canvas(finalCardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Bukti_Jadian_${boyName}_dan_${targetName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunduh otomatis. Silakan lakukan Screenshot manual!");
    } finally {
      setIsSaving(false);
    }
  };

  const startExperience = (e) => {
    e.preventDefault();
    if (!boyName.trim()) {
      setNameError('Isi nama lu dulu dong Gantengku! 🫣');
      return;
    }
    setNameError('');
    if (audioRef.current) audioRef.current.play().catch(() => {});
    playSoundEffect('correct');
    setStep(1.5);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const cleanInput = crushInput.trim().toLowerCase();
    if (cleanInput.includes(targetName.toLowerCase())) {
      setNameError('');
      playSoundEffect('correct');
      setStep(3);
    } else {
      playSoundEffect('wrong');
      const nextCount = errorCount + 1;
      setErrorCount(nextCount);
      if (nextCount >= funnyResponses.length) {
        setCrushInput(targetName);
        setNameError(funnyResponses[funnyResponses.length - 1]);
      } else {
        setNameError(funnyResponses[nextCount - 1]);
      }
    }
  };

  const handleGombalSubmit = (e) => {
    e.preventDefault();
    const clean = quizGombalAnswer.trim().toLowerCase();
    if (clean.includes('kesayangan') || clean.includes('sayang')) {
      setQuizGombalError('');
      playSoundEffect('correct');
      setStep(4);
    } else {
      playSoundEffect('wrong');
      setQuizGombalError('Salah! Jawabannya itu "Kesayangan" tauuu 🤪');
    }
  };

  const handleChoiceQuiz = (isCorrect) => {
    if (isCorrect) {
      setQuizChoiceError('');
      playSoundEffect('correct');
      setStep(5);
    } else {
      playSoundEffect('wrong');
      setQuizChoiceError(`Yee! Manisan senyumnya ${targetName} kemana-mana lah! 😜`);
    }
  };

  const handleLoveSubmit = (e) => {
    e.preventDefault();
    if (loveInput.trim().length > 0) {
      setLoveError('');
      playSoundEffect('correct');
      setStep(17); 
    } else {
      playSoundEffect('wrong');
      setLoveError('Diisi dulu dong pesannya buat si cantik! 🥺💕');
    }
  };

  const handlePromiseSubmit = (e) => {
    e.preventDefault();
    if (promiseAnswer.trim().toLowerCase().includes('janji')) {
      setPromiseError('');
      playSoundEffect('correct');
      setStep(18); 
    } else {
      playSoundEffect('wrong');
      setPromiseError("Harus ada kata 'Janji' dong Gantengku biar sah! 😜");
    }
  };

  const moveNoQuizButton = () => {
    playSoundEffect('wrong');
    setNoQuizBtnPos({ x: Math.floor(Math.random() * 200) - 100, y: Math.floor(Math.random() * 200) - 100 });
  };

  const moveNoButton = () => {
    playSoundEffect('wrong');
    setNoBtnPos({ x: Math.floor(Math.random() * 200) - 100, y: Math.floor(Math.random() * 200) - 100 });
  };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const handleAccept = () => {
    playSoundEffect('correct');
    setStep(21);
    
    let count = 0;
    const timer = setInterval(() => {
      count += 5;
      if (count >= 100) {
        setLoveMeter(100);
        clearInterval(timer);
      } else {
        setLoveMeter(count);
      }
    }, 30);

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100, colors: ['#3b82f6', '#6366f1', '#06b6d4'] };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-cyan-200 flex items-center justify-center p-4 overflow-hidden relative font-sans">
      <audio ref={audioRef} src="/sabda.mp3" loop />
      <FloatingOrnaments />

      <AnimatePresence mode="wait">
        
        {/* STEP 1 */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -50 }} className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(59,130,246,0.3)] border border-white/80 text-center max-w-md w-full space-y-6 relative z-10">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-5xl drop-shadow-lg mb-2">💌</motion.div>
            <h1 className="text-3xl font-extrabold text-indigo-700 tracking-wide drop-shadow-sm">Ada Tes Penting... 😎</h1>
            <p className="text-gray-700 text-lg font-medium">Sebelum mulai, ketik dulu nama lu di bawah ini Gantengku!</p>
            <form onSubmit={startExperience} className="space-y-4">
              <input type="text" value={boyName} onChange={(e) => setBoyName(e.target.value)} placeholder="Tulis nama lu..." className="w-full px-5 py-3 rounded-full border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none text-center text-gray-800 font-bold shadow-inner bg-white/80" />
              {nameError && <p className="text-red-500 text-sm font-semibold animate-bounce">{nameError}</p>}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-full shadow-lg transition text-lg">
                Mulai Tesnya... 🚀
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* STEP 1.5 */}
        {step === 1.5 && (
          <motion.div key="step1.5" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(59,130,246,0.3)] border border-white/80 text-center max-w-md w-full space-y-8 flex flex-col items-center relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-28 h-28 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-5xl border-4 border-white relative z-10">🎵</motion.div>
            </div>
            <h2 className="text-2xl font-bold text-indigo-700 animate-pulse">Sabar Gantengku, tunggu musiknya jalan dulu... ✨</h2>
            <div className="text-5xl font-black text-indigo-500 bg-white/90 w-20 h-20 rounded-full flex items-center justify-center border-4 border-indigo-200">{countdown}</div>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(59,130,246,0.3)] border border-white/80 text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 1 untuk <span className="text-indigo-600 drop-shadow-sm">{boyName}</span>:<br/> Siapa nama cewek paling cantik & ngangenin di dunia ini? ✍️🫣
            </h2>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <input type="text" value={crushInput} onChange={(e) => setCrushInput(e.target.value)} placeholder="Siapa ya? 😏" className="w-full px-5 py-3 rounded-full border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none text-center text-gray-800 font-bold bg-white/80" />
              {nameError && <motion.p initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-2xl border border-red-200">{nameError}</motion.p>}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-full transition text-lg">Cek Jawaban ✨</motion.button>
            </form>
          </motion.div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(59,130,246,0.3)] border border-white/80 text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 2: Apa bedanya jam 12:00 siang sama si cantik {targetName}? ⏰</h2>
            <p className="text-sm font-medium text-indigo-600 bg-indigo-50 py-2 rounded-xl">Hint: Kalau jam 12:00 itu Kesiangan, kalau dia itu...</p>
            <form onSubmit={handleGombalSubmit} className="space-y-4">
              <input type="text" value={quizGombalAnswer} onChange={(e) => setQuizGombalAnswer(e.target.value)} placeholder="Ketik tebakanmu..." className="w-full px-5 py-3 rounded-full border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none text-center font-bold bg-white/80" />
              {quizGombalError && <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded-xl">{quizGombalError}</p>}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full py-3 bg-indigo-500 text-white font-bold rounded-full">Jawab 💙</motion.button>
            </form>
          </motion.div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(59,130,246,0.3)] border border-white/80 text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 3: Seberapa manis rasa gula dibanding senyumannya {targetName}? 🍯</h2>
            <div className="space-y-4 pt-2">
              <motion.button onClick={() => handleChoiceQuiz(false)} className="w-full py-4 bg-white/80 text-indigo-700 font-bold rounded-2xl border border-indigo-300 cursor-pointer">Gula tetep lebih manis Gantengku! 🍦</motion.button>
              <motion.button onClick={() => handleChoiceQuiz(true)} className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-2xl cursor-pointer">Jelas manisan senyum {targetName} lah, bikin salting! 🫣💙</motion.button>
            </div>
            {quizChoiceError && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-2xl">{quizChoiceError}</p>}
          </motion.div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(59,130,246,0.3)] border border-white/80 text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 4: Nanti pas nge-date, lu bakal ngajak {targetName} makan apa? 🥩</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Steak / Grill Bareng 🥩', 'Sushi / Makanan Jejepangan 🍣', 'Cafe Aesthetic ☕', 'Pecel Lele / Nasi Padang! 🍛'].map((item, idx) => (
                <motion.button key={idx} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setFoodChoice(item); playSoundEffect('correct'); setStep(6); }} className="py-4 px-2 bg-white text-indigo-700 font-bold rounded-2xl border-2 border-indigo-200 shadow-sm text-sm">{item}</motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 6 */}
        {step === 6 && (
          <motion.div key="step6" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 5: Habis makan, lu bakal ngajak dia ngapain? 🛵</h2>
            <div className="grid grid-cols-1 gap-3">
              {['Nonton Bioskop 🍿', 'Sunmori / Motoran Malam Berdua 🛵', 'Main Timezone / Game Center 🕹️', 'Mabar Game Berdua 🎮'].map((item, idx) => (
                <motion.button key={idx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => { setDateChoice(item); playSoundEffect('correct'); setStep(7); }} className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl border border-indigo-300">{item}</motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 7 */}
        {step === 7 && (
          <motion.div key="step7" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 6: Apa Love Language lu buat si dia? 🫂</h2>
            <div className="grid grid-cols-1 gap-3">
              {['Quality Time (Nemenin dia kemana aja) ⏳', 'Physical Touch (Gandeng & Elus kepalanya) 🧸', 'Words of Affirmation (Bawel muji cantik) 💬', 'Acts of Service (Siap jadi ojol pribadinya) 🛵'].map((item, idx) => (
                <motion.button key={idx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => { setLoveLanguage(item); playSoundEffect('correct'); setStep(8); }} className="w-full py-3 bg-indigo-50 text-indigo-800 font-bold rounded-xl border border-indigo-300 text-left px-5">{item}</motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 8 */}
        {step === 8 && (
          <motion.div key="step8" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 7: Panggilan sayang dari lu buat dia apa nih? 📞</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Sayang / Ay 💙', 'Beb / Babe 💋', 'Si Cantik ✨', 'Bos Besar 🫡'].map((item, idx) => (
                <motion.button key={idx} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setPetName(item); playSoundEffect('correct'); setStep(9); }} className="w-full py-4 bg-white text-indigo-700 font-bold rounded-xl border border-indigo-300 text-sm">{item}</motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 9 */}
        {step === 9 && (
          <motion.div key="step9" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 8: Kalau {targetName} lagi ngambek, cara lu bujuknya gimana? 🥺</h2>
            <div className="grid grid-cols-1 gap-3">
              {['Auto Beliin Seblak / Boba 🧋', 'Minta Maaf Sambil Meluk 🫂', 'Ngajak Jalan-jalan Biar Adem 🛵', 'Ngasih Kejutan Random 🎁'].map((item, idx) => (
                <motion.button key={idx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => { setApologyStyle(item); playSoundEffect('correct'); setStep(10); }} className="w-full py-3 bg-indigo-50 text-indigo-800 font-bold rounded-xl border border-indigo-300 text-left px-5">{item}</motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 10 */}
        {step === 10 && (
          <motion.div key="step10" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 9: Kalau lagi santai nonton Netflix, lu rela nemenin dia nonton apa? 🎬</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Drakor Romantis 💞', 'Film Horror Bareng 👻', 'Comedy Receh 🤣', 'Anime / Action ⚔️'].map((item, idx) => (
                <motion.button key={idx} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setMovieChoice(item); playSoundEffect('correct'); setStep(11); }} className="w-full py-4 bg-white text-indigo-700 font-bold rounded-xl border border-indigo-300 text-sm">{item}</motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 11 */}
        {step === 11 && (
          <motion.div key="step11" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 10: Tiba-tiba di jalan kehujanan deres banget! Reaksi lu cowok banget gimana? 🌧️</h2>
            <div className="grid grid-cols-1 gap-3">
              {['Kasih Jaket Lu Biar Dia Gak Kedinginan 🧥', 'Neduh Sambil Pelukan Tipis-tipis 🫣', 'Beli Jas Hujan Batman Berdua 🦇', 'Terobos Aja Sambil Ketawa-ketawa! 💦'].map((item, idx) => (
                <motion.button key={idx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => { setRainChoice(item); playSoundEffect('correct'); setStep(12); }} className="w-full py-3 bg-indigo-50 text-indigo-800 font-bold rounded-xl border border-indigo-300 text-left px-5">{item}</motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 12 */}
        {step === 12 && (
          <motion.div key="step12" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 11: Seandainya {targetName} tiba-tiba mau ngasih hadiah dadakan, lu paling seneng dikasih apa? 🎁</h2>
            <div className="grid grid-cols-1 gap-3">
              {['Sepatu / Sneakers Keren 👟', 'Konsol Game Baru / Kaset PS 🎮', 'Jam Tangan ⌚', 'Dimasakin Makanan Kesukaan 🍳'].map((item, idx) => (
                <motion.button key={idx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => { setGiftChoice(item); playSoundEffect('correct'); setStep(13); }} className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl border border-indigo-300">{item}</motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 13 */}
        {step === 13 && (
          <motion.div key="step13" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 12: Sebagai cowok sejati, seberapa besar sayang lu ke {targetName}? 🤭</h2>
            <div className="grid grid-cols-2 gap-3">
              {['100% Sayang! 😍', '1000% Sayang Banget! 🔥', 'Melebihi Batas Semesta ~ 🌌', 'Ga Bisa Jauh-jauh Dari Dia 😭'].map((item, idx) => (
                <motion.button key={idx} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { playSoundEffect('correct'); setStep(14); }} className="w-full py-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-xl shadow-md text-sm">{item}</motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 14 */}
        {step === 14 && (
          <motion.div key="step14" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 13: Jujur aja, pas pertama kali liat {targetName}, pikiran pertama lu apa? 💭</h2>
            <div className="grid grid-cols-1 gap-3">
              {['"Cantik juga nih cewek..." 😏', '"Keliatannya jutek, tapi penasaran" 🙄', '"Fix, ini mah calon bidadari gue!" 💍', '"Awalnya biasa aja... eh kecanduan" 🤤'].map((item, idx) => (
                <motion.button key={idx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => { setFirstImpression(item); playSoundEffect('correct'); setStep(15); }} className="w-full py-4 bg-white text-indigo-700 font-bold rounded-xl border border-indigo-300 text-sm px-4">{item}</motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 15 */}
        {step === 15 && (
          <motion.div key="step15" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 14: Misal kita lagi berdua, terus tiba-tiba DIA yang nyium pipi lu duluan... lu ngapain? 💋</h2>
            <div className="grid grid-cols-1 gap-3">
              {['Kaget, salting brutal sampe error 🤖', 'Balas nyium balik dong! Cowok ga boleh kalah 🔥', 'Pura-pura cool padahal jantung disko 🕺', 'Senyum-senyum sok ganteng 😎'].map((item, idx) => (
                <motion.button key={idx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => { setKissReaction(item); playSoundEffect('correct'); setStep(16); }} className="w-full py-4 bg-indigo-50 text-indigo-800 font-bold rounded-xl border border-indigo-300 text-sm px-4">{item}</motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 16 */}
        {step === 16 && (
          <motion.div key="step16" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis 15: Coba dong ketik satu pesen / janji manis buat si cantik {targetName}! 💌</h2>
            <form onSubmit={handleLoveSubmit} className="space-y-4">
              <input type="text" value={loveInput} onChange={(e) => setLoveInput(e.target.value)} placeholder="Ketik pesan dari hati..." className="w-full px-5 py-3 rounded-full border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none text-center font-bold bg-white/80" />
              {loveError && <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded-xl">{loveError}</p>}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full py-3 bg-indigo-500 text-white font-bold rounded-full">Kirim Bukti Cinta 💘</motion.button>
            </form>
          </motion.div>
        )}

        {/* STEP 17 */}
        {step === 17 && (
          <motion.div key="step17" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Kuis Terakhir: Lu harus janji buat selalu lindungin dan bikin {targetName} seneng terus ya? 🥺</h2>
            <form onSubmit={handlePromiseSubmit} className="space-y-4">
              <input type="text" value={promiseAnswer} onChange={(e) => setPromiseAnswer(e.target.value)} placeholder="Ketik 'Iya Janji!' di sini Gantengku..." className="w-full px-5 py-3 rounded-full border-2 border-indigo-300 focus:border-indigo-500 text-center font-bold bg-white/80" />
              {promiseError && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-2xl">{promiseError}</p>}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full py-3 bg-indigo-500 text-white font-bold rounded-full">Janji Boss! 🤝</motion.button>
            </form>
          </motion.div>
        )}

        {/* STEP 18 */}
        {step === 18 && (
          <motion.div key="step18" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-8 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">Berarti fix ya, <span className="text-indigo-600 font-extrabold">{targetName}</span> itu cewek yang pengen banget lu jadiin Pasangan / temen hidup lu? ✨</h2>
            <div className="flex justify-center items-center gap-6 min-h-[100px] w-full relative">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { playSoundEffect('correct'); setStep(19); }} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-full shadow-lg z-10 text-lg">
                Iya Fix Banget! 💙
              </motion.button>
              <motion.button initial={{ x: 0, y: 0 }} animate={{ x: noQuizBtnPos.x, y: noQuizBtnPos.y }} transition={{ type: "spring", stiffness: 350, damping: 20 }} onMouseEnter={moveNoQuizButton} onTouchStart={moveNoQuizButton} onClick={moveNoQuizButton} className="px-6 py-3 bg-gray-400 text-white font-bold rounded-full shadow-lg z-20">
                Gak Yakin 😜
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 19: T&C Versi Cowok */}
        {step === 19 && (
          <motion.div key="step19" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-left max-w-md w-full space-y-6 relative z-10">
            <div className="text-center mb-4">
              <span className="text-4xl">📜</span>
              <h2 className="text-2xl font-bold text-indigo-600 mt-2">Syarat & Ketentuan Pra-Jadian</h2>
              <p className="text-sm text-gray-600 font-medium">Baca baik-baik & centang semua janjinya Gantengku!</p>
            </div>
            <div className="space-y-4 text-sm font-semibold text-gray-700">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={terms.t1} onChange={(e) => { playSoundEffect('correct'); setTerms({...terms, t1: e.target.checked}) }} className="w-5 h-5 mt-0.5 accent-indigo-500" />
                <span>Rela ngurangin waktu mabar / nongkrong demi ngabarin dan nemenin ayang. 🎮🙅‍♂️</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={terms.t2} onChange={(e) => { playSoundEffect('correct'); setTerms({...terms, t2: e.target.checked}) }} className="w-5 h-5 mt-0.5 accent-indigo-500" />
                <span>Dilarang keras genit, balas *story*, atau caper ke cewek lain. Mata dijaga! 👀❌</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={terms.t3} onChange={(e) => { playSoundEffect('correct'); setTerms({...terms, t3: e.target.checked}) }} className="w-5 h-5 mt-0.5 accent-indigo-500" />
                <span>Wajib inisiatif muji {targetName} "Cantik Banget" tiap hari tanpa disuruh. ✨</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={terms.t4} onChange={(e) => { playSoundEffect('correct'); setTerms({...terms, t4: e.target.checked}) }} className="w-5 h-5 mt-0.5 accent-indigo-500" />
                <span>Siap sedia jadi sandaran dan pendengar yang baik kalau ayang lagi *burnout* atau capek. 🫂</span>
              </label>
            </div>
            <motion.button onClick={() => { if(allTermsChecked) { playSoundEffect('correct'); setStep(20); } else { playSoundEffect('wrong'); } }} className={`w-full py-4 font-bold rounded-full shadow-lg transition mt-4 ${allTermsChecked ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
              {allTermsChecked ? "Saya Janji! Lanjut ✍️" : "Centang Dulu Semua Aturannya!"}
            </motion.button>
          </motion.div>
        )}

        {/* STEP 20 */}
        {step === 20 && (
          <motion.div key="step20" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md w-full space-y-8 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">
              Udah janji ya! <br/><br/> Nah, berhubung {targetName} lagi liat hasil tes ini... Lu beneran mau nyatain perasaan buat jadiin dia Pasangan selamanya? 🥺✨
            </h2>
            <div className="flex justify-center items-center gap-6 min-h-[100px] w-full relative">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleAccept} className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-full shadow-lg z-10 text-lg">
                PASTI MAU! 💙
              </motion.button>
              <motion.button initial={{ x: 0, y: 0 }} animate={{ x: noBtnPos.x, y: noBtnPos.y }} transition={{ type: "spring", stiffness: 350, damping: 20 }} onMouseEnter={moveNoButton} onTouchStart={moveNoButton} onClick={moveNoButton} className="px-6 py-3 bg-gray-400 text-white font-bold rounded-full shadow-lg z-20">
                Gak Berani 😜
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 21: Final Reveal & Sertifikat */}
        {step === 21 && (
          <motion.div key="step21" initial={{ opacity: 0, scale: 0.2 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/80 text-center max-w-md w-full space-y-4 flex flex-col items-center max-h-[90vh] overflow-y-auto relative z-10">
            
            <div ref={finalCardRef} className="shrink-0 p-5 bg-white rounded-3xl w-full flex flex-col items-center space-y-4 border border-blue-100 shadow-[0_10px_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
              <div className="absolute -top-4 -left-4 text-5xl opacity-20">🚀</div>
              <div className="absolute -bottom-4 -right-4 text-5xl opacity-20">✨</div>

              <motion.h1 animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 drop-shadow-sm shrink-0">
                BUKTI CINTA COWOK GENTLE! 🎉
              </motion.h1>

              {/* Ukuran dan Foto Hati yang Sudah Di-Fix (Diubah jadi nuansa biru) */}
              <div className="relative flex items-center justify-center my-4 shrink-0" style={{ width: '224px', height: '205px' }}>
                <div className="absolute inset-0 bg-blue-400/50 blur-xl animate-pulse" style={{ clipPath: 'path("M 112,35 A 56,56 0 0,0 0,93 C 0,149 112,205 112,205 C 112,205 224,149 224,93 A 56,56 0 0,0 112,35 Z")' }}></div>
                <img src="/alya.png" alt="Love" className="absolute object-cover z-10 filter drop-shadow-[0_10px_15px_rgba(59,130,246,0.5)]" style={{ width: '208px', height: '189px', clipPath: 'path("M 104,33 A 52,52 0 0,0 0,85 C 0,137 104,189 104,189 C 104,189 208,137 208,85 A 52,52 0 0,0 104,33 Z")' }} />
              </div>

              <div className="w-full shrink-0 bg-blue-100 rounded-full h-5 overflow-hidden relative shadow-inner border border-blue-200">
                <motion.div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${loveMeter}%` }}>
                  Keseriusan {boyName} ke {targetName}: {loveMeter}%
                </motion.div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-2xl border border-blue-200 text-left space-y-2 w-full text-xs text-gray-800 shadow-sm relative leading-relaxed shrink-0">
                <p className="font-extrabold text-indigo-700 text-sm border-b border-blue-200 pb-1">📜 Fakta Kebucinan {boyName}:</p>
                
                <p>Nanti fix bakal ngajak {targetName} makan <span className="font-bold text-indigo-600">{foodChoice}</span>, trus lanjut <span className="font-bold text-indigo-600">{dateChoice}</span> bareng. Kalau milih film Netflix pastinya bakal nemenin nonton <span className="font-bold text-indigo-600">{movieChoice}</span>!</p>
                
                <p>Pas di jalan kehujanan, si cowok sejati ini bakal <span className="font-bold text-indigo-600">{rainChoice}</span>. Kalau {targetName} ngambek? Santai, dia udah janji bakal <span className="font-bold text-indigo-600">{apologyStyle}</span>.</p>
                
                <p>Ternyata *love language*-nya ke kamu itu <span className="font-bold text-indigo-600">{loveLanguage}</span>. Oh iya, *first impression*-nya dia pas pertama ketemu kamu itu <span className="font-bold text-indigo-600">{firstImpression}</span>! Kalau dicium duluan, reaksinya bakal <span className="font-bold text-indigo-600">{kissReaction}</span> 🤪</p>
                
                <p>Dia bakal panggil kamu <span className="font-bold text-indigo-600">{petName}</span>, dan diem-diem dia pengen banget dikasih <span className="font-bold text-indigo-600">{giftChoice}</span> 🎁 (Semoga diwujudin ya!).</p>

                <p className="italic text-indigo-700/90 bg-indigo-100/60 p-2 rounded-lg border border-indigo-200">
                  "{loveInput}" — {boyName} 💙
                </p>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={isSaving} onClick={handleDownloadScreenshot} className="shrink-0 w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-full shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-base">
              {isSaving ? "Sedang Menyimpan..." : "📸 Simpan Sertifikat (PNG)"}
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}