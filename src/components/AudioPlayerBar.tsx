import React, { useEffect, useRef, useState } from 'react';
import { Ayah, Reciter } from '../types/quran';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface AudioPlayerBarProps {
  ayahs: Ayah[];
  currentReciter: Reciter;
  currentAyahIndex: number;
  onAyahIndexChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: (playing: boolean) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  ayahs,
  currentReciter,
  currentAyahIndex,
  onAyahIndexChange,
  isPlaying,
  onTogglePlay
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  const currentAyah = ayahs[currentAyahIndex];

  // Load and play when currentAyahIndex or isPlaying changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAyah?.audio) return;

    if (audio.src !== currentAyah.audio) {
      audio.src = currentAyah.audio;
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn('تعذر التشغيل التلقائي للصوت:', err);
        onTogglePlay(false);
      });
    } else {
      audio.pause();
    }
  }, [currentAyah, isPlaying]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    }
  };

  const handleEnded = () => {
    // Advance to next verse in the selected range
    if (currentAyahIndex < ayahs.length - 1) {
      onAyahIndexChange(currentAyahIndex + 1);
    } else {
      // Loop back to start or pause
      onAyahIndexChange(0);
      onTogglePlay(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.8;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel border-t border-slate-800/80 px-4 py-3 backdrop-blur-xl sticky bottom-0 z-30">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
        {/* Reciter Info & Active Ayah */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-md">
            {currentReciter.nameAr.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white truncate max-w-[160px]">
              {currentReciter.nameAr}
            </span>
            <span className="text-[11px] text-amber-400 font-mono">
              الآية {currentAyah?.numberInSurah || 1} من {ayahs.length}
            </span>
          </div>
        </div>

        {/* Player Controls & Timeline */}
        <div className="flex flex-col items-center gap-1.5 w-full max-w-xl">
          <div className="flex items-center gap-4">
            {/* Previous Verse */}
            <button
              type="button"
              onClick={() => onAyahIndexChange(Math.max(0, currentAyahIndex - 1))}
              disabled={currentAyahIndex === 0}
              className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Play / Pause Primary Button */}
            <button
              type="button"
              onClick={() => onTogglePlay(!isPlaying)}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>

            {/* Next Verse */}
            <button
              type="button"
              onClick={() => onAyahIndexChange(Math.min(ayahs.length - 1, currentAyahIndex + 1))}
              disabled={currentAyahIndex >= ayahs.length - 1}
              className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Restart Verse */}
            <button
              type="button"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  setCurrentTime(0);
                }
              }}
              className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
              title="إعادة الاستماع"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Seeker Slider & Time Counter */}
          <div className="flex items-center gap-2.5 w-full text-[11px] font-mono text-slate-400">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="w-10 text-left">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="hidden lg:flex items-center gap-2 text-slate-400">
          <button type="button" onClick={toggleMute} className="hover:text-white transition-colors cursor-pointer">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
