// src/portals/mentee/pages/BrowseMentorsPage.tsx
import { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { Search, Star, MapPin, Calendar, MessageSquare, Filter, User, X, Send, CheckCircle } from 'lucide-react';

export function BrowseMentorsPage() {
  const { mentors } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  
  // Connection request state
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [connectionRequests, setConnectionRequests] = useState<Set<string>>(new Set());
  const [showRequestSuccess, setShowRequestSuccess] = useState(false);
  
  // Mock additional mentors for demonstration
  const mockMentors = [
    {
      id: 'mentor-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@techcorp.com',
      role: 'Senior Software Engineer',
      org: 'TechCorp Innovation Labs',
      skills: ['React', 'TypeScript', 'System Design', 'Team Leadership'],
      location: 'San Francisco, CA',
      rating: 4.9,
      total_mentees: 12,
      experience_years: 8,
      available: true
    },
    {
      id: 'mentor-2',
      name: 'Marcus Rodriguez',
      email: 'marcus.r@startup.io',
      role: 'Principal Engineer',
      org: 'InnovateTech',
      skills: ['Python', 'Machine Learning', 'Data Architecture', 'Mentoring'],
      location: 'Austin, TX',
      rating: 4.8,
      total_mentees: 8,
      experience_years: 10,
      available: true
    },
    {
      id: 'mentor-3',
      name: 'Emily Zhang',
      email: 'emily.zhang@bigtech.com',
      role: 'Engineering Manager',
      org: 'BigTech Corp',
      skills: ['Leadership', 'Product Strategy', 'Full-Stack', 'Career Growth'],
      location: 'Seattle, WA',
      rating: 4.7,
      total_mentees: 15,
      experience_years: 12,
      available: false
    },
    {
      id: 'mentor-4',
      name: 'David Kim',
      email: 'david.kim@consulting.com',
      role: 'Tech Consultant',
      org: 'DevConsult Pro',
      skills: ['System Architecture', 'Cloud Computing', 'DevOps', 'Consulting'],
      location: 'New York, NY',
      rating: 4.6,
      total_mentees: 6,
      experience_years: 7,
      available: true
    }
  ];

  const allMentors = [...mentors, ...mockMentors];
  const allSkills = Array.from(new Set(allMentors.flatMap(mentor => mentor.skills || [])));
  
  // Filter mentors based on search and skill selection
  const filteredMentors = allMentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mentor.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mentor.org || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = !selectedSkill || mentor.skills?.includes(selectedSkill);
    
    return matchesSearch && matchesSkill;
  });

  // Open connection request modal
  const openConnectionModal = (mentor: any) => {
    setSelectedMentor(mentor);
    setConnectionMessage(`Hi ${mentor.name.split(' ')[0]},\n\nI'm interested in connecting as your mentee. I'm particularly drawn to your expertise in ${mentor.skills?.[0] || 'your field'} and would love to learn from your experience.\n\nI'm currently working on improving my skills in web development and would appreciate any guidance you could provide.\n\nThank you for considering my request!\n\nBest regards`);
    setShowConnectionModal(true);
  };

  // Close connection modal
  const closeConnectionModal = () => {
    setShowConnectionModal(false);
    setSelectedMentor(null);
    setConnectionMessage('');
  };

  // Send connection request
  const sendConnectionRequest = () => {
    if (!selectedMentor || !connectionMessage.trim()) return;
    
    console.log(`Sending connection request to ${selectedMentor.name}:`, connectionMessage);
    
    // Add to sent requests
    setConnectionRequests(prev => new Set([...prev, selectedMentor.id]));
    
    // Show success state
    setShowRequestSuccess(true);
    
    // Close modal after brief success display
    setTimeout(() => {
      setShowRequestSuccess(false);
      closeConnectionModal();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Browse Mentors</h1>
          <p className="text-gray-700">Find and connect with experienced mentors in your field</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search mentors by name, role, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Skill Filter */}
          <div className="sm:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                <option value="">All Skills</option>
                {allSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Mentors ({filteredMentors.length})
          </h2>
        </div>

        {filteredMentors.length === 0 ? (
          <div className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No mentors found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find mentors.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredMentors.map((mentor) => (
              <div key={mentor.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Mentor Header */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                        <p className="text-green-600 font-medium">{mentor.role}</p>
                        <p className="text-gray-600 text-sm">{mentor.org}</p>
                      </div>
                      {!('available' in mentor) || mentor.available ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Available
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                          Unavailable
                        </span>
                      )}
                    </div>

                    {/* Mentor Info */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{mentor.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{'experience_years' in mentor ? mentor.experience_years : '5+'} years experience</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {'rating' in mentor && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{mentor.rating} rating</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{'total_mentees' in mentor ? mentor.total_mentees : '3+'} mentees guided</span>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Expertise:</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.skills?.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {mentor.skills && mentor.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{mentor.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col gap-2">
                    {!('available' in mentor) || mentor.available ? (
                      connectionRequests.has(mentor.id) ? (
                        <button
                          disabled
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed"
                        >
                          <CheckCircle size={16} />
                          Request Sent
                        </button>
                      ) : (
                        <button
                          onClick={() => openConnectionModal(mentor)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <MessageSquare size={16} />
                          Connect
                        </button>
                      )
                    ) : (
                      <button
                        disabled
                        className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                      >
                        <MessageSquare size={16} />
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connection Request Modal */}
      {showConnectionModal && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Connect with {selectedMentor.name}
                </h2>
                <button
                  onClick={closeConnectionModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {showRequestSuccess ? (
                /* Success Screen */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Sent!</h3>
                  <p className="text-gray-600 mb-4">
                    Your connection request has been sent to {selectedMentor.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    You'll receive a notification when they respond.
                  </p>
                </div>
              ) : (
                /* Request Form */
                <div className="space-y-6">
                  {/* Mentor Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {selectedMentor.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedMentor.name}</h3>
                        <p className="text-sm text-gray-600">{selectedMentor.role}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedMentor.skills?.slice(0, 3).map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personal Message
                    </label>
                    <textarea
                      value={connectionMessage}
                      onChange={(e) => setConnectionMessage(e.target.value)}
                      placeholder="Write a personal message to introduce yourself..."
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: Mention specific skills you want to learn and why you chose this mentor
                    </p>
                  </div>

                  {/* Connection Guidelines */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Connection Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Be specific about your learning goals</li>
                      <li>• Mention relevant experience or projects</li>
                      <li>• Show enthusiasm for learning</li>
                      <li>• Be respectful of their time</li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={closeConnectionModal}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendConnectionRequest}
                      disabled={!connectionMessage.trim()}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        connectionMessage.trim()
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Send size={16} />
                      Send Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}