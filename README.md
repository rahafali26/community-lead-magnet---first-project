# Content & Business Time Audit

أداة مجانية (Lead Magnet) تساعد صناع المحتوى وأصحاب الأعمال يكتشفون وين يروح وقتهم، وأكبر
فرصة عندهم لتقليل العمل اليدوي — عبر اختبار قصير، بدون أي LLM API (كل الحسابات والـQuick
Win مبنية على قواعد ثابتة في TypeScript).

**التقنيات:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (DB + Auth) ·
Resend (إيميل).

---

## 1. المتطلبات

- Node.js 20+ و npm
- حساب [Supabase](https://supabase.com) (مجاني)
- حساب [Resend](https://resend.com) (مجاني حتى 3000 إيميل/شهر)
- حساب [Vercel](https://vercel.com) للنشر (مجاني)

---

## 2. تشغيل المشروع محليًا

```bash
npm install
cp .env.local.example .env.local   # ثم عبّي القيم كما بالقسم 3 و4
npm run dev
```

افتحي [http://localhost:3000](http://localhost:3000). بدون تعبئة `.env.local` بيشتغل كل شيء
عدا: حفظ نتيجة الاختبار، صفحة النتيجة، إرسال الإيميل، ولوحة الإدارة.

---

## 3. إعداد Supabase

### أ. إنشاء المشروع

1. افتحي [supabase.com/dashboard](https://supabase.com/dashboard) → **New Project**.
2. اختاري اسم ومنطقة قريبة (مثل Frankfurt أو أي منطقة قريبة من جمهورك) وكلمة مرور لقاعدة
   البيانات (احتفظي بها في مكان آمن — تختلف عن مفاتيح API).
3. انتظري دقيقة إلى دقيقتين لحين تجهيز المشروع.

### ب. تشغيل الـ Schema

1. من القائمة الجانبية: **SQL Editor** → **New query**.
2. افتحي ملف [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql) من
   هذا المشروع، انسخي محتواه كامل، الصقيه في المحرر، ثم اضغطي **Run**.
3. تأكدي من نجاح التنفيذ بدون أخطاء. هذا ينشئ جدولين (`submissions`, `events`) مع تفعيل
   Row Level Security (RLS) بحيث لا أحد يقدر يقرأ البيانات إلا عبر مفتاح `service_role`
   (السيرفر فقط).

> لو احتجتِ تعديل الأسئلة أو إضافة أعمدة مستقبلًا، أضيفي ملف migration جديد في نفس المجلد
> (مثلًا `0002_xxx.sql`) بدل تعديل الملف الأصلي.

### ج. الحصول على المفاتيح

من **Project Settings → API**:

| المتغير | من أين |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key — **سري، لا تشاركيه ولا تحطيه في الفرونت اند** |

حطي القيم الثلاث في `.env.local`.

### د. إنشاء حساب الإدارة (Admin)

لوحة `/admin` تحتاج تسجيل دخول عبر Supabase Auth (بدون صفحة تسجيل عامة):

1. من القائمة الجانبية: **Authentication → Users → Add user**.
2. أدخلي بريدك وكلمة مرور قوية، واختاري **Auto Confirm User** حتى تقدرين تدخلين مباشرة
   بدون تأكيد إيميل.
3. سجّلي دخول من `/admin/login` بنفس البيانات.

---

## 4. إعداد Resend (إرسال إيميل النتيجة)

1. أنشئي حساب على [resend.com](https://resend.com) واحصلي على **API Key** من
   `resend.com/api-keys`.
2. للتجربة السريعة بدون دومين خاص: استخدمي `RESEND_FROM_EMAIL=onboarding@resend.dev`
   (يرسل فقط لإيميلات محدودة أثناء وضع التجربة — كافي للاختبار).
3. للإنتاج الفعلي: أضيفي ووثّقي دومينك الخاص من **Domains** في Resend، ثم استخدمي عنوان
   مرسل من نفس الدومين (مثل `results@yourdomain.com`).
4. حطي `RESEND_API_KEY` و `RESEND_FROM_EMAIL` في `.env.local`.

> لو تركتِ هذي المتغيرات فاضية، الموقع يشتغل عادي وتظهر النتيجة على الشاشة، لكن ما يُرسل
> أي إيميل (يُسجَّل تحذير في الـ logs فقط) — مفيد للتجربة المحلية بدون حساب Resend.

---

## 5. متغيرات البيئة (ملخص)

انسخي `.env.local.example` إلى `.env.local` وعبّي:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

`.env.local` مستثنى من Git تلقائيًا (موجود في `.gitignore`) — لا تلتزمي (commit) هذا الملف
أبدًا.

---

## 6. النشر على Vercel

1. ارفعي المشروع على GitHub.
2. من [vercel.com/new](https://vercel.com/new) استوردي المستودع.
3. أثناء الإعداد، أضيفي نفس المتغيرات الخمسة من القسم 5 في **Environment Variables**.
4. اضغطي **Deploy**. Vercel يتكفل بالباقي (Next.js مدعوم افتراضيًا).
5. بعد النشر، تأكدي إن Supabase Auth (إن استخدمتِ روابط تأكيد) يعرف رابط الدومين الجديد من
   **Authentication → URL Configuration** إن احتجتِ ذلك مستقبلًا.

---

## 7. بنية المشروع

```
app/
  page.tsx                     → Landing Page
  audit/page.tsx                → محرك الاختبار (كل الخطوات)
  result/[id]/page.tsx          → صفحة النتيجة
  admin/                        → لوحة الإدارة (login + dashboard)
  api/submit-audit/             → حفظ الإجابات + الحساب + إرسال الإيميل
  api/send-result-email/        → زر "أرسل لي نسخة"
  api/admin/stats + export/     → بيانات لوحة الإدارة + تصدير CSV

lib/
  types.ts                      → أنواع الأسئلة والنتائج
  scoring/                      → معادلة Automation Opportunity Score
  quickwin/rules.ts             → محرك الـQuick Win (Rule-Based)
  validation/auditSchema.ts     → تحقق Zod من كل إجابة
  supabase/client.ts + server.ts → عملاء Supabase (anon / service role)
  admin/stats.ts                → تجميع إحصائيات لوحة الإدارة

components/
  audit/    → مكونات خطوات الاختبار
  result/   → عرض النتيجة
  admin/    → لوحة الإدارة
  ui/       → مكونات عامة (Button, Card, TextField...)

supabase/migrations/0001_init.sql → Schema + RLS
proxy.ts                         → حماية مسارات /admin و /api/admin (بديل middleware.ts في Next 16)
```

---

## 8. ملاحظات أمنية

- `SUPABASE_SERVICE_ROLE_KEY` تُستخدم فقط داخل `lib/supabase/server.ts` من كود يعمل على
  السيرفر (API Routes / Server Components) — لا تستوردي هذا الملف أبدًا من أي مكون بـ
  `"use client"`.
- المستخدم العادي (زائر الاختبار) لا يحتاج تسجيل دخول؛ مفتاح `anon` مسموح له فقط بعملية
  إدخال (INSERT) بحكم RLS، بدون أي قراءة.
- لوحة الإدارة محمية عبر `proxy.ts` (يتحقق من جلسة Supabase Auth) على مستوى كل من الصفحات
  والـ API Routes تحت `/admin` و `/api/admin`.
