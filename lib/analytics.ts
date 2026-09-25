"use client";

import { createClient } from "@/lib/supabase/client";

export type EventName =
  | "started_audit"
  | "completed_profile"
  | "completed_audit"
  | "viewed_results"
  | "copied_prompt"
  | "downloaded_report"
  | "marketing_opt_in";

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  const key = "audit_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function trackEvent(
  eventName: EventName,
  metadata?: Record<string, unknown>,
  submissionId?: string
) {
  // تتبع الأحداث ثانوي بالكامل — يجب ألا يكسر تجربة المستخدم الأساسية أبدًا
  // (مثلًا لو متغيرات Supabase غير مضبوطة بعد، أو الشبكة غير متاحة)
  try {
    const supabase = createClient();
    supabase
      .from("events")
      .insert({
        session_id: getSessionId(),
        event_name: eventName,
        submission_id: submissionId ?? null,
        metadata: metadata ?? null,
      })
      .then(({ error }) => {
        if (error) console.warn("تعذر تسجيل الحدث:", error.message);
      });
  } catch (e) {
    console.warn("تعذر تسجيل الحدث:", e);
  }
}
