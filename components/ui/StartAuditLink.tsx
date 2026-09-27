"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Navigates to /audit with an explicit "start fresh" signal. This does NOT reset the store
 * directly here — see app/audit/page.tsx for why: zustand's `persist` middleware rehydrates
 * from localStorage ASYNCHRONOUSLY. A synchronous `reset()` called here, at click time, can be
 * silently clobbered moments later if that rehydration (e.g. still in flight from this tab's
 * very first load) resolves afterward and overwrites the reset with old persisted state — which
 * is exactly how a stale, previously-checked Question-4 pain (from an earlier, unrelated test
 * session) could still end up in a "fresh" audit despite the user genuinely starting over via
 * this link. The `?fresh=1` marker lets /audit perform the reset only once hydration is
 * confirmed complete, which fully eliminates that race instead of just hoping it doesn't occur.
 */
export function StartAuditLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href="/audit?fresh=1" className={className}>
      {children}
    </Link>
  );
}
