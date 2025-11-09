// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { LandingPage } from './components/LandingPage';
import { AdminRoute, MentorRoute, MenteeRoute } from './components/auth';

// Portal imports
import { AdminPortal } from './portals/admin/AdminPortal';
import { MentorPortal } from './portals/mentor/MentorPortal';
import { MenteePortal } from './portals/mentee/MenteePortal';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />

          {/* Protected Portal Routes */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminPortal />
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/mentor/*" 
            element={
              <MentorRoute>
                <MentorPortal />
              </MentorRoute>
            } 
          />
          
          <Route 
            path="/mentee/*" 
            element={
              <MenteeRoute>
                <MenteePortal />
              </MenteeRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
