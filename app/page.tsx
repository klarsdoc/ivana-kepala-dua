"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, Gift, ArrowRight, Sparkles, Lock, Unlock, Delete, Check, RotateCcw, Undo2, AlertCircle, Volume2, VolumeX, Volume1 } from 'lucide-react';

// --- KONFIGURASI FOTO 2048 ---
const PHOTO_TILES = {
  2: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200&h=200&fit=crop",
  4: "https://images.unsplash.com/photo-1518831959646-742c3e14ebf3?w=200&h=200&fit=crop",
  8: "https://images.unsplash.com/photo-1522748906645-95d8eb1f48ed?w=200&h=200&fit=crop",
  16: "https://images.unsplash.com/photo-1517502474136-1264b7128ce6?w=200&h=200&fit=crop",
  32: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  64: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop",
  128: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
  256: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
  512: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
  1024: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
  2048: "https://images.unsplash.com/photo-1521146764736-5669325c46b5?w=200&h=200&fit=crop"
};

const EWALLET_LINK = "https://saweria.co/contohlink";

// --- PLACEHOLDER BGM (Lo-fi Relaxing) ---
const BGM_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 

const QUIZ_QUESTIONS = [
  { q: "Warna apa yang paling mendeskripsikan aura kamu hari ini?", options: ["Pink Cetar membahana", "Biru Kalem", "Hitam Misterius", "Kuning Ceria"], ans: 0 },
  { q: "Kalau kita nyasar di pulau terpencil, siapa yang bakal nangis duluan?", options: ["Pasti aku", "Pasti kamu lah!", "Kita nangis bareng", "Malah bikin konten TikTok"], ans: 3 },
  { q: "Minuman favorit yang wajib ada pas nongkrong?", options: ["Kopi Susu Gula Aren", "Matcha Latte", "Es Teh Manis", "Air Putih (Biar Sehat)"], ans: 1 },
  { q: "Berapa persen tingkat 'cegil' kamu tahun ini?", options: ["10% aja kok", "50% kadang kumat", "100% full power", "Infinity and beyond 🚀"], ans: 3 },
  { q: "Apa hadiah yang paling kamu harapkan di ulang tahun ini?", options: ["Uang", "Uang Tunai", "Saldo E-Wallet", "Cuan"], ans: 2 }
];

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');

  body {
    font-family: 'Quicksand', sans-serif;
    touch-action: none;
    overflow: hidden;
  }

  @keyframes gradient-xy {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .bg-arcade {
    background: linear-gradient(-45deg, #ff9a9e, #fad0c4, #a1c4fd, #c2e9fb, #d4fc79);
    background-size: 400% 400%;
    animation: gradient-xy 10s ease infinite;
  }

  .arcade-card {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(12px);
    border: 4px solid white;
    box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 2rem;
  }

  .arcade-btn {
    box-shadow: 0 4px 0px #db2777;
    transition: all 0.1s;
    cursor: pointer;
  }
  .arcade-btn:active {
    transform: translateY(4px);
    box-shadow: 0 0px 0px #db2777;
  }

  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  .animate-bounce-subtle {
    animation: bounce-subtle 2s infinite ease-in-out;
  }

  input[type=range] {
    accent-color: #db2777;
  }
`;

export default function BirthdayApp() {
  const [stage, setStage] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      setTimeout(() => { if (audio instanceof HTMLAudioElement) {
      audio.play().catch(() => {});
    };
    if (audio instanceof HTMLAudioElement) {
    audio.addEventListener("ended", handleEnded);
    }
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const renderStage = () => {
    switch (stage) {
      case 0: return <PinScreen onUnlock={() => setStage(1)} onInteraction={startMusic} />;
      case 1: return (
        <LetterScreen 
          title="💌 Welcome to Candy Zone!"
          content="Hai Cantik! 🎉 Selamat ulang tahun ya! Aku udah siapin tantangan seru ala arcade buat kamu. Selesaikan semua gamenya buat klaim hadiah utama di akhir. Ready for some fun?"
          btnText="START GAME! ✨"
          onNext={() => setStage(2)}
        />
      );
      case 2: return <WordleGame key="wordle1" targetWord="HAPPY" onComplete={() => setStage(3)} />;
      case 3: return <WordleGame key="wordle2" targetWord="BIRTHDAY" onComplete={() => setStage(4)} />;
      case 4: return (
        <LetterScreen 
          title="📸 Memori Cantik!"
          content="Wow, jago banget nebak katanya! Sekarang kita masuk ke Zona Memori. Ada game 2048 tapi isinya foto-foto kamu yang gemes. Kumpulin 1000 poin ya!"
          btnText="KE ZONA MEMORI! 🕹️"
          onNext={() => setStage(5)}
        />
      );
      case 5: return <Game2048 onWin={() => setStage(6)} />;
      case 6: return (
        <LetterScreen 
          title="👯‍♀️ Kuis Bestie!"
          content="Foto-fotonya lucu kan? Hehe. Terakhir nih, jawab kuis random tentang kita biar bisa ambil hadiahnya!"
          btnText="GAS KUIS! 🔥"
          onNext={() => setStage(7)}
        />
      );
      case 7: return <QuizGame onWin={() => setStage(8)} />;
      case 8: return <FinalScreen />;
      default: return null;
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-arcade flex items-center justify-center p-4 relative">
        <audio ref={audioRef} src={BGM_URL} />
        <div className="fixed top-6 right-6 z-[100] flex flex-col items-end gap-2">
          <div className={`bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border-2 border-white transition-all duration-300 flex items-center gap-3 ${showVolumeControl ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
            <button onClick={() => setIsMuted(!isMuted)} className="text-pink-500 hover:scale-110 transition">
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume1 size={20} />}
            </button>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => { setVolume(parseFloat(e.target.value)); if(isMuted) setIsMuted(false); }} className="w-24 h-1.5 rounded-full cursor-pointer" />
          </div>
          <button onClick={() => setShowVolumeControl(!showVolumeControl)} className="bg-white/80 backdrop-blur-md p-4 rounded-full shadow-lg border-4 border-white text-pink-500 hover:scale-110 active:scale-95 transition-all">
            {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
        {renderStage()}
      </div>
    </>
  );
}

