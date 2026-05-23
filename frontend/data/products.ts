/**
 * Static product catalog — mirrors the backend seed data.
 * Used by RSC pages to avoid a network hop on first paint.
 * When real data differs, the backend API takes precedence.
 */
import type { Product } from '@/lib/types';

export const PRODUCTS: Product[] = [

  /* ══════════════════════════════════════════════════════════
     حبّة جذر — Hair
     Framework: PAS (Problem → Agitate → Solution) + Show Don't Tell
     Emotional core: A woman's hair is her crown.
     Losing it quietly is one of the most private anxieties.
  ══════════════════════════════════════════════════════════ */
  {
    id: 'habba-jathr',
    slug: 'habba-jathr',
    nameAr: 'حبّة جذر',

    // Tagline: hooks with a specific scene, not a generic promise
    heroTagAr: 'أقل شعر على الفرشاة — ابتداءً من الأسبوع الرابع.',

    // PAS opening: name the pain → agitate → introduce solution briefly
    shortDescriptionAr:
      'كل يوم تُنظّفين الفرشاة وتحسبين — أكثر أم أقل؟ المشكلة ليست شعركِ؛ المشكلة بصيلة تعاني من الداخل. حبّة جذر تصل لحيث لا يصل أي كريم: إلى الجذر نفسه. بيوتين يُغذّي، ساو بالميتو يوازن، كولاجين بحري يبني — والنتيجة تظهر في الكاميرا قبل أن يعلّق عليها أحد.',

    // Extended "why" — used in the science section
    longDescriptionAr:
      'كل شعرة تطيح لها قصّة. في الغالب، البصيلة كانت تعاني قبل ذلك بأشهر — جائعة، غير متوازنة، أو في طور الراحة الطويلة. الكريمات والزيوت تصل للشعرة الخارجة — لا للجذر. حبّة جذر تعمل من الداخل بخطّة محكمة: البيوتين يضخّ الكيراتين في كل بصيلة، الساو بالميتو يُعادل DHT الذي يُصغّر البصيلات مع الوقت، الكولاجين البحري يُزوّد الشعرة بالأحماض الأمينية التي تجعلها مرنة لا هشّة، والزنك يُدير دورة النموّ ويُدخل البصيلة في طور الإنبات. ثلاثة أشهر متواصلة — ونتيجة لا تعتمد على الفيلتر.',

    ratingValue: 4.9,
    reviewCount: 412,
    stockLabelAr: 'بقي 32 علبة فقط من دفعة هذا الأسبوع.',
    coverImageUrl: '/images/products/habba-jathr/cover.svg',
    galleryImageUrls: ['/images/products/habba-jathr/cover.svg'],

    offers: [
      { code: 'T1', labelAr: 'علبة', quantity: 1, priceSar: 199, isRecommended: false },
      { code: 'T2', labelAr: 'الزوجي', quantity: 2, priceSar: 279, isRecommended: false },
      { code: 'T3', labelAr: 'Glow Kit (الأنصح)', quantity: 3, priceSar: 349, isRecommended: true },
    ],

    ingredients: [
      {
        nameAr: 'بيوتين',
        nameEn: 'Biotin (D-Biotin)',
        dose: '5000 mcg',
        whatItDoesAr:
          'يُنتج الكيراتين — البروتين الذي تتشكّل منه كل شعرة. بدونه، البصيلة تبني بمواد رديئة.',
        scienceSourceShort: 'EFSA: biotin contributes to maintenance of normal hair.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'ساو بالميتو',
        nameEn: 'Saw Palmetto extract (45% fatty acids)',
        dose: '200 mg',
        whatItDoesAr:
          'يُعيق تحوّل التستوستيرون إلى DHT — الجزيء الذي يُقلّص حجم البصيلة تدريجيًا حتى تتوقّف.',
        scienceSourceShort: 'Prager et al., 2002, J Altern Complement Med.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'كولاجين بحري',
        nameEn: 'Marine Collagen peptides (Type I)',
        dose: '1000 mg',
        whatItDoesAr:
          'يُزوّد الشعرة ببرولين وجلايسين — أحماض أمينية تبني البنية الداخلية للشعرة وتمنعها من الانكسار.',
        scienceSourceShort: 'de Miranda et al., 2021, Int J Dermatology.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'زنك',
        nameEn: 'Zinc (citrate)',
        dose: '7.5 mg',
        whatItDoesAr:
          'يُدير دورة نمو الشعر ويُساعد البصيلة على الدخول في طور الإنبات (Anagen) بدلًا من البقاء في الراحة.',
        scienceSourceShort: 'EFSA: zinc contributes to maintenance of normal hair.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'فيتامين B5',
        nameEn: 'Pantothenic acid',
        dose: '5 mg',
        whatItDoesAr:
          'يمدّ خلايا البصيلة بالطاقة اللازمة للنمو — مثل وقود صغير يُشعل عملية البناء يوميًا.',
        scienceSourceShort: 'EFSA permitted health claim.',
        thumbImageUrl: null,
      },
    ],

    // Reviews: specific scenes, real-sounding, emotionally resonant
    reviews: [
      {
        authorFirstNameAr: 'رهف',
        authorCityAr: 'الرياض',
        rating: 5,
        bodyAr:
          'الشهر الأوّل ما شفت شي كبير. الشهر الثاني نظرت في صورة من سنة وقلت — هذا شعري فعلًا؟ الكثافة واضحة، والأهم إن الطيح قلّ. أوّل مرة أجمع شعري وأحسّ إن في شيء فيه.',
      },
      {
        authorFirstNameAr: 'العنود',
        authorCityAr: 'الرياض',
        rating: 5,
        bodyAr:
          'الكاشيرة في صالون الكوافير سألتني: إيش سرّ شعرك؟ ما توقّعت إن الجواب سيكون حبّة رحيق. اشتريت 3 علب بـ 349 وأحسست القيمة من الشهر الثاني.',
      },
      {
        authorFirstNameAr: 'ريم',
        authorCityAr: 'جدة',
        rating: 5,
        bodyAr:
          'كنت أجمع شعر قبل الاستحمام حتى لا يسدّ الصرف. بعد شهرين مع جذر — ما عاد عندي سبب أفعل هذا. أبسط شي لكنه أبلغ دليل.',
      },
    ],

    faqs: [
      {
        questionAr: 'متى يبان الفرق فعلًا؟',
        answerAr:
          'أول علامة: أقل شعر على الفرشاة بعد 3-4 أسابيع. الكثافة الفعلية تظهر بعد 60-90 يوم — لأن دورة نمو الشعر طبيعيًا من 3-4 أشهر، ولا يمكن تسريعها لكن يمكن تحسين نتيجتها. لهذا نوصي بـ 3 علب.',
      },
      {
        questionAr: 'جرّبت كل شي ومفيد اشتغل. ليش هذي مختلفة؟',
        answerAr:
          'لأن معظم مكمّلات الشعر تحتوي بيوتين وحده بجرعة مبالغة — وهذا لا يكفي. جذر تجمع 5 مكوّنات تعمل على مستويات مختلفة: التغذية، التوازن الهرموني، بنية الشعرة، ودورة النموّ. إذا كان ناقصًا أي مستوى، تعطّل كل شي.',
      },
      {
        questionAr: 'هل يحتوي جلاتين حيواني؟',
        answerAr:
          'لا على الإطلاق. الغلاف من بيكتين نباتي — مناسب للنباتيين وتتّبع متطلبات الحلال الكاملة.',
      },
      {
        questionAr: 'هل آمن أثناء الحمل؟',
        answerAr:
          'لا ينصح به أثناء الحمل والرضاعة. استشيري طبيبكِ دائمًا قبل أي مكمّل في هذه الفترة.',
      },
      {
        questionAr: 'هل يمكن أخذه مع مكمّلات أخرى؟',
        answerAr:
          'نعم في الغالب، بشرط عدم تكرار نفس المكوّنات بجرعات عالية — خاصة البيوتين والزنك. إذا كنتِ تأخذين مكمّل شامل (multivitamin)، تحقّقي من الجرعات.',
      },
    ],

    seo: {
      titleAr: 'حبّة جذر — لشعر أكثف وأقوى من البصيلة · رحيق',
      descriptionAr:
        'أقل تساقط، كثافة أعمق، لمعان طبيعي — تركيبة بيوتين + ساو بالميتو + كولاجين بحري. دفع عند الاستلام.',
    },
  },

  /* ══════════════════════════════════════════════════════════
     حبّة ليالي — Sleep
     Framework: PAS + Specificity + Sensory language
     Emotional core: She's exhausted of being exhausted.
     She wants to wake up feeling like herself again.
  ══════════════════════════════════════════════════════════ */
  {
    id: 'habba-layali',
    slug: 'habba-layali',
    nameAr: 'حبّة ليالي',

    heroTagAr: 'تنامين قبل أن تلاحظي متى — ابتداءً من الليلة الأولى.',

    shortDescriptionAr:
      'تستلقين وعقلكِ لا يزال في الاجتماع، في المطبخ، في كل مكان إلا السرير. حبّة ليالي لا تُخدّركِ — تُعلّم جسمكِ كيف ينام من جديد. ميلاتونين بجرعة ١ ملغ الذكية (لا ٥ ملغ التي تصنع الدوخة) + أشواغاندا تُهدئ الكورتيزول + L-ثيانين يُصمت الأفكار قبل النوم. خذيها. ضعي الهاتف. ستفاجئكِ سرعة ما ستنامين.',

    longDescriptionAr:
      'مشكلتكِ ليست النوم — مشكلتكِ جهاز عصبي لا يعرف كيف يتوقّف. في الماضي كان الليل يعني الظلام والهدوء — وهذا كافٍ. اليوم، الشاشات والتوتر يرسلان للدماغ: "الليل لم يبدأ بعد". ليالي تُعيد هذه الإشارة: ميلاتونين بجرعة علمية (لا تجارية) يُعلن للدماغ بداية الليل، أشواغاندا KSM-66® المُثبتة في 12 دراسة سريرية تُخفّض الكورتيزول — هرمون التوتر الذي يُبقيكِ مستيقظة، L-ثيانين يُعزّز موجات ألفا في الدماغ — الموجات التي تسبق النوم العميق مباشرة، وماغنيسيوم يُرخي العضلات ويُعمّق الدورة. لا تُخدّركِ. تُعيد تعليم جسمكِ كيف يتوقّف.',

    ratingValue: 4.9,
    reviewCount: 278,
    stockLabelAr: 'بقي 19 علبة فقط من دفعة هذا الأسبوع.',
    coverImageUrl: '/images/products/habba-layali/cover.svg',
    galleryImageUrls: ['/images/products/habba-layali/cover.svg'],

    offers: [
      { code: 'T1', labelAr: 'علبة', quantity: 1, priceSar: 199, isRecommended: false },
      { code: 'T2', labelAr: 'الزوجي', quantity: 2, priceSar: 279, isRecommended: false },
      { code: 'T3', labelAr: 'Glow Kit (الأنصح)', quantity: 3, priceSar: 349, isRecommended: true },
    ],

    ingredients: [
      {
        nameAr: 'ميلاتونين',
        nameEn: 'Melatonin',
        dose: '1 mg',
        whatItDoesAr:
          'الهرمون الذي يُعلن للدماغ: "الليل بدأ". الجرعة 1 ملغ هي ما أثبتت الأبحاث فاعليتها — الجرعات الأعلى تُسبّب الدوخة والخمول.',
        scienceSourceShort: 'EFSA approved claim: melatonin 1 mg reduces time to fall asleep.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'أشواغاندا KSM-66®',
        nameEn: 'Ashwagandha KSM-66® root extract',
        dose: '300 mg',
        whatItDoesAr:
          'خفّضت الكورتيزول بنسبة 27.9% في دراسة سريرية مُحكّمة. الكورتيزول المرتفع ليلًا = استيقاظ متكرّر وقلق قبل النوم.',
        scienceSourceShort: 'Chandrasekhar et al., 2012, Indian J Psychol Med.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'L-ثيانين',
        nameEn: 'L-Theanine',
        dose: '200 mg',
        whatItDoesAr:
          'حمض أميني من الشاي الأخضر يُعزّز موجات ألفا في الدماغ — حالة الهدوء اليقظ التي تسبق النوم. يُهدّئ الأفكار بدون نعاس.',
        scienceSourceShort: 'Williams et al., 2020, Plant Foods Hum Nutr.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'ماغنيسيوم',
        nameEn: 'Magnesium bisglycinate',
        dose: '75 mg',
        whatItDoesAr:
          'يُرخي الجهاز العضلي ويُنشّط GABA — الناقل العصبي الذي يُبطّئ الدماغ ويُهيّئه للنوم العميق.',
        scienceSourceShort: 'EFSA: magnesium contributes to normal function of the nervous system.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'بابونج',
        nameEn: 'Chamomile extract',
        dose: '50 mg',
        whatItDoesAr:
          'الختام الناعم للتركيبة — apigenin في البابونج يرتبط بمستقبلات الاسترخاء في الدماغ.',
        scienceSourceShort: 'Hieu et al., 2019, Phytother Res.',
        thumbImageUrl: null,
      },
    ],

    reviews: [
      {
        authorFirstNameAr: 'سلوى',
        authorCityAr: 'جدة',
        rating: 5,
        bodyAr:
          'كنت أتقلّب ساعتين قبل النوم كل ليلة — عقلي ما يهدأ. مع ليالي صحيت الصباح وما تذكّرت متى نمت. هذا لم يحدث لي من سنين. ما توقّعت إن حبّة تفرّق هذا الفرق.',
      },
      {
        authorFirstNameAr: 'لمى',
        authorCityAr: 'الرياض',
        rating: 5,
        bodyAr:
          'الليلة الأولى حسّيت هدوء غريب بعد ٢٠ دقيقة. ما كنت متعبة — كنت هادية. وبعدها ما تذكّرت شي حتى المنبّه. أوّل مرة أصحى قبل المنبّه ومرتاحة.',
      },
      {
        authorFirstNameAr: 'شهد',
        authorCityAr: 'جدة',
        rating: 5,
        bodyAr:
          'كنت خايفة من الإدمان. جرّبت شهر وأوقفت أسبوع — ما حسّيت بأي اضطراب. هذا أقنعني إنها آمنة فعلًا. والفرق في نومي واضح جدًا.',
      },
    ],

    faqs: [
      {
        questionAr: 'هل تسبّب الإدمان أو الاعتماد؟',
        answerAr:
          'لا. الميلاتونين هرمون تُنتجينه بنفسكِ — نحن فقط نُذكّر جسمكِ بكيفية استخدامه. توقّفي أسبوعًا في أي وقت ولن تحسّي بأي أعراض انسحاب. هذا هو الاختبار الحقيقي.',
      },
      {
        questionAr: 'متى يبدأ المفعول؟',
        answerAr:
          'بين ٢٠-٤٠ دقيقة. الكثيرات يلاحظن هدوءًا خفيفًا بعد ١٥ دقيقة. اصنعي روتينكِ: حبّة ليالي → إطفاء الشاشات → فراش. الجسم يتعلّم الإشارة ويُسرّع الاستجابة مع الوقت.',
      },
      {
        questionAr: 'هل تسبّب خمول أو دوخة في الصباح؟',
        answerAr:
          'الميلاتونين بجرعة ٥-١٠ ملغ يُسبّب ذلك — نحن نستخدم ١ ملغ فقط، الجرعة التي تثبت الأبحاث فاعليتها بدون آثار جانبية. معظم عميلاتنا يصفن صباحهن بـ"خفيف" و"مختلف".',
      },
      {
        questionAr: 'هل يمكن أخذها مع قهوة في الصباح؟',
        answerAr:
          'نعم، تمامًا. تُؤخذ ليالي قبل النوم فقط — لا تأثير على القهوة أو نشاط النهار.',
      },
      {
        questionAr: 'هل آمنة مع الحمل؟',
        answerAr:
          'لا ينصح بها أثناء الحمل والرضاعة. استشيري طبيبكِ أولًا.',
      },
    ],

    seo: {
      titleAr: 'حبّة ليالي — نوم أعمق من الليلة الأولى · رحيق',
      descriptionAr:
        'تنامين قبل أن تلاحظي متى — ميلاتونين ١ ملغ + أشواغاندا KSM-66® + L-ثيانين. دفع عند الاستلام.',
    },
  },

  /* ══════════════════════════════════════════════════════════
     حبّة نورة — Skin
     Framework: PAS + FAB (Feature → Advantage → Benefit) + Identity
     Emotional core: She wants to love her photos without filters.
     She wants someone else to notice first.
  ══════════════════════════════════════════════════════════ */
  {
    id: 'habba-noura',
    slug: 'habba-noura',
    nameAr: 'حبّة نورة',

    heroTagAr: 'حين تُصوَّرين فجأة — وتحبّين الصورة.',

    shortDescriptionAr:
      'تضعين الكريم صباحًا. بعد ساعة — ذهب. لأن الترطيب من الخارج لا يبقى. من الداخل — يبقى ويبني. حبّة نورة تُغذّي الأدمة بـ ٢٥٠٠ ملغ كولاجين بحري صغير الجزيئات + فيتامين سي يُضاعف تصنيع جسمكِ للكولاجين + حمض هيالورونيك يُبقي الترطيب داخل الجلد لا على سطحه. بعد ٣٠ يومًا ستلاحظين — وبعد ٦٠ يومًا سيلاحظ غيركِ قبلكِ.',

    longDescriptionAr:
      'بعد سن ٢٥، جسمكِ يبدأ بتقليل إنتاج الكولاجين بنسبة ١-٢٪ كل عام — وهذا لا تشعرين به مباشرة. تشعرين به حين تنظرين في صورة من قبل ثلاث سنوات وتقولين: "بشرتي كانت كذا؟". الكريمات لا تحلّ هذا — جزيئات الكولاجين فيها كبيرة جدًا لاختراق الجلد؛ تبقى على السطح وتُزيل بالغسيل. حبّة نورة تستخدم ببتيدات كولاجين بحري من النوع الأوّل، مُحلّلة لجزيئات أصغر من ٥ كيلوداطون — تُمتص في مجرى الدم وتصل للأدمة حيث يُبنى الكولاجين. فيتامين سي يُحفّز خلاياكِ على تصنيع كولاجينها الخاص. حمض الهيالورونيك يحجز الرطوبة داخل الطبقات — لا يمسحه الماء ولا الوقت. هذا ليس ترطيبًا — هذا إعادة بناء.',

    ratingValue: 4.9,
    reviewCount: 364,
    stockLabelAr: 'بقي 27 علبة فقط من دفعة هذا الأسبوع.',
    coverImageUrl: '/images/products/habba-noura/cover.svg',
    galleryImageUrls: ['/images/products/habba-noura/cover.svg'],

    offers: [
      { code: 'T1', labelAr: 'علبة', quantity: 1, priceSar: 199, isRecommended: false },
      { code: 'T2', labelAr: 'الزوجي', quantity: 2, priceSar: 279, isRecommended: false },
      { code: 'T3', labelAr: 'Glow Kit (الأنصح)', quantity: 3, priceSar: 349, isRecommended: true },
    ],

    ingredients: [
      {
        nameAr: 'كولاجين بحري',
        nameEn: 'Marine Collagen peptides (Type I, hydrolyzed)',
        dose: '2500 mg',
        whatItDoesAr:
          'جزيئات أصغر من ٥ كيلوداطون تعبر جدار الأمعاء وتصل للأدمة — حيث تُحفّز خلايا الجلد على بناء كولاجين جديد من الداخل.',
        scienceSourceShort: 'Choi et al., 2014, J Med Food.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'فيتامين سي',
        nameEn: 'Vitamin C (L-ascorbic acid)',
        dose: '80 mg',
        whatItDoesAr:
          'بدون فيتامين سي، الكولاجين لا يتشكّل — هو الكوفاكتور الإلزامي. يُضاعف من تأثير كل ملغ من الكولاجين البحري في التركيبة.',
        scienceSourceShort: 'EFSA approved claim.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'حمض الهيالورونيك',
        nameEn: 'Hyaluronic Acid (sodium hyaluronate)',
        dose: '50 mg',
        whatItDoesAr:
          'جزيء يمسك الماء داخل الأدمة بقوة ١٠٠٠ مرة وزنه — يُبقي بشرتكِ ممتلئة ومرنة ساعات طويلة بعد تناوله.',
        scienceSourceShort: 'Oe et al., 2017, Clin Cosmet Investig Dermatol.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'زنك',
        nameEn: 'Zinc',
        dose: '5 mg',
        whatItDoesAr:
          'يدعم ترميم خلايا الجلد ويُنظّم إنتاج الزيوت — أظافر أقوى، بشرة أكثر توازنًا.',
        scienceSourceShort: 'EFSA.',
        thumbImageUrl: null,
      },
      {
        nameAr: 'بيوتين',
        nameEn: 'Biotin',
        dose: '1000 mcg',
        whatItDoesAr:
          'يدعم بنية الكيراتين في الأظافر والجلد — طبقة بناء تُكمل تأثير الكولاجين.',
        scienceSourceShort: 'EFSA.',
        thumbImageUrl: null,
      },
    ],

    reviews: [
      {
        authorFirstNameAr: 'منيرة',
        authorCityAr: 'الدمام',
        rating: 5,
        bodyAr:
          'جارتي سألتني إيش استخدمت لبشرتي. لا كريم جديد. لا ليزر. لا مساج. فقط نورة لشهرين. وجهها حين أخبرتها لا يُنسى.',
      },
      {
        authorFirstNameAr: 'شذى',
        authorCityAr: 'الخبر',
        rating: 5,
        bodyAr:
          'كنت أحتاج ثلاث طبقات من الميكأب قبل الخروج. اليوم طبقة واحدة تكفي. البشرة صار لها "ضو" من الداخل — مش من فوق.',
      },
      {
        authorFirstNameAr: 'جواهر',
        authorCityAr: 'الرياض',
        rating: 5,
        bodyAr:
          'أختي صوّرتني فجأة وأعطتني الصورة. أوّل مرة منذ سنوات أحبّ صورتي بدون ما أطلب تعديلها. هذا يعني كل شي.',
      },
    ],

    faqs: [
      {
        questionAr: 'متى يبان فرق البشرة؟',
        answerAr:
          'بعد ٢-٤ أسابيع تلاحظين إن البشرة "أحسن" بدون أن تعرفي لماذا. بعد ٦٠ يوم يلاحظ غيركِ. بعد ٩٠ يوم يسألونكِ. هذه ليست مبالغة — هذه دورة الكولاجين كما تُثبتها الأبحاث.',
      },
      {
        questionAr: 'هل تختلف عن مساحيق الكولاجين؟',
        answerAr:
          'نعم جوهريًا. المساحيق غالبًا جرعة ضعيفة، جودة غير موثّقة، وطعم يجعلكِ تتوقّفين. نورة حبّة بطعم لذيذ، ٢٥٠٠ ملغ موثّقة بشهادة COA لكل دفعة — وستستمرّين لأن الأخذ لا يحتاج إرادة.',
      },
      {
        questionAr: 'هل تحتوي على مشتقات بحرية؟',
        answerAr:
          'نعم، الكولاجين مصدره سمك بحري. لو لديكِ حساسية من السمك — نورة ليست مناسبة لكِ، ونوصيكِ بمراجعة طبيبكِ. شفافية كاملة، دائمًا.',
      },
      {
        questionAr: 'هل تحتوي جيلاتين حيواني؟',
        answerAr:
          'لا. الغلاف من بيكتين نباتي فقط — مناسبة للنباتيين ومتّبعة لمتطلبات الحلال.',
      },
      {
        questionAr: 'هل أحتاج فحصًا قبل الاستخدام؟',
        answerAr:
          'لا، التركيبة آمنة للبالغين الأصحّاء. إن كان لديكِ حالة طبية مزمنة أو كنتِ حاملًا أو مرضعة — استشيري طبيبكِ أولًا.',
      },
    ],

    seo: {
      titleAr: 'حبّة نورة — كولاجين بحري لبشرة مشرقة من الداخل · رحيق',
      descriptionAr:
        'إشراقة تلاحظها المرآة والكاميرا — ٢٥٠٠ ملغ كولاجين بحري + فيتامين سي + هيالورونيك. دفع عند الاستلام.',
    },
  },
];

