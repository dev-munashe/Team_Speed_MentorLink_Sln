// src/portals/mentee/MenteePortal.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { MenteeLayout } from './MenteeLayout';
import { MenteeDashboard } from './MenteeDashboard';
import { MenteeProfilePage } from './pages/MenteeProfilePage';
import { MyMentorPage } from './pages/MyMentorPage';
import { MenteeMessagesPage } from './pages/MenteeMessagesPage';

export function MenteePortal() {
  return (
    <MenteeLayout>
      <Routes>
        <Route index element={<MenteeDashboard />} />
        <Route path="profile" element={<MenteeProfilePage />} />
        <Route path="mentor" element={<MyMentorPage />} />
        <Route path="messages" element={<MenteeMessagesPage />} />
        <Route path="*" element={<Navigate to="/mentee" replace />} />
      </Routes>
    </MenteeLayout>
  );
}