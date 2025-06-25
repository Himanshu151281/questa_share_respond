
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getQuizById, getResponsesForQuiz } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Quiz, QuizResponse } from '@/types/quiz';

const QuizResponses = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [responses, setResponses] = useState<QuizResponse[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (id) {
      const foundQuiz = getQuizById(id);
      if (foundQuiz && foundQuiz.createdBy === user.id) {
        setQuiz(foundQuiz);
        const quizResponses = getResponsesForQuiz(id);
        setResponses(quizResponses);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, user, navigate]);

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
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2">Quiz Responses</h1>
          <p className="text-gray-600">Responses for: {quiz.title}</p>
        </div>

        {responses.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No responses yet</h3>
                <p className="text-gray-600 mb-4">Share your quiz to start collecting responses!</p>
                <p className="text-sm text-gray-500">
                  Quiz URL: {window.location.origin}/quiz/{quiz.id}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Total Responses: {responses.length}
              </h2>
            </div>
            
            {responses.map((response, index) => (
              <Card key={response.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Response #{index + 1}
                  </CardTitle>
                  <CardDescription>
                    {response.submitterName && `By: ${response.submitterName} • `}
                    Submitted: {new Date(response.submittedAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quiz.questions.map((question) => (
                      <div key={question.id}>
                        <h4 className="font-medium mb-1">{question.question}</h4>
                        <p className="text-gray-700 bg-gray-50 p-2 rounded">
                          {response.answers[question.id] || 'No answer provided'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResponses;
