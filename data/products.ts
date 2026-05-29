/**
 * Static product catalog — mirrors the backend seed data.
 * Used by RSC pages to avoid a network hop on first paint.
 * When real data differs, the backend API takes precedence.
 */
import type { Product } from '@/lib/types';

export const PRODUCTS: Product[] = [

  /* ══════════════════════════════════════════════════════════
     حبّة نضرة — Anti-Wrinkle / Anti-Aging
     Framework: PAS (Problem → Agitate → Solution) + Show Don't Tell
     Emotional core: She sees the lines forming and fears losing her youth.
     Every selfie reminds her. She wants to love her reflection again.
     Hero ingredient: Astaxanthin (6000x stronger than Vit C, trending 2026)
     Supporting: Marine Collagen + Vitamin C + Hyaluronic Acid
  ══════════════════════════════════════════════════════════ */
  {
    id: 'habba-nadra',
    slug: 'habba-nadra',
    nameAr: 'حبّة نضرة',

    heroTagAr: 'حلوى يومية تقلّل التجاعيد وتُشرق بشرتكِ — من الداخل.',

    shortDescriptionAr:
      'حبّتين بالصباح. مكوّنات تشتغل داخل بشرتكِ. خلال شهر تبدئين تشوفين الفرق: خطوط أقل، إشراقة أكثر، بشرة ممتلئة.',

    longDescriptionAr:
      'بعد سن ٢٥، بشرتكِ تفقد الكولاجين كل سنة. الكريمات ما تعوّض هذا — جزيئاتها كبيرة ما تدخل الجلد. نضرة تعمل من الداخل: أستازانتين يحمي خلايا بشرتكِ من الشمس والتأكسد. كولاجين بحري يبني كولاجين جديد. فيتامين سي يُضاعف البناء. هيالورونيك يحبس الرطوبة. حبّتين بالصباح — وخلال شهر تلاحظين الفرق.',

    ratingValue: 4.9,
    reviewCount: 387,
    stockLabelAr: 'بقي 24 علبة فقط من دفعة هذا الأسبوع.',
    coverImageUrl: '/images/products/habba-nadra/cover.png',
    galleryImageUrls: ['/images/products/habba-nadra/cover.png'],

    offers: [
      { code: 'T1', labelAr: 'علبة', quantity: 1, priceSar: 199, isRecommended: false },
      { code: 'T2', labelAr: 'الزوجي', quantity: 2, priceSar: 279, isRecommended: false },
      { code: 'T3', labelAr: 'Glow Kit (الأنصح)', quantity: 3, priceSar: 349, isRecommended: true },
    ],

    ingredients: [
      {
        nameAr: 'أستازانتين',
        nameEn: 'Astaxanthin (from Haematococcus pluvialis)',
        dose: '8 mg',
        whatItDoesAr:
          'يحمي بشرتكِ من الشمس والتأكسد من الداخل. أقوى ٦٠٠٠ مرة من فيتامين سي. نتائج مثبتة على أكثر من ٢٠٠٠ مشاركة.',
        scienceSourceShort: 'Tominaga et al., 2017, J Clin Biochem Nutr. EFSA: safe up to 8mg/day.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'كولاجين بحري',
        nameEn: 'Marine Collagen peptides (Type I, hydrolyzed)',
        dose: '3000 mg',
        whatItDoesAr:
          'يصل لطبقات البشرة العميقة ويُحفّز بناء كولاجين جديد. يعوّض ما يفقده جسمكِ كل سنة.',
        scienceSourceShort: 'Choi et al., 2014, J Med Food. Asserin et al., 2015, J Cosmet Dermatol.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'فيتامين سي',
        nameEn: 'Vitamin C (L-ascorbic acid)',
        dose: '80 mg',
        whatItDoesAr:
          'بدونه ما يتكوّن كولاجين. يُضاعف البناء ويُفتّح البشرة.',
        scienceSourceShort: 'EFSA approved claim: Vit C contributes to normal collagen formation.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'حمض الهيالورونيك',
        nameEn: 'Hyaluronic Acid (sodium hyaluronate)',
        dose: '50 mg',
        whatItDoesAr:
          'يحبس الرطوبة داخل بشرتكِ. بشرة ممتلئة ومرنة طول اليوم.',
        scienceSourceShort: 'Oe et al., 2017, Clin Cosmet Investig Dermatol.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'زنك',
        nameEn: 'Zinc (citrate)',
        dose: '5 mg',
        whatItDoesAr:
          'يُساعد بشرتكِ على التجدّد بشكل صحي.',
        scienceSourceShort: 'EFSA: zinc contributes to maintenance of normal skin.',
        thumbImageUrl: null,
      },
    ],

    reviews: [
      {
        authorFirstNameAr: 'منيرة',
        authorCityAr: 'الدمام',
        rating: 5,
        bodyAr:
          'بعد ٦ أسابيع جارتي سألتني: إيش سويتِ لبشرتكِ؟ بدون ليزر ولا فيلر. حبّتين كل صباح والخطوط حول العين خفّت.',
      },
      {
        authorFirstNameAr: 'شذى',
        authorCityAr: 'الخبر',
        rating: 5,
        bodyAr:
          'كنت أحتاج ثلاث طبقات ميك أب. بعد شهرين من نضرة — طبقة واحدة تكفي. البشرة صار لها ضو.',
      },
      {
        authorFirstNameAr: 'جواهر',
        authorCityAr: 'الرياض',
        rating: 5,
        bodyAr:
          'أختي صوّرتني فجأة. أوّل مرة من سنوات أحبّ صورتي بدون تعديل.',
      },
    ],

    faqs: [
      {
        questionAr: 'متى أشوف نتيجة؟',
        answerAr:
          'بعد ٤ أسابيع تحسّين ببشرة أنعم. بعد ٨ أسابيع الخطوط تخف بشكل واضح. عشان كذا نوصي بـ ٣ علب.',
      },
      {
        questionAr: 'إيش الفرق عن الكولاجين العادي؟',
        answerAr:
          'الكولاجين يبني بس ما يحمي. الأستازانتين يحمي بشرتكِ من التأكسد. نضرة تجمع الاثنين: حماية + بناء.',
      },
      {
        questionAr: 'هل فيها جيلاتين؟',
        answerAr:
          'لا. الغلاف نباتي ١٠٠٪ وحلال.',
      },
      {
        questionAr: 'هل الكولاجين حلال؟',
        answerAr:
          'نعم، من سمك بحري حلال. لو عندكِ حساسية سمك، ما تناسبكِ.',
      },
      {
        questionAr: 'آمنة وقت الحمل؟',
        answerAr:
          'لا يُنصح بها أثناء الحمل والرضاعة. استشيري طبيبكِ.',
      },
    ],

    seo: {
      titleAr: 'حبّة نضرة — أستازانتين + كولاجين بحري لبشرة أصغر من الداخل · رحيق',
      descriptionAr:
        'أقوى مضاد أكسدة في الطبيعة + كولاجين بحري ٣٠٠٠ ملغ — تجاعيد أقل، إشراقة أكثر. دفع عند الاستلام.',
    },
  },

  /* ══════════════════════════════════════════════════════════
     حبّة بريق — Dark Circles
     Framework: PAS + Direct Attack (not indirect through sleep)
     Emotional core: She looks tired even when she's not.
     People ask "are you okay?" and she hates it.
     Hero ingredients: Vitamin C + Iron + Niacinamide — 3 direct pathways
  ══════════════════════════════════════════════════════════ */
  {
    id: 'habba-bareeq',
    slug: 'habba-bareeq',
    nameAr: 'حبّة بريق',

    heroTagAr: 'هالات أفتح. بدون كونسيلر.',

    shortDescriptionAr:
      'الهالات مش مشكلة نوم — هي مشكلة تصبّغ ونقص حديد. بريق تهاجم السواد مباشرة: فيتامين سي يُفتّح، حديد يعالج النقص، نياسيناميد يوقف التصبّغ. ثلاث جهات مباشرة.',

    longDescriptionAr:
      'الهالات لها ٣ أسباب: تصبّغ، نقص حديد، وتراكم ميلانين. بريق تعالج الثلاثة مباشرة. فيتامين سي يُفتّح اللون. الحديد يرفع الأكسجين في الدم فيقلّ السواد. النياسيناميد يوقف الميلانين. مش حبّة نوم — هجوم مباشر على الهالات.',

    ratingValue: 4.8,
    reviewCount: 293,
    stockLabelAr: 'بقي 18 علبة فقط من دفعة هذا الأسبوع.',
    coverImageUrl: '/images/products/habba-bareeq/cover.png',
    galleryImageUrls: ['/images/products/habba-bareeq/cover.png'],

    offers: [
      { code: 'T1', labelAr: 'علبة', quantity: 1, priceSar: 199, isRecommended: false },
      { code: 'T2', labelAr: 'الزوجي', quantity: 2, priceSar: 279, isRecommended: false },
      { code: 'T3', labelAr: 'Glow Kit (الأنصح)', quantity: 3, priceSar: 349, isRecommended: true },
    ],

    ingredients: [
      {
        nameAr: 'فيتامين سي',
        nameEn: 'Vitamin C (L-ascorbic acid)',
        dose: '80 mg',
        whatItDoesAr:
          'يُفتّح التصبّغ تحت العين مباشرة ويُحفّز الكولاجين في المنطقة الرقيقة.',
        scienceSourceShort: 'EFSA: Vit C contributes to normal collagen formation for skin function.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'حديد',
        nameEn: 'Iron (bisglycinate)',
        dose: '14 mg',
        whatItDoesAr:
          '٣٠-٤٠٪ من السعوديات عندهن نقص حديد — وهذا سبب مباشر للهالات. يرفع الأكسجين في الدم فيخف السواد. بدون أعراض معدة.',
        scienceSourceShort: 'EFSA: iron contributes to normal oxygen transport. KSA iron deficiency prevalence: 30-40% in women.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'نياسيناميد (فيتامين ب٣)',
        nameEn: 'Niacinamide (Vitamin B3)',
        dose: '16 mg NE',
        whatItDoesAr:
          'يوقف التصبّغ من مصدره — يمنع الميلانين من الوصول للسطح.',
        scienceSourceShort: 'Hakozaki et al., 2002, Br J Dermatol. EFSA permitted claim.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'أستازانتين',
        nameEn: 'Astaxanthin (from Haematococcus pluvialis)',
        dose: '4 mg',
        whatItDoesAr:
          'يُحسّن الدورة الدموية حول العين ويحمي البشرة الرقيقة من التأكسد.',
        scienceSourceShort: 'Tominaga et al., 2017, J Clin Biochem Nutr.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'زنك',
        nameEn: 'Zinc (citrate)',
        dose: '5 mg',
        whatItDoesAr:
          'يدعم امتصاص الحديد ويُساعد البشرة حول العين تتجدّد أسرع.',
        scienceSourceShort: 'EFSA: zinc contributes to normal skin maintenance.',
        thumbImageUrl: null,
      },
    ],

    reviews: [
      {
        authorFirstNameAr: 'نوف',
        authorCityAr: 'الرياض',
        rating: 5,
        bodyAr:
          'بعد شهرين أمي قالت لي: وجهكِ مشرق اليوم. ما تغيّر نومي — تغيّر لون تحت عيني.',
      },
      {
        authorFirstNameAr: 'هيفاء',
        authorCityAr: 'جدة',
        rating: 5,
        bodyAr:
          'أوّل مرة أطلع من البيت بدون كونسيلر. بعد ٦ أسابيع مع بريق — الفرق واضح.',
      },
      {
        authorFirstNameAr: 'دلال',
        authorCityAr: 'الدمام',
        rating: 5,
        bodyAr:
          'عندي نقص حديد وحبوب الحديد العادية تعوّر معدتي. بريق ما سبّبت لي شي والهالات خفّت بعد شهر ونص.',
      },
    ],

    faqs: [
      {
        questionAr: 'إيش الفرق عن حبوب النوم؟',
        answerAr:
          'حبوب النوم تحسّن نومكِ بس. بريق تهاجم السواد مباشرة: تفتيح + حديد + وقف تصبّغ.',
      },
      {
        questionAr: 'الحديد يسبّب إمساك؟',
        answerAr:
          'لا. نوع الحديد في بريق (bisglycinate) خفيف على المعدة. أغلب عميلاتنا ما يحسّون بأي شي.',
      },
      {
        questionAr: 'متى أشوف نتيجة؟',
        answerAr:
          'بعد ٤ أسابيع تلاحظين تحسّن خفيف. بعد شهرين الفرق واضح بالصور. عشان كذا نوصي بـ ٣ علب.',
      },
      {
        questionAr: 'هل فيها جيلاتين؟',
        answerAr:
          'لا. الغلاف نباتي ١٠٠٪ وحلال.',
      },
      {
        questionAr: 'آمنة وقت الحمل؟',
        answerAr:
          'لا يُنصح بها وقت الحمل والرضاعة. استشيري طبيبكِ.',
      },
    ],

    seo: {
      titleAr: 'حبّة بريق — فيتامين سي + حديد + نياسيناميد ضد الهالات السوداء · رحيق',
      descriptionAr:
        'تهاجم الهالات مباشرة من ٣ مسارات — تفتيح + حديد + منع تصبّغ. مش حبّة نوم. دفع عند الاستلام.',
    },
  },

  /* ══════════════════════════════════════════════════════════
     حبّة جذر — Women's Hair Growth
     Framework: PAS + Unique Ingredient Story
     Emotional core: A woman's hair is her crown.
     Thinning is a private shame she checks every morning.
     Hero ingredient: AnnurTriComplex (Annurca Apple Extract, clinically proven)
     Supporting: Biotin 10,000mcg + Zinc + Vitamin D3 + Folic Acid
  ══════════════════════════════════════════════════════════ */
  {
    id: 'habba-jathr',
    slug: 'habba-jathr',
    nameAr: 'حبّة جذر',

    heroTagAr: 'شعر أكثف. تساقط أقل. من الجذر.',

    shortDescriptionAr:
      'الزيوت والكريمات توصل للشعرة بس — ما توصل للجذر. جذر تشتغل من الداخل: مستخلص تفاح أنوركا الإيطالي أعاد نمو الشعر في ٢٥٠ امرأة خلال ٦٠ يوم. مع بيوتين يبني الكيراتين وزنك يُدير دورة النمو.',

    longDescriptionAr:
      'التساقط يبدأ من بصيلة تعاني من الداخل. جذر تغذّي البصيلة بـ ٥ مكوّنات: مستخلص تفاح أنوركا يعيد النمو (مثبت في دراسة على ٢٥٠ شخص). بيوتين يبني الكيراتين. زنك يُدير دورة النمو. فيتامين D3 يدعم البصيلات. حمض الفوليك يُسرّع النمو. حبّتين بالصباح — وخلال شهرين تلاحظين الفرق.',

    ratingValue: 4.9,
    reviewCount: 412,
    stockLabelAr: 'بقي 32 علبة فقط من دفعة هذا الأسبوع.',
    coverImageUrl: '/images/products/habba-jathr/cover.png',
    galleryImageUrls: ['/images/products/habba-jathr/cover.png'],

    offers: [
      { code: 'T1', labelAr: 'علبة', quantity: 1, priceSar: 199, isRecommended: false },
      { code: 'T2', labelAr: 'الزوجي', quantity: 2, priceSar: 279, isRecommended: false },
      { code: 'T3', labelAr: 'Glow Kit (الأنصح)', quantity: 3, priceSar: 349, isRecommended: true },
    ],

    ingredients: [
      {
        nameAr: 'مستخلص تفاح أنوركا',
        nameEn: 'AnnurTriComplex® (Annurca Apple Extract)',
        dose: '800 mg',
        whatItDoesAr:
          'مستخلص تفاح إيطالي نادر. أعاد نمو الشعر في دراسة على ٢٥٠ شخص خلال ٦٠ يوم. غير موجود في أي منتج ثاني في السعودية.',
        scienceSourceShort: 'Tenore et al., 2018, J Med Food. University of Naples clinical trials.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'بيوتين',
        nameEn: 'Biotin (D-Biotin)',
        dose: '10,000 mcg',
        whatItDoesAr:
          'يبني الكيراتين — البروتين اللي يتكوّن منه شعركِ. جرعة عالية لنتيجة أسرع.',
        scienceSourceShort: 'EFSA: biotin contributes to maintenance of normal hair.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'زنك',
        nameEn: 'Zinc (citrate)',
        dose: '7.5 mg',
        whatItDoesAr:
          'يُساعد البصيلة تدخل مرحلة النمو بدل ما تبقى في الراحة.',
        scienceSourceShort: 'EFSA: zinc contributes to maintenance of normal hair.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'فيتامين D3',
        nameEn: 'Vitamin D3 (cholecalciferol)',
        dose: '20 mcg (800 IU)',
        whatItDoesAr:
          'يدعم صحة البصيلات. ٨٠٪ من السعوديات عندهن نقص — وهذا مرتبط بالتساقط.',
        scienceSourceShort: 'Rasheed et al., 2013, J Cosmet Dermatol. KSA Vit D deficiency >80% in women.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'حمض الفوليك',
        nameEn: 'Folic Acid (Vitamin B9)',
        dose: '400 mcg',
        whatItDoesAr:
          'يُسرّع نمو الشعر من الأساس.',
        scienceSourceShort: 'EFSA: folate contributes to normal cell division.',
        thumbImageUrl: null,
      },
    ],

    reviews: [
      {
        authorFirstNameAr: 'رهف',
        authorCityAr: 'الرياض',
        rating: 5,
        bodyAr:
          'الشهر الثاني قارنت صورة من سنة — الكثافة واضحة والتساقط قلّ. مستخلص التفاح هذا شي ثاني.',
      },
      {
        authorFirstNameAr: 'العنود',
        authorCityAr: 'الرياض',
        rating: 5,
        bodyAr:
          'الكوافيرة سألتني: إيش سرّ شعرك؟ الجواب حبّة فيها تفاح إيطالي. أحسست بالقيمة من الشهر الثاني.',
      },
      {
        authorFirstNameAr: 'ريم',
        authorCityAr: 'جدة',
        rating: 5,
        bodyAr:
          'كنت أجمع شعر قبل الاستحمام حتى ما يسدّ الصرف. بعد شهرين — ما عاد احتاج.',
      },
    ],

    faqs: [
      {
        questionAr: 'متى أشوف نتيجة؟',
        answerAr:
          'بعد ٤ أسابيع تساقط أقل. بعد شهرين كثافة واضحة. عشان كذا نوصي بـ ٣ علب.',
      },
      {
        questionAr: 'إيش هو تفاح أنوركا؟',
        answerAr:
          'تفاح نادر من جنوب إيطاليا. باحثون اكتشفوا إنه يعيد نمو الشعر. مثبت في دراسة على ٢٥٠ شخص. غير موجود في أي منتج ثاني في السعودية.',
      },
      {
        questionAr: 'جرّبت كل شي ومفيد اشتغل. ليش هذي مختلفة؟',
        answerAr:
          'لأن أغلب المكمّلات فيها بيوتين بس. جذر تجمع ٥ مكوّنات: تفاح أنوركا + بيوتين + زنك + فيتامين D3 + حمض فوليك. كل واحد يشتغل على جزء مختلف.',
      },
      {
        questionAr: 'هل فيها جيلاتين؟',
        answerAr:
          'لا. الغلاف نباتي ١٠٠٪ وحلال.',
      },
      {
        questionAr: 'آمنة وقت الحمل؟',
        answerAr:
          'لا يُنصح بها وقت الحمل والرضاعة. استشيري طبيبكِ.',
      },
    ],

    seo: {
      titleAr: 'حبّة جذر — مستخلص تفاح أنوركا + بيوتين لشعر أكثف وأقوى · رحيق',
      descriptionAr:
        'مكوّن إيطالي أعاد نمو الشعر في ٢٥٠ امرأة خلال ٦٠ يومًا + بيوتين ١٠,٠٠٠ مكغ. دفع عند الاستلام.',
    },
  },
];

