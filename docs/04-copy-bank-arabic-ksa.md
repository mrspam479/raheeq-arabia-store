# 04 — Copy Bank (KSA Dialect, Production-Ready)

Every string the AI coder needs to ship the site. **Paste verbatim.** Do not paraphrase, do not auto-translate. Tone validated against `03-icp-and-positioning.md` § 6.

> Quoting rules: Arabic punctuation `،` (comma) and `؛` (semicolon) and `؟` (question mark). Numbers may be Latin (`199 ر.س`) — KSA shoppers read both, Latin numerals scan faster on mobile.

---

## A. Global UI strings (header, footer, buttons, toasts)

```
NAV_HOME=الرئيسية
NAV_COLLECTION=المنتجات
NAV_ABOUT=عن رحيق
NAV_CONTACT=تواصلي معنا
NAV_CART=السلّة

CTA_SHOP_NOW=تسوّقي الآن
CTA_BUY_NOW=اطلبي الآن — دفع عند الاستلام
CTA_ADD_TO_CART=أضيفي إلى السلّة
CTA_VIEW_CART=عرض السلّة
CTA_CHECKOUT=أكملي الطلب
CTA_BACK_TO_SHOPPING=رجوع للتسوّق
CTA_CONFIRM_ORDER=تأكيد الطلب — دفع عند الاستلام
CTA_ADD_UPSELL=أضيفيها لطلبي بـ 99 ر.س
CTA_SKIP_UPSELL=لا، شكرًا — أكملي بدون الإضافة

BADGE_COD=الدفع عند الاستلام
BADGE_FAST_SHIP=شحن سريع داخل المملكة
BADGE_LAB_TESTED=مفحوصة مخبريًا
BADGE_GMP=معامل بمعايير GMP
BADGE_VEGAN=بدون جيلاتين حيواني
BADGE_NO_SUGAR=بدون سكر مضاف
BADGE_HALAL=حلال ١٠٠٪
BADGE_KSA=صُمِّمت في السعودية

TOAST_ADDED=تمت إضافتها للسلّة 🌿
TOAST_REMOVED=تمت الإزالة من السلّة
TOAST_OFFER_SAVED=وفّرتي {savings} ر.س
TOAST_PHONE_INVALID=الرجاء إدخال رقم جوال سعودي صحيح (مثال: 05XXXXXXXX)
TOAST_ORDER_SUCCESS=استلمنا طلبكِ — بنكلّمكِ قريب
TOAST_ERROR=صار خلل بسيط، حاولي مرة ثانية

FOOTER_TAGLINE=رحيق — مكمّلات تليق بكِ.
FOOTER_RIGHTS=© رحيق ٢٠٢٦ — كل الحقوق محفوظة.
FOOTER_PAYMENT=الدفع عند الاستلام فقط.
FOOTER_SHIPS=نشحن لكل مدن المملكة.
```

---

## B. Home page

### B1. Top announcement bar (rotates every 6s, 3 messages)

1. `شحن داخل المملكة في ١–٣ أيام عمل · دفع عند الاستلام`
2. `ضمان رضا ١٤ يوم · نختبر كل دفعة مخبريًا`
3. `طلب ٣ علب = الأفضل قيمةً — وفّري حتى ٢٤٨ ر.س`

### B2. Hero

- **Eyebrow** (small, accent gold): `جديد · من السعودية`
- **Headline** (Tajawal 700, fluid 40–72): `حلوى يومية تُغنيكِ عن ١٠ مكمّلات.`
- **Subheadline** (Tajawal 400, body+1): `حبّة جذر، حبّة ليالي، حبّة نورة — تركيبات بمكوّنات عالمية، بطعم حلوى، بأمانٍ مختبري.`
- **Primary CTA**: `اكتشفي المجموعة` → `/collection`
- **Secondary CTA** (text link with arrow): `قصة رحيق ←` → `/about`
- **Trust strip directly under hero** (5 icons + label, horizontally scrollable on mobile):
  - `الدفع عند الاستلام`
  - `شحن ١–٣ أيام`
  - `حلال ١٠٠٪`
  - `بدون سكر مضاف`
  - `مفحوصة مخبريًا`

### B3. "ليش رحيق؟" (Why Raheeq) — 3 columns

