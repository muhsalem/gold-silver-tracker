/**
 * Islamic Monetary Chronology & Nisab Reference Engine
 * Complete historical and regional database for every Hijri year from 2 AH (Institution of Zakat) to 1448 AH (624 CE - 2026 CE).
 */

import { TROY_OUNCE_G } from "./nisab";

export type IslamicEra =
  | "prophetic"
  | "rashidun"
  | "umayyad"
  | "abbasid"
  | "fatimid_ayyoubid"
  | "mamluk"
  | "ottoman"
  | "early_modern"
  | "contemporary";

export type ChronologyMilestone = {
  id: string;
  hijriYear: number;
  gregorianYear: number;
  era: IslamicEra;
  eraNameAr: string;
  eraNameEn: string;
  titleAr: string;
  titleEn: string;
  goldDinarGrams: number; // 4.25 g standard
  silverDirhamGrams: number; // 2.975 g standard
  goldToSilverRatio: number; // e.g. 10.0 in prophetic era, now ~85-95
  goldNisabGrams: number; // 85 g
  silverNisabGrams: number; // 595 g
  goldUsdOzEquivalent: number;
  silverUsdOzEquivalent: number;
  purchasingPowerNoteAr: string;
  historicalContextAr: string;
  fiqhiVerdictAr: string;
};

// Key specific milestones recorded in classical history
export const SPECIFIC_YEAR_EVENTS: Record<
  number,
  {
    eventAr: string;
    rulerAr: string;
    fiqhNoteAr: string;
    ratio: number;
  }
