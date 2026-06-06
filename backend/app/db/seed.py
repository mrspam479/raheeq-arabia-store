"""Idempotent seed: insert 3 products + ingredients + offers + reviews + FAQs."""
from __future__ import annotations

from decimal import Decimal

import structlog
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Faq, Ingredient, Offer, Product, Review

logger = structlog.get_logger()

PRODUCTS = [
    {
        "slug": "habba-nadra",
        "name_ar": "حبّة نضرة",
        "working_name": "Anti-Wrinkle Gummy",
        "hero_tag_ar": "تجاعيد أقل. إشراقة أكثر. من الداخل.",
        "short_description_ar": "الكريمات تبقى على السطح. نضرة تشتغل من الداخل. أستازانتين يحمي بشرتكِ + كولاجين بحري يبنيها من جديد. النتيجة تبدأ من الأسبوع الرابع.",
        "long_description_ar": "بعد سن ٢٥، بشرتكِ تفقد الكولاجين كل سنة. الكريمات ما تعوّض هذا — جزيئاتها كبيرة ما تدخل الجلد. نضرة تشتغل من الداخل: أستازانتين يحمي خلايا بشرتكِ من الشمس والتأكسد. كولاجين بحري يبني كولاجين جديد. فيتامين سي يُضاعف البناء. هيالورونيك يحبس الرطوبة. حبّتين بالصباح — وخلال شهر تلاحظين الفرق.",
        "rating_value": Decimal("4.9"),
        "review_count": 387,
        "stock_label_ar": "بقي 24 علبة من دفعة هذا الأسبوع.",
        "cover_image_url": "/images/products/habba-nadra/cover.png",
        "gallery_image_urls": [
            "/images/products/habba-nadra/cover.png",
        ],
        "sort_order": 0,
        "seo_title_ar": "حبّة نضرة — أستازانتين + كولاجين بحري لبشرة أصغر من الداخل · رحيق",
        "seo_description_ar": "أقوى مضاد أكسدة + كولاجين بحري ٣٠٠٠ ملغ — تجاعيد أقل، إشراقة أكثر. الدفع عند الاستلام.",
    },
    {
        "slug": "habba-bareeq",
        "name_ar": "حبّة بريق",
        "working_name": "Dark Circle Gummy",
        "hero_tag_ar": "هالات أفتح. بدون كونسيلر.",
        "short_description_ar": "الهالات مش مشكلة نوم — هي مشكلة تصبّغ ونقص حديد. بريق تهاجم السواد مباشرة: فيتامين سي يُفتّح، حديد يعالج النقص، نياسيناميد يوقف التصبّغ. ثلاث جهات مباشرة.",
        "long_description_ar": "الهالات لها ٣ أسباب: تصبّغ، نقص حديد، وتراكم ميلانين. بريق تعالج الثلاثة مباشرة. فيتامين سي يُفتّح اللون. الحديد يرفع الأكسجين في الدم فيقلّ السواد. النياسيناميد يوقف الميلانين. مش حبّة نوم — هجوم مباشر على الهالات.",
        "rating_value": Decimal("4.8"),
        "review_count": 293,
        "stock_label_ar": "بقي 18 علبة من دفعة هذا الأسبوع.",
        "cover_image_url": "/images/products/habba-bareeq/cover.png",
        "gallery_image_urls": [
            "/images/products/habba-bareeq/cover.png",
        ],
        "sort_order": 1,
        "seo_title_ar": "حبّة بريق — فيتامين سي + حديد + نياسيناميد ضد الهالات السوداء · رحيق",
        "seo_description_ar": "تهاجم الهالات مباشرة من ٣ مسارات — تفتيح + حديد + منع تصبّغ. الدفع عند الاستلام.",
    },
    {
        "slug": "habba-jathr",
        "name_ar": "حبّة جذر",
        "working_name": "Hair Growth Gummy",
        "hero_tag_ar": "شعر أكثف. تساقط أقل. من الجذر.",
        "short_description_ar": "الزيوت والكريمات توصل للشعرة بس — ما توصل للجذر. جذر تشتغل من الداخل: مستخلص تفاح أنوركا الإيطالي أعاد نمو الشعر في ٢٥٠ امرأة خلال ٦٠ يوم. مع بيوتين يبني الكيراتين وزنك يُدير دورة النمو.",
        "long_description_ar": "التساقط يبدأ من بصيلة تعاني من الداخل. جذر تغذّي البصيلة بـ ٥ مكوّنات: مستخلص تفاح أنوركا يعيد النمو (مثبت في دراسة على ٢٥٠ شخص). بيوتين يبني الكيراتين. زنك يُدير دورة النمو. فيتامين D3 يدعم البصيلات. حمض الفوليك يُسرّع النمو. حبّتين بالصباح — وخلال شهرين تلاحظين الفرق.",
        "rating_value": Decimal("4.9"),
        "review_count": 412,
        "stock_label_ar": "بقي 32 علبة من دفعة هذا الأسبوع.",
        "cover_image_url": "/images/products/habba-jathr/cover.png",
        "gallery_image_urls": [
            "/images/products/habba-jathr/cover.png",
        ],
        "sort_order": 2,
        "seo_title_ar": "حبّة جذر — مستخلص تفاح أنوركا + بيوتين لشعر أكثف وأقوى · رحيق",
        "seo_description_ar": "مكوّن إيطالي أعاد نمو الشعر في ٢٥٠ امرأة خلال ٦٠ يومًا + بيوتين ١٠,٠٠٠ مكغ. الدفع عند الاستلام.",
    },
    {
        "slug": "bundle-glow-trio",
        "name_ar": "صندوق الجمال الكامل",
        "working_name": "Glow Trio Bundle",
        "hero_tag_ar": "بشرة + هالات + شعر · الـ 3 منتجات بـ 499 ريال سعودي بدلًا من 597.",
        "short_description_ar": "الـ 3 منتجات اللي تحتاجينها لجمالكِ الكامل، في صندوق واحد. سعر أقل من الشراء الفردي بـ 100 ريال سعودي.",
        "long_description_ar": "بدل ما تطلبين كل منتج بـ 199 ريال سعودي (المجموع 597)، خذي الصندوق الكامل بـ 499 ريال سعودي. حبّة نضرة لبشرتكِ + حبّة بريق لهالاتكِ + حبّة جذر لشعركِ — كل شيء يشتغل سوا لمدة شهر كامل.",
        "rating_value": Decimal("4.9"),
        "review_count": 142,
        "stock_label_ar": "بقي 12 صندوق من دفعة هذا الأسبوع.",
        "cover_image_url": "/images/products/bundle-glow-trio/cover.png",
        "gallery_image_urls": [
            "/images/products/bundle-glow-trio/cover.png",
            "/images/products/habba-nadra/cover.png",
            "/images/products/habba-bareeq/cover.png",
            "/images/products/habba-jathr/cover.png",
        ],
        "sort_order": 3,
        "seo_title_ar": "صندوق الجمال الكامل — بشرة + هالات + شعر بـ 499 ريال سعودي · رحيق",
        "seo_description_ar": "الـ 3 منتجات في صندوق واحد بـ 499 ريال سعودي بدلًا من 597. شحن مجاني · دفع عند الاستلام.",
    },
]

