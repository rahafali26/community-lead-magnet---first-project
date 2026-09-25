/**
 * Exactly 7 fixed analysis questions. The business task section inside Question 3 and every
 * inline "Other" field are conditional CONTENT within a step, not additional steps — the
 * progress indicator always shows out of 7. Lead Capture happens after Question 7 and is a
 * separate screen, not part of this list (it never shows "8 of 7").
 */
export const AUDIT_STEPS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"] as const;

export type AuditStepId = (typeof AUDIT_STEPS)[number];

export const TOTAL_AUDIT_QUESTIONS = AUDIT_STEPS.length;
