import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createAdminClient } from "@/lib/supabase/server";
import { registerPdfFonts } from "@/lib/pdf/registerFonts";
import { ReportDocument } from "@/lib/pdf/ReportDocument";
import type { AuditResults, Locale, TimeValueChoice, UserType } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const langParam = req.nextUrl.searchParams.get("lang");
  const locale: Locale = langParam === "en" ? "en" : "ar";

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("name, user_type, results, time_value_answers")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const timeValueAnswers = data.time_value_answers as { choice: TimeValueChoice; otherText?: string };

  registerPdfFonts();

  const buffer = await renderToBuffer(
    ReportDocument({
      locale,
      name: data.name,
      userType: data.user_type as UserType,
      results: data.results as AuditResults,
      timeValueChoice: timeValueAnswers.choice,
      timeValueOtherText: timeValueAnswers.otherText,
      generatedAt: new Date(),
    })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="time-audit-report.pdf"`,
    },
  });
}
