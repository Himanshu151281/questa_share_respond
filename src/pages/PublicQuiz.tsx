import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getQuizById, saveQuizResponse } from '@/utils/storage';
import { Quiz, QuizResponse } from '@/types/quiz';
import { toast } from 'sonner';

const PublicQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitterName, setSubmitterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundQuiz = getQuizById(id);
      if (foundQuiz && foundQuiz.isPublic) {
        setQuiz(foundQuiz);
      } else {
        navigate('/404');
      }
    }
  }, [id, navigate]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;

    setIsSubmitting(true);
    
    const response: QuizResponse = {
      id: Date.now().toString(),
      quizId: quiz.id,
      answers,
      submittedAt: new Date().toISOString(),
      submitterName: submitterName || undefined
    };

    saveQuizResponse(response);
    toast.success('Response submitted successfully!');
    
    // Redirect to dashboard after successful submission
    navigate('/dashboard');
  };

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
            {quiz.description && (
              <CardDescription>{quiz.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="submitterName">Your Name (Optional)</Label>
                <Input
                  id="submitterName"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              {quiz.questions.map((question) => (
                <div key={question.id} className="space-y-3">
                  <Label className="text-base font-semibold">
                    {question.question}
                  </Label>
                  
                  {question.type === 'single-choice' && question.options ? (
                    <div className="space-y-2">
                      {question.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${question.id}-${index}`}
                            name={question.id}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="w-4 h-4"
                          />
                          <Label htmlFor={`${question.id}-${index}`} className="font-normal">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Input
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Enter your answer"
                    />
                  )}
                </div>
              ))}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Submitting...' : 'Submit Response'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicQuiz;
