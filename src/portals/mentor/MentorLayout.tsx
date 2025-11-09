// src/portals/mentor/MentorLayout.tsx
import { useAuth } from '../../contexts/AuthContext';
import { MentorNavbar } from './MentorNavbar';

interface MentorLayoutProps {
  children: React.ReactNode;
}

export function MentorLayout({ children }: MentorLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <MentorNavbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Mentor Portal
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.email ? user.email.split('@')[0] : 'Mentor'}
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}