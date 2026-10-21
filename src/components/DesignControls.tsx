import React, { useRef, useState } from 'react';
import { StudioConfig, AspectRatio, QuranFont, FrameStyle, AmbientSoundType } from '../types/quran';
import { BACKGROUNDS, FONTS_LIST, RECITERS } from '../data/constants';
import {
  Type,
  Image as ImageIcon,
  Sliders,
  Volume2,
  AtSign,
  Palette,
  Upload,
  Sparkles,
  Smartphone,
  Square,
  Monitor,
  Check,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';

interface DesignControlsProps {
  config: StudioConfig;
  onUpdateConfig: (partial: Partial<StudioConfig>) => void;
  selectedReciterId: string;
  onSelectReciter: (id: string) => void;
}

type TabType = 'format' | 'typography' | 'background' | 'frames' | 'audio' | 'branding';

export const DesignControls: React.FC<DesignControlsProps> = ({
  config,
  onUpdateConfig,
  selectedReciterId,
  onSelectReciter
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('format');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const url = URL.createObjectURL(file);

    onUpdateConfig({
      customMediaUrl: url,
      customMediaType: isVideo ? 'video' : 'image',
      background: {
        id: 'custom',
        nameAr: isVideo ? 'فيديو مخصص' : 'صورة مخصصة',
        type: isVideo ? 'custom-video' : 'custom-image',
        url
      }
    });
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col">
      {/* Tab Bar */}
      <div className="flex items-center overflow-x-auto p-1.5 bg-slate-900/80 border-b border-slate-800 gap-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('format')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'format' ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>الأبعاد</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'typography' ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>الخطوط</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('background')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'background' ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>الخلفيات</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('frames')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'frames' ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>الإطارات</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audio')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'audio' ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>الصوتيات</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'branding' ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <AtSign className="w-3.5 h-3.5" />
          <span>الحقوق</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-4">
        {/* TAB 1: Aspect Ratio */}
        {activeTab === 'format' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">أبعاد التصميم والمنصات</label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* 9:16 */}
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ aspectRatio: '9:16' })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    config.aspectRatio === '9:16'
                      ? 'border-amber-500 bg-amber-500/15 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Smartphone className="w-6 h-6 text-amber-400" />
                  <div className="text-xs font-semibold">9:16 ستوري</div>
                  <div className="text-[10px] text-slate-400">Reels / TikTok</div>
                </button>

                {/* 1:1 */}
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ aspectRatio: '1:1' })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    config.aspectRatio === '1:1'
                      ? 'border-amber-500 bg-amber-500/15 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Square className="w-6 h-6 text-amber-400" />
                  <div className="text-xs font-semibold">1:1 مربع</div>
                  <div className="text-[10px] text-slate-400">Instagram Post</div>
                </button>

                {/* 16:9 */}
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ aspectRatio: '16:9' })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    config.aspectRatio === '16:9'
                      ? 'border-amber-500 bg-amber-500/15 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Monitor className="w-6 h-6 text-amber-400" />
                  <div className="text-xs font-semibold">16:9 عريض</div>
                  <div className="text-[10px] text-slate-400">YouTube / Desktop</div>
                </button>
              </div>
            </div>

            {/* Quick Presets Notice */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
              💡 <span className="text-slate-200 font-medium">نصيحة الاستوديو:</span> نمط 9:16 هو الأمثل لإنشاء مقاطع ريلز وتيك توك مع تزامن صوتي حي وإمكانية التصدير كفيديو فوري.
            </div>
          </div>
        )}

        {/* TAB 2: Typography */}
        {activeTab === 'typography' && (
          <div className="space-y-4">
            {/* Font Picker */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">نوع الخط القرآني</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {FONTS_LIST.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => onUpdateConfig({ font: font.id })}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                      config.font === font.id
                        ? 'border-amber-500 bg-amber-500/15 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{font.nameAr}</div>
                      <div className={`text-base text-amber-300/90 mt-0.5 ${font.className}`}>
                        {font.sample}
                      </div>
                    </div>
                    {config.font === font.id && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>حجم خط الآيات</span>
                <span className="text-amber-400 tabular-nums font-semibold">{config.fontSize}px</span>
              </div>
              <input
                type="range"
                min={16}
                max={48}
                value={config.fontSize}
                onChange={(e) => onUpdateConfig({ fontSize: parseInt(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Line Height Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>تباعد الأسطر</span>
                <span className="text-amber-400 tabular-nums font-semibold">{config.lineHeight}</span>
              </div>
              <input
                type="range"
                min={1.4}
                max={2.6}
                step={0.1}
                value={config.lineHeight}
                onChange={(e) => onUpdateConfig({ lineHeight: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Visual Effects: Drop Shadow, Glow & Kinetic Typography */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">تظليل النص (Drop-Shadow) لزيادة الوضوح</span>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ textDropShadow: !config.textDropShadow })}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    config.textDropShadow ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      config.textDropShadow ? '-translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">إضاءة النص الذهبية (Text Glow)</span>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ textGlow: !config.textGlow })}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    config.textGlow ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      config.textGlow ? '-translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-300 font-medium">تحريك النص مع الصوت (Kinetic Glow)</span>
                  <span className="text-[10px] text-slate-400">إضاءة حية للآية المقروءة حالياً</span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ kineticHighlight: !config.kineticHighlight })}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    config.kineticHighlight ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      config.kineticHighlight ? '-translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Backgrounds */}
        {activeTab === 'background' && (
          <div className="space-y-4">
            {/* Curated Backgrounds Grid */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">مكتبة الخلفيات الروحية</label>
              <div className="grid grid-cols-2 gap-2">
                {BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => onUpdateConfig({ background: bg })}
                    className={`group relative h-20 rounded-xl overflow-hidden border text-right transition-all cursor-pointer ${
                      config.background.id === bg.id
                        ? 'border-amber-400 ring-2 ring-amber-400/30'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {bg.url ? (
                      <img
                        src={bg.url}
                        alt={bg.nameAr}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-amber-950/40 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-amber-400/60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-2">
                      <span className="text-[11px] font-medium text-white truncate">{bg.nameAr}</span>
                    </div>
                    {config.background.id === bg.id && (
                      <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Upload */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">رفع صورة أو فيديو من جهازك</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleCustomUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-dashed border-slate-700 hover:border-amber-500/60 bg-slate-900/60 text-xs text-slate-300 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>اختر صورة أو فيديو من الاستوديو</span>
              </button>
            </div>

            {/* Overlay Opacity Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>تعتيم الخلفية (Dark Overlay)</span>
                <span className="text-amber-400 tabular-nums font-semibold">
                  {Math.round(config.darkOverlayOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={0.95}
                step={0.05}
                value={config.darkOverlayOpacity}
                onChange={(e) => onUpdateConfig({ darkOverlayOpacity: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Blur Backdrop Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>ضبابية الخلفية (Backdrop Blur)</span>
                <span className="text-amber-400 tabular-nums font-semibold">{config.blurBackdrop}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={config.blurBackdrop}
                onChange={(e) => onUpdateConfig({ blurBackdrop: parseInt(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 4: Frames & Islamic Themes */}
        {activeTab === 'frames' && (
          <div className="space-y-4">
            {/* Islamic Frames */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">الإطار والزخرفة الإسلامية</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', label: 'بدون إطار' },
                  { id: 'islamic-gold', label: 'زخرفة ذهبية ملكية' },
                  { id: 'sacred-arch', label: 'محراب وقوس إسلامي' },
                  { id: 'ornate-corners', label: 'زوايا أرابيسك ناعمة' },
                  { id: 'minimal-modern', label: 'إطار عصري زجاجي' }
                ].map((fr) => (
                  <button
                    key={fr.id}
                    type="button"
                    onClick={() => onUpdateConfig({ frameStyle: fr.id as FrameStyle })}
                    className={`p-2.5 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                      config.frameStyle === fr.id
                        ? 'border-amber-400 bg-amber-500/15 text-white font-semibold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {fr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Colors */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">طابع الألوان العام</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'gold', label: 'ذهبي أصيل', color: 'bg-amber-500' },
                  { id: 'emerald', label: 'أخضر زمردي', color: 'bg-emerald-500' },
                  { id: 'slate', label: 'ليلي رمادي', color: 'bg-slate-600' },
                  { id: 'indigo', label: 'أزرق كحلي', color: 'bg-indigo-600' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onUpdateConfig({ themeColor: t.id as any })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                      config.themeColor === t.id
                        ? 'border-amber-400 bg-slate-800 text-white'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${t.color}`} />
                    <span className="text-[10px]">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Audio & Reciters */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            {/* Reciter Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">القارئ المرتل</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {RECITERS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onSelectReciter(r.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                      selectedReciterId === r.id
                        ? 'border-amber-400 bg-amber-500/15 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{r.nameAr}</div>
                      <div className="text-[10px] text-slate-400">{r.style}</div>
                    </div>
                    {selectedReciterId === r.id && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Ambient Sound Layering */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  مؤثرات صوتية بيئية (Ambient Layering)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'none', label: 'بدون مؤثر' },
                    { id: 'rain', label: 'صوت المطر' },
                    { id: 'breeze', label: 'نسيم الصحراء' },
                    { id: 'water', label: 'خرير الماء' },
                    { id: 'makkah', label: 'أجواء الحرم' }
                  ].map((amb) => (
                    <button
                      key={amb.id}
                      type="button"
                      onClick={() => onUpdateConfig({ ambientSound: amb.id as AmbientSoundType })}
                      className={`p-2 rounded-lg border text-center text-xs transition-all cursor-pointer ${
                        config.ambientSound === amb.id
                          ? 'border-amber-400 bg-amber-500/20 text-white font-medium'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {amb.label}
                    </button>
                  ))}
                </div>
              </div>

              {config.ambientSound !== 'none' && (
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>مستوى صوت المؤثر البيئي</span>
                    <span className="text-amber-400 tabular-nums">{Math.round(config.ambientVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={config.ambientVolume}
                    onChange={(e) => onUpdateConfig({ ambientVolume: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: Branding & Watermark */}
        {activeTab === 'branding' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-200">تفعيل العلامة المائية والحقوق</span>
                <span className="text-[10px] text-slate-400">إظهار اسم الحساب على التصميم</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdateConfig({
                    watermark: { ...config.watermark, enabled: !config.watermark.enabled }
                  })
                }
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  config.watermark.enabled ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    config.watermark.enabled ? '-translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            {config.watermark.enabled && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">اسم الحساب أو القناة</label>
                  <input
                    type="text"
                    value={config.watermark.text}
                    onChange={(e) =>
                      onUpdateConfig({
                        watermark: { ...config.watermark, text: e.target.value }
                      })
                    }
                    placeholder="@quran_daily"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-left text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">أيقونة المنصة</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'tiktok', label: 'تيك توك' },
                      { id: 'instagram', label: 'إنستغرام' },
                      { id: 'youtube', label: 'يوتيوب' },
                      { id: 'twitter', label: 'X (تويتر)' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          onUpdateConfig({
                            watermark: { ...config.watermark, platform: p.id as any }
                          })
                        }
                        className={`p-2 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                          config.watermark.platform === p.id
                            ? 'border-amber-400 bg-amber-500/15 text-white font-medium'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">موضع العلامة المائية</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'bottom-center', label: 'أسفل الوسط' },
                      { id: 'bottom-right', label: 'أسفل اليمين' },
                      { id: 'bottom-left', label: 'أسفل اليسار' },
                      { id: 'top-right', label: 'أعلى اليمين' }
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() =>
                          onUpdateConfig({
                            watermark: { ...config.watermark, position: pos.id as any }
                          })
                        }
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          config.watermark.position === pos.id
                            ? 'border-amber-400 bg-amber-500/15 text-white font-medium'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
