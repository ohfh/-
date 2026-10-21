import React, { forwardRef } from 'react';
import { Ayah, StudioConfig, Surah } from '../types/quran';
import { FONTS_LIST } from '../data/constants';
import { AmbientCanvas } from './AmbientCanvas';
import { Instagram, Twitter, Youtube } from 'lucide-react';

interface CanvasPreviewProps {
  config: StudioConfig;
  surah: Surah | undefined;
  ayahs: Ayah[];
  currentAyahNumberInSurah?: number;
  isPlaying?: boolean;
}

export const CanvasPreview = forwardRef<HTMLDivElement, CanvasPreviewProps>(
  ({ config, surah, ayahs, currentAyahNumberInSurah, isPlaying }, ref) => {
    const selectedFont = FONTS_LIST.find((f) => f.id === config.font) || FONTS_LIST[0];

    // Determine container aspect ratio class
    const aspectClass =
      config.aspectRatio === '9:16'
        ? 'aspect-[9/16] w-full max-w-[390px]'
        : config.aspectRatio === '1:1'
        ? 'aspect-square w-full max-w-[490px]'
        : 'aspect-[16/9] w-full max-w-[780px]';

    // Theme color accent classes
    const themeAccentBorder =
      config.themeColor === 'emerald'
        ? 'border-emerald-500/40'
        : config.themeColor === 'indigo'
        ? 'border-indigo-500/40'
        : config.themeColor === 'burgundy'
        ? 'border-rose-500/40'
        : 'border-amber-400/40';

    const themeGlow =
      config.themeColor === 'emerald'
        ? 'rgba(16, 185, 129, 0.4)'
        : config.themeColor === 'indigo'
        ? 'rgba(99, 102, 241, 0.4)'
        : config.themeColor === 'burgundy'
        ? 'rgba(244, 63, 94, 0.4)'
        : 'rgba(245, 158, 11, 0.4)';

    // Render social icon for watermark
    const renderWatermarkIcon = () => {
      switch (config.watermark.platform) {
        case 'instagram':
          return <Instagram className="w-3.5 h-3.5 text-amber-300" />;
        case 'youtube':
          return <Youtube className="w-3.5 h-3.5 text-amber-300" />;
        case 'twitter':
          return <Twitter className="w-3.5 h-3.5 text-amber-300" />;
        default:
          return (
            <span className="font-mono text-[10px] font-bold text-amber-300">
              {config.watermark.platform === 'tiktok' ? '♪' : '@'}
            </span>
          );
      }
    };

    return (
      <div className="flex items-center justify-center w-full py-4">
        <div
          ref={ref}
          id="quran-canvas-export"
          className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 select-none flex flex-col justify-between ${aspectClass}`}
          style={{
            boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px ${themeGlow}`
          }}
        >
          {/* LAYER 1: Background Media */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {config.background.type === 'curated' && config.background.url && (
              <img
                src={config.background.url}
                alt="خلفية قرآنية"
                className="w-full h-full object-cover"
                style={{
                  filter: `blur(${config.blurBackdrop}px)`
                }}
              />
            )}

            {config.background.type === 'custom-image' && config.customMediaUrl && (
              <img
                src={config.customMediaUrl}
                alt="خلفية مخصصة"
                className="w-full h-full object-cover"
                style={{
                  filter: `blur(${config.blurBackdrop}px)`
                }}
              />
            )}

            {config.background.type === 'custom-video' && config.customMediaUrl && (
              <video
                src={config.customMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{
                  filter: `blur(${config.blurBackdrop}px)`
                }}
              />
            )}

            {config.background.type === 'ambient-canvas' && config.background.canvasType && (
              <AmbientCanvas type={config.background.canvasType} />
            )}

            {/* Dark contrast overlay */}
            <div
              className="absolute inset-0 bg-slate-950 transition-opacity duration-200"
              style={{
                opacity: config.darkOverlayOpacity
              }}
            />

            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
          </div>

          {/* LAYER 2: Decorative Islamic Frame Overlays */}
          {config.frameStyle === 'islamic-gold' && (
            <div className="absolute inset-3 border-2 border-amber-400/50 rounded-2xl pointer-events-none z-10 flex flex-col justify-between p-2">
              <div className="w-full flex justify-between items-center text-amber-400/80 text-xs">
                <span>❖</span>
                <span className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                <span>❖</span>
              </div>
              <div className="w-full flex justify-between items-center text-amber-400/80 text-xs">
                <span>❖</span>
                <span className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                <span>❖</span>
              </div>
            </div>
          )}

          {config.frameStyle === 'sacred-arch' && (
            <div className="absolute inset-4 border border-amber-300/30 rounded-t-[5rem] rounded-b-xl pointer-events-none z-10" />
          )}

          {config.frameStyle === 'ornate-corners' && (
            <div className="absolute inset-3 pointer-events-none z-10">
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-400/70" />
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-400/70" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-400/70" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-400/70" />
            </div>
          )}

          {config.frameStyle === 'minimal-modern' && (
            <div className="absolute inset-4 border border-white/20 rounded-2xl pointer-events-none z-10 shadow-inner" />
          )}

          {/* LAYER 3: Quranic Content Layout */}
          <div className="relative z-20 flex-1 flex flex-col justify-between p-6 sm:p-8">
            {/* TOP BAR: Surah Badge & Basmala */}
            <div className="text-center space-y-3">
              {/* Surah Header Pill with Arabic Calligraphy style */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-lg mx-auto">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide">
                  {surah?.name || 'سورة الفاتحة'}
                </span>
                <span className="text-[11px] text-amber-200/80 border-r border-white/20 pr-2">
                  {surah?.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                </span>
              </div>

              {/* Basmala (hidden in Surah 9 At-Tawbah) */}
              {config.showBasmala && surah?.number !== 9 && (
                <div
                  className="font-amiri text-lg sm:text-xl text-amber-200/95 tracking-wide drop-shadow-md select-none"
                  style={{
                    textShadow: config.textDropShadow ? '0 2px 8px rgba(0,0,0,0.8)' : undefined
                  }}
                >
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
              )}
            </div>

            {/* MIDDLE: The Quran Verses */}
            <div className="my-auto py-4 overflow-y-auto max-h-[60vh] scrollbar-none text-center">
              <div
                className={`transition-all duration-300 text-white ${selectedFont.className}`}
                style={{
                  fontSize: `${config.fontSize}px`,
                  lineHeight: config.lineHeight,
                  textShadow: config.textDropShadow
                    ? '0 3px 12px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.95)'
                    : config.textGlow
                    ? '0 0 20px rgba(251, 191, 36, 0.4)'
                    : undefined
                }}
              >
                {ayahs.map((ayah) => {
                  const isActive = currentAyahNumberInSurah === ayah.numberInSurah;
                  return (
                    <span
                      key={ayah.number}
                      className={`inline transition-all duration-300 rounded-lg px-1 py-0.5 mx-0.5 ${
                        isActive
                          ? 'bg-amber-400/25 text-amber-200 ayah-active-glow shadow-sm'
                          : ''
                      }`}
                    >
                      {ayah.text}{' '}
                      <span className="inline-block mx-1 font-amiri text-amber-400/90 text-[0.85em] align-middle select-none">
                        ﴿{ayah.numberInSurah}﴾
                      </span>
                    </span>
                  );
                })}
              </div>

              {/* Translation (if enabled) */}
              {config.showTranslation && (
                <div className="mt-4 pt-3 border-t border-white/10 text-center max-w-xl mx-auto space-y-1.5">
                  {ayahs.map((ayah) => (
                    <div
                      key={`trans-${ayah.number}`}
                      className={`text-xs sm:text-sm text-slate-200/90 font-sans leading-relaxed transition-opacity ${
                        currentAyahNumberInSurah === ayah.numberInSurah
                          ? 'text-amber-200 font-medium'
                          : 'opacity-80'
                      }`}
                      dir={config.translationLang === 'ur.jalandhry' ? 'rtl' : 'ltr'}
                    >
                      {ayah.translation}
                    </div>
                  ))}
                </div>
              )}

              {/* Tafseer (if enabled) */}
              {config.showTafseer && (
                <div className="mt-3 p-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-right max-w-lg mx-auto">
                  <span className="block text-[11px] font-semibold text-amber-300 mb-1">
                    التفسير الميسر:
                  </span>
                  {ayahs.map((ayah) => (
                    <p key={`taf-${ayah.number}`} className="text-[11px] text-slate-300 leading-normal mb-1">
                      <span className="text-amber-400/80 font-bold ml-1">﴿{ayah.numberInSurah}﴾</span>
                      {ayah.tafseer}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* BOTTOM: Branding / Watermark */}
            {config.watermark.enabled && (
              <div
                className={`flex items-center gap-2 text-xs text-white/90 font-medium pt-2 ${
                  config.watermark.position === 'bottom-center'
                    ? 'justify-center mx-auto'
                    : config.watermark.position === 'bottom-right'
                    ? 'justify-start'
                    : config.watermark.position === 'bottom-left'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/10 shadow-md">
                  {renderWatermarkIcon()}
                  <span className="font-mono text-[11px] tracking-tight" dir="ltr">
                    {config.watermark.text || '@quran_daily'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CanvasPreview.displayName = 'CanvasPreview';
