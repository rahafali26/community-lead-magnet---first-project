"use client";

import { useState } from "react";
import type { QuickWin } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

export function QuickWinCard({
  quickWin,
  submissionId,
}: {
  quickWin: QuickWin;
  submissionId: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(quickWin.promptTemplate);
      setCopied(true);
      trackEvent("copied_prompt", { quickWinId: quickWin.id }, submissionId);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // بعض المتصفحات تمنع النسخ بدون تفاعل مباشر — نتجاهل الخطأ بصمت
    }
  }

  return (
    <Card className="p-6 bg-accent text-white">
      <p className="text-xs uppercase tracking-wide text-white/70 mb-1">Quick Win</p>
      <h3 className="text-xl font-extrabold mb-2">{quickWin.title}</h3>
      <p className="text-white/80 text-sm mb-4">{quickWin.description}</p>
      <div className="rounded-xl bg-white/10 p-4 text-sm leading-relaxed whitespace-pre-wrap mb-4">
        {quickWin.promptTemplate}
      </div>
      <Button variant="secondary" onClick={handleCopy} className="!bg-white !text-accent">
        {copied ? "تم نسخ الـPrompt" : "نسخ الـPrompt"}
      </Button>
    </Card>
  );
}