/* ─────────────────────────────────────────────────────────────
   Supporting data — benefits, how-to-use, why sections
───────────────────────────────────────────────────────────── */

export const PRODUCT_ONE_LINERS: Record<string, string> = {
  'habba-nadra': 'أستازانتين + كولاجين بحري — تجاعيد أقل ونضارة أكثر.',
  'habba-bareeq': 'فيتامين سي + حديد + نياسيناميد — تهاجم الهالات مباشرة.',
  'habba-jathr': 'تفاح أنوركا + بيوتين — شعر أكثف من الجذر.',
};

/** 3 BIG benefits with icon. Keep ULTRA short — max 4-5 words each. */
export const PRODUCT_BENEFITS: Record<string, { icon: string; text: string }[]> = {
  'habba-nadra': [
    { icon: '✨', text: 'تجاعيد أقل خلال شهر' },
    { icon: '💧', text: 'ترطيب من الداخل' },
    { icon: '🌟', text: 'إشراقة طبيعية بدون فيلتر' },
  ],
  'habba-bareeq': [
    { icon: '👁️', text: 'هالات أفتح خلال شهر' },
    { icon: '💪', text: 'حديد بدون أعراض معدة' },
    { icon: '✨', text: 'وجه مشرق بدون كونسيلر' },
  ],
  'habba-jathr': [
    { icon: '💇‍♀️', text: 'تساقط أقل خلال شهر' },
    { icon: '🌱', text: 'كثافة واضحة بعد شهرين' },
    { icon: '✨', text: 'لمعان طبيعي' },
  ],
};

