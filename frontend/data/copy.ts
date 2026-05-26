/**
 * All Arabic UI strings — sourced verbatim from docs/04-copy-bank-arabic-ksa.md.
 * Never paraphrase, translate, or modify these strings.
 */

export const NAV = {
  HOME: 'الرئيسية',
  COLLECTION: 'المنتجات',
  ABOUT: 'عن رحيق',
  CONTACT: 'تواصلي معنا',
  CART: 'السلّة',
  ANNOUNCEMENT_BAR: 'شحن داخل المملكة في ١–٣ أيام · دفع عند الاستلام · ضمان رضا ١٤ يوم',
} as const;

export const CTA = {
  SHOP_NOW: 'تسوّقي الآن',
  BUY_NOW: 'اطلبي الآن — دفع عند الاستلام',
  ADD_TO_CART: 'أضيفي إلى السلّة',
  VIEW_CART: 'عرض السلّة',
  CHECKOUT: 'أكملي الطلب',
  BACK_TO_SHOPPING: 'رجوع للتسوّق',
  CONFIRM_ORDER: 'تأكيد الطلب — دفع عند الاستلام',
  ADD_UPSELL: 'أضيفيها لطلبي بـ 99 ر.س',
  SKIP_UPSELL: 'لا، شكرًا — أكملي بدون الإضافة',
} as const;

export const BADGES = {
  COD: 'الدفع عند الاستلام',
  FAST_SHIP: 'شحن سريع داخل المملكة',
  LAB_TESTED: 'مفحوصة مخبريًا',
  GMP: 'معامل بمعايير GMP',
  VEGAN: 'بدون جيلاتين حيواني',
  NO_SUGAR: 'بدون سكر مضاف',
  HALAL: 'حلال ١٠٠٪',
  KSA: 'صُمِّمت في السعودية',
} as const;

export const TOAST = {
  ADDED: 'تمت إضافتها للسلّة 🌿',
  REMOVED: 'تمت الإزالة من السلّة',
  PHONE_INVALID: 'الرجاء إدخال رقم جوال سعودي صحيح (مثال: 05XXXXXXXX)',
  ORDER_SUCCESS: 'استلمنا طلبكِ — بنكلّمكِ قريب',
  ERROR: 'صار خلل بسيط، حاولي مرة ثانية',
} as const;

export const FOOTER = {
  TAGLINE: 'رحيق — مكمّلات تليق بكِ.',
  RIGHTS: '© رحيق ٢٠٢٦ — كل الحقوق محفوظة.',
  PAYMENT: 'الدفع عند الاستلام فقط.',
  SHIPS: 'نشحن لكل مدن المملكة.',
  DISCLAIMER: 'المنتج مكمّل غذائي وليس دواءً. غير مخصص للتشخيص أو العلاج.',
  PRODUCTS_HEADING: 'منتجاتنا',
  HELP_HEADING: 'المساعدة',
  LEGAL_SHIPPING: 'سياسة الشحن',
  LEGAL_RETURNS: 'سياسة الإرجاع',
  LEGAL_PRIVACY: 'سياسة الخصوصية',
  LEGAL_TERMS: 'الشروط والأحكام',
  COPYRIGHT: '© رحيق ٢٠٢٦ — كل الحقوق محفوظة.',
  PAYMENT_NOTE: 'الدفع عند الاستلام فقط.',
} as const;

export const ANNOUNCEMENT_BAR = [
  'شحن داخل المملكة في ١–٣ أيام عمل · دفع عند الاستلام',
  'ضمان رضا ١٤ يوم · نختبر كل دفعة مخبريًا',
  'طلب ٣ علب = الأفضل قيمةً — وفّري حتى ٢٤٨ ر.س',
] as const;

