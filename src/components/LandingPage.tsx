// src/components/LandingPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './shared/LoadingSpinner';

export function LandingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect to appropriate portal
        navigate(`/${user.role}`, { replace: true });
      } else {
        // Redirect to login
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <LoadingSpinner size="lg" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">MentorLink</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}