// src/portals/mentee/MenteeLayout.tsx
import { useAuth } from '../../contexts/AuthContext';
import { MenteeNavbar } from './MenteeNavbar';

interface MenteeLayoutProps {
  children: React.ReactNode;
}

export function MenteeLayout({ children }: MenteeLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <MenteeNavbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Mentee Portal
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.email ? user.email.split('@')[0] : 'Mentee'}
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}