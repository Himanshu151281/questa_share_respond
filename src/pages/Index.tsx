
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Share, BarChart3 } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Questa</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">Welcome, {user?.name}</span>
                  <Link to="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                  <Button onClick={logout} variant="ghost">Logout</Button>
                </>
              ) : (
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Create & Share Quizzes
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Build engaging quizzes, share them with the world, and collect responses from your audience. 
            Perfect for educators, trainers, and content creators.
          </p>
          
          {isAuthenticated ? (
            <div className="mt-10">
              <Link to="/create-quiz">
                <Button size="lg" className="mr-4">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Your First Quiz
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  View Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-10">
              <Link to="/login">
                <Button size="lg">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="flex justify-center">
              <PlusCircle className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Easy Creation</h3>
            <p className="mt-2 text-gray-600">
              Create quizzes with multiple question types in minutes
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center">
              <Share className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Public Sharing</h3>
            <p className="mt-2 text-gray-600">
              Share your quizzes with anyone using a simple link
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center">
              <BarChart3 className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Track Responses</h3>
            <p className="mt-2 text-gray-600">
              View and analyze all responses to your quizzes
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
