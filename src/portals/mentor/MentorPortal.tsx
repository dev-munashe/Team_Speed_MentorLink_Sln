// src/portals/mentor/MentorPortal.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { MentorLayout } from './MentorLayout';
import { MentorDashboard } from './MentorDashboard';

// Import mentor-specific pages
import { MentorProfilePage } from './pages/MentorProfilePage';
import { MentorMatchesPage } from './pages/MentorMatchesPage';
import { MentorMessagesPage } from './pages/MentorMessagesPage';

export function MentorPortal() {
  return (
    <MentorLayout>
      <Routes>
        <Route index element={<MentorDashboard />} />
        <Route path="profile" element={<MentorProfilePage />} />
        <Route path="matches" element={<MentorMatchesPage />} />
        <Route path="messages" element={<MentorMessagesPage />} />
        <Route path="*" element={<Navigate to="/mentor" replace />} />
      </Routes>
    </MentorLayout>
  );
}