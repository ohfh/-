import React, { useState } from 'react';
import { Surah, StudioConfig } from '../types/quran';
import { POPULAR_SURAHS, TRANSLATION_LANGUAGES } from '../data/constants';
import { BookOpen, Search, Sparkles, Languages, Check, SlidersHorizontal } from 'lucide-react';

interface VerseSelectorProps {
  surahs: Surah[];
  selectedSurahNumber: number;
  fromAyah: number;
  toAyah: number;
  totalAyahsInSurah: number;
  onSelectSurah: (num: number) => void;
  onChangeRange: (from: number, to: number) => void;
  config: StudioConfig;
  onUpdateConfig: (partial: Partial<StudioConfig>) => void;
  onRandomVerse: () => void;
  isLoading: boolean;
}

export const VerseSelector: React.FC<VerseSelectorProps> = ({
  surahs,
  selectedSurahNumber,
  fromAyah,
  toAyah,
  totalAyahsInSurah,
  onSelectSurah,
  onChangeRange,
  config,
  onUpdateConfig,
  onRandomVerse,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentSurah = surahs.find((s) => s.number === selectedSurahNumber) || surahs[0];

  const filteredSurahs = surahs.filter(
    (s) =>
      s.name.includes(searchQuery) ||
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString().includes(searchQuery)
  );

  const handleFromChange = (val: number) => {
    const clamped = Math.max(1, Math.min(val, totalAyahsInSurah));
    onChangeRange(clamped, Math.max(clamped, toAyah));
  };

  const handleToChange = (val: number) => {
    const clamped = Math.max(fromAyah, Math.min(val, totalAyahsInSurah));
    onChangeRange(fromAyah, clamped);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-5">
      {/* Title & Quick Suggestion */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-semibold text-white">اختيار السورة والآيات</h2>
        </div>
        <button
          onClick={onRandomVerse}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>آية مقترحة</span>
        </button>
      </div>

      {/* Surah Dropdown with Search */}
      <div className="relative">
        <label className="block text-xs font-medium text-slate-400 mb-1.5">السورة الكريمة</label>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-right text-sm hover:border-amber-500/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 flex items-center justify-center rounded-md bg-amber-500/15 text-amber-300 text-xs font-semibold tabular-nums">
              {currentSurah?.number || 1}
            </span>
            <span className="font-semibold text-white">{currentSurah?.name || 'سورة الفاتحة'}</span>
            <span className="text-xs text-slate-400 hidden sm:inline">({currentSurah?.englishName})</span>
          </div>
          <span className="text-xs text-slate-400 tabular-nums">
            {totalAyahsInSurah} آية
          </span>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full mt-2 w-full z-50 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-2xl max-h-72 flex flex-col overflow-hidden">
            {/* Search Input */}
            <div className="p-2.5 border-b border-slate-800 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث باسم السورة أو رقمها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                autoFocus
              />
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-1 divide-y divide-slate-800/40">
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  type="button"
                  onClick={() => {
                    onSelectSurah(surah.number);
                    setIsDropdownOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-right text-xs rounded-lg transition-colors cursor-pointer ${
                    surah.number === selectedSurahNumber
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 w-5 tabular-nums">{surah.number}</span>
                    <span>{surah.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] tabular-nums">
                    <span>{surah.numberOfAyahs} آية</span>
                    {surah.number === selectedSurahNumber && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popular Surahs Shortcuts */}
      <div>
        <span className="block text-xs font-medium text-slate-400 mb-1.5">اختصارات سريعة</span>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SURAHS.map((item) => (
            <button
              key={item.number}
              type="button"
              onClick={() => onSelectSurah(item.number)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                selectedSurahNumber === item.number
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {item.popularName}
            </button>
          ))}
        </div>
      </div>

      {/* Verse Range Inputs */}
      <div className="space-y-2 pt-1 border-t border-slate-800/60">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>نطاق الآيات المعروضة</span>
          <span className="text-amber-400 tabular-nums">
            من الآية {fromAyah} إلى {toAyah} ({toAyah - fromAyah + 1} آيات)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">من الآية</label>
            <input
              type="number"
              min={1}
              max={totalAyahsInSurah}
              value={fromAyah}
              onChange={(e) => handleFromChange(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-center text-sm font-semibold text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">إلى الآية</label>
            <input
              type="number"
              min={fromAyah}
              max={totalAyahsInSurah}
              value={toAyah}
              onChange={(e) => handleToChange(parseInt(e.target.value) || fromAyah)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-center text-sm font-semibold text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Toggles (Basmala, Translation, Tafseer) */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
        {/* Basmala Toggle (Disabled if Surah At-Tawbah 9) */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-200">إظهار البسملة</span>
            {selectedSurahNumber === 9 ? (
              <span className="text-[10px] text-amber-400/80">مستثناة شرعاً في سورة التوبة</span>
            ) : (
              <span className="text-[10px] text-slate-400">في رأس التصميم</span>
            )}
          </div>
          <button
            type="button"
            disabled={selectedSurahNumber === 9}
            onClick={() => onUpdateConfig({ showBasmala: !config.showBasmala })}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              config.showBasmala && selectedSurahNumber !== 9 ? 'bg-amber-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform ${
                config.showBasmala && selectedSurahNumber !== 9 ? '-translate-x-5' : ''
              }`}
            />
          </button>
        </div>

        {/* Translation Toggle & Language Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-200">الترجمة المصاحبة</span>
              <span className="text-[10px] text-slate-400">أسفل الآيات الكريمة</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateConfig({ showTranslation: !config.showTranslation })}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                config.showTranslation ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  config.showTranslation ? '-translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          {config.showTranslation && (
            <div className="pl-1">
              <select
                value={config.translationLang}
                onChange={(e) => onUpdateConfig({ translationLang: e.target.value })}
                className="w-full text-xs bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-amber-500"
              >
                {TRANSLATION_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Tafseer Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-200">التفسير الميسر</span>
            <span className="text-[10px] text-slate-400">إظهار شرح مختصر لمعاني الآيات</span>
          </div>
          <button
            type="button"
            onClick={() => onUpdateConfig({ showTafseer: !config.showTafseer })}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              config.showTafseer ? 'bg-amber-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform ${
                config.showTafseer ? '-translate-x-5' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