> = {
  1: {
    eventAr: "الهجرة النبوية المباركة إلى المدينة المنورة وتأسيس أول مسجد وأول مجتمع للمسلمين.",
    rulerAr: "رسول الله محمد ﷺ",
    fiqhNoteAr:
      "إقرار الوزن المكي (المثقال 4.25 جم) والمكيال المدني (الصاع)، وتطابق نصابي الذهب والفضة (1 : 10).",
    ratio: 10.0,
  },
  2: {
    eventAr: "فرض زكاة الفطر وزكاة الأموال، وتحويل القبلة إلى الكعبة المشرفة، وغزوة بدر الكبرى.",
    rulerAr: "رسول الله محمد ﷺ",
    fiqhNoteAr:
      "نزول فرض الزكاة ربع العشر (2.5%) على الأثمان، وتحديد مقادير زكاة الفطر بصاع من طعام.",
    ratio: 10.0,
  },
  3: {
    eventAr: "غزوة أحد، واستقرار المجتمع المدني وتنظيم الصدقات وإعانة الأرامل واليتامى.",
    rulerAr: "رسول الله محمد ﷺ",
    fiqhNoteAr: "بيان أنصبة بهيمة الأنعام من الإبل والبقر والغنم وتفصيل شروط السوم.",
    ratio: 10.0,
  },
  4: {
    eventAr: "إجلاء بني النضير وقسمة أموال الفيء على المهاجرين والفقراء وفق الآيات الكريمة.",
    rulerAr: "رسول الله محمد ﷺ",
    fiqhNoteAr: "التفريق بين أموال الغنائم وأموال الفيء وأموال الزكاة ومصارف كل منها.",
    ratio: 10.0,
  },
  5: {
    eventAr: "غزوة الخندق (الأحزاب) وبني قريظة، وازدياد الموارد الاقتصادية للمدينة.",
    rulerAr: "رسول الله محمد ﷺ",
    fiqhNoteAr:
      "التأكيد على أن الزكاة لا تسقط في أوقات الحصار أو النوازل ما دامت الأموال بلغت النصاب وحال الحول.",
    ratio: 10.0,
  },
  6: {
    eventAr: "صلح الحديبية، وبدء مراسلة ملوك وأمراء العالم (كسرى وقيصر والمقوقس والنجاشي).",
    rulerAr: "رسول الله محمد ﷺ",
    fiqhNoteAr: "التعامل بالدنانير الرومية الذهبية والدراهم الساسانية الفضية بالوزن لا بالعدد.",
    ratio: 10.0,
  },
  7: {
    eventAr: "فتح خيبر وتأمين أكبر واحة زراعية للمسلمين، وإقرار أهلها على الشطر مما يخرج منها.",
    rulerAr: "رسول الله محمد ﷺ",
    fiqhNoteAr: "تشريع زكاة الزروع والثمار وخمسة أوسق (نحو 653 كجم) والعشر فيما سُقي بغير كلفة.",
    ratio: 10.0,
  },
  8: {
    eventAr: "فتح مكة المكرمة وتطهير الكعبة من الأصنام، وغزوة حنين وحصار الطائف.",
    rulerAr: "رسول الله محمد ﷺ",
    fiqhNoteAr: "إعطاء سهم المؤلفة قلوبهم لتثبيت الإسلام، ووجوب الزكاة على أموال تجار قريش ومكة.",
    ratio: 10.0,
  },
  9: {
    eventAr: "عام الوفود، وغزوة تبوك، ونزول آية مصارف الزكاة الثمانية في سورة التوبة.",
    rulerAr: "رسول الله محمد ﷺ",
    fiqhNoteAr:
      "إرسال الجباة والمصدقين (كمعاذ بن جبل إلى اليمن) مع الأمر بأخذ الزكاة من أغنيائهم وردها على فقرائهم.",
    ratio: 10.0,
  },
  10: {
    eventAr: "حجة الوداع وخطبة النبي ﷺ الجامعة التي قررت حرمة الدماء والأموال والأعراض.",
    rulerAr: "رسول الله محمد ﷺ",
    fiqhNoteAr: "إبطال ربا الجاهلية بالكامل، وتأكيد فريضة الزكاة كركن ثالث من أركان الإسلام.",
    ratio: 10.0,
  },
  11: {
    eventAr: "وفاة النبي ﷺ، وبيعة أبي بكر الصديق خليفة للمسلمين، وحروب الردة ومانعي الزكاة.",
    rulerAr: "أبو بكر الصديق رضي الله عنه",
    fiqhNoteAr:
      "موقف الصديق الحاسم: «والله لو منعوني عقالاً كانوا يؤدونه إلى رسول الله لقاتلتهم عليه»، وتثبيت شأن الفريضة.",
    ratio: 10.0,
  },
  18: {
    eventAr: "عام الرمادة ومجاعة الحجاز الشديدة، وطاعون عمواس بالشام، ووقف حد السرقة استثنائياً.",
    rulerAr: "عمر بن الخطاب رضي الله عنه",
    fiqhNoteAr:
      "تقنين الفاروق لميزان «وزن سبعة» (كل 10 دراهم = 7 مثاقيل)، وتوجيه أموال الزكاة والمؤن من مصر والعراق للمدينة.",
    ratio: 10.0,
  },
  23: {
    eventAr:
      "استشهاد عمر بن الخطاب وتولي عثمان بن عفان رضي الله عنه، واتساع رقعة الفتوحات الإسلامية.",
    rulerAr: "عثمان بن عفان رضي الله عنه",
    fiqhNoteAr:
      "تقسيم الأموال إلى «أموال ظاهرة» كالماشية والزروع يجبيها الإمام، و«أموال باطنة» كالنقد يخرجها صاحبها بنفسه.",
    ratio: 10.0,
  },
  35: {
    eventAr:
      "استشهاد عثمان بن عفان وتولي علي بن أبي طالب رضي الله عنه وانتقال عاصمة الخلافة إلى الكوفة.",
    rulerAr: "علي بن أبي طالب رضي الله عنه",
    fiqhNoteAr:
      "عهود أمير المؤمنين علي بن أبي طالب لعمال الصدقات بعدم ترويع الناس وأخذ أوسط المال دون خياره.",
    ratio: 10.0,
  },
  41: {
    eventAr: "عام الجماعة، تنازل الحسن لمعاوية وتأسيس الدولة الأموية وعاصمتها دمشق.",
    rulerAr: "معاوية بن أبي سفيان",
    fiqhNoteAr:
      "انتظام جباية الزكاة في الدواوين الشامية والمصرية والعراقية مع بقاء النصاب على وزنه النبوي.",
    ratio: 10.0,
  },
  77: {
    eventAr:
      "الإصلاح النقدي التاريخي لعبد الملك بن مروان، وسك أول دينار ودرهم عربي إسلامي خالص في دمشق.",
    rulerAr: "عبد الملك بن مروان",
    fiqhNoteAr:
      "اعتماد الدينار الأموي 4.25 جم والدرهم 2.975 جم كمعيار صلب مطبق في كل أرجاء العالم الإسلامي.",
    ratio: 10.5,
  },
  99: {
    eventAr: "خلافة عمر بن عبد العزيز، خامس الخلفاء الراشدين، وتحقيق العدالة الاجتماعية الكبرى.",
    rulerAr: "عمر بن عبد العزيز رحمه الله",
    fiqhNoteAr:
      "فيضان أموال الزكاة في إفريقية والشام والعراق حتى قال يحيى بن سعيد: «بعثني عمر أصدق أموال إفريقية فطلبت فقيراً فلم أجد».",
    ratio: 10.5,
  },
  132: {
    eventAr: "سقوط الدولة الأموية وقيام الدولة العباسية وبدء العصر العباسي الأول.",
    rulerAr: "أبو العباس السفاح",
    fiqhNoteAr:
      "استمرار العمل بالدينار والدرهم الشرعي وتأسيس أولى مدونات الفقه الشاملة في بغداد والكوفة والمدينة.",
    ratio: 11.0,
  },
  160: {
    eventAr:
      "ازدهار بغداد في عهد المهدي وهارون الرشيد، وافتتاح مناجم الفضة في آسيا الوسطى وخراسان.",
    rulerAr: "محمد المهدي / هارون الرشيد",
    fiqhNoteAr:
      "تدفق الفضة وتغير نسبي طفيف في سعر الصرف، وظهور كتاب «الخراج» للقاضي أبي يوسف مبيناً أحكام الزكاة والجباية.",
    ratio: 12.0,
  },
  450: {
    eventAr: "الدينار الآمري والدراهم المصرية في العصر الفاطمي، والنزاع على نقاوة العيار الذهبي.",
    rulerAr: "الخلفاء الفاطميون بمصر والسلاجقة ببغداد",
    fiqhNoteAr:
      "تشديد فقهاء الشافعية والمالكية على ضرورة تنقية الذهب والفضة وإسقاط الشوائب والنحاس عند تقدير النصاب.",
    ratio: 13.5,
  },
  800: {
    eventAr:
      "أزمة العملات النحاسية في العصر المملوكي ورسالة المقريزي الشهيرة «إغاثة الأمة بكشف الغمة».",
    rulerAr: "سلاطين المماليك بمصر والشام",
    fiqhNoteAr:
      "تحذير العلماء من التخلي عن معيار النقدين ووجوب ربط تقويم الفلوس بالنصاب الشرعي للذهب أو الفضة.",
    ratio: 15.0,
  },
  1000: {
    eventAr: "ثورة الفضة العالمية عقب تدفق فضة جبال بوتوسي والمكسيك إلى أوروبا والدولة العثمانية.",
    rulerAr: "السلطان العثماني مراد الثالث",
    fiqhNoteAr:
      "هبوط القوة الشرائية للفضة لأول مرة في التاريخ الإسلامي وبدء ارتفاع نسبة الذهب للفضة متجاوزة 1 : 16.",
    ratio: 16.5,
  },
  1300: {
    eventAr:
      "تبني الدول الصناعية الكبرى لقاعدة الذهب الخالص وإلغاء معيارية الفضة النقدية وظهور الأوراق النقدية.",
    rulerAr: "السلطان عبد الحميد الثاني",
    fiqhNoteAr:
      "فتاوى كبار علماء الأزهر والعثمانيين بوجوب الزكاة في الأوراق النقدية كأثمان قائمة مقام النقدين.",
    ratio: 22.0,
  },
  1391: {
    eventAr: "صدمة نيكسون 1971 م وفك ارتباط الدولار الأمريكي بالذهب ونهاية عهد بريتون وودز.",
    rulerAr: "العصر المعاصر",
    fiqhNoteAr:
      "قرارات مجمع الفقه الإسلامي الدولي باعتبار الأوراق النقدية أثماناً كاملة، ومناقشة تفكك التكافؤ بين نصابي الذهب والفضة.",
    ratio: 35.0,
  },
  1448: {
    eventAr: "الوقت الراهن وتسجيل أسعار الذهب والفضة القياسية عالمياً واتساع الفجوة لنسبة قياسية.",
    rulerAr: "العصر المعاصر الرقمي",
    fiqhNoteAr:
      "انفصال نصاب الفضة (نحو 650-1,200 دولار) عن نصاب الذهب (نحو 8,500-11,000 دولار)، وترجيح كبار العلماء لنصاب الذهب للنقود.",
    ratio: 93.0,
  },
};

