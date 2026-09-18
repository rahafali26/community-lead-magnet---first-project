"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ViewTracker({ submissionId }: { submissionId: string }) {
  useEffect(() => {
    trackEvent("viewed_results", undefined, submissionId);
    // مرة واحدة فقط عند عرض صفحة النتيجة
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
