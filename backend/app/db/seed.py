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
        "slug": "habba-jathr",
        "name_ar": "حبّة جذر",
        "working_name": "Hair Gummy",
        "hero_tag_ar": "لشعر يحبّكِ كما تحبّينه",
        "short_description_ar": "حلوى الشعر بالبيوتين، الساو بالميتو، والكولاجين البحري — تركيبة محسوبة لكثافة من الجذر، قوّة الشعرة، وأظافر مرافقة أقوى.",
        "long_description_ar": "يبدأ شعركِ من بصيلة لا تراها العين — نغذّيها ببيوتين، ونوازن دورتها مع ساو بالميتو، نقوّي الشعرة ببتيدات كولاجين بحري، ونغلق الدائرة بالزنك. ليس وصفة طبية — تركيبة وظيفية لاستخدامٍ يومي بدون أقراص.",
        "rating_value": Decimal("4.9"),
        "review_count": 412,
        "stock_label_ar": "بقي 32 علبة من دفعة هذا الأسبوع.",
        "cover_image_url": "/images/products/habba-jathr/cover.jpg",
        "gallery_image_urls": [
            "/images/products/habba-jathr/cover.jpg",
            "/images/products/habba-jathr/lifestyle.jpg",
            "/images/products/habba-jathr/ingredients.jpg",
            "/images/products/habba-jathr/back.jpg",
        ],
        "sort_order": 0,
        "seo_title_ar": "حبّة جذر — حلوى الشعر بالبيوتين والساو بالميتو والكولاجين البحري · رحيق",
        "seo_description_ar": "كثافة من الجذر، قوّة الشعرة، أظافر أقوى — بمكوّناتٍ عالمية وفحص COA لكل دفعة. الدفع عند الاستلام.",
    },
    {
        "slug": "habba-layali",
        "name_ar": "حبّة ليالي",
        "working_name": "Sleep Gummy",
        "hero_tag_ar": "نوم يستحقّ ليلتكِ",
        "short_description_ar": "حلوى النوم والاسترخاء — جرعة ميلاتونين منخفضة وذكيّة، مدعومة بأشواغاندا KSM-66® المرخّصة و L-ثيانين، لنومٍ أعمق وصباحٍ خفيف.",
        "long_description_ar": "ليالي صُمّمت لتقصّر الزمن بينك وبين النوم — جرعة ميلاتونين منخفضة (لا تسبّب اعتمادًا) تخبر دماغكِ إنّ الليل بدأ، أشواغاندا تخفّض الكورتيزول، L-ثيانين يهدّئ موجات الدماغ، وبابونج لطيف يغلق الطقس. تُستخدم قبل النوم بـ ٣٠ دقيقة.",
        "rating_value": Decimal("4.9"),
        "review_count": 278,
        "stock_label_ar": "بقي 19 علبة من دفعة هذا الأسبوع.",
        "cover_image_url": "/images/products/habba-layali/cover.jpg",
        "gallery_image_urls": [
            "/images/products/habba-layali/cover.jpg",
            "/images/products/habba-layali/lifestyle.jpg",
            "/images/products/habba-layali/ingredients.jpg",
            "/images/products/habba-layali/back.jpg",
        ],
        "sort_order": 1,
        "seo_title_ar": "حبّة ليالي — حلوى النوم بالميلاتونين والأشواغاندا · رحيق",
        "seo_description_ar": "نوم أعمق وصباح خفيف — جرعة ميلاتونين ذكية + أشواغاندا KSM-66®. الدفع عند الاستلام.",
    },
    {
        "slug": "habba-noura",
        "name_ar": "حبّة نورة",
        "working_name": "Beauty Gummy",
        "hero_tag_ar": "إشراقة من جوّا",
        "short_description_ar": "حلوى الجمال بالكولاجين البحري وفيتامين سي وحمض الهيالورونيك — لبشرةٍ مشرقة، مرونةٍ، وأظافر أقوى.",
        "long_description_ar": "ببتيدات كولاجين بحري صغيرة الجزيئات تُمتص بكفاءة، مدعومة بفيتامين سي ليساعد جسمكِ على تصنيع الكولاجين الخاص بكِ، حمض هيالورونيك لاحتجاز الترطيب، وزنك للأظافر والشعر المرافق. حبّتان في اليوم — وانتهيتي.",
        "rating_value": Decimal("4.9"),
        "review_count": 364,
        "stock_label_ar": "بقي 27 علبة من دفعة هذا الأسبوع.",
        "cover_image_url": "/images/products/habba-noura/cover.jpg",
        "gallery_image_urls": [
            "/images/products/habba-noura/cover.jpg",
            "/images/products/habba-noura/lifestyle.jpg",
            "/images/products/habba-noura/ingredients.jpg",
            "/images/products/habba-noura/back.jpg",
        ],
        "sort_order": 2,
        "seo_title_ar": "حبّة نورة — حلوى الجمال بالكولاجين البحري وفيتامين سي · رحيق",
        "seo_description_ar": "إشراقة، مرونة، أظافر أقوى — كولاجين ببتيدات صغيرة + فيتامين سي. الدفع عند الاستلام.",
    },
]

