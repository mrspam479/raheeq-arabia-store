# 02 — Brand Identity

## 1. Names

- Arabic (primary, hero): **رحيق** ("Raheeq" — "purest nectar"; Quranic resonance, sense of luxury, purity, sweetness).
- English (secondary, lockup): **Raheeq Arabia**.

The brand always presents as **رحيق** first; "Raheeq Arabia" sits under it as the romanization line. Never use the English name alone.

## 2. Brand story (used on About + footer + hero copy)

> من قلب الجزيرة العربية، وُلدت رحيق.
> فكرة بسيطة: مكمّلات تليق بك — بطعم حلوى، بجودة مختبرات، وبأمان نثق فيه قبل أن يصلك.
> كل حبّة رحيق نختارها بمكوّناتها العالمية، نختبرها، ونغلّفها بأيدٍ عربية، حتى تصل إليكِ كما تستحقّين: نقيّة، فعّالة، وأنيقة.
> ليست مجرد فيتامينات. هي طقس يومي صغير يذكّركِ أنكِ الأولى.

## 3. Logo system

**Symbol** — a single Arabic letter **ر** (or its Latin counterpart **R**) inscribed in a thin-stroked circle, balanced and centered, painted in **Saffron Gold** on a transparent background. The circle reads as both "ring of purity" and a "drop of nectar".

**Wordmark** — "رحيق" set in **Tajawal Bold** (Arabic) directly to the **left** of the symbol (RTL layout), with the line "Raheeq Arabia" set in **Cormorant Garamond SemiBold Italic** sitting under "رحيق", baseline-aligned with the bottom of the symbol.

Header lockup (right-to-left reading on desktop & mobile):

```
[ ر ]   رحيق
        Raheeq Arabia
```

CSS reference:

- Symbol container: `width: 40px; height: 40px; border: 1.5px solid var(--accent); border-radius: 9999px; color: var(--accent); display:flex; align-items:center; justify-content:center; font-family: var(--font-cormorant); font-weight: 600; font-size: 22px;`
- Arabic wordmark: `font-family: var(--font-tajawal); font-weight: 700; font-size: 22px; color: var(--ink); letter-spacing: -0.01em;`
- Romanized sub-mark: `font-family: var(--font-cormorant); font-style: italic; font-weight: 500; font-size: 11px; color: var(--muted); letter-spacing: 0.08em; text-transform: none;`

The AI coder must build a single `<Logo />` component that ships this lockup, exposes a `size` prop (`sm | md | lg`), and degrades to symbol-only on screens < 360px.

## 4. Color tokens

The palette is **emerald + saffron on ivory** — botanical authority + Arabian luxury.

| Token | Hex | Usage |
|---|---|---|
| `--brand-primary` | `#0E4F3A` | Buttons, headers, primary text accents, footer background. |
| `--brand-primary-dark` | `#08332A` | Button hover, deep contrast. |
| `--brand-primary-light` | `#1F6E54` | Sub-accents, hover states. |
| `--brand-accent` | `#C9943F` | Logo symbol stroke, ratings, badges, scarcity numbers. |
| `--brand-accent-light` | `#E0B561` | Highlights, gradients, hover. |
| `--brand-accent-dark` | `#9F7227` | Accent button hover. |
| `--bg-cream` | `#FBF7F0` | Page background. |
| `--bg-sand` | `#F3EADA` | Subtle section bands. |
| `--bg-card` | `#FFFFFF` | Card surfaces. |
| `--ink` | `#1B1B1B` | Body text. |
| `--ink-soft` | `#3A3530` | Headings on cream. |
| `--muted` | `#5C5751` | Secondary text. |
| `--border` | `#E6DDCB` | Card outlines, dividers. |
| `--success` | `#1E7A3A` | "Free shipping unlocked", success toasts. |
| `--error` | `#A4382D` | Validation, form errors. |
| `--info` | `#2D6CA3` | Informational micro-copy. |

Contrast: `--ink` on `--bg-cream` = 17.1:1. `--brand-primary` on `--bg-cream` = 9.6:1. All AA+ compliant. Never put `--brand-accent` text directly on `--bg-cream` (3.1:1 — fails AA for body text). Use accent only for icons, large display numbers (≥ 24px), and outlines.

