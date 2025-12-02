// src/portals/mentee/pages/MyMentorPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppStore } from '../../../store/useAppStore';
import { MessageSquare, Calendar, User, Mail, Phone, MapPin, Target, X, Clock, CheckCircle, RefreshCw, Send } from 'lucide-react';

export function MyMentorPage() {
  const { user } = useAuth();
  const { pairs, mentors } = useAppStore();
  const navigate = useNavigate();

  // State for mock scheduling functionality
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [scheduleConfirmed, setScheduleConfirmed] = useState(false);
  const [scheduledSession, setScheduledSession] = useState<string | null>(null);

  // State for mentor change functionality
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedNewMentor, setSelectedNewMentor] = useState<string>('');
  const [changeReason, setChangeReason] = useState<string>('');
  const [changeRequestSent, setChangeRequestSent] = useState(false);

  // Navigate to messages page
  const openMessages = () => {
    navigate('/mentee/messages');
  };

  // Open scheduling modal
  const openScheduleModal = () => {
    setShowScheduleModal(true);
    setScheduleConfirmed(false);
    setSelectedTimeSlot('');
  };

  // Close scheduling modal
  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedTimeSlot('');
    setScheduleConfirmed(false);
  };

  // Confirm scheduling
  const confirmSchedule = () => {
    if (!selectedTimeSlot) return;
    setScheduleConfirmed(true);
    setTimeout(() => {
      setScheduledSession(selectedTimeSlot);
      closeScheduleModal();
    }, 2000);
  };

  // Open mentor change modal
  const openChangeModal = () => {
    setShowChangeModal(true);
    setChangeRequestSent(false);
    setSelectedNewMentor('');
    setChangeReason('');
  };

  // Close mentor change modal
  const closeChangeModal = () => {
    setShowChangeModal(false);
    setSelectedNewMentor('');
    setChangeReason('');
    setChangeRequestSent(false);
  };

  // Submit mentor change request
  const submitChangeRequest = () => {
    if (!selectedNewMentor || !changeReason.trim()) return;
    setChangeRequestSent(true);
    setTimeout(() => {
      closeChangeModal();
    }, 2000);
  };

  // Mock available time slots
  const getAvailableSlots = () => {
    return [
      'Mon 18:00-19:00',
      'Wed 17:00-18:00', 
      'Thu 16:00-17:00',
      'Fri 15:00-16:00',
      'Sat 14:00-15:00'
    ];
  };

  // Mock available mentors for change request
  const getAvailableMentors = () => {
    return [
      { id: 'mentor-2', name: 'Chipo Ncube', role: 'Tech Lead', org: 'Cassava Smartech', skills: ['Node.js', 'React', 'AWS'] },
      { id: 'mentor-3', name: 'Rufaro Madzima', role: 'Engineering Manager', org: 'Steward Bank', skills: ['Python', 'AI/ML', 'Leadership'] },
      { id: 'mentor-4', name: 'Tatenda Nyathi', role: 'Senior Developer', org: 'ZB Bank', skills: ['Java', 'Spring', 'Microservices'] },
      { id: 'mentor-5', name: 'Rudo Chimedza', role: 'Product Engineer', org: 'Delta Beverages', skills: ['React Native', 'Mobile', 'UX'] }
    ];
  };

  // Find this mentee's mentor pairing - Always show as assigned for demo
  let myPair = pairs.find(pair => pair.status === 'SENT') || {
    id: 'demo-pair',
    mentorId: 'mentor-1',
    menteeId: user?.id || 'mentee-1',
    status: 'SENT' as const,
    score: 94,
    created: new Date().toISOString(),
    booked: new Date().toISOString()
  };

  // Mock mentor data for demonstration
  const mockMentor = {
    id: 'mentor-1',
    name: 'Tendai Moyo',
    email: 'tendai.moyo@uncommon.org',
    phone: '+263 77 123 4567',
    role: 'Senior Software Engineer',
    org: 'Econet Wireless',
    skills: ['React', 'TypeScript', 'System Design', 'Team Leadership'],
    location: 'Harare',
    experience_years: 8,
    rating: 4.9,
    total_mentees: 12
  };

  const mentor = mentors.find(m => m.id === myPair?.mentorId) || mockMentor;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-100 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Mentor</h1>
          <p className="text-gray-700">Your assigned mentor and mentoring relationship</p>
        </div>
      </div>

      {!myPair ? (
        /* No Mentor Assigned */
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Mentor Assigned Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't been matched with a mentor yet. Browse available mentors and send connection requests.
          </p>
          <button 
            onClick={() => navigate('/mentee/browse')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Mentors
          </button>
        </div>
      ) : (
        /* Mentor Information */
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {mentor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{mentor.name}</h2>
                  <p className="text-purple-600 font-medium">{mentor.role}</p>
                  <p className="text-gray-600">{mentor.org}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={openMessages}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare size={16} />
                  Message
                </button>
                {scheduledSession ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg">
                      <Calendar size={16} />
                      <span className="font-medium">{scheduledSession}</span>
                    </div>
                    <button 
                      onClick={openScheduleModal}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Reschedule session"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={openScheduleModal}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Calendar size={16} />
                    Schedule
                  </button>
                )}
                <button 
                  onClick={openChangeModal}
                  className="flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <RefreshCw size={16} />
                  Request Change
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Contact & Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{mentor.email}</span>
                  </div>
                  {mentor.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{mentor.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{mentor.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Mentor Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-purple-600">
                      {(mentor as any).experience_years || 8}
                    </div>
                    <div className="text-sm text-purple-800">Years Experience</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-yellow-600">
                      {(mentor as any).rating || 4.9}
                    </div>
                    <div className="text-sm text-yellow-800">Rating</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-green-600">
                      {(mentor as any).total_mentees || 12}
                    </div>
                    <div className="text-sm text-green-800">Mentees Guided</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-blue-600">{myPair?.score || 94}%</div>
                    <div className="text-sm text-blue-800">Match Score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Expertise */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Expertise & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Last session: Nov 5, 2025 - System Design Review</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Next session: Nov 12, 2025 - React Best Practices</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Goals completed: 2 of 5 this month</span>
                </div>
              </div>
            </div>

            {/* Mentoring Goals */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Our Focus Areas</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Technical interview preparation</span>
                  <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-1 rounded">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">System design fundamentals</span>
                  <span className="ml-auto text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Portfolio project development</span>
                  <span className="ml-auto text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Planned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scheduling Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {scheduledSession ? 'Reschedule' : 'Schedule'} Session with {mentor.name}
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
                    Both you and {mentor.name} will receive calendar invitations.
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
                      <li>• Preparation: Review your goals beforehand</li>
                      <li>• Follow-up: Receive session summary and action items</li>
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

      {/* Mentor Change Request Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Request Mentor Change
                </h2>
                <button
                  onClick={closeChangeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {changeRequestSent ? (
                /* Confirmation Screen */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted!</h3>
                  <p className="text-gray-600 mb-4">
                    Your mentor change request has been submitted for review.
                  </p>
                  <p className="text-sm text-gray-500">
                    Our team will evaluate your request and get back to you within 2-3 business days.
                  </p>
                </div>
              ) : (
                /* Change Request Interface */
                <div className="space-y-6">
                  {/* Current Mentor Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Current Mentor</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{mentor.name}</div>
                        <div className="text-sm text-gray-600">{mentor.role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Select New Mentor */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Select Preferred New Mentor</h3>
                    <div className="space-y-2">
                      {getAvailableMentors().map((newMentor) => (
                        <button
                          key={newMentor.id}
                          onClick={() => setSelectedNewMentor(newMentor.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedNewMentor === newMentor.id
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {newMentor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{newMentor.name}</div>
                              <div className="text-sm text-gray-600">{newMentor.role} at {newMentor.org}</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {newMentor.skills.slice(0, 3).map((skill, index) => (
                                  <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reason for Change */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Requesting Change *
                    </label>
                    <textarea
                      value={changeReason}
                      onChange={(e) => setChangeReason(e.target.value)}
                      placeholder="Please provide a detailed reason for wanting to change mentors. This helps us understand your needs better and process your request appropriately."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {changeReason.length}/500 characters
                    </div>
                  </div>

                  {/* Guidelines */}
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Mentor changes are evaluated on a case-by-case basis</li>
                      <li>• Valid reasons include skill mismatch, scheduling conflicts, or communication issues</li>
                      <li>• The process typically takes 2-3 business days</li>
                      <li>• Your current mentoring relationship will continue during the review period</li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={closeChangeModal}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitChangeRequest}
                      disabled={!selectedNewMentor || !changeReason.trim()}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        selectedNewMentor && changeReason.trim()
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Send size={16} />
                      Submit Request
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