import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProductBySlug, PRODUCT_BENEFITS, PRODUCT_HOW_TO_USE, PRODUCT_WHY_HEADING, PRODUCT_WHY_BODY, PRODUCT_CROSS_SELLS } from '@/data/products';
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

  const crossSellSlugs = PRODUCT_CROSS_SELLS[slug] ?? [];
  const crossSellProducts = crossSellSlugs
    .map((s) => PRODUCTS.find((p) => p.slug === s))
    .filter(Boolean) as typeof PRODUCTS;

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
        howToUse={PRODUCT_HOW_TO_USE[slug] ?? []}
        whyHeading={PRODUCT_WHY_HEADING[slug] ?? ''}
        whyBody={PRODUCT_WHY_BODY[slug] ?? ''}
        crossSells={crossSellProducts}
      />
    </>
  );
}
