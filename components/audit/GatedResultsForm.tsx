"use client";

import { useState } from "react";
import { StepShell } from "./StepShell";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { LeadFormData, Platform } from "@/lib/types";

const PLATFORMS: Platform[] = ["instagram", "tiktok", "youtube", "linkedin", "x", "other"];

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
  const { dict } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accountUrl, setAccountUrl] = useState("");
  const [platform, setPlatform] = useState<Platform>();
  const [platformOtherText, setPlatformOtherText] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);
  const [touched, setTouched] = useState(false);

  const nameError = touched && name.trim().length < 2 ? dict.validation.nameTooShort : undefined;
  const emailError =
    touched && !/^\S+@\S+\.\S+$/.test(email) ? dict.validation.emailInvalid : undefined;
  const urlError =
    touched && !/^https?:\/\/.+/.test(accountUrl) ? dict.validation.urlInvalid : undefined;

  const canSubmit =
    name.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(email) &&
    /^https?:\/\/.+/.test(accountUrl) &&
    platform !== undefined &&
    dataConsent &&
    !isSubmitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit || !platform) return;

    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      accountUrl: accountUrl.trim(),
      primaryPlatform: platform,
      primaryPlatformOtherText: platform === "other" ? platformOtherText : undefined,
      marketingConsent,
    });
  }

  return (
    <StepShell title={dict.leadCapture.title} subtitle={dict.leadCapture.subtitle}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextField
          id="lead-name"
          label={dict.leadCapture.nameLabel}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
          required
        />
        <TextField
          id="lead-email"
          type="email"
          label={dict.leadCapture.emailLabel}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          hint={dict.leadCapture.emailHint}
          required
        />
        <TextField
          id="lead-account"
          label={dict.leadCapture.accountUrlLabel}
          placeholder="https://instagram.com/username"
          value={accountUrl}
          onChange={(e) => setAccountUrl(e.target.value)}
          error={urlError}
          required
        />

        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-text-primary">{dict.leadCapture.platformLabel}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PLATFORMS.map((p) => (
              <ChoiceCard
                key={p}
                label={dict.audit.q2.platformOptions[p]}
                selected={platform === p}
                onClick={() => setPlatform(p)}
              />
            ))}
          </div>
          {platform === "other" && (
            <TextField
              id="lead-platform-other"
              label=""
              placeholder={dict.common.otherPlaceholder}
              value={platformOtherText}
              onChange={(e) => setPlatformOtherText(e.target.value)}
              autoFocus
            />
          )}
        </div>

        <label className="flex items-start gap-3 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={dataConsent}
            onChange={(e) => setDataConsent(e.target.checked)}
            className="mt-1 h-4 w-4 accent-primary"
            required
          />
          <span>{dict.leadCapture.dataConsentLabel}</span>
        </label>

        <label className="flex items-start gap-3 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <span>{dict.leadCapture.marketingConsentLabel}</span>
        </label>

        {errorMessage && <p className="text-sm text-error">{errorMessage}</p>}

        <Button type="submit" disabled={!canSubmit}>
          {isSubmitting ? dict.leadCapture.submittingLabel : dict.leadCapture.submitLabel}
        </Button>
      </form>
    </StepShell>
  );
}
