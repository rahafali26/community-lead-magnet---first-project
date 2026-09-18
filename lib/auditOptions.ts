import type {
  AIUsageArea,
  AIUsageLevel,
  BusinessAnswers,
  ContentAnswers,
  ProblemKey,
  TimeValueChoice,
} from "@/lib/types";

export const VOLUME_OPTIONS: { value: ContentAnswers["volume"]; label: string }[] = [
  { value: "1-4", label: "1–4 قطع محتوى" },
  { value: "5-10", label: "5–10 قطع محتوى" },
  { value: "11-20", label: "11–20 قطعة محتوى" },
  { value: "21-30", label: "21–30 قطعة محتوى" },
  { value: "30+", label: "أكثر من 30 قطعة محتوى" },
];

export const PLATFORMS_COUNT_OPTIONS: {
  value: ContentAnswers["platformsCount"];
  label: string;
}[] = [
  { value: "1", label: "منصة واحدة" },
  { value: "2", label: "منصتين" },
  { value: "3", label: "3 منصات" },
  { value: "4+", label: "4 منصات أو أكثر" },
];

export const PRODUCTION_STYLE_OPTIONS: {
  value: ContentAnswers["productionStyle"];
  label: string;
}[] = [
  { value: "solo", label: "أسوي كل شيء بنفسي" },
  { value: "solo_help", label: "أغلبه بنفسي + مساعدة أحيانًا" },
  { value: "one_helper", label: "عندي شخص يساعدني" },
  { value: "team", label: "عندي فريق" },
];

export const BUSINESS_TYPE_OPTIONS: {
  value: BusinessAnswers["businessType"];
  label: string;
}[] = [
  { value: "service", label: "خدمة" },
  { value: "product", label: "منتج" },
  { value: "digital_product", label: "منتج رقمي" },
  { value: "course", label: "دورة / تعليم" },
  { value: "subscription", label: "اشتراك" },
  { value: "agency", label: "وكالة" },
  { value: "other", label: "أخرى" },
];

export const TEAM_OPTIONS: { value: BusinessAnswers["team"]; label: string }[] = [
  { value: "solo", label: "أعمل بشكل منفرد" },
  { value: "one_helper", label: "عندي شخص يساعدني" },
  { value: "team", label: "عندي فريق" },
];

export const CLIENTS_COUNT_OPTIONS: {
  value: BusinessAnswers["clientsCount"];
  label: string;
}[] = [
  { value: "0", label: "0" },
  { value: "1-5", label: "1–5" },
  { value: "6-15", label: "6–15" },
  { value: "16-30", label: "16–30" },
  { value: "30+", label: "أكثر من 30" },
];

export const PROBLEMS_OPTIONS: { value: ProblemKey; label: string }[] = [
  { value: "no_time_content", label: "ما ألحق على المحتوى" },
  { value: "no_time_business", label: "ما ألحق على البزنس" },
  { value: "both_take_time", label: "الاثنين يأخذون وقتي" },
  { value: "many_repetitive_tasks", label: "عندي مهام كثيرة ومتكررة" },
  { value: "context_switching", label: "أضيع وقتي في الانتقال بين المهام" },
  { value: "dont_know_where_to_start", label: "ما أعرف وش أبدأ فيه" },
  { value: "other", label: "شيء آخر" },
];

export const AI_USAGE_LEVEL_OPTIONS: { value: AIUsageLevel; label: string }[] = [
  { value: "none", label: "ما أستخدمه" },
  { value: "sometimes", label: "أستخدمه أحيانًا" },
  { value: "regularly", label: "أستخدمه بشكل مستمر" },
  { value: "heavily", label: "أعتمد عليه في جزء كبير من شغلي" },
];

export const AI_USAGE_AREA_OPTIONS: { value: AIUsageArea; label: string }[] = [
  { value: "content_ideas", label: "أفكار المحتوى" },
  { value: "writing", label: "الكتابة" },
  { value: "research", label: "البحث" },
  { value: "design", label: "التصميم" },
  { value: "video", label: "الفيديو" },
  { value: "analytics", label: "التحليلات" },
  { value: "admin", label: "المهام الإدارية" },
  { value: "customer_service", label: "خدمة العملاء" },
  { value: "other", label: "أخرى" },
];

export const TIME_VALUE_OPTIONS: { value: TimeValueChoice; label: string }[] = [
  { value: "more_content", label: "أصنع محتوى أكثر" },
  { value: "grow_business", label: "أطور البزنس" },
  { value: "rest", label: "أرتاح" },
  { value: "family", label: "أقضي وقت مع العائلة" },
  { value: "learning", label: "أتعلم" },
  { value: "other", label: "أخرى" },
];