export const ISLAMIC_CHRONOLOGY: ChronologyMilestone[] = [
  {
    id: "era-2-ah",
    hijriYear: 2,
    gregorianYear: 624,
    era: "prophetic",
    eraNameAr: "العصر النبوي الشريف (بدء فرض الزكاة)",
    eraNameEn: "Prophetic Era (Obligation of Zakat)",
    titleAr: "فرض فريضة الزكاة وتأسيس معيار النقدين وتطابق النصابين في المدينة المنورة (2 هـ)",
    titleEn: "Institution of Zakat & Bimetallic Nisab Establishment (2 AH)",
    goldDinarGrams: 4.25,
    silverDirhamGrams: 2.975,
    goldToSilverRatio: 10.0,
    goldNisabGrams: 85,
    silverNisabGrams: 595,
    goldUsdOzEquivalent: 15.0,
    silverUsdOzEquivalent: 1.5,
    purchasingPowerNoteAr:
      "الدينار الذهبي يشتري شاة كاملة، والدرهم الفضي يشتري صاعاً من التمر أو وجبة كافية. كان نصاب الفضة (200 درهم) يكافئ تماماً نصاب الذهب (20 ديناراً) في القوة الشرائية عند بدء فرض الزكاة.",
    historicalContextAr:
      "فُرضت الزكاة في السنة الثانية من الهجرة النبوية في شهر شعبان بالمدينة المنورة. وحدد النبي ﷺ المقادير الشرعية بدقة: «ليس في أقل من عشرين مثقالاً من الذهب صدقة» (85 جم) و«ليس في أقل من مائتي درهم صدقة» (595 جم)، فبدأ التدقيق الشرعي للأنصبة.",
    fiqhiVerdictAr:
      "بدء التاريخ التشريعي لفريضة الزكاة والتدقيق المحاسبي: تطابق كامل بين نصابي الذهب والفضة (1 : 10)؛ 20 ديناراً = 200 درهم بلا أدنى فرق.",
  },
  {
    id: "era-18-ah",
    hijriYear: 18,
    gregorianYear: 639,
    era: "rashidun",
    eraNameAr: "عصر الخلفاء الراشدين",
    eraNameEn: "Rashidun Caliphate",
    titleAr: "تقنين عمر بن الخطاب رضي الله عنه لميزان سبعة ودواوين الزكاة",
    titleEn: "Umar's Coinage Standard and Zakat Diwan",
    goldDinarGrams: 4.25,
    silverDirhamGrams: 2.975,
    goldToSilverRatio: 10.0,
    goldNisabGrams: 85,
    silverNisabGrams: 595,
    goldUsdOzEquivalent: 15.0,
    silverUsdOzEquivalent: 1.5,
    purchasingPowerNoteAr:
      "كفاية سنوية لأسرة متوسطة بحدود 10-20 ديناراً. أجر العامل اليومي نحو نصف درهم إلى درهم.",
    historicalContextAr:
      "قنن الفاروق عمر بن الخطاب النسبة الوزنية الصارمة: كل 10 دراهم فضية تعادل 7 مثاقيل ذهبية (وزن سبعة)، ونقش على بعض الدراهم «الحمد لله» و«محمد رسول الله».",
    fiqhiVerdictAr:
      "إجماع الصحابة على بقاء نصاب الذهب 20 مثقالاً والفضة 200 درهم، واعتبار النقدين متكافئين في إسقاط حاجة الفقير وتحديد الغنى.",
  },
  {
    id: "era-77-ah",
    hijriYear: 77,
    gregorianYear: 696,
    era: "umayyad",
    eraNameAr: "الدولة الأموية",
    eraNameEn: "Umayyad Caliphate",
    titleAr: "الإصلاح النقدي التاريخي لعبد الملك بن مروان وسك النقد العربي الخالص",
    titleEn: "Abd al-Malik's Historic Islamic Coinage Reform",
    goldDinarGrams: 4.25,
    silverDirhamGrams: 2.975,
    goldToSilverRatio: 10.5,
    goldNisabGrams: 85,
    silverNisabGrams: 595,
    goldUsdOzEquivalent: 16.0,
    silverUsdOzEquivalent: 1.52,
    purchasingPowerNoteAr:
      "استقرار نقدي واقتصادي غير مسبوق في الشام ومصر والعراق، وامتلاء بيت المال حتى فاضت أموال الزكاة في عهد عمر بن عبد العزيز (99-101 هـ).",
    historicalContextAr:
      "ألغى عبد الملك بن مروان العملات البيزنطية والفارسية وسك أول دينار ودرهم إسلامي عربي يحمل آيات التوحيد «قل هو الله أحد» وسنة السك، وصار الوزن 4.25 جم و 2.975 جم معياراً عالمياً محفوظاً إلى اليوم.",
    fiqhiVerdictAr:
      "تأكيد أئمة التابعين (سعيد بن المسيب، الحسن البصري) على معيارية الدنانير والدراهم المروانية في حساب النصاب الشرعي.",
  },
  {
    id: "era-160-ah",
    hijriYear: 160,
    gregorianYear: 776,
    era: "abbasid",
    eraNameAr: "العصر العباسي الذهبي",
    eraNameEn: "Early Abbasid Era",
    titleAr: "تدفق الفضة وتأسيس مدونات الفقه المذهبي (أبو حنيفة، مالك، الشافعي)",
    titleEn: "Silver Surges & Classical Fiqh Codification",
    goldDinarGrams: 4.25,
    silverDirhamGrams: 2.975,
    goldToSilverRatio: 12.0,
    goldNisabGrams: 85,
    silverNisabGrams: 595,
    goldUsdOzEquivalent: 18.0,
    silverUsdOzEquivalent: 1.5,
    purchasingPowerNoteAr:
      "ازدهار التجارة العالمية على طريق الحرير. الدينار يشتري حمل بعير من الحبوب أو شاتين سمينتين في مواسم الرخاء.",
    historicalContextAr:
      "فتح مناجم الفضة في خراسان وبلخ أدى إلى زيادة طفيفة في كمية الفضة وتراجع سعرها مقابل الذهب ليتراوح بين 1:12 إلى 1:14.",
    fiqhiVerdictAr:
      "بدأ الفقهاء في مناقشة مسألة تقويم عروض التجارة؛ فرأى الحنفية التقويم بما هو «أنفع للفقراء»، بينما رأى الجمهور التقويم بغالب نقد البلد.",
  },
  {
    id: "era-450-ah",
    hijriYear: 450,
    gregorianYear: 1058,
    era: "fatimid_ayyoubid",
    eraNameAr: "العصر الأيوبي والفاطمي",
    eraNameEn: "Fatimid & Ayyubid Period",
    titleAr: "الدينار الآمري وتوسع النقود المسكوكة في مصر والشام",
    titleEn: "Amiri Dinar & Mediterranean Monetary Shifts",
    goldDinarGrams: 4.25,
    silverDirhamGrams: 2.975,
    goldToSilverRatio: 13.5,
    goldNisabGrams: 85,
    silverNisabGrams: 595,
    goldUsdOzEquivalent: 19.5,
    silverUsdOzEquivalent: 1.44,
    purchasingPowerNoteAr:
      "ارتفاع عيار الذهب في مصر بفضل الدنانير الفاطمية عالية النقاوة، مع تقلبات في أوزان الدراهم الفضية والفلوس النحاسية.",
    historicalContextAr:
      "الحروب الصليبية وتغير موازين التبادل في حوض البحر الأبيض المتوسط أحدثت فجوات بين أسعار الصرف في القاهرة ودمشق وبغداد.",
    fiqhiVerdictAr:
      "أفتى أئمة الشافعية والمالكية بوجوب التحقق من نقاوة الذهب والفضة (العيار)، وإسقاط وزن الغش والنحاس المخلوط من حساب النصاب.",
  },
  {
    id: "era-800-ah",
    hijriYear: 800,
    gregorianYear: 1398,
    era: "mamluk",
    eraNameAr: "عصر المماليك",
    eraNameEn: "Mamluk Sultanate",
    titleAr: "رسالة المقريزي «إغاثة الأمة» وأول دراسة عربية للتضخم النقدي",
    titleEn: "Al-Maqrizi's Monetary Treatise on Currency Crisis",
    goldDinarGrams: 4.25,
    silverDirhamGrams: 2.975,
    goldToSilverRatio: 15.0,
    goldNisabGrams: 85,
    silverNisabGrams: 595,
    goldUsdOzEquivalent: 20.0,
    silverUsdOzEquivalent: 1.33,
    purchasingPowerNoteAr:
      "أزمة التضخم بالفلوس النحاسية؛ رصد المقريزي اختفاء الفضة والذهب من السوق وغلبة النحاس على المعاملات وارتفاع الأسعار.",
    historicalContextAr:
      "كتب المؤرخ تقي الدين المقريزي كتابه الشهير محذراً من التخلي عن معيار الذهب والفضة اللذين جعلهما الله ثمناً للأشياء طبعاً وشرعاً.",
    fiqhiVerdictAr:
      "تشديد علماء العصر على عدم جواز قياس الفلوس النحاسية على الأثمان إلا إذا راجت رواج النقدين مع وجوب ربط نصابها بالذهب أو الفضة.",
  },
  {
    id: "era-1000-ah",
    hijriYear: 1000,
    gregorianYear: 1591,
    era: "ottoman",
    eraNameAr: "الدولة العثمانية الوسيطة",
    eraNameEn: "Ottoman Empire Expansion",
    titleAr: "انفجار الفضة الأمريكية وتدهور نسبة الفضة إلى الذهب عالمياً",
    titleEn: "New World Silver Influx and Price Revolution",
    goldDinarGrams: 4.25,
    silverDirhamGrams: 2.975,
    goldToSilverRatio: 16.5,
    goldNisabGrams: 85,
    silverNisabGrams: 595,
    goldUsdOzEquivalent: 20.5,
    silverUsdOzEquivalent: 1.24,
    purchasingPowerNoteAr:
      "بدء تراجع القوة الشرائية للفضة لأول مرة في التاريخ بسبب جلب أطنان الفضة من مناجم بوتوسي والمكسيك إلى أوروبا والدولة العثمانية.",
    historicalContextAr:
      "عُرفت هذه الحقبة بـ «ثورة الأسعار (Price Revolution)»؛ حيث غرقت الأسواق بالفضة الرخيصة، وتأثرت العملة العثمانية (الآقجة) بالتخفيض المتكرر.",
    fiqhiVerdictAr:
      "استمر العمل الفقهي بالدرهم الشرعي وزناً (2.975 جم) بصرف النظر عن العملات الرائجة كالأقجة والقرش.",
  },
  {
    id: "era-1300-ah",
    hijriYear: 1300,
    gregorianYear: 1882,
    era: "early_modern",
    eraNameAr: "أواخر القرن التاسع عشر",
    eraNameEn: "Late 19th Century",
    titleAr: "اعتماد قاعدة الذهب الدولية وبداية ظهور الأوراق النقدية",
    titleEn: "Global Gold Standard and First Banknotes",
    goldDinarGrams: 4.25,
    silverDirhamGrams: 2.975,
    goldToSilverRatio: 22.0,
    goldNisabGrams: 85,
    silverNisabGrams: 595,
    goldUsdOzEquivalent: 20.67,
    silverUsdOzEquivalent: 0.94,
    purchasingPowerNoteAr:
      "الدول الغربية تتخلى عن الفضة كمعيار نقدي وتتبنى الذهب فقط، مما هبط بقيمة الفضة العالمية.",
    historicalContextAr:
      "المصارف المركزية تصدر أوراقاً بنكية قابلة للاستبدال بالذهب بسعر ثابت (20.67 دولار للأونصة).",
    fiqhiVerdictAr:
      "أفتى مشايخ الأزهر والعثمانيون بأن الأوراق النقدية سندات ديون قائمة مقام النقدين، وتجب فيها الزكاة إذا بلغت قيمتها نصاب الذهب أو الفضة.",
  },
  {
    id: "era-1391-ah",
    hijriYear: 1391,
    gregorianYear: 1971,
    era: "contemporary",
    eraNameAr: "العصر المعاصر (صدمة نيكسون)",
    eraNameEn: "Nixon Shock & Fiat Era",
    titleAr: "إلغاء الغطاء الذهبي للدولار وفصل النقدين عن العملات الورقية",
    titleEn: "Severing the Gold Standard (Nixon Shock)",
    goldDinarGrams: 4.25,
    silverDirhamGrams: 2.975,
    goldToSilverRatio: 35.0,
    goldNisabGrams: 85,
    silverNisabGrams: 595,
    goldUsdOzEquivalent: 40.62,
    silverUsdOzEquivalent: 1.55,
    purchasingPowerNoteAr:
      "بداية التضخم الورقي الحاد للعملات الورقية غير المغطاة وتراجع القوة الشرائية للنقود الورقية أمام الذهب.",
    historicalContextAr:
      "إعلان الرئيس الأمريكي ريتشارد نيكسون وقف تحويل الدولار إلى ذهب رسمياً، وتحول كل العملات العالمية إلى عملات ائتمانية إلزامية (Fiat Currencies).",
    fiqhiVerdictAr:
      "مؤتمرات مجمع الفقه الإسلامي الدولي تقرر أن الأوراق النقدية «أثمان قائمة بذاتها لها علة الثمنية»، وتجب فيها الزكاة بالربط مع نصاب الذهب أو الفضة.",
  },
  {
    id: "era-1448-ah",
    hijriYear: 1448,
    gregorianYear: 2026,
    era: "contemporary",
    eraNameAr: "الوقت الراهن (عصر التضخم والملاذات الآمنة)",
    eraNameEn: "Contemporary Market Reality",
    titleAr: "اتساع الفجوة التاريخية بين نصابي الذهب والفضة وارتفاع النسبة لـ 90:1",
    titleEn: "Record Disparity: Gold-to-Silver Ratio Reaches ~90:1",
    goldDinarGrams: 4.25,
    silverDirhamGrams: 2.975,
    goldToSilverRatio: 93.0,
    goldNisabGrams: 85,
    silverNisabGrams: 595,
    goldUsdOzEquivalent: 3120.0,
    silverUsdOzEquivalent: 33.5,
    purchasingPowerNoteAr:
      "نصاب الفضة (595 جم) أصبح يساوي نحو 640 دولاراً فقط (أقل من الحد الأدنى للأجور في كثير من الدول)، بينما نصاب الذهب (85 جم) يمثل ثروة نقدية حقيقية تتجاوز 8,500 دولار.",
    historicalContextAr:
      "تحول الفضة إلى معدن صناعي خاضع للطلب التكنولوجي، بينما بقي الذهب الملاذ الآمن الأول واحتياطي البنوك المركزية الكبرى، مما فكك الترابط الذي دام لآلاف السنين.",
    fiqhiVerdictAr:
      "انقسام الفتوى المعاصرة: دور الإفتاء التقليدية تأخذ بالفضة (الأحظ للفقراء)، بينما يرجح مجمع الفقه الدولي وهيئة كبار العلماء نصاب الذهب للأوراق النقدية نظراً لأن الفضة لم تعد تحقق وصف الغنى الشرعي.",
  },
];