export const HOME = {
  HERO: {
    EYEBROW: 'جديد · من السعودية',
    HEADLINE: 'حلوى يومية تُغنيكِ عن ١٠ مكمّلات.',
    SUBHEADLINE:
      'حبّة نضرة، حبّة بريق، حبّة جذر — تركيبات بمكوّنات عالمية، بطعم حلوى، بأمانٍ مختبري.',
    CTA_PRIMARY: 'اكتشفي المجموعة',
    CTA_SECONDARY: 'قصة رحيق ←',
  },
  TRUST_STRIP: [
    'الدفع عند الاستلام',
    'شحن ١–٣ أيام',
    'حلال ١٠٠٪',
    'بدون سكر مضاف',
    'مفحوصة مخبريًا',
  ],
  WHY: {
    HEADING: 'ليش رحيق؟',
    COLS: [
      { title: 'مكوّنات عالمية', body: 'نختار مكوّناتنا من موردين معتمدين بشهادات تحليل لكل دفعة.' },
      { title: 'يدٌ عربية', body: 'تُغلَّف في السعودية بمعايير GMP، وتمرّ بفحص استقرار قبل أن تصلكِ.' },
      { title: 'ريتوال يومي', body: 'حبّتان في اليوم — طقس صغير يذكّركِ إنّكِ الأولى.' },
    ],
  },
  PRODUCTS_ROW: {
    HEADING: 'اختاري حبّتك',
    SUB: 'كل تركيبة محسوبة لهدف واحد — ومُصاغة لتكون يومًا لذيذًا.',
  },
  RITUAL: {
    HEADING: 'حبّتان في اليوم… وانتهيتي.',
    BODY: 'صباحًا مع قهوتك، أو في وقتٍ تختارينه — رحيق يدخل روتينكِ بدون جهد. لا أقراص، لا ماء كثير، لا طعمٌ يكرهه القلب.',
  },
  PROOF: [
    { number: '+12,000', label: 'عميلة سعودية' },
    { number: '4.9 / 5', label: 'متوسط تقييم' },
    { number: '97%', label: 'نسبة الرضا' },
    { number: '1–3 أيام', label: 'للتوصيل في المدن الرئيسية' },
  ],
  FOUNDER: {
    HEADING: 'كلمة من المؤسِّسة',
    BODY: 'بدأتُ رحيق لأنّي بحثتُ طويلًا عن منتج أحبّه قبل أن أبيعه — مكمّل عربيٌّ، نظيف، بطعم لذيذ، وأمان نثق فيه. ها هو، بين يديك.',
    SIGNATURE: '— مؤسِّسة رحيق',
  },
  REVIEWS_HEADING: 'بنات رحيق يقلن',
  FAQ_HEADING: 'أسئلة شائعة',
  CLOSING_CTA: {
    EYEBROW: 'ابدئي ريتوالكِ اليوم',
    HEADLINE: 'حلوى تليق بكِ — وتشتغل لكِ.',
    CTA: 'تسوّقي المجموعة',
  },
} as const;

export const CART = {
  HEADING: 'سلّتكِ',
  EMPTY_STATE: 'سلّتكِ فاضية — اختاري حبّتكِ من المجموعة.',
  EMPTY_CTA: 'تصفّحي المجموعة',
  CROSS_SELL_HEADING: 'يضيف لطلبكِ',
  CROSS_SELL_CTA: 'أضيفي',
  SUBTOTAL: 'الإجمالي',
  FREE_SHIPPING: 'الشحن مجاني داخل المملكة',
  COD_LINE: 'الدفع عند الاستلام',
  SCARCITY: 'بقي عدد محدود من علب هذه الدفعة — احجزي طلبكِ.',
} as const;

export const CHECKOUT = {
  HEADING: 'أكملي طلبكِ — دفع عند الاستلام',
  TRUST_LINE: 'بياناتكِ تُستخدم فقط لتأكيد الطلب وتوصيله.',
  SCARCITY: 'بقي عدد محدود من علب هذه الدفعة — احجزي طلبكِ.',
  NAME_LABEL: 'الاسم الكامل',
  NAME_PLACEHOLDER: 'مثال: نورة العتيبي',
  NAME_ERROR: 'الرجاء كتابة اسمكِ.',
  PHONE_LABEL: 'رقم الجوال',
  PHONE_PLACEHOLDER: '05XXXXXXXX',
  PHONE_ERROR: 'الرجاء إدخال رقم سعودي صحيح يبدأ بـ 05 أو +966.',
  SUBMIT: 'تأكيد الطلب — دفع عند الاستلام',
  CONSENT:
    'بالضغط على "تأكيد" أوافق على الشحن عند الاستلام والاتصال بي للتأكيد.',
  TRUST_ROW: 'شحن آمن · ضمان رضا ١٤ يوم · فريق سعودي',
} as const;

