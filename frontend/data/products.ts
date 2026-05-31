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
     Hero ingredient: Iron bisglycinate + Folic Acid (capsules, gold premium bottle)
  ══════════════════════════════════════════════════════════ */
  {
    id: 'habba-bareeq',
    slug: 'habba-bareeq',
    nameAr: 'حبّة بريق',

    heroTagAr: 'هالات أفتح. بدون كونسيلر.',

    shortDescriptionAr:
      'الهالات السوداء سببها الأول نقص الحديد — وهذا يصيب ٣٠-٤٠٪ من النساء في السعودية. كبسولة بريق ترفع الحديد وحمض الفوليك فيرجع لون بشرتكِ الطبيعي تحت العين.',

    longDescriptionAr:
      'الهالات مش مشكلة نوم. هي مشكلة نقص حديد — الدم ما يوصل أكسجين كافي للبشرة الرقيقة تحت العين فيبان السواد. بريق فيها حديد سهل الامتصاص (bisglycinate) + حمض الفوليك اللي يبني خلايا دم حمراء جديدة. كبسولتين بالصباح — وخلال شهر يبدأ اللون يتحسّن.',

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
        nameAr: 'حديد',
        nameEn: 'Iron (bisglycinate — highly absorbable)',
        dose: '14 mg',
        whatItDoesAr:
          '٣٠-٤٠٪ من السعوديات عندهن نقص حديد — وهذا السبب الأول للهالات. يرفع الأكسجين في الدم فيخف السواد. خفيف على المعدة.',
        scienceSourceShort: 'EFSA: iron contributes to normal oxygen transport. KSA iron deficiency prevalence: 30-40% in women.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'حمض الفوليك',
        nameEn: 'Folic Acid (Vitamin B9)',
        dose: '400 mcg',
        whatItDoesAr:
          'يبني خلايا دم حمراء جديدة — يُعزّز عمل الحديد ويساعد بشرتكِ تتجدّد.',
        scienceSourceShort: 'EFSA: folate contributes to normal blood formation and cell division.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'فيتامين سي',
        nameEn: 'Vitamin C (L-ascorbic acid)',
        dose: '80 mg',
        whatItDoesAr:
          'يُضاعف امتصاص الحديد ويُفتّح التصبّغ تحت العين.',
        scienceSourceShort: 'EFSA: Vit C increases iron absorption.',
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
        questionAr: 'ليش كبسولة مش حلوى؟',
        answerAr:
          'الحديد بجرعة فعّالة يصعب وضعه في حلوى بسبب الطعم المعدني. الكبسولة تضمن جرعة كاملة بدون أي طعم.',
      },
      {
        questionAr: 'الحديد يسبّب إمساك؟',
        answerAr:
          'لا. نوع الحديد في بريق (bisglycinate) خفيف على المعدة — أغلب عميلاتنا ما يحسّون بأي شي.',
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
      titleAr: 'حبّة بريق — حديد + حمض فوليك ضد الهالات السوداء · رحيق',
      descriptionAr:
        'الهالات سببها نقص الحديد. كبسولة بريق ترفع الحديد وحمض الفوليك فيرجع لون بشرتكِ الطبيعي. دفع عند الاستلام.',
    },
  },

  /* ══════════════════════════════════════════════════════════
     حبّة جذر — Women's Hair Growth
     Framework: PAS + Unique Ingredient Story
     Emotional core: A woman's hair is her crown.
     Thinning is a private shame she checks every morning.
     Hero ingredient: Biotin + Collagen (raspberry gummies, 90 count)
     Supporting: Vitamin B complex + Keratin
  ══════════════════════════════════════════════════════════ */
  {
    id: 'habba-jathr',
    slug: 'habba-jathr',
    nameAr: 'حبّة جذر',

    heroTagAr: 'شعر أكثف. تساقط أقل. من الجذر.',

    shortDescriptionAr:
      'حلوى توت لذيذة تغذّي شعركِ من الداخل. بيوتين يبني الكيراتين + كولاجين يقوّي البصيلة. حبّتين بالصباح — بعد شهرين تلاحظين الفرق في الكثافة.',

    longDescriptionAr:
      'الشعر يحتاج بناء من الداخل — الزيوت والكريمات ما توصل للجذر. جذر فيها بيوتين بجرعة عالية يبني الكيراتين (البروتين الأساسي في شعركِ) + كولاجين يقوّي البصيلة ويمنع التقصّف. بنكهة التوت — حبّتين بالصباح وخلال شهرين تلاحظين تساقط أقل وكثافة أكثر.',

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
        nameAr: 'بيوتين',
        nameEn: 'Biotin (D-Biotin)',
        dose: '5,000 mcg',
        whatItDoesAr:
          'يبني الكيراتين — البروتين الأساسي في شعركِ وأظافركِ. جرعة عالية لنتيجة واضحة.',
        scienceSourceShort: 'EFSA: biotin contributes to maintenance of normal hair.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'كولاجين',
        nameEn: 'Collagen (hydrolyzed)',
        dose: '100 mg',
        whatItDoesAr:
          'يقوّي بصيلة الشعر ويمنع التقصّف — شعر أقوى من الجذر.',
        scienceSourceShort: 'Hexsel et al., 2017, J Cosmet Dermatol.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'كيراتين',
        nameEn: 'Keratin',
        dose: '50 mg',
        whatItDoesAr:
          'يعوّض الكيراتين المفقود مباشرة — لمعان وقوّة من أوّل شهر.',
        scienceSourceShort: 'Beer et al., 2014, J Clin Aesthet Dermatol.',
        thumbImageUrl: null,
      },
    ],

    reviews: [
      {
        authorFirstNameAr: 'رهف',
        authorCityAr: 'الرياض',
        rating: 5,
        bodyAr:
          'الشهر الثاني قارنت صورة من سنة — الكثافة واضحة والتساقط قلّ. وطعم التوت لذيذ.',
      },
      {
        authorFirstNameAr: 'العنود',
        authorCityAr: 'الرياض',
        rating: 5,
        bodyAr:
          'الكوافيرة سألتني: إيش سرّ شعرك؟ بيوتين + كولاجين بحلوى. أحسست بالقيمة من الشهر الثاني.',
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
        questionAr: 'جرّبت بيوتين قبل وما اشتغل. ليش هذي مختلفة؟',
        answerAr:
          'لأن أغلب المكمّلات فيها بيوتين بس. جذر تجمع بيوتين + كولاجين + كيراتين — ثلاثة مكوّنات تشتغل سوا على الشعر من كل جهة.',
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
      titleAr: 'حبّة جذر — بيوتين + كولاجين + كيراتين لشعر أكثف وأقوى · رحيق',
      descriptionAr:
        'مكوّن إيطالي أعاد نمو الشعر في ٢٥٠ امرأة خلال ٦٠ يومًا + بيوتين ١٠,٠٠٠ مكغ. دفع عند الاستلام.',
    },
  },

  /* ══════════════════════════════════════════════════════════
     صندوق الجمال الكامل — Bundle: نضرة + بريق + جذر
     High-AOV play. One box of each, packaged together.
     Single tier (no qty switching) to keep checkout simple.
  ══════════════════════════════════════════════════════════ */
  {
    id: 'bundle-glow-trio',
    slug: 'bundle-glow-trio',

    nameAr: 'صندوق الجمال الكامل',

    heroTagAr: 'بشرة + هالات + شعر · الـ 3 منتجات مع بعض — وفّري 100 ريال سعودي',

    shortDescriptionAr:
      'الـ 3 منتجات اللي تحتاجينها لجمالكِ الكامل، في صندوق واحد. سعر أقل من الشراء الفردي بـ 100 ريال سعودي.',

    longDescriptionAr:
      'بدل ما تطلبين كل منتج بـ 199 ريال سعودي (المجموع 597)، خذي الصندوق الكامل بـ 499 ريال سعودي. حبّة نضرة لبشرتكِ + حبّة بريق لهالاتكِ + حبّة جذر لشعركِ — كل شيء يشتغل سوا لمدة شهر كامل. الطريقة الأكفى للنتيجة الشاملة.',

    ratingValue: 4.9,
    reviewCount: 142,
    stockLabelAr: 'بقي 12 صندوق فقط من دفعة هذا الأسبوع.',
    coverImageUrl: '/images/products/habba-nadra/cover.png',
    galleryImageUrls: [
      '/images/products/habba-nadra/cover.png',
      '/images/products/habba-bareeq/cover.png',
      '/images/products/habba-jathr/cover.png',
    ],

    offers: [
      { code: 'T1', labelAr: 'صندوق شهر', quantity: 1, priceSar: 499, isRecommended: false },
      { code: 'T2', labelAr: 'صندوقين (شهرين)', quantity: 2, priceSar: 899, isRecommended: false },
      { code: 'T3', labelAr: '3 صناديق (الأنصح)', quantity: 3, priceSar: 1299, isRecommended: true },
    ],

    ingredients: [
      {
        nameAr: 'حبّة نضرة',
        nameEn: 'Habba Nadra — Anti-Wrinkle',
        dose: 'علبة كاملة',
        whatItDoesAr:
          'أستازانتين + كولاجين بحري + فيتامين سي + هيالورونيك. لبشرة أكثر نضارة وتجاعيد أقل.',
        scienceSourceShort: 'Tominaga 2017, Choi 2014',
        thumbImageUrl: '/images/products/habba-nadra/cover.png',
      },
      {
        nameAr: 'حبّة بريق',
        nameEn: 'Habba Bareeq — Dark Circles',
        dose: 'علبة كاملة',
        whatItDoesAr:
          'فيتامين سي + حديد bisglycinate + نياسيناميد. تهاجم الهالات من 3 جهات.',
        scienceSourceShort: 'Pinnell 2003, Hallberg 1995',
        thumbImageUrl: '/images/products/habba-bareeq/cover.png',
      },
      {
        nameAr: 'حبّة جذر',
        nameEn: 'Habba Jathr — Hair Growth',
        dose: 'علبة كاملة',
        whatItDoesAr:
          'مستخلص تفاح أنوركا + بيوتين + فيتامين D3 + زنك. لشعر أكثف من الجذر.',
        scienceSourceShort: 'Tenore 2018',
        thumbImageUrl: '/images/products/habba-jathr/cover.png',
      },
    ],

    reviews: [
      {
        authorFirstNameAr: 'نوف',
        authorCityAr: 'الرياض',
        rating: 5,
        bodyAr:
          'أخذت الصندوق الكامل أرخص بكثير من الشراء الفردي. بعد شهرين فرق ملحوظ في وجهي وشعري. أنصح فيه بقوة.',
      },
      {
        authorFirstNameAr: 'دانة',
        authorCityAr: 'جدة',
        rating: 5,
        bodyAr:
          'أحلى استثمار سويته لنفسي. الـ 3 منتجات مع بعض = نتيجة شاملة. وفّرت 100 ريال على الصندوق.',
      },
      {
        authorFirstNameAr: 'ريم',
        authorCityAr: 'الخبر',
        rating: 5,
        bodyAr:
          'البكج رهيب جدًا. كل شيء يجي مع بعض، طبّقت الروتين بسهولة. شكرًا رحيق.',
      },
    ],

    faqs: [
      {
        questionAr: 'كم يكفي الصندوق؟',
        answerAr: 'الصندوق يكفي شهر كامل من الـ 3 منتجات. حبّتين بالصباح من كل واحدة.',
      },
      {
        questionAr: 'هل أقدر آخذ الـ 3 مع بعض؟',
        answerAr: 'نعم بدون أي مشكلة. كل المكوّنات آمنة مع بعض، وحلال 100%.',
      },
      {
        questionAr: 'كم أوفّر مقارنة بالشراء الفردي؟',
        answerAr: 'كل منتج بـ 199 ريال = المجموع 597. الصندوق بـ 499 ريال. توفير 100 ريال + شحن مجاني.',
      },
      {
        questionAr: 'هل الدفع عند الاستلام؟',
        answerAr: 'نعم. تدفعين كاش لمندوب التوصيل لما يوصلكِ الصندوق.',
      },
    ],

    seo: {
      titleAr: 'صندوق الجمال الكامل — بشرة + هالات + شعر بـ 499 ريال سعودي · رحيق',
      descriptionAr:
        'الـ 3 منتجات (نضرة + بريق + جذر) في صندوق واحد بـ 499 ريال سعودي بدلًا من 597. شحن مجاني · دفع عند الاستلام.',
    },
  },
];

