import { EXAM_DURATION_SECONDS, QUESTIONS } from "@/data/questions";

const KEY = "ascend2k26_exam_state_v1";

export type ExamState = {
  startedAt: number; // epoch ms
  answers: Record<number, number>; // qIndex -> optionIndex
  marked: Record<number, boolean>;
  visited: Record<number, boolean>;
  current: number;
  violations: number;
  submitted: boolean;
  submittedAt?: number;
  studentName?: string;
  year?: string;
  branch?: string;
  rollNumber?: string;
};

export function loadState(): ExamState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ExamState;
  } catch {
    return null;
  }
}

export function saveState(s: ExamState) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearState() {
  localStorage.removeItem(KEY);
}

export function newState(info?: {
  name?: string;
  year?: string;
  branch?: string;
  rollNumber?: string;
}): ExamState {
  return {
    startedAt: Date.now(),
    answers: {},
    marked: {},
    visited: { 0: true },
    current: 0,
    violations: 0,
    submitted: false,
    studentName: info?.name,
    year: info?.year,
    branch: info?.branch,
    rollNumber: info?.rollNumber,
  };
}

export function timeRemaining(s: ExamState): number {
  const elapsed = Math.floor((Date.now() - s.startedAt) / 1000);
  return Math.max(0, EXAM_DURATION_SECONDS - elapsed);
}

export function calculateScore(s: ExamState) {
  let correct = 0;
  let wrong = 0;
  let attempted = 0;
  QUESTIONS.forEach((q, i) => {
    const a = s.answers[i];
    if (a === undefined) return;
    attempted++;
    if (a === q.correct) correct++;
    else wrong++;
  });
  const total = QUESTIONS.length;
  const score = correct;
  const percentage = (correct / total) * 100;
  return { correct, wrong, attempted, total, score, percentage };
}