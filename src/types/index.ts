export type EmotionalCategory =
  | "temptation"
  | "grace_after_relapse"
  | "identity"
  | "mind_renewal"
  | "discipline";

export interface NKJVVerse {
  id: string;
  reference: string;
  text: string;
  category: EmotionalCategory;
  theme: string;
  meditationPrompt: string;
}

export type AddictionTier =
  | "Level 1 — Mild Habitual Loop"
  | "Level 2 — Moderate Compulsive Dependency"
  | "Level 3 — High Neurological Dependency";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  isGuest?: boolean;
}

export type Language = "en" | "ar";
export type ThemeMode = "dark" | "light";

export interface UserProfile {
  id: string;
  displayName: string;
  onboardingCompleted: boolean;
  onboardingScore: number;
  currentAddictionIndex: number; // dynamically recalculated
  addictionTier: AddictionTier;
  goalDays: number;
  initialDopamineSensitivity: number; // e.g., 70%, 45%, 20%
  streakStartTimestamp: string;
  longestStreakDays: number;
  urgesDefeatedCount: number;
  pinCode: string | null;
  disguiseTitle: boolean;
  language?: Language;
  theme?: ThemeMode;
  createdAt: string;
}

export type LogStatus = "clean" | "urge_defeated" | "relapse";
export type TimeOfDayOption = "Morning" | "Afternoon" | "Evening" | "Late Night 11PM-3AM";

export interface DailyLog {
  id: string;
  userId: string;
  logDate: string; // YYYY-MM-DD
  status: LogStatus;
  urgeIntensity: number; // 1-10
  triggers: string[];
  timeOfDay: TimeOfDayOption;
  journalNote: string;
  createdAt: string;
}

export interface SavedVerse {
  id: string;
  userId: string;
  reference: string;
  verseText: string;
  personalReflection: string;
  createdAt: string;
}

export interface AssessmentQuestion {
  id: number;
  title: string;
  category: string;
  question: string;
  neuroInsight: string;
}

export interface Milestone {
  days: number;
  title: string;
  verse: string;
  verseText: string;
  badge: string;
  description: string;
}