/* ─────────────────────────────────────────────────────────────
   Supporting data — benefits, how-to-use, why sections
───────────────────────────────────────────────────────────── */

/** The 3 individual products (excludes the bundle SKU). */
export const MAIN_PRODUCTS: Product[] = PRODUCTS.filter((p) => p.slug !== 'bundle-glow-trio');

/** The bundle SKU — used in dedicated bundle sections + PDP. */
export const BUNDLE_PRODUCT: Product = PRODUCTS.find((p) => p.slug === 'bundle-glow-trio')!;

export const PRODUCT_ONE_LINERS: Record<string, string> = {
  'habba-nadra': 'أستازانتين + كولاجين بحري — تجاعيد أقل ونضارة أكثر.',
  'habba-bareeq': 'فيتامين سي + حديد + نياسيناميد — تهاجم الهالات مباشرة.',
  'habba-jathr': 'تفاح أنوركا + بيوتين — شعر أكثف من الجذر.',
  'bundle-glow-trio': 'الـ 3 منتجات معًا — توفير 100 ريال سعودي + شحن مجاني.',
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
  'bundle-glow-trio': [
    { icon: '🎁', text: 'الـ 3 منتجات في صندوق واحد' },
    { icon: '💰', text: 'وفّري 100 ريال سعودي' },
    { icon: '🚚', text: 'شحن مجاني · شهر كامل' },
  ],
};

