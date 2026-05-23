export type OfferCode = 'T1' | 'T2' | 'T3';

export type CartLine = {
  productId: string;
  nameAr: string;
  tier: 1 | 2 | 3;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string;
};

export type Offer = {
  code: OfferCode;
  labelAr: string;
  quantity: number;
  priceSar: number;
  isRecommended: boolean;
};

export type Ingredient = {
  nameAr: string;
  nameEn: string;
  dose: string;
  whatItDoesAr: string;
  scienceSourceShort: string;
  thumbImageUrl: string | null;
};

export type Review = {
  authorFirstNameAr: string;
  authorCityAr: string;
  rating: number;
  bodyAr: string;
};

export type Faq = {
  questionAr: string;
  answerAr: string;
};

export type ProductSeo = {
  titleAr: string;
  descriptionAr: string;
};

export type Product = {
  id: string;
  slug: string;
  nameAr: string;
  heroTagAr: string;
  shortDescriptionAr: string;
  longDescriptionAr: string;
  ratingValue: number;
  reviewCount: number;
  stockLabelAr: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  offers: Offer[];
  ingredients: Ingredient[];
  reviews: Review[];
  faqs: Faq[];
  seo: ProductSeo;
};

export type OrderLine = {
  product_id: string;
  quantity: number;
  unit_price: number;
};

export type OrderCreateIn = {
  customer: { name: string; phone: string };
  lines: OrderLine[];
  tracking?: {
    fbp?: string;
    fbc?: string;
    ttp?: string;
    ttclid?: string;
    sc_click_id?: string;
    ip?: string;
    user_agent?: string;
    page_url?: string;
  };
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
};

export type OrderCreateOut = {
  order_id: string;
  status: string;
  total_sar: number;
  upsell_token: string;
  upsell_offer?: {
    sku: string;
    name_ar: string;
    price_sar: number;
    cover_image_url?: string;
  } | null;
};
