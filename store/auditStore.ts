import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AIUsageAnswers,
  BusinessAnswers,
  ContentAnswers,
  LeadFormData,
  ProblemsAnswers,
  TimeValueChoice,
  UserType,
} from "@/lib/types";

interface AuditState {
  step: number;
  userType?: UserType;
  content: Partial<ContentAnswers>;
  business: Partial<BusinessAnswers>;
  problems: Partial<ProblemsAnswers>;
  aiUsage: Partial<AIUsageAnswers>;
  timeValue?: TimeValueChoice;
  lead: Partial<LeadFormData>;

  setStep: (step: number) => void;
  next: () => void;
  back: () => void;
  setUserType: (t: UserType) => void;
  updateContent: (patch: Partial<ContentAnswers>) => void;
  updateBusiness: (patch: Partial<BusinessAnswers>) => void;
  updateProblems: (patch: Partial<ProblemsAnswers>) => void;
  updateAIUsage: (patch: Partial<AIUsageAnswers>) => void;
  setTimeValue: (v: TimeValueChoice) => void;
  updateLead: (patch: Partial<LeadFormData>) => void;
  reset: () => void;
}

const initialState = {
  step: 0,
  userType: undefined,
  content: {},
  business: {},
  problems: {},
  aiUsage: {},
  timeValue: undefined,
  lead: { dataConsent: false, marketingConsent: false },
};

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ step }),
      next: () => set((s) => ({ step: s.step + 1 })),
      back: () => set((s) => ({ step: Math.max(0, s.step - 1) })),

      setUserType: (userType) => set({ userType }),
      updateContent: (patch) =>
        set((s) => ({ content: { ...s.content, ...patch } })),
      updateBusiness: (patch) =>
        set((s) => ({ business: { ...s.business, ...patch } })),
      updateProblems: (patch) =>
        set((s) => ({ problems: { ...s.problems, ...patch } })),
      updateAIUsage: (patch) =>
        set((s) => ({ aiUsage: { ...s.aiUsage, ...patch } })),
      setTimeValue: (timeValue) => set({ timeValue }),
      updateLead: (patch) => set((s) => ({ lead: { ...s.lead, ...patch } })),

      reset: () => set(initialState),
    }),
    { name: "audit-progress" }
  )
);
