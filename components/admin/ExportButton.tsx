"use client";

import { Button } from "@/components/ui/Button";

export function ExportButton() {
  return (
    <a href="/api/admin/export">
      <Button variant="secondary">تصدير CSV</Button>
    </a>
  );
}
