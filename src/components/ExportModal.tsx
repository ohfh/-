import React, { useState } from 'react';
import { Ayah, StudioConfig, Surah } from '../types/quran';
import { exportAsImage, downloadDataUrl, generateSrtContent, downloadSrt, shareContent } from '../services/exportService';
import {
  X,
  Download,
  FileText,
  Share2,
  Copy,
  Check,
  Video,
  Sparkles,
  Loader2,
  Film
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardElement: HTMLElement | null;
  surah: Surah | undefined;
  ayahs: Ayah[];
  config: StudioConfig;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  cardElement,
  surah,
  ayahs,
  config
}) => {
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [copiedText, setCopiedText] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const surahTitle = surah?.name || 'سورة';
  const timestamp = Date.now();

  const handleExportPng = async () => {
    if (!cardElement) return;
    try {
      setIsExportingImage(true);
      setStatusMessage('جاري معالجة الصورة بدقة فائقة...');
      const dataUrl = await exportAsImage(cardElement, 'png', 1.0);
      downloadDataUrl(dataUrl, `quran-studio-${surah?.number || 1}-${timestamp}.png`);
      setStatusMessage('تم تحميل الصورة بنجاح!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage('حدث خطأ أثناء تصدير الصورة');
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleExportSrt = () => {
    try {
      const srt = generateSrtContent(ayahs, ayahs.length * 5, surahTitle);
      downloadSrt(srt, `subtitles-${surah?.number || 1}-${timestamp}.srt`);
      setStatusMessage('تم تنزيل ملف الترجمة SRT للاستخدام في برامج المونتاج!');
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error(err);
      setStatusMessage('تعذر إنشاء ملف الترجمة');
    }
  };

  const handleCopyText = async () => {
    const textToCopy = [
      surahTitle,
      config.showBasmala && surah?.number !== 9 ? 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\n' : '',
      ayahs.map((a) => `${a.text} ﴿${a.numberInSurah}﴾`).join(' '),
      config.showTranslation ? '\n\nالترجمة:\n' + ayahs.map((a) => a.translation).join('\n') : '',
      config.watermark.enabled ? `\n\n${config.watermark.text}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
      setStatusMessage('تم نسخ النص القرآني بالكامل إلى الحافظة!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNativeShare = async () => {
    const shareText = `${surahTitle}\n${ayahs.map((a) => a.text).join(' ')}`;
    await shareContent({
      title: surahTitle,
      text: shareText
    });
  };

  // Record preview card as WebM Video
  const handleExportVideo = async () => {
    if (!cardElement) return;

    try {
      setIsRecordingVideo(true);
      setVideoProgress(10);
      setStatusMessage('جاري تسجيل إطارات الفيديو والمؤثرات...');

      // First snap a high-res base frame
      const dataUrl = await exportAsImage(cardElement, 'png', 1.0);
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      setVideoProgress(30);

      // Create offscreen recording canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('فشل تهيئة الكانفاس');

      const stream = canvas.captureStream(30);
      const recordedChunks: Blob[] = [];

      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(blob);
        downloadDataUrl(videoUrl, `quran-video-${surah?.number || 1}-${timestamp}.webm`);
        setIsRecordingVideo(false);
        setVideoProgress(100);
        setStatusMessage('تم تصدير مقطع الفيديو بنجاح!');
        setTimeout(() => setStatusMessage(null), 4000);
      };

      recorder.start();

      // Render 5 seconds of subtle camera drift zoom
      const durationMs = 5000;
      const startTime = performance.now();

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const p = Math.min(1, elapsed / durationMs);
        setVideoProgress(30 + Math.floor(p * 60));

        const scale = 1.0 + p * 0.04;
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();

        if (p < 1) {
          requestAnimationFrame(animate);
        } else {
          recorder.stop();
        }
      };

      requestAnimationFrame(animate);
    } catch (err) {
      console.error(err);
      setIsRecordingVideo(false);
      setStatusMessage('حدث خطأ أثناء تصدير الفيديو');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700/80 p-6 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">تصدير ومشاركة الوسائط</h3>
              <p className="text-xs text-slate-400">
                {surahTitle} · {config.aspectRatio}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status notification banner */}
        {statusMessage && (
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 text-center animate-fade-in">
            {statusMessage}
          </div>
        )}

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Export PNG */}
          <button
            type="button"
            onClick={handleExportPng}
            disabled={isExportingImage || isRecordingVideo}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 hover:bg-slate-800/80 transition-all text-center group cursor-pointer disabled:opacity-50"
          >
            {isExportingImage ? (
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin mb-2" />
            ) : (
              <Download className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform mb-2" />
            )}
            <span className="text-xs font-bold text-white">صورة عالية الدقة PNG</span>
            <span className="text-[10px] text-slate-400 mt-0.5">جاهزة للنشر الفوري</span>
          </button>

          {/* Export Video */}
          <button
            type="button"
            onClick={handleExportVideo}
            disabled={isExportingImage || isRecordingVideo}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 hover:bg-slate-800/80 transition-all text-center group cursor-pointer disabled:opacity-50"
          >
            {isRecordingVideo ? (
              <div className="flex flex-col items-center mb-2">
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                <span className="text-[10px] text-amber-300 font-mono mt-1">{videoProgress}%</span>
              </div>
            ) : (
              <Film className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform mb-2" />
            )}
            <span className="text-xs font-bold text-white">مقطع فيديو متحرك</span>
            <span className="text-[10px] text-slate-400 mt-0.5">ستوري وتيك توك WebM</span>
          </button>

          {/* Export SRT */}
          <button
            type="button"
            onClick={handleExportSrt}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 hover:bg-slate-800/80 transition-all text-center group cursor-pointer"
          >
            <FileText className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-bold text-white">ملف ترجمة Subtitles (.SRT)</span>
            <span className="text-[10px] text-slate-400 mt-0.5">لـ CapCut و Premiere</span>
          </button>

          {/* Copy Full Text */}
          <button
            type="button"
            onClick={handleCopyText}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 hover:bg-slate-800/80 transition-all text-center group cursor-pointer"
          >
            {copiedText ? (
              <Check className="w-6 h-6 text-emerald-400 mb-2" />
            ) : (
              <Copy className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform mb-2" />
            )}
            <span className="text-xs font-bold text-white">
              {copiedText ? 'تم النسخ!' : 'نسخ النص بالرسم العثماني'}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">مع أرقام الآيات والتفسير</span>
          </button>
        </div>

        {/* Native Web Share Button */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>مشاركة مباشرة عبر التطبيقات (واتساب، إنستغرام)</span>
        </button>
      </div>
    </div>
  );
};
