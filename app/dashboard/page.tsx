"use client"
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/Dashboard/AppSidebar';
import { SidebarProvider, } from '@/components/ui/sidebar';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <SidebarProvider>
            <AppSidebar/>
            <div className="flex-1 overflow-y-auto">
            <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <div className="flex items-center space-x-4">
                <span className="text-gray-600">{currentUser?.fname}</span>
                <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Welcome to Your Quiz Dashboard</h2>
                <p className="text-gray-600">
                    You can explore your quizzes using the sidebar navigation. Click on a quiz to view its details.
                </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
                    <p className="text-gray-500">No recent activity</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-2">Progress</h3>
                    <p className="text-gray-500">No progress data available</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-2">Upcoming</h3>
                    <p className="text-gray-500">No upcoming quizzes</p>
                </div>
                </div>
            </div>
            </div>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
}