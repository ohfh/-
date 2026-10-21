import { toPng, toJpeg } from 'html-to-image';
import { Ayah } from '../types/quran';

export async function exportAsImage(
  element: HTMLElement,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 0.95
): Promise<string> {
  const options = {
    quality,
    pixelRatio: 2, // High resolution for crisp Arabic calligraphy
    cacheBust: true,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left'
    }
  };

  if (format === 'jpeg') {
    return await toJpeg(element, options);
  }
  return await toPng(element, options);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Convert Ayahs list to SubRip Subtitle (.SRT) format
export function generateSrtContent(
  ayahs: Ayah[],
  totalDurationSeconds: number = 30,
  surahName: string = ''
): string {
  if (!ayahs || ayahs.length === 0) return '';

  const ayahCount = ayahs.length;
  const timePerAyah = Math.max(3, totalDurationSeconds / ayahCount);

  let srt = '';

  ayahs.forEach((ayah, index) => {
    const startTime = index * timePerAyah;
    const endTime = (index + 1) * timePerAyah;

    const startFormatted = formatSrtTimestamp(startTime);
    const endFormatted = formatSrtTimestamp(endTime);

    srt += `${index + 1}\n`;
    srt += `${startFormatted} --> ${endFormatted}\n`;
    srt += `${ayah.text}\n`;
    if (ayah.translation) {
      srt += `(${ayah.translation})\n`;
    }
    srt += `\n`;
  });

  return srt;
}

function formatSrtTimestamp(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);

  const pad = (n: number, z = 2) => ('00' + n).slice(-z);
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)},${pad(millis, 3)}`;
}

export function downloadSrt(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, filename);
  URL.revokeObjectURL(url);
}

// Native Web Share API
export async function shareContent(data: {
  title: string;
  text: string;
  url?: string;
  files?: File[];
}) {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.warn('خطأ أثناء المشاركة:', e);
      }
      return false;
    }
  }
  return false;
}