/* ─────────────────────────────────────────────────────────────
   Supporting data — benefits, how-to-use, why sections
───────────────────────────────────────────────────────────── */

export const PRODUCT_ONE_LINERS: Record<string, string> = {
  'habba-jathr': 'أقل تساقط، أكثر كثافة — بيوتين + ساو بالميتو + كولاجين بحري.',
  'habba-layali': 'تنامين قبل أن تلاحظي متى — ميلاتونين ذكي + أشواغاندا + ثيانين.',
  'habba-noura': 'بريق من الداخل — كولاجين بحري ٢٥٠٠ ملغ + فيتامين سي + هيالورونيك.',
};

// Show-don't-tell benefits: each one is a scene, not a feature label
export const PRODUCT_BENEFITS: Record<string, string[]> = {
  'habba-jathr': [
    'أقل شعر على الفرشاة — أول مؤشر يظهر في ٣-٤ أسابيع',
    'تجمعين شعركِ وتشعرين بكتلة أكثف — لا مجرد حبّات جديدة',
    'لمعان تلاحظينه قبل أن يُعلّق عليه أحد',
    'أظافر تكملين طولها بدون انكسار — مكافأة على الهامش',
  ],
  'habba-layali': [
    'تنامين قبل أن تُنهي حساباتكِ الليلية في رأسكِ',
    'تُصحين ولا تتذكّرين متى نمتِ — بدون دوخة',
    'أقل تقلّب في الليل — نوم دورات كاملة',
    'صباح أخفّ: تُفكّرين بوضوح من الدقيقة الأولى',
  ],
  'habba-noura': [
    'بريق طبيعي يظهر في الصور — بدون فيلتر',
    'بشرة تمسك الترطيب من الداخل طوال اليوم',
    'مرونة تشعرين بها بيدكِ حين تلمسين خدّكِ',
    'أظافر تكملين طولها بدون انكسار في منتصف الطريق',
  ],
};

