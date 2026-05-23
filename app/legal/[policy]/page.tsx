import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const POLICIES: Record<string, { title: string; content: string }> = {
  shipping: {
    title: 'سياسة الشحن والتوصيل',
    content: `نشحن إلى جميع مناطق المملكة العربية السعودية.

مدة التوصيل: 1–3 أيام عمل للمدن الرئيسية (الرياض، جدة، الدمام)، و3–5 أيام للمناطق الأخرى.

رسوم الشحن: مجانية على جميع الطلبات.

طريقة الدفع: الدفع عند الاستلام (كاش) فقط.

سيتصل بكِ فريقنا خلال 24 ساعة من تأكيد الطلب للتحقق من العنوان وتحديد موعد التسليم.

للاستفسارات: تواصلي معنا عبر واتساب أو البريد الإلكتروني.`,
  },
  returns: {
    title: 'سياسة الإرجاع والاستبدال',
    content: `نضمن رضاكِ الكامل.

شروط الإرجاع:
• العلبة سليمة ومغلقة (لم تُفتح)
• خلال 14 يومًا من تاريخ الاستلام
• الطلب مقدّم عبر قناة الاتصال الرسمية

حالات الإرجاع المقبولة:
• منتج تالف أو مكسور عند الاستلام
• منتج مختلف عن الطلب الأصلي
• منتج منتهي الصلاحية

لا يُقبل الإرجاع في:
• العلب المفتوحة أو المستخدمة
• الطلبات بعد 14 يومًا من الاستلام

للإرجاع: تواصلي معنا عبر واتساب بصورة المنتج وإثبات الشراء.`,
  },
  privacy: {
    title: 'سياسة الخصوصية',
    content: `نحترم خصوصيتكِ.

البيانات التي نجمعها:
• الاسم ورقم الجوال: لتأكيد الطلب والتوصيل فقط
• بيانات التصفح (كوكيز): لتحسين تجربتكِ وتحسين إعلاناتنا

كيف نستخدم البيانات:
• تأكيد الطلب والتواصل لموعد التسليم
• تحسين تجربة الموقع وخدماتنا
• إرسال إشعارات بعروض جديدة (بموافقتكِ فقط)

لا نبيع بياناتكِ لأطراف ثالثة.

نستخدم تقنيات التتبع الإعلاني (Meta Pixel, TikTok Pixel, Snap Pixel) لقياس أداء إعلاناتنا.

للاستفسار عن بياناتكِ أو طلب حذفها: تواصلي معنا عبر البريد الإلكتروني.`,
  },
  terms: {
    title: 'الشروط والأحكام',
    content: `باستخدامكِ لموقع رحيق توافقين على هذه الشروط.

1. المنتجات
منتجاتنا مكمّلات غذائية وليست أدوية. لا تُغني عن الاستشارة الطبية.

2. الطلبات
يُعدّ الطلب مؤكّدًا بعد الاتصال الهاتفي للتأكيد. نحتفظ بحق رفض أي طلب يبدو غير حقيقي.

3. الأسعار
أسعار المنتجات بالريال السعودي وتشمل ضريبة القيمة المضافة.

4. التوصيل
التوصيل داخل المملكة العربية السعودية فقط.

5. المسؤولية
لا نتحمّل المسؤولية عن أي ضرر ناجم عن الاستخدام غير السليم للمنتجات.

6. التعديلات
نحتفظ بحق تعديل هذه الشروط في أي وقت.`,
  },
};

interface Props {
  params: Promise<{ policy: string }>;
}

export async function generateStaticParams() {
  return Object.keys(POLICIES).map((policy) => ({ policy }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { policy } = await params;
  const doc = POLICIES[policy];
  if (!doc) return {};
  return { title: `${doc.title} · رحيق` };
}

export default async function LegalPage({ params }: Props) {
  const { policy } = await params;
  const doc = POLICIES[policy];
  if (!doc) notFound();

  return (
    <section className="py-16 bg-ivory">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="font-tajawal font-bold text-3xl text-emerald mb-8">{doc.title}</h1>
        <div className="font-tajawal text-base text-charcoal/80 leading-relaxed whitespace-pre-line space-y-4">
          {doc.content}
        </div>
      </div>
    </section>
  );
}