INGREDIENTS: dict[str, list[dict]] = {
    "habba-nadra": [
        {"name_ar": "أستازانتين", "name_en": "Astaxanthin (from Haematococcus pluvialis)", "dose": "8 mg", "what_it_does_ar": "يحمي بشرتكِ من الشمس والتأكسد من الداخل. أقوى ٦٠٠٠ مرة من فيتامين سي.", "science_source_short": "Tominaga et al., 2017, J Clin Biochem Nutr.", "sort_order": 0, "thumb_image_url": None},
        {"name_ar": "كولاجين بحري", "name_en": "Marine Collagen peptides (Type I, hydrolyzed)", "dose": "3000 mg", "what_it_does_ar": "يصل لطبقات البشرة العميقة ويُحفّز بناء كولاجين جديد.", "science_source_short": "Asserin et al., 2015, J Cosmet Dermatol.", "sort_order": 1, "thumb_image_url": None},
        {"name_ar": "فيتامين سي", "name_en": "Vitamin C (L-ascorbic acid)", "dose": "80 mg", "what_it_does_ar": "بدونه ما يتكوّن كولاجين. يُضاعف البناء ويُفتّح البشرة.", "science_source_short": "EFSA approved claim.", "sort_order": 2, "thumb_image_url": None},
        {"name_ar": "حمض الهيالورونيك", "name_en": "Hyaluronic Acid (sodium hyaluronate)", "dose": "50 mg", "what_it_does_ar": "يحبس الرطوبة داخل بشرتكِ. بشرة ممتلئة ومرنة طول اليوم.", "science_source_short": "Oe et al., 2017, Clin Cosmet Investig Dermatol.", "sort_order": 3, "thumb_image_url": None},
        {"name_ar": "زنك", "name_en": "Zinc (citrate)", "dose": "5 mg", "what_it_does_ar": "يُساعد بشرتكِ على التجدّد بشكل صحي.", "science_source_short": "EFSA.", "sort_order": 4, "thumb_image_url": None},
    ],
    "habba-bareeq": [
        {"name_ar": "فيتامين سي", "name_en": "Vitamin C (L-ascorbic acid)", "dose": "80 mg", "what_it_does_ar": "يُفتّح التصبّغ تحت العين مباشرة ويُحفّز الكولاجين في المنطقة الرقيقة.", "science_source_short": "EFSA approved claim.", "sort_order": 0, "thumb_image_url": None},
        {"name_ar": "حديد", "name_en": "Iron (bisglycinate)", "dose": "14 mg", "what_it_does_ar": "٣٠-٤٠٪ من السعوديات عندهن نقص حديد — وهذا سبب مباشر للهالات. يرفع الأكسجين في الدم فيخف السواد.", "science_source_short": "EFSA: iron contributes to normal oxygen transport.", "sort_order": 1, "thumb_image_url": None},
        {"name_ar": "نياسيناميد", "name_en": "Niacinamide (Vitamin B3)", "dose": "16 mg NE", "what_it_does_ar": "يوقف التصبّغ من مصدره — يمنع الميلانين من الوصول للسطح.", "science_source_short": "Hakozaki et al., 2002, Br J Dermatol.", "sort_order": 2, "thumb_image_url": None},
        {"name_ar": "أستازانتين", "name_en": "Astaxanthin", "dose": "4 mg", "what_it_does_ar": "يُحسّن الدورة الدموية حول العين ويحمي البشرة الرقيقة من التأكسد.", "science_source_short": "Tominaga et al., 2017.", "sort_order": 3, "thumb_image_url": None},
        {"name_ar": "زنك", "name_en": "Zinc (citrate)", "dose": "5 mg", "what_it_does_ar": "يدعم امتصاص الحديد ويُساعد البشرة حول العين تتجدّد أسرع.", "science_source_short": "EFSA.", "sort_order": 4, "thumb_image_url": None},
    ],
    "habba-jathr": [
        {"name_ar": "مستخلص تفاح أنوركا", "name_en": "AnnurTriComplex® (Annurca Apple Extract)", "dose": "800 mg", "what_it_does_ar": "مستخلص تفاح إيطالي نادر. أعاد نمو الشعر في دراسة على ٢٥٠ شخص خلال ٦٠ يوم.", "science_source_short": "Tenore et al., 2018, J Med Food.", "sort_order": 0, "thumb_image_url": None},
        {"name_ar": "بيوتين", "name_en": "Biotin (D-Biotin)", "dose": "10,000 mcg", "what_it_does_ar": "يبني الكيراتين — البروتين اللي يتكوّن منه شعركِ.", "science_source_short": "EFSA: biotin contributes to maintenance of normal hair.", "sort_order": 1, "thumb_image_url": None},
        {"name_ar": "زنك", "name_en": "Zinc (citrate)", "dose": "7.5 mg", "what_it_does_ar": "يُساعد البصيلة تدخل مرحلة النمو بدل ما تبقى في الراحة.", "science_source_short": "EFSA.", "sort_order": 2, "thumb_image_url": None},
        {"name_ar": "فيتامين D3", "name_en": "Vitamin D3 (cholecalciferol)", "dose": "20 mcg (800 IU)", "what_it_does_ar": "يدعم صحة البصيلات. ٨٠٪ من السعوديات عندهن نقص — وهذا مرتبط بالتساقط.", "science_source_short": "Rasheed et al., 2013, J Cosmet Dermatol.", "sort_order": 3, "thumb_image_url": None},
        {"name_ar": "حمض الفوليك", "name_en": "Folic Acid (Vitamin B9)", "dose": "400 mcg", "what_it_does_ar": "يُسرّع نمو الشعر من الأساس.", "science_source_short": "EFSA: folate contributes to normal cell division.", "sort_order": 4, "thumb_image_url": None},
    ],
    "bundle-glow-trio": [
        {"name_ar": "حبّة نضرة", "name_en": "Habba Nadra — Anti-Wrinkle", "dose": "علبة كاملة", "what_it_does_ar": "أستازانتين + كولاجين بحري + فيتامين سي + هيالورونيك. لبشرة أكثر نضارة وتجاعيد أقل.", "science_source_short": "Tominaga 2017, Choi 2014.", "sort_order": 0, "thumb_image_url": "/images/products/habba-nadra/cover.png"},
        {"name_ar": "حبّة بريق", "name_en": "Habba Bareeq — Dark Circles", "dose": "علبة كاملة", "what_it_does_ar": "فيتامين سي + حديد bisglycinate + نياسيناميد. تهاجم الهالات من 3 جهات.", "science_source_short": "Pinnell 2003, Hallberg 1995.", "sort_order": 1, "thumb_image_url": "/images/products/habba-bareeq/cover.png"},
        {"name_ar": "حبّة جذر", "name_en": "Habba Jathr — Hair Growth", "dose": "علبة كاملة", "what_it_does_ar": "مستخلص تفاح أنوركا + بيوتين + فيتامين D3 + زنك. لشعر أكثف من الجذر.", "science_source_short": "Tenore 2018.", "sort_order": 2, "thumb_image_url": "/images/products/habba-jathr/cover.png"},
    ],
}