/** Result timeline — answers "متى أشوف نتيجة؟" visually. */
export const PRODUCT_TIMELINE: Record<string, { when: string; result: string }[]> = {
  'habba-nadra': [
    { when: 'الأسبوع ١', result: 'ترطيب أحسن' },
    { when: 'الشهر ١', result: 'خطوط أقل' },
    { when: 'الشهر ٢', result: 'بشرة تلمع' },
    { when: 'الشهر ٣', result: 'نتيجة كاملة' },
  ],
  'habba-bareeq': [
    { when: 'الأسبوع ٢', result: 'بشرة منتعشة' },
    { when: 'الشهر ١', result: 'هالات أفتح قليلًا' },
    { when: 'الشهر ٢', result: 'فرق واضح بالصور' },
    { when: 'الشهر ٣', result: 'نتيجة كاملة' },
  ],
  'habba-jathr': [
    { when: 'الأسبوع ٤', result: 'تساقط أقل' },
    { when: 'الشهر ٢', result: 'كثافة واضحة' },
    { when: 'الشهر ٣', result: 'شعر أقوى وألمع' },
    { when: 'الشهر ٦', result: 'نتيجة كاملة' },
  ],
};

export const PRODUCT_HOW_TO_USE: Record<string, string[]> = {
  'habba-nadra': [
    'حبّتين بعد الفطور مع كوب ماء.',
    'خذيها مع الأكل — تُمتص أفضل.',
    'استمري ٩٠ يوم للنتيجة الكاملة.',
  ],
  'habba-bareeq': [
    'حبّتين بعد الفطور مع كوب ماء.',
    'لا تأخذيها مع شاي أو قهوة — انتظري ساعة.',
    'استمري ٩٠ يوم للنتيجة الكاملة.',
  ],
  'habba-jathr': [
    'حبّتين بعد الفطور مع كوب ماء.',
    'استمري ٩٠ يوم للنتيجة الكاملة.',
    'لو نسيتِ يوم — أكملي من بكرة بدون تعويض.',
  ],
};

