# 05 — Products (Catalog & Science Backing)

The catalog is the seed data the backend ships with. The AI coder must hardcode this in `backend/app/seed/products.py` and migrate it on first boot. Editing later is allowed but every value below is the **launch** state.

## 0. Conventions

- **Slugs** are URL-safe Latin, used in PDP routes: `/p/habba-jathr`, `/p/habba-layali`, `/p/habba-noura`.
- **IDs** are stable UUIDs assigned by the backend at first migration; never expose raw IDs in URLs.
- **Currency**: SAR. No tax math (price is final).
- **Stock**: virtual scarcity number per batch (`stock_label`) shown on the PDP — not an actual inventory counter for v1.
- **Ingredients** list mg per **2-gummy daily serving**.

## 1. SKU table

| Slug | Arabic Name | Working name | Hero tag (AR) | Stars | Reviews | Stock label (initial) |
|---|---|---|---|---|---|---|
| `habba-jathr` | حبّة جذر | Hair Gummy | لشعر يحبّكِ كما تحبّينه | 4.9 | 412 | بقي 32 علبة |
| `habba-layali` | حبّة ليالي | Sleep Gummy | نوم يستحقّ ليلتكِ | 4.9 | 278 | بقي 19 علبة |
| `habba-noura` | حبّة نورة | Beauty Gummy | إشراقة من جوّا | 4.9 | 364 | بقي 27 علبة |

All three carry the same pricing ladder (see `06-offers-aov-funnel.md`). All three use the same `offers` join.

## 2. حبّة جذر — Hair Gummy

### Hero tag
لشعر يحبّكِ كما تحبّينه — كثافة من الجذر بأربع مكوّنات تشتغل سويًا.

### Short description (used in cards + meta)
حلوى الشعر بالبيوتين، الساو بالميتو، والكولاجين البحري — تركيبة محسوبة لكثافة من الجذر، قوّة الشعرة، وأظافر مرافقة أقوى.

### Long description (PDP body)
يبدأ شعركِ من بصيلة لا تراها العين — نغذّيها ببيوتين، ونوازن دورتها مع ساو بالميتو، نقوّي الشعرة ببتيدات كولاجين بحري، ونغلق الدائرة بالزنك. ليس وصفة طبية — تركيبة وظيفية لاستخدامٍ يومي بدون أقراص.

### Ingredients (per 2-gummy serving)

| Ingredient (AR / EN) | Dose | What it does | Source (short) |
|---|---|---|---|
| بيوتين / Biotin (D-Biotin) | 5,000 mcg | يدعم تصنيع الكيراتين — البروتين الأساسي للشعر والأظافر. | EFSA panel on dietetic products: biotin contributes to maintenance of normal hair. |
| ساو بالميتو / Saw Palmetto extract | 200 mg (45% fatty acids) | يدعم توازن DHT المرتبط بتساقط الشعر. | Randomized trial (Prager et al., 2002, *J Altern Complement Med*) showed improvement in male pattern hair loss; emerging evidence in female pattern. |
| كولاجين بحري / Marine Collagen peptides (Type I) | 1,000 mg | يوفّر أحماض أمينية لبنية الشعرة (برولين، جلايسين). | de Miranda et al., 2021, *Int J Dermatology*, meta-analysis on collagen peptides and skin elasticity. |
| زنك / Zinc (citrate) | 7.5 mg | يساهم في دورة نمو الشعر الطبيعية. | EFSA: zinc contributes to maintenance of normal hair. |
| فيتامين B5 / Panthothenic acid | 5 mg | يدعم استقلاب طاقة البصيلة. | EFSA permitted health claim. |

> Excipients: pectin (vegan gelling), natural berry flavor, beet juice concentrate (color), citric acid, coconut oil coating.

### Allergens / safety
- لا يحتوي على جلاتين حيواني.
- يحتوي على مشتقّات بحرية (الكولاجين). يُتجنّب لمن لديهم حساسية من السمك.
- لا يُنصح به أثناء الحمل والرضاعة.

### Claims (locked wording — never paraphrase on the PDP)
- "يدعم كثافة الشعر وقوّته." ✅
- "يساعد في الحفاظ على شعرٍ طبيعي." ✅
- "يقلّل تساقط الشعر." ⚠️ Allowed only as testimonial copy, never as a manufacturer claim.
- "علاج لتساقط الشعر." ❌ Forbidden.

### Stock label
`بقي 32 علبة من دفعة هذا الأسبوع.` (rotates between 19–34 — see `15-cro-trust-social-proof.md § Scarcity rules`).

### Default offer
3-box (Glow Kit, 349 SAR).

### Cross-sell in cart
- Primary: `حبّة نورة`
- Secondary: `حبّة ليالي`