INGREDIENTS: dict[str, list[dict]] = {
    "habba-jathr": [
        {
            "name_ar": "بيوتين",
            "name_en": "Biotin (D-Biotin)",
            "dose": "5000 mcg",
            "what_it_does_ar": "يدعم تصنيع الكيراتين — البروتين الأساسي للشعر والأظافر.",
            "science_source_short": "EFSA: biotin contributes to maintenance of normal hair.",
            "sort_order": 0,
            "thumb_image_url": "/images/products/habba-jathr/ing-biotin.jpg",
        },
        {
            "name_ar": "ساو بالميتو",
            "name_en": "Saw Palmetto extract (45% fatty acids)",
            "dose": "200 mg",
            "what_it_does_ar": "يدعم توازن DHT المرتبط بتساقط الشعر.",
            "science_source_short": "Prager et al., 2002, J Altern Complement Med — improvement in hair loss pattern.",
            "sort_order": 1,
            "thumb_image_url": "/images/products/habba-jathr/ing-saw-palmetto.jpg",
        },
        {
            "name_ar": "كولاجين بحري",
            "name_en": "Marine Collagen peptides (Type I)",
            "dose": "1000 mg",
            "what_it_does_ar": "يوفّر أحماض أمينية لبنية الشعرة (برولين، جلايسين).",
            "science_source_short": "de Miranda et al., 2021, Int J Dermatology — collagen peptides meta-analysis.",
            "sort_order": 2,
            "thumb_image_url": "/images/products/habba-jathr/ing-collagen.jpg",
        },
        {
            "name_ar": "زنك",
            "name_en": "Zinc (citrate)",
            "dose": "7.5 mg",
            "what_it_does_ar": "يساهم في دورة نمو الشعر الطبيعية.",
            "science_source_short": "EFSA: zinc contributes to maintenance of normal hair.",
            "sort_order": 3,
            "thumb_image_url": "/images/products/habba-jathr/ing-zinc.jpg",
        },
        {
            "name_ar": "فيتامين B5",
            "name_en": "Pantothenic acid",
            "dose": "5 mg",
            "what_it_does_ar": "يدعم استقلاب طاقة البصيلة.",
            "science_source_short": "EFSA permitted health claim.",
            "sort_order": 4,
            "thumb_image_url": "/images/products/habba-jathr/ing-b5.jpg",
        },
    ],
    "habba-layali": [
        {
            "name_ar": "ميلاتونين",
            "name_en": "Melatonin",
            "dose": "1 mg",
            "what_it_does_ar": "هرمون يومي طبيعي — يبلّغ الدماغ ببداية الليل. الجرعة المنخفضة فعّالة وآمنة.",
            "science_source_short": "EFSA approved claim: melatonin 1 mg reduces time to fall asleep.",
            "sort_order": 0,
            "thumb_image_url": "/images/products/habba-layali/ing-melatonin.jpg",
        },
        {
            "name_ar": "أشواغاندا KSM-66®",
            "name_en": "Ashwagandha KSM-66® root extract (5% withanolides)",
            "dose": "300 mg",
            "what_it_does_ar": "تخفّض الكورتيزول وتحسّن جودة النوم.",
            "science_source_short": "Chandrasekhar et al., 2012, Indian J Psychol Med — RCT 60 adults.",
            "sort_order": 1,
            "thumb_image_url": "/images/products/habba-layali/ing-ashwagandha.jpg",
        },
        {
            "name_ar": "L-ثيانين",
            "name_en": "L-Theanine",
            "dose": "200 mg",
            "what_it_does_ar": "يعزّز موجات ألفا للدماغ ويهدّئ بدون نعاس.",
            "science_source_short": "Williams et al., 2020, Plant Foods Hum Nutr.",
            "sort_order": 2,
            "thumb_image_url": "/images/products/habba-layali/ing-theanine.jpg",
        },
        {
            "name_ar": "ماغنيسيوم",
            "name_en": "Magnesium bisglycinate",
            "dose": "75 mg",
            "what_it_does_ar": "يسترخي العضلات ويدعم نومًا أعمق.",
            "science_source_short": "EFSA: magnesium contributes to normal function of the nervous system.",
            "sort_order": 3,
            "thumb_image_url": "/images/products/habba-layali/ing-magnesium.jpg",
        },
        {
            "name_ar": "بابونج",
            "name_en": "Chamomile extract",
            "dose": "50 mg",
            "what_it_does_ar": "تركيبة تقليدية للاسترخاء.",
            "science_source_short": "Hieu et al., 2019, Phytother Res — meta-analysis.",
            "sort_order": 4,
            "thumb_image_url": "/images/products/habba-layali/ing-chamomile.jpg",
        },
    ],
    "habba-noura": [
        {
            "name_ar": "كولاجين بحري",
            "name_en": "Marine Collagen peptides (Type I, hydrolyzed, ≤5 kDa)",
            "dose": "2500 mg",
            "what_it_does_ar": "ببتيدات صغيرة لامتصاص أفضل.",
            "science_source_short": "Choi et al., 2014, J Med Food — RCT skin elasticity.",
            "sort_order": 0,
            "thumb_image_url": "/images/products/habba-noura/ing-collagen.jpg",
        },
        {
            "name_ar": "فيتامين سي",
            "name_en": "Vitamin C (L-ascorbic acid)",
            "dose": "80 mg",
            "what_it_does_ar": "كوفاكتور أساسي لتصنيع الكولاجين.",
            "science_source_short": "EFSA approved claim.",
            "sort_order": 1,
            "thumb_image_url": "/images/products/habba-noura/ing-vitamin-c.jpg",
        },
        {
            "name_ar": "حمض الهيالورونيك",
            "name_en": "Hyaluronic Acid (sodium hyaluronate)",
            "dose": "50 mg",
            "what_it_does_ar": "يدعم احتجاز الترطيب في الأدمة.",
            "science_source_short": "Oe et al., 2017, Clin Cosmet Investig Dermatol.",
            "sort_order": 2,
            "thumb_image_url": "/images/products/habba-noura/ing-ha.jpg",
        },
        {
            "name_ar": "زنك",
            "name_en": "Zinc",
            "dose": "5 mg",
            "what_it_does_ar": "يساهم في الحفاظ على بشرة وأظافر طبيعية.",
            "science_source_short": "EFSA.",
            "sort_order": 3,
            "thumb_image_url": "/images/products/habba-noura/ing-zinc.jpg",
        },
        {
            "name_ar": "بيوتين",
            "name_en": "Biotin",
            "dose": "1000 mcg",
            "what_it_does_ar": "يدعم بنية الكيراتين.",
            "science_source_short": "EFSA.",
            "sort_order": 4,
            "thumb_image_url": "/images/products/habba-noura/ing-biotin.jpg",
        },
    ],
}

