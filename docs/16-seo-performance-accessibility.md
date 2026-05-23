# 16 — SEO, Performance, Accessibility & RTL

## 1. SEO — Arabic-first

### 1.1 HTML head essentials

- `<html lang="ar" dir="rtl">`.
- `<meta charset="utf-8">`.
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- `<meta name="theme-color" content="#0E4F3A">`.
- `<link rel="icon" href="/icons/favicon.ico">`.
- `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">`.
- `<meta name="robots" content="index, follow, max-image-preview:large">`.

### 1.2 `generateMetadata` per route

| Route | Title | Description |
|---|---|---|
| `/` | `رحيق Raheeq Arabia — حلوى يومية تليق بكِ` | `حبّة جذر، حبّة ليالي، حبّة نورة — مكمّلات بطعم حلوى، بمكوّنات عالمية، ودفع عند الاستلام داخل المملكة.` |
| `/collection` | `المجموعة الكاملة · رحيق Raheeq Arabia` | `ثلاث حبّات، ثلاث طقوس — اختاري بين شعرٍ أقوى، نومٍ أعمق، وبشرةٍ أكثر إشراقًا.` |
| `/p/habba-jathr` | `حبّة جذر — حلوى الشعر بالبيوتين والساو بالميتو والكولاجين البحري · رحيق` | `كثافة من الجذر، قوّة الشعرة، أظافر أقوى — مكوّنات عالمية، فحص COA لكل دفعة، دفع عند الاستلام.` |
| `/p/habba-layali` | `حبّة ليالي — حلوى النوم بالميلاتونين والأشواغاندا · رحيق` | `نوم أعمق وصباحٌ خفيف — جرعة ميلاتونين ذكية + أشواغاندا KSM-66®. دفع عند الاستلام.` |
| `/p/habba-noura` | `حبّة نورة — حلوى الجمال بالكولاجين البحري وفيتامين سي · رحيق` | `إشراقة، مرونة، أظافر أقوى — كولاجين ببتيدات صغيرة + فيتامين سي. دفع عند الاستلام.` |
| `/about` | `قصّة رحيق — مكمّلات بأيدٍ عربية` | `بدأت رحيق بفكرة بسيطة: مكمّلات تليق بكِ. اكتشفي قصّتنا ومعاييرنا.` |
| `/contact` | `تواصلي معنا — رحيق` | `فريق خدمة العملاء متاح من الأحد إلى الخميس.` |
| `/thank-you` | `استلمنا طلبكِ — رحيق` | `راح يكلّمكِ فريق رحيق خلال ٢٤ ساعة لتأكيد الطلب.` |

`alternates.canonical` is always set. `openGraph.images` references `/og/{slug}.jpg`. `robots: { index: false }` is forced on `/thank-you`.

### 1.3 Structured data (JSON-LD)

