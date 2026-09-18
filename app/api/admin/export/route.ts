import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { AuditResults } from "@/lib/types";

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("submissions")
    .select(
      "id, created_at, name, email, account_url, primary_platform, user_type, marketing_consent, results"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "تعذر جلب البيانات" }, { status: 500 });
  }

  const headers = [
    "id",
    "created_at",
    "name",
    "email",
    "account_url",
    "primary_platform",
    "user_type",
    "marketing_consent",
    "content_hours_total",
    "business_hours_total",
    "total_hours",
  ];

  const rows = (data ?? []).map((row) => {
    const results = row.results as AuditResults;
    return [
      row.id,
      row.created_at,
      row.name,
      row.email,
      row.account_url,
      row.primary_platform,
      row.user_type,
      row.marketing_consent,
      results?.contentHoursTotal ?? "",
      results?.businessHoursTotal ?? "",
      results?.totalHours ?? "",
    ];
  });

  const csv = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");

  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="submissions.csv"`,
    },
  });
}
