import type { Dict } from "@/lib/i18n/types";
import type { CategoryId, Locale } from "@/lib/types";

export interface SolutionContext {
  locale: Locale;
  hours: number;
  topTaskLabel: string;
  flaggedByUser: boolean;
  aiGapOpen: boolean;
  vanishTaskMatched: boolean;
}

export interface SolutionDefinition {
  id: CategoryId;
  problemLabel: Dict;
  whyItMatters: Dict;
  diagnosis: (ctx: SolutionContext) => string;
  quickWinTitle: Dict;
  quickWinDescription: Dict;
  promptTemplate: Dict;
}

function formatHours(hours: number, locale: Locale): string {
  const n = hours.toFixed(1).replace(/\.0$/, "");
  return locale === "ar" ? `${n} ساعة` : `${n} hrs`;
}

/**
 * Builds the diagnosis sentence from only the signals that are actually true for this user —
 * never invents a claim. Shared by every category to keep the tone/structure consistent.
 */
function buildDiagnosis(ctx: SolutionContext, base: Dict): string {
  const { locale, hours, topTaskLabel, vanishTaskMatched, aiGapOpen } = ctx;

  if (locale === "ar") {
    let text = base.ar;
    if (hours > 0) text += ` تقريبًا ${formatHours(hours, locale)} شهريًا تروح على ${topTaskLabel}.`;
    text += " وأنت حددت هذا كواحد من أكثر الأشياء اللي تضغط عليك حاليًا.";
    if (vanishTaskMatched) text += " وهذا يتماشى مع المهمة اللي تتمنى تختفي أو تصير تلقائية.";
    if (aiGapOpen) text += " وحسب إجاباتك، ما فيه استخدام لـ AI في هذا الجزء حاليًا، يعني فرصة مفتوحة.";
    return text;
  }

  let text = base.en;
  if (hours > 0) text += ` Roughly ${formatHours(hours, locale)}/month goes into ${topTaskLabel}.`;
  text += " You flagged this yourself as one of the things weighing on you right now.";
  if (vanishTaskMatched) text += " This lines up with the task you said you'd want gone or automated.";
  if (aiGapOpen) text += " Based on your answers, you're not currently using AI here, a real, open opportunity.";
  return text;
}

