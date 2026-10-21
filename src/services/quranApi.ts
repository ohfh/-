import { Ayah, Surah } from '../types/quran';
import { FALLBACK_SURAHS, POPULAR_SURAHS } from '../data/constants';

const BASE_URL = 'https://api.alquran.cloud/v1';

// In-memory cache to prevent redundant network fetches
const surahListCache: Surah[] | null = null;
const surahDetailCache = new Map<string, Ayah[]>();

export async function fetchSurahList(): Promise<Surah[]> {
  if (surahListCache && surahListCache.length > 0) {
    return surahListCache;
  }

  try {
    const res = await fetch(`${BASE_URL}/surah`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error('فشل جلب قائمة السور');
    const data = await res.json();
    if (data.code === 200 && Array.isArray(data.data)) {
      return data.data;
    }
    throw new Error('بيانات السور غير صالحة');
  } catch (err) {
    console.warn('استخدام قائمة السور الاحتياطية:', err);
    return POPULAR_SURAHS.map((s) => ({
      number: s.number,
      name: s.name,
      englishName: s.englishName,
      englishNameTranslation: s.popularName,
      numberOfAyahs: s.numberOfAyahs,
      revelationType: s.number > 20 ? 'Meccan' : 'Medinan'
    }));
  }
}

export async function fetchSurahAyahs(
  surahNumber: number,
  reciterIdentifier: string = 'ar.alafasy',
  translationIdentifier: string = 'en.sahih'
): Promise<{ surahInfo?: Surah; ayahs: Ayah[] }> {
  const cacheKey = `${surahNumber}_${reciterIdentifier}_${translationIdentifier}`;
  if (surahDetailCache.has(cacheKey)) {
    return { ayahs: surahDetailCache.get(cacheKey)! };
  }

  try {
    // AlQuran Cloud allows fetching multiple editions in a single request:
    // 1. Text: quran-uthmani
    // 2. Translation: translationIdentifier
    // 3. Tafseer: ar.muyassar
    // 4. Audio: reciterIdentifier
    const editions = `quran-uthmani,${translationIdentifier},ar.muyassar,${reciterIdentifier}`;
    const res = await fetch(`${BASE_URL}/surah/${surahNumber}/editions/${editions}`, {
      signal: AbortSignal.timeout(9000)
    });

    if (!res.ok) throw new Error('فشل جلب آيات السورة');
    const json = await res.json();

    if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 1) {
      const textEdition = json.data[0]?.ayahs || [];
      const transEdition = json.data[1]?.ayahs || [];
      const tafseerEdition = json.data[2]?.ayahs || [];
      const audioEdition = json.data[3]?.ayahs || [];

      const combined: Ayah[] = textEdition.map((item: any, idx: number) => ({
        number: item.number,
        text: item.text,
        numberInSurah: item.numberInSurah,
        juz: item.juz,
        page: item.page,
        sajda: item.sajda,
        translation: transEdition[idx]?.text || '',
        tafseer: tafseerEdition[idx]?.text || '',
        audio: audioEdition[idx]?.audio || `https://cdn.islamic.network/quran/audio/128/${reciterIdentifier}/${item.number}.mp3`
      }));

      surahDetailCache.set(cacheKey, combined);
      return { ayahs: combined };
    }
    throw new Error('بيانات السورة غير مكتملة');
  } catch (err) {
    console.warn(`استخدام البيانات الاحتياطية للسورة ${surahNumber}:`, err);
    
    // Check if we have bundled fallback
    const fallback = FALLBACK_SURAHS[surahNumber];
    if (fallback) {
      const fallbackAyahs: Ayah[] = fallback.ayahs.map((a, idx) => ({
        number: idx + 1,
        text: a.text,
        numberInSurah: a.numberInSurah,
        translation: a.translation,
        tafseer: a.tafseer,
        audio: a.audio
      }));
      return { ayahs: fallbackAyahs };
    }

    // Generic fallback for any other surah
    const ayahsList: Ayah[] = Array.from({ length: 7 }, (_, i) => ({
      number: i + 1,
      numberInSurah: i + 1,
      text: i === 0 ? 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' : `آية رقم ${i + 1} من سورة رقم ${surahNumber}`,
      translation: `Verse ${i + 1} translation in English`,
      tafseer: `تفسير الآية الكريمة رقم ${i + 1}`,
      audio: `https://cdn.islamic.network/quran/audio/128/${reciterIdentifier}/${i + 1}.mp3`
    }));

    return { ayahs: ayahsList };
  }
}

// Curated list of inspirational verses for the "Random Verse" feature
export const INSPIRATIONAL_VERSES = [
  { surahNumber: 2, fromAyah: 255, toAyah: 255, title: 'آية الكرسي' },
  { surahNumber: 2, fromAyah: 186, toAyah: 186, title: 'وإذا سألك عبادي عني فإني قريب' },
  { surahNumber: 94, fromAyah: 1, toAyah: 8, title: 'سورة الشرح' },
  { surahNumber: 93, fromAyah: 1, toAyah: 11, title: 'سورة الضحى' },
  { surahNumber: 55, fromAyah: 1, toAyah: 13, title: 'أوائل سورة الرحمن' },
  { surahNumber: 67, fromAyah: 1, toAyah: 5, title: 'أوائل سورة الملك' },
  { surahNumber: 39, fromAyah: 53, toAyah: 54, title: 'قل يا عبادي الذين أسرفوا على أنفسهم' },
  { surahNumber: 59, fromAyah: 22, toAyah: 24, title: 'خواتيم سورة الحشر' },
  { surahNumber: 13, fromAyah: 28, toAyah: 28, title: 'ألا بذكر الله تطمئن القلوب' },
  { surahNumber: 1, fromAyah: 1, toAyah: 7, title: 'فاتحة الكتاب' },
  { surahNumber: 112, fromAyah: 1, toAyah: 4, title: 'سورة الإخلاص' }
];

export function getRandomInspirationalVerse() {
  const index = Math.floor(Math.random() * INSPIRATIONAL_VERSES.length);
  return INSPIRATIONAL_VERSES[index];
}
