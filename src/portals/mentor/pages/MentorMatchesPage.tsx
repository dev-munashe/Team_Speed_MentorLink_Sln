// src/portals/mentor/pages/MentorMatchesPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppStore } from '../../../store/useAppStore';
import { Users, MessageSquare, Calendar, Mail, Phone, Star, ChevronDown, ChevronUp, X, Clock, CheckCircle } from 'lucide-react';

export function MentorMatchesPage() {
  const { user } = useAuth();
  const { pairs, mentees, mentors } = useAppStore();
  const navigate = useNavigate();
  
  // State to track which mentee cards are expanded
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  
  // State for scheduling modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedMenteeForScheduling, setSelectedMenteeForScheduling] = useState<any>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [scheduleConfirmed, setScheduleConfirmed] = useState(false);
  const [scheduledSessions, setScheduledSessions] = useState<Record<string, string>>({});

  // Toggle card expansion
  const toggleCard = (pairId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pairId)) {
        newSet.delete(pairId);
      } else {
        newSet.add(pairId);
      }
      return newSet;
    });
  };

  // Navigate to messages with specific conversation selected
  const openConversation = (pairId: string) => {
    // Navigate to messages page and pass the pair ID as state
    navigate('/mentor/messages', { state: { selectedPairId: pairId } });
  };

  // Open scheduling modal
  const openScheduleModal = (pair: any) => {
    const mentee = getMenteeData(pair.menteeId);
    setSelectedMenteeForScheduling({ ...mentee, pairId: pair.id });
    setScheduleModalOpen(true);
    setScheduleConfirmed(false);
    setSelectedTimeSlot('');
  };

  // Close scheduling modal
  const closeScheduleModal = () => {
    setScheduleModalOpen(false);
    setSelectedMenteeForScheduling(null);
    setSelectedTimeSlot('');
    setScheduleConfirmed(false);
  };

  // Confirm scheduling
  const confirmSchedule = () => {
    if (!selectedTimeSlot || !selectedMenteeForScheduling) return;
    setScheduleConfirmed(true);
    setTimeout(() => {
      setScheduledSessions(prev => ({
        ...prev,
        [selectedMenteeForScheduling.pairId]: selectedTimeSlot
      }));
      closeScheduleModal();
    }, 2000);
  };

  // Mock available time slots (combination of mentor and mentee availability)
  const getAvailableSlots = () => {
    // Find overlapping time slots (simplified mock logic)
    const overlappingSlots = [
      'Mon 19:00-20:00',
      'Wed 18:00-19:00', 
      'Thu 17:00-18:00',
      'Fri 16:00-17:00',
      'Sat 14:00-15:00'
    ];
    
    return overlappingSlots;
  };

  // Find this mentor's pairs
  const mentor = mentors.find(m => m.email === user?.email);
  let myPairs = pairs.filter(pair => pair.mentorId === mentor?.id);

  // If no real data, create compelling mock data for demonstration
  if (myPairs.length === 0) {
    myPairs = [
      {
        id: 'pair-1',
        mentorId: 'mentor-1',
        menteeId: 'mentee-1',
        score: 94,
        status: 'SENT' as const
      },
      {
        id: 'pair-2', 
        mentorId: 'mentor-1',
        menteeId: 'mentee-2',
        score: 87,
        status: 'SENT' as const
      },
      {
        id: 'pair-3',
        mentorId: 'mentor-1', 
        menteeId: 'mentee-3',
        score: 91,
        status: 'SENT' as const
      }
    ];
  }

  // Mock mentee data for demonstration
  const mockMentees = [
    {
      id: 'mentee-1',
      name: 'Kudzai Chigwedere',
      email: 'kudzai.c@uncommon.org',
      phone: '+263 77 234 5678',
      program_track: 'Computer Science - Final Year',
      goals: ['Land tech role', 'Master system design', 'Build impressive portfolio'],
      interests: ['Machine Learning', 'Web Development', 'Startup Culture'],
      preferred_skills: ['React', 'Python', 'AWS', 'Data Structures', 'Algorithms'],
      availability_slots: ['Mon 19:00-21:00', 'Wed 18:00-20:00']
    },
    {
      id: 'mentee-2',
      name: 'Panashe Mandaza',
      email: 'panashe.m@uncommon.org',
      phone: '+263 77 345 6789', 
      program_track: 'Full-Stack Development',
      goals: ['Career transition', 'Build production apps', 'Network in tech'],
      interests: ['Frontend Development', 'UX Design', 'Fintech'],
      preferred_skills: ['JavaScript', 'React', 'Node.js', 'Database Design'],
      availability_slots: ['Tue 18:00-20:00', 'Thu 17:00-19:00', 'Sat 14:00-16:00']
    },
    {
      id: 'mentee-3',
      name: 'Tinotenda Sibanda',
      email: 'tino.s@uncommon.org',
      phone: '+263 77 456 7890',
      program_track: 'Junior Developer Program',
      goals: ['Advance to senior role', 'Lead technical projects', 'Improve communication'],
      interests: ['Backend Architecture', 'Team Leadership', 'Open Source'],
      preferred_skills: ['TypeScript', 'System Design', 'Microservices', 'Leadership'],
      availability_slots: ['Mon 17:00-19:00', 'Fri 16:00-18:00']
    }
  ];

  const getMenteeData = (menteeId: string) => {
    // First try to find real mentee data
    const realMentee = mentees.find(m => m.id === menteeId);
    if (realMentee) return realMentee;
    
    // Fall back to mock data
    return mockMentees.find(m => m.id === menteeId) || mockMentees[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT':
        return 'bg-green-100 text-green-800';
      case 'NOT_SENT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Mentees</h1>
            <p className="text-gray-700">
              Manage your mentoring relationships and track progress
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{myPairs.length}</div>
              <div className="text-sm text-gray-600 font-medium">Active Mentees</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Mentees</p>
              <p className="text-xl font-bold text-gray-900">{myPairs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Connections</p>
              <p className="text-xl font-bold text-gray-900">
                {myPairs.filter(p => p.status === 'SENT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Match Score</p>
              <p className="text-xl font-bold text-gray-900">
                {myPairs.length > 0 ? Math.round(myPairs.reduce((sum, p) => sum + p.score, 0) / myPairs.length) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mentees List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Mentees</h2>
        </div>

        {myPairs.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No mentees yet</h3>
            <p className="text-gray-600">
              Once you're matched with mentees, they will appear here. Check back soon!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {myPairs.map((pair) => {
              const mentee = getMenteeData(pair.menteeId);
              if (!mentee) return null;

              const isExpanded = expandedCards.has(pair.id);

              return (
                <div key={pair.id} className="p-6 hover:bg-gray-50 transition-colors">
                  {/* Always visible header */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{mentee.name}</h3>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(pair.status)}`}>
                          {pair.status === 'SENT' ? 'Active' : 'Pending Contact'}
                        </span>
                      </div>

                      {/* Essential info always visible */}
                      <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 shrink-0" />
                          <span className="break-all">{mentee.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 shrink-0" />
                          <span>Match Score: {pair.score}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle button and actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCard(pair.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => openConversation(pair.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <MessageSquare size={16} />
                          <span className="hidden sm:inline">Message</span>
                        </button>
                        {scheduledSessions[pair.id] ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg">
                              <Calendar size={16} />
                              <span className="font-medium text-sm">{scheduledSessions[pair.id]}</span>
                            </div>
                            <button 
                              onClick={() => openScheduleModal(pair)}
                              className="p-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Reschedule session"
                            >
                              <Clock size={16} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => openScheduleModal(pair)}
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Calendar size={16} />
                            <span className="hidden sm:inline">Schedule</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                      {/* Additional contact info */}
                      <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                        {mentee.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 shrink-0" />
                            <span>{mentee.phone}</span>
                          </div>
                        )}
                        {mentee.program_track && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>{mentee.program_track}</span>
                          </div>
                        )}
                      </div>

                      {/* Goals */}
                      {mentee.goals && mentee.goals.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Goals:</p>
                          <div className="flex flex-wrap gap-1">
                            {mentee.goals.map((goal, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                              >
                                {goal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interests */}
                      {mentee.interests && mentee.interests.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Interests:</p>
                          <div className="flex flex-wrap gap-1">
                            {mentee.interests.map((interest, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {mentee.preferred_skills && mentee.preferred_skills.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Wants to learn:</p>
                          <div className="flex flex-wrap gap-1">
                            {mentee.preferred_skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Availability */}
                      {mentee.availability_slots && mentee.availability_slots.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Available times:</p>
                          <div className="flex flex-wrap gap-1">
                            {mentee.availability_slots.map((slot, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Scheduling Modal */}
      {scheduleModalOpen && selectedMenteeForScheduling && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {scheduledSessions[selectedMenteeForScheduling.pairId] ? 'Reschedule' : 'Schedule'} Session with {selectedMenteeForScheduling.name}
                </h2>
                <button
                  onClick={closeScheduleModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {scheduleConfirmed ? (
                /* Confirmation Screen */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Scheduled!</h3>
                  <p className="text-gray-600 mb-4">
                    Your mentoring session has been scheduled for {selectedTimeSlot}
                  </p>
                  <p className="text-sm text-gray-500">
                    Both you and {selectedMenteeForScheduling.name} will receive calendar invitations.
                  </p>
                </div>
              ) : (
                /* Scheduling Interface */
                <div className="space-y-6">
                  {/* Available Time Slots */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Available Time Slots</h3>
                    <div className="space-y-2">
                      {getAvailableSlots().map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedTimeSlot === slot
                              ? 'bg-blue-50 border-blue-200 text-blue-900'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span className="font-medium">{slot}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Session Details</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Duration: 60 minutes</li>
                      <li>• Format: Video call via platform link</li>
                      <li>• Preparation: Review mentee's goals beforehand</li>
                      <li>• Follow-up: Send summary and next steps</li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={closeScheduleModal}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmSchedule}
                      disabled={!selectedTimeSlot}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                        selectedTimeSlot
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Schedule Session
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