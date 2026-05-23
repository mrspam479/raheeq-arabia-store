# 19 — Images, Placeholders & Asset Pipeline

Real product photography will arrive after launch prep. Until then, the AI coder ships **brand-on-style placeholders** that look intentional and never break the layout.

## 1. Placeholder strategy

Two layers:

1. **Local SVG placeholders** for everything not photographic (icons, decorative botanicals).
2. **Photographic placeholders** for hero, lifestyle, ingredient, product shots — rendered as a soft branded gradient + a centered serif label + a thin gold rule. The AI coder ships an `<ImagePlaceholder />` server component that emits a 1×1 SVG to the same `width × height` as the real image, so swapping later is a one-line change of `src`.

`<ImagePlaceholder />` example:

```tsx
// frontend/components/ui/ImagePlaceholder.tsx
type Props = { width: number; height: number; label: string; tone?: 'cream' | 'sand' };
export function ImagePlaceholder({ width, height, label, tone = 'cream' }: Props) {
  const bg = tone === 'sand' ? '#F3EADA' : '#FBF7F0';
  const stroke = '#C9943F';
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
         role="img" aria-label={label}
         style={{ background: bg, borderRadius: 12 }}>
      <rect x={width*0.5 - 56} y={height*0.5 - 56} width={112} height={112}
            fill="none" stroke={stroke} strokeWidth={1.25} rx={56} />
      <text x="50%" y={height*0.5 + 90} textAnchor="middle"
            fontFamily="Cormorant Garamond, serif" fontStyle="italic"
            fontSize={Math.min(20, width/20)} fill="#3A3530">{label}</text>
    </svg>
  );
}
```

Where used:

| Slot | Width × Height | Label | Tone |
|---|---|---|---|
| Home hero (mobile) | 800 × 1000 | `Raheeq · Hero` | cream |
| Home hero (desktop) | 1600 × 900 | `Raheeq · Hero` | cream |
| Home ritual | 1000 × 1000 | `Daily Ritual` | sand |
| Home founder | 1000 × 1000 | `Founder` | cream |
| About hero | 1600 × 900 | `Our Story` | sand |
| About founder | 1000 × 1000 | `Founder Portrait` | cream |
| Collection hero | 1600 × 900 | `Collection` | sand |
| Product card | 800 × 1000 | `{SKU label}` | cream |
| PDP gallery cover | 1200 × 1500 | `حبّة جذر · Cover` (etc.) | cream |
| PDP gallery lifestyle | 1200 × 1500 | `حبّة جذر · Lifestyle` | sand |
| PDP gallery ingredients | 1200 × 1500 | `حبّة جذر · Ingredients` | cream |
| PDP gallery back | 1200 × 1500 | `حبّة جذر · Back Label` | cream |
| PDP "why" image | 1200 × 800 | `Why حبّة جذر` | sand |
| PDP ingredient thumb | 200 × 200 | `Biotin` (etc.) | cream |
| PDP proof (before/after) | 1600 × 900 | `Before / After (real customers)` | cream |
| Cart drawer empty state | 320 × 320 | — (inline botanical SVG only) | — |

The placeholders live as **static SVG components**, not `.png`/`.jpg` files. This keeps the repo small and the placeholders crisp at any density.

When real images arrive, the founder drops them into `frontend/public/images/...` per the names below, and the AI coder swaps the `<ImagePlaceholder>` for `<Image src=...>` — **same width/height** so layout is preserved.

## 2. Real image filenames (when delivered)

```
public/images/
├── home/
│   ├── hero-mobile.jpg          (800 x 1000)
│   ├── hero-desktop.jpg         (1600 x 900)
│   ├── ritual.jpg               (1000 x 1000)
│   └── founder.jpg              (1000 x 1000)
├── about/
│   ├── hero.jpg                 (1600 x 900)
│   └── founder.jpg              (1000 x 1000)
├── collection/
│   └── hero.jpg                 (1600 x 900)
└── products/
    ├── habba-jathr/
    │   ├── cover.jpg            (1200 x 1500)
    │   ├── lifestyle.jpg        (1200 x 1500)
    │   ├── ingredients.jpg      (1200 x 1500)
    │   ├── back.jpg             (1200 x 1500)
    │   ├── why.jpg              (1200 x 800)
    │   ├── proof.jpg            (1600 x 900)
    │   ├── ing-biotin.jpg       (200 x 200)
    │   ├── ing-saw-palmetto.jpg
    │   ├── ing-collagen.jpg
    │   ├── ing-zinc.jpg
    │   └── ing-b5.jpg
    ├── habba-layali/
    │   └── ... same structure ...
    └── habba-noura/
        └── ... same structure ...
```

## 3. Alt text rules

- All meaningful images have Arabic `alt` text describing the subject + brand.
- Decorative SVG → `alt=""` + `aria-hidden="true"`.
- Product cover: `alt="علبة حبّة جذر — حلوى الشعر من رحيق"`.
- Lifestyle: `alt="نموذج لعميلة تستخدم حبّة جذر — رحيق"`.
- Ingredient thumbs: `alt="مكوّن: بيوتين"`.

## 4. Image optimization rules

- Always `next/image` with explicit `width` + `height` (no CLS).
- Hero image: `priority sizes="(min-width:1024px) 55vw, 100vw"`.
- Below-fold images: `loading="lazy" sizes="..."`.
- Use AVIF + WebP (Next automatic).
- Avoid `quality` overrides (default 75 is fine).

## 5. Open-Graph / Twitter cards

`frontend/public/og/`:

- `og-default.jpg` (1200 × 630) — branded with logo + tagline `حلوى يومية تليق بكِ`.
- `og-habba-jathr.jpg`, `og-habba-layali.jpg`, `og-habba-noura.jpg` (1200 × 630) — placeholder boxes for each SKU.

Twitter card type: `summary_large_image`. Same image used for `twitter:image`.

## 6. Favicons & app icons

`frontend/public/icons/`:

- `favicon.ico` (multi-size 16/32/48).
- `icon-32.png`, `icon-192.png`, `icon-512.png`.
- `apple-touch-icon.png` (180 × 180).
- `mask-icon.svg` (monochrome `ر` glyph).

The AI coder ships generated placeholders (a green disc with a gold `ر`) for v1; the founder swaps when the final brand mark file lands.

## 7. Decorative SVGs

`frontend/components/icons/`:

- `BotanicalDivider.tsx` — used as a separator between hero sections.
- `SaffronSprig.tsx` — used near ingredient cards.
- `DropletIcon.tsx` — bullet icon in "How to use" sections.
- `ConfettiBurst.tsx` — used on `/thank-you`.

Stroke color: `var(--brand-accent)` for all decorative SVGs. Stroke width: 1.5.

## 8. Tactical rules (kept short)

- Never embed an image > 250 KB.
- Never use a stock photo of a non-Khaleeji woman in product mockups.
- Never use a placeholder labelled `Lorem ipsum`; placeholders are Arabic/English brand-consistent.
- Never load fonts inside SVGs (rasterizes the text).
