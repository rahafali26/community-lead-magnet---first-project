import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AIUsageAnswers,
  ContentVolumeAnswers,
  LeadFormData,
  PainPointsAnswers,
  TimeBreakdownAnswers,
  TimeValueAnswers,
  UserType,
} from "@/lib/types";

interface AuditState {
  step: number; // 0-based index into AUDIT_STEPS; 7 means "on the Lead Capture screen"
  userType?: UserType;
  contentVolume: Partial<ContentVolumeAnswers>;
  timeBreakdown: Partial<TimeBreakdownAnswers>;
  painPoints: Partial<PainPointsAnswers>;
  vanishTask: string;
  aiUsage: Partial<AIUsageAnswers>;
  timeValue: Partial<TimeValueAnswers>;
  lead: Partial<LeadFormData>;

  next: () => void;
  back: () => void;
  setUserType: (t: UserType) => void;
  updateContentVolume: (patch: Partial<ContentVolumeAnswers>) => void;
  updateTimeBreakdown: (patch: Partial<TimeBreakdownAnswers>) => void;
  updatePainPoints: (patch: Partial<PainPointsAnswers>) => void;
  setVanishTask: (text: string) => void;
  updateAIUsage: (patch: Partial<AIUsageAnswers>) => void;
  updateTimeValue: (patch: Partial<TimeValueAnswers>) => void;
  updateLead: (patch: Partial<LeadFormData>) => void;
  reset: () => void;
}

const initialState = {
  step: 0,
  userType: undefined,
  contentVolume: {},
  timeBreakdown: {},
  painPoints: { selected: [] },
  vanishTask: "",
  aiUsage: { areas: [] },
  timeValue: {},
  lead: { marketingConsent: false },
};

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      ...initialState,

      next: () => set((s) => ({ step: s.step + 1 })),
      back: () => set((s) => ({ step: Math.max(0, s.step - 1) })),

      setUserType: (userType) => set({ userType }),
      updateContentVolume: (patch) =>
        set((s) => ({ contentVolume: { ...s.contentVolume, ...patch } })),
      updateTimeBreakdown: (patch) =>
        set((s) => ({ timeBreakdown: { ...s.timeBreakdown, ...patch } })),
      updatePainPoints: (patch) => set((s) => ({ painPoints: { ...s.painPoints, ...patch } })),
      setVanishTask: (vanishTask) => set({ vanishTask }),
      updateAIUsage: (patch) => set((s) => ({ aiUsage: { ...s.aiUsage, ...patch } })),
      updateTimeValue: (patch) => set((s) => ({ timeValue: { ...s.timeValue, ...patch } })),
      updateLead: (patch) => set((s) => ({ lead: { ...s.lead, ...patch } })),

      reset: () => set(initialState),
    }),
    { name: "audit-progress-v2" }
  )
);
