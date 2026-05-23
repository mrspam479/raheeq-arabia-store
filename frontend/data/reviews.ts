/**
 * Global reviews — shown on Home page and Collection page.
 * Product-specific reviews live in data/products.ts.
 * All text verbatim from docs/04-copy-bank-arabic-ksa.md § C.
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
    authorFirstNameAr: 'رهف',
    authorCityAr: 'الرياض',
    productNameAr: 'حبّة جذر',
    productSlug: 'habba-jathr',
    rating: 5,
    bodyAr:
      'بصراحة كنت متردّدة، بس بعد شهر من حبّة جذر شعري وقف يطيح بنفس الكميّة. التغليف يجنّن.',
  },
  {
    id: 'r2',
    authorFirstNameAr: 'سلوى',
    authorCityAr: 'جدة',
    productNameAr: 'حبّة ليالي',
    productSlug: 'habba-layali',
    rating: 5,
    bodyAr:
      'ليالي غيّرت نومي. أصحى مرتاحة بدون دوخة. صار جزء من روتيني قبل النوم.',
  },
  {
    id: 'r3',
    authorFirstNameAr: 'منيرة',
    authorCityAr: 'الدمام',
    productNameAr: 'حبّة نورة',
    productSlug: 'habba-noura',
    rating: 5,
    bodyAr:
      'حبّة نورة بشرتي شربت كولاجين. الإشراقة في الصور بنفسها.',
  },
  {
    id: 'r4',
    authorFirstNameAr: 'العنود',
    authorCityAr: 'الرياض',
    productNameAr: 'حبّة جذر',
    productSlug: 'habba-jathr',
    rating: 5,
    bodyAr:
      'اشتريت ٣ علب جذر بـ ٣٤٩، صراحة قيمة ممتازة. شعري بدأ يطلع جوّاني وحتى الحاجبين.',
  },
  {
    id: 'r5',
    authorFirstNameAr: 'لمى',
    authorCityAr: 'الرياض',
    productNameAr: 'حبّة ليالي',
    productSlug: 'habba-layali',
    rating: 5,
    bodyAr:
      'أوّل ليلة فرّقت. حسّيت بهدوء غريب — نمت بدون لفّ.',
  },
  {
    id: 'r6',
    authorFirstNameAr: 'شذى',
    authorCityAr: 'الخبر',
    productNameAr: 'حبّة نورة',
    productSlug: 'habba-noura',
    rating: 5,
    bodyAr:
      'خدمة العملاء ردّت علي في نفس اليوم وأكدت لي طلبي. حسّيت إن البراند سعودي فعلًا.',
  },
  {
    id: 'r7',
    authorFirstNameAr: 'ريم',
    authorCityAr: 'جدة',
    productNameAr: 'حبّة جذر',
    productSlug: 'habba-jathr',
    rating: 5,
    bodyAr:
      'بعد شهرين شعري طلع له طول جدّي، والكثافة بانت في الصورة الأخيرة.',
  },
  {
    id: 'r8',
    authorFirstNameAr: 'شهد',
    authorCityAr: 'جدة',
    productNameAr: 'حبّة ليالي',
    productSlug: 'habba-layali',
    rating: 5,
    bodyAr:
      'جربت كل شي قبل، بس هذي وحدها اللي ما خلّتني تعبانة الصباح.',
  },
  {
    id: 'r9',
    authorFirstNameAr: 'جواهر',
    authorCityAr: 'الرياض',
    productNameAr: 'حبّة نورة',
    productSlug: 'habba-noura',
    rating: 5,
    bodyAr:
      'بشرتي وجهت تعطيني بريق طبيعي، ومن غير ميك أب صرت أحبّ صوري.',
  },
];

export const REVIEW_AGGREGATE = {
  averageRating: 4.9,
  totalReviews: 1054,
  distribution: { 5: 98, 4: 2, 3: 0, 2: 0, 1: 0 },
} as const;
