/**
 * JSON-LD structured data components for SEO.
 * Renders <script type="application/ld+json"> in <head> via Next.js metadata.
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function JsonLdOrganization() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'رحيق Raheeq Arabia',
    url: 'https://raheeqarabia.com',
    logo: 'https://raheeqarabia.com/images/logo.png',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Arabic',
    },
  };

  return <JsonLd data={data} />;
}

export function JsonLdProduct({
  slug,
  nameAr,
  descriptionAr,
  price,
  ratingValue,
  reviewCount,
  availability = 'InStock',
}: {
  slug: string;
  nameAr: string;
  descriptionAr: string;
  price: number;
  ratingValue: number;
  reviewCount: number;
  availability?: 'InStock' | 'OutOfStock';
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: nameAr,
    description: descriptionAr,
    url: `https://raheeqarabia.com/p/${slug}`,
    brand: {
      '@type': 'Brand',
      name: 'رحيق Raheeq Arabia',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'SAR',
      price,
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: 'رحيق Raheeq Arabia',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
    },
  };

  return <JsonLd data={data} />;
}

export function JsonLdBreadcrumb(items: { nameAr: string; url: string }[]) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nameAr,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}