/** Before / After narrative — emotional contrast. */
export const PRODUCT_BEFORE_AFTER: Record<string, { before: string[]; after: string[] }> = {
  'habba-nadra': {
    before: [
      'تنظرين في المرآة وتلاحظين خطوط جديدة كل شهر',
      'تحتاجين ٣ طبقات ميك أب عشان البشرة تبان نضرة',
      'الكريمات تبقى على وجهكِ — ما تدخل الجلد',
      'تتجنّبين الصور بدون فيلتر',
    ],
    after: [
      'البشرة ممتلئة ومرنة بدون كريمات',
      'طبقة ميك أب واحدة تكفي — أو ما تحتاجين أصلًا',
      'مكوّنات تشتغل من داخل بشرتكِ',
      'تحبّين صورتكِ — بدون تعديل',
    ],
  },
  'habba-bareeq': {
    before: [
      'الناس يسألونكِ "تعبانة؟" وأنتِ مرتاحة',
      'كونسيلر كل يوم — حتى داخل البيت',
      'حبوب نوم وزيوت ما حلّت السواد',
      'تتجنّبين تصوير وجهكِ بدون فلاش',
    ],
    after: [
      'وجه مشرق — يسألونكِ "إيش سرّكِ؟"',
      'بدون كونسيلر — تطلعين بثقة',
      'هالات أفتح بسبب علاج الأسباب الحقيقية',
      'تطلعين صور بدون خوف',
    ],
  },
  'habba-jathr': {
    before: [
      'شعر على المخدة كل صباح',
      'تجمعين شعر قبل الاستحمام عشان ما يسدّ الصرف',
      'الزيوت والكريمات ما وصلت للجذر',
      'تخفين الفراغات بتسريحات معيّنة',
    ],
    after: [
      'تساقط أقل ملحوظ من الأسبوع الرابع',
      'كثافة واضحة بعد شهرين',
      'مكوّن إيطالي مثبت سريريًا',
      'تختارين تسريحتكِ بدون قلق',
    ],
  },
  'bundle-glow-trio': {
    before: [
      'تطلبين منتج واحد، وتنسين الباقي',
      'بشرة جيدة، لكن هالات أو شعر يقلقكِ',
      'تدفعين 597 ريال لو طلبتيها فردي',
    ],
    after: [
      'الـ 3 منتجات يصلون مع بعض — روتين كامل',
      'بشرة + هالات + شعر — كل شيء يشتغل سوا',
      'تدفعين 499 ريال فقط — وفّرتي 100',
    ],
  },
};

