import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProductBySlug, PRODUCT_BENEFITS, PRODUCT_HOW_TO_USE, PRODUCT_TIMELINE, PRODUCT_BEFORE_AFTER, PRODUCT_WHY_US } from '@/data/products';
import { JsonLdProduct } from '@/components/brand/JsonLd';
import { PdpClient } from './PdpClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.seo.titleAr,
    description: product.seo.descriptionAr,
    openGraph: {
      title: product.seo.titleAr,
      description: product.seo.descriptionAr,
      images: [{ url: product.coverImageUrl, width: 1200, height: 1200 }],
    },
  };
}

export default async function PdpPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <JsonLdProduct
        slug={product.slug}
        nameAr={product.nameAr}
        descriptionAr={product.shortDescriptionAr}
        price={product.offers[0]?.priceSar ?? 199}
        ratingValue={product.ratingValue}
        reviewCount={product.reviewCount}
      />
      <PdpClient
        product={product}
        benefits={PRODUCT_BENEFITS[slug] ?? []}
        timeline={PRODUCT_TIMELINE[slug] ?? []}
        howToUse={PRODUCT_HOW_TO_USE[slug] ?? []}
        beforeAfter={PRODUCT_BEFORE_AFTER[slug] ?? { before: [], after: [] }}
        whyUs={PRODUCT_WHY_US[slug] ?? { logic: [], emotion: [] }}
      />
    </>
  );
}
