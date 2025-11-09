// src/portals/mentor/MentorLayout.tsx
import { MentorNavbar } from './MentorNavbar';

interface MentorLayoutProps {
  children: React.ReactNode;
}

export function MentorLayout({ children }: MentorLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MentorNavbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}