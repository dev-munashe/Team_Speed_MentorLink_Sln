// src/components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import type { UserRole, Permission } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: Permission;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate portal based on user's actual role
    const redirectPath = `/${user.role}`;
    return <Navigate to={redirectPath} replace />;
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Redirect to user's portal dashboard if they don't have permission
    const redirectPath = `/${user.role}`;
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return (
    <ProtectedRoute requiredRole="admin" {...props}>
      {children}
    </ProtectedRoute>
  );
}

export function MentorRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return (
    <ProtectedRoute requiredRole="mentor" {...props}>
      {children}
    </ProtectedRoute>
  );
}

export function MenteeRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return (
    <ProtectedRoute requiredRole="mentee" {...props}>
      {children}
    </ProtectedRoute>
  );
}