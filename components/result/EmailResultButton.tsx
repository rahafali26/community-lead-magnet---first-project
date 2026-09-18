"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

export function EmailResultButton({ submissionId }: { submissionId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleClick() {
    setStatus("loading");
    trackEvent("requested_email", undefined, submissionId);

    try {
      const res = await fetch("/api/send-result-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: submissionId }),
      });

      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button variant="secondary" onClick={handleClick} disabled={status === "loading"}>
        {status === "sent" ? "تم الإرسال ✓" : "أرسل لي نسخة من نتيجتي"}
      </Button>
      {status === "error" && (
        <p className="text-xs text-red-500">تعذر الإرسال، حاولي مرة ثانية.</p>
      )}
    </div>
  );
}
