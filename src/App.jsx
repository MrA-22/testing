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
  
  // State Pilihan Baru
  const [foodChoice, setFoodChoice] = useState('');
  const [dateChoice, setDateChoice] = useState('');
  const [loveLanguage, setLoveLanguage] = useState('');
  
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
    setStep(1.5);
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

  const handlePromiseSubmit = (e) => {
    e.preventDefault();
    const clean = promiseAnswer.trim().toLowerCase();
    
    if (clean.includes('janji')) {
      setPromiseError('');
      playSoundEffect('correct');
      setStep(9); // Pindah ke Konfirmasi
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
    setStep(11); // Pindah ke Final Step
    
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

  // Komponen Ornamen Mengambang
  const FloatingOrnaments = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0.2 + Math.random() * 0.5 }}
          animate={{ y: "-10vh", rotate: Math.random() * 360 }}
          transition={{
            duration: 10 + Math.random() * 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
          className="absolute text-2xl drop-shadow-md"
          style={{ fontSize: `${Math.random() * 20 + 20}px` }}
        >
          {['💖', '✨', '🌸', '🦋', '💕'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-rose-200 flex items-center justify-center p-4 overflow-hidden relative font-sans">
      
      <audio ref={audioRef} src="/sabda.mp3" loop />
      
      <FloatingOrnaments />

      <AnimatePresence mode="wait">
        
        {/* STEP 1: Input Nama */}
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-white/50 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-5xl drop-shadow-lg mb-2"
            >
              💌
            </motion.div>
            <h1 className="text-3xl font-extrabold text-pink-600 tracking-wide drop-shadow-sm">
              Ada Hal Penting... 🫣
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed font-medium">
              Sebelum mulai, ketik dulu nama kamu di bawah ini ya cantik!
            </p>

            <form onSubmit={startExperience} className="space-y-4">
              <input 
                type="text"
                value={girlName}
                onChange={(e) => setGirlName(e.target.value)}
                placeholder="Tulis nama kamu..."
                className="w-full px-5 py-3 rounded-full border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-center text-gray-800 font-bold shadow-inner bg-white/70 placeholder-gray-400 transition"
              />

              {nameError && (
                <p className="text-red-500 text-sm font-semibold animate-bounce">{nameError}</p>
              )}

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(236, 72, 153, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full shadow-lg transition cursor-pointer text-lg"
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
            className="bg-white/50 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-8 flex flex-col items-center relative z-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-pink-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-28 h-28 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-5xl shadow-2xl border-4 border-white relative z-10"
              >
                🎵
              </motion.div>
            </div>

            <h2 className="text-2xl font-bold text-pink-600 animate-pulse leading-snug drop-shadow-sm">
              Sabar ya cantik, tunggu musiknya diputar dulu... ✨
            </h2>

            <div className="text-5xl font-black text-pink-500 bg-white/90 w-20 h-20 rounded-full flex items-center justify-center border-4 border-pink-200 shadow-inner shadow-pink-100">
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
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 1 untuk <span className="text-pink-600 drop-shadow-sm">{girlName}</span>:<br/> Siapa nama cowok paling ganteng & ngangenin di dunia ini? ✍️🫣
            </h2>
            
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <input 
                type="text"
                value={crushInput}
                onChange={(e) => setCrushInput(e.target.value)}
                placeholder="Siapa ya kira-kira? 😏"
                className="w-full px-5 py-3 rounded-full border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-center text-gray-800 font-bold shadow-inner bg-white/70"
              />
              
              {nameError && (
                <motion.p 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-2xl border border-red-200 shadow-sm"
                >
                  {nameError}
                </motion.p>
              )}

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-[0_5px_15px_rgba(236,72,153,0.4)] cursor-pointer transition text-lg"
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
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 2: Apa bedanya jam 12:00 siang sama kamu ({girlName})? ⏰🤔
            </h2>
            <p className="text-sm font-medium text-pink-600 bg-pink-50 py-2 rounded-xl border border-pink-100">
              Hint: Kalau jam 12:00 itu Kesiangan, kalau kamu itu...
            </p>
            
            <form onSubmit={handleGombalSubmit} className="space-y-4">
              <input 
                type="text"
                value={quizGombalAnswer}
                onChange={(e) => setQuizGombalAnswer(e.target.value)}
                placeholder="Ketik tebakanmu..."
                className="w-full px-5 py-3 rounded-full border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-center text-gray-800 font-bold shadow-inner bg-white/70"
              />

              {quizGombalError && (
                <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded-xl border border-red-200">{quizGombalError}</p>
              )}

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-[0_5px_15px_rgba(236,72,153,0.4)] cursor-pointer transition text-lg"
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
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 3: Seberapa manis rasa gula dibanding senyuman kamu? 🍯😋
            </h2>

            <div className="space-y-4 pt-2">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoiceQuiz(false)}
                className="w-full py-4 bg-white/80 hover:bg-pink-100 text-pink-700 font-bold rounded-2xl transition border border-pink-300 shadow-sm cursor-pointer"
              >
                Kayaknya Gula masih lebih manis! 🍦
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(236, 72, 153, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChoiceQuiz(true)}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-2xl transition shadow-lg cursor-pointer"
              >
                Manisan senyuman aku lah, bikin {targetName} klepek-klepek! 🫣💖
              </motion.button>
            </div>

            {quizChoiceError && (
              <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-2xl border border-red-200">{quizChoiceError}</p>
            )}
          </motion.div>
        )}

        {/* STEP 5: Pilihan Makanan */}
        {step === 5 && (
          <motion.div 
            key="step5"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 4: Nanti kalau kita jalan, <span className="text-pink-600">{girlName}</span> mau diajak makan apa nih? 🍕🍣
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {['Seblak & Boba 🧋', 'Eskrim & Gelato 🍦', 'Ngedate di Cafe ☕', 'Terserah Arif aja 🥰'].map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFoodChoice(item);
                    playSoundEffect('correct');
                    setStep(6);
                  }}
                  className="py-4 px-2 bg-white hover:bg-pink-50 text-pink-700 font-bold rounded-2xl border-2 border-pink-200 shadow-md cursor-pointer flex items-center justify-center text-sm"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 6: Pilihan Tanggal / Date Spot */}
        {step === 6 && (
          <motion.div 
            key="step6"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 5: Habis makan, enaknya kita ngabisin waktu ke mana ya? 🛵✨
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {['Nonton Bioskop 🍿', 'Jalan-jalan ke Mall 🛍️', 'Keliling Kota Santai 🌃', 'Langsung ke KUA aja 💍🤪'].map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setDateChoice(item);
                    playSoundEffect('correct');
                    setStep(7);
                  }}
                  className="w-full py-3 bg-white hover:bg-pink-100 text-pink-700 font-bold rounded-xl border border-pink-300 shadow-sm cursor-pointer"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 7: Love Language */}
        {step === 7 && (
          <motion.div 
            key="step7"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 6: Biar makin sayang, <span className="text-pink-600">{girlName}</span> paling suka digimanain sih? (Love Language) 🫂❤️
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {['Quality Time (Ditemenin terus) ⏳', 'Physical Touch (Dielus/Dipeluk) 🧸', 'Words of Affirmation (Dipuji) 💬', 'Dikasih Saldo / Jajan 💸😍'].map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setLoveLanguage(item);
                    playSoundEffect('correct');
                    setStep(8);
                  }}
                  className="w-full py-3 bg-pink-50 hover:bg-pink-200 text-pink-800 font-bold rounded-xl border border-pink-300 shadow-sm cursor-pointer text-left px-5"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 8: Janji */}
        {step === 8 && (
          <motion.div 
            key="step8"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis Terakhir: Janji ya kalau lagi kangen sama {targetName}, gak boleh ngambek sendirian? 🥺
            </h2>
            
            <form onSubmit={handlePromiseSubmit} className="space-y-4">
              <input 
                type="text"
                value={promiseAnswer}
                onChange={(e) => setPromiseAnswer(e.target.value)}
                placeholder="Ketik 'Iya Janji!' di sini..."
                className="w-full px-5 py-3 rounded-full border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-center text-gray-800 font-bold shadow-inner bg-white/70"
              />

              {promiseError && (
                <motion.p 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-2xl border border-red-200"
                >
                  {promiseError}
                </motion.p>
              )}

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-[0_5px_15px_rgba(236,72,153,0.4)] cursor-pointer transition text-lg"
              >
                Janji! 🤝💖
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* STEP 9: Konfirmasi */}
        {step === 9 && (
          <motion.div 
            key="step9"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-8 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Cantiknya aku pinter banget! Berarti fix <span className="text-pink-600 font-extrabold">{targetName}</span> emang cowok yang paling kamu sayang kan❤️✨
            </h2>
            
            <div className="flex justify-center items-center gap-6 min-h-[100px] w-full relative">
              <motion.button 
                whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(236, 72, 153, 0.5)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { playSoundEffect('correct'); setStep(10); }} 
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full shadow-lg z-10 cursor-pointer text-lg"
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

        {/* STEP 10: Penembakan Akhir */}
        {step === 10 && (
          <motion.div 
            key="step10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-8 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Nah <span className="text-pink-600 font-extrabold">{girlName}</span>, mau nggak kamu nemenin hari-hari <span className="text-pink-600 font-extrabold">{targetName}</span> terus dan jadi pacarnya? 🥺✨
            </h2>

            <div className="flex justify-center items-center gap-6 min-h-[100px] w-full relative">
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(34, 197, 94, 0.6)" }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAccept}
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-full shadow-lg z-10 cursor-pointer text-lg"
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

        {/* STEP 11: Final Reveal & Kartu Spesial */}
        {step === 11 && (
          <motion.div 
            key="step11"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="bg-white/70 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/80 text-center max-w-md w-full space-y-6 flex flex-col items-center max-h-[90vh] overflow-y-auto relative z-10"
          >
            {/* Element Kartu Akhir yang di-screenshot */}
            <div ref={finalCardRef} className="p-6 bg-white rounded-3xl w-full flex flex-col items-center space-y-5 border border-pink-100 shadow-[0_10px_30px_rgba(236,72,153,0.15)] relative overflow-hidden">
              {/* Ornamen sudut di kartu screenshot */}
              <div className="absolute -top-4 -left-4 text-5xl opacity-20">✨</div>
              <div className="absolute -bottom-4 -right-4 text-5xl opacity-20">🌸</div>

              <motion.h1 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 drop-shadow-sm"
              >
                YEEEAY! RESMI JADIAN! 🎉
              </motion.h1>

              {/* Gambar Berbentuk Love / Heart Lebih Besar + Shadow */}
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
                  className="w-60 h-60 object-cover relative z-10 filter drop-shadow-[0_10px_15px_rgba(236,72,153,0.5)]"
                  style={{
                    clipPath: 'path("M 120,38 A 60,60 0 0,0 0,98 C 0,158 120,218 120,218 C 120,218 240,158 240,98 A 60,60 0 0,0 120,38 Z")'
                  }}
                />
              </div>

              <div className="w-full bg-pink-100 rounded-full h-6 overflow-hidden relative shadow-inner border border-pink-200">
                <motion.div 
                  className="bg-gradient-to-r from-pink-500 to-rose-500 h-full flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  style={{ width: `${loveMeter}%` }}
                >
                  Kecocokan {girlName} & {targetName}: {loveMeter}%
                </motion.div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-white p-5 rounded-2xl border border-pink-200 text-left space-y-3 w-full text-sm text-gray-800 shadow-sm relative">
                <p className="font-extrabold text-pink-600 text-base border-b border-pink-200 pb-2">💌 Catatan Spesial Untuk {girlName}:</p>
                <p className="leading-relaxed">
                  Makasih ya <span className="font-bold text-pink-600">{girlName}</span> udah mau jawab kuis-kuisnya sampai beres! 
                </p>
                <p className="leading-relaxed">
                  Sesuai pilihanmu, nanti kita jalan-jalan sambil <span className="font-bold text-pink-600">{foodChoice}</span> terus lanjut <span className="font-bold text-pink-600">{dateChoice}</span>. Dan pastinya bakal aku usahain menuhi love language kamu yang <span className="font-bold text-pink-600">{loveLanguage}</span> itu tiap hari! 🥰
                </p>
                <p className="font-bold text-pink-600 text-center pt-2">Love you 3000! 🫶✨</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(236, 72, 153, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              disabled={isSaving}
              onClick={handleDownloadScreenshot}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
            >
              {isSaving ? "Sedang Menyimpan..." : "📸 Simpan Bukti Jadian (PNG)"}
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}