/**
 * Global reviews — shown on Home page and Collection page.
 * Product-specific reviews live in data/products.ts.
 */
export interface GlobalReview {
  id: string;
  authorFirstNameAr: string;
  authorCityAr: string;
  productNameAr: string;
  productSlug: string;
  rating: 5;
  bodyAr: string;
  imageSrc?: string;
}

export const GLOBAL_REVIEWS: GlobalReview[] = [
  {
    id: 'r1',
    authorFirstNameAr: 'منيرة',
    authorCityAr: 'الدمام',
    productNameAr: 'حبّة نضرة',
    productSlug: 'habba-nadra',
    rating: 5,
    bodyAr:
      'بعد ٦ أسابيع مع نضرة، جارتي سألتني: "إيش سويتِ لبشرتكِ؟" لا ليزر ولا فيلر — فقط حبّتين كل صباح.',
  },
  {
    id: 'r2',
    authorFirstNameAr: 'نوف',
    authorCityAr: 'الرياض',
    productNameAr: 'حبّة بريق',
    productSlug: 'habba-bareeq',
    rating: 5,
    bodyAr:
      'سنوات وأنا أسمع "تعبانة؟" من كل أحد. بعد شهرين من بريق — أمي قالت لي: "وجهكِ مشرق اليوم."',
  },
  {
    id: 'r3',
    authorFirstNameAr: 'رهف',
    authorCityAr: 'الرياض',
    productNameAr: 'حبّة جذر',
    productSlug: 'habba-jathr',
    rating: 5,
    bodyAr:
      'الشهر الثاني نظرت في صورة من سنة وقلت — هذا شعري فعلًا؟ الكثافة واضحة، والطيح قلّ.',
  },
  {
    id: 'r4',
    authorFirstNameAr: 'شذى',
    authorCityAr: 'الخبر',
    productNameAr: 'حبّة نضرة',
    productSlug: 'habba-nadra',
    rating: 5,
    bodyAr:
      'كنت أحتاج ثلاث طبقات ميك أب. بعد شهرين من نضرة — طبقة واحدة تكفي. الأستازانتين فعلًا شي ثاني.',
  },
  {
    id: 'r5',
    authorFirstNameAr: 'هيفاء',
    authorCityAr: 'جدة',
    productNameAr: 'حبّة بريق',
    productSlug: 'habba-bareeq',
    rating: 5,
    bodyAr:
      'كنت أحطّ كونسيلر كل يوم حتى في البيت. بعد ٦ أسابيع مع بريق — أوّل مرة أطلع بدون ما أغطّي تحت عيني.',
  },
  {
    id: 'r6',
    authorFirstNameAr: 'العنود',
    authorCityAr: 'الرياض',
    productNameAr: 'حبّة جذر',
    productSlug: 'habba-jathr',
    rating: 5,
    bodyAr:
      'الكاشيرة في صالون الكوافير سألتني: إيش سرّ شعرك؟ ما توقّعت إن الجواب تفاح إيطالي.',
  },
  {
    id: 'r7',
    authorFirstNameAr: 'جواهر',
    authorCityAr: 'الرياض',
    productNameAr: 'حبّة نضرة',
    productSlug: 'habba-nadra',
    rating: 5,
    bodyAr:
      'أختي صوّرتني فجأة وأعطتني الصورة. أوّل مرة منذ سنوات أحبّ صورتي بدون ما أطلب تعديلها.',
  },
  {
    id: 'r8',
    authorFirstNameAr: 'دلال',
    authorCityAr: 'الدمام',
    productNameAr: 'حبّة بريق',
    productSlug: 'habba-bareeq',
    rating: 5,
    bodyAr:
      'عملت تحليل حديد وطلع عندي نقص. بريق ما سبّبت لي أي شي بالمعدة والهالات خفّت بعد شهر ونص.',
  },
  {
    id: 'r9',
    authorFirstNameAr: 'ريم',
    authorCityAr: 'جدة',
    productNameAr: 'حبّة جذر',
    productSlug: 'habba-jathr',
    rating: 5,
    bodyAr:
      'كنت أجمع شعر قبل الاستحمام حتى لا يسدّ الصرف. بعد شهرين — ما عاد عندي سبب أفعل هذا.',
  },
];

export const REVIEW_AGGREGATE = {
  averageRating: 4.9,
  totalReviews: 1092,
  distribution: { 5: 97, 4: 3, 3: 0, 2: 0, 1: 0 },
} as const;