export const UPSELL = {
  EYEBROW: 'عرض لمرّة واحدة — لكِ فقط الآن',
  HEADLINE_TEMPLATE: 'أضيفي حبّة {NAME} بسعر ٩٩ ر.س فقط',
  SUB: 'بدل ١٩٩ ر.س — وفّري ١٠٠ ر.س. تنطبق على هذا الطلب فقط.',
  BULLETS: [
    'تنضمّ إلى طلبكِ الحالي بدون شحن إضافي',
    'نفس الجودة، نفس الضمان',
    'لن يظهر هذا العرض مرة ثانية',
  ],
  CTA_ACCEPT: 'أضيفيها لطلبي بـ ٩٩ ر.س',
  CTA_SKIP: 'لا، شكرًا — أكملي بدون الإضافة',
} as const;

export const THANK_YOU = {
  EYEBROW: 'استلمنا طلبكِ',
  HEADLINE_TEMPLATE: 'شكرًا {NAME} — طلبكِ في أيادٍ أمينة.',
  BODY: 'راح يكلّمكِ فريق رحيق خلال ٢٤ ساعة لتأكيد العنوان وموعد الاستلام. اطمئنّي — كل شي تمام.',
  ORDER_ID_LABEL: 'رقم الطلب:',
  STEPS: ['اتصال للتأكيد', 'الشحن', 'الاستلام'],
  SUGGESTIONS: 'ربما تعجبكِ أيضًا',
  HOME_CTA: 'العودة للرئيسية',
} as const;

export const ERROR_PAGES = {
  NOT_FOUND_H1: 'الصفحة ما لقيناها.',
  NOT_FOUND_SUB: 'يمكن الرابط تغيّر. ارجعي للرئيسية وكلّ شي بخير.',
  NOT_FOUND_CTA: 'الرئيسية',
  ERROR_500_H1: 'صار شي بسيط من جهتنا.',
  ERROR_500_SUB: 'جرّبي بعد دقيقة. لو استمرّ، راسلينا على واتساب.',
} as const;

export const COOKIE_BANNER = {
  TEXT: 'نستخدم كوكيز لتحسين تجربتكِ ولتحسين إعلاناتنا. بمتابعتكِ توافقين.',
  BODY: 'نستخدم كوكيز لتحسين تجربتكِ ولتحسين إعلاناتنا. بمتابعتكِ توافقين على',
  ACCEPT: 'موافقة',
  PRIVACY_LINK: 'سياسة الخصوصية',
} as const;

export const CONTACT = {
  EYEBROW: 'تواصلي معنا',
  H1: 'هنا — للإجابة عن أي سؤال.',
  BODY: 'فريق رحيق متاح من الأحد إلى الخميس، ٩ ص — ٦ م، عبر واتساب أو البريد.',
  WHATSAPP_BTN: 'راسلينا على واتساب',
  EMAIL: 'hello@raheeqarabia.com',
  ADDRESS: 'الرياض، المملكة العربية السعودية',
  NOTE: 'الاستفسارات الطبية يفضَّل توجيهها إلى طبيب مختص.',
  WHATSAPP_NUMBER: '+966500000000',
} as const;

export const COLLECTION = {
  HERO: {
    EYEBROW: 'المجموعة الكاملة',
    H1: 'ثلاث حبّات — ثلاث طقوس.',
    SUB: 'اختاري الباقة التي تليق بأهدافكِ. كلّها بنفس وعد الجودة.',
  },
  COMBO: {
    HEADING: 'الباقة الذهبية — رحيق الكاملة',
    SUB: 'حبّة نضرة + حبّة بريق + حبّة جذر — لروتين جمال شامل.',
    NOTE: 'أضيفيها واحدةً واحدةً بالباقة الذهبية — وفّري على الكلّ بطلب ثلاث علب من نفس المنتج.',
  },
} as const;

