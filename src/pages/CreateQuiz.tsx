
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { saveQuiz } from '@/utils/storage';
import { Quiz, Question } from '@/types/quiz';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

const CreateQuiz = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [quizData, setQuizData] = useState({
    title: '',
    description: ''
  });
  
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', type: 'single-choice', question: '', options: ['', ''] },
    { id: '2', type: 'text', question: '' }
  ]);

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const addQuestion = (type: 'single-choice' | 'text') => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: '',
      ...(type === 'single-choice' && { options: ['', ''] })
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: string, value: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? {
        ...q,
        options: q.options?.map((opt, idx) => idx === optionIndex ? value : opt)
      } : q
    ));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? {
        ...q,
        options: [...(q.options || []), '']
      } : q
    ));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? {
        ...q,
        options: q.options?.filter((_, idx) => idx !== optionIndex)
      } : q
    ));
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quizData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz title",
        variant: "destructive"
      });
      return;
    }

    const validQuestions = questions.filter(q => {
      if (!q.question.trim()) return false;
      if (q.type === 'single-choice') {
        return q.options && q.options.filter(opt => opt.trim()).length >= 2;
      }
      return true;
    });

    if (validQuestions.length < 2) {
      toast({
        title: "Error",
        description: "Please add at least 2 valid questions",
        variant: "destructive"
      });
      return;
    }

    const quiz: Quiz = {
      id: Date.now().toString(),
      title: quizData.title,
      description: quizData.description,
      questions: validQuestions,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      isPublic: true
    };

    saveQuiz(quiz);
    
    toast({
      title: "Success!",
      description: "Quiz create successfully"
    });

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-indigo-600">Questa</Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
          <p className="text-gray-600 mt-2">Build an engaging quiz to share with your audience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Quiz Title *</Label>
                <Input
                  id="title"
                  value={quizData.title}
                  onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={quizData.description}
                  onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                  placeholder="Brief description of your quiz"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Questions</h2>
              <div className="space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addQuestion('single-choice')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Single Choice
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addQuestion('text')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Text Answer
                </Button>
              </div>
            </div>

            {questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                      disabled={questions.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    Type: {question.type === 'single-choice' ? 'Single Choice' : 'Text Answer'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Question Text *</Label>
                    <Input
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      placeholder="Enter your question"
                      required
                    />
                  </div>

                  {question.type === 'single-choice' && question.options && (
                    <div>
                      <Label>Answer Options *</Label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              required
                            />
                            {question.options && question.options.length > 2 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeOption(question.id, optionIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(question.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <Link to="/dashboard">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">Create Quiz</Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateQuiz;
