import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { resolveAllProblems, resolveCategoryLabel } from "@/lib/solutions/resolveProblem";
import type { AuditResults, Locale, TimeValueChoice, UserType } from "@/lib/types";

interface ReportDocumentProps {
  locale: Locale;
  name: string;
  userType: UserType;
  results: AuditResults;
  timeValueChoice: TimeValueChoice;
  timeValueOtherText?: string;
  generatedAt: Date;
}

const COLORS = {
  primary: "#6a5a8e",
  primaryDark: "#4d4069",
  secondary: "#7a8f6a",
  secondarySoft: "#eaefe6",
  primarySoft: "#ede9f4",
  problemSoft: "#f3e9e9",
  text: "#241f2e",
  textSoft: "#6b6478",
  border: "#e3dfec",
  surfaceMuted: "#f7f6f9",
};

// Plain number+unit strings, e.g. "76 ساعة". The bidi fix that actually matters lives on the
// Text styles below (`direction: rtl ? "rtl" : "ltr"` set explicitly on every one) — Unicode
// bidi control characters (LRE/PDF, LRI/PDI) had zero effect here, and `direction` set only on
// the Page did not reliably reach nested Text nodes either. Setting it explicitly per style is
// what fixed "76 ساعة" rendering as "ساعة 76".
function formatHours(hours: number, locale: Locale): string {
  const n = hours.toFixed(1).replace(/\.0$/, "");
  return locale === "ar" ? `${n} ساعة` : `${n} hrs`;
}

function formatPercent(n: number, locale: Locale): string {
  const v = Math.round(n);
  return locale === "ar" ? `${v}%` : `${v}%`;
}

