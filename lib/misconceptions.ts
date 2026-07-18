export type ConfidenceLevel = "guessing" | "somewhat_sure" | "confident";

export type MisconceptionFingerprint = {
  concept: string;
  moduleId: string;
  confidence: ConfidenceLevel;
  message: string;
};