- Root layout injects `Organization`:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "رحيق Raheeq Arabia",
  "url": "https://raheeqarabia.com",
  "logo": "https://raheeqarabia.com/icons/logo.png",
  "sameAs": [
    "https://snapchat.com/add/raheeqarabia",
    "https://www.tiktok.com/@raheeqarabia",
    "https://instagram.com/raheeqarabia"
  ]
}
```

- Each PDP injects `Product` (see `05-products.md § 7`).
- `BreadcrumbList` injected on PDP/Collection/About/Contact.

### 1.4 `sitemap.xml`

Auto-generated via `app/sitemap.ts` listing: `/`, `/collection`, `/p/habba-jathr`, `/p/habba-layali`, `/p/habba-noura`, `/about`, `/contact`, `/legal/*`. `/thank-you` is excluded.

### 1.5 `robots.txt`

```
User-agent: *
Allow: /
Disallow: /thank-you
Disallow: /api/

Sitemap: https://raheeqarabia.com/sitemap.xml
```

### 1.6 Hreflang

Single locale (`ar-SA`). Add `<link rel="alternate" hreflang="ar-SA" href="…" />` and `<link rel="alternate" hreflang="x-default" href="…" />` on each canonical page.

## 2. Performance budgets (locked)

| Metric | Target | How we hit it |
|---|---|---|
| LCP (mobile 4G) | ≤ 2.0s | Server-rendered hero, `priority` image, fonts preloaded. |
| CLS | ≤ 0.05 | All `<Image>` has width/height; reserved space for offer tiles. |
| INP | ≤ 200 ms | No long tasks at startup; pixels deferred. |
| TTFB | ≤ 400 ms | Backend co-located with frontend (same DC). |
| First Load JS (per route, shared+page) | ≤ 130 KB gzipped | RSC + `next/dynamic` for cart drawer/modals. |
| Total third-party JS at idle | ≤ 80 KB gzipped | Pixels load only after first interaction or idle. |

### 2.1 Image strategy

- Use `next/image` everywhere; never `<img>`.
- Hero image: `priority`, `sizes="(min-width: 1024px) 55vw, 100vw"`, supplied as 1600×2000 (4:5) for mobile and 2200×1240 (16:9) for desktop with `media` queries OR a single `1600` source and `object-fit: cover`.
- Card images: 800×1000 (4:5), `loading="lazy"`, `sizes="(min-width: 768px) 400px, 100vw"`.
- All images converted to AVIF + WebP via `next/image` (default).
- Placeholders: see `19-images-and-assets.md`.

### 2.2 Font strategy

- `next/font/google` for Tajawal, Cormorant Garamond, Inter.
- `display: 'swap'`, `preload: true` for Tajawal (primary), `preload: false` for Cormorant + Inter.
- No `@import` of Google Fonts CSS — `next/font` self-hosts them.

### 2.3 Bundle hygiene

- `framer-motion` only imported via `next/dynamic` from cart/modal components.
- `libphonenumber-js` uses the `max` build (covers SA), imported only inside checkout components.
- `lucide-react` icons imported individually (`import { ShoppingBag } from 'lucide-react'`) to enable tree-shaking.

### 2.4 Long-running tasks

- Avoid heavy useEffects on the homepage.
- Reviews carousel uses CSS scroll-snap (no JS animation loop).
- The Cart Drawer mounts lazily via `next/dynamic({ ssr:false })` and only after the first cart icon click.

### 2.5 Caching headers

- Static assets in `/public` → `Cache-Control: public, max-age=31536000, immutable`.
- HTML pages → `Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=86400` (CDN-cached, regenerated every 5 min).
- API responses for `/api/products` → `s-maxage=300`. `/api/orders` and `/api/track` → `no-store`.

## 3. Accessibility (AA minimum)

- Color contrast ≥ AA (see `02-brand-identity.md § 4`).
- All buttons have visible focus rings.
- `<form>` fields have linked labels (`htmlFor` + `id`).
- Modal/Drawer focus is trapped; ESC closes.
- The Tab order in the checkout modal: name → phone → submit.
- All decorative images: `alt=""` and `aria-hidden="true"`. All content images have real `alt` text in Arabic.
- Heading hierarchy is strict (`h1` once per page; `h2` per section).
- The announcement bar has `role="status"` and a dismiss button with `aria-label="إخفاء الشريط"`.
- All carousels have explicit "previous"/"next" controls with `aria-label`.

## 4. RTL specifics

- `<html dir="rtl">` is set in the root layout.
- Tailwind logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) used everywhere instead of `ml-` / `mr-`.
- Chevrons used for "next" (in product galleries, carousels) point **left** (`ChevronLeft`) because reading flow is right-to-left.
- Numbers and currency wrapped in `<bdi>` to keep them readable.
- Form `input` for phone uses `dir="ltr"` so the `+966 5XX…` displays naturally.
- Sticky bottom bar slides up; cart drawer slides in from the right viewport edge (which is the leading edge in RTL).

## 5. Performance testing checklist (run before launch)

- Run `next build` and inspect the size budget for each route.
- Run Lighthouse mobile on `/`, `/collection`, `/p/habba-jathr` — Performance ≥ 95, A11y ≥ 95, SEO = 100.
- Run WebPageTest from Saudi region (or Bahrain as a proxy) on `/p/habba-jathr` — LCP ≤ 2.0 s on 4G.
- Run Chrome DevTools "Coverage" → no large unused JS.
- Run Chrome DevTools "Performance" → main-thread free of > 50 ms tasks in the first 3 s.
- Validate the absence of third-party scripts in the initial waterfall (pixels load after first input).

## 6. Monitoring

- For v1, real-user monitoring is provided by **Vercel Speed Insights**-equivalent via a tiny `next/script` that posts to `/api/vitals` (out of scope for v1 — postponed).
- The founder validates Core Web Vitals weekly via PageSpeed Insights.
