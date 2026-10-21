export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan' | string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz?: number;
  manzil?: number;
  page?: number;
  ruku?: number;
  hizbQuarter?: number;
  sajda?: boolean | object;
  translation?: string;
  tafseer?: string;
  audio?: string;
}

export interface Reciter {
  id: string;
  nameAr: string;
  nameEn: string;
  identifier: string; // e.g. 'ar.alafasy'
  style: string;
}

export type AspectRatio = '9:16' | '1:1' | '16:9';

export type QuranFont = 
  | 'Amiri'
  | 'Amiri Quran'
  | 'Noto Naskh Arabic'
  | 'Scheherazade New'
  | 'Reem Kufi'
  | 'Cairo';

export type FrameStyle = 
  | 'none'
  | 'islamic-gold'
  | 'sacred-arch'
  | 'ornate-corners'
  | 'minimal-modern';

export type BackgroundType = 'curated' | 'ambient-canvas' | 'color' | 'custom-image' | 'custom-video';

export type AmbientSoundType = 'none' | 'rain' | 'breeze' | 'water' | 'makkah';

export interface BackgroundOption {
  id: string;
  nameAr: string;
  type: BackgroundType;
  url?: string;
  canvasType?: 'stars' | 'gold-dust' | 'clouds';
  thumbnailUrl?: string;
}

export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  platform: 'instagram' | 'tiktok' | 'twitter' | 'youtube' | 'whatsapp' | 'telegram';
  position: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export interface StudioConfig {
  aspectRatio: AspectRatio;
  font: QuranFont;
  fontSize: number; // e.g. 24
  lineHeight: number; // e.g. 1.8
  textDropShadow: boolean;
  textGlow: boolean;
  textColor: string;
  showBasmala: boolean;
  showTranslation: boolean;
  translationLang: string;
  showTafseer: boolean;
  background: BackgroundOption;
  customMediaUrl?: string;
  customMediaType?: 'image' | 'video';
  darkOverlayOpacity: number; // 0.0 to 0.95
  blurBackdrop: number; // 0 to 20
  frameStyle: FrameStyle;
  themeColor: 'emerald' | 'gold' | 'slate' | 'indigo' | 'burgundy';
  watermark: WatermarkConfig;
  kineticHighlight: boolean;
  ambientSound: AmbientSoundType;
  ambientVolume: number; // 0 to 1
}
