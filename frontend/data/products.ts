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
    nameAr: 'علكات الأستازانثين ضد التجاعيد',

    heroTagAr: 'المرآة صارت تورّيكِ خطوط ما كانت موجودة قبل؟',

    shortDescriptionAr:
      'تصحين ووجهكِ باهت، الخطوط حول العين والفم أوضح، والمكياج بدل ما يخفيها يعلّق فيها. المشكلة غالبًا مو كريم ناقص — بشرتكِ تحتاج دعم من الداخل بتركيبة سريرية: أستازانثين 8 ملجم + كولاجين بحري 3000 ملجم.',

    longDescriptionAr:
      'نضرة هي روتينكِ اليومي للبشرة من الداخل. كولاجين بحري بجرعة 3000 ملجم + أستازانثين 8 ملجم مثبت علمياً — تركيبة سريرية تبني الكولاجين المفقود وتحمي من الإجهاد التأكسدي. حبّتين بعد الفطور. خلال ٤ أسابيع تلاحظين نعومة ونضارة، ومع الاستمرار ٨-١٢ أسبوع تبدأ النتيجة تبان أكثر في المرآة.',

    ratingValue: 4.9,
    reviewCount: 387,
    stockLabelAr: 'بقي 24 علبة فقط من دفعة هذا الأسبوع.',
    coverImageUrl: '/images/products/habba-nadra/cover.webp',
    galleryImageUrls: ['/images/products/habba-nadra/cover.webp'],

    offers: [
      { code: 'T1', labelAr: 'علبة واحدة', quantity: 1, priceSar: 199, isRecommended: false },
      { code: 'T2', labelAr: 'علبتين', quantity: 2, priceSar: 279, isRecommended: false },
      { code: 'T3', labelAr: '٣ علب (الأوفر)', quantity: 3, priceSar: 349, isRecommended: true },
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
        authorFirstNameAr: 'سارة',
        authorCityAr: 'الرياض',
        rating: 5,
        bodyAr:
          'أنا قاريّة لكل ingredient label من زمان. ناما أول براند يكتب الجرعة بالملجم (3000 ملجم كولاجين و 8 ملجم أستازانثين). هذا كافي إنه يخلّيني أثق فيهم.',
      },
      {
        authorFirstNameAr: 'نورة',
        authorCityAr: 'جدة',
        rating: 5,
        bodyAr:
          'اشتريت الأستازانثين بعد ما الدكتورة قالت لي «بدل ما تروحين بوتوكس، جرّبي مضادات أكسدة قوية». فعلاً الخطوط حول عيني خفّت.',
      },
      {
        authorFirstNameAr: 'فاطمة',
        authorCityAr: 'الدمام',
        rating: 5,
        bodyAr:
          'أهم شي عندي إن العلكات SFDA و حلال. ناما واضحين من أول الموقع.',
      },
    ],

    faqs: [
      {
        questionAr: 'متى أشوف نتيجة؟',
        answerAr:
          'أغلب العميلات يلاحظون نعومة ونضارة خلال ٤ أسابيع. الخطوط والمرونة تحتاج استمرار ٨-١٢ أسبوع لأن الجسم يبني بهدوء، مو بس يغطي من الخارج.',
      },
      {
        questionAr: 'إيش الفرق عن الكولاجين العادي؟',
        answerAr:
          'كثير منتجات توقف عند الكولاجين فقط. نضرة تجمع كولاجين بحري + أستازانتين + فيتامين سي، يعني دعم للمرونة وحماية من الإجهاد التأكسدي في نفس الروتين.',
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
    nameAr: 'علكات الحديد ضد الهالات السوداء',

    heroTagAr: 'تنامين كويس… ولسه وجهكِ يقول للناس إنكِ تعبانة؟',

    shortDescriptionAr:
      'كل صباح نفس الدائرة: كونسيلر تحت العين، نظرة مرهقة، وسؤال يضايقكِ: "تعبانة؟" إذا الهالات ما راحت مع النوم، المشكلة غالبًا أعمق — نقص الحديد يقلل الأكسجين في الدم ويظهر على بشرتكِ أول شيء.',

    longDescriptionAr:
      'بريق مصممة للهالات المرتبطة بالإرهاق ونقص الحديد. حديد bisglycinate (14 ملجم — خفيف على المعدة)، حمض فوليك 400 ميكروغرام، وفيتامين سي لتحسين الامتصاص. كبسولتين بعد الفطور. خلال ٤-٦ أسابيع غالبًا يبان فرق بسيط، ومع ٨ أسابيع تبدأين تشوفين وجهكِ أفتح وأقل تعبًا.',

    ratingValue: 4.8,
    reviewCount: 293,
    stockLabelAr: 'بقي 18 علبة فقط من دفعة هذا الأسبوع.',
    coverImageUrl: '/images/products/habba-bareeq/cover.webp',
    galleryImageUrls: ['/images/products/habba-bareeq/cover.webp'],

    offers: [
      { code: 'T1', labelAr: 'علبة واحدة', quantity: 1, priceSar: 199, isRecommended: false },
      { code: 'T2', labelAr: 'علبتين', quantity: 2, priceSar: 279, isRecommended: false },
      { code: 'T3', labelAr: '٣ علب (الأوفر)', quantity: 3, priceSar: 349, isRecommended: true },
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
          'الطبيبة قالت لي عندي نقص حديد خفيف. بعد شهرين من بريق أمي قالت لي: وجهكِ مشرق اليوم. ما تغيّر نومي — تغيّر لون تحت عيني.',
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
          'حبوب الحديد العادية تعوّر معدتي. بريق ما سبّبت لي شي والهالات خفّت بعد شهر ونص.',
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
          'نوع الحديد في بريق bisglycinate، وهو عادة أخف على المعدة من أنواع الحديد التقليدية. إذا عندكِ مشكلة صحية أو تستخدمين أدوية، استشيري طبيبكِ.',
      },
      {
        questionAr: 'متى أشوف نتيجة؟',
        answerAr:
          'إذا السبب مرتبط بنقص الحديد أو الإرهاق، أول فرق غالبًا يبدأ بعد ٤-٦ أسابيع. النتيجة الأوضح تحتاج ٨ أسابيع من الاستخدام المنتظم.',
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
    nameAr: 'علكات البيوتين ضد تساقط الشعر',

    heroTagAr: 'كل استحمام يذكّركِ إن شعركِ مو مثل قبل؟',

    shortDescriptionAr:
      'شعر على المخدة، شعر بالمشط، وخصل في يدكِ بعد الاستحمام. تبدئين تغيّرين تسريحتكِ عشان تخفين الفراغات. الزيوت تلمّع الشعر من برا، بس الجذر نفسه يحتاج تغذية سريرية من الداخل: بيوتين 5,000 ميكروغرام + كولاجين + كيراتين.',

    longDescriptionAr:
      'جذر تدعم الشعر من المكان الصح: الداخل. بيوتين يساعد الحفاظ على الشعر الطبيعي (EFSA approved)، كولاجين وكيراتين يدعمون القوة واللمعان. حبّتين بعد الفطور. التساقط يحتاج صبر: غالبًا تلاحظين طيح أقل خلال ٦-٨ أسابيع، والكثافة تحتاج ٩٠ يوم لأن دورة نمو الشعر بطيئة.',

    ratingValue: 4.9,
    reviewCount: 412,
    stockLabelAr: 'بقي 32 علبة فقط من دفعة هذا الأسبوع.',
    gummiesPerBottle: 90,
    coverImageUrl: '/images/products/habba-jathr/cover.webp',
    galleryImageUrls: ['/images/products/habba-jathr/cover.webp'],

    offers: [
      { code: 'T1', labelAr: 'علبة واحدة (90 علكة)', quantity: 1, priceSar: 199, isRecommended: false },
      { code: 'T2', labelAr: 'علبتين (180 علكة)', quantity: 2, priceSar: 279, isRecommended: false },
      { code: 'T3', labelAr: '٣ علب (270 علكة — الأوفر)', quantity: 3, priceSar: 349, isRecommended: true },
    ],

    ingredients: [
      {
        nameAr: 'بيوتين',
        nameEn: 'Biotin (D-Biotin)',
        dose: '5,000 mcg',
        whatItDoesAr:
          'يبني الكيراتين — البروتين الأساسي في شعركِ وأظافركِ. جرعة 5,000 ميكروغرام لنتيجة واضحة (EFSA approved).',
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
          'الشعر بطيء بطبيعته. بعض العميلات يلاحظون طيح أقل خلال ٦-٨ أسابيع، والكثافة الواضحة تحتاج غالبًا ٩٠ يوم من الاستمرار.',
      },
      {
        questionAr: 'جرّبت بيوتين قبل وما اشتغل. ليش هذي مختلفة؟',
        answerAr:
          'لأن جذر ليست بيوتين فقط. فيها بيوتين 5,000 ميكروغرام + كولاجين + كيراتين، يعني دعم للشعر من ناحية الجذر والقوة واللمعان في نفس الروتين.',
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
        'بيوتين 5,000 ميكروغرام + كولاجين + كيراتين لدعم الشعر من الداخل. دفع عند الاستلام، ضمان ٣٠ يوم.',
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

    nameAr: 'الروتين الكامل — ٣ علكات تحارب التجاعيد والهالات والتساقط',

    heroTagAr: 'لو المشكلة مو وحدة… ليش تشترين حل واحد؟',

    shortDescriptionAr:
      'بشرة باهتة، هالات، وتساقط شعر في نفس الوقت. غالبًا جسمكِ يطلب دعم كامل، مو منتج واحد يشتغل على زاوية وينسى الباقي. الصندوق يجمع نفس المنتجات الثلاثة مع بعض: نضرة + بريق + جذر.',

    longDescriptionAr:
      'صندوق الجمال المتكامل هو نفس منتجات رحيق الثلاثة في طلب واحد: نضرة للبشرة، بريق للهالات، وجذر للشعر. روتين واضح بعد الفطور بدل ما تحتارين بين علب كثيرة. مناسب إذا تبين عناية شاملة وتوفير واضح: بدل ٥٩٧ ريال عند الشراء الفردي، تاخذين الثلاثة معًا بـ ٤٩٩ ريال.',

    ratingValue: 4.9,
    reviewCount: 312,
    stockLabelAr: 'بقي 12 صندوق فقط — العرض ينتهي قريباً.',
    coverImageUrl: '/images/products/bundle-glow-trio/cover.webp',
    galleryImageUrls: [
      '/images/products/bundle-glow-trio/cover.webp',
      '/images/products/habba-nadra/cover.webp',
      '/images/products/habba-bareeq/cover.webp',
      '/images/products/habba-jathr/cover.webp',
    ],

    offers: [
      { code: 'T1', labelAr: 'صندوق واحد = ٣ منتجات', quantity: 1, priceSar: 499, isRecommended: false },
      { code: 'T2', labelAr: 'صندوقين = ٦ منتجات', quantity: 2, priceSar: 899, isRecommended: false },
      { code: 'T3', labelAr: '٣ صناديق = ٩ منتجات', quantity: 3, priceSar: 1299, isRecommended: true },
    ],

    ingredients: [
      {
        nameAr: 'حبّة نضرة',
        nameEn: 'Habba Nadra — Anti-Wrinkle',
        dose: 'علبة كاملة',
        whatItDoesAr:
          'أستازانثين 8 ملجم + كولاجين بحري 3000 ملجم + فيتامين سي + هيالورونيك. لبشرة أكثر نضارة وتجاعيد أقل.',
        scienceSourceShort: 'Tominaga 2017, Choi 2014',
        thumbImageUrl: '/images/products/habba-nadra/cover.webp',
      },
      {
        nameAr: 'حبّة بريق',
        nameEn: 'Habba Bareeq — Dark Circles',
        dose: 'علبة كاملة',
        whatItDoesAr:
          'حديد bisglycinate 14 ملجم + حمض فوليك + فيتامين سي. دعم للهالات المرتبطة بنقص الحديد.',
        scienceSourceShort: 'Pinnell 2003, Hallberg 1995',
        thumbImageUrl: '/images/products/habba-bareeq/cover.webp',
      },
      {
        nameAr: 'حبّة جذر',
        nameEn: 'Habba Jathr — Hair Growth',
        dose: 'علبة كاملة',
        whatItDoesAr:
          'بيوتين 5,000 ميكروغرام + كولاجين + كيراتين. دعم للشعر من الداخل للقوة واللمعان وتقليل التساقط.',
        scienceSourceShort: 'Tenore 2018',
        thumbImageUrl: '/images/products/habba-jathr/cover.webp',
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
      titleAr: 'صندوق الجمال الكامل — نضرة + بريق + جذر بـ 499 ريال سعودي · رحيق',
      descriptionAr:
        'الـ 3 منتجات (نضرة + بريق + جذر) في صندوق واحد بـ 499 ريال بدلًا من 597. شحن مجاني · دفع عند الاستلام.',
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
  'habba-nadra': 'أستازانثين 8 ملجم + كولاجين 3000 ملجم — تجاعيد أقل ومرونة أكثر.',
  'habba-bareeq': 'مستخلص التوت البري + بذور العنب — هالات أفتح من الداخل.',
  'habba-jathr': 'بيوتين 5,000 ميكروغرام + كولاجين + كيراتين — شعر أكثف وأقل تساقطاً.',
  'bundle-glow-trio': 'صندوق واحد = نضرة + بريق + جذر — الحل الكامل للبشرة والهالات والشعر.',
};

/** 3 BIG benefits with icon. Keep ULTRA short — max 4-5 words each. */
export const PRODUCT_BENEFITS: Record<string, { icon: string; text: string }[]> = {
  'habba-nadra': [
    { icon: '✨', text: 'خطوط أقل خلال شهر' },
    { icon: '💧', text: 'مرونة وترطيب داخلي' },
    { icon: '🌟', text: 'بديل آمن للبوتوكس' },
  ],
  'habba-bareeq': [
    { icon: '👁️', text: 'هالات أفتح بوضوح' },
    { icon: '💪', text: 'تقوية الشعيرات الدموية' },
    { icon: '✨', text: 'كونسيلر أقل يوميًا' },
  ],
  'habba-jathr': [
    { icon: '💇‍♀️', text: 'تساقط أقل تدريجيًا' },
    { icon: '🌱', text: 'دعم الجذر والكثافة' },
    { icon: '✨', text: 'شعر أقوى باللمس' },
  ],
  'bundle-glow-trio': [
    { icon: '🎁', text: 'روتين سريري متكامل' },
    { icon: '💰', text: 'وفّري 100 ريال' },
    { icon: '🚚', text: 'شحن مجاني' },
  ],
};

/** Before / After narrative — emotional contrast. */
export const PRODUCT_BEFORE_AFTER: Record<string, { before: string[]; after: string[] }> = {
  'habba-nadra': {
    before: [
      'الخطوط حول العين والفم صارت تبان حتى مع المكياج',
      'وجهكِ يطلع باهت في الصور حتى لو نمتي كويس',
      'الكريم يعطيكِ لمعة مؤقتة… وبعد ساعات يرجع الجفاف',
      'تفتحين الكاميرا وتدورين على فلتر قبل ما تحفظين الصورة',
    ],
    after: [
      'بشرة أهدأ وأنعم مع روتين يومي بسيط',
      'مكياج أخف لأن النضارة نفسها صارت أحسن',
      'دعم للكولاجين من الداخل بدل تغطية السطح فقط',
      'صور أقرب لطبيعتكِ بدون خوف من كل خط',
    ],
  },
  'habba-bareeq': {
    before: [
      'ينقال لكِ "شكلكِ تعبانة" حتى وأنتِ مرتاحة',
      'الكونسيلر صار خطوة إجبارية قبل أي طلعة',
      'السواد تحت العين يبيّن عمركِ أكبر من إحساسكِ',
      'جرّبتي نوم أكثر وزيوت… والهالات لسه مكانها',
    ],
    after: [
      'نظرة أفتح وأقل إرهاقًا مع الاستمرار',
      'اعتماد أقل على الكونسيلر اليومي',
      'دعم للحديد وحمض الفوليك من الداخل',
      'وجهكِ يقول "مرتاحة" بدل "تعبانة"',
    ],
  },
  'habba-jathr': {
    before: [
      'تلقين شعر على المخدة، بالمشط، وبعد الاستحمام',
      'تخافين تسرّحين شعركِ لأن كل تسريحة تسحب خصل أكثر',
      'الفراغات عند المقدمة أو الفرق بدأت تلفت انتباهكِ',
      'الزيوت تلمّع الشعر، بس التساقط نفسه ما وقف',
    ],
    after: [
      'تساقط أقل تدريجيًا مع الاستخدام المنتظم',
      'دعم للجذر من الداخل بدل الاكتفاء بالسطح',
      'شعر أقوى باللمس ولمعان طبيعي أكثر',
      'تسرّحين شعركِ براحة أكبر يوم بعد يوم',
    ],
  },
  'bundle-glow-trio': {
    before: [
      'تجاعيد، هالات، وبهتان… وكل مشكلة تسحب ثقتكِ من جهة',
      'تحتارين: أبدأ بالتجاعيد؟ الهالات؟ النضارة؟',
      'تشترين منتج واحد وتبقين تحسين إن الروتين ناقص',
    ],
    after: [
      'نفس العلكات السريرية الثلاث تصل مع بعض في طلب واحد',
      'أستازانثين للتجاعيد + توت بري للهالات + جلوتاثيون للنضارة',
      'روتين شامل وتوفير ١٠٠ ريال بدل الشراء الفردي',
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
      'حديد bisglycinate ١٤ ملغ — امتصاص أفضل وأخف على المعدة',
      'حمض فوليك ٤٠٠ مكغ — يدعم تكوين خلايا الدم',
      'فيتامين سي ٨٠ ملغ — يساعد امتصاص الحديد',
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
      'بيوتين ٥,٠٠٠ مكغ — دعم للشعر الطبيعي',
      'كولاجين + كيراتين — قوة ولمعان من الداخل',
      'روتين يومي واضح بدل خلط زيوت ومنتجات كثيرة',
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
      '٣٠ يوم ضمان — لو ما حبّيتيه نردّ فلوسكِ',
    ],
  },
};

/** Result timeline — answers "متى أشوف نتيجة؟" visually. */
export const PRODUCT_TIMELINE: Record<string, { when: string; result: string }[]> = {
  'habba-nadra': [
    { when: 'الأسبوع ١-٢', result: 'روتين ثابت' },
    { when: 'الأسبوع ٤', result: 'نعومة ونضارة' },
    { when: 'الأسبوع ٨', result: 'مرونة أوضح' },
    { when: 'الأسبوع ١٢', result: 'أفضل تقييم' },
  ],
  'habba-bareeq': [
    { when: 'الأسبوع ١-٢', result: 'بدء الروتين' },
    { when: 'الأسبوع ٤', result: 'تعب أقل بالوجه' },
    { when: 'الأسبوع ٨', result: 'هالات أهدأ' },
    { when: 'الأسبوع ١٢', result: 'ثبات أفضل' },
  ],
  'habba-jathr': [
    { when: 'الأسبوع ١-٤', result: 'تغذية الجذر' },
    { when: 'الأسبوع ٦-٨', result: 'تساقط أقل' },
    { when: 'الأسبوع ١٢', result: 'قوة أوضح' },
    { when: 'بعد ٣ أشهر', result: 'تقييم الكثافة' },
  ],
  'bundle-glow-trio': [
    { when: 'الأسبوع ١-٢', result: 'روتين واضح' },
    { when: 'الأسبوع ٤', result: 'نضارة وراحة' },
    { when: 'الأسبوع ٨', result: 'فرق أوضح' },
    { when: 'الأسبوع ١٢', result: 'تقييم شامل' },
  ],
};

export const PRODUCT_HOW_TO_USE: Record<string, string[]> = {
  'habba-nadra': [
    'العلبة فيها 60 حبة (تكفي شهر كامل).',
    'حبّتين بعد الفطور مع كوب ماء.',
    'استمري شهرين للنتيجة الكاملة.',
  ],
  'habba-bareeq': [
    'العلبة فيها 60 حبة (تكفي شهر كامل).',
    'حبّتين بعد الفطور مع كوب ماء.',
    'استمري شهرين للنتيجة الكاملة.',
  ],
  'habba-jathr': [
    'العلبة فيها 90 حبة (تكفي شهر ونصف).',
    'حبّتين بعد الفطور مع كوب ماء.',
    'استمري شهرين للنتيجة الكاملة.',
  ],
  'bundle-glow-trio': [
    'كل علبة فيها 60 حبة (تكفي شهر كامل).',
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
    'بعد الـ 25 كولاجين بشرتك يقل كل سنة، والكريمات ما تسوي شيء لأنها ما تدخل الجلد. نضرة تشتغل من جوة: الأستازانتين يحمي بشرتك والكولاجين البحري يبنيها من جديد. النتيجة شفناها على أكثر من 2000 وحدة، والفرق واضح.',
  'habba-bareeq':
    'الهالات مو بس قلة نوم. أحيانًا تكون مرتبطة بنقص الحديد وضعف وصول الأكسجين. بريق تجمع الحديد، حمض الفوليك، وفيتامين سي في روتين واحد واضح.',
  'habba-jathr':
    'الزيوت والشامبوهات تشتغل من الخارج. جذر تدعم الشعر من الداخل ببيوتين، كولاجين، وكيراتين. النتيجة تحتاج استمرار لأن دورة الشعر بطيئة، لكن الروتين واضح وسهل.',
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