OFFERS_TEMPLATE = [
    {"code": "T1", "label_ar": "علبة", "quantity": 1, "price_sar": Decimal("199"), "is_recommended": False, "sort_order": 0},
    {"code": "T2", "label_ar": "الزوجي", "quantity": 2, "price_sar": Decimal("279"), "is_recommended": False, "sort_order": 1},
    {"code": "T3", "label_ar": "Glow Kit (الأنصح)", "quantity": 3, "price_sar": Decimal("349"), "is_recommended": True, "sort_order": 2},
]

REVIEWS: dict[str, list[dict]] = {
    "global": [
        {"author_first_name_ar": "رهف", "author_city_ar": "الرياض", "rating": 5, "body_ar": "بصراحة كنت متردّدة، بس بعد شهر من حبّة جذر شعري وقف يطيح بنفس الكميّة. التغليف يجنّن.", "sort_order": 0},
        {"author_first_name_ar": "سلوى", "author_city_ar": "جدة", "rating": 5, "body_ar": "ليالي غيّرت نومي. أصحى مرتاحة بدون دوخة. صار جزء من روتيني قبل النوم.", "sort_order": 1},
        {"author_first_name_ar": "منيرة", "author_city_ar": "الدمام", "rating": 5, "body_ar": "حبّة نورة بشرتي شربت كولاجين. الإشراقة في الصور بنفسها.", "sort_order": 2},
        {"author_first_name_ar": "هيا", "author_city_ar": "مكة", "rating": 5, "body_ar": "وصلتني بثلاث أيام. الدفع عند الاستلام عجبني. الطعم لذيذ مو زي الفيتامينات الجافة.", "sort_order": 3},
        {"author_first_name_ar": "العنود", "author_city_ar": "الرياض", "rating": 5, "body_ar": "اشتريت ٣ علب جذر بـ ٣٤٩، صراحة قيمة ممتازة. شعري بدأ يطلع جوّاني وحتى الحاجبين.", "sort_order": 4},
        {"author_first_name_ar": "شذى", "author_city_ar": "الخبر", "rating": 5, "body_ar": "خدمة العملاء ردّت علي في نفس اليوم وأكدت لي طلبي. حسّيت إن البراند سعودي فعلًا.", "sort_order": 5},
    ],
    "habba-jathr": [
        {"author_first_name_ar": "رهف", "author_city_ar": "الرياض", "rating": 5, "body_ar": "بصراحة كنت متردّدة، بس بعد شهر من حبّة جذر شعري وقف يطيح بنفس الكميّة. التغليف يجنّن.", "sort_order": 0},
        {"author_first_name_ar": "العنود", "author_city_ar": "الرياض", "rating": 5, "body_ar": "اشتريت ٣ علب جذر بـ ٣٤٩، صراحة قيمة ممتازة. شعري بدأ يطلع جوّاني وحتى الحاجبين.", "sort_order": 1},
        {"author_first_name_ar": "ريم", "author_city_ar": "جدة", "rating": 5, "body_ar": "بعد شهرين شعري طلع له طول جدّي، والكثافة بانت في الصورة الأخيرة.", "sort_order": 2},
    ],
    "habba-layali": [
        {"author_first_name_ar": "سلوى", "author_city_ar": "جدة", "rating": 5, "body_ar": "ليالي غيّرت نومي. أصحى مرتاحة بدون دوخة. صار جزء من روتيني قبل النوم.", "sort_order": 0},
        {"author_first_name_ar": "لمى", "author_city_ar": "الرياض", "rating": 5, "body_ar": "أوّل ليلة فرّقت. حسّيت بهدوء غريب — نمت بدون لفّ.", "sort_order": 1},
        {"author_first_name_ar": "شهد", "author_city_ar": "جدة", "rating": 5, "body_ar": "جربت كل شي قبل، بس هذي وحدها اللي ما خلّتني تعبانة الصباح.", "sort_order": 2},
    ],
    "habba-noura": [
        {"author_first_name_ar": "منيرة", "author_city_ar": "الدمام", "rating": 5, "body_ar": "حبّة نورة بشرتي شربت كولاجين. الإشراقة في الصور بنفسها.", "sort_order": 0},
        {"author_first_name_ar": "شذى", "author_city_ar": "الخبر", "rating": 5, "body_ar": "خدمة العملاء ردّت علي في نفس اليوم وأكدت لي طلبي. حسّيت إن البراند سعودي فعلًا.", "sort_order": 1},
        {"author_first_name_ar": "جواهر", "author_city_ar": "الرياض", "rating": 5, "body_ar": "بشرتي وجهت تعطيني بريق طبيعي، ومن غير ميك أب صرت أحبّ صوري.", "sort_order": 2},
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
    "habba-layali": [
        {"question_ar": "هل تسبّب الإدمان؟", "answer_ar": "لا، التركيبة لا تسبّب اعتمادًا. الميلاتونين هرمون نومٍ طبيعي بجرعة منخفضة.", "sort_order": 0},
        {"question_ar": "متى يبدأ مفعولها؟", "answer_ar": "خلال ٢٠–٤٠ دقيقة من تناولها.", "sort_order": 1},
        {"question_ar": "هل تسبّب دوخة في الصباح؟", "answer_ar": "بالجرعة الموصى بها، لا.", "sort_order": 2},
        {"question_ar": "هل أستطيع قيادة السيارة بعدها؟", "answer_ar": "لا، تُؤخذ قبل النوم فقط.", "sort_order": 3},
        {"question_ar": "هل آمنة مع الحمل؟", "answer_ar": "لا يُنصح بها أثناء الحمل والرضاعة.", "sort_order": 4},
    ],
    "habba-noura": [
        {"question_ar": "متى يبان فرق البشرة؟", "answer_ar": "أول مؤشر بعد ٣٠ يوم، النتيجة الواضحة بعد ٩٠ يوم.", "sort_order": 0},
        {"question_ar": "هل آمنة مع الحمل؟", "answer_ar": "لا يُنصح بها أثناء الحمل والرضاعة. استشيري طبيبكِ.", "sort_order": 1},
        {"question_ar": "هل تحتوي جيلاتين حيواني؟", "answer_ar": "لا، نستخدم بيكتين نباتي.", "sort_order": 2},
        {"question_ar": "هل أحتاج فحص قبل الاستخدام؟", "answer_ar": "لا، التركيبة آمنة للبالغين الأصحّاء. لو عندكِ حالة طبية استشيري طبيبكِ.", "sort_order": 3},
        {"question_ar": "هل تحتوي على مشتقات بحرية؟", "answer_ar": "نعم، تحتوي على كولاجين بحري. يُتجنّب لمن لديهم حساسية من السمك.", "sort_order": 4},
    ],
}


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

            for offer_data in OFFERS_TEMPLATE:
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
