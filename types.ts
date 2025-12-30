export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  PRO = 'Pro'
}

export interface Exercise {
  id: string;
  question: string;
  expectedCommand?: string; // For terminal checks
  hint: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown-like string
  rhelNotes: string; // Specific RHEL9 tips (SELinux, Firewalld, DNF)
  exercises: Exercise[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  lessons: Lesson[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}