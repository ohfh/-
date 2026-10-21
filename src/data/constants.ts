import { BackgroundOption, QuranFont, Reciter } from '../types/quran';

// High-fidelity generated image assets
import bgMosque from '../assets/images/bg_mosque_arches_1792591442921.jpg';
import bgMountains from '../assets/images/bg_misty_mountains_1792591444728.jpg';
import bgDesert from '../assets/images/bg_desert_night_stars_1792591445146.jpg';
import bgKaaba from '../assets/images/bg_kaaba_spiritual_1792591445232.jpg';

export const RECITERS: Reciter[] = [
  {
    id: 'alafasy',
    nameAr: 'مشاري راشد العفاسي',
    nameEn: 'Mishary Rashid Alafasy',
    identifier: 'ar.alafasy',
    style: 'مرتل مفعم بالخشوع'
  },
  {
    id: 'abdulbaset',
    nameAr: 'عبد الباسط عبد الصمد',
    nameEn: 'AbdulBaset AbdulSamad',
    identifier: 'ar.abdulbasitmurattal',
    style: 'ترتيل كلاسيكي مجوّد'
  },
  {
    id: 'husary',
    nameAr: 'محمود خليل الحصري',
    nameEn: 'Mahmoud Khalil Al-Husary',
    identifier: 'ar.husary',
    style: 'معلم متقن الأحكام'
  },
  {
    id: 'minshawi',
    nameAr: 'محمد صديق المنشاوي',
    nameEn: 'Mohamed Siddiq El-Minshawi',
    identifier: 'ar.minshawi',
    style: 'تلاوة باكية خاشعة'
  },
  {
    id: 'muaiqly',
    nameAr: 'ماهر المعيقلي',
    nameEn: 'Maher Al-Muaiqly',
    identifier: 'ar.mahermuaiqly',
    style: 'إمام الحرم المكي'
  },
  {
    id: 'shuraim',
    nameAr: 'سعود الشريم',
    nameEn: 'Saud Al-Shuraim',
    identifier: 'ar.saoodshuraym',
    style: 'ترتيل نديّ شجي'
  },
  {
    id: 'hudhaify',
    nameAr: 'علي بن عبد الرحمن الحذيفي',
    nameEn: 'Ali Al-Hudhaify',
    identifier: 'ar.hudhaify',
    style: 'إمام المسجد النبوي'
  }
];

