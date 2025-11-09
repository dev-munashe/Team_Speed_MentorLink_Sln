// src/portals/mentee/MenteePortal.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { MenteeLayout } from './MenteeLayout';
import { MenteeDashboard } from './MenteeDashboard';

export function MenteePortal() {
  return (
    <MenteeLayout>
      <Routes>
        <Route index element={<MenteeDashboard />} />
        <Route path="profile" element={<div className="p-8">Profile Page (Coming Soon)</div>} />
        <Route path="browse" element={<div className="p-8">Browse Mentors (Coming Soon)</div>} />
        <Route path="mentor" element={<div className="p-8">My Mentor (Coming Soon)</div>} />
        <Route path="messages" element={<div className="p-8">Messages (Coming Soon)</div>} />
        <Route path="*" element={<Navigate to="/mentee" replace />} />
      </Routes>
    </MenteeLayout>
  );
}