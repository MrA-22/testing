import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

// KOMPONEN ORNAMEN: Dipindah ke luar agar tidak reset saat mengetik
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
        {['💖', '✨', '🌸', '🦋', '💕', '🥰'][Math.floor(Math.random() * 6)]}
      </motion.div>
    ))}
  </div>
));

export default function BucinWebsite() {
  const [step, setStep] = useState(1);
  const [girlName, setGirlName] = useState('');
  const [crushInput, setCrushInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  
  // State untuk Layar Tunggu Musik (5 detik)
  const [countdown, setCountdown] = useState(5);

  // State Jawaban Kuis Text
  const [quizGombalAnswer, setQuizGombalAnswer] = useState('');
  const [quizGombalError, setQuizGombalError] = useState('');
  const [quizChoiceError, setQuizChoiceError] = useState('');
  
  // State Pilihan Ganda
  const [foodChoice, setFoodChoice] = useState('');
  const [dateChoice, setDateChoice] = useState('');
  const [loveLanguage, setLoveLanguage] = useState('');
  const [petName, setPetName] = useState('');
  const [apologyStyle, setApologyStyle] = useState('');
  const [movieChoice, setMovieChoice] = useState('');
  const [rainChoice, setRainChoice] = useState('');
  const [giftChoice, setGiftChoice] = useState('');
  
  // State Kuis Baru (Ngeselin & Flirty)
  const [firstImpression, setFirstImpression] = useState('');
  const [kissReaction, setKissReaction] = useState('');

  // State Kuis Ketik Cinta
  const [loveInput, setLoveInput] = useState('');
  const [loveError, setLoveError] = useState('');

  const [promiseAnswer, setPromiseAnswer] = useState('');
  const [promiseError, setPromiseError] = useState('');

  // STATE BARU: Syarat & Ketentuan Pra-Jadian
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
  const targetName = "Arif";

  // Check jika semua T&C sudah dicentang
  const allTermsChecked = terms.t1 && terms.t2 && terms.t3 && terms.t4;

  // Effect untuk timer mundur 5 detik pada step "loading" (Step 1.5)
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

  const handleLoveSubmit = (e) => {
    e.preventDefault();
    const clean = loveInput.trim().toLowerCase();
    if (clean.length > 0) {
      setLoveError('');
      playSoundEffect('correct');
      setStep(17); 
    } else {
      playSoundEffect('wrong');
      setLoveError('Diisi dulu dong pesannya buat mas ganteng! 🥺💕');
    }
  };

  const handlePromiseSubmit = (e) => {
    e.preventDefault();
    const clean = promiseAnswer.trim().toLowerCase();
    
    if (clean.includes('janji')) {
      setPromiseError('');
      playSoundEffect('correct');
      setStep(18); 
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
    setStep(21); // Ke sertifikat
    
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

        {/* STEP 1.5: Layar Tunggu */}
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
              Kuis 2: Apa bedanya jam 12:00 siang sama {girlName}? ⏰🤔
            </h2>
            <p className="text-sm font-medium text-pink-600 bg-pink-50 py-2 rounded-xl border border-pink-100">
              Hint: Kalau jam 12:00 itu Kesiangan, kalau {girlName} itu...
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
              {['Seblak & Boba 🧋', 'Eskrim & Gelato 🍦', 'Ngedate di Cafe ☕', 'Terserah Mas Arif 🥰'].map((item, idx) => (
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

        {/* STEP 8: Panggilan Kesayangan */}
        {step === 8 && (
          <motion.div 
            key="step8"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 7: Nanti kalau udah resmi jadian, enaknya panggilannya apa nih? 📞🥰
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {['Sayang / Ay 💖', 'Beb / Babe 💋', 'bubu/dudu 🤪', 'Terserah Mas Arif 🥺'].map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setPetName(item);
                    playSoundEffect('correct');
                    setStep(9);
                  }}
                  className="w-full py-4 bg-white hover:bg-pink-100 text-pink-700 font-bold rounded-xl border border-pink-300 shadow-sm cursor-pointer text-sm"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 9: Cara Bujuk Ngambek */}
        {step === 9 && (
          <motion.div 
            key="step9"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 8: Amit-amit nih, tapi kalau misal kamu lagi ngambek, paling cepet luluh kalau aku ngapain? 🥺🚩
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {['Dibelikan Makanan Favorit 🍕', 'Dipeluk & Dielus Kepalanya 🫂', 'Diajak Jalan-jalan 🛵', 'Dikasih ShopeePay / Transferan 💸'].map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setApologyStyle(item);
                    playSoundEffect('correct');
                    setStep(10);
                  }}
                  className="w-full py-3 bg-pink-50 hover:bg-pink-200 text-pink-800 font-bold rounded-xl border border-pink-300 shadow-sm cursor-pointer text-left px-5"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 10: Kuis 9 (Genre Film) */}
        {step === 10 && (
          <motion.div 
            key="step10"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 9: Kalau kita nonton Netflix bareng, <span className="text-pink-600">{girlName}</span> tim genre apa nih? 🎬🍿
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {['Drakor / Romance 💞', 'Horror / Thriller 👻', 'Comedy Bikin Ngakak 🤣', 'Action / Anime ⚔️'].map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMovieChoice(item);
                    playSoundEffect('correct');
                    setStep(11);
                  }}
                  className="w-full py-4 bg-white hover:bg-pink-100 text-pink-700 font-bold rounded-xl border border-pink-300 shadow-sm cursor-pointer text-sm"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 11: Kuis 10 (Skenario Hujan) */}
        {step === 11 && (
          <motion.div 
            key="step11"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 10: Tiba-tiba di jalan kehujanan deres banget! Kita enaknya ngapain? 🌧️🛵
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {['Mampir Makan Indomie Rebus 🍜', 'Neduh Sambil Pelukan 🫣', 'Beli Jas Hujan Batman Berdua 🦇', 'Terobos Aja Lah Biar Seru! 💦'].map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setRainChoice(item);
                    playSoundEffect('correct');
                    setStep(12);
                  }}
                  className="w-full py-3 bg-pink-50 hover:bg-pink-200 text-pink-800 font-bold rounded-xl border border-pink-300 shadow-sm cursor-pointer text-left px-5"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 12: Kuis 11 (Hadiah) */}
        {step === 12 && (
          <motion.div 
            key="step12"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 11: Hadiah dadakan apa yang paling bikin <span className="text-pink-600">{girlName}</span> senyum-senyum sendiri seharian? 🎁✨
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {['Buket Bunga Cantik 💐', 'Cokelat / Dessert Manis 🍫', 'Barang Couple (Jaket/Sepatu) 👕', 'Surat Cinta Buatan Tangan 💌'].map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setGiftChoice(item);
                    playSoundEffect('correct');
                    setStep(13);
                  }}
                  className="w-full py-3 bg-white hover:bg-pink-100 text-pink-700 font-bold rounded-xl border border-pink-300 shadow-sm cursor-pointer"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 13: Kuis 12 (Persentase) */}
        {step === 13 && (
          <motion.div 
            key="step13"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 12: Jujur dari lubuk hati yang paling dalam, seberapa sayang sih sama {targetName}? 🤭❤️
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {['100% Sayang! 😍', '1000% Sayang Banget! 🔥', 'Tak Terhingga ~ 🌌', 'Pokoknya Ga Bisa Hidup Tanpanya 😭'].map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playSoundEffect('correct');
                    setStep(14);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-xl shadow-md cursor-pointer text-sm"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 14: Kuis 13 BARU (First Impression Flirty) */}
        {step === 14 && (
          <motion.div 
            key="step14"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 13: Coba jujur, pas pertama kali kenal / liat mas {targetName}, apa yang ada di pikiran kamu? 🫣💭
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {[
                '"Boleh juga nih cowok..." 😏', 
                '"Idih, siapa sih sok asik" 🙄 (padahal naksir)', 
                '"Fix, ini bapak dari anak-anakku nanti!" 💍', 
                '"Awalnya biasa aja... eh lama-lama kecanduan" 🤤'
              ].map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFirstImpression(item);
                    playSoundEffect('correct');
                    setStep(15);
                  }}
                  className="w-full py-4 bg-white hover:bg-pink-100 text-pink-700 font-bold rounded-xl border border-pink-300 shadow-sm cursor-pointer text-sm px-4"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 15: Kuis 14 BARU (Skenario Cium Flirty) */}
        {step === 15 && (
          <motion.div 
            key="step15"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 14: Misal nih kita lagi jalan berdua, terus tiba-tiba aku iseng nyium pipi kamu... reaksi kamu bakal? 💋🏃‍♂️
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {[
                'Marah-marah tapi mukanya merah tomat 🍅', 
                'Balas nyium balik dong! Gas! 🔥', 
                'Salting brutal sampe nyungsep / nabrak tiang 🤸‍♀️', 
                'Pura-pura ngambek biar dibeliin makanan 🍜'
              ].map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setKissReaction(item);
                    playSoundEffect('correct');
                    setStep(16);
                  }}
                  className="w-full py-4 bg-pink-50 hover:bg-pink-200 text-pink-800 font-bold rounded-xl border border-pink-300 shadow-sm cursor-pointer text-sm px-4"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 16: Kuis 15 (Ketik Sesuatu / I Love You) */}
        {step === 16 && (
          <motion.div 
            key="step16"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis 15: Sebelum lanjut ke akhir, coba dong ketik pesan manis/gombalan maut buat mas ganteng! 🥺💌
            </h2>
            
            <form onSubmit={handleLoveSubmit} className="space-y-4">
              <input 
                type="text"
                value={loveInput}
                onChange={(e) => setLoveInput(e.target.value)}
                placeholder="Ketik pesannya di sini..."
                className="w-full px-5 py-3 rounded-full border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-center text-gray-800 font-bold shadow-inner bg-white/70"
              />

              {loveError && (
                <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded-xl border border-red-200">{loveError}</p>
              )}

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-[0_5px_15px_rgba(236,72,153,0.4)] cursor-pointer transition text-lg"
              >
                Kirim Cinta 💘
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* STEP 17: Kuis 16 (Janji) */}
        {step === 17 && (
          <motion.div 
            key="step17"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Kuis Terakhir (Kuis 16): Janji ya kalau lagi kangen sama {targetName}, gak boleh dipendem sendirian? Harus ngabarin! 🥺
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

        {/* STEP 18: Konfirmasi */}
        {step === 18 && (
          <motion.div 
            key="step18"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-8 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Gila, sabar banget ngerjain 16 Kuis! Berarti fix <span className="text-pink-600 font-extrabold">{targetName}</span> emang cowok yang paling kamu sayang kan❤️✨
            </h2>
            
            <div className="flex justify-center items-center gap-6 min-h-[100px] w-full relative">
              <motion.button 
                whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(236, 72, 153, 0.5)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { playSoundEffect('correct'); setStep(19); }} 
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

        {/* STEP 19: T&C Pra-Jadian (Versi Cewek) */}
        {step === 19 && (
          <motion.div 
            key="step19"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/80 text-left max-w-md w-full space-y-6 relative z-10"
          >
            <div className="text-center mb-4">
              <span className="text-4xl">📜</span>
              <h2 className="text-2xl font-bold text-pink-600 mt-2">Syarat & Ketentuan Pra-Jadian</h2>
              <p className="text-sm text-gray-600 font-medium">Wajib centang semua sebelum lanjut ya cantik!</p>
            </div>

            <div className="space-y-4 text-sm font-semibold text-gray-700">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={terms.t1} onChange={(e) => { playSoundEffect('correct'); setTerms({...terms, t1: e.target.checked}) }} className="w-5 h-5 mt-0.5 accent-pink-500" />
                <span className="group-hover:text-pink-600 transition">Dilarang ngambek diam-diam. Kalau marah wajib kasih *clue* ke {targetName}. 😤</span>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={terms.t2} onChange={(e) => { playSoundEffect('correct'); setTerms({...terms, t2: e.target.checked}) }} className="w-5 h-5 mt-0.5 accent-pink-500" />
                <span className="group-hover:text-pink-600 transition">Siap direpotin dengan sifat manja & randomnya mas ganteng. 👶</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={terms.t3} onChange={(e) => { playSoundEffect('correct'); setTerms({...terms, t3: e.target.checked}) }} className="w-5 h-5 mt-0.5 accent-pink-500" />
                <span className="group-hover:text-pink-600 transition">Wajib kangen minimal 3 kali sehari, kayak aturan minum obat. 💊💖</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={terms.t4} onChange={(e) => { playSoundEffect('correct'); setTerms({...terms, t4: e.target.checked}) }} className="w-5 h-5 mt-0.5 accent-pink-500" />
                <span className="group-hover:text-pink-600 transition">Bakal sayang sama {targetName} 1000% selamanya! 🔒🫶</span>
              </label>
            </div>

            <motion.button 
              whileHover={allTermsChecked ? { scale: 1.05 } : {}}
              whileTap={allTermsChecked ? { scale: 0.95 } : {}}
              onClick={() => { if(allTermsChecked) { playSoundEffect('correct'); setStep(20); } else { playSoundEffect('wrong'); } }}
              className={`w-full py-4 font-bold rounded-full shadow-lg transition cursor-pointer text-lg mt-4 ${
                allTermsChecked 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {allTermsChecked ? "Saya Setuju! Lanjut ✍️" : "Centang Dulu Semuanya 😜"}
            </motion.button>
          </motion.div>
        )}

        {/* STEP 20: Penembakan Akhir */}
        {step === 20 && (
          <motion.div 
            key="step20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/60 text-center max-w-md w-full space-y-8 relative z-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              Nah <span className="text-pink-600 font-extrabold">{girlName}</span>, karena udah janji, mau nggak kamu nemenin hari-hari <span className="text-pink-600 font-extrabold">{targetName}</span> terus dan jadi pacarnya selamanya? 🥺✨
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

        {/* STEP 21: Final Reveal & Sertifikat */}
        {step === 21 && (
          <motion.div 
            key="step21"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            // Diberi kelonggaran max height agar kartu tidak tergencet
            className="bg-white/70 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/80 text-center max-w-md w-full space-y-4 flex flex-col items-center max-h-[90vh] overflow-y-auto relative z-10"
          >
            {/* Element Kartu Akhir yang di-screenshot. DITAMBAHKAN shrink-0 agar tidak menciut ke atas */}
            <div ref={finalCardRef} className="shrink-0 p-5 bg-white rounded-3xl w-full flex flex-col items-center space-y-4 border border-pink-100 shadow-[0_10px_30px_rgba(236,72,153,0.15)] relative overflow-hidden">
              <div className="absolute -top-4 -left-4 text-5xl opacity-20">✨</div>
              <div className="absolute -bottom-4 -right-4 text-5xl opacity-20">🌸</div>

              <motion.h1 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 drop-shadow-sm shrink-0"
              >
                YEEEAY! RESMI JADIAN! 🎉
              </motion.h1>

              <div 
                className="relative flex items-center justify-center my-4 shrink-0" 
                style={{ width: '224px', height: '205px' }}
              >
                {/* Efek Glow di Belakang */}
                <div 
                  className="absolute inset-0 bg-pink-400/50 blur-xl animate-pulse"
                  style={{
                    clipPath: 'path("M 112,35 A 56,56 0 0,0 0,93 C 0,149 112,205 112,205 C 112,205 224,149 224,93 A 56,56 0 0,0 112,35 Z")'
                  }}
                ></div>
                
                {/* Gambar Utama yang Dipotong Hati */}
                <img 
                  src="/1.png" 
                  alt="Love"
                  className="absolute object-cover z-10 filter drop-shadow-[0_10px_15px_rgba(236,72,153,0.5)]"
                  style={{
                    width: '208px',
                    height: '189px',
                    clipPath: 'path("M 104,33 A 52,52 0 0,0 0,85 C 0,137 104,189 104,189 C 104,189 208,137 208,85 A 52,52 0 0,0 104,33 Z")'
                  }}
                />
              </div>

              <div className="w-full shrink-0 bg-pink-100 rounded-full h-5 overflow-hidden relative shadow-inner border border-pink-200">
                <motion.div 
                  className="bg-gradient-to-r from-pink-500 to-rose-500 h-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  style={{ width: `${loveMeter}%` }}
                >
                  Kecocokan {girlName} & {targetName}: {loveMeter}%
                </motion.div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-2xl border border-pink-200 text-left space-y-2 w-full text-xs text-gray-800 shadow-sm relative leading-relaxed shrink-0">
                <p className="font-extrabold text-pink-600 text-sm border-b border-pink-200 pb-1">💌 Sertifikat Cinta {girlName}:</p>
                
                <p>
                  Sesuai pilihanmu, nanti kita jalan sambil makan <span className="font-bold text-pink-600">{foodChoice}</span>, lanjut <span className="font-bold text-pink-600">{dateChoice}</span>, dan sekalian nonton <span className="font-bold text-pink-600">{movieChoice}</span>! Kalau di jalan kehujanan, kita tenang aja sambil <span className="font-bold text-pink-600">{rainChoice}</span> 🌧️.
                </p>

                <p>
                  Pastinya bakal aku usahain penuhi love language kamu yang suka <span className="font-bold text-pink-600">{loveLanguage}</span>, plus bawain <span className="font-bold text-pink-600">{giftChoice}</span> kesukaanmu! 🥰
                </p>

                <p>
                  Ternyata kesan pertamamu ke aku itu <span className="font-bold text-pink-600">{firstImpression}</span> ya! Awas aja, pas jalan nanti siap-siap aku cium pipinya biar kamu <span className="font-bold text-pink-600">{kissReaction}</span> 🤪💋
                </p>

                <p>
                  Mulai hari ini, aku panggil kamu <span className="font-bold text-pink-600">{petName}</span>. Kalau kamu lagi ngambek, tenang aja... aku pasti bujuk dengan cara <span className="font-bold text-pink-600">{apologyStyle}</span> biar senyum lagi!
                </p>

                <p className="italic text-pink-600/90 bg-pink-100/60 p-2 rounded-lg border border-pink-200">
                  "{loveInput}" — {girlName} 💖
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(236, 72, 153, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              disabled={isSaving}
              onClick={handleDownloadScreenshot}
              // Tombol juga diberi shrink-0 agar tidak ikut terpotong
              className="shrink-0 w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-base"
            >
              {isSaving ? "Sedang Menyimpan..." : "📸 Simpan Sertifikat (PNG)"}
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}