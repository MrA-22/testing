import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

export default function BucinWebsite() {
  const [step, setStep] = useState(1);
  const [girlName, setGirlName] = useState('');
  const [crushInput, setCrushInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  
  // State untuk Layar Tunggu Musik (5 detik)
  const [countdown, setCountdown] = useState(5);

  const [quizGombalAnswer, setQuizGombalAnswer] = useState('');
  const [quizGombalError, setQuizGombalError] = useState('');
  const [quizChoiceError, setQuizChoiceError] = useState('');
  const [foodChoice, setFoodChoice] = useState('');
  const [promiseAnswer, setPromiseAnswer] = useState('');
  const [promiseError, setPromiseError] = useState('');

  const [noQuizBtnPos, setNoQuizBtnPos] = useState({ x: 0, y: 0 });
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [loveMeter, setLoveMeter] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const audioRef = useRef(null);
  const finalCardRef = useRef(null);
  const targetName = "Arif";

  // Effect untuk timer mundur 5 detik pada step "loading" (Step 1.5)
  useEffect(() => {
    let timer;
    if (step === 1.5) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setStep(2); // Otomatis masuk ke Kuis 1 setelah 5 detik
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
    "SALAH BANGEEEET! Mana ada cowok ganteng nama itu?! 😤",
    "Bukan itu woy! Ketik 'Arif' yang bener! 🙄",
    "Dih, amnesia ya? Kan cowok kamu itu Arif! 🔥",
    "Jangan pura-pura lupa deh, panggil nama mas ganteng 'Arif'! 🤏",
    "Capek ah salah terus, tak auto-correct aja jadi Arif ya! 🤪"
  ];

  const promiseWrongResponses = [
    "Eitss salah! Harus ada kata \"Janji\"-nya dong biar resmi! 😜",
    "Tet-tot! Mana kata \"Janji\"-nya? Ketik ulang yang bener dong cantik! 🤏🥹",
    "Kok gak janji sih? Jangan pura-pura lupa, wajib pakai kata \"Janji\" ya! 😤💖"
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
      link.download = `Bukti_Jadian_${girlName || 'Kita'}_dan_${targetName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Gagal menyimpan screenshot:", err);
      alert("Gagal mengunduh otomatis. Silakan lakukan Screenshot manual di layar HP ya!");
    } finally {
      setIsSaving(false);
    }
  };

  const startExperience = (e) => {
    e.preventDefault();
    if (!girlName.trim()) {
      setNameError('Isi nama kamu dulu dong biar afdol! 🫣');
      return;
    }
    setNameError('');
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio play blocked:", err));
    }
    playSoundEffect('correct');
    setStep(1.5); // Pindah ke layar tunggu 5 detik terlebih dahulu
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const cleanInput = crushInput.trim().toLowerCase();

    if (cleanInput.includes('arif')) {
      setNameError('');
      playSoundEffect('correct');
      setStep(3);
    } else {
      playSoundEffect('wrong');
      const nextCount = errorCount + 1;
      setErrorCount(nextCount);

      if (nextCount >= funnyResponses.length) {
        setCrushInput(targetName);
        setNameError("Daripada makin ngaco tak isiin aja nih: Arif! 😜");
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
      setQuizChoiceError('Yee geer! Mana ada manis kayak es krim, kamu itu manisnya kayak jodoh aku! 😜');
    }
  };

  const handleFoodSubmit = (choice) => {
    setFoodChoice(choice);
    playSoundEffect('correct');
    setStep(6);
  };

  const handlePromiseSubmit = (e) => {
    e.preventDefault();
    const clean = promiseAnswer.trim().toLowerCase();
    
    if (clean.includes('janji')) {
      setPromiseError('');
      playSoundEffect('correct');
      setStep(7);
    } else {
      playSoundEffect('wrong');
      const randomIndex = Math.floor(Math.random() * promiseWrongResponses.length);
      setPromiseError(promiseWrongResponses[randomIndex]);
    }
  };

  const moveNoQuizButton = () => {
    playSoundEffect('wrong');
    const randomX = Math.floor(Math.random() * 200) - 100;
    const randomY = Math.floor(Math.random() * 200) - 100;
    setNoQuizBtnPos({ x: randomX, y: randomY });
  };

  const moveNoButton = () => {
    playSoundEffect('wrong');
    const randomX = Math.floor(Math.random() * 200) - 100;
    const randomY = Math.floor(Math.random() * 200) - 100;
    setNoBtnPos({ x: randomX, y: randomY });
  };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const handleAccept = () => {
    playSoundEffect('correct');
    setStep(9);
    
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
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-red-100 flex items-center justify-center p-4 overflow-hidden relative font-sans">
      
      <audio ref={audioRef} src="/sabda.mp3" loop />

      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute top-10 left-10 text-4xl opacity-30 select-none"
        >💖</motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute bottom-10 right-10 text-5xl opacity-30 select-none"
        >💕</motion.div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: Input Nama */}
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/60 text-center max-w-md w-full space-y-6"
          >
            <h1 className="text-3xl font-extrabold text-pink-600 tracking-wide">
              Ada Hal Penting... 🫣
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              Sebelum mulai, ketik dulu nama kamu di bawah ini ya cantik!
            </p>

            <form onSubmit={startExperience} className="space-y-4">
              <input 
                type="text"
                value={girlName}
                onChange={(e) => setGirlName(e.target.value)}
                placeholder="Tulis nama kamu..."
                className="w-full px-5 py-3 rounded-full border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-center text-gray-800 font-semibold shadow-inner bg-white/70"
              />

              {nameError && (
                <p className="text-red-500 text-sm font-semibold animate-bounce">{nameError}</p>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-lg shadow-pink-300 transition cursor-pointer"
              >
                Mulai & Buka Pesannya ❤️
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* STEP 1.5: Layar Tunggu 5 Detik */}
        {step === 1.5 && (
          <motion.div 
            key="step1.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white/50 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/60 text-center max-w-md w-full space-y-6 flex flex-col items-center"
          >
            {/* Animasi Musik / Piringan Hitam Berputar */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="w-24 h-24 bg-pink-500 rounded-full flex items-center justify-center text-white text-4xl shadow-lg border-4 border-white"
            >
              🎵
            </motion.div>

            <h2 className="text-2xl font-bold text-pink-600 animate-pulse leading-snug">
              Sabar ya cantik, tunggu musiknya dulu... 💖✨
            </h2>

            <div className="text-4xl font-black text-gray-700 bg-white/80 w-16 h-16 rounded-full flex items-center justify-center border-2 border-pink-300 shadow-inner">
              {countdown}
            </div>
          </motion.div>
        )}

        {/* STEP 2: Kuis 1 */}
        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/60 text-center max-w-md w-full space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Kuis 1 untuk <span className="text-pink-600">{girlName}</span>: Siapa nama cowok paling ganteng di dunia ini? ✍️🫣
            </h2>
            
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <input 
                type="text"
                value={crushInput}
                onChange={(e) => setCrushInput(e.target.value)}
                placeholder="Siapa ya aku bukan? 😏"
                className="w-full px-5 py-3 rounded-full border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-center text-gray-800 font-semibold shadow-inner bg-white/70"
              />
              
              {nameError && (
                <motion.p 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-red-500 text-sm font-bold bg-red-100 p-3 rounded-2xl border border-red-300"
                >
                  {nameError}
                </motion.p>
              )}

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-lg shadow-pink-200 cursor-pointer transition"
              >
                Cek Jawaban ✨
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* STEP 3: Kuis 2 */}
        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/60 text-center max-w-md w-full space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Kuis 2: Apa bedanya jam 12:00 sama kamu ({girlName})? ⏰🤔
            </h2>
            <p className="text-sm text-gray-600">
              Hint: Kalau jam 12:00 itu Kesiangan, kalau kamu itu...
            </p>
            
            <form onSubmit={handleGombalSubmit} className="space-y-4">
              <input 
                type="text"
                value={quizGombalAnswer}
                onChange={(e) => setQuizGombalAnswer(e.target.value)}
                placeholder="Ketik tebakanmu..."
                className="w-full px-5 py-3 rounded-full border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-center text-gray-800 font-semibold shadow-inner bg-white/70"
              />

              {quizGombalError && (
                <p className="text-red-500 text-sm font-bold bg-red-100 p-2 rounded-xl">{quizGombalError}</p>
              )}

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-lg shadow-pink-200 cursor-pointer transition"
              >
                Jawab 💖
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* STEP 4: Kuis 3 */}
        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/60 text-center max-w-md w-full space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Kuis 3: Seberapa manis rasa gula dibanding senyuman kamu? 🍯😋
            </h2>

            <div className="space-y-3">
              <button 
                onClick={() => handleChoiceQuiz(false)}
                className="w-full py-3 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold rounded-2xl transition border border-pink-300 cursor-pointer"
              >
                Gula masih lebih manis! 🍦
              </button>
              <button 
                onClick={() => handleChoiceQuiz(true)}
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl transition shadow-md cursor-pointer"
              >
                Manisan senyuman aku lah, bikin {targetName} klepek-klepek! 🫣💖
              </button>
            </div>

            {quizChoiceError && (
              <p className="text-red-500 text-sm font-bold bg-red-100 p-3 rounded-2xl border border-red-300">{quizChoiceError}</p>
            )}
          </motion.div>
        )}

        {/* STEP 5: Kuis 4 */}
        {step === 5 && (
          <motion.div 
            key="step5"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/60 text-center max-w-md w-full space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Kuis 4: Nanti kalau kita kencan pertama, kamu mau diajak makan apa? 🍕🍣
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleFoodSubmit('Seblak & Boba 🧋')}
                className="py-3 px-2 bg-white/80 hover:bg-pink-200 text-pink-700 font-bold rounded-2xl border border-pink-300 shadow-sm cursor-pointer"
              >
                Seblak & Boba 🧋
              </button>
              <button 
                onClick={() => handleFoodSubmit('Eskrim & Coffee 🍦')}
                className="py-3 px-2 bg-white/80 hover:bg-pink-200 text-pink-700 font-bold rounded-2xl border border-pink-300 shadow-sm cursor-pointer"
              >
                Eskrim & Coffee 🍦
              </button>
              <button 
                onClick={() => handleFoodSubmit('Makan yang banyak! 🍔')}
                className="py-3 px-2 bg-white/80 hover:bg-pink-200 text-pink-700 font-bold rounded-2xl border border-pink-300 shadow-sm cursor-pointer"
              >
                Makan Banyak! 🍔
              </button>
              <button 
                onClick={() => handleFoodSubmit('Terserah Arif aja 🥰')}
                className="py-3 px-2 bg-white/80 hover:bg-pink-200 text-pink-700 font-bold rounded-2xl border border-pink-300 shadow-sm cursor-pointer"
              >
                Terserah {targetName} 🥰
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 6: Kuis 5 */}
        {step === 6 && (
          <motion.div 
            key="step6"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/60 text-center max-w-md w-full space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Kuis 5: Janji ya kalau lagi kangen sama {targetName}, gak boleh ngambek sendirian? 🥺
            </h2>
            
            <form onSubmit={handlePromiseSubmit} className="space-y-4">
              <input 
                type="text"
                value={promiseAnswer}
                onChange={(e) => setPromiseAnswer(e.target.value)}
                placeholder="Ketik 'Iya Janji!' di sini Cantiknya aku..."
                className="w-full px-5 py-3 rounded-full border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-center text-gray-800 font-semibold shadow-inner bg-white/70"
              />

              {promiseError && (
                <motion.p 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-red-500 text-sm font-bold bg-red-100 p-3 rounded-2xl border border-red-300"
                >
                  {promiseError}
                </motion.p>
              )}

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-lg shadow-pink-200 cursor-pointer transition"
              >
                Janji! 🤝💖
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* STEP 7: Konfirmasi */}
        {step === 7 && (
          <motion.div 
            key="step7"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/60 text-center max-w-md w-full space-y-8"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Cantiknya aku pinter banget! Berarti fix <span className="text-pink-600 font-extrabold">{targetName}</span> emang cowok yang paling kamu sayang kan❤️✨
            </h2>
            
            <div className="flex justify-center items-center gap-6 min-h-[100px] w-full relative">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { playSoundEffect('correct'); setStep(8); }} 
                className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-lg shadow-pink-200 z-10 cursor-pointer"
              >
                Iya Fix Banget! 💖
              </motion.button>

              <motion.button 
                initial={{ x: 0, y: 0 }}
                animate={{ x: noQuizBtnPos.x, y: noQuizBtnPos.y }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                onMouseEnter={moveNoQuizButton}
                onTouchStart={moveNoQuizButton}
                onClick={moveNoQuizButton}
                className="px-6 py-3 bg-gray-400 text-white font-bold rounded-full shadow-lg cursor-pointer select-none z-20"
              >
                Bukan 😜
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 8: Penembakan */}
        {step === 8 && (
          <motion.div 
            key="step8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/60 text-center max-w-md w-full space-y-8"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Nah <span className="text-pink-600 font-extrabold">{girlName}</span>, mau nggak kamu nemenin hari-hari <span className="text-pink-600 font-extrabold">{targetName}</span> terus dan jadi pacarnya? 🥺✨
            </h2>

            <div className="flex justify-center items-center gap-6 min-h-[100px] w-full relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAccept}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg shadow-green-200 z-10 cursor-pointer"
              >
                MAU BANGET! 💖
              </motion.button>

              <motion.button
                initial={{ x: 0, y: 0 }}
                animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
                onClick={moveNoButton}
                className="px-6 py-3 bg-gray-400 text-white font-bold rounded-full shadow-lg cursor-pointer select-none z-20"
              >
                Gak Dulu 😜
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 9: Final Reveal */}
        {step === 9 && (
          <motion.div 
            key="step9"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/80 text-center max-w-md w-full space-y-6 flex flex-col items-center max-h-[90vh] overflow-y-auto"
          >
            {/* Element Kartu Akhir yang di-screenshot */}
            <div ref={finalCardRef} className="p-6 bg-white rounded-3xl w-full flex flex-col items-center space-y-4 border border-pink-100 shadow-md">
              <motion.h1 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-3xl font-black text-pink-600"
              >
                YEEEAY! RESMI JADIAN! 🎉
              </motion.h1>

              {/* Gambar Berbentuk Love / Heart Lebih Besar */}
              <div className="relative w-64 h-64 flex items-center justify-center my-2">
                <div 
                  className="absolute inset-0 bg-pink-400/50 blur-xl animate-pulse"
                  style={{
                    clipPath: 'path("M 128,42 A 64,64 0 0,0 0,106 C 0,170 128,234 128,234 C 128,234 256,170 256,106 A 64,64 0 0,0 128,42 Z")'
                  }}
                ></div>
                <img 
                  src="/i3.png" 
                  alt="Love"
                  className="w-60 h-60 object-cover relative z-10 drop-shadow-2xl"
                  style={{
                    clipPath: 'path("M 120,38 A 60,60 0 0,0 0,98 C 0,158 120,218 120,218 C 120,218 240,158 240,98 A 60,60 0 0,0 120,38 Z")'
                  }}
                />
              </div>

              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden relative shadow-inner border border-pink-200">
                <motion.div 
                  className="bg-gradient-to-r from-pink-500 to-rose-500 h-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${loveMeter}%` }}
                >
                  Kecocokan {girlName} & {targetName}: {loveMeter}%
                </motion.div>
              </div>

              <div className="bg-pink-50/90 p-4 rounded-2xl border border-pink-200 text-left space-y-2 w-full text-sm text-gray-700 shadow-sm">
                <p className="font-bold text-pink-600">💌 Catatan Spesial Untuk {girlName}:</p>
                <p>Makasih ya <span className="font-bold text-pink-600">{girlName}</span> udah mau jawab kuis-kuisnya sampai beres dan mau makan <span className="font-bold text-pink-600">{foodChoice || 'pilihan kamu'}</span> bareng! Makasih juga udah mau menerima segala kegabutan ini. Love you 3000! 🫶</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSaving}
              onClick={handleDownloadScreenshot}
              className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-lg shadow-pink-300 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? "Sedang Menyimpan..." : "📸 Simpan Bukti Jadian (PNG)"}
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}