| Column title | Body |
|---|---|
| `مكوّنات عالمية` | `نختار مكوّناتنا من موردين معتمدين بشهادات تحليل لكل دفعة.` |
| `يدٌ عربية` | `تُغلَّف في السعودية بمعايير GMP، وتمرّ بفحص استقرار قبل أن تصلكِ.` |
| `ريتوال يومي` | `حبّتان في اليوم — طقس صغير يذكّركِ إنّكِ الأولى.` |

### B4. Products row (3 cards)

Heading: `اختاري حبّتك`
Sub: `كل تركيبة محسوبة لهدف واحد — ومُصاغة لتكون يومًا لذيذًا.`

Each card has: Product name (`حبّة جذر`), one-line benefit (see B4 sub-strings below), stars `★★★★★ 4.9/5` + `(٣٢١ تقييم)`, hover→ "اعرفي أكثر".

| SKU | One-liner |
|---|---|
| `حبّة جذر` | `لشعر أكثف وأقوى — بيوتين + ساو بالميتو + كولاجين بحري.` |
| `حبّة ليالي` | `نوم عميق وراحة الأعصاب — ميلاتونين + أشواغاندا.` |
| `حبّة نورة` | `إشراقة وكولاجين — كولاجين بحري + فيتامين سي.` |

### B5. The ritual section (image left + copy right, alternate next row)

Heading: `حبّتان في اليوم… وانتهيتي.`
Body: `صباحًا مع قهوتك، أو في وقتٍ تختارينه — رحيق يدخل روتينكِ بدون جهد. لا أقراص، لا ماء كثير، لا طعمٌ يكرهه القلب.`

### B6. Proof bar (alternating)

- `+12,000` `عميلة سعودية`
- `4.9 / 5` `متوسط تقييم`
- `97%` `نسبة الرضا`
- `1–3 أيام` `للتوصيل في المدن الرئيسية`

### B7. Founder note

Heading: `كلمة من المؤسِّسة`
Body: `بدأتُ رحيق لأنّي بحثتُ طويلًا عن منتج أحبّه قبل أن أبيعه — مكمّل عربيٌّ، نظيف، بطعم لذيذ، وأمان نثق فيه. ها هو، بين يديك.`
Signature line: `— مؤسِّسة رحيق`

### B8. Reviews carousel (use the 6 reviews in C below, randomized per visit)

Heading: `بنات رحيق يقلن`

### B9. FAQ (collapsible, 6 items)

1. `Q: ما هي مكوّنات رحيق؟` — `A: كل علبة موضّحة فيها مكوّناتها بالتفصيل في صفحتها. نستخدم مكوّنات عالمية بمعايير GMP.`
2. `Q: متى يبان مفعول رحيق؟` — `A: أوّل تغيّر ملحوظ بعد ٣٠ يومًا، ونوصي بدورة ٩٠ يومًا لأفضل نتائج.`
3. `Q: هل آمن أثناء الحمل أو الرضاعة؟` — `A: لا نوصي به أثناء الحمل أو الرضاعة. استشيري طبيبكِ.`
4. `Q: هل المنتج حلال؟` — `A: نعم، نستخدم بيكتين نباتي بدلًا من الجيلاتين الحيواني، وكل التركيبات حلال ١٠٠٪.`
5. `Q: كيف الدفع والشحن؟` — `A: الدفع عند الاستلام لكل مدن المملكة. الشحن خلال ١–٣ أيام عمل للمدن الرئيسية.`
6. `Q: هل يمكنني إرجاع المنتج؟` — `A: ضمان رضا ١٤ يومًا على العلبة المغلقة.`

### B10. Closing CTA band (full bleed, primary green bg)

- Eyebrow: `ابدئي ريتوالكِ اليوم`
- Headline: `حلوى تليق بكِ — وتشتغل لكِ.`
- CTA: `تسوّقي المجموعة` → `/collection`

---

## C. Reviews (curated for v1)

> AI coder uses these verbatim. They are first-person KSA voices. Names are first-name-only + city initial for privacy.

