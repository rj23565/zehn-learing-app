import type { QuizQuestion, Slide } from "@/db/curriculum";

export type Profile = {
  id: string;
  name: string;
  grade: number;
  language: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  createdAt: string;
};

export type Stats = {
  lessonsDone: number;
  gamesPlayed: number;
  uploads: number;
  bestScores: Record<string, number>;
  today: { lessons: number; games: number; diary: number; cartoons: number; xp: number };
  nextLessonId: number | null;
};

export type LessonListItem = {
  id: number;
  band: string;
  subject: string;
  level?: string;
  country?: string;
  title: string;
  icon: string;
  color: string;
  minutes: number;
  intro: string;
  completed: boolean;
  bestScore: number;
};

export type LessonFull = LessonListItem & {
  slides: Slide[];
  quiz: QuizQuestion[];
};

export type PlanStep = {
  text: string;
  icon: string;
  lessonId?: number;
  game?: string;
};

export type UploadItem = {
  id: number;
  kind: string;
  subject: string;
  imageData: string;
  plan: PlanStep[];
  doneSteps: number[];
  createdAt: string;
};

export type ProgressSubject = {
  subject: string;
  icon: string;
  color: string;
  total: number;
  completed: number;
  averageScore: number;
  mastery: number;
};

export type ProgressDifficulty = {
  level: "easy" | "normal" | "hard";
  total: number;
  completed: number;
  mastery: number;
};

export type ProgressDay = {
  date: string;
  label: string;
  lessons: number;
  games: number;
  diary: number;
  cartoons: number;
  xp: number;
  total: number;
};

export type ProgressAchievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  current: number;
  target: number;
};

export type ProgressOverview = {
  band: string;
  overview: {
    totalLessons: number;
    completedLessons: number;
    mastery: number;
    averageScore: number;
    studyMinutes: number;
    gamesPlayed: number;
    plansCreated: number;
    activeDays: number;
    consistency: number;
  };
  level: {
    current: number;
    xp: number;
    floorXp: number;
    nextXp: number;
    progress: number;
  };
  week: ProgressDay[];
  weekGoal: { current: number; target: number; progress: number };
  subjects: ProgressSubject[];
  difficulties: ProgressDifficulty[];
  achievements: ProgressAchievement[];
  strengths: string[];
  focusAreas: string[];
  recommendation: LessonListItem | null;
};

export const levelForXp = (xp: number) => Math.floor(Math.sqrt(xp / 60)) + 1;
export const xpForLevel = (level: number) => Math.pow(level - 1, 2) * 60;
