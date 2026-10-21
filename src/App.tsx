/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { StudioConfig, Surah, Ayah } from './types/quran';
import { BACKGROUNDS, RECITERS, TRANSLATION_LANGUAGES } from './data/constants';
import {
  fetchSurahList,
  fetchSurahAyahs,
  getRandomInspirationalVerse
} from './services/quranApi';
import { ambientEngine } from './services/ambientAudio';
import { shareContent } from './services/exportService';

import { StudioHeader } from './components/StudioHeader';
import { VerseSelector } from './components/VerseSelector';
import { DesignControls } from './components/DesignControls';
import { CanvasPreview } from './components/CanvasPreview';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { ExportModal } from './components/ExportModal';
import { Sparkles, Loader2, BookOpen } from 'lucide-react';

export default function App() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [fromAyah, setFromAyah] = useState<number>(1);
  const [toAyah, setToAyah] = useState<number>(7);
  const [allSurahAyahs, setAllSurahAyahs] = useState<Ayah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(true);

  // Reciter & Audio state
  const [selectedReciterId, setSelectedReciterId] = useState<string>('alafasy');
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Export Modal state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Studio Customization Config
  const [config, setConfig] = useState<StudioConfig>({
    aspectRatio: '9:16',
    font: 'Amiri Quran',
    fontSize: 26,
    lineHeight: 2.1,
    textDropShadow: true,
    textGlow: false,
    textColor: '#ffffff',
    showBasmala: true,
    showTranslation: true,
    translationLang: 'en.sahih',
    showTafseer: false,
    background: BACKGROUNDS[0], // Mosque arches
    darkOverlayOpacity: 0.65,
    blurBackdrop: 2,
    frameStyle: 'islamic-gold',
    themeColor: 'gold',
    watermark: {
      enabled: true,
      text: '@quran_daily',
      platform: 'tiktok',
      position: 'bottom-center'
    },
    kineticHighlight: true,
    ambientSound: 'none',
    ambientVolume: 0.3
  });

  const activeReciter =
    RECITERS.find((r) => r.id === selectedReciterId) || RECITERS[0];
  const activeSurah =
    surahs.find((s) => s.number === selectedSurahNumber) || surahs[0];

  // Filtered Ayahs based on range
  const displayedAyahs = allSurahAyahs.filter(
    (a) => a.numberInSurah >= fromAyah && a.numberInSurah <= toAyah
  );

  // Load Surah list once
  useEffect(() => {
    fetchSurahList().then((list) => {
      setSurahs(list);
    });
  }, []);

  // Fetch Ayahs when surah, reciter, or translation changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingAyahs(true);

    fetchSurahAyahs(
      selectedSurahNumber,
      activeReciter.identifier,
      config.translationLang
    ).then((res) => {
      if (!isCancelled) {
        setAllSurahAyahs(res.ayahs);
        setIsLoadingAyahs(false);
        setCurrentAyahIndex(0);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedSurahNumber, selectedReciterId, config.translationLang]);

  // Handle ambient sound playback
  useEffect(() => {
    if (config.ambientSound !== 'none') {
      ambientEngine.play(config.ambientSound, config.ambientVolume);
    } else {
      ambientEngine.stop();
    }
    return () => {
      ambientEngine.stop();
    };
  }, [config.ambientSound]);

  useEffect(() => {
    ambientEngine.setVolume(config.ambientVolume);
  }, [config.ambientVolume]);

  const updateConfig = (partial: Partial<StudioConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const handleSelectSurah = (surahNum: number) => {
    setSelectedSurahNumber(surahNum);
    const surah = surahs.find((s) => s.number === surahNum);
    const total = surah?.numberOfAyahs || 10;
    // Default to first 3-5 ayahs for aesthetic preview
    const defaultEnd = Math.min(total, 5);
    setFromAyah(1);
    setToAyah(defaultEnd);
    setIsPlaying(false);
  };

  const handleChangeRange = (from: number, to: number) => {
    setFromAyah(from);
    setToAyah(to);
    setCurrentAyahIndex(0);
  };

  const handleRandomVerse = () => {
    const random = getRandomInspirationalVerse();
    setSelectedSurahNumber(random.surahNumber);
    setFromAyah(random.fromAyah);
    setToAyah(random.toAyah);
    setIsPlaying(false);
  };

  const handleQuickShare = () => {
    if (!displayedAyahs.length) return;
    const title = activeSurah?.name || 'آيات من القرآن الكريم';
    const text = displayedAyahs.map((a) => `${a.text} ﴿${a.numberInSurah}﴾`).join(' ');
    shareContent({
      title,
      text: `${title}\n\n${text}\n\nعبر استوديو الوسائط القرآنية`
    });
  };

  // Determine which ayah in surah is active for glowing highlight
  const currentActiveAyah = displayedAyahs[currentAyahIndex];
  const activeAyahNumberInSurah = currentActiveAyah?.numberInSurah;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar Header */}
      <StudioHeader
        onRandomVerse={handleRandomVerse}
        onOpenExport={() => setIsExportOpen(true)}
        onQuickShare={handleQuickShare}
        activeReciterName={activeReciter.nameAr}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left / Center: Interactive Preview Canvas */}
        <section className="w-full lg:w-7/12 flex flex-col items-center sticky top-20">
          {/* Quick ratio bar */}
          <div className="w-full flex items-center justify-between mb-3 px-1 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>معاينة حية للمقطع ({config.aspectRatio})</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateConfig({ aspectRatio: '9:16' })}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  config.aspectRatio === '9:16' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'hover:text-white'
                }`}
              >
                9:16 ستوري
              </button>
              <button
                onClick={() => updateConfig({ aspectRatio: '1:1' })}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  config.aspectRatio === '1:1' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'hover:text-white'
                }`}
              >
                1:1 مربع
              </button>
              <button
                onClick={() => updateConfig({ aspectRatio: '16:9' })}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  config.aspectRatio === '16:9' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'hover:text-white'
                }`}
              >
                16:9 عريض
              </button>
            </div>
          </div>

          {/* The Canvas Card */}
          <div className="w-full flex justify-center">
            {isLoadingAyahs ? (
              <div className="w-full aspect-[9/16] max-w-[390px] rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                <span className="text-xs text-slate-400">جاري جلب الآيات والتلاوة...</span>
              </div>
            ) : (
              <CanvasPreview
                ref={cardRef}
                config={config}
                surah={activeSurah}
                ayahs={displayedAyahs}
                currentAyahNumberInSurah={activeAyahNumberInSurah}
                isPlaying={isPlaying}
              />
            )}
          </div>
        </section>

        {/* Right: Studio Control Center */}
        <section className="w-full lg:w-5/12 space-y-6">
          {/* Section 1: Verse Engine */}
          <VerseSelector
            surahs={surahs}
            selectedSurahNumber={selectedSurahNumber}
            fromAyah={fromAyah}
            toAyah={toAyah}
            totalAyahsInSurah={activeSurah?.numberOfAyahs || 7}
            onSelectSurah={handleSelectSurah}
            onChangeRange={handleChangeRange}
            config={config}
            onUpdateConfig={updateConfig}
            onRandomVerse={handleRandomVerse}
            isLoading={isLoadingAyahs}
          />

          {/* Section 2: Design & Customization Engine */}
          <DesignControls
            config={config}
            onUpdateConfig={updateConfig}
            selectedReciterId={selectedReciterId}
            onSelectReciter={setSelectedReciterId}
          />
        </section>
      </main>

      {/* Sticky Bottom Audio Player Bar */}
      <AudioPlayerBar
        ayahs={displayedAyahs}
        currentReciter={activeReciter}
        currentAyahIndex={currentAyahIndex}
        onAyahIndexChange={setCurrentAyahIndex}
        isPlaying={isPlaying}
        onTogglePlay={setIsPlaying}
      />

      {/* Export & Media Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        cardElement={cardRef.current}
        surah={activeSurah}
        ayahs={displayedAyahs}
        config={config}
      />
    </div>
  );
}