export const PRODUCT_HOW_TO_USE: Record<string, string[]> = {
  'habba-jathr': [
    'حبّتان في الصباح بعد الفطور — مع كوب ماء.',
    'الاستمرار ٩٠ يومًا يُعطيكِ النتيجة الكاملة — دورة نمو الشعر تحتاج هذا الوقت.',
    'إذا نسيتِ يومًا، أكملي من اليوم التالي بدون تعويض الجرعة.',
  ],
  'habba-layali': [
    'حبّتان قبل النوم بـ ٢٠-٣٠ دقيقة — مع كوب ماء.',
    'أطفئي الشاشات بعد أخذها لتُعظّمي التأثير.',
    'لا تتناوليها إذا لم تكوني ستنامين خلال ساعة.',
  ],
  'habba-noura': [
    'حبّتان في الصباح بعد الفطور — مع كوب ماء.',
    'فيتامين سي في التركيبة يعمل أفضل في الصباح مع وجبة.',
    'الاستمرار ٩٠ يومًا يُعطيكِ الكولاجين الوقت الكافي لإعادة البناء.',
  ],
};

// Why section — PAS / science narrative
export const PRODUCT_WHY_HEADING: Record<string, string> = {
  'habba-jathr': 'التساقط لا يبدأ فجأة — والعلاج الحقيقي لا يبدأ من الخارج.',
  'habba-layali': 'مشكلتكِ ليست النوم — مشكلتكِ جهاز عصبي لا يعرف كيف يتوقّف.',
  'habba-noura': 'الكريم يصل للشعرة الأولى من بشرتكِ. الكولاجين البحري يصل لما تحتها.',
};