### Post-form upsell (v1 mapping)
If cart hero SKU is `habba-jathr`, the post-form upsell is **حبّة نورة (1 box at 99 SAR)**.

### FAQs (locked)
See copy bank `04 § D9`.

### Reviews (curated for PDP)
See copy bank `04 § D8`.

---

## 3. حبّة ليالي — Sleep Gummy

### Hero tag
نوم يستحقّ ليلتكِ — ميلاتونين + أشواغاندا KSM-66® + L-ثيانين لراحة عميقة بدون اعتماد.

### Short description
حلوى النوم والاسترخاء — جرعة ميلاتونين منخفضة وذكيّة، مدعومة بأشواغاندا KSM-66® المرخّصة و L-ثيانين، لنومٍ أعمق وصباحٍ خفيف.

### Long description
ليالي صُمّمت لتقصّر الزمن بينك وبين النوم — جرعة ميلاتونين منخفضة (لا تسبّب اعتمادًا) تخبر دماغكِ إنّ الليل بدأ، أشواغاندا تخفّض الكورتيزول، L-ثيانين يهدّئ موجات الدماغ، وبابونج لطيف يغلق الطقس. تُستخدم قبل النوم بـ ٣٠ دقيقة.

### Ingredients (per 2-gummy serving)

| Ingredient (AR / EN) | Dose | What it does | Source (short) |
|---|---|---|---|
| ميلاتونين / Melatonin | 1 mg | هرمون يومي طبيعي — يبلّغ الدماغ ببداية الليل. الجرعة المنخفضة فعّالة وآمنة. | EFSA approved claim: melatonin contributes to reduction of time to fall asleep at 1 mg. |
| أشواغاندا / Ashwagandha KSM-66® (root extract) | 300 mg (5% withanolides) | تخفّض الكورتيزول وتحسّن جودة النوم. | Chandrasekhar et al., 2012, *Indian J Psychol Med*, RCT 60 adults, ↓ stress & sleep latency. |
| L-ثيانين / L-Theanine | 200 mg | يعزّز موجات ألفا للدماغ ويهدّئ بدون نعاس. | Williams et al., 2020, *Plant Foods Hum Nutr*, narrative review. |
| ماغنيسيوم / Magnesium (bisglycinate) | 75 mg | يسترخي العضلات ويدعم نومًا أعمق. | EFSA: magnesium contributes to normal function of the nervous system. |
| بابونج / Chamomile extract | 50 mg | تركيبة تقليدية للاسترخاء. | Long-standing traditional use; Hieu et al., 2019, *Phytother Res*, meta-analysis. |

### Allergens / safety
- لا يحتوي على جلاتين حيواني.
- يُتناول قبل النوم فقط. لا تُؤخذ قبل القيادة أو تشغيل المعدات.
- لا يُنصح به أثناء الحمل والرضاعة، أو لمن يأخذ مضادات الاكتئاب أو أدوية ضغط الدم بدون استشارة طبيب.

### Claims (locked)
- "تساعد على تقصير وقت الخلود إلى النوم." ✅ (EFSA claim, 1 mg melatonin.)
- "تدعم نومًا أعمق." ✅
- "بديل للحبوب المنوّمة." ❌ Forbidden.

### Stock / offer / cross-sell
- Stock label: `بقي 19 علبة من دفعة هذا الأسبوع.`
- Default offer: Glow Kit (349 SAR).
- Cross-sell: primary `حبّة نورة`, secondary `حبّة جذر`.
- Post-form upsell: **حبّة نورة (1 box at 99 SAR)**.

---

## 4. حبّة نورة — Beauty Gummy

### Hero tag
إشراقة من جوّا — كولاجين بحري + فيتامين سي + حمض الهيالورونيك + زنك.

### Short description
حلوى الجمال بالكولاجين البحري وفيتامين سي وحمض الهيالورونيك — لبشرةٍ مشرقة، مرونةٍ، وأظافر أقوى.

### Long description
ببتيدات كولاجين بحري صغيرة الجزيئات تُمتص بكفاءة، مدعومة بفيتامين سي ليساعد جسمكِ على تصنيع الكولاجين الخاص بكِ، حمض هيالورونيك لاحتجاز الترطيب، وزنك للأظافر والشعر المرافق. حبّتان في اليوم — وانتهيتي.

### Ingredients (per 2-gummy serving)

