/**
 * Global FAQs — shown on Home page FAQ section and About page.
 * Product-specific FAQs live in data/products.ts.
 * All text verbatim from docs/04-copy-bank-arabic-ksa.md § FAQs.
 */
export interface Faq {
  id: string;
  questionAr: string;
  answerAr: string;
  category?: 'general' | 'shipping' | 'product' | 'trust';
}

export const GLOBAL_FAQS: Faq[] = [
  {
    id: 'faq-01',
    questionAr: 'متى يبان الفرق؟',
    answerAr:
      'أول مؤشر تلاحظينه خلال ٣٠ يوم، والنتيجة الواضحة بعد ٩٠ يوم من الاستخدام المنتظم. الجسم يحتاج وقتًا يبني — لهذا نوصي بـ ٣ علب.',
    category: 'product',
  },
  {
    id: 'faq-02',
    questionAr: 'كيف يوصل الطلب؟',
    answerAr:
      'نوصّل لجميع مناطق المملكة خلال ٢–٤ أيام عمل. الدفع عند الاستلام فقط — لا بطاقة مطلوبة.',
    category: 'shipping',
  },
  {
    id: 'faq-03',
    questionAr: 'هل المكوّنات نباتية؟',
    answerAr:
      'نعم، كل تركيباتنا تستخدم بيكتين نباتي بدلًا من الجيلاتين الحيواني. المنتج نباتي بالكامل ماعدا حبّة نورة التي تحتوي على كولاجين بحري.',
    category: 'product',
  },
  {
    id: 'faq-04',
    questionAr: 'هل يوجد فحص مخبري (COA)؟',
    answerAr:
      'نعم، كل دفعة تمرّ بفحص مخبري مستقل تحقّق من الفعالية والنقاء. شهادة COA متاحة على الطلب.',
    category: 'trust',
  },
  {
    id: 'faq-05',
    questionAr: 'هل يمكن الجمع بين المنتجات؟',
    answerAr:
      'نعم، يمكن الجمع. عميلاتنا كثيرًا تأخذ جذر في الصباح وليالي في الليل. نورة مع جذر تعطي فائدة مضاعفة للشعر والبشرة.',
    category: 'product',
  },
  {
    id: 'faq-06',
    questionAr: 'هل آمنة للحامل؟',
    answerAr:
      'لا يُنصح بأي مكمل أثناء الحمل والرضاعة بدون مراجعة طبيبكِ. أمانكِ وأمان طفلكِ أهمّ.',
    category: 'product',
  },
  {
    id: 'faq-07',
    questionAr: 'ما سياسة الإرجاع؟',
    answerAr:
      'إذا وصلكِ المنتج تالفًا أو مختلفًا عمّا طلبتِ، نعيد الإرسال أو نرجع المبلغ كاملًا خلال ٧ أيام من الاستلام. تواصلي مع خدمة العملاء.',
    category: 'shipping',
  },
  {
    id: 'faq-08',
    questionAr: 'هل الطلب يصل لجميع مناطق المملكة؟',
    answerAr:
      'نعم، نوصّل لجميع مناطق ومدن المملكة العربية السعودية.',
    category: 'shipping',
  },
];
