// src/portals/mentor/MentorDashboard.tsx
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Calendar, User, Star } from 'lucide-react';

export function MentorDashboard() {
  const quickStats = [
    { label: 'Active Mentees', value: '2', icon: Users, color: 'blue' },
    { label: 'Messages', value: '12', icon: MessageSquare, color: 'green' },
    { label: 'Sessions This Month', value: '8', icon: Calendar, color: 'purple' },
    { label: 'Rating', value: '4.8', icon: Star, color: 'yellow' }
  ];

  const quickActions = [
    {
      title: 'Update Profile',
      description: 'Keep your skills and availability current',
      icon: User,
      path: '/mentor/profile',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'View Mentees',
      description: 'Check progress and schedule sessions',
      icon: Users,
      path: '/mentor/mentees',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      title: 'Messages',
      description: 'Respond to mentee messages',
      icon: MessageSquare,
      path: '/mentor/messages',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      title: 'Availability',
      description: 'Manage your schedule and time slots',
      icon: Calendar,
      path: '/mentor/availability',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Welcome to Your Mentor Portal
        </h2>
        <p className="text-gray-600">
          Guide your mentees, track progress, and make meaningful connections.
        </p>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Current Mentees */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Mentees</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Jane Smith</h4>
                <p className="text-sm text-gray-600">Frontend Development • Last session: 3 days ago</p>
              </div>
            </div>
            <Link
              to="/mentor/messages"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
            >
              Message
            </Link>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Alex Johnson</h4>
                <p className="text-sm text-gray-600">Full-stack Development • Last session: 1 week ago</p>
              </div>
            </div>
            <Link
              to="/mentor/messages"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
            >
              Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}