1. **رهف · الرياض · ★★★★★** — "بصراحة كنت متردّدة، بس بعد شهر من حبّة جذر شعري وقف يطيح بنفس الكميّة. التغليف يجنّن."
2. **سلوى · جدة · ★★★★★** — "ليالي غيّرت نومي. أصحى مرتاحة بدون دوخة. صار جزء من روتيني قبل النوم."
3. **منيرة · الدمام · ★★★★★** — "حبّة نورة بشرتي شربت كولاجين. الإشراقة في الصور بنفسها."
4. **هيا · مكة · ★★★★★** — "وصلتني بثلاث أيام. الدفع عند الاستلام عجبني. الطعم لذيذ مو زي الفيتامينات الجافة."
5. **العنود · الرياض · ★★★★★** — "اشتريت ٣ علب جذر بـ ٣٤٩، صراحة قيمة ممتازة. شعري بدأ يطلع جوّاني وحتى الحاجبين."
6. **شذى · الخبر · ★★★★★** — "خدمة العملاء ردّت علي في نفس اليوم وأكدت لي طلبي. حسّيت إن البراند سعودي فعلًا."

---

## D. حبّة جذر — Hair Gummy PDP copy

### D1. Title block

- Eyebrow: `لشعر يحبّكِ كما تحبّينه`
- H1: `حبّة جذر`
- Subhead: `حلوى الشعر بالبيوتين والساو بالميتو والكولاجين البحري — لكثافة من الجذر.`
- Star line: `★★★★★ 4.9 (٤١٢ تقييم) · ٩٧٪ ينصحن بها`
- Stock note (accent gold, italic): `بقي ٣٢ علبة من دفعة هذا الأسبوع.`

### D2. Offer block (3 tiles — locked layout)

| Tile label | Body | Price | Sub-label |
|---|---|---|---|
| `علبة` | `تجربة شهر` | `199 ر.س` | `1 علبة` |
| `الزوجي` | `الأفضل قيمةً للتجربة` | `279 ر.س` | `2 علبة · وفّري 119 ر.س` |
| `Glow Kit (الأنصح)` | `دورة 90 يوم — أعلى نتيجة` | `349 ر.س` | `3 علبة · وفّري 248 ر.س` |

Default selected: `Glow Kit (الأنصح)`. Glow tile has accent-gold border + `الأنصح` ribbon.

### D3. Quick benefits row (icons + text)

- `كثافة من الجذر`
- `قوّة وتقليل تساقط`
- `لمعان طبيعي`
- `أظافر مرافقة أقوى`

### D4. "ليش جذر؟" — Section (image left + copy right)

Heading: `لأنّ شعركِ يستحقّ علاجًا من الجذر — حرفيًا.`
Body: `حبّة جذر تركيبة محسوبة بأربع عناصر تشتغل سويًا — بيوتين لتغذية الجذر، ساو بالميتو لتوازن DHT، كولاجين بحري لبنية الشعرة، وزنك لدورة النموّ. بدون هرمونات. بدون حشوات.`

### D5. Ingredients deep-dive (alternating layout cards)

Pull from `05-products.md § حبّة جذر`. Each ingredient card has:
`- اسم المكوّن`
`- الجرعة لكل حبّتين`
`- ماذا يفعل (٢ سطر)`
`- مصدر علمي مختصر`

### D6. How to use

Heading: `كيف تستخدمينها`
Body:
- `حبّتان في اليوم بعد الفطور.`
- `يفضّل دورة ٩٠ يومًا متواصلة.`
- `لا تتجاوزي الجرعة اليومية.`

### D7. Proof (image full-width)

- Caption: `قبل الاستخدام · بعد ٩٠ يومًا — صور حقيقية من عميلاتنا.`

### D8. Reviews specific to جذر (3)

Pull names #1, #5 from C; add: **ريم · جدة** — `بعد شهرين شعري طلع له طول جدّي، والكثافة بانت في الصورة الأخيرة.`

### D9. FAQs specific to جذر (5)

1. `Q: متى يبان الفرق؟` — `A: أول مؤشر بعد ٣٠ يوم، النتيجة الواضحة بعد ٩٠ يوم.`
2. `Q: هل آمن مع الحمل؟` — `A: لا يُنصح به أثناء الحمل والرضاعة. استشيري طبيبكِ.`
3. `Q: هل يحتوي جلاتين حيواني؟` — `A: لا، نستخدم بيكتين نباتي.`
4. `Q: هل أحتاج فحص قبل الاستخدام؟` — `A: لا، التركيبة آمنة للبالغين الأصحّاء. لو عندكِ حالة طبية استشيري طبيبكِ.`
5. `Q: هل يمكن أخذه مع مكمّل آخر؟` — `A: نعم، إذا لم يكن يحتوي على نفس المكوّنات بجرعات عالية.`