function styles(locale: Locale) {
  const rtl = locale === "ar";
  const align = rtl ? "right" : "left";
  const rowDir = rtl ? "row-reverse" : "row";

  return StyleSheet.create({
    page: {
      paddingTop: 32,
      paddingBottom: 36,
      paddingHorizontal: 36,
      fontFamily: "Body",
      fontSize: 10,
      color: COLORS.text,
      direction: rtl ? "rtl" : "ltr",
    },
    headerRow: {
      flexDirection: rowDir,
      justifyContent: "space-between",
      alignItems: "flex-end",
      borderBottomWidth: 2,
      borderBottomColor: COLORS.primary,
      paddingBottom: 10,
      marginBottom: 14,
    },
    title: {
      fontFamily: "Heading",
      fontWeight: 800,
      fontSize: 20,
      textAlign: align,
      color: COLORS.primaryDark,
      direction: rtl ? "rtl" : "ltr",
    },
    dateLine: { fontSize: 9, color: COLORS.textSoft, textAlign: align, direction: rtl ? "rtl" : "ltr" },

    summaryCard: {
      backgroundColor: COLORS.primary,
      borderRadius: 8,
      padding: 14,
      marginBottom: 12,
    },
    summaryHeading: {
      fontFamily: "Heading",
      fontWeight: 700,
      fontSize: 12,
      color: "#ffffff",
      textAlign: align,
      marginBottom: 4,
      direction: rtl ? "rtl" : "ltr",
    },
    summaryBody: {
      fontSize: 9.5,
      lineHeight: 1.5,
      color: "#ffffff",
      textAlign: align,
      direction: rtl ? "rtl" : "ltr",
    },

    sectionHeading: {
      fontFamily: "Heading",
      fontWeight: 700,
      fontSize: 12.5,
      marginTop: 4,
      marginBottom: 8,
      color: COLORS.primaryDark,
      textAlign: align,
      direction: rtl ? "rtl" : "ltr",
    },

    kpiRow: { flexDirection: rowDir, gap: 8, marginBottom: 10 },
    kpiCard: {
      flex: 1,
      borderRadius: 6,
      padding: 8,
      backgroundColor: COLORS.surfaceMuted,
      borderTopWidth: 3,
      borderTopColor: COLORS.primary,
    },
    kpiCardSecondary: { borderTopColor: COLORS.secondary },
    kpiLabel: {
      fontSize: 7.5,
      color: COLORS.textSoft,
      textAlign: align,
      marginBottom: 2,
      direction: rtl ? "rtl" : "ltr",
    },
    kpiValue: {
      fontFamily: "Heading",
      fontWeight: 800,
      fontSize: 15,
      color: COLORS.text,
      textAlign: align,
      direction: rtl ? "rtl" : "ltr",
    },

    ratioTrack: {
      flexDirection: rowDir,
      height: 7,
      borderRadius: 4,
      overflow: "hidden",
      marginBottom: 10,
    },

    taskBarRow: { flexDirection: rowDir, alignItems: "center", marginBottom: 5, gap: 6 },
    taskBarLabel: {
      width: 118,
      fontSize: 8,
      color: COLORS.textSoft,
      textAlign: align,
      direction: rtl ? "rtl" : "ltr",
    },
    taskBarTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: COLORS.surfaceMuted, overflow: "hidden" },
    taskBarFill: { height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
    taskBarValue: {
      width: 44,
      fontSize: 8,
      fontWeight: 700,
      color: COLORS.text,
      textAlign: align,
      direction: rtl ? "rtl" : "ltr",
    },

    problemCard: {
      marginBottom: 10,
      borderRadius: 8,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    problemHead: {
      backgroundColor: COLORS.problemSoft,
      borderTopWidth: 3,
      borderTopColor: COLORS.primary,
      padding: 10,
    },
    problemIndex: {
      fontSize: 8,
      fontWeight: 700,
      color: COLORS.primary,
      textAlign: align,
      marginBottom: 2,
      direction: rtl ? "rtl" : "ltr",
    },
    problemTitle: {
      fontFamily: "Heading",
      fontWeight: 700,
      fontSize: 12,
      color: COLORS.text,
      textAlign: align,
      marginBottom: 5,
      direction: rtl ? "rtl" : "ltr",
    },
    fieldLabel: {
      fontSize: 7.5,
      fontFamily: "Heading",
      fontWeight: 700,
      color: COLORS.textSoft,
      textAlign: align,
      marginTop: 4,
      marginBottom: 1,
      direction: rtl ? "rtl" : "ltr",
    },
    fieldBody: {
      fontSize: 10.5,
      lineHeight: 1.55,
      color: COLORS.text,
      textAlign: align,
      direction: rtl ? "rtl" : "ltr",
    },

    quickWinBlock: { backgroundColor: COLORS.secondarySoft, padding: 10 },
    quickWinBadge: {
      alignSelf: rtl ? "flex-end" : "flex-start",
      backgroundColor: COLORS.secondary,
      color: "#ffffff",
      fontSize: 7.5,
      fontWeight: 700,
      borderRadius: 3,
      paddingVertical: 2,
      paddingHorizontal: 6,
      marginBottom: 5,
    },
    quickWinTitle: {
      fontFamily: "Heading",
      fontWeight: 700,
      fontSize: 10.5,
      color: COLORS.text,
      textAlign: align,
      marginBottom: 3,
      direction: rtl ? "rtl" : "ltr",
    },
    promptBox: {
      backgroundColor: "#ffffff",
      borderRadius: 5,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 8,
      marginTop: 4,
    },
    promptText: {
      fontSize: 10,
      lineHeight: 1.55,
      color: COLORS.text,
      textAlign: align,
      direction: rtl ? "rtl" : "ltr",
    },

    noProblems: {
      fontSize: 9.5,
      lineHeight: 1.5,
      color: COLORS.textSoft,
      textAlign: align,
      marginBottom: 10,
      direction: rtl ? "rtl" : "ltr",
    },

    disclaimer: {
      marginTop: 10,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      fontSize: 7.5,
      color: COLORS.textSoft,
      textAlign: align,
      lineHeight: 1.4,
      direction: rtl ? "rtl" : "ltr",
    },
  });
}

export function ReportDocument({
  locale,
  name,
  userType,
  results,
  timeValueChoice,
  timeValueOtherText,
  generatedAt,
}: ReportDocumentProps) {
  const dict = getDictionary(locale);
  const s = styles(locale);
  const resolvedProblems = resolveAllProblems(results.topProblems, locale);
  // Mirrors the canonical topProblems order (same items/order as the Top Problems section and
  // solution cards) instead of independently picking the highest-hour tasks.
  const chartRows = results.topProblems.map((p) => ({
    key: p.categoryId,
    label: resolveCategoryLabel(p.categoryId, locale),
    hours: p.hours,
  }));
  const dateStr = generatedAt.toLocaleDateString(locale === "ar" ? "ar" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeValueLabel =
    timeValueChoice === "other" && timeValueOtherText
      ? timeValueOtherText
      : dict.audit.q7.options[timeValueChoice];

  const summaryText =
    locale === "ar"
      ? `مرحبًا ${name}. بناءً على إجاباتك، وقتك الشهري تقريبًا ${formatHours(results.totalHours, locale)}.${
          resolvedProblems[0] ? ` أعلى فرصة عندك حاليًا: ${resolvedProblems[0].problemLabel}.` : ""
        } وقلت إنك لو رجعت لك هذي الساعات بتستخدمها في: ${timeValueLabel}.`
      : `Hi ${name}. Based on your answers, your monthly time comes to roughly ${formatHours(
          results.totalHours,
          locale
        )}.${
          resolvedProblems[0] ? ` Your top opportunity right now: ${resolvedProblems[0].problemLabel}.` : ""
        } You said you'd use recovered time on: ${timeValueLabel}.`;

  const ratio = results.contentVsBusinessRatio;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          <Text style={s.title}>{dict.pdf.title}</Text>
          <Text style={s.dateLine}>
            {dict.pdf.dateLabel}: {dateStr}
          </Text>
        </View>

        <View style={s.summaryCard}>
          <Text style={s.summaryHeading}>{dict.pdf.summaryHeading}</Text>
          <Text style={s.summaryBody}>{summaryText}</Text>
        </View>

        <Text style={s.sectionHeading}>{dict.results.timeBreakdownHeading}</Text>
        <View style={s.kpiRow}>
          <View style={s.kpiCard}>
            <Text style={s.kpiLabel}>{dict.results.contentHoursLabel}</Text>
            <Text style={s.kpiValue}>{formatHours(results.contentHoursTotal, locale)}</Text>
          </View>
          {userType === "creator_business" && (
            <View style={[s.kpiCard, s.kpiCardSecondary]}>
              <Text style={s.kpiLabel}>{dict.results.businessHoursLabel}</Text>
              <Text style={s.kpiValue}>{formatHours(results.businessHoursTotal, locale)}</Text>
            </View>
          )}
          <View style={s.kpiCard}>
            <Text style={s.kpiLabel}>{dict.results.totalHoursLabel}</Text>
            <Text style={s.kpiValue}>{formatHours(results.totalHours, locale)}</Text>
          </View>
        </View>

        {userType === "creator_business" && ratio !== null && (
          <>
            <View style={s.ratioTrack}>
              <View style={{ width: `${Math.round(ratio * 100)}%`, backgroundColor: COLORS.primary }} />
              <View style={{ width: `${Math.round((1 - ratio) * 100)}%`, backgroundColor: COLORS.secondary }} />
            </View>
            <View style={[s.taskBarRow, { marginBottom: 10 }]}>
              <Text style={[s.kpiLabel, { flex: 1 }]}>
                {dict.results.contentHoursLabel}: {formatPercent(ratio * 100, locale)}
              </Text>
              <Text style={[s.kpiLabel, { flex: 1 }]}>
                {dict.results.businessHoursLabel}: {formatPercent((1 - ratio) * 100, locale)}
              </Text>
            </View>
          </>
        )}

        {chartRows.map((t) => {
          const max = Math.max(1, ...chartRows.map((x) => x.hours));
          return (
            <View key={t.key} style={s.taskBarRow}>
              <Text style={s.taskBarLabel}>{t.label}</Text>
              <View style={s.taskBarTrack}>
                <View style={[s.taskBarFill, { width: `${Math.round((t.hours / max) * 100)}%` }]} />
              </View>
              <Text style={s.taskBarValue}>{formatHours(t.hours, locale)}</Text>
            </View>
          );
        })}

        <Text style={[s.sectionHeading, { marginTop: 12 }]}>{dict.results.topProblemsHeading}</Text>

        {resolvedProblems.length === 0 ? (
          <Text style={s.noProblems}>{dict.results.noProblemsBody}</Text>
        ) : (
          resolvedProblems.map((p, i) => (
            <View key={p.categoryId} style={s.problemCard} wrap={false}>
              <View style={s.problemHead}>
                <Text style={s.problemIndex}>#{i + 1}</Text>
                <Text style={s.problemTitle}>{p.problemLabel}</Text>
                <Text style={s.fieldLabel}>{dict.results.whyItMattersLabel}</Text>
                <Text style={s.fieldBody}>{p.whyItMatters}</Text>
                <Text style={s.fieldLabel}>{dict.results.diagnosisLabel}</Text>
                <Text style={s.fieldBody}>{p.diagnosis}</Text>
              </View>
              <View style={s.quickWinBlock}>
                <Text style={s.quickWinBadge}>{dict.results.quickWinLabel}</Text>
                <Text style={s.quickWinTitle}>{p.quickWinTitle}</Text>
                <Text style={s.fieldBody}>{p.quickWinDescription}</Text>
                <Text style={s.fieldLabel}>{dict.results.promptLabel}</Text>
                <View style={s.promptBox}>
                  <Text style={s.promptText}>{p.promptTemplate}</Text>
                </View>
              </View>
            </View>
          ))
        )}

        <Text style={s.disclaimer}>{dict.common.disclaimer}</Text>
      </Page>
    </Document>
  );
}
