// src/portals/admin/AdminDashboard.tsx
import { Link } from 'react-router-dom';
import { Upload, Users, MessageSquare, Settings, UserCheck, Trash2, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export function AdminDashboard() {
  const { mentors, mentees, pairs, resetAll } = useAppStore();
  const { user } = useAuth();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetAll();
    setShowResetConfirm(false);
  };

  const quickStats = [
    { label: 'Mentors', value: mentors.length, icon: Users, color: 'blue' },
    { label: 'Mentees', value: mentees.length, icon: Users, color: 'green' },
    { label: 'Active Pairs', value: pairs.length, icon: MessageSquare, color: 'purple' },
    { label: 'Connected', value: pairs.filter(p => p.status === 'SENT').length, icon: UserCheck, color: 'orange' }
  ];

  const quickActions = [
    {
      title: 'Upload CSV Data',
      description: 'Import mentors and mentees from CSV files',
      icon: Upload,
      path: '/admin/upload',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Run Matching',
      description: 'Generate mentor-mentee pairings using AI algorithm',
      icon: Settings,
      path: '/admin/matching',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      title: 'Manage Pairs',
      description: 'View and modify existing mentor-mentee pairings',
      icon: UserCheck,
      path: '/admin/pairs',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      title: 'Send Messages',
      description: 'Manage communication templates and outreach',
      icon: MessageSquare,
      path: '/admin/messages',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header with Reset Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        {(mentors.length > 0 || mentees.length > 0 || pairs.length > 0) && (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="font-medium">Clear All Data</span>
          </button>
        )}
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Clear All Data?
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              This will permanently delete all mentors, mentees, pairs, messages, and settings. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.profileId ? 'Administrator' : 'Admin'}! 👋
              </h1>
            </div>
            <p className="text-gray-700 text-lg mb-4">
              Your mentorship program is making connections that matter. Here's your command center to nurture those relationships.
            </p>
            {pairs.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 font-medium">🚀 Ready to get started?</p>
                <p className="text-amber-700 text-sm mt-1">
                  Upload your mentor and mentee data, then run the matching algorithm to create your first connections!
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">✨ Great work!</p>
                <p className="text-green-700 text-sm mt-1">
                  You have {pairs.length} active pairing{pairs.length !== 1 ? 's' : ''} with {pairs.filter(p => p.status === 'SENT').length} successfully connected. Keep the momentum going!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                className={`block p-6 rounded-xl border-2 transition-all hover:shadow-md ${action.color}`}
              >
                <div className="flex items-center mb-3">
                  <IconComponent className="h-8 w-8 mr-3" />
                  <h4 className="font-semibold">{action.title}</h4>
                </div>
                <p className="text-sm opacity-80">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {pairs.length > 0 ? (
          <div className="space-y-3">
            {pairs.slice(0, 5).map((pair) => {
              const mentor = mentors.find(m => m.id === pair.mentorId);
              const mentee = mentees.find(m => m.id === pair.menteeId);
              return (
                <div key={pair.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      New match: {mentor?.name || 'Unknown'} ↔ {mentee?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Match score: {Math.round(pair.score)}% • Status: {pair.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600">No recent activity. Start by uploading some data!</p>
        )}
      </div>
    </div>
  );
}