export type AnyHijriYearDetails = {
  hijriYear: number;
  gregorianYear: number;
  era: IslamicEra;
  eraNameAr: string;
  historicalEventAr: string;
  rulerOrContextAr: string;
  regionalCurrencyAr: string;
  goldDinarGrams: number;
  silverDirhamGrams: number;
  goldNisabGrams: number;
  silverNisabGrams: number;
  goldToSilverRatio: number;
  goldPriceUsdOz: number;
  silverPriceUsdOz: number;
  goldNisabLocal: number;
  silverNisabLocal: number;
  lowerNisabLocal: number;
  purchasingPowerEstimateAr: string;
  fiqhiStatusAr: string;
};

export function getRegionalCurrencyName(year: number, countryCode: string): string {
  const c = countryCode.toUpperCase();
  if (c === "EG") {
    if (year <= 40) return "الدرهم الساساني الفضي وصلح الإسكندرية الرومي";
    if (year <= 132) return "الدينار والدرهم الأموي المسكوك بمصر";
    if (year <= 358) return "الدينار الطولوني والإخشيدي والعباسي";
    if (year <= 567) return "الدينار الفاطمي المعزي والآمري";
    if (year <= 648) return "الدينار الأيوبي الصلاحي والدرهم الكامل";
    if (year <= 923) return "الدينار المملوكي والدرهم والفلوس";
    if (year <= 1333) return "القرش العثماني ثم الجنيه المصري الذهبي (1836م)";
    return "الجنيه المصري الحديث (EGP)";
  }

  if (c === "SA") {
    if (year <= 40) return "الدينار الهرقلي والدرهم الكسروي / الدرهم العمري (المدينة المنورة)";
    if (year <= 132) return "الدينار والدرهم الأموي الإسلامي";
    if (year <= 656) return "الدينار والدرهم العباسي بالحجاز";
    if (year <= 923) return "الدنانير الحجازية والمملوكية بمكة والمدينة";
    if (year <= 1344) return "الريال العثماني المجيدي والقرش";
    return "الريال العربي السعودي (SAR)";
  }

  if (c === "AE" || c === "KW" || c === "QA" || c === "BH" || c === "OM") {
    if (year <= 132) return "الدراهم والدنانير العربية الإسلامية بالخليج";
    if (year <= 923) return "دراهم صحار وسيراف وهرمز الفضية";
    if (year <= 1365) return "الروبية الخليجية الفضية وتالر ماريا تريزا";
    if (year <= 1392) return "ريال قطر ودبي / دينار الكويت والبحرين";
    return "العملة الوطنية الرسمية للدولة";
  }

  if (c === "IQ") {
    if (year <= 40) return "الدراهم الساسانية الفضية ودراهم البصرة والكوفة";
    if (year <= 132) return "الدراهم الأموية المضروبة بواسط والكوفة";
    if (year <= 656) return "دينار دار السلام العباسي المسكوك ببغداد";
    if (year <= 923) return "الدينار الإلخاني والجلائري بالعراق";
    if (year <= 1340) return "الليرة والقرش العثماني ببغداد والبصرة";
    return "الدينار العراقي (IQD)";
  }

  if (c === "SY" || c === "JO" || c === "LB" || c === "PS") {
    if (year <= 132) return "الدينار الأموي الدمشقي الخالص (منذ 77 هـ)";
    if (year <= 656) return "الدنانير والدراهم العباسية الشامية";
    if (year <= 923) return "الدينار والدرهم الأيوبي والمملوكي بدمشق وحلب";
    if (year <= 1337) return "الليرة والقرش العثماني بالشام";
    return "العملة الوطنية الرسمية لبلاد الشام";
  }

  if (c === "TR") {
    if (year <= 700) return "الدينار والدرهم السلجوقي والبيزنطي";
    if (year <= 1342) return "الآقجة والقرش والليرة العثمانية الذهبية";
    return "الليرة التركية (TRY)";
  }

  // General Islamic Standard
  if (year <= 40) return "الدينار والمثقال الشرعي (4.25 جم) والدرهم (2.975 جم)";
  if (year <= 132) return "الدينار والدرهم الأموي العربي الخالص";
  if (year <= 656) return "الدينار والدرهم العباسي المعياري";
  if (year <= 923) return "الدنانير والدراهم الإسلامية الكلاسيكية";
  if (year <= 1342) return "العملات الذهبية والفضية العثمانية والإقليمية";
  return "العملة الورقية الرسمية الحديثة";
}