OFFERS_TEMPLATE = [
    {"code": "T1", "label_ar": "علبة", "quantity": 1, "price_sar": Decimal("199"), "is_recommended": False, "sort_order": 0},
    {"code": "T2", "label_ar": "الزوجي", "quantity": 2, "price_sar": Decimal("279"), "is_recommended": False, "sort_order": 1},
    {"code": "T3", "label_ar": "Glow Kit (الأنصح)", "quantity": 3, "price_sar": Decimal("349"), "is_recommended": True, "sort_order": 2},
]

# Per-product offer overrides (slug -> offers). Falls back to OFFERS_TEMPLATE.
OFFERS_BY_SLUG: dict[str, list[dict]] = {
    "bundle-glow-trio": [
        {"code": "T1", "label_ar": "صندوق شهر", "quantity": 1, "price_sar": Decimal("499"), "is_recommended": False, "sort_order": 0},
        {"code": "T2", "label_ar": "صندوقين (شهرين)", "quantity": 2, "price_sar": Decimal("899"), "is_recommended": False, "sort_order": 1},
        {"code": "T3", "label_ar": "3 صناديق (الأنصح)", "quantity": 3, "price_sar": Decimal("1299"), "is_recommended": True, "sort_order": 2},
    ],
}

REVIEWS: dict[str, list[dict]] = {
    "global": [
        {"author_first_name_ar": "منيرة", "author_city_ar": "الدمام", "rating": 5, "body_ar": "بعد ٦ أسابيع مع نضرة، جارتي سألتني: 'إيش سويتِ لبشرتكِ؟' لا ليزر ولا فيلر — فقط حبّتين كل صباح.", "sort_order": 0},
        {"author_first_name_ar": "نوف", "author_city_ar": "الرياض", "rating": 5, "body_ar": "سنوات وأنا أسمع 'تعبانة؟' بعد شهرين من بريق — أمي قالت لي: 'وجهكِ مشرق اليوم.'", "sort_order": 1},
        {"author_first_name_ar": "رهف", "author_city_ar": "الرياض", "rating": 5, "body_ar": "الشهر الثاني نظرت في صورة من سنة وقلت — هذا شعري فعلًا؟ الكثافة واضحة.", "sort_order": 2},
        {"author_first_name_ar": "هيا", "author_city_ar": "مكة", "rating": 5, "body_ar": "وصلتني بثلاث أيام. الدفع عند الاستلام عجبني. الطعم لذيذ مو زي الفيتامينات الجافة.", "sort_order": 3},
        {"author_first_name_ar": "شذى", "author_city_ar": "الخبر", "rating": 5, "body_ar": "الأستازانتين فعلًا شي ثاني — ما حسّيت كذا مع أي كولاجين بودرة قبل.", "sort_order": 4},
        {"author_first_name_ar": "هيفاء", "author_city_ar": "جدة", "rating": 5, "body_ar": "أوّل مرة أطلع بدون كونسيلر تحت عيني. بريق فرّقت فعلًا.", "sort_order": 5},
    ],
    "habba-nadra": [
        {"author_first_name_ar": "منيرة", "author_city_ar": "الدمام", "rating": 5, "body_ar": "بعد ٦ أسابيع مع نضرة، جارتي سألتني: 'إيش سويتِ لبشرتكِ؟' لا ليزر ولا فيلر.", "sort_order": 0},
        {"author_first_name_ar": "شذى", "author_city_ar": "الخبر", "rating": 5, "body_ar": "كنت أحتاج ثلاث طبقات ميك أب. بعد شهرين — طبقة واحدة تكفي.", "sort_order": 1},
        {"author_first_name_ar": "جواهر", "author_city_ar": "الرياض", "rating": 5, "body_ar": "أوّل مرة منذ سنوات أحبّ صورتي بدون تعديل. الأستازانتين فعلًا شي ثاني.", "sort_order": 2},
    ],
    "habba-bareeq": [
        {"author_first_name_ar": "نوف", "author_city_ar": "الرياض", "rating": 5, "body_ar": "سنوات وأنا أسمع 'تعبانة؟' بعد شهرين من بريق — أمي قالت لي: 'وجهكِ مشرق اليوم.'", "sort_order": 0},
        {"author_first_name_ar": "هيفاء", "author_city_ar": "جدة", "rating": 5, "body_ar": "كنت أحطّ كونسيلر كل يوم حتى في البيت. بعد ٦ أسابيع — أوّل مرة أطلع بدون.", "sort_order": 1},
        {"author_first_name_ar": "دلال", "author_city_ar": "الدمام", "rating": 5, "body_ar": "عملت تحليل حديد وطلع عندي نقص. بريق ما سبّبت أعراض معدة والهالات خفّت.", "sort_order": 2},
    ],
    "habba-jathr": [
        {"author_first_name_ar": "رهف", "author_city_ar": "الرياض", "rating": 5, "body_ar": "الشهر الثاني نظرت في صورة من سنة — الكثافة واضحة. مستخلص التفاح الإيطالي شي ثاني.", "sort_order": 0},
        {"author_first_name_ar": "العنود", "author_city_ar": "الرياض", "rating": 5, "body_ar": "الكاشيرة في صالون الكوافير سألتني: إيش سرّ شعرك؟ ما توقّعت الجواب تفاح إيطالي.", "sort_order": 1},
        {"author_first_name_ar": "ريم", "author_city_ar": "جدة", "rating": 5, "body_ar": "كنت أجمع شعر قبل الاستحمام حتى لا يسدّ الصرف. بعد شهرين — ما عاد عندي سبب.", "sort_order": 2},
    ],
}

