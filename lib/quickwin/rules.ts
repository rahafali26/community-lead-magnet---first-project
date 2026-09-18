import type { ProblemsAnswers, QuickWin, TaskKey, TaskScore } from "@/lib/types";

/**
 * كل مهمة تنتمي لفئة عامة (category) — الـ Quick Win يُختار حسب الفئة صاحبة أعلى أولوية.
 */
const TASK_CATEGORY: Record<TaskKey, string> = {
  content_ideas: "research_ideas",
  research: "research_ideas",
  content_planning: "planning",
  hooks_writing: "writing",
  scripts_captions: "writing",
  filming: "editing",
  editing: "editing",
  design: "editing",
  scheduling_publishing: "planning",
  comments_dm: "client_communication",
  performance_analysis: "analytics",

  lead_research: "client_communication",
  lead_outreach: "client_communication",
  lead_followup: "client_communication",
  client_replies: "client_communication",
  meetings: "client_communication",
  customer_service: "client_communication",
  service_delivery: "administrative",
  order_prep: "administrative",
  invoicing: "administrative",
  file_organizing: "administrative",
  admin_tasks: "administrative",
  task_distribution: "administrative",
  team_followup: "administrative",
  internal_meetings: "administrative",
  campaigns: "planning",
  offers: "planning",
  business_marketing: "planning",
};

