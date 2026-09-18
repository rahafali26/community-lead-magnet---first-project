import { Resend } from "resend";
import type { AuditResults, UserType } from "@/lib/types";

/**
 * طبقة إرسال بريد منفصلة عن باقي المنطق: تغيير مزوّد البريد مستقبلًا (مثلًا لمزود آخر)
 * يعني تعديل هذا الملف فقط، بدون أي تأثير على بقية الكود.
 */

function formatHours(h: number): string {
  return h.toFixed(1).replace(/\.0$/, "");
}

function buildEmailHtml(name: string, userType: UserType, results: AuditResults): string {
  const topTasksHtml = results.topTasks
    .map((t) => `<li>${t.label} — تقريبًا ${formatHours(t.hours)} ساعة شهريًا</li>`)
    .join("");

  const businessLine =
    userType === "creator_business"
      ? `<p>ساعات البزنس: <strong>${formatHours(results.businessHoursTotal)}</strong> ساعة شهريًا</p>`
      : "";

  return `
    <div dir="rtl" style="font-family: Tajawal, Arial, sans-serif; color:#241f2e; max-width:560px; margin:0 auto;">
      <h2>أهلًا ${name} 👋</h2>
      <p>هذي نسخة من نتيجة تحليل وقتك في صناعة المحتوى${userType === "creator_business" ? " والبزنس" : ""}:</p>

      <p>إجمالي ساعات المحتوى: <strong>${formatHours(results.contentHoursTotal)}</strong> ساعة شهريًا</p>
      ${businessLine}
      <p>إجمالي وقتك: <strong>${formatHours(results.totalHours)}</strong> ساعة شهريًا</p>

      <h3>أكثر 3 مهام تستهلك وقتك</h3>
      <ul>${topTasksHtml}</ul>

      <h3>Quick Win المقترح لك: ${results.quickWin.title}</h3>
      <p>${results.quickWin.description}</p>
      <div style="background:#f4e9e3; border-radius:12px; padding:16px; white-space:pre-wrap;">${results.quickWin.promptTemplate}</div>

      <p style="margin-top:24px; font-size:12px; color:#6b6470;">
        هذي أرقام تقديرية مبنية على إجاباتك، وليست قياسًا دقيقًا لوقتك الفعلي.
      </p>
    </div>
  `;
}

export async function sendResultEmail(params: {
  to: string;
  name: string;
  userType: UserType;
  results: AuditResults;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromAddress) {
    console.warn("RESEND_API_KEY أو RESEND_FROM_EMAIL غير مضبوطة — تم تخطي إرسال الإيميل.");
    return { skipped: true };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: params.to,
    subject: "نتيجة تحليل وقتك في صناعة المحتوى",
    html: buildEmailHtml(params.name, params.userType, params.results),
  });

  if (error) {
    console.error("فشل إرسال إيميل النتيجة:", error);
    return { skipped: false, error };
  }

  return { skipped: false };
}