FAQS: dict[str, list[dict]] = {
    "global": [
        {"question_ar": "ما هي مكوّنات رحيق؟", "answer_ar": "كل علبة موضّحة فيها مكوّناتها بالتفصيل في صفحتها. نستخدم مكوّنات عالمية بمعايير GMP.", "sort_order": 0},
        {"question_ar": "متى يبان مفعول رحيق؟", "answer_ar": "أوّل تغيّر ملحوظ بعد ٣٠ يومًا، ونوصي بدورة ٩٠ يومًا لأفضل نتائج.", "sort_order": 1},
        {"question_ar": "هل آمن أثناء الحمل أو الرضاعة؟", "answer_ar": "لا نوصي به أثناء الحمل أو الرضاعة. استشيري طبيبكِ.", "sort_order": 2},
        {"question_ar": "هل المنتج حلال؟", "answer_ar": "نعم، نستخدم بيكتين نباتي بدلًا من الجيلاتين الحيواني، وكل التركيبات حلال ١٠٠٪.", "sort_order": 3},
        {"question_ar": "كيف الدفع والشحن؟", "answer_ar": "الدفع عند الاستلام لكل مدن المملكة. الشحن خلال ١–٣ أيام عمل للمدن الرئيسية.", "sort_order": 4},
        {"question_ar": "هل يمكنني إرجاع المنتج؟", "answer_ar": "ضمان رضا ١٤ يومًا على العلبة المغلقة.", "sort_order": 5},
    ],
    "habba-jathr": [
        {"question_ar": "متى يبان الفرق؟", "answer_ar": "أول مؤشر بعد ٣٠ يوم، النتيجة الواضحة بعد ٩٠ يوم.", "sort_order": 0},
        {"question_ar": "هل آمن مع الحمل؟", "answer_ar": "لا يُنصح به أثناء الحمل والرضاعة. استشيري طبيبكِ.", "sort_order": 1},
        {"question_ar": "هل يحتوي جلاتين حيواني؟", "answer_ar": "لا، نستخدم بيكتين نباتي.", "sort_order": 2},
        {"question_ar": "هل أحتاج فحص قبل الاستخدام؟", "answer_ar": "لا، التركيبة آمنة للبالغين الأصحّاء. لو عندكِ حالة طبية استشيري طبيبكِ.", "sort_order": 3},
        {"question_ar": "هل يمكن أخذه مع مكمّل آخر؟", "answer_ar": "نعم، إذا لم يكن يحتوي على نفس المكوّنات بجرعات عالية.", "sort_order": 4},
    ],
    "habba-nadra": [
        {"question_ar": "متى يبان فرق التجاعيد؟", "answer_ar": "ترطيب ومرونة بعد ٢-٤ أسابيع. تقليل التجاعيد بعد ٦-٨ أسابيع. نوصي بـ ٩٠ يومًا.", "sort_order": 0},
        {"question_ar": "إيش الفرق عن الكولاجين العادي؟", "answer_ar": "الأستازانتين يحمي — الكولاجين يبني. نضرة تجمع الاثنين.", "sort_order": 1},
        {"question_ar": "هل تحتوي جيلاتين حيواني؟", "answer_ar": "لا، نستخدم بيكتين نباتي. الكولاجين البحري مصدره سمك حلال.", "sort_order": 2},
        {"question_ar": "هل آمنة مع الحمل؟", "answer_ar": "لا يُنصح بها أثناء الحمل والرضاعة. استشيري طبيبكِ.", "sort_order": 3},
    ],
    "habba-bareeq": [
        {"question_ar": "إيش الفرق عن مكمّلات النوم؟", "answer_ar": "بريق تهاجم الهالات مباشرة (تصبّغ + حديد + ميلانين) — لا تحسّن النوم وتتمنّى.", "sort_order": 0},
        {"question_ar": "هل الحديد يسبّب إمساك؟", "answer_ar": "لا. حديد bisglycinate أعلى امتصاصًا وأقل أعراضًا من الأنواع التقليدية.", "sort_order": 1},
        {"question_ar": "متى يتحسّن اللون؟", "answer_ar": "أفتح قليلًا بعد ٣-٤ أسابيع. فرق واضح بعد ٦٠ يومًا.", "sort_order": 2},
        {"question_ar": "هل آمنة مع الحمل؟", "answer_ar": "لا يُنصح بها — خاصة مع وجود الحديد. استشيري طبيبكِ.", "sort_order": 3},
    ],
    "bundle-glow-trio": [
        {"question_ar": "كم يكفي الصندوق؟", "answer_ar": "الصندوق يكفي شهر كامل من الـ 3 منتجات. حبّتين بالصباح من كل واحدة.", "sort_order": 0},
        {"question_ar": "هل أقدر آخذ الـ 3 مع بعض؟", "answer_ar": "نعم بدون أي مشكلة. كل المكوّنات آمنة مع بعض، وحلال 100%.", "sort_order": 1},
        {"question_ar": "كم أوفّر مقارنة بالشراء الفردي؟", "answer_ar": "كل منتج بـ 199 ريال سعودي = المجموع 597. الصندوق بـ 499 ريال سعودي. توفير 100 + شحن مجاني.", "sort_order": 2},
        {"question_ar": "هل الدفع عند الاستلام؟", "answer_ar": "نعم. تدفعين كاش لمندوب التوصيل لما يوصلكِ الصندوق.", "sort_order": 3},
    ],
}

