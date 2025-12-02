// src/portals/admin/pages/AdminMessagesPage.tsx
import { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { MessageSquare, Send, Users, Settings, Copy, Check, Mail, Clock, CheckCircle, ChevronDown, ChevronUp, X } from 'lucide-react';
import type { Pairing } from '../../../types/domain';

export function AdminMessagesPage() {
  const { 
    template, 
    programName, 
    setProgramName, 
    admin, 
    setAdmin, 
    pairs, 
    mentors, 
    mentees, 
    scores,
    updatePairStatus 
  } = useAppStore();

  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);

  // Send message via WhatsApp (proof of concept for flexible communication)
  const sendMessage = async (pairId: string) => {
    const pair = pairs.find(p => p.id === pairId);
    if (!pair) return;

    const mentor = getMentor(pair.mentorId);
    const mentee = getMentee(pair.menteeId);
    
    if (!mentor || !mentee) return;

    // Generate the personalized message
    const message = generateMessage(pair);
    
    // Use mentor's phone or a demo number
    // In production, this would use actual phone numbers from the database
    const phoneNumber = mentor.phone?.replace(/\D/g, '') || '263777123456'; // Demo Zimbabwe number
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Update pair status
    updatePairStatus(pairId, 'SENT');

    // Show success notification
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Send all messages (opens multiple WhatsApp windows - for demo only)
  const sendAllMessages = async () => {
    const unsent = pairs.filter(p => p.status === 'NOT_SENT');
    if (unsent.length === 0) return;
    
    // Confirm before opening multiple WhatsApp windows
    const confirmed = window.confirm(
      `This will open ${unsent.length} WhatsApp windows. Continue?`
    );
    
    if (!confirmed) return;
    
    for (const pair of unsent) {
      await sendMessage(pair.id);
      // Delay between sends to avoid browser blocking popups
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  // Toggle message expansion
  const toggleMessageExpansion = (pairId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pairId)) {
        newSet.delete(pairId);
      } else {
        newSet.add(pairId);
      }
      return newSet;
    });
  };

  const getMentor = (mentorId: string) => mentors.find(m => m.id === mentorId);
  const getMentee = (menteeId: string) => mentees.find(m => m.id === menteeId);
  const getScoreReasons = (mentorId: string, menteeId: string) =>
    scores.find(s => s.mentorId === mentorId && s.menteeId === menteeId)?.reasons || [];

  const generateMessage = (pair: Pairing) => {
    const mentor = getMentor(pair.mentorId);
    const mentee = getMentee(pair.menteeId);
    const reasons = getScoreReasons(pair.mentorId, pair.menteeId);
    
    if (!mentor || !mentee) return '';

    const oneLineReason = reasons.length > 0 
      ? reasons[0].note || `${reasons[0].key} compatibility`
      : 'Great overall compatibility';

    const vars = {
      mentor_name: mentor.name,
      mentor_email: mentor.email,
      mentee_name: mentee.name,
      mentee_email: mentee.email,
      program_name: programName || 'Mentorship Program',
      one_line_reason: oneLineReason,
      admin_name: admin.name || 'Program Administrator',
      admin_email: admin.email || 'admin@uncommon.org',
      admin_phone: admin.phone || ''
    };

    let result = template;
    Object.entries(vars).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, value);
    });

    return result;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Messages</h1>
          <p className="text-lg text-gray-600">
            Review and send introduction messages to mentor-mentee pairs
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Settings size={18} />
          Settings
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Message Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Name
              </label>
              <input
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                placeholder="e.g., Summer Mentorship Program"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Name
              </label>
              <input
                type="text"
                value={admin.name || ''}
                onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={admin.email || ''}
                onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Phone (Optional)
              </label>
              <input
                type="tel"
                value={admin.phone || ''}
                onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ready to Send</p>
              <p className="text-2xl font-bold text-gray-900">
                {pairs.filter(p => p.status === 'NOT_SENT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Send className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Messages Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {pairs.filter(p => p.status === 'SENT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pairs</p>
              <p className="text-2xl font-bold text-gray-900">{pairs.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Message Queue</h3>
            <p className="text-sm text-gray-600 mt-1">Review, edit, and send introduction messages</p>
          </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-sm text-gray-600">
                  {pairs.filter(p => p.status === 'NOT_SENT').length} ready to send
                </span>
                {pairs.filter(p => p.status === 'NOT_SENT').length > 0 && (
                  <button
                    onClick={sendAllMessages}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto justify-center"
                    title="Send all via WhatsApp"
                  >
                    <Send size={16} />
                    Send All via WhatsApp
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Ready to Send</p>
                    <p className="text-lg font-bold text-yellow-900">
                      {pairs.filter(p => p.status === 'NOT_SENT').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-600">Sent</p>
                    <p className="text-lg font-bold text-blue-900">
                      {pairs.filter(p => p.status === 'SENT').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {pairs.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-2">No pairs available for messaging yet</p>
                <p className="text-sm text-gray-500">Upload mentor and mentee data, then run the matching algorithm first.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pairs.map((pair) => {
                  const mentor = getMentor(pair.mentorId);
                  const mentee = getMentee(pair.menteeId);
                  if (!mentor || !mentee) return null;

                  const isUnsent = pair.status === 'NOT_SENT';
                  const isSent = pair.status === 'SENT';

                  return (
                    <div key={pair.id} className={`border rounded-lg p-6 transition-colors ${
                      isUnsent ? 'bg-yellow-50 border-yellow-200' :
                      isSent ? 'bg-blue-50 border-blue-200' :
                      'bg-gray-50'
                    }`}>
                      {/* Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h4 className="text-base sm:text-lg font-medium text-gray-900 break-words">
                              {mentor.name} ↔ {mentee.name}
                            </h4>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full self-start ${
                              isUnsent ? 'bg-yellow-100 text-yellow-800' :
                              isSent ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {pair.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 break-words">
                            Recipients: {mentor.email}, {mentee.email}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">{
                          isUnsent && (
                            <button
                              onClick={() => sendMessage(pair.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors justify-center"
                              title="Send via WhatsApp"
                            >
                              <Send size={16} />
                              Send via WhatsApp
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(generateMessage(pair));
                              setCopySuccess(pair.id);
                              setTimeout(() => setCopySuccess(null), 2000);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors justify-center"
                          >
                            {copySuccess === pair.id ? <Check size={16} /> : <Copy size={16} />}
                            <span className="hidden sm:inline">
                              {copySuccess === pair.id ? 'Copied!' : 'Copy'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Message Preview */}
                      <div className="bg-white border rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
                          <h5 className="text-sm font-medium text-gray-700">Message Preview</h5>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Score: {pair.score}%</span>
                            {isSent && (
                              <button
                                onClick={() => toggleMessageExpansion(pair.id)}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                                title={expandedMessages.has(pair.id) ? 'Collapse message' : 'Expand message'}
                              >
                                {expandedMessages.has(pair.id) ? (
                                  <>
                                    <ChevronUp size={14} />
                                    <span className="hidden sm:inline">Collapse</span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown size={14} />
                                    <span className="hidden sm:inline">Expand</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Message content - always show for unsent, conditionally show for sent */}
                        {(isUnsent || expandedMessages.has(pair.id)) ? (
                          <div className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                            {generateMessage(pair)}
                          </div>
                        ) : (
                          <div className="text-xs sm:text-sm text-gray-500 italic">
                            Message content hidden. Click "Expand" to view the full message.
                          </div>
                        )}
                      </div>
                      
                      {isSent && (
                        <div className="mt-3 flex items-start sm:items-center gap-2 text-xs sm:text-sm text-blue-600">
                          <CheckCircle size={16} className="flex-shrink-0 mt-0.5 sm:mt-0" />
                          <span>Message sent successfully on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle size={20} />
          <span>Message sent successfully!</span>
        </div>
      )}
    </div>
  );
}