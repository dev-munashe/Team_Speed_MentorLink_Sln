// src/portals/mentee/MenteeDashboard.tsx
import { Link } from 'react-router-dom';
import { User, MessageSquare, Search, Target, BookOpen } from 'lucide-react';

export function MenteeDashboard() {
  const quickStats = [
    { label: 'Current Mentor', value: '1', icon: User, color: 'blue' },
    { label: 'Messages', value: '8', icon: MessageSquare, color: 'green' },
    { label: 'Goals Completed', value: '3/5', icon: Target, color: 'purple' },
    { label: 'Learning Hours', value: '12', icon: BookOpen, color: 'orange' }
  ];

  const quickActions = [
    {
      title: 'Update Profile',
      description: 'Keep your goals and interests up to date',
      icon: User,
      path: '/mentee/profile',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Browse Mentors',
      description: 'Explore available mentors in your field',
      icon: Search,
      path: '/mentee/browse',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      title: 'My Mentor',
      description: 'Connect with your assigned mentor',
      icon: User,
      path: '/mentee/mentor',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      title: 'Messages',
      description: 'Chat with your mentor and ask questions',
      icon: MessageSquare,
      path: '/mentee/messages',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Welcome to Your Learning Journey
        </h2>
        <p className="text-gray-600">
          Connect with mentors, achieve your goals, and accelerate your growth.
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

      {/* Current Goals */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Learning Goals</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-gray-900">Master React Fundamentals</span>
            </div>
            <span className="text-sm text-green-700 font-medium">Completed</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-gray-900">Build Portfolio Website</span>
            </div>
            <span className="text-sm text-green-700 font-medium">Completed</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-900">Learn TypeScript</span>
            </div>
            <span className="text-sm text-blue-700 font-medium">In Progress</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600">Deploy to Production</span>
            </div>
            <span className="text-sm text-gray-500 font-medium">Pending</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600">Land First Developer Job</span>
            </div>
            <span className="text-sm text-gray-500 font-medium">Pending</span>
          </div>
        </div>
      </div>

      {/* Mentor Connection */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Mentor</h3>
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
              TM
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Tendai Moyo</h4>
              <p className="text-sm text-gray-600">Senior Software Engineer • 8 years experience</p>
              <p className="text-xs text-gray-500">Specializes in React, TypeScript, System Design</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/mentee/messages"
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors text-sm"
            >
              Send Message
            </Link>
            <Link
              to="/mentee/mentor"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}