const base: Record<CategoryId, Omit<SolutionDefinition, "diagnosis"> & { diagnosisBase: Dict }> = {
  research_ideas: {
    id: "research_ideas",
    problemLabel: { ar: "البحث المستمر عن أفكار ومراجع", en: "Constant idea/reference hunting" },
    whyItMatters: {
      ar: "لما تبحث عن أفكار من الصفر كل مرة، تفقد وقت وطاقة ذهنية كان ممكن تروح للإنتاج الفعلي.",
      en: "Hunting for ideas from scratch every time drains time and mental energy that could go into actual production.",
    },
    diagnosisBase: {
      ar: "البحث عن الأفكار والمراجع من أكثر المهام اللي تستهلك وقت متكرر بدون نتيجة ملموسة مباشرة.",
      en: "Idea and reference research is one of the tasks that repeatedly eats time without a direct, tangible output.",
    },
    quickWinTitle: { ar: "بنك أفكار أسبوعي بدل البحث اليومي", en: "A weekly idea bank instead of daily hunting" },
    quickWinDescription: {
      ar: "خصص وقت واحد أسبوعيًا لتجميع كل أفكارك دفعة وحدة بدل البحث المتقطع كل يوم.",
      en: "Set aside one block per week to gather all your ideas at once, instead of scattered daily searching.",
    },
    promptTemplate: {
      ar: "السياق: أنا أنتج محتوى في مجال [مجالك]، وحاليًا أضيع وقت كبير في البحث عن أفكار ومراجع قبل ما أقدر أبدأ الإنتاج الفعلي.\nالمطلوب: جهّز لي بنك أفكار لأسبوع كامل، من 5 إلى 7 أفكار.\nالقيود: كل فكرة لازم تكون واقعية أقدر أنفذها بإمكانياتي الحالية، وتجنب الأفكار العامة المكررة في مجالي، ونوّع الصيغة (فيديو قصير، كاروسيل، منشور نصي).\nالشكل المطلوب: لكل فكرة اكتب عنوان، والزاوية الأساسية في سطر أو سطرين، وليش تهم جمهوري، ومرجع أو معلومة واحدة أحتاج أتأكد منها قبل الكتابة.",
      en: "Context: I create content in [your niche], and I currently spend too much time hunting for ideas and reference material before I can start producing.\nTask: Generate a one-week content idea bank for me, 5 to 7 ideas total.\nConstraints: each idea must be realistic to produce with my current resources, avoid generic topics anyone in my niche already covers, and vary the format (short video, carousel, text post).\nOutput: for each idea, give me a title, the core angle in 1-2 sentences, why it would matter to my audience, and one supporting reference/fact I should look up before writing it.",
    },
  },
  planning: {
    id: "planning",
    problemLabel: { ar: "التخطيط والتنظيم للمحتوى", en: "Content planning and organization" },
    whyItMatters: {
      ar: "بدون خطة واضحة، كل يوم يصير فيه قرار جديد، وهذا يزيد الاحتكاك ويبطئ الإنتاج.",
      en: "Without a clear plan, every day becomes a new decision, which adds friction and slows production.",
    },
    diagnosisBase: {
      ar: "وقت التخطيط يتكرر لأن القرارات تُتخذ يوم بيوم بدل مرة وحدة مسبقًا.",
      en: "Planning time repeats because decisions get made day by day instead of once, ahead of time.",
    },
    quickWinTitle: { ar: "تحويل هدف الأسبوع إلى خطة محتوى بسيطة", en: "Turn your weekly goal into a simple content plan" },
    quickWinDescription: {
      ar: "خطط أسبوعك مرة وحدة بدل التخطيط اليومي المتقطع.",
      en: "Plan your week once instead of planning piecemeal every day.",
    },
    promptTemplate: {
      ar: "السياق: تخطيطي للمحتوى يصير يوم بيوم بدل ما يكون مسبق، وهذا يخليني أعيد نفس القرارات كل مرة.\nالمطلوب: حوّل هدفي لخطة محتوى منظمة. هدفي: [اكتب هدفك]. عدد القطع المطلوبة: [العدد].\nالقيود: خلي الخطة واقعية حسب طاقتي الإنتاجية الحالية، واجمع القطع المترابطة مع بعض بدل تفريقها.\nالشكل المطلوب: جدول يوم بيوم أو أسبوع بأسبوع يوضح الموضوع والصيغة والمنصة لكل قطعة، مع سطر يوضح علاقتها بهدفي.",
      en: "Context: My content planning happens day-by-day instead of ahead of time, which means I re-decide everything constantly.\nTask: Turn my goal for this period into a structured content plan. My goal: [describe your goal]. Number of pieces needed: [count].\nConstraints: keep the plan realistic for my current production capacity, and group related pieces together instead of scattering unrelated topics.\nOutput: a day-by-day (or week-by-week) table with the topic, format, and platform for each piece, plus one line on how it connects to my stated goal.",
    },
  },
  writing: {
    id: "writing",
    problemLabel: { ar: "كتابة الـHooks والسكربتات والكابشن", en: "Writing hooks, scripts, and captions" },
    whyItMatters: {
      ar: "الكتابة من الصفر لكل قطعة محتوى يستهلك وقت كبير، خصوصًا مع كثرة قطع المحتوى شهريًا.",
      en: "Writing every piece from scratch takes significant time, especially with a high monthly content volume.",
    },
    diagnosisBase: {
      ar: "الكتابة تتكرر بنفس الجهد لكل قطعة، بدون إعادة استخدام لهيكل أو أسلوب ثابت.",
      en: "Writing repeats the same effort for every piece, without reusing a fixed structure or style.",
    },
    quickWinTitle: { ar: "تحويل فكرة واحدة إلى عدة نصوص جاهزة", en: "Turn one idea into several ready-to-use pieces" },
    quickWinDescription: {
      ar: "بدل كتابة كل قطعة من الصفر، وسّع فكرة واحدة قوية لعدة صياغات.",
      en: "Instead of writing every piece from scratch, expand one strong idea into several angles.",
    },
    promptTemplate: {
      ar: "السياق: كتابة الهوكس والسكربتات والكابشن من الصفر لكل قطعة تاخذ مني وقت كبير، خصوصًا إني أنشر [الكمية] قطعة شهريًا.\nالمطلوب: خذ فكرة واحدة وحوّلها لعدة نصوص جاهزة للاستخدام. فكرتي: [اكتب فكرتك]. جمهوري: [صف جمهورك].\nالقيود: خلي الأسلوب يطابق طريقتي المعتادة ([صف أسلوبك، مثلاً عفوي أو مباشر أو فكاهي])، والهوك أقل من 15 كلمة، وكل نسخة تختلف فعليًا بزاويتها مو بس بصياغة مختلفة.\nالشكل المطلوب: 3 خيارات هوك، مخطط سكربت أو كابشن قصير (3-5 نقاط)، وكابشن واحد جاهز للنشر مباشرة.",
      en: "Context: Writing hooks, scripts, and captions from scratch for every single piece takes a lot of my time, especially since I publish [volume] pieces a month.\nTask: Take one core idea and turn it into multiple ready-to-use pieces of copy. My idea: [describe it]. My audience: [describe your audience].\nConstraints: match my usual tone (e.g. [casual/direct/funny]), keep hooks under 15 words, and make each version genuinely different in angle, not just reworded.\nOutput: 3 hook options, one short script or caption outline (3-5 beats), and one caption ready to publish as-is.",
    },
  },
  filming: {
    id: "filming",
    problemLabel: { ar: "وقت التصوير", en: "Filming time" },
    whyItMatters: {
      ar: "التصوير غالبًا يدوي بطبيعته، لكن التحضير الجيد له يقلل عدد المحاولات والوقت الضائع.",
      en: "Filming is largely manual by nature, but good preparation for it cuts down on retakes and wasted time.",
    },
    diagnosisBase: {
      ar: "وقت التصوير يتضخم غالبًا بسبب نقص التحضير المسبق لا التصوير نفسه.",
      en: "Filming time often balloons due to a lack of upfront prep, not the filming itself.",
    },
    quickWinTitle: { ar: "قائمة لقطات ثابتة قبل كل تصوير", en: "A fixed shot list before every shoot" },
    quickWinDescription: {
      ar: "جهّز قائمة لقطات مختصرة قبل كل جلسة تصوير لتقليل عدد المحاولات.",
      en: "Prepare a short shot list before each filming session to cut down on retakes.",
    },
    promptTemplate: {
      ar: "السياق: وقت التصوير يطول أكثر من اللازم، غالبًا بسبب قلة التحضير المسبق.\nالمطلوب: حوّل سكربتي لقائمة لقطات واضحة وجاهزة للتنفيذ. السكربت أو المحتوى: [الصقه هنا]. إمكانياتي: [صف معداتك ومكانك وإذا كنت تصور لحالك].\nالقيود: خلي اللقطات ممكن تنفيذها بإمكانياتي الحالية، وقلل عدد المحاولات بإعطاء توجيه واضح لكل لقطة.\nالشكل المطلوب: قائمة لقطات مرقّمة، كل وحدة توضح نوع اللقطة (قريبة، بعيدة...)، وش يصير فيها، وأي توجيه أحتاج أتذكره (تأطير، حركة، تعبير).",
      en: "Context: Filming takes longer than it should, mostly because I don't prepare enough beforehand.\nTask: Turn my script into a clear, shootable shot list. My script/content: [paste it]. My setup: [describe your gear/space/whether you film alone].\nConstraints: keep shots achievable with my current setup, and minimize the number of takes by giving clear direction per shot.\nOutput: a numbered shot list, each with the shot type (e.g. close-up, wide), what happens in it, and any direction I need to remember (framing, movement, expression).",
    },
  },
  editing: {
    id: "editing",
    problemLabel: { ar: "المونتاج", en: "Editing" },
    whyItMatters: {
      ar: "المونتاج المتكرر بنفس الخطوات يدويًا يستهلك وقت كبير يمكن تقليصه بقالب ثابت.",
      en: "Repeating the same manual editing steps every time takes a lot of time that a fixed template could cut down.",
    },
    diagnosisBase: {
      ar: "كل قطعة تُحرّر من الصفر بدون قالب ثابت يعيد استخدامه.",
      en: "Every piece gets edited from scratch without a reusable fixed template.",
    },
    quickWinTitle: { ar: "قالب مونتاج ثابت", en: "A reusable editing template" },
    quickWinDescription: {
      ar: "جهّز قالبًا ثابتًا (انتقالات، خط، ألوان) تستخدمه كنقطة انطلاق لكل مقطع.",
      en: "Build a fixed preset/template (transitions, font, colors) to use as the starting point for every clip.",
    },
    promptTemplate: {
      ar: "السياق: أعيد مونتاج كل قطعة من الصفر بنفس الخطوات اليدوية، وهذا يهدر وقت كان ممكن أوفره بهيكل ثابت.\nالمطلوب: صمم لي قالب مونتاج ثابت لمحتواي على [اسم المنصة]. أسلوبي: [صف الإيقاع والطابع ونوع الموسيقى].\nالقيود: الهيكل لازم يشتغل على أغلب محتواي مو مقطع واحد بس، ويكون بسيط أقدر أطبقه بسرعة.\nالشكل المطلوب: خطوات مونتاج مرتبة (طول المقدمة، نمط الإيقاع، أماكن النصوص أو الترجمة، نوع الانتقالات، الخاتمة)، موصوفة بوضوح أقدر أتبعها كل مرة بدون إعادة تفكير.",
      en: "Context: I re-edit every piece from scratch with the same manual steps, which wastes time I could save with a fixed structure.\nTask: Design a reusable editing template for my content on [platform name]. My style: [describe pacing/tone/music style].\nConstraints: the structure must work for most of my content, not just one specific video, and should be simple enough to apply quickly.\nOutput: a step-by-step editing structure (intro length, pacing pattern, where text/captions go, transition style, outro), clear enough that I can follow it every time without rethinking it.",
    },
  },
  design: {
    id: "design",
    problemLabel: { ar: "التصميم", en: "Design" },
    whyItMatters: {
      ar: "التصميم من الصفر لكل قطعة يبطئ الإنتاج ويخلق تفاوت في الهوية البصرية.",
      en: "Designing every piece from scratch slows production and creates inconsistency in visual identity.",
    },
    diagnosisBase: {
      ar: "التصميم يتكرر بدون قالب موحّد يضمن سرعة واتساق بصري.",
      en: "Design repeats without a unified template that would ensure speed and visual consistency.",
    },
    quickWinTitle: { ar: "قالب تصميم ثابت قابل لإعادة الاستخدام", en: "A reusable design template" },
    quickWinDescription: {
      ar: "جهّز قالب تصميم ثابت (تخطيط، ألوان، خطوط) لتسريع كل قطعة جديدة.",
      en: "Build a fixed design template (layout, colors, fonts) to speed up every new piece.",
    },
    promptTemplate: {
      ar: "السياق: أصمم كل قطعة من الصفر، وهذا يبطئني ويخلي هويتي البصرية غير ثابتة.\nالمطلوب: صمم لي هيكل قالب بصري ثابت لمحتواي. هويتي البصرية: [صف الألوان والخطوط والأسلوب]. المنصة: [اسم المنصة].\nالقيود: لازم يشتغل على أنواع محتوى مختلفة مو تصميم واحد بس، ويحافظ على هويتي، ويكون بسيط أقدر أعبيه بسرعة.\nالشكل المطلوب: هيكل تخطيط يوضح أماكن العناصر (الشعار، مناطق النص، الصورة)، الألوان والخطوط الموصى فيها، ومثال واحد يوضح شكله مطبق على قطعة حقيقية.",
      en: "Context: I design every piece from scratch, which slows me down and makes my visual identity inconsistent.\nTask: Design a reusable visual template structure for my content. My visual identity: [describe colors/fonts/style]. Platform: [platform name].\nConstraints: it should work across different content types (not one-off), stay true to my identity, and be simple enough to fill in quickly.\nOutput: a layout structure describing element placement (logo, text zones, image area), recommended color/font usage, and one example of how it would look applied to a real piece of content.",
    },
  },
  scheduling_publishing: {
    id: "scheduling_publishing",
    problemLabel: { ar: "الجدولة والنشر", en: "Scheduling and publishing" },
    whyItMatters: {
      ar: "النشر اليدوي مهمة متكررة عالية القابلية للأتمتة، وتركها يدوية يهدر وقت بلا داعٍ.",
      en: "Manual publishing is a highly automatable, repetitive task, and leaving it manual wastes time unnecessarily.",
    },
    diagnosisBase: {
      ar: "هذي من أكثر المهام قابلية للأتمتة الفورية، وبقاؤها يدوية غالبًا مجرد عادة لا ضرورة.",
      en: "This is one of the most immediately automatable tasks, and keeping it manual is usually just habit, not necessity.",
    },
    quickWinTitle: { ar: "جدولة أسبوعية دفعة وحدة", en: "Batch-schedule a full week at once" },
    quickWinDescription: {
      ar: "خصص وقت واحد أسبوعيًا لجدولة كل المحتوى دفعة وحدة عبر أداة جدولة.",
      en: "Set aside one weekly block to schedule all your content at once using a scheduling tool.",
    },
    promptTemplate: {
      ar: "السياق: أنشر يدويًا قطعة قطعة بدل ما أجدولها دفعة وحدة، وهذا يهدر وقت كل أسبوع.\nالمطلوب: جهّز لي جدول نشر أسبوعي. المحتوى الجاهز هذا الأسبوع: [العدد] قطعة. المنصات اللي أنشر عليها: [اذكرها].\nالقيود: خلي أوقات النشر تناسب وقت نشاط جمهور كل منصة، وتجنب تكديس منشورات كثيرة في يوم واحد.\nالشكل المطلوب: جدول يوم بيوم يوضح الوقت المقترح لكل منصة، وسطر واحد يشرح ليش هذا التوقيت مناسب.",
      en: "Context: I publish manually one piece at a time instead of batching it, which wastes time every single week.\nTask: Build me a weekly publishing schedule. Content ready this week: [number] pieces. Platforms I publish on: [list platforms].\nConstraints: match posting times to when each platform's audience is typically most active, and avoid clustering too many posts on one day.\nOutput: a day-by-day schedule with a recommended posting time per platform, and one sentence on why that timing makes sense.",
    },
  },
  client_communication: {
    id: "client_communication",
    problemLabel: { ar: "الرد على التعليقات والرسائل", en: "Replying to comments and DMs" },
    whyItMatters: {
      ar: "التفاعل مهم، لكن الردود المتكررة على نفس الأسئلة تستهلك وقت يمكن تقليصه بقوالب جاهزة.",
      en: "Engagement matters, but repeatedly answering the same questions eats time that ready templates could cut.",
    },
    diagnosisBase: {
      ar: "جزء كبير من وقت الردود غالبًا يذهب لنفس الأسئلة المتكررة.",
      en: "A large share of reply time likely goes to the same recurring questions.",
    },
    quickWinTitle: { ar: "قوالب ردود جاهزة للأسئلة المتكررة", en: "Ready reply templates for common questions" },
    quickWinDescription: {
      ar: "جهّز قوالب ردود قابلة للتخصيص السريع لأكثر 5 أسئلة تتكرر عليك.",
      en: "Prepare quickly-customizable reply templates for your top 5 recurring questions.",
    },
    promptTemplate: {
      ar: "السياق: أرد على نفس نوع الأسئلة بالتعليقات والرسائل بشكل متكرر، وهذا ياخذ وقت كبير.\nالمطلوب: جهّز لي مجموعة قوالب ردود لأكثر أسئلتي تكرارًا. أسئلتي المتكررة: [اذكرها]. أسلوبي: [صف أسلوبك المعتاد].\nالقيود: كل رد لازم يحس الشخص إنه شخصي مو منسوخ، وقصير بحيث أقدر أرسله بسرعة بعد تعديل بسيط.\nالشكل المطلوب: قالب رد واحد لكل سؤال، مع ملاحظة سريعة عن الجزء اللي أحتاج أخصصه كل مرة (الاسم، تفصيلة معينة...).",
      en: "Context: I keep answering the same kinds of questions in comments and DMs, and it eats a lot of my time.\nTask: Build me a set of reply templates for my most common questions. My most repeated questions: [list them]. My tone: [describe your usual tone].\nConstraints: each reply should feel personal, not copy-pasted, and be short enough to send quickly after light editing.\nOutput: one reply template per question, plus a one-line note on what part I should customize each time (name, specific detail, etc.).",
    },
  },
  analytics: {
    id: "analytics",
    problemLabel: { ar: "تحليل أداء المحتوى", en: "Content performance analysis" },
    whyItMatters: {
      ar: "بدون مراجعة منتظمة، يصعب معرفة وش يشتغل فعليًا ووش لازم يتغير.",
      en: "Without regular review, it's hard to know what's actually working and what needs to change.",
    },
    diagnosisBase: {
      ar: "تحليل الأداء يتكرر بدون نظام ثابت، مما يزيد وقته في كل مرة.",
      en: "Performance analysis repeats without a fixed system, which makes it take longer each time.",
    },
    quickWinTitle: { ar: "مراجعة أسبوعية سريعة (15 دقيقة)", en: "A quick weekly review (15 minutes)" },
    quickWinDescription: {
      ar: "خصص 15 دقيقة أسبوعيًا فقط لمراجعة الأرقام واستخراج أهم الدروس.",
      en: "Set aside just 15 minutes a week to review the numbers and pull out the key lessons.",
    },
    promptTemplate: {
      ar: "السياق: ما أراجع أداء محتواي بانتظام، فما أقدر أعرف وش فعليًا يشتغل.\nالمطلوب: حلل أرقام هذا الأسبوع وحولها لتوجيه واضح. أرقامي: [الصق بيانات المشاهدات والتفاعل والمتابعين].\nالقيود: لا تكرر لي الأرقام بس، وضح لي وش تعنيه ووش أسوي مختلف.\nالشكل المطلوب: أهم 3 ملاحظات، أفضل نوع محتوى أداءً وليش برأيك، وتغيير واحد محدد أجربه الأسبوع الجاي.",
      en: "Context: I don't review my content performance regularly, so I can't tell what's actually working.\nTask: Analyze this week's numbers and turn them into clear direction. My numbers: [paste views/engagement/follower data].\nConstraints: don't just repeat the numbers back to me, tell me what they mean and what to do differently.\nOutput: the top 3 takeaways, which content type performed best and why you think so, and one specific change to try next week.",
    },
  },
  business_sales: {
    id: "business_sales",
    problemLabel: { ar: "المبيعات والتواصل مع العملاء المحتملين", en: "Sales and reaching out to leads" },
    whyItMatters: {
      ar: "المبيعات تحتاج تواصل شخصي، لكن البحث والمتابعة اليدوية لكل عميل يستهلك وقت كبير.",
      en: "Sales needs a personal touch, but manually researching and following up on every lead takes a lot of time.",
    },
    diagnosisBase: {
      ar: "وقت المبيعات يتكرر في خطوات يمكن تنظيمها بنظام متابعة بسيط.",
      en: "Sales time repeats in steps that a simple follow-up system could organize.",
    },
    quickWinTitle: { ar: "نظام متابعة بسيط للعملاء المحتملين", en: "A simple lead follow-up system" },
    quickWinDescription: {
      ar: "جدول واحد بسيط يتتبع كل عميل محتمل ومرحلته، بدل الاعتماد على الذاكرة.",
      en: "One simple tracker for every lead and their stage, instead of relying on memory.",
    },
    promptTemplate: {
      ar: "السياق: عندي [نوع البزنس] وأبحث وأتابع كل عميل محتمل يدويًا، وهذا ياخذ وقت كبير وأحيانًا أفوّت عملاء.\nالمطلوب: جهّز لي نظام بسيط لمتابعة العملاء المحتملين. طريقة عملي في المبيعات: [صف باختصار].\nالقيود: خليه بسيط أقدر أحافظ عليه بدون أدوات إضافية، وخلي المتابعة تحس شخصية مو آلية.\nالشكل المطلوب: الأعمدة اللي أحتاجها في جدول المتابعة، مع قالب رسالة متابعة واحد لعميل ما رد من [عدد] أيام.",
      en: "Context: I run a [business type] and I'm manually researching and following up with every lead, which takes a lot of time and things fall through the cracks.\nTask: Build me a simple lead tracking and follow-up system. My typical sales process: [briefly describe it].\nConstraints: keep it simple enough to maintain without extra tools, and make follow-ups feel personal, not automated-sounding.\nOutput: the columns I need for a lead tracker, plus one follow-up message template for a lead who hasn't replied in [number] days.",
    },
  },
  business_client_communication: {
    id: "business_client_communication",
    problemLabel: { ar: "التواصل مع العملاء الحاليين", en: "Communicating with existing clients" },
    whyItMatters: {
      ar: "التواصل مهم لبناء الثقة، لكن الرسائل المتكررة يمكن تسريعها بدون فقدان اللمسة الشخصية.",
      en: "Communication builds trust, but recurring messages can be sped up without losing the personal touch.",
    },
    diagnosisBase: {
      ar: "جزء من وقت التواصل يذهب لنفس أنواع الرسائل بشكل متكرر.",
      en: "Part of your communication time goes to the same kinds of messages, repeatedly.",
    },
    quickWinTitle: { ar: "قوالب رسائل عملاء قابلة للتخصيص", en: "Customizable client message templates" },
    quickWinDescription: {
      ar: "جهّز قوالب لأكثر أنواع الرسائل تكرارًا (ترحيب، تحديث، متابعة).",
      en: "Prepare templates for your most common message types (welcome, update, follow-up).",
    },
    promptTemplate: {
      ar: "السياق: أرسل رسائل متشابهة لعملائي بشكل متكرر (ترحيب، تحديث، متابعة)، وكتابة كل وحدة من الصفر تاخذ وقت.\nالمطلوب: جهّز لي قوالب رسائل لأكثر أنواع التواصل مع عملائي. بزنسي: [صفه]. أنواع الرسائل اللي أحتاجها: [ترحيب أو تحديث أو متابعة أو غيره].\nالقيود: خلي الأسلوب احترافي بس دافئ، وقصير بحيث أرسله بأقل تعديل.\nالشكل المطلوب: قالب واحد لكل نوع رسالة، مع ملاحظة عن الجزء اللي أخصصه كل مرة.",
      en: "Context: I send similar messages to clients repeatedly (welcome, updates, follow-ups), and writing each one from scratch takes time.\nTask: Create message templates for my most common client communications. My business: [describe it]. Message types I need: [welcome/update/follow-up/other].\nConstraints: keep the tone professional but warm, and short enough to send with minimal editing.\nOutput: one template per message type, plus a note on what to personalize each time.",
    },
  },
  business_delivery: {
    id: "business_delivery",
    problemLabel: { ar: "تنفيذ وتسليم الخدمة أو الطلبات", en: "Delivery and fulfillment" },
    whyItMatters: {
      ar: "بدون خطوات موثّقة، كل عملية تسليم تُعاد اختراعها من الصفر.",
      en: "Without documented steps, every delivery process gets reinvented from scratch.",
    },
    diagnosisBase: {
      ar: "خطوات التسليم تتكرر بدون قائمة ثابتة توثّقها.",
      en: "Delivery steps repeat without a fixed checklist documenting them.",
    },
    quickWinTitle: { ar: "قائمة تسليم ثابتة", en: "A fixed delivery checklist" },
    quickWinDescription: {
      ar: "وثّق خطوات التسليم مرة وحدة في قائمة تستخدمها لكل طلب أو عميل جديد.",
      en: "Document the delivery steps once in a checklist you reuse for every new order/client.",
    },
    promptTemplate: {
      ar: "السياق: كل عملية تسليم أو تنفيذ أرتبها من جديد بدل ما أتبع خطوات ثابتة، وهذا يخلق تفاوت.\nالمطلوب: جهّز لي قائمة تسليم (Checklist) لخدمتي. خدمتي: [صفها].\nالقيود: القائمة لازم تشتغل على أي طلب أو عميل عادي، وتكون مفصّلة بحيث أقدر أنا أو أي شخص ثاني أتبعها بدون شرح إضافي.\nالشكل المطلوب: قائمة خطوات مرقّمة من تأكيد الطلب لحد التسليم النهائي، مع أي رسالة للعميل تلزم في خطوات معينة.",
      en: "Context: Every delivery/fulfillment process gets figured out fresh instead of following a fixed process, which creates inconsistency.\nTask: Build me a delivery checklist for my service. My service: [describe it].\nConstraints: the checklist should work for a typical client/order, and be detailed enough that I (or someone else) could follow it without me explaining it each time.\nOutput: a numbered checklist covering from order confirmation to final delivery, with any client-facing message needed at key steps.",
    },
  },
  business_admin: {
    id: "business_admin",
    problemLabel: { ar: "الأعمال الإدارية", en: "Administrative work" },
    whyItMatters: {
      ar: "المهام الإدارية عادة عالية التكرار وقابلة جدًا للأتمتة أو التبسيط.",
      en: "Administrative tasks are usually highly repetitive and very automatable or simplifiable.",
    },
    diagnosisBase: {
      ar: "هذي من أكثر الفئات قابلية للأتمتة الفورية بين كل المهام.",
      en: "This is one of the most immediately automatable categories among all your tasks.",
    },
    quickWinTitle: { ar: "قائمة أسبوعية للمهام الإدارية المتكررة", en: "A weekly list of recurring admin tasks" },
    quickWinDescription: {
      ar: "راجع أسبوعيًا أي مهمة إدارية تكررت أكثر من مرتين، فهذي أول مرشح للأتمتة.",
      en: "Weekly, review any admin task that repeated more than twice, the first candidate for automation.",
    },
    promptTemplate: {
      ar: "السياق: مهامي الإدارية المتكررة (فواتير، أوراق، سجلات) تاخذ وقت يدوي كل أسبوع.\nالمطلوب: ساعدني ألقى طرق سريعة لتسريع أو أتمتة أعمالي الإدارية المتكررة. مهامي المتكررة: [اذكرها]. أدواتي الحالية: [اذكر أي أدوات تستخدمها، أو اكتب لا يوجد].\nالقيود: اقترح تحسينات واقعية وسهلة التطبيق، مو نظام كامل جديد.\nالشكل المطلوب: لكل مهمة اقتراح محدد واحد (قالب، خطوات ثابتة، أو أداة بسيطة)، ابدأ بأعلى مهمة تأثيرًا.",
      en: "Context: Recurring admin tasks (invoicing, paperwork, records) keep taking manual time every week.\nTask: Help me find quick ways to speed up or automate my recurring admin work. My recurring tasks: [list them]. My current tools: [list any tools you use, or 'none'].\nConstraints: suggest realistic, low-effort improvements, not a full system overhaul.\nOutput: for each task, one specific suggestion (a template, a fixed sequence, or a simple tool), starting with the highest-impact one.",
    },
  },
  business_team: {
    id: "business_team",
    problemLabel: { ar: "إدارة الفريق", en: "Team management" },
    whyItMatters: {
      ar: "بدون نظام واضح لتوزيع المهام والمتابعة، وقت الإدارة يزيد بدون داعٍ.",
      en: "Without a clear system for task distribution and follow-up, management time grows unnecessarily.",
    },
    diagnosisBase: {
      ar: "متابعة الفريق تتكرر يدويًا بدون نظام تتبّع بسيط.",
      en: "Team follow-up repeats manually without a simple tracking system.",
    },
    quickWinTitle: { ar: "لوحة مهام أسبوعية بسيطة للفريق", en: "A simple weekly team task board" },
    quickWinDescription: {
      ar: "لوحة واحدة توضح من يعمل على وش، بدل المتابعة اليدوية المتفرقة.",
      en: "One board showing who's working on what, instead of scattered manual follow-up.",
    },
    promptTemplate: {
      ar: "السياق: أدير فريق صغير ومتابعة المهام تصير يدويًا، وهذا ياخذ وقت أكثر من اللازم.\nالمطلوب: صمم لي لوحة مهام أسبوعية بسيطة للفريق. فريقي: [صف الأدوار والعدد]. المهام أو المشاريع الحالية: [اذكرها باختصار].\nالقيود: خليها بسيطة أقدر أحدثها بدقائق يوميًا، بدون نظام إدارة مشاريع معقد.\nالشكل المطلوب: هيكل اللوحة (الأعمدة أو الأقسام)، وش يندرج تحت كل واحدة، وكم مرة أحدثها.",
      en: "Context: I manage a small team and task follow-up happens manually, which takes more time than it should.\nTask: Design a simple weekly team task board for me. My team: [describe roles/size]. Current tasks/projects: [list them briefly].\nConstraints: keep it simple enough to update in a few minutes a day, no complex project-management setup.\nOutput: a board structure (columns/sections), what goes in each, and how often I should update it.",
    },
  },
  business_marketing: {
    id: "business_marketing",
    problemLabel: { ar: "التسويق للبزنس", en: "Marketing for the business" },
    whyItMatters: {
      ar: "التسويق يحتاج استمرارية، وبدون نظام ثابت يستهلك وقت متغير وغير متوقع كل مرة.",
      en: "Marketing needs consistency, and without a fixed system it takes unpredictable, variable time each time.",
    },
    diagnosisBase: {
      ar: "الحملات والعروض تُخطَّط من الصفر كل مرة بدون قالب متكرر.",
      en: "Campaigns and offers get planned from scratch every time, without a repeatable template.",
    },
    quickWinTitle: { ar: "قالب حملة تسويقية قابل لإعادة الاستخدام", en: "A reusable marketing campaign template" },
    quickWinDescription: {
      ar: "جهّز هيكل حملة ثابت (رسالة، عرض، قنوات) تستخدمه كنقطة انطلاق لكل حملة جديدة.",
      en: "Build a fixed campaign structure (message, offer, channels) as the starting point for every new campaign.",
    },
    promptTemplate: {
      ar: "السياق: كل حملة أو عرض تسويقي أخطط له من الصفر، وهذا ياخذ وقت وجهد متغير كل مرة.\nالمطلوب: جهّز لي هيكل حملة ثابت أقدر أطوّعه لأي إطلاق جديد. وش أروّج له: [صف المنتج أو الخدمة أو العرض]. قنواتي المعتادة: [اذكرها].\nالقيود: خلي الهيكل قابل للتطويع لعروض مختلفة، مو مرتبط بعرض واحد محدد.\nالشكل المطلوب: إطار الرسالة الأساسية، القنوات الموصى فيها ووش أنشر في كل وحدة، وجدول زمني مقترح (تشويق، إطلاق، تذكير، إغلاق).",
      en: "Context: Every marketing campaign or offer gets planned from scratch, which takes unpredictable time and effort.\nTask: Build me a reusable campaign structure I can adapt for future launches. What I'm promoting: [describe the product/service/offer]. My usual channels: [list them].\nConstraints: keep the structure adaptable to different offers, not tied to one specific promotion.\nOutput: the core message framework, recommended channels and what to post on each, and a suggested timeline (e.g. teaser, launch, reminder, close).",
    },
  },
};

export const SOLUTION_LIBRARY: Record<CategoryId, SolutionDefinition> = Object.fromEntries(
  Object.entries(base).map(([id, def]) => [
    id,
    {
      id: def.id,
      problemLabel: def.problemLabel,
      whyItMatters: def.whyItMatters,
      quickWinTitle: def.quickWinTitle,
      quickWinDescription: def.quickWinDescription,
      promptTemplate: def.promptTemplate,
      diagnosis: (ctx: SolutionContext) => buildDiagnosis(ctx, def.diagnosisBase),
    },
  ])
) as Record<CategoryId, SolutionDefinition>;
