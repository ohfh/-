import React from 'react';
import { Sparkles, Download, Volume2, BookOpen, Share2 } from 'lucide-react';

interface StudioHeaderProps {
  onRandomVerse: () => void;
  onOpenExport: () => void;
  onQuickShare: () => void;
  activeReciterName: string;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  onRandomVerse,
  onOpenExport,
  onQuickShare,
  activeReciterName
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/15 border border-amber-300/30">
            <span className="font-amiri text-lg font-bold text-slate-950 select-none">ق</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            استوديو الوسائط القرآنية
          </span>
        </div>

        {/* Zone 2: Clean action text links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={onRandomVerse}
            className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>آية مقترحة</span>
          </button>

          <button
            onClick={onQuickShare}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors whitespace-nowrap"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            <span>مشاركة سريعة</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
            <Volume2 className="w-3.5 h-3.5 text-amber-500" />
            <span>القارئ: {activeReciterName}</span>
          </div>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تصدير التصميم</span>
          </button>
        </div>
      </div>
    </header>
  );
};
