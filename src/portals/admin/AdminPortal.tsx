// src/portals/admin/AdminPortal.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';

// Import admin-specific pages
import { AdminUploadPage } from './pages/AdminUploadPage';
import { AdminMatchingPage } from './pages/AdminMatchingPage';
import { AdminPairsPage } from './pages/AdminPairsPage';
import { AdminMessagesPage } from './pages/AdminMessagesPage';

export function AdminPortal() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="upload" element={<AdminUploadPage />} />
        <Route path="matching" element={<AdminMatchingPage />} />
        <Route path="pairs" element={<AdminPairsPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}