// --- PIN SCREEN ---
function PinScreen({ onUnlock, onInteraction }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const handleNumInput = useCallback((num) => { onInteraction(); setPin(prev => (prev.length < 4 ? prev + num : prev)); }, [onInteraction]);
  const handleDelete = useCallback(() => setPin(prev => prev.slice(0, -1)), []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') handleNumInput(e.key);
      if (e.key === 'Backspace') handleDelete();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumInput, handleDelete]);
  useEffect(() => {
    if (pin.length === 4) {
      if (pin === '2402') setTimeout(onUnlock, 300);
      else { setError(true); setTimeout(() => { setError(false); setPin(''); }, 800); }
    }
  }, [pin, onUnlock]);
  return (
    <div className="arcade-card p-8 max-w-sm w-full text-center flex flex-col items-center">
      <div className="bg-white p-4 rounded-3xl mb-4 text-pink-500 shadow-inner border-2 border-pink-100">
        {pin.length === 4 && !error ? <Unlock size={36} /> : <Lock size={36} />}
      </div>
      <h2 className="text-2xl font-black mb-1 text-pink-600 uppercase tracking-tight italic">PIN Password</h2>
      <p className="text-sm text-gray-500 mb-6 font-semibold">Tanggal lahirmu (DDMM)</p>
      <div className={`flex gap-3 mb-8 ${error ? 'animate-shake' : ''}`}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`w-12 h-14 rounded-xl border-4 flex items-center justify-center text-2xl font-bold transition-all ${pin[i] ? 'border-pink-400 bg-pink-50 text-pink-600' : 'border-gray-200 bg-gray-50 text-gray-300'}`}>
            {pin[i] ? '●' : ''}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'del', 0, 'ok'].map((btn, idx) => {
          if (btn === 'del') return <button key={idx} onClick={handleDelete} className="arcade-btn bg-pink-100 p-4 rounded-2xl flex items-center justify-center text-pink-600 border-2 border-pink-200"><Delete size={24} /></button>;
          if (btn === 'ok') return <div key={idx} />;
          return <button key={idx} onClick={() => handleNumInput(btn.toString())} className="arcade-btn bg-white py-4 rounded-2xl text-xl font-bold text-gray-700 border-2 border-gray-100">{btn}</button>;
        })}
      </div>
    </div>
  );
}

// --- LETTER SCREEN ---
function LetterScreen({ title, content, btnText, onNext }) {
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Enter') onNext(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext]);
  return (
    <div className="arcade-card p-8 max-w-md w-full animate-bounce-subtle">
      <div className="flex justify-center mb-6"><Heart className="text-pink-500 fill-pink-500" size={48} /></div>
      <h2 className="text-2xl font-black mb-4 text-pink-600 text-center uppercase italic leading-none">{title}</h2>
      <p className="text-gray-600 mb-8 text-center font-bold text-lg leading-relaxed">{content}</p>
      <button onClick={onNext} className="arcade-btn w-full bg-pink-500 text-white font-black py-4 px-6 rounded-2xl text-xl flex items-center justify-center gap-2">
        {btnText} <ArrowRight size={24} />
      </button>
    </div>
  );
}