export function getAnyHijriYearDetails(
  year: number,
  countryCode = "SA",
  exchangeRate = 3.75,
): AnyHijriYearDetails {
  // Zakat auditing and Nisab records start from 2 AH (year of obligation)
  const safeYear = Math.max(2, Math.min(1448, Math.round(year)));
  const gregorianYear = Math.round(safeYear * 0.970229 + 621.57);

  // Determine Era
  let era: IslamicEra = "contemporary";
  let eraNameAr = "العصر المعاصر والنقود الورقية";
  if (safeYear <= 11) {
    era = "prophetic";
    eraNameAr = "العصر النبوي الشريف";
  } else if (safeYear <= 40) {
    era = "rashidun";
    eraNameAr = "عصر الخلفاء الراشدين";
  } else if (safeYear <= 132) {
    era = "umayyad";
    eraNameAr = "الدولة الأموية";
  } else if (safeYear <= 656) {
    era = "abbasid";
    eraNameAr = "الدولة العباسية";
  } else if (safeYear <= 923) {
    era = "mamluk";
    eraNameAr = "عصر الأيوبيين والمماليك";
  } else if (safeYear <= 1342) {
    era = "ottoman";
    eraNameAr = "الدولة العثمانية";
  } else if (safeYear <= 1391) {
    era = "early_modern";
    eraNameAr = "العصر الحديث وقاعدة الذهب";
  }

  // Calculate historical gold-to-silver ratio
  let ratio = 10.0;
  if (safeYear <= 40) {
    ratio = 10.0;
  } else if (safeYear <= 132) {
    ratio = 10.0 + ((safeYear - 40) / 92) * 1.0; // 10.0 -> 11.0
  } else if (safeYear <= 656) {
    ratio = 11.0 + ((safeYear - 132) / 524) * 3.5; // 11.0 -> 14.5
  } else if (safeYear <= 923) {
    ratio = 14.5 + ((safeYear - 656) / 267) * 1.0; // 14.5 -> 15.5
  } else if (safeYear <= 1342) {
    ratio = 15.5 + ((safeYear - 923) / 419) * 14.5; // 15.5 -> 30.0
  } else if (safeYear <= 1391) {
    ratio = 30.0 + ((safeYear - 1342) / 49) * 5.0; // 30.0 -> 35.0
  } else if (safeYear <= 1421) {
    ratio = 35.0 + ((safeYear - 1391) / 30) * 21.4; // 35.0 -> 56.4
  } else {
    ratio = 56.4 + ((safeYear - 1421) / 27) * 36.6; // 56.4 -> 93.0
  }
  ratio = Number(ratio.toFixed(1));

  // Check specific historical milestones
  const specific = SPECIFIC_YEAR_EVENTS[safeYear];
  let historicalEventAr = specific?.eventAr ?? "";
  let rulerOrContextAr = specific?.rulerAr ?? "";
  let fiqhiStatusAr = specific?.fiqhNoteAr ?? "";

  if (!historicalEventAr) {
    if (safeYear < 11) {
      historicalEventAr = `العام ${safeYear} من الهجرة النبوية المباركة بالمدينة المنورة.`;
      rulerOrContextAr = "رسول الله محمد ﷺ";
      fiqhiStatusAr = "النصابان متطابقان في القيمة والغنى تماماً (20 ديناراً = 200 درهم).";
    } else if (safeYear <= 40) {
      historicalEventAr = `العام ${safeYear} هـ في عهد الخلافة الراشدة والفتوحات الإسلامية الكبرى.`;
      rulerOrContextAr = "الخلفاء الراشدون رضي الله عنهم";
      fiqhiStatusAr = "استمرار ميزان سبعة الشرعي وتوزيع الزكاة في الدواوين على المستحقين.";
    } else if (safeYear <= 132) {
      historicalEventAr = `العام ${safeYear} هـ في عهد الخلافة الأموية وتوسع الدولة من الأندلس إلى حدود الصين.`;
      rulerOrContextAr = "خلفاء بني أمية بدمشق";
      fiqhiStatusAr = "تداول الدينار والدرهم العربي الإسلامي المضروب بدمشق وواسط.";
    } else if (safeYear <= 656) {
      historicalEventAr = `العام ${safeYear} هـ في حاضرة الخلافة العباسية ببغداد وازدهار التجارة والعلوم.`;
      rulerOrContextAr = "الخلفاء العباسيون ببغداد";
      fiqhiStatusAr = "بداية النقاش المذهبي حول التقويم بالأحظ للفقراء بعد تغير نسبة الفضة.";
    } else if (safeYear <= 923) {
      historicalEventAr = `العام ${safeYear} هـ في عهد سلاطين المماليك والدول المستقلة بمصر والشام والأندلس.`;
      rulerOrContextAr = "السلاطين والملوك";
      fiqhiStatusAr = "اشتراط الفقهاء تنقية العيار وإسقاط النحاس والمغشوش من الذهب والفضة.";
    } else if (safeYear <= 1342) {
      historicalEventAr = `العام ${safeYear} هـ في عهد الدولة العثمانية وعاصمتها إسطنبول.`;
      rulerOrContextAr = "السلاطين العثمانيون";
      fiqhiStatusAr = "تأثر الفضة بالتدفق العالمي وبداية ظهور الأوراق النقدية كأثمان.";
    } else {
      historicalEventAr = `العام ${safeYear} هـ (الموافق نحو ${gregorianYear} م) في العصر المعاصر.`;
      rulerOrContextAr = "الدول الإسلامية المعاصرة";
      fiqhiStatusAr =
        "انفصال حاد بين نصاب الذهب والفضة؛ ومجمع الفقه الدولي يرجح نصاب الذهب للأوراق النقدية.";
    }
  }

  // Representative gold price in USD/oz for calculation context
  let goldPriceUsdOz = 20.67;
  if (safeYear < 1342) {
    goldPriceUsdOz = 20.67;
  } else if (safeYear <= 1391) {
    goldPriceUsdOz = 35.0;
  } else if (safeYear <= 1421) {
    goldPriceUsdOz = 350.0;
  } else {
    // 2000-2026 growth
    goldPriceUsdOz = 350.0 + ((safeYear - 1421) / 27) * (3120.0 - 350.0);
  }
  const silverPriceUsdOz = goldPriceUsdOz / ratio;

  // Local currency values (85g 24K and 595g Silver)
  const goldPerGramLocal = (goldPriceUsdOz / TROY_OUNCE_G) * exchangeRate;
  const silverPerGramLocal = (silverPriceUsdOz / TROY_OUNCE_G) * exchangeRate;

  const goldNisabLocal = Number((goldPerGramLocal * 85).toFixed(2));
  const silverNisabLocal = Number((silverPerGramLocal * 595).toFixed(2));
  const lowerNisabLocal = Math.min(goldNisabLocal, silverNisabLocal);

  // Purchasing power estimate description
  let purchasingPowerEstimateAr = "";
  if (safeYear <= 40) {
    purchasingPowerEstimateAr =
      "نصاب الذهب (20 ديناراً) أو نصاب الفضة (200 درهم) كان يشتري نحو 20 شاة سمينة، أو كفاية أسرة كاملة لعام ونصف.";
  } else if (safeYear <= 656) {
    purchasingPowerEstimateAr =
      "نصاب الذهب 20 ديناراً يشتري نحو 20-30 شاة أو حمل بعير من الحنطة، بينما نصاب الفضة تراجع قليلاً وبدأ يشتري نحو 15-18 شاة.";
  } else if (safeYear <= 1342) {
    purchasingPowerEstimateAr =
      "نصاب الذهب بقي محافظاً على شراء قطيع من الماشية، بينما انحدرت القوة الشرائية لنصاب الفضة ليشتري نحو 8-10 شياه فقط.";
  } else {
    purchasingPowerEstimateAr = `نصاب الذهب (85 جم) يمثل ثروة تكفي لشراء نحو 25-35 شاة أو كفاية أسرة لعدة أشهر، بينما نصاب الفضة تراجع ليشتري نحو 2-3 شياه فقط.`;
  }

  return {
    hijriYear: safeYear,
    gregorianYear,
    era,
    eraNameAr,
    historicalEventAr,
    rulerOrContextAr,
    regionalCurrencyAr: getRegionalCurrencyName(safeYear, countryCode),
    goldDinarGrams: 4.25,
    silverDirhamGrams: 2.975,
    goldNisabGrams: 85,
    silverNisabGrams: 595,
    goldToSilverRatio: ratio,
    goldPriceUsdOz: Number(goldPriceUsdOz.toFixed(2)),
    silverPriceUsdOz: Number(silverPriceUsdOz.toFixed(2)),
    goldNisabLocal,
    silverNisabLocal,
    lowerNisabLocal,
    purchasingPowerEstimateAr,
    fiqhiStatusAr,
  };
}