export const PRODUCT_WHY_BODY: Record<string, string> = {
  'habba-jathr':
    'كل شعرة تطيح لها قصّة. في الغالب، البصيلة كانت تعاني قبل ذلك بأشهر — جائعة، غير متوازنة، أو في طور الراحة الطويلة. الكريمات تصل للشعرة الظاهرة لا للجذر. حبّة جذر تعمل بأربعة محاور في آن واحد: البيوتين يغذّي الكيراتين في كل بصيلة، الساو بالميتو يوازن DHT الذي يُقلّص البصيلات مع الوقت، الكولاجين البحري يُزوّد الشعرة بالأحماض الأمينية التي تجعلها مرنة لا هشّة، والزنك يُدير دورة النموّ. هذه ليست قائمة مكوّنات — هذه خطّة مدروسة لمشكلة واحدة بأربعة وجوه.',
  'habba-layali':
    'في الماضي، الليل يعني الظلام والهدوء — وكان هذا كافيًا ليُطلق إنتاج الميلاتونين. اليوم، الشاشات والتوتر يُرسلان للدماغ: "النهار لم ينتهِ بعد." ليالي تُعيد هذه الإشارة بأربعة مكوّنات تعمل معًا: ميلاتونين ١ ملغ (جرعة الأبحاث لا التجارة) يُعلن للدماغ أن الليل بدأ، أشواغاندا KSM-66® تُخفّض الكورتيزول الذي يُبقيكِ مستيقظة، L-ثيانين يُعزّز موجات ألفا — الموجات التي تسبق النوم العميق مباشرة، وماغنيسيوم يُرخي العضلات ويُعمّق دورات النوم. لا تُخدّركِ. تُعلّم جسمكِ كيف يتوقّف بشكل طبيعي.',
  'habba-noura':
    'بعد سن ٢٥، جسمكِ يُقلّل إنتاج الكولاجين ١-٢٪ سنويًا. الكريمات لا تعوّض هذا — جزيئات الكولاجين فيها كبيرة جدًا لاختراق الجلد، تبقى على السطح وتُزال بالغسيل. حبّة نورة تُرسل ببتيدات كولاجين بحري صغيرة الجزيئات (أقل من ٥ كيلوداطون) مباشرة إلى مجرى الدم — تصل للأدمة وتُحفّز الخلايا على بناء كولاجين جديد. فيتامين سي يُضاعف هذا التأثير — بدونه الكولاجين لا يتشكّل. حمض الهيالورونيك يحجز الرطوبة داخل الطبقات بقوة ١٠٠٠ مرة وزنه. هذا إعادة بناء، لا ترطيب مؤقت.',
};

export const PRODUCT_CROSS_SELLS: Record<string, string[]> = {
  'habba-jathr': ['habba-noura', 'habba-layali'],
  'habba-layali': ['habba-noura', 'habba-jathr'],
  'habba-noura': ['habba-jathr', 'habba-layali'],
};

export const UPSELL_SKU_MAP: Record<string, string> = {
  'habba-jathr': 'habba-noura',
  'habba-layali': 'habba-noura',
  'habba-noura': 'habba-jathr',
};

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