BUNDLE_REVIEWS = [
    {"author_first_name_ar": "نوف", "author_city_ar": "الرياض", "rating": 5, "body_ar": "أخذت الصندوق الكامل أرخص بكثير من الشراء الفردي. بعد شهرين فرق ملحوظ في وجهي وشعري.", "sort_order": 0},
    {"author_first_name_ar": "دانة", "author_city_ar": "جدة", "rating": 5, "body_ar": "أحلى استثمار سويته لنفسي. الـ 3 منتجات مع بعض = نتيجة شاملة. وفّرت 100 ريال على الصندوق.", "sort_order": 1},
    {"author_first_name_ar": "ريم", "author_city_ar": "الخبر", "rating": 5, "body_ar": "البكج رهيب جدًا. كل شيء يجي مع بعض، طبّقت الروتين بسهولة. شكرًا رحيق.", "sort_order": 2},
]
REVIEWS["bundle-glow-trio"] = BUNDLE_REVIEWS


async def run_seed(session: AsyncSession) -> None:
    """Idempotent seed — safe to run on every boot."""
    await session.execute(text("""
        DO $$
        BEGIN
            CREATE EXTENSION IF NOT EXISTS pgcrypto;
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END
        $$
    """))

    for product_data in PRODUCTS:
        slug = product_data["slug"]
        result = await session.execute(select(Product).where(Product.slug == slug))
        product = result.scalar_one_or_none()

        if product is None:
            product = Product(**{k: v for k, v in product_data.items() if k != "slug"})  # type: ignore[arg-type]
            product.slug = slug
            session.add(product)
            await session.flush()
            logger.info("seed.product_created", slug=slug)

            for ing_data in INGREDIENTS.get(slug, []):
                ingredient = Ingredient(product_id=product.id, **ing_data)  # type: ignore[arg-type]
                session.add(ingredient)

            offers_to_create = OFFERS_BY_SLUG.get(slug, OFFERS_TEMPLATE)
            for offer_data in offers_to_create:
                offer = Offer(product_id=product.id, **offer_data)
                session.add(offer)

            for review_data in REVIEWS.get(slug, []):
                review = Review(product_id=product.id, **review_data)
                session.add(review)

            for faq_data in FAQS.get(slug, []):
                faq = Faq(product_id=product.id, **faq_data)
                session.add(faq)
        else:
            logger.info("seed.product_exists", slug=slug)

    # Global (home) reviews — product_id = None
    from sqlalchemy import and_

    for review_data in REVIEWS.get("global", []):
        result = await session.execute(
            select(Review).where(
                and_(
                    Review.product_id.is_(None),
                    Review.author_first_name_ar == review_data["author_first_name_ar"],
                )
            )
        )
        if result.scalar_one_or_none() is None:
            review = Review(product_id=None, **review_data)
            session.add(review)

    for faq_data in FAQS.get("global", []):
        result = await session.execute(
            select(Faq).where(
                and_(
                    Faq.product_id.is_(None),
                    Faq.question_ar == faq_data["question_ar"],
                )
            )
        )
        if result.scalar_one_or_none() is None:
            faq = Faq(product_id=None, **faq_data)
            session.add(faq)

    await session.commit()
    logger.info("seed.complete")