### D10. Sticky bottom bar (mobile only, < 1024px)

`السعر · اسم الباقة المختارة → CTA: أضيفي إلى السلّة`

---

## E. حبّة ليالي — Sleep Gummy PDP copy

### E1. Title block

- Eyebrow: `نوم يستحقّ ليلتكِ`
- H1: `حبّة ليالي`
- Subhead: `حلوى النوم والاسترخاء بالميلاتونين والأشواغاندا — لراحة الأعصاب وصباحٍ خفيف.`
- Stars: `★★★★★ 4.9 (٢٧٨ تقييم)`
- Stock: `بقي ١٩ علبة من دفعة هذا الأسبوع.`

### E2. Offer block — same 199/279/349 tiles, default Glow Kit.

### E3. Benefits

- `نوم أعمق`
- `هدوء أعصاب بدون إدمان`
- `صباح بدون دوخة`
- `جودة استيقاظ`

### E4. Section heading: `ليلتكِ تستحقّ تركيبة أهدأ.`

Body: `ليالي تجمع ميلاتونين بجرعة ذكية وأشواغاندا KSM-66® لتقلّل التوتر، مع L-ثيانين من الشاي الأخضر لخفض الذهن قبل النوم. لا تسبّب اعتمادًا.`

### E5. Ingredients per `05-products.md § حبّة ليالي`.

### E6. How to use

- `حبّتان قبل النوم بـ ٣٠ دقيقة.`
- `يفضّل تقليل الشاشات ٢٠ دقيقة قبل الاستخدام.`
- `لا تتجاوزي الجرعة.`

### E7. Reviews

Use #2 above + 2 more:
- **لمى · الرياض** — `أوّل ليلة فرّقت. حسّيت بهدوء غريب — نمت بدون لفّ.`
- **شهد · جدة** — `جربت كل شي قبل، بس هذي وحدها اللي ما خلّتني تعبانة الصباح.`

### E8. FAQs

1. `Q: هل تسبّب الإدمان؟` — `A: لا، التركيبة لا تسبّب اعتمادًا. الميلاتونين هرمون نومٍ طبيعي بجرعة منخفضة.`
2. `Q: متى يبدأ مفعولها؟` — `A: خلال ٢٠–٤٠ دقيقة من تناولها.`
3. `Q: هل تسبّب دوخة في الصباح؟` — `A: بالجرعة الموصى بها، لا.`
4. `Q: هل أستطيع قيادة السيارة بعدها؟` — `A: لا، تُؤخذ قبل النوم فقط.`
5. `Q: هل آمنة مع الحمل؟` — `A: لا يُنصح بها أثناء الحمل والرضاعة.`

---

## F. حبّة نورة — Beauty Gummy PDP copy

### F1. Title block

- Eyebrow: `إشراقة من جوّا`
- H1: `حبّة نورة`
- Subhead: `حلوى الجمال بالكولاجين البحري وفيتامين سي — لبشرة مشرقة وأظافر قوية.`
- Stars: `★★★★★ 4.9 (٣٦٤ تقييم)`
- Stock: `بقي ٢٧ علبة من دفعة هذا الأسبوع.`

### F2. Offer block — same 199/279/349 tiles, default Glow Kit.

### F3. Benefits

- `إشراقة طبيعية`
- `مرونة وكولاجين`
- `حماية بفيتامين سي`
- `أظافر أقوى`

### F4. Section heading: `الكولاجين الذي يصل فعلًا — بحري، صغير الجزيئات، وبجرعة تشتغل.`

Body: `نورة تستخدم ببتيدات كولاجين بحري (Type I) بحجم جزيئاتٍ صغير ليُمتص بكفاءة، مدعومة بفيتامين سي لزيادة تصنيع الكولاجين، حمض الهيالورونيك لترطيب، وزنك للأظافر.`

### F5. Ingredients per `05-products.md § حبّة نورة`.

### F6. How to use

- `حبّتان في اليوم بعد الفطور.`
- `للنتيجة المثلى — دورة ٩٠ يوم.`

### F7. Reviews

Use #3, #6 from C + add: **جواهر · الرياض** — `بشرتي وجهت تعطيني بريق طبيعي، ومن غير ميك أب صرت أحبّ صوري.`

