"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent,  CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AppSidebar } from '@/components/Dashboard/AppSidebar';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { SidebarProvider,} from '@/components/ui/sidebar';
import Edit from '@/components/CreateQuiz/Edit';

const QuizSidebar = () => {
  const params = useParams();
  const quizId = params?.id as string;
  return <AppSidebar activeQuizId={quizId} />;
};

export default function QuizPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        if (!id || !token) {
          setLoading(false);
          return;
        }
        const response = await axios.get(`https://quizo-orpin.vercel.app/api/quiz/${id}`, {
          headers: {
            Authorization: `${token}`
          }
        });
        setQuiz(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch quiz details:", err);
        setError("Failed to load quiz details. Please try again later.");
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id, token]);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <SidebarProvider>
            <QuizSidebar />
            <div className="flex-1 overflow-y-auto">
            <div className="p-6">
                {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
                ) : error ? (
                <Card className="bg-red-50">
                    <CardHeader>
                      <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{error}</p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
                    </CardFooter>
                </Card>
                ) : quiz ? (
                    <Edit qid={id}/>
                ) : (
                <Card>
                    <CardHeader>
                      <CardTitle>Quiz Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>The requested quiz could not be found.</p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
                    </CardFooter>
                </Card>
                )}
            </div>
            </div>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
}