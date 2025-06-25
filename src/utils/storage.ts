
import { Quiz, QuizResponse } from '@/types/quiz';

export const saveQuiz = (quiz: Quiz): void => {
  const quizzes = getQuizzes();
  quizzes.push(quiz);
  localStorage.setItem('questa_quizzes', JSON.stringify(quizzes));
};

export const getQuizzes = (): Quiz[] => {
  return JSON.parse(localStorage.getItem('questa_quizzes') || '[]');
};

export const getQuizById = (id: string): Quiz | null => {
  const quizzes = getQuizzes();
  return quizzes.find(quiz => quiz.id === id) || null;
};

export const getUserQuizzes = (userId: string): Quiz[] => {
  return getQuizzes().filter(quiz => quiz.createdBy === userId);
};

export const saveQuizResponse = (response: QuizResponse): void => {
  const responses = getQuizResponses();
  responses.push(response);
  localStorage.setItem('questa_responses', JSON.stringify(responses));
};

export const getQuizResponses = (): QuizResponse[] => {
  return JSON.parse(localStorage.getItem('questa_responses') || '[]');
};

export const getResponsesForQuiz = (quizId: string): QuizResponse[] => {
  return getQuizResponses().filter(response => response.quizId === quizId);
};