### F8. FAQs (5 similar to D9 with نورة-specific phrasing).

---

## G. Collection page copy

### G1. Hero block

- Eyebrow: `المجموعة الكاملة`
- H1: `ثلاث حبّات — ثلاث طقوس.`
- Sub: `اختاري الباقة التي تليق بأهدافكِ. كلّها بنفس وعد الجودة.`

### G2. Product card copy (mirrors B4).

### G3. Combo strip at the bottom

Heading: `الباقة الذهبية — رحيق الكاملة`
Sub: `حبّة جذر + حبّة ليالي + حبّة نورة — لروتين شامل.`
Note (text link): `أضيفيها واحدةً واحدةً بالباقة الذهبية — وفّري على الكلّ بطلب ثلاث علب من نفس المنتج.`
> v1 keeps offers within a single SKU. The "ذهبية" line is positioning, not a separate SKU.

---

## H. About page copy

### H1. Hero

- Eyebrow: `قصّة رحيق`
- H1: `بدأت بفكرة. وانتهت بطقس يومي يُحبّ.`
- Lede: `رحيق ليست مجرّد علامة مكمّلات — هي محاولة عربية صادقة لإعادة كتابة العناية اليومية، بمكوّنات نثق فيها، وبأيدٍ نعرفها.`

### H2. Founder story (long form)

```
بدأتُ رحيق بسؤالٍ بسيط:
"ليش ما ألقى مكمّل أحبّه قبل أن أبيعه؟"
بحثتُ في مصانع عالمية، جرّبت تركيبات كثيرة، ورفضت أكثر مما قبلت.
الفكرة كانت واضحة: ثلاث حبّات تشتغل لثلاث رغبات — شعر، نوم، بشرة — بمعايير GMP، وبأمانٍ مختبري لكل دفعة، وبتغليفٍ يليق بكِ.
كنت أبحث عن منتج يجلس على طاولتي قبل أن يجلس على رفّ صيدلية.
ها هو بين يديكِ.

— مؤسِّسة رحيق
```

### H3. Pillars (3 columns)

- `جودة عالمية` — `موردين معتمدين، شهادات تحليل، فحص استقرار.`
- `يدٌ عربية` — `تركيب وتغليف في السعودية بمعايير GMP.`
- `وعد واضح` — `ضمان رضا ١٤ يوم — والدفع عند الاستلام دائمًا.`

### H4. Lab/process strip (4 steps, with placeholder icons)

1. `اختيار المورد`
2. `فحص الجودة (COA)`
3. `تعبئة بمعايير GMP`
4. `فحص استقرار قبل الشحن`

### H5. Closing CTA: `ابدئي اليوم →`

---

## I. Contact page copy

- Eyebrow: `تواصلي معنا`
- H1: `هنا — للإجابة عن أي سؤال.`
- Body: `فريق رحيق متاح من الأحد إلى الخميس، ٩ ص — ٦ م، عبر واتساب أو البريد.`
- WhatsApp button: `راسلينا على واتساب`
- Email: `hello@raheeqarabia.com`
- Address line: `الرياض، المملكة العربية السعودية`
- Note: `الاستفسارات الطبية يفضَّل توجيهها إلى طبيب مختص.`

