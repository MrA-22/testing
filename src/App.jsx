import React, { useState } from 'react';
import './App.css';

const reasons = [
  "Suka banget dengerin suara kamu, walau kadang jarang-jarang ngobrol langsung.",
  "Cara kamu ketawa gara-gara hal kecil itu, aduh... manis banget.",
  "Kamu itu pendengar yang baik, bikin orang di dekatmu ngerasa dihargai.",
  "Punya empati tinggi dan selalu tulus peduli sama sekitar.",
  "Cara pandang kamu pas ngeliat dunia tuh unik dan keren banget.",
  "Selera humormu selalu berhasil bikin aku ketawa lepas.",
  "Kehadiran kamu aja udah cukup banget buat bikin suasananya jadi tenang.",
  "Kamu tangguh banget, bahkan pas harus ngadepin hal berat sendirian.",
  "Semangat kamu pas lagi kerja atau belajar tuh nular dan menginspirasi.",
  "Hati kamu tulus banget, baik ke siapa aja tanpa pilih-pilih.",
  "Gaya kamu pas berpakaian selalu kelihatan pas, rapi, dan elegan.",
  "Kamu selalu punya cara buat bikin suasana jadi hangat dan nyaman.",
  "Ngobrol sama kamu tuh bikin waktu rasanya lari cepat banget.",
  "Kamu apa adanya, nggak pernah takut buat jadi diri sendiri.",
  "Peka banget sama hal-hal detail yang sering ditiup angin sama orang lain.",
  "Suka kagum sama cara kamu menyelesaikan masalah dengan tenang.",
  "Senyuman kamu itu ampuh banget buat ngebuat hari yang buruk jadi membaik.",
  "Kamu punya selera musik atau tontonan yang asyik buat diajak bahas.",
  "Cara kamu memperlakukan orang lain dengan sopan tuh patut diacungin jempol.",
  "Kamu selalu ingat hal-hal kecil yang kadang-kadang aku sendiri lupa.",
  "Energi positif yang kamu bawa selalu bikin orang di sekitarnya ikut happy.",
  "Nggak ada bosannya ngobrol sama kamu, dari topik serius sampai random.",
  "Kamu punya mimpi-mimpi hebat yang bikin aku yakin kamu bakal sukses.",
  "Pintar banget bikin aku merasa tenang pas lagi banyak pikiran.",
  "Suka cara kamu ngasih perhatian tulus tanpa harus keliatan berlebihan.",
  "Pokoknya, banyak banget hal kecil dari kamu yang bikin aku bersyukur kenal kamu."
];

export default function App() {
  const [flippedCards, setFlippedCards] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('reasons');
  
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizResult, setQuizResult] = useState('');

  const handleCardClick = (index) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (quizAnswer.trim() === '') {
      setQuizResult('Isi dulu dong nama cowoknya! 🤭');
    } else {
      setQuizResult(`Bener banget! Emang cuman ${quizAnswer} yang paling ganteng & ngangenin! 🥰✨`);
    }
  };

  return (
    <div className="feminine-container">
      {/* Kupu-kupu dan Bunga yang Terbang Beterbangan di Background */}
      <div className="flying-background">
        <span className="fly-item item-1">🦋</span>
        <span className="fly-item item-2">🌸</span>
        <span className="fly-item item-3">🦋</span>
        <span className="fly-item item-4">🌷</span>
        <span className="fly-item item-5">✨</span>
        <span className="fly-item item-6">🦋</span>
        <span className="fly-item item-7">🌸</span>
        <span className="fly-item item-8">🦋</span>
      </div>

      <header className="main-header">
        <span className="subtitle-badge">Special Dedication ✨</span>
        <h1>Ruang Kecil untuk Seseorang yang Spesial</h1>
        <p>Tempat di mana 26 hal spesial tentang kamu dirayakan dengan senyuman.</p>
        
        <div className="nav-tabs">
          <button 
            className={activeTab === 'reasons' ? 'active' : ''} 
            onClick={() => setActiveTab('reasons')}
          >
            💌 26 Alasan Spesial
          </button>
          <button 
            className={activeTab === 'quiz' ? 'active' : ''} 
            onClick={() => setActiveTab('quiz')}
          >
            🧩 Kuis Seru-seruan
          </button>
        </div>
      </header>

      {activeTab === 'reasons' && (
        <section className="reasons-section">
          <div className="section-title">
            <h2>26 Alasan Kenapa Kamu Begitu Berarti</h2>
            <p>Sentuh kartunya satu per satu buat baca isi pesannya ya 🤍</p>
          </div>

          <div className="cards-container">
            {reasons.map((reason, index) => (
              <div 
                key={index} 
                className={`card ${flippedCards[index] ? 'flipped' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <span className="card-number">#{index + 1}</span>
                    <span className="card-hint">Buka yuk 🌸</span>
                  </div>
                  <div className="card-back">
                    <p>{reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'quiz' && (
        <section className="quiz-section">
          <div className="quiz-card">
            <h3>Kuis Spesial Untuk Kamu 💖</h3>
            <p>Siapa nama cowok paling ganteng & ngangenin di dunia ini? 🫵🏻 🫣</p>
            
            <form onSubmit={handleQuizSubmit}>
              <input 
                type="text" 
                placeholder="Ketik namanya di sini ya... 🤔" 
                value={quizAnswer}
                onChange={(e) => setQuizAnswer(e.target.value)}
              />
              <button type="submit" className="quiz-btn">Cek Jawabannya ✨</button>
            </form>
            
            {quizResult && <p className="quiz-result">{quizResult}</p>}
          </div>
        </section>
      )}

      <div className="surprise-box">
        <button className="surprise-btn" onClick={() => setShowPopup(true)}>
          🎁 Mau Kejutan Kecil? Klik Ini
        </button>
      </div>

      {showPopup && (
        <div className="modal-overlay" onClick={() => setShowPopup(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Pesan Buat Kamu! ✨</h3>
            <p>Apapun beban atau hal berat yang lagi kamu hadapi sekarang, ingat ya kalau kamu hebat banget udah bertahan sejauh ini. Jangan lupa senyum hari ini! 🦋🌸</p>
            <button className="close-modal" onClick={() => setShowPopup(false)}>Tutup 🤍</button>
          </div>
        </div>
      )}

      <footer className="footer-note">
        Dibuat khusus dengan penuh ketulusan. ✨
      </footer>
    </div>
  );
}