| Ingredient (AR / EN) | Dose | What it does | Source (short) |
|---|---|---|---|
| كولاجين بحري / Marine Collagen peptides (Type I, hydrolyzed) | 2,500 mg | ببتيدات صغيرة (≤ 5 kDa) لامتصاص أفضل. | Choi et al., 2014, *J Med Food*, RCT on skin elasticity. |
| فيتامين سي / Vitamin C (L-ascorbic acid) | 80 mg | كوفاكتور أساسي لتصنيع الكولاجين. | EFSA approved claim. |
| حمض الهيالورونيك / Hyaluronic Acid (sodium hyaluronate) | 50 mg | يدعم احتجاز الترطيب في الأدمة. | Oe et al., 2017, *Clin Cosmet Investig Dermatol*. |
| زنك / Zinc | 5 mg | يساهم في الحفاظ على بشرة وأظافر طبيعية. | EFSA. |
| بيوتين / Biotin | 1,000 mcg | يدعم بنية الكيراتين. | EFSA. |

### Allergens / safety
- يحتوي على مشتقّات بحرية.
- لا يُنصح به أثناء الحمل والرضاعة.

### Claims
- "يدعم مرونة البشرة وترطيبها." ✅
- "يساهم في الحفاظ على بشرة طبيعية." ✅
- "يُزيل التجاعيد." ❌ Forbidden.

### Stock / offer / cross-sell
- Stock label: `بقي 27 علبة من دفعة هذا الأسبوع.`
- Default offer: Glow Kit.
- Cross-sell: primary `حبّة جذر`, secondary `حبّة ليالي`.
- Post-form upsell: **حبّة جذر (1 box at 99 SAR)**.

---

## 5. Certifications & badges (used on PDP trust strip + product card badges)

These are the brand's commitments (or planned commitments — wording is hedged to avoid claiming a certificate the brand doesn't yet hold).

| Badge | When to show | Wording |
|---|---|---|
| `حلال` | Always | حلال ١٠٠٪ — بيكتين نباتي |
| `GMP` | Always | معامل بمعايير GMP |
| `Lab-tested` | Always | مفحوصة مخبريًا — COA لكل دفعة |
| `Vegan gelling` | Always | بدون جيلاتين حيواني |
| `No added sugar` | جذر + نورة only (Layali has trace) | بدون سكر مضاف |
| `Made in KSA` (assembly) | Always | تُغلَّف في السعودية |
| `SFDA registered` | **Only when registration confirmed by founder** | مسجَّلة لدى الهيئة العامة للغذاء والدواء |

If the founder has not yet confirmed SFDA registration at launch, **omit** that badge. The AI coder must accept a backend env flag `SFDA_BADGE_ENABLED=false` that hides the badge across the site.

## 6. Upsell SKU (post-form modal)

The post-form upsell is presented as a single-box variant of a complementary SKU at **99 SAR** (capped one-time discount):

| If cart contains primarily… | Upsell SKU | Upsell price |
|---|---|---|
| جذر | نورة | 99 SAR |
| ليالي | نورة | 99 SAR |
| نورة | جذر | 99 SAR |

If the cart has multiple SKUs, prefer the one missing from the cart with priority: `نورة` > `جذر` > `ليالي`.

## 7. JSON-LD structured data per product

For each PDP, the backend exposes a serializer that produces:

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "حبّة جذر — حلوى الشعر",
  "image": ["https://raheeqarabia.com/images/products/jathr/cover.jpg"],
  "description": "حلوى الشعر بالبيوتين، الساو بالميتو، والكولاجين البحري...",
  "sku": "RA-JATHR-30",
  "brand": { "@type": "Brand", "name": "رحيق Raheeq Arabia" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "412" },
  "offers": [
    { "@type": "Offer", "price": "199", "priceCurrency": "SAR", "availability": "https://schema.org/InStock" },
    { "@type": "Offer", "price": "279", "priceCurrency": "SAR", "availability": "https://schema.org/InStock" },
    { "@type": "Offer", "price": "349", "priceCurrency": "SAR", "availability": "https://schema.org/InStock" }
  ]
}
```

The frontend embeds this in `<script type="application/ld+json">` inside the PDP server component.

## 8. SEO meta per product

| SKU | Title | Description |
|---|---|---|
| جذر | حبّة جذر — حلوى الشعر بالبيوتين والساو بالميتو والكولاجين البحري · رحيق | كثافة من الجذر، قوّة الشعرة، أظافر أقوى — بمكوّناتٍ عالمية وفحص COA لكل دفعة. الدفع عند الاستلام. |
| ليالي | حبّة ليالي — حلوى النوم بالميلاتونين والأشواغاندا · رحيق | نوم أعمق وصباح خفيف — جرعة ميلاتونين ذكية + KSM-66®. الدفع عند الاستلام. |
| نورة | حبّة نورة — حلوى الجمال بالكولاجين البحري وفيتامين سي · رحيق | إشراقة، مرونة، أظافر أقوى — كولاجين بببتيدات صغيرة + فيتامين سي. الدفع عند الاستلام. |
