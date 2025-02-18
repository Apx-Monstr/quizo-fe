// src/components/ProtectedRoute.js
"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if auth context is fully initialized
    if (initialized && !isAuthenticated()) {
      router.push('/');
    }
  }, [isAuthenticated, router, initialized]);

  // Show loading state while initializing
  if (!initialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Initializing...</h2>
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  return children;
};

export default ProtectedRoute;