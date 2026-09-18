"use client";

import { useState } from "react";
import { StepShell } from "./StepShell";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import type { LeadFormData } from "@/lib/types";

const PLATFORMS: { value: NonNullable<LeadFormData["primaryPlatform"]>; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "x", label: "X" },
  { value: "other", label: "أخرى" },
];

interface GatedResultsFormProps {
  onSubmit: (lead: LeadFormData) => Promise<void>;
  isSubmitting: boolean;
  errorMessage?: string;
}

export function GatedResultsForm({
  onSubmit,
  isSubmitting,
  errorMessage,
}: GatedResultsFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accountUrl, setAccountUrl] = useState("");
  const [platform, setPlatform] = useState<LeadFormData["primaryPlatform"]>();
  const [dataConsent, setDataConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [touched, setTouched] = useState(false);

  const nameError = touched && name.trim().length < 2 ? "الاسم قصير جدًا" : undefined;
  const emailError =
    touched && !/^\S+@\S+\.\S+$/.test(email) ? "بريد إلكتروني غير صحيح" : undefined;

  const canSubmit =
    name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(email) && dataConsent && !isSubmitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      accountUrl: accountUrl.trim() || undefined,
      primaryPlatform: platform,
      dataConsent,
      marketingConsent,
    });
  }

  return (
    <StepShell
      title="تحليلك جاهز تقريبًا"
      subtitle="عبّي بياناتك عشان تشوفي نتيجتك التفصيلية وتوصلك نسخة على إيميلك."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextField
          id="lead-name"
          label="الاسم"
          placeholder="اسمك"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
          required
        />
        <TextField
          id="lead-email"
          type="email"
          label="البريد الإلكتروني"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          hint="نستخدمه فقط لإرسال نسخة من نتيجتك وأي تحديثات وفق موافقتك."
          required
        />
        <TextField
          id="lead-account"
          label="رابط حساب صناعة المحتوى (اختياري)"
          placeholder="https://instagram.com/username"
          value={accountUrl}
          onChange={(e) => setAccountUrl(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-ink">المنصة الأساسية (اختياري)</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PLATFORMS.map((p) => (
              <ChoiceCard
                key={p.value}
                label={p.label}
                selected={platform === p.value}
                onClick={() => setPlatform(platform === p.value ? undefined : p.value)}
              />
            ))}
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={dataConsent}
            onChange={(e) => setDataConsent(e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
            required
          />
          <span>
            أوافق على تخزين واستخدام البيانات التي أدخلتها لتشغيل الأداة وتحليل نتيجتي.
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <span>أوافق على تلقي تحديثات وأدوات جديدة متعلقة بصناعة المحتوى والـAI.</span>
        </label>

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        <Button type="submit" disabled={!canSubmit}>
          {isSubmitting ? "جاري تجهيز النتيجة..." : "عرض النتيجة"}
        </Button>
      </form>
    </StepShell>
  );
}
