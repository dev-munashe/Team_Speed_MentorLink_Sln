// src/portals/admin/AdminNavbar.tsx
import { useLocation, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../../components/shared/Avatar';
import classNames from 'classnames';

export function AdminNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', exact: true },
    { path: '/admin/upload', label: 'Upload' },
    { path: '/admin/matching', label: 'Matching' },
    { path: '/admin/messages', label: 'Messages' },
    { path: '/admin/pairs', label: 'Pairs' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Nav Items */}
          <div className="flex items-center space-x-8">
            <Link to="/admin" className="text-xl font-bold text-gray-900">
              MentorLink Admin
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={classNames(
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive(item.path, item.exact)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar name="Administrator" size="sm" />
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-900">Administrator</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
              title="Sign out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex flex-wrap gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={classNames(
                  'px-3 py-2 text-xs font-medium rounded-md transition-colors',
                  isActive(item.path, item.exact)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}