// --- WORDLE GAME ---
function WordleGame({ targetWord, onComplete }) {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [status, setStatus] = useState(null);
  const wordLength = targetWord.length;
  const maxGuesses = 6;
  const handleSubmit = useCallback(() => {
    if (currentGuess.length !== wordLength) return;
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    if (currentGuess === targetWord) { setStatus('win'); setShowResult(true); }
    else if (newGuesses.length >= maxGuesses) { setStatus('lose'); setShowResult(true); }
  }, [currentGuess, guesses, targetWord, wordLength]);
  const onKeyPress = useCallback((key) => {
    if (showResult) { if (key.toUpperCase() === 'ENTER') onComplete(); return; }
    const upperKey = key.toUpperCase();
    if (upperKey === 'ENTER') handleSubmit();
    else if (upperKey === 'BACKSPACE') setCurrentGuess(prev => prev.slice(0, -1));
    else if (currentGuess.length < wordLength && /^[A-Z]$/.test(upperKey)) setCurrentGuess(prev => prev + upperKey);
  }, [currentGuess, wordLength, handleSubmit, showResult, onComplete]);
  useEffect(() => {
    const handleKeyDown = (e) => onKeyPress(e.key);
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);
  return (
    <div className="arcade-card p-6 max-w-md w-full flex flex-col items-center relative overflow-hidden">
      <h2 className="text-xl font-black mb-6 text-pink-600 flex items-center gap-2 italic uppercase"><Sparkles size={24} className="text-yellow-400" /> Tebak Kata!</h2>
      <div className="grid gap-2 mb-8" style={{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}>
        {Array.from({ length: maxGuesses }).map((_, rowIndex) => {
          const guess = guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : '');
          return Array.from({ length: wordLength }).map((_, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center font-black text-xl rounded-xl border-4 transition-all duration-200 ${guesses[rowIndex] ? (guesses[rowIndex][colIndex] === targetWord[colIndex] ? 'bg-green-400 text-white border-green-500' : targetWord.includes(guesses[rowIndex][colIndex]) ? 'bg-yellow-400 text-white border-yellow-500' : 'bg-gray-200 text-gray-500 border-gray-300') : 'bg-white border-pink-100 text-gray-700'}`}>
              {guess[colIndex] || ''}
            </div>
          ));
        })}
      </div>
      <div className="w-full flex flex-col gap-2">
        {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {i === 2 && <button onClick={() => onKeyPress('ENTER')} className="bg-pink-200 px-3 rounded-lg font-bold text-pink-700 text-xs arcade-btn">ENTER</button>}
            {row.split('').map(key => (<button key={key} onClick={() => onKeyPress(key)} className="flex-1 bg-white py-3 rounded-lg font-bold text-gray-600 border-2 border-gray-100 text-sm sm:text-base arcade-btn">{key}</button>))}
            {i === 2 && <button onClick={() => onKeyPress('BACKSPACE')} className="bg-pink-100 px-3 rounded-lg arcade-btn text-pink-600"><Delete size={18}/></button>}
          </div>
        ))}
      </div>
      {showResult && (
        <div className="absolute inset-0 bg-white/95 flex items-center justify-center p-8 text-center z-50 animate-in fade-in zoom-in">
          <div>
            <div className={`text-4xl font-black mb-2 ${status === 'win' ? 'text-green-500' : 'text-pink-500'}`}>{status === 'win' ? 'BERHASIL! 🎉' : 'GAGAL! 🥺'}</div>
            <p className="font-bold text-gray-600 mb-6 italic text-xl">Kata rahasia: <span className="text-pink-600 uppercase font-black">{targetWord}</span></p>
            <button onClick={onComplete} className="arcade-btn bg-pink-500 text-white px-10 py-4 rounded-2xl font-black text-xl w-full">Lanjut! [Enter]</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- GAME 2048 ---
function Game2048({ onWin }) {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });
  const targetScore = 1000;
  const initGame = useCallback(() => {
    let b = Array(4).fill().map(() => Array(4).fill(0));
    addRandom(b); addRandom(b);
    setBoard(b); setScore(0); setHistory([]); setGameOver(false); setWon(false);
  }, []);
  useEffect(() => { initGame(); }, [initGame]);
  const addRandom = (b) => {
    let empty = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (b[r][c] === 0) empty.push({r, c});
    if (empty.length) {
      const {r, c} = empty[Math.floor(Math.random() * empty.length)];
      b[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  };
  const move = useCallback((dir) => {
    if (gameOver || won) return;
    let b = JSON.parse(JSON.stringify(board));
    let moved = false; let s = score;
    const combine = (row) => {
      let f = row.filter(v => v !== 0);
      for (let i = 0; i < f.length - 1; i++) { if (f[i] === f[i+1]) { f[i] *= 2; s += f[i]; f.splice(i+1, 1); } }
      while (f.length < 4) f.push(0);
      return f;
    };
    if (dir === 'LEFT' || dir === 'RIGHT') {
      for (let r = 0; r < 4; r++) {
        let row = b[r]; if (dir === 'RIGHT') row.reverse();
        let newRow = combine(row); if (dir === 'RIGHT') newRow.reverse();
        if (JSON.stringify(b[r]) !== JSON.stringify(newRow)) { moved = true; b[r] = newRow; }
      }
    } else {
      for (let c = 0; c < 4; c++) {
        let col = [b[0][c], b[1][c], b[2][c], b[3][c]]; if (dir === 'DOWN') col.reverse();
        let newCol = combine(col); if (dir === 'DOWN') newCol.reverse();
        for (let r = 0; r < 4; r++) { if (b[r][c] !== newCol[r]) moved = true; b[r][c] = newCol[r]; }
      }
    }
    if (moved) {
      setHistory(prev => [...prev, { board: JSON.parse(JSON.stringify(board)), score }].slice(-10));
      addRandom(b); setBoard(b); setScore(s);
      if (s >= targetScore) setWon(true);
      else if (checkGameOver(b)) setGameOver(true);
    }
  }, [board, score, gameOver, won]);
  const checkGameOver = (b) => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      if (b[r][c] === 0) return false;
      if (c < 3 && b[r][c] === b[r][c+1]) return false;
      if (r < 3 && b[r][c] === b[r+1][c]) return false;
    }
    return true;
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') move('LEFT'); if (e.key === 'ArrowRight') move('RIGHT');
      if (e.key === 'ArrowUp') move('UP'); if (e.key === 'ArrowDown') move('DOWN');
      if (e.key === 'Enter' && (gameOver || won)) (won ? onWin() : initGame());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, initGame, gameOver, won, onWin]);
  return (
    <div className="arcade-card p-6 max-w-md w-full flex flex-col items-center relative" onTouchStart={(e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchEnd={(e) => {
      const dx = e.changedTouches[0].clientX - touchStart.current.x; const dy = e.changedTouches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) > Math.abs(dy)) { if (Math.abs(dx) > 30) move(dx > 0 ? 'RIGHT' : 'LEFT'); }
      else { if (Math.abs(dy) > 30) move(dy > 0 ? 'DOWN' : 'UP'); }
    }}>
      <div className="flex justify-between w-full mb-4 items-end">
        <div>
          <h2 className="text-2xl font-black text-pink-600 italic uppercase">Foto 2048</h2>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setHistory(prev => { if (prev.length === 0) return prev; setBoard(prev[prev.length-1].board); setScore(prev[prev.length-1].score); return prev.slice(0,-1); })} className="p-2 bg-white rounded-xl border-2 border-pink-100 text-pink-500 arcade-btn"><Undo2 size={18}/></button>
            <button onClick={initGame} className="p-2 bg-white rounded-xl border-2 border-pink-100 text-pink-500 arcade-btn"><RotateCcw size={18}/></button>
          </div>
        </div>
        <div className="bg-white border-4 border-pink-100 px-4 py-2 rounded-2xl shadow-inner text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase leading-none">Score</p>
          <p className="text-2xl font-black text-pink-500 leading-none">{score}</p>
        </div>
      </div>
      <div className="w-full bg-white/50 rounded-full h-4 mb-6 border-2 border-white"><div className="bg-pink-400 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (score/targetScore)*100)}%` }} /></div>
      <div className="grid grid-cols-4 gap-2 w-full aspect-square bg-pink-100/50 p-2 rounded-3xl border-4 border-white">
        {board.map((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} className="bg-white/60 rounded-xl relative overflow-hidden flex items-center justify-center border-2 border-white/40">
            {cell !== 0 && <div className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-110" style={{ backgroundImage: `url(${PHOTO_TILES[cell] || PHOTO_TILES[2]})` }}><div className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] px-1 rounded font-black">{cell}</div></div>}
          </div>
        )))}
      </div>
      {(gameOver || won) && (
        <div className="absolute inset-0 bg-white/95 rounded-3xl flex items-center justify-center p-8 text-center z-50">
          <div>
            <div className={`text-4xl font-black mb-4 ${won ? 'text-green-500' : 'text-pink-500'}`}>{won ? 'MENANG! 🎉' : 'KALAH! 🥺'}</div>
            <button onClick={won ? onWin : initGame} className="arcade-btn bg-pink-500 text-white px-10 py-4 rounded-2xl font-black text-xl w-full">{won ? 'Lanjut! [Enter]' : 'Ulang! [Enter]'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- QUIZ GAME DENGAN REVEAL BENAR/SALAH ---
function QuizGame({ onWin }) {
  const [qIdx, setQIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const q = QUIZ_QUESTIONS[qIdx];

  const handleAnswer = useCallback((idx) => {
    if (isAnswering) return;
    setSelectedIdx(idx);
    setIsAnswering(true);

    // Delay 1.5 detik untuk melihat feedback warna sebelum pindah
    setTimeout(() => {
      if (qIdx < QUIZ_QUESTIONS.length - 1) {
        setQIdx(qIdx + 1);
        setSelectedIdx(null);
        setIsAnswering(false);
      } else {
        onWin();
      }
    }, 1500);
  }, [qIdx, onWin, isAnswering]);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key >= '1' && e.key <= '4') handleAnswer(parseInt(e.key) - 1); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnswer]);

  return (
    <div className="arcade-card p-8 max-w-md w-full">
      <div className="flex justify-center mb-4 text-pink-500 font-bold uppercase text-sm tracking-widest italic">Pertanyaan {qIdx + 1}/{QUIZ_QUESTIONS.length}</div>
      <h2 className="text-xl font-bold mb-8 text-center text-gray-700 italic leading-snug">"{q.q}"</h2>
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          // Logika Warna Feedback
          let bgColor = "bg-white";
          let borderColor = "border-pink-100";
          let textColor = "text-gray-600";

          if (isAnswering) {
            if (i === q.ans) {
              // Jawaban yang BENAR selalu hijau lembut
              bgColor = "bg-green-50";
              borderColor = "border-green-200";
              textColor = "text-green-700";
            } else if (i === selectedIdx && selectedIdx !== q.ans) {
              // Jawaban yang SALAH (jika diklik) merah lembut
              bgColor = "bg-red-50";
              borderColor = "border-red-200";
              textColor = "text-red-700";
            } else {
              // Sisanya memudar
              bgColor = "bg-gray-50/50";
              borderColor = "border-gray-100";
              textColor = "text-gray-300";
            }
          }

          return (
            <button 
              key={i} 
              disabled={isAnswering}
              onClick={() => handleAnswer(i)} 
              className={`w-full text-left p-4 rounded-2xl border-4 font-bold transition-all duration-300 ${bgColor} ${borderColor} ${textColor} ${!isAnswering ? 'arcade-btn flex justify-between items-center group' : 'flex justify-between items-center opacity-100'}`}
            >
              <span>{opt}</span>
              {!isAnswering && <span className="text-[10px] opacity-40 group-hover:opacity-100 font-black">[{i+1}]</span>}
              {isAnswering && i === q.ans && <Check size={18} className="text-green-500" />}
              {isAnswering && i === selectedIdx && selectedIdx !== q.ans && <Delete size={18} className="text-red-500" />}
            </button>
          );
        })}
      </div>
      {isAnswering && (
        <div className="mt-6 text-center animate-pulse text-gray-400 font-bold text-sm uppercase italic tracking-widest">
          {selectedIdx === q.ans ? "Keren! Kamu bener! ✨" : "Hampir! Cek jawaban aslinya ya.. 🥺"}
        </div>
      )}
    </div>
  );
}

// --- FINAL SCREEN ---
function FinalScreen() {
  return (
    <div className="arcade-card p-8 max-w-md w-full text-center animate-bounce-subtle">
      <div className="relative mb-8 inline-block">
        <img src="https://images.unsplash.com/photo-1558482434-6242335198df?w=200&h=200&fit=crop" className="w-40 h-40 rounded-full border-8 border-white shadow-2xl object-cover" alt="Cake"/>
        <Sparkles className="absolute -top-4 -right-4 text-yellow-400 animate-pulse" size={48} />
      </div>
      <h1 className="text-4xl font-black mb-4 text-pink-600 italic tracking-tighter uppercase leading-none">HBD Bestie! 🎂</h1>
      <p className="text-gray-600 font-bold mb-8 text-lg">Kamu emang MVP hari ini! 💖✨</p>
      <a href={EWALLET_LINK} target="_blank" rel="noopener noreferrer" className="arcade-btn inline-block w-full bg-green-500 text-white font-black py-5 rounded-3xl text-2xl uppercase tracking-widest hover:bg-green-600">AMBIL HADIAH! 💸</a>
    </div>
  );
}