export const ABOUT = {
  HERO: {
    EYEBROW: 'قصّة رحيق',
    H1: 'بدأت بفكرة. وانتهت بطقس يومي يُحبّ.',
    LEDE: 'رحيق ليست مجرّد علامة مكمّلات — هي محاولة عربية صادقة لإعادة كتابة العناية اليومية، بمكوّنات نثق فيها، وبأيدٍ نعرفها.',
  },
  STORY: `بدأتُ رحيق بسؤالٍ بسيط:
"ليش ما ألقى مكمّل أحبّه قبل أن أبيعه؟"
بحثتُ في مصانع عالمية، جرّبت تركيبات كثيرة، ورفضت أكثر مما قبلت.
الفكرة كانت واضحة: ثلاث حبّات تشتغل لثلاث رغبات — بشرة أصغر، هالات أفتح، شعر أكثف — بمعايير GMP، وبأمانٍ مختبري لكل دفعة، وبتغليفٍ يليق بكِ.
كنت أبحث عن منتج يجلس على طاولتي قبل أن يجلس على رفّ صيدلية.
ها هو بين يديكِ.

— مؤسِّسة رحيق`,
  PILLARS: [
    { title: 'جودة عالمية', body: 'موردين معتمدين، شهادات تحليل، فحص استقرار.' },
    { title: 'يدٌ عربية', body: 'تركيب وتغليف في السعودية بمعايير GMP.' },
    { title: 'وعد واضح', body: 'ضمان رضا ١٤ يوم — والدفع عند الاستلام دائمًا.' },
  ],
  PROCESS: ['اختيار المورد', 'فحص الجودة (COA)', 'تعبئة بمعايير GMP', 'فحص استقرار قبل الشحن'],
  CTA: 'ابدئي اليوم →',
} as const;

export const GLOBAL_FAQS = [
  {
    q: 'ما هي مكوّنات رحيق؟',
    a: 'كل علبة موضّحة فيها مكوّناتها بالتفصيل في صفحتها. نستخدم مكوّنات عالمية بمعايير GMP.',
  },
  {
    q: 'متى يبان مفعول رحيق؟',
    a: 'أوّل تغيّر ملحوظ بعد ٣٠ يومًا، ونوصي بدورة ٩٠ يومًا لأفضل نتائج.',
  },
  {
    q: 'هل آمن أثناء الحمل أو الرضاعة؟',
    a: 'لا نوصي به أثناء الحمل أو الرضاعة. استشيري طبيبكِ.',
  },
  {
    q: 'هل المنتج حلال؟',
    a: 'نعم، نستخدم بيكتين نباتي بدلًا من الجيلاتين الحيواني، وكل التركيبات حلال ١٠٠٪.',
  },
  {
    q: 'كيف الدفع والشحن؟',
    a: 'الدفع عند الاستلام لكل مدن المملكة. الشحن خلال ١–٣ أيام عمل للمدن الرئيسية.',
  },
  {
    q: 'هل يمكنني إرجاع المنتج؟',
    a: 'ضمان رضا ١٤ يومًا على العلبة المغلقة.',
  },
] as const;

export const PDP_DISCLAIMER =
  'المنتج مكمّل غذائي وليس دواءً ولا يُغني عن استشارة طبية. غير موصى به أثناء الحمل والرضاعة. اتّبعي الجرعة الموصى بها.' as const;

/**
 * Unified COPY export — use this in components for consistent access.
 * Wraps all individual exports with the exact shape that components expect.
 */