export const PRODUCT_WHY_HEADING: Record<string, string> = {
  'habba-nadra': 'ليش من الداخل؟',
  'habba-bareeq': 'ليش مش حبّة نوم؟',
  'habba-jathr': 'ليش من الجذر؟',
};

export const PRODUCT_WHY_BODY: Record<string, string> = {
  'habba-nadra':
    'بعد سن ٢٥ بشرتكِ تفقد الكولاجين كل سنة. الكريمات ما تدخل الجلد — جزيئاتها كبيرة. نضرة تشتغل من الداخل: أستازانتين يحمي خلايا بشرتكِ، وكولاجين بحري يبني. فيتامين سي يُضاعف البناء. النتيجة مثبتة في دراسات على أكثر من ٢٠٠٠ امرأة.',
  'habba-bareeq':
    'الهالات لها ٣ أسباب: تصبّغ، نقص حديد، وتراكم ميلانين. أغلب المنتجات تحسّن النوم بس وتتمنّى يروح السواد. بريق تهاجم الأسباب الثلاثة مباشرة. فيتامين سي يُفتّح. حديد يرفع الأكسجين. نياسيناميد يوقف التصبّغ.',
  'habba-jathr':
    'الزيوت والكريمات توصل للشعرة بس — ما توصل للبصيلة. جذر تغذّي البصيلة من الداخل بمكوّن إيطالي (تفاح أنوركا) أعاد نمو الشعر في دراسة على ٢٥٠ شخص. مع بيوتين وزنك وفيتامين D3 وحمض فوليك — ٥ مكوّنات تشتغل مع بعض.',
};

export const PRODUCT_CROSS_SELLS: Record<string, string[]> = {
  'habba-nadra': ['habba-bareeq', 'habba-jathr'],
  'habba-bareeq': ['habba-nadra', 'habba-jathr'],
  'habba-jathr': ['habba-nadra', 'habba-bareeq'],
};

export const UPSELL_SKU_MAP: Record<string, string> = {
  'habba-nadra': 'habba-bareeq',
  'habba-bareeq': 'habba-nadra',
  'habba-jathr': 'habba-nadra',
};

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
