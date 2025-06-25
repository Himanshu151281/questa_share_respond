
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { getUserQuizzes, getResponsesForQuiz } from '@/utils/storage';
import { Quiz } from '@/types/quiz';
import { PlusCircle, Eye, BarChart3, Share, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      const userQuizzes = getUserQuizzes(user.id);
      setQuizzes(userQuizzes);
    }
  }, [user, isAuthenticated, navigate]);

  const copyQuizLink = (quizId: string) => {
    const url = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(url);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">Questa</Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <Button onClick={logout} variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
            <p className="text-gray-600 mt-2">Create and manage your quizzes</p>
          </div>
          <Link to="/create-quiz">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Quiz
            </Button>
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 mb-4">
                <PlusCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold">No quizzes yet</h3>
                <p className="mt-2">Create your first quiz to get started</p>
              </div>
              <Link to="/create-quiz">
                <Button>Create Your First Quiz</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => {
              const responseCount = getResponsesForQuiz(quiz.id).length;
              return (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    {quiz.description && (
                      <CardDescription>{quiz.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 mb-4">
                      <p>{quiz.questions.length} questions</p>
                      <p>{responseCount} responses</p>
                      <p>Created {new Date(quiz.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/quiz/${quiz.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyQuizLink(quiz.id)}
                      >
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      
                      <Link to={`/quiz/${quiz.id}/responses`}>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Responses
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