export const FONTS_LIST: { id: QuranFont; nameAr: string; className: string; sample: string }[] = [
  { id: 'Amiri', nameAr: 'خط الأميري الأصيل', className: 'font-amiri', sample: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
  { id: 'Amiri Quran', nameAr: 'خط المصحف (الرسم العثماني)', className: 'font-amiri-quran', sample: 'ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ' },
  { id: 'Noto Naskh Arabic', nameAr: 'خط النسخ الحديث', className: 'font-noto', sample: 'الرَّحْمَٰنِ الرَّحِيمِ' },
  { id: 'Scheherazade New', nameAr: 'خط شهرزاد الكلاسيكي', className: 'font-scheherazade', sample: 'مَالِكِ يَوْمِ الدِّينِ' },
  { id: 'Reem Kufi', nameAr: 'الخط الكوفي الحديث', className: 'font-reem', sample: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
  { id: 'Cairo', nameAr: 'خط القاهرة المعاصر', className: 'font-cairo', sample: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ' }
];

export const BACKGROUNDS: BackgroundOption[] = [
  {
    id: 'mosque_arches',
    nameAr: 'أقواس المسجد والأنوار',
    type: 'curated',
    url: bgMosque,
    thumbnailUrl: bgMosque
  },
  {
    id: 'kaaba_spiritual',
    nameAr: 'الكعبة المشرفة وفجر مكة',
    type: 'curated',
    url: bgKaaba,
    thumbnailUrl: bgKaaba
  },
  {
    id: 'desert_stars',
    nameAr: 'رمال الصحراء ومجرة النجوم',
    type: 'curated',
    url: bgDesert,
    thumbnailUrl: bgDesert
  },
  {
    id: 'misty_mountains',
    nameAr: 'قمم الجبال وأشعة الفجر',
    type: 'curated',
    url: bgMountains,
    thumbnailUrl: bgMountains
  },
  {
    id: 'ambient_stars',
    nameAr: 'فضاء النجوم المتحركة',
    type: 'ambient-canvas',
    canvasType: 'stars'
  },
  {
    id: 'ambient_gold_dust',
    nameAr: 'بريق الذهب المنساب',
    type: 'ambient-canvas',
    canvasType: 'gold-dust'
  },
  {
    id: 'ambient_clouds',
    nameAr: 'سحاب هادئ وأضواء سماوية',
    type: 'ambient-canvas',
    canvasType: 'clouds'
  }
];

export const TRANSLATION_LANGUAGES = [
  { code: 'en', id: 'en.sahih', name: 'English (Sahih International)', dir: 'ltr' },
  { code: 'fr', id: 'fr.hamidullah', name: 'Français (Hamidullah)', dir: 'ltr' },
  { code: 'ur', id: 'ur.jalandhry', name: 'اردو (Jalandhry)', dir: 'rtl' },
  { code: 'id', id: 'id.indonesian', name: 'Bahasa Indonesia', dir: 'ltr' },
  { code: 'es', id: 'es.cortes', name: 'Español (Julio Cortés)', dir: 'ltr' },
  { code: 'tr', id: 'tr.diyanet', name: 'Türkçe (Diyanet İşleri)', dir: 'ltr' }
];

// Offline backup data for guaranteed stability
export const POPULAR_SURAHS = [
  { number: 1, name: 'سُورَةُ ٱلْفَاتِحَةِ', englishName: 'Al-Faatiha', numberOfAyahs: 7, popularName: 'الفاتحة' },
  { number: 2, name: 'سُورَةُ البَقَرَةِ', englishName: 'Al-Baqara', numberOfAyahs: 286, popularName: 'البقرة (آية الكرسي)' },
  { number: 18, name: 'سُورَةُ الكَهۡفِ', englishName: 'Al-Kahf', numberOfAyahs: 110, popularName: 'الكهف' },
  { number: 36, name: 'سُورَةُ يسٓ', englishName: 'Yaseen', numberOfAyahs: 83, popularName: 'يس' },
  { number: 55, name: 'سُورَةُ الرَّحۡمَٰن', englishName: 'Ar-Rahmaan', numberOfAyahs: 78, popularName: 'الرحمن' },
  { number: 67, name: 'سُورَةُ المُلۡكِ', englishName: 'Al-Mulk', numberOfAyahs: 30, popularName: 'الملك' },
  { number: 112, name: 'سُورَةُ الإِخۡلَاصِ', englishName: 'Al-Ikhlaas', numberOfAyahs: 4, popularName: 'الإخلاص' },
  { number: 113, name: 'سُورَةُ الفَلَقِ', englishName: 'Al-Falaq', numberOfAyahs: 5, popularName: 'الفلق' },
  { number: 114, name: 'سُورَةُ النَّاسِ', englishName: 'An-Naas', numberOfAyahs: 6, popularName: 'الناس' }
];

export const FALLBACK_SURAHS: Record<number, {
  name: string;
  englishName: string;
  numberOfAyahs: number;
  ayahs: Array<{
    numberInSurah: number;
    text: string;
    translation: string;
    tafseer: string;
    audio: string;
  }>;
}> = {
  1: {
    name: 'سُورَةُ ٱلْفَاتِحَةِ',
    englishName: 'Al-Faatiha',
    numberOfAyahs: 7,
    ayahs: [
      {
        numberInSurah: 1,
        text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        tafseer: 'أبدأ قراءتي باسم الله مستعيناً به، والله هو الإله المعبود بحق، المستحق للعبادة دون سواه.',
        audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3'
      },
      {
        numberInSurah: 2,
        text: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
        translation: '[All] praise is [due] to Allah, Lord of the worlds -',
        tafseer: 'الثناء الكامل لله تعالى لصفاته وكماله ولإنعامه على خلقه، وهو رب الخلق ومربيهم بنعمه.',
        audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3'
      },
      {
        numberInSurah: 3,
        text: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        translation: 'The Entirely Merciful, the Especially Merciful,',
        tafseer: 'ذو الرحمة الواسعة لجميع خلقه، والرحمة الخاصة بالمؤمنين.',
        audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3'
      },
      {
        numberInSurah: 4,
        text: 'مَٰلِكِ يَوْمِ ٱلدِّينِ',
        translation: 'Sovereign of the Day of Recompense.',
        tafseer: 'مالك يوم الحساب والجزاء وهو يوم القيامة وحده لا شريك له.',
        audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3'
      },
      {
        numberInSurah: 5,
        text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        translation: 'It is You we worship and You we ask for help.',
        tafseer: 'نخصك وحدك بالعبادة، ونطلب منك وحدك العون في جميع أمورنا.',
        audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3'
      },
      {
        numberInSurah: 6,
        text: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
        translation: 'Guide us to the straight path -',
        tafseer: 'دلنا وأرشدنا ووفقنا وثبتنا على الطريق الواضح الموصل إلى رضاك وجنتك.',
        audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3'
      },
      {
        numberInSurah: 7,
        text: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
        translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
        tafseer: 'طريق النبيين والصدّيقين والشهداء والصالحين، غير طريق اليهود المغضوب عليهم ولا النصارى الضالين.',
        audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3'
      }
    ]
  },
  112: {
    name: 'سُورَةُ الإِخۡلَاصِ',
    englishName: 'Al-Ikhlaas',
    numberOfAyahs: 4,
    ayahs: [
      {
        numberInSurah: 1,
        text: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
        translation: 'Say, "He is Allah, [who is] One,',
        tafseer: 'قل أيها الرسول: الله هو المنفرد بالألوهية والربوبية والأسماء والصفات، لا شريك له.',
        audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6221.mp3'
      },
      {
        numberInSurah: 2,
        text: 'ٱللَّهُ ٱلصَّمَدُ',
        translation: 'Allah, the Eternal Refuge.',
        tafseer: 'الله السيد الذي تصمد إليه الخلائق وتقصده في حوائجها ورغائبها.',
        audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3'
      },
      {
        numberInSurah: 3,
        text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        translation: 'He neither begets nor is born,',
        tafseer: 'تنزه سبحانه عن أن يكون له ولد أو والد أو صاحبة.',
        audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3'
      },
      {
        numberInSurah: 4,
        text: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
        translation: 'Nor is there to Him any equivalent."',
        tafseer: 'وليس له مماثل ولا نظير في ذاته ولا في أسمائه ولا في صفاته ولا في أفعاله.',
        audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6224.mp3'
      }
    ]
  }
};
