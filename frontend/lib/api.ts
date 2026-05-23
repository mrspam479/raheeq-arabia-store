import type { Product } from './types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.raheeqarabia.com';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/api/products`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = (await res.json()) as { products: RawProduct[] };
  return data.products.map(mapProduct);
}

export async function fetchProduct(slug: string): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/api/products/${slug}`, {
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch product');
  return mapProduct((await res.json()) as RawProduct);
}

type RawProduct = {
  id: string;
  slug: string;
  name_ar: string;
  hero_tag_ar: string;
  short_description_ar: string;
  long_description_ar?: string;
  rating_value: number;
  review_count: number;
  stock_label_ar: string | null;
  cover_image_url: string;
  gallery_image_urls?: string[];
  offers: RawOffer[];
  ingredients?: RawIngredient[];
  reviews?: RawReview[];
  faqs?: RawFaq[];
  seo?: { title_ar: string | null; description_ar: string | null };
};

type RawOffer = {
  code: string;
  label_ar: string;
  quantity: number;
  price_sar: number;
  is_recommended: boolean;
};

type RawIngredient = {
  name_ar: string;
  name_en: string;
  dose: string;
  what_it_does_ar: string;
  science_source_short: string;
  thumb_image_url: string | null;
};

type RawReview = {
  author_first_name_ar: string;
  author_city_ar: string | null;
  rating: number;
  body_ar: string;
};

type RawFaq = {
  question_ar: string;
  answer_ar: string;
};

function mapProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    slug: raw.slug,
    nameAr: raw.name_ar,
    heroTagAr: raw.hero_tag_ar,
    shortDescriptionAr: raw.short_description_ar,
    longDescriptionAr: raw.long_description_ar ?? '',
    ratingValue: Number(raw.rating_value),
    reviewCount: raw.review_count,
    stockLabelAr: raw.stock_label_ar ?? '',
    coverImageUrl: raw.cover_image_url,
    galleryImageUrls: raw.gallery_image_urls ?? [],
    offers: raw.offers.map((o) => ({
      code: o.code as 'T1' | 'T2' | 'T3',
      labelAr: o.label_ar,
      quantity: o.quantity,
      priceSar: Number(o.price_sar),
      isRecommended: o.is_recommended,
    })),
    ingredients: raw.ingredients?.map((i) => ({
      nameAr: i.name_ar,
      nameEn: i.name_en,
      dose: i.dose,
      whatItDoesAr: i.what_it_does_ar,
      scienceSourceShort: i.science_source_short,
      thumbImageUrl: i.thumb_image_url,
    })) ?? [],
    reviews: raw.reviews?.map((r) => ({
      authorFirstNameAr: r.author_first_name_ar,
      authorCityAr: r.author_city_ar ?? '',
      rating: r.rating,
      bodyAr: r.body_ar,
    })) ?? [],
    faqs: raw.faqs?.map((f) => ({
      questionAr: f.question_ar,
      answerAr: f.answer_ar,
    })) ?? [],
    seo: raw.seo
      ? { titleAr: raw.seo.title_ar ?? '', descriptionAr: raw.seo.description_ar ?? '' }
      : { titleAr: '', descriptionAr: '' },
  };
}
