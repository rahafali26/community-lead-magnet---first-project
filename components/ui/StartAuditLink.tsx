"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuditStore } from "@/store/auditStore";

/**
 * Always resets the audit store before navigating to /audit. Every "start the audit" entry
 * point on the site must use this instead of a plain Link — otherwise a previously persisted
 * `step` in localStorage (e.g. from an earlier attempt) makes the audit page open wherever the
 * user left off, including landing directly on Lead Capture, which reads as "the audit is
 * broken" even though nothing crashed.
 */
export function StartAuditLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href="/audit" className={className} onClick={() => useAuditStore.getState().reset()}>
      {children}
    </Link>
  );
}
