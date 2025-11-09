// src/portals/mentor/MentorPortal.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { MentorLayout } from './MentorLayout';
import { MentorDashboard } from './MentorDashboard';

export function MentorPortal() {
  return (
    <MentorLayout>
      <Routes>
        <Route index element={<MentorDashboard />} />
        <Route path="profile" element={<div className="p-8">Profile Page (Coming Soon)</div>} />
        <Route path="mentees" element={<div className="p-8">My Mentees (Coming Soon)</div>} />
        <Route path="messages" element={<div className="p-8">Messages (Coming Soon)</div>} />
        <Route path="availability" element={<div className="p-8">Availability (Coming Soon)</div>} />
        <Route path="*" element={<Navigate to="/mentor" replace />} />
      </Routes>
    </MentorLayout>
  );
}