Contact form fields (optional, just sends an email — out of scope for v1 if email isn't set up):
- `الاسم`
- `الجوال`
- `الموضوع`
- `الرسالة`
- CTA: `إرسال`

---

## J. Cart drawer copy

- Heading: `سلّتكِ`
- Empty state: `سلّتكِ فاضية — اختاري حبّتكِ من المجموعة.` + CTA `تصفّحي المجموعة`
- Item meta: `الباقة المختارة · 3 علبة` (sub-line in muted)
- Remove tooltip: `إزالة`
- Cross-sell section heading: `يضيف لطلبكِ`
- Cross-sell CTA on each card: `أضيفي`
- Subtotal label: `الإجمالي`
- Shipping line: `الشحن مجاني داخل المملكة`
- COD line: `الدفع عند الاستلام`
- Primary CTA at bottom: `أكملي الطلب`

## K. Checkout modal copy (opens on cart CTA)

- Heading: `أكملي طلبكِ — دفع عند الاستلام`
- Trust line under heading: `بياناتكِ تُستخدم فقط لتأكيد الطلب وتوصيله.`
- Order summary box: same items + subtotal + COD note.
- Scarcity micro-line: `بقي عدد محدود من علب هذه الدفعة — احجزي طلبكِ.`
- Field 1 label: `الاسم الكامل`
- Field 1 placeholder: `مثال: نورة العتيبي`
- Field 1 error: `الرجاء كتابة اسمكِ.`
- Field 2 label: `رقم الجوال`
- Field 2 placeholder: `05XXXXXXXX`
- Field 2 error invalid: `الرجاء إدخال رقم سعودي صحيح يبدأ بـ 05 أو +966.`
- Submit CTA: `تأكيد الطلب — دفع عند الاستلام`
- Below CTA: `بالضغط على "تأكيد" أوافق على الشحن عند الاستلام والاتصال بي للتأكيد.`
- Mini trust row at bottom: `شحن آمن · ضمان رضا ١٤ يوم · فريق سعودي`

## L. Post-form upsell modal (10–15s window)

- Eyebrow: `عرض لمرّة واحدة — لكِ فقط الآن`
- H1: `أضيفي حبّة {UPSELL_NAME} بسعر ٩٩ ر.س فقط`
- Sub: `بدل ١٩٩ ر.س — وفّري ١٠٠ ر.س. تنطبق على هذا الطلب فقط.`
- Visual countdown (15s).
- Bullets:
  - `تنضمّ إلى طلبكِ الحالي بدون شحن إضافي`
  - `نفس الجودة، نفس الضمان`
  - `لن يظهر هذا العرض مرة ثانية`
- CTA primary: `أضيفيها لطلبي بـ ٩٩ ر.س`
- CTA tertiary (link, no border): `لا، شكرًا — أكملي بدون الإضافة`

## M. Thank-you page copy

- Eyebrow: `استلمنا طلبكِ`
- H1: `شكرًا {FIRST_NAME} — طلبكِ في أيادٍ أمينة.`
- Body: `راح يكلّمكِ فريق رحيق خلال ٢٤ ساعة لتأكيد العنوان وموعد الاستلام. اطمئنّي — كل شي تمام.`
- Order ID block (small): `رقم الطلب: {ORDER_ID}`
- Order summary card (read-only).
- Suggestions strip ("ربما تعجبكِ أيضًا" — 2 cards of other SKUs).
- CTA: `العودة للرئيسية`

---

## N. Error & legal microcopy

- 404 H1: `الصفحة ما لقيناها.` Sub: `يمكن الرابط تغيّر. ارجعي للرئيسية وكلّ شي بخير.` CTA: `الرئيسية`
- 500 H1: `صار شي بسيط من جهتنا.` Sub: `جرّبي بعد دقيقة. لو استمرّ، راسلينا على واتساب.`
- Cookie banner (one line, dismissable, no walls): `نستخدم كوكيز لتحسين تجربتكِ ولتحسين إعلاناتنا. بمتابعتكِ توافقين.` CTA: `موافقة`. Secondary text link: `سياسة الخصوصية`.
- Form spam honeypot field: hidden, label `website` — never visible.

---

## O. Email/WhatsApp templates (for ops, not on the site, but documented here so they live in one place)

### O1. Order confirmation WhatsApp template

```
السلام عليكم {FIRST_NAME} 👋
معكِ فريق رحيق. وصلنا طلبكِ رقم {ORDER_ID}:
{ITEMS}
الإجمالي: {TOTAL} ر.س — الدفع عند الاستلام.
نحتاج نأكّد عنوانكِ وموعدًا مناسبًا للتوصيل. هل تفضّلين العنوان التالي: {ADDRESS_OR_PROMPT}؟
شكرًا لثقتكِ — رحيق.
```

### O2. Out-of-stock template

```
{FIRST_NAME} عزيزتي،
دفعة {SKU} انتهت أسرع مما توقّعنا 🌿
بإذن الله الدفعة الجديدة تصلنا خلال {DAYS} أيام. نقدر نضيفكِ لقائمة الاستلام الأولوية؟
```

---

## P. Pixel event payload — user-facing description copy

When the AI coder writes structured data (JSON-LD) and product `description` fields, use:

- Brand: `رحيق Raheeq Arabia`
- Category: `مكمّلات غذائية · حلوى وظيفية`
- Audience: `Adult women, KSA`

---

**End of copy bank.** Anything not covered above must be flagged to the founder and not invented.