const QUICK_WINS: Record<string, QuickWin> = {
  research_ideas: {
    id: "research_ideas",
    title: "نظام سريع لجمع أفكار أسبوع كامل",
    description:
      "بدل ما تدوّر على فكرة كل مرة تبي تنشر، خصص وقت واحد أسبوعيًا لتجميع كل الأفكار دفعة وحدة.",
    promptTemplate:
      "أنت مساعد أفكار محتوى. بناءً على مجال عملي وهو: [صف مجالك هنا]، اقترح لي 7 أفكار محتوى لأسبوع كامل، بحيث كل فكرة تشمل: الزاوية الرئيسية، ولماذا تهم جمهوري، واقتراح صيغة (فيديو قصير / صورة / كاروسيل / نص).",
  },
  writing: {
    id: "writing",
    title: "حوّل فكرة واحدة إلى 5 زوايا محتوى",
    description:
      "بدل ما تكتب كل قطعة محتوى من الصفر، خذ فكرة واحدة قوية ووسّعها لعدة زوايا مختلفة توفر عليك وقت الكتابة.",
    promptTemplate:
      "عندي فكرة محتوى وهي: [اكتب فكرتك هنا]. حوّلها إلى 5 زوايا مختلفة لمحتوى، كل زاوية تشمل: hook قوي (سطر افتتاحي)، وملخص للفكرة الأساسية في نقاط، بأسلوب مناسب لجمهور [صف جمهورك هنا].",
  },
  planning: {
    id: "planning",
    title: "حوّل أهداف الأسبوع إلى خطة محتوى بسيطة",
    description:
      "خطط أسبوعك مرة وحدة بدل التخطيط اليومي المتقطع، هذا يقلل وقت اتخاذ القرار كل يوم.",
    promptTemplate:
      "هدفي هذا الأسبوع هو: [اكتب هدفك هنا]. بناءً على هذا الهدف، جهّز لي خطة نشر لمدة أسبوع (عدد المنشورات: [العدد])، مع تحديد موضوع كل منشور، والمنصة المناسبة له، وأفضل توقيت تقريبي للنشر.",
  },
  editing: {
    id: "editing",
    title: "قالب ثابت لتقليل العمل المتكرر في التصميم/المونتاج",
    description:
      "بدل ما تبدأ كل قطعة من الصفر، جهّز قالب/preset ثابت تستخدمه كنقطة انطلاق لكل محتوى جديد.",
    promptTemplate:
      "أريد تصميم قالب ثابت (template) لمحتواي على [اسم المنصة]. صف لي هيكل قالب بصري ثابت (تخطيط العناصر، أماكن النص، أماكن الشعار) يمكنني إعادة استخدامه في كل قطعة محتوى جديدة لتوفير وقت التصميم/المونتاج، مع مراعاة أن مجالي هو: [صف مجالك هنا].",
  },
  analytics: {
    id: "analytics",
    title: "مراجعة أسبوعية سريعة لأداء المحتوى",
    description:
      "بدل تحليل كل منشور لحاله، خصص 15 دقيقة أسبوعيًا لمراجعة الأداء العام واستخراج الدروس.",
    promptTemplate:
      "هذي أرقام أداء محتواي هذا الأسبوع: [الصق الأرقام هنا: مشاهدات، تفاعل، متابعين جدد]. حلل لي هذي الأرقام واستخرج: أهم 3 ملاحظات، وأفضل نوع محتوى أداءً، واقتراح واحد لتحسين الأسبوع القادم.",
  },
  client_communication: {
    id: "client_communication",
    title: "نظام بسيط لتجميع ومتابعة العملاء المحتملين",
    description:
      "بدل ما تتابع كل عميل من ذاكرتك أو محادثات متفرقة، جهّز نظام تتبّع بسيط (جدول واحد) لكل عميل ومرحلته.",
    promptTemplate:
      "أريد جدول متابعة بسيط للعملاء المحتملين. اقترح لي الأعمدة المناسبة (مثل: اسم العميل، تاريخ أول تواصل، آخر رسالة، الحالة، الخطوة التالية)، ثم اكتب لي رسالة متابعة قصيرة واحدة مناسبة لعميل لم يرد من [عدد الأيام] أيام في مجالي: [صف مجالك هنا].",
  },
  administrative: {
    id: "administrative",
    title: "قائمة أسبوعية لاكتشاف المهام المتكررة القابلة للأتمتة",
    description:
      "خصص وقت أسبوعي قصير لمراجعة أي مهمة إدارية تكررت أكثر من مرتين — هذي أول إشارة إنها تستاهل الأتمتة.",
    promptTemplate:
      "هذي قائمة بالمهام الإدارية المتكررة عندي: [اذكر المهام هنا]. لكل مهمة، اقترح لي طريقة بسيطة لتسريعها أو أتمتتها جزئيًا (قالب جاهز، تسلسل خطوات ثابت، أو أداة بسيطة)، مع الأخذ بالاعتبار إني [صف حجم عملك: منفرد / فريق صغير].",
  },
  general: {
    id: "general",
    title: "قائمة أسبوعية لاكتشاف المهام المتكررة",
    description:
      "أبسط نقطة بداية: راقب أسبوعك واكتب أي مهمة تكررت أكثر من مرتين — هذي أول مرشح للأتمتة أو التفويض.",
    promptTemplate:
      "راقبت أسبوعي ولاحظت إني أكرر هذي المهام: [اذكر المهام هنا]. ساعدني أرتبها حسب الأولوية للأتمتة أو التبسيط، واقترح لكل واحدة خطوة عملية واحدة بسيطة أقدر أبدأ فيها هذا الأسبوع.",
  },
};

/**
 * فئات مشتقة من "المشاكل الحالية" تُستخدم كـ fallback إذا ما فيه مهام واضحة بعد (نادر عمليًا).
 */
const PROBLEM_TO_CATEGORY: Partial<Record<ProblemsAnswers["selected"][number], string>> = {
  many_repetitive_tasks: "administrative",
  dont_know_where_to_start: "planning",
};

export function getQuickWin(
  automationPriorities: TaskScore[],
  problems: ProblemsAnswers
): QuickWin {
  const topTask = automationPriorities[0];

  if (topTask) {
    const category = TASK_CATEGORY[topTask.key];
    const win = QUICK_WINS[category];
    if (win) return win;
  }

  for (const problem of problems.selected) {
    const category = PROBLEM_TO_CATEGORY[problem];
    if (category && QUICK_WINS[category]) return QUICK_WINS[category];
  }

  return QUICK_WINS.general;
}
