import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const PAIN_POINTS = [
  {
    title: "ما تعرفين وين يروح وقتك بالضبط",
    desc: "تحسين الأسبوع طار وما تعرفين وين راح — بين المحتوى والرد والتخطيط والتنفيذ.",
  },
  {
    title: "مهام متكررة تسرق وقتك بصمت",
    desc: "نفس المهمة كل أسبوع، بنفس الطريقة اليدوية، بدون ما تلاحظين حجم الوقت المتراكم منها.",
  },
  {
    title: "ما عارفة تبدين بالأتمتة من وين",
    desc: "تسمعين عن أدوات AI كثير، بس ما عندك صورة واضحة وش يستاهل الأتمتة عندك تحديدًا.",
  },
];

const WHAT_YOU_GET = [
  {
    title: "خريطة وقتك الشهرية",
    desc: "كم ساعة تروح على المحتوى، وكم على البزنس (إذا عندك)، بالأرقام.",
  },
  {
    title: "أعلى 3 مهام تستهلك وقتك",
    desc: "مرتبة حسب الوقت الفعلي اللي تاخذه منك كل شهر.",
  },
  {
    title: "أكبر فرصة لتقليل العمل اليدوي",
    desc: "مبنية على إجاباتك أنتِ، مو نصيحة عامة تنطبق على الكل.",
  },
  {
    title: "Quick Win جاهز + Prompt للنسخ",
    desc: "خطوة عملية تقدرين تبدين فيها اليوم، مو بعد أسبوعين.",
  },
];

export default function Home() {
  return (
    <div className="hero-gradient min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:py-8">
        <span className="text-lg font-extrabold text-ink">تحليل الوقت</span>
        <Link href="/audit">
          <Button className="text-sm px-5 py-2.5">ابدأ التحليل</Button>
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-20">
        {/* Hero */}
        <section className="pt-6 sm:pt-12 text-center flex flex-col items-center gap-6">
          <span className="inline-block rounded-full bg-white/70 px-4 py-1.5 text-xs font-bold text-ink-soft">
            أداة مجانية لصناع المحتوى وأصحاب الأعمال
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight text-ink">
            كم من وقتك يضيع بين المحتوى والبزنس؟
          </h1>
          <p className="max-w-xl text-base sm:text-lg text-ink-soft leading-relaxed">
            جاوبي على أسئلة بسيطة عن طريقة شغلك، واعرفي وين يروح وقتك، وأكبر فرصة عندك
            لتقليل العمل اليدوي — بدون تخمين، بأرقامك أنتِ.
          </p>
          <Link href="/audit">
            <Button className="text-base px-8 py-4">ابدأ التحليل</Button>
          </Link>
          <p className="text-xs text-ink-soft">يستغرق تقريبًا 3–5 دقائق، ومجاني بالكامل.</p>
        </section>

        {/* Pain points */}
        <section className="mt-20 sm:mt-28">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-ink mb-10">
            صادفتك وحدة من هذي؟
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {PAIN_POINTS.map((p) => (
              <Card key={p.title} className="p-6">
                <h3 className="font-bold text-ink mb-2">{p.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{p.desc}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/audit">
              <Button variant="secondary">أبي أعرف وين يروح وقتي</Button>
            </Link>
          </div>
        </section>

        {/* What you get */}
        <section className="mt-20 sm:mt-28">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-ink mb-3">
            وش بتاخذين من التحليل؟
          </h2>
          <p className="text-center text-ink-soft mb-10">
            نتيجة مباشرة على الشاشة + نسخة توصلك على إيميلك.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {WHAT_YOU_GET.map((item, i) => (
              <Card key={item.title} className="p-6 flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white font-bold">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-ink mb-1">{item.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust / privacy */}
        <section className="mt-20 sm:mt-28">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-extrabold text-ink mb-3">بياناتك آمنة معنا</h2>
            <p className="text-ink-soft leading-relaxed max-w-lg mx-auto">
              ما نطلب كلمات مرور ولا صلاحيات حسابات ولا أي معلومات حساسة. فقط اسمك
              وإيميلك عشان نوصّل لك نتيجتك، وبموافقتك الكاملة.
            </p>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="mt-20 sm:mt-28 text-center flex flex-col items-center gap-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
            جاهزة تشوفين وين يروح وقتك؟
          </h2>
          <Link href="/audit">
            <Button className="text-base px-8 py-4">ابدأ التحليل الآن</Button>
          </Link>
        </section>
      </main>

      <footer className="mx-auto max-w-3xl px-4 py-8 text-center text-xs text-ink-soft">
        النتائج تقديرية ومبنية على إجاباتك، وليست قياسًا دقيقًا لوقتك الفعلي.
      </footer>
    </div>
  );
}
