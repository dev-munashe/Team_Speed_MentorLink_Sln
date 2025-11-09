// src/portals/admin/pages/AdminMessagesPage.tsx
import { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { MessageSquare, Send, Users, Edit, Copy, Check, Mail, Clock, CheckCircle } from 'lucide-react';

export function AdminMessagesPage() {
  const { 
    template, 
    setTemplate, 
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

  const [activeTab, setActiveTab] = useState<'template' | 'send'>('template');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [sendingPairs, setSendingPairs] = useState<Set<string>>(new Set());
  const [sentPairs, setSentPairs] = useState<Set<string>>(new Set());
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Mock send message function
  const sendMessage = async (pairId: string) => {
    setSendingPairs(prev => new Set([...prev, pairId]));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update pair status
    updatePairStatus(pairId, 'SENT');
    setSentPairs(prev => new Set([...prev, pairId]));
    setSendingPairs(prev => {
      const newSet = new Set(prev);
      newSet.delete(pairId);
      return newSet;
    });

    // Show success notification
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Send all messages
  const sendAllMessages = async () => {
    const unsent = pairs.filter(p => p.status === 'NOT_SENT');
    for (const pair of unsent) {
      await sendMessage(pair.id);
      // Small delay between sends to show progress
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  // Template Preview Component
  const TemplatePreview = ({ template, programName, admin }: { 
    template: string; 
    programName: string; 
    admin: { name: string; email: string; phone?: string }; 
  }) => {
    const sampleVars = {
      mentor_name: 'John Smith',
      mentor_email: 'john.smith@example.com',
      mentee_name: 'Jane Doe',
      mentee_email: 'jane.doe@example.com',
      program_name: programName || 'Mentorship Program',
      one_line_reason: 'Great match based on shared interests in web development and React',
      admin_name: admin.name || 'Program Administrator',
      admin_email: admin.email || 'admin@program.com',
      admin_phone: admin.phone || ''
    };

    const renderTemplate = (text: string) => {
      let result = text;
      Object.entries(sampleVars).forEach(([key, value]) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        result = result.replace(regex, value);
      });
      return result;
    };

    return (
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-900">Preview</h4>
          <button
            onClick={() => {
              navigator.clipboard.writeText(renderTemplate(template));
              setCopySuccess('template');
              setTimeout(() => setCopySuccess(null), 2000);
            }}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            {copySuccess === 'template' ? <Check size={16} /> : <Copy size={16} />}
            {copySuccess === 'template' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-white p-3 rounded border">
          {renderTemplate(template)}
        </div>
      </div>
    );
  };

  const getMentor = (mentorId: string) => mentors.find(m => m.id === mentorId);
  const getMentee = (menteeId: string) => mentees.find(m => m.id === menteeId);
  const getScoreReasons = (mentorId: string, menteeId: string) =>
    scores.find(s => s.mentorId === mentorId && s.menteeId === menteeId)?.reasons || [];

  const generateMessage = (pair: any) => {
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
      admin_email: admin.email || 'admin@program.com',
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
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Management</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Configure introduction messages and communicate with mentors and mentees
        </p>
      </div>

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

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'template', label: 'Message Template', icon: Edit },
            { id: 'send', label: 'Send Messages', icon: Send }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border p-6">
        {activeTab === 'template' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configure Message Template</h3>
              
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
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
                      value={admin.name}
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
                      value={admin.email}
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
                      placeholder="+1-555-123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Introduction Message Template
                  </label>
                  <textarea
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Customize your introduction message..."
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    Available variables: {`{{mentor_name}}, {{mentee_name}}, {{program_name}}, {{one_line_reason}}, {{admin_name}}, {{admin_email}}, {{admin_phone}}`}
                  </div>
                </div>
              </div>

              <TemplatePreview template={template} programName={programName} admin={admin} />
            </div>
          </div>
        )}

        {activeTab === 'send' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Send Messages</h3>
                <p className="text-sm text-gray-600 mt-1">Preview and send introduction messages to mentor-mentee pairs</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {pairs.filter(p => p.status === 'NOT_SENT').length} ready to send
                </span>
                {pairs.filter(p => p.status === 'NOT_SENT').length > 0 && (
                  <button
                    onClick={sendAllMessages}
                    disabled={sendingPairs.size > 0}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    {sendingPairs.size > 0 ? 'Sending...' : 'Send All Messages'}
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
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
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-600">Active</p>
                    <p className="text-lg font-bold text-green-900">
                      {pairs.filter(p => p.status === 'BOOKED').length}
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
                  const isSending = sendingPairs.has(pair.id);
                  const isSent = pair.status === 'SENT';
                  const isActive = pair.status === 'BOOKED';

                  return (
                    <div key={pair.id} className={`border rounded-lg p-6 transition-colors ${
                      isUnsent ? 'bg-yellow-50 border-yellow-200' :
                      isSent ? 'bg-blue-50 border-blue-200' :
                      isActive ? 'bg-green-50 border-green-200' :
                      'bg-gray-50'
                    }`}>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">
                              {mentor.name} ↔ {mentee.name}
                            </h4>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                              isUnsent ? 'bg-yellow-100 text-yellow-800' :
                              isSending ? 'bg-blue-100 text-blue-800' :
                              isSent ? 'bg-blue-100 text-blue-800' :
                              isActive ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {isSending ? (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                  SENDING
                                </div>
                              ) : (
                                pair.status.replace('_', ' ')
                              )}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Recipients: {mentor.email}, {mentee.email}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isUnsent && !isSending && (
                            <button
                              onClick={() => sendMessage(pair.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Send size={16} />
                              Send Message
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(generateMessage(pair));
                              setCopySuccess(pair.id);
                              setTimeout(() => setCopySuccess(null), 2000);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            {copySuccess === pair.id ? <Check size={16} /> : <Copy size={16} />}
                            {copySuccess === pair.id ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      {/* Message Preview */}
                      <div className="bg-white border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-sm font-medium text-gray-700">Message Preview</h5>
                          <span className="text-xs text-gray-500">Score: {pair.score}%</span>
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                          {generateMessage(pair)}
                        </div>
                      </div>
                      
                      {isSent && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                          <CheckCircle size={16} />
                          Message sent successfully on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                        </div>
                      )}
                      
                      {isActive && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle size={16} />
                          Mentoring relationship is now active
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Preview Generated Messages</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {pairs.filter(p => p.status === 'NOT_SENT').length} ready to send
                </span>
                {pairs.filter(p => p.status === 'NOT_SENT').length > 0 && (
                  <button
                    onClick={sendAllMessages}
                    disabled={sendingPairs.size > 0}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    {sendingPairs.size > 0 ? 'Sending...' : 'Send All Messages'}
                  </button>
                )}
              </div>
            </div>

            {pairs.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pairs available for messaging yet.</p>
                <p className="text-sm text-gray-500">Upload data and run matching first.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {pairs.map((pair) => {
                  const mentor = getMentor(pair.mentorId);
                  const mentee = getMentee(pair.menteeId);
                  if (!mentor || !mentee) return null;

                  const isUnsent = pair.status === 'NOT_SENT';
                  const isSending = sendingPairs.has(pair.id);
                  const isSent = pair.status === 'SENT';

                  return (
                    <div key={pair.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-gray-900">
                          {mentor.name} ↔ {mentee.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            isUnsent ? 'bg-yellow-100 text-yellow-800' :
                            isSending ? 'bg-blue-100 text-blue-800' :
                            isSent ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {isSending ? (
                              <div className="flex items-center gap-1">
                                <div className="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full"></div>
                                SENDING
                              </div>
                            ) : (
                              pair.status.replace('_', ' ')
                            )}
                          </span>
                          
                          {isUnsent && !isSending && (
                            <button
                              onClick={() => sendMessage(pair.id)}
                              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              <Send size={12} />
                              Send
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(generateMessage(pair));
                              setCopySuccess(pair.id);
                              setTimeout(() => setCopySuccess(null), 2000);
                            }}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                          >
                            {copySuccess === pair.id ? <Check size={14} /> : <Copy size={14} />}
                            {copySuccess === pair.id ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border font-mono">
                        {generateMessage(pair)}
                      </div>
                      
                      {isSent && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                          <CheckCircle size={14} />
                          Sent to {mentor.email} and {mentee.email}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Sent Messages</h3>
              <span className="text-sm text-gray-600">
                {pairs.filter(p => p.status === 'SENT').length} messages sent
              </span>
            </div>
            
            {pairs.filter(p => p.status === 'SENT').length === 0 ? (
              <div className="text-center py-8">
                <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No messages sent yet</p>
                <p className="text-sm text-gray-500">Sent messages will appear here with delivery confirmation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pairs
                  .filter(p => p.status === 'SENT')
                  .map((pair) => {
                    const mentor = getMentor(pair.mentorId);
                    const mentee = getMentee(pair.menteeId);
                    if (!mentor || !mentee) return null;

                    return (
                      <div key={pair.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {mentor.name} ↔ {mentee.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Recipients: {mentor.email}, {mentee.email}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              ✓ DELIVERED
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Message Preview</span>
                          </div>
                          <div className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
                            {generateMessage(pair).split('\n').slice(0, 3).join('\n')}
                            {generateMessage(pair).split('\n').length > 3 && '\n...'}
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            Delivered
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-500" />
                            Response pending
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
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