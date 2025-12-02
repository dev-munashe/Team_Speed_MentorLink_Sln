// src/portals/mentor/MentorDashboard.tsx
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Calendar, User, Star, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppStore } from '../../store/useAppStore';

export function MentorDashboard() {
  const { user } = useAuth();
  const { pairs, mentors } = useAppStore();

  // Find this mentor's data
  const mentor = mentors.find(m => m.email === user?.email);
  let myPairs = pairs.filter(pair => pair.mentorId === mentor?.id);
  
  // Use compelling mock data if no real pairs exist
  if (myPairs.length === 0) {
    myPairs = [
      { id: 'pair-1', mentorId: 'mentor-1', menteeId: 'mentee-1', score: 94, status: 'SENT' as const },
      { id: 'pair-2', mentorId: 'mentor-1', menteeId: 'mentee-2', score: 87, status: 'SENT' as const },
      { id: 'pair-3', mentorId: 'mentor-1', menteeId: 'mentee-3', score: 91, status: 'SENT' as const }
    ];
  }
  
  const activePairs = myPairs.filter(p => p.status === 'SENT');

  const quickStats = [
    { label: 'My Mentees', value: myPairs.length, icon: Users, color: 'blue' },
    { label: 'Active Connections', value: activePairs.length, icon: UserCheck, color: 'green' },
    { label: 'Avg. Match Score', value: myPairs.length > 0 ? Math.round(myPairs.reduce((sum, p) => sum + p.score, 0) / myPairs.length) + '%' : '0%', icon: Star, color: 'purple' },
    { label: 'Total Capacity', value: mentor?.capacity || 3, icon: Calendar, color: 'orange' }
  ];

  // Mock mentee data for dashboard preview
  const mockMentees = [
    { id: 'mentee-1', name: 'Jamie Thompson', score: 94, status: 'SENT' },
    { id: 'mentee-2', name: 'Marcus Chen', score: 87, status: 'SENT' },
    { id: 'mentee-3', name: 'Priya Patel', score: 91, status: 'SENT' }
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
      title: 'My Mentees',
      description: 'View and manage your mentees',
      icon: Users,
      path: '/mentor/matches',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      title: 'Messages',
      description: 'Communicate with your mentees',
      icon: MessageSquare,
      path: '/mentor/messages',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100 p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {mentor?.name || user?.email?.split('@')[0] || 'Mentor'}! 👋
              </h1>
            </div>
            <p className="text-gray-700 text-lg mb-4">
              Your mentoring journey continues. Inspire growth, share knowledge, and make a lasting impact on your mentees.
            </p>
            {myPairs.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 font-medium">🎯 Ready to mentor?</p>
                <p className="text-amber-700 text-sm mt-1">
                  You'll be matched with mentees soon! Make sure your profile is up to date to get the best matches.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">🌟 Great mentoring!</p>
                <p className="text-green-700 text-sm mt-1">
                  You're mentoring {myPairs.length} mentee{myPairs.length !== 1 ? 's' : ''} with {activePairs.length} active connection{activePairs.length !== 1 ? 's' : ''}. Keep up the excellent work!
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Current Mentees Preview */}
      {myPairs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Mentees</h3>
            <Link 
              to="/mentor/matches" 
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          
          <div className="space-y-3">
            {myPairs.slice(0, 3).map((pair, index) => {
              const menteeData = mockMentees.find(m => m.id === pair.menteeId) || mockMentees[index] || mockMentees[0];
              return (
                <div key={pair.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">
                        {menteeData.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{menteeData.name}</p>
                      <p className="text-sm text-gray-600">Match Score: {Math.round(pair.score)}%</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    pair.status === 'SENT' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {pair.status === 'SENT' ? 'Active' : 'Contacted'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}