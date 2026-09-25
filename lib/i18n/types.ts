import type {
  AIUsageArea,
  AIUsageLevel,
  CategoryId,
  ContentVolume,
  PainPointKey,
  Platform,
  TimeValueChoice,
} from "@/lib/types";

export type Locale = "ar" | "en";

/** A value available in both languages — used for solution-library content. */
export type Dict = Record<Locale, string>;

export interface Dictionary {
  common: {
    siteName: string;
    next: string;
    back: string;
    stepOf: (current: number, total: number) => string;
    languageToggleLabel: string;
    startAudit: string;
    other: string;
    otherPlaceholder: string;
    disclaimer: string;
  };
  landing: {
    heroEyebrow: string;
    heroHeadline: string;
    heroSupporting: string;
    heroCta: string;
    heroNote: string;
    stepsStrip: { time: string; tasks: string; insight: string };
    painHeading: string;
    painPoints: { title: string; desc: string }[];
    painCta: string;
    whatHeading: string;
    whatSubheading: string;
    whatItems: { title: string; desc: string }[];
    trustHeading: string;
    trustBody: string;
    finalHeading: string;
    finalCta: string;
    footerDisclaimer: string;
  };
  audit: {
    q1: {
      title: string;
      options: { creator: string; creator_business: string };
    };
    q2: {
      title: string;
      volumeOptions: Record<ContentVolume, string>;
      platformLabel: string;
      platformOptions: Record<Platform, string>;
    };
    q3: {
      title: string;
      subtitle: string;
      contentTaskLabels: Record<string, string>;
      businessSectionTitle: string;
      businessTaskLabels: Record<string, string>;
      hoursOptions: { value: number; label: string }[];
    };
    q4: {
      title: string;
      subtitle: string;
      maxHint: string;
      options: Record<PainPointKey, string>;
    };
    q5: {
      title: string;
      subtitle: string;
      placeholder: string;
    };
    q6: {
      title: string;
      levelOptions: Record<AIUsageLevel, string>;
      areasTitle: string;
      areaOptions: Record<AIUsageArea, string>;
    };
    q7: {
      title: string;
      subtitle: string;
      options: Record<TimeValueChoice, string>;
    };
  };
  leadCapture: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    emailHint: string;
    accountUrlLabel: string;
    platformLabel: string;
    dataConsentLabel: string;
    marketingConsentLabel: string;
    submitLabel: string;
    submittingLabel: string;
    genericError: string;
  };
  validation: {
    nameTooShort: string;
    emailInvalid: string;
    urlInvalid: string;
    requiredChoice: string;
    consentRequired: string;
  };
  results: {
    greeting: (name: string) => string;
    pageTitle: string;
    summaryHeading: string;
    timeBreakdownHeading: string;
    contentHoursLabel: string;
    businessHoursLabel: string;
    totalHoursLabel: string;
    ratioLabel: string;
    topProblemsHeading: string;
    noProblemsTitle: string;
    noProblemsBody: string;
    whyItMattersLabel: string;
    diagnosisLabel: string;
    quickWinLabel: string;
    promptLabel: string;
    copyPrompt: string;
    copied: string;
    downloadReport: string;
    backHome: string;
    hoursUnit: string;
  };
  admin: {
    dashboardTitle: string;
    logout: string;
    exportCsv: string;
    loginTitle: string;
    loginEmail: string;
    loginPassword: string;
    loginSubmit: string;
    loginError: string;
    totalUsers: string;
    creators: string;
    creatorsBusiness: string;
    avgContentHours: string;
    avgBusinessHours: string;
    avgTotalHours: string;
    languageDistribution: string;
    topProblems: string;
    topAutomation: string;
    aiUsageDistribution: string;
    openAnswers: string;
    noOpenAnswers: string;
  };
  pdf: {
    title: string;
    dateLabel: string;
    summaryHeading: string;
  };
}

export type { CategoryId };
