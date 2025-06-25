
export interface Question {
  id: string;
  type: 'single-choice' | 'text';
  question: string;
  options?: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
}

export interface QuizResponse {
  id: string;
  quizId: string;
  answers: Record<string, string>;
  submittedAt: string;
  submitterName?: string;
}