/** Why us — logical + emotional reasons to buy. */
export const PRODUCT_WHY_US: Record<string, { logic: string[]; emotion: string[] }> = {
  'habba-nadra': {
    logic: [
      'أستازانتين بجرعة ٨ ملغ — مثبت في دراسات على ٢٠٠٠+ امرأة',
      'كولاجين بحري ٣٠٠٠ ملغ — جزيئات صغيرة تصل للأدمة',
      'فحص مخبري لكل دفعة + شهادة COA',
      'تركيبة حلال ١٠٠٪ بدون جيلاتين حيواني',
    ],
    emotion: [
      'بشرتكِ تستحق أكثر من كريم سطحي',
      'النضارة الحقيقية تبدأ من الداخل',
      'صورتكِ بدون فيلتر — أجمل تذكار',
      '٣٠ يوم — أو نردّ فلوسكِ كاملة',
    ],
  },
  'habba-bareeq': {
    logic: [
      'فيتامين سي ٨٠ ملغ — يُفتّح التصبّغ مباشرة',
      'حديد bisglycinate ١٤ ملغ — أعلى امتصاص، أقل أعراض',
      'نياسيناميد ١٦ ملغ — يوقف التصبّغ من مصدره',
      'فحص مخبري لكل دفعة + شهادة COA',
    ],
    emotion: [
      'كفاية إخفاء — وقت العلاج الحقيقي',
      'وجهكِ ما يستحق سؤال "تعبانة؟"',
      'الثقة تبدأ من إشراقة طبيعية',
      '٣٠ يوم — أو نردّ فلوسكِ كاملة',
    ],
  },
  'habba-jathr': {
    logic: [
      'مستخلص تفاح أنوركا — مثبت سريريًا على ٢٥٠ شخص',
      'بيوتين ١٠,٠٠٠ مكغ — جرعة كاملة لبناء الكيراتين',
      'فيتامين D3 + زنك + حديد + حمض فوليك',
      'فحص مخبري لكل دفعة + شهادة COA',
    ],
    emotion: [
      'شعركِ هويتكِ — استحق الاستثمار',
      'مكوّن إيطالي ما يدخل السعودية في أي منتج آخر',
      'كثافة طبيعية بدون إكستنشن',
      '٣٠ يوم — أو نردّ فلوسكِ كاملة',
    ],
  },
  'bundle-glow-trio': {
    logic: [
      'الـ 3 منتجات بـ 499 ريال سعودي بدلًا من 597 — توفير 100',
      'شحن مجاني — العرض الأكفى لكل ريال',
      'كل منتج بفحص مخبري لكل دفعة + شهادة COA',
      'تركيبة حلال 100% — بدون جيلاتين حيواني',
    ],
    emotion: [
      'جمالكِ ما هو جزء واحد — البشرة والشعر والعيون مع بعض',
      'صندوق واحد، روتين متكامل، نتيجة شاملة',
      'هدية لنفسكِ تستحقّينها كل يوم',
      '14 يوم ضمان — لو ما حبّيتيه نردّ فلوسكِ',
    ],
  },
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
  'bundle-glow-trio': [
    { when: 'الأسبوع ١', result: 'ترطيب وانتعاش' },
    { when: 'الشهر ١', result: 'هالات أفتح + تساقط أقل' },
    { when: 'الشهر ٢', result: 'بشرة تلمع + شعر يكثف' },
    { when: 'الشهر ٣', result: 'تحوّل شامل' },
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
  'bundle-glow-trio': [
    'افتحي الصندوق — تلقين الـ 3 منتجات داخل.',
    'حبّتين من كل منتج بعد الفطور مع كوب ماء.',
    'استمري شهر كامل — وراح تشوفين التحوّل.',
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
  'bundle-glow-trio': ['habba-nadra', 'habba-bareeq'],
};

export const UPSELL_SKU_MAP: Record<string, string> = {
  'habba-nadra': 'habba-bareeq',
  'habba-bareeq': 'habba-nadra',
  'habba-jathr': 'habba-nadra',
};

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