export const COPY = {
  NAV: {
    ...NAV,
  },
  CTA: {
    ...CTA,
  },
  BADGES: {
    ...BADGES,
  },
  TOAST: {
    ...TOAST,
  },
  FOOTER: {
    ...FOOTER,
  },
  COOKIE_BANNER: {
    ...COOKIE_BANNER,
  },
  CART: {
    TITLE: CART.HEADING,
    EMPTY: CART.EMPTY_STATE,
    CONTINUE_SHOPPING: CART.EMPTY_CTA,
    CROSS_SELL_HEADING: CART.CROSS_SELL_HEADING,
    SUBTOTAL: CART.SUBTOTAL,
    CHECKOUT_CTA: CTA.CHECKOUT,
    COD_NOTE: CART.COD_LINE,
    SCARCITY: CART.SCARCITY,
    FREE_SHIPPING: CART.FREE_SHIPPING,
  },
  CHECKOUT: {
    MODAL_TITLE: CHECKOUT.HEADING,
    NAME_LABEL: CHECKOUT.NAME_LABEL,
    NAME_PLACEHOLDER: CHECKOUT.NAME_PLACEHOLDER,
    NAME_ERROR: CHECKOUT.NAME_ERROR,
    PHONE_LABEL: CHECKOUT.PHONE_LABEL,
    PHONE_PLACEHOLDER: CHECKOUT.PHONE_PLACEHOLDER,
    PHONE_ERROR: CHECKOUT.PHONE_ERROR,
    PHONE_HINT: 'مثال: 0512345678 أو +966512345678',
    ORDER_SUMMARY: 'ملخص الطلب',
    TOTAL: 'الإجمالي',
    COD_NOTE: 'الدفع عند الاستلام — لا بطاقة مطلوبة.',
    SUBMIT_CTA: CHECKOUT.SUBMIT,
    TRUST_LINE: CHECKOUT.TRUST_LINE,
    CONSENT: CHECKOUT.CONSENT,
  },
  UPSELL: {
    MODAL_TITLE: 'عرض خاص — مرّة واحدة فقط',
    ONE_TIME_BADGE: 'عرض حصري',
    EYEBROW: UPSELL.EYEBROW,
    BODY: UPSELL.SUB,
    ACCEPT_CTA: UPSELL.CTA_ACCEPT,
    DECLINE_CTA: UPSELL.CTA_SKIP,
    DISCOUNT_LABEL: 'وفّري ١٠٠ ر.س',
    SUCCESS_TOAST: TOAST.ORDER_SUCCESS,
    ERROR: TOAST.ERROR,
    BULLETS: UPSELL.BULLETS,
  },
  THANK_YOU: {
    ...THANK_YOU,
  },
  ERROR_PAGES: {
    ...ERROR_PAGES,
    GENERIC: TOAST.ERROR,
  },
  CONTACT: {
    ...CONTACT,
  },
  HOME: {
    HERO_BADGE: HOME.HERO.EYEBROW,
    HERO_HEADING: HOME.HERO.HEADLINE,
    HERO_SUBHEADING: HOME.HERO.SUBHEADLINE,
    HERO_SUB: 'بيكتين نباتي · فحص COA · دفع عند الاستلام',
    HERO_CTA: HOME.HERO.CTA_PRIMARY,
    PROOF_RATING: HOME.PROOF[1].number + ' ' + HOME.PROOF[1].label,
    PROOF_ORDERS: HOME.PROOF[0].number + ' ' + HOME.PROOF[0].label,
    PROOF_KSA: 'توصيل لكل مدن المملكة',
    PRODUCTS_BADGE: HOME.PRODUCTS_ROW.HEADING,
    PRODUCTS_HEADING: 'اختاري حبّتك — كلٌّ لها قصّة.',
    PRODUCTS_SUBHEADING: HOME.PRODUCTS_ROW.SUB,
    FROM_PRICE: 'من {price} ر.س',
    HOW_HEADING: HOME.RITUAL.HEADING,
    HOW_STEPS: [
      { title: 'اختاري', body: 'نضرة للتجاعيد، بريق للهالات، أو جذر للشعر — أو الثلاثة.' },
      { title: 'اطلبي', body: 'أضيفي إلى السلّة — وأكملي طلبكِ باسمكِ وجوالكِ فقط.' },
      { title: 'انتظري', body: 'نوصّل لبابكِ خلال ١–٣ أيام. الدفع عند الاستلام.' },
    ],
    INGREDIENTS_BADGE: 'مكوّنات بشفافية',
    INGREDIENTS_HEADING: 'نختار بعناية — ونخبركِ بكل شيء.',
    INGREDIENTS_BODY: 'مكوّنات عالمية المصدر، شهادة تحليل (COA) لكل دفعة، وتركيبات مدعومة بأبحاث.',
    TRUST_PILLS: HOME.TRUST_STRIP,
    REVIEWS_BADGE: 'آراء عميلاتنا',
    REVIEWS_HEADING: HOME.REVIEWS_HEADING,
    FAQ_HEADING: HOME.FAQ_HEADING,
    FINAL_CTA_HEADING: HOME.CLOSING_CTA.HEADLINE,
    FINAL_CTA_BODY: 'حبّتان في اليوم — ريتوال يومي يعتني بكِ من الداخل.',
    FINAL_CTA_BUTTON: HOME.CLOSING_CTA.CTA,
  },
  COLLECTION: {
    ...COLLECTION,
  },
  ABOUT: {
    ...ABOUT,
  },
  PDP: {
    ADD_TO_CART: CTA.ADD_TO_CART,
    BUY_NOW: CTA.BUY_NOW,
    DISCLAIMER: PDP_DISCLAIMER,
    SCARCITY: CART.SCARCITY,
    BADGES: BADGES,
  },
} as const;