## 5. Typography system

Three families. Loaded via `next/font` with `display: swap` and **`subsets: ['arabic','latin','latin-ext']`** where applicable.

| Family | Use | Where |
|---|---|---|
| **Tajawal** (400/500/700/900) | Arabic UI + body + headings | All UI text in Arabic. |
| **Cormorant Garamond** (500/600 italic + 600/700) | Latin display | "Raheeq Arabia" sub-mark, large English numerals where used. |
| **Inter** (400/500/600) | Latin UI fallback | English buttons, footer fine-print, structured data. |

Type scale (mobile → desktop, fluid):

| Token | mobile | desktop | Use |
|---|---|---|---|
| `display` | clamp(40px, 8vw, 64px) | 72px | Hero headline. |
| `h1` | clamp(32px, 6vw, 44px) | 48px | Section headlines. |
| `h2` | clamp(24px, 5vw, 32px) | 36px | Page section h2. |
| `h3` | 20px | 24px | Card titles. |
| `body` | 16px | 17px | Body. |
| `small` | 13px | 14px | Captions, fine-print. |
| `xs` | 11px | 12px | Legal. |

Line-height: 1.7 for Arabic body, 1.6 for Latin body. Letter-spacing: `-0.01em` for Arabic headings, `0` for Latin.

## 6. Voice & tone

We speak as a **trusted older sister** — warm, certain, never preachy, never desperate. The reader feels seen, not sold.

Pillars:

1. **Warmth** — "تخيّلي…", "أنتِ تستحقّين…", "نعرف هذا الإحساس".
2. **Authority** — we cite ingredients with mg and the science behind them, calmly.
3. **Pride** — Arab/Saudi cultural ownership of beauty rituals (the gummy as a modern ritual).
4. **Restraint** — never shout. Scarcity is **factual** ("بقي ٢٧ علبة فقط لهذه الدفعة") not panicky.

Avoid:

- Modern Standard Arabic that feels stiff or news-anchor.
- Translations from English ad copy (it reads off).
- Emojis except a sparing 🌿 / ✨ inside small lifestyle captions.
- Words like "حصري عالميًا", "بيع الجملة", "أرخص".

## 7. Motion language

- Hero parallax: **disabled on mobile**, soft `translateY(-2%)` on desktop over 30vh of scroll.
- Section reveal: 12px Y → 0 + 200ms ease-out, threshold 0.15.
- Cart drawer slide: 320ms `cubic-bezier(0.22, 1, 0.36, 1)` from right (RTL: from left visually because of `dir="rtl"` — verify directionality with `useReducedMotion`).
- Add-to-cart button: 1.04 scale + 80ms haptic-style pop; cart badge bounces +20% for 160ms.
- All motion respects `prefers-reduced-motion`.

## 8. Photographic direction

(Used by the placeholders the AI coder will generate; see `19-images-and-assets.md`.)

- **Subjects** — Modern Khaleeji women, 22–40, soft natural light, hijab optional but ~60% of shots feature one. No stock-photo grins.
- **Settings** — Cream/sand-toned interiors, marble, brushed gold props, eucalyptus, dried saffron, ceramics.
- **Mood** — quiet luxury. Think "Dior Beauty meets Aman resort".
- **Product hero shots** — overhead on linen with botanical ingredients (saw palmetto sprig, marine collagen powder, vanilla pod, sliced orange, lavender) arranged like an apothecary mood board.
- **Aspect ratios** — 4:5 for editorial portraits, 1:1 for product cards, 16:9 for hero on desktop, 4:5 for hero on mobile.

## 9. Iconography

`lucide-react` icons only, stroke 1.5, colored `--ink-soft` or `--brand-primary`. Decorative icons (ingredient leaves, sparkle, droplet) ship as inline SVG components living in `frontend/components/icons/`.

## 10. Don'ts

- Never display the price with a strike-through (we don't discount).
- Never use a generic globe or "international" badge.
- Never machine-translate a TikTok caption verbatim into the site copy.
- Never use a stock image of a non-Khaleeji model holding a Western supplement bottle.
- Never use lottie loaders or full-screen spinners. Use a 2-row content skeleton if needed.
