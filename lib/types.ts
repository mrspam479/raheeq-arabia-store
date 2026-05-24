export type OfferCode = 'T1' | 'T2' | 'T3';

export type CartLine = {
  productId: string;
  nameAr: string;
  tier: 1 | 2 | 3;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string;
  offerCode: OfferCode;
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

export type OrderLineIn = {
  product_slug: string;
  offer_code: string;
};

export type OrderCreateIn = {
  customer: { full_name: string; phone: string };
  lines: OrderLineIn[];
  tracking: {
    event_id: string;
    fbp?: string;
    fbc?: string;
    ttp?: string;
    ttclid?: string;
    sc_click_id?: string;
    referrer?: string;
    landing_url?: string;
    utm?: {
      source?: string;
      medium?: string;
      campaign?: string;
      content?: string;
      term?: string;
    };
    client_user_agent?: string;
  };
  honeypot?: string;
};

export type OrderCreateOut = {
  order: {
    id: string;
    status: string;
    total_sar: number;
  };
  upsell: {
    token: string;
    sku: string;
    price_sar: number;
  } | null;
};
