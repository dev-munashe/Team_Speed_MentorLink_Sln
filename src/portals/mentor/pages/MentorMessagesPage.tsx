// src/portals/mentor/pages/MentorMessagesPage.tsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppStore } from '../../../store/useAppStore';
import { MessageSquare, Send, Users, Search, Calendar, Check } from 'lucide-react';

export function MentorMessagesPage() {
  const { user } = useAuth();
  const { pairs, mentees, mentors } = useAppStore();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  // Handle navigation from other pages (e.g., from Message button)
  useEffect(() => {
    const navigationState = location.state as { selectedPairId?: string } | null;
    if (navigationState?.selectedPairId) {
      setSelectedConversation(navigationState.selectedPairId);
      // Clear the navigation state to avoid reselecting on page refresh
      window.history.replaceState(null, '');
    }
  }, [location.state]);

  // Find this mentor's pairs
  const mentor = mentors.find(m => m.email === user?.email);
  let myPairs = pairs.filter(pair => pair.mentorId === mentor?.id);

  // Mock data for compelling demonstration
  if (myPairs.length === 0) {
    myPairs = [
      { id: 'pair-1', mentorId: 'mentor-1', menteeId: 'mentee-1', score: 94, status: 'BOOKED' as const },
      { id: 'pair-2', mentorId: 'mentor-1', menteeId: 'mentee-2', score: 87, status: 'BOOKED' as const },
      { id: 'pair-3', mentorId: 'mentor-1', menteeId: 'mentee-3', score: 91, status: 'SENT' as const }
    ];
  }

  const mockMentees = [
    {
      id: 'mentee-1', 
      name: 'Jamie Thompson',
      email: 'jamie.thompson@university.edu'
    },
    {
      id: 'mentee-2',
      name: 'Marcus Chen', 
      email: 'marcus.chen@bootcamp.io'
    },
    {
      id: 'mentee-3',
      name: 'Priya Patel',
      email: 'priya.patel@techstart.com'
    }
  ];

  const getMenteeData = (menteeId: string) => {
    const realMentee = mentees.find(m => m.id === menteeId);
    return realMentee || mockMentees.find(m => m.id === menteeId) || mockMentees[0];
  };

  // Mock conversation data for demonstration
  const getConversationMessages = (pairId: string) => {
    const conversations = {
      'pair-1': [
        { id: '1', sender: 'system', content: 'Mentorship started on November 1, 2025', timestamp: '2025-11-01T10:00:00Z' },
        { id: '2', sender: 'mentor', content: "Hi Jamie! I'm excited to be your mentor. I see you're interested in landing a FAANG internship - that's a great goal! Let's schedule our first meeting to discuss your background and create a plan together.", timestamp: '2025-11-01T10:05:00Z' },
        { id: '3', sender: 'mentee', content: "Thank you Sarah! I'm really grateful for this opportunity. I'm available Monday evenings or Wednesday afternoons. What works best for you?", timestamp: '2025-11-01T11:30:00Z' },
        { id: '4', sender: 'mentor', content: "Perfect! Let's meet this Wednesday at 6 PM. I'll send you a calendar invite. In the meantime, can you share your current resume and any coding projects you've been working on?", timestamp: '2025-11-01T14:15:00Z' },
        { id: '5', sender: 'mentee', content: "Absolutely! I'll email you my resume and GitHub portfolio. I've been working on a React project that analyzes social media trends. Looking forward to our chat!", timestamp: '2025-11-01T15:45:00Z' },
        { id: '6', sender: 'mentor', content: "That sounds fascinating! Social media analytics is very relevant in today's market. I'll take a look and we can discuss potential improvements and how to present it to recruiters.", timestamp: '2025-11-02T09:20:00Z' }
      ],
      'pair-2': [
        { id: '1', sender: 'system', content: 'Mentorship started on October 28, 2025', timestamp: '2025-10-28T14:00:00Z' },
        { id: '2', sender: 'mentor', content: "Hi Marcus! Welcome to the program. I understand you're transitioning from finance to tech - that's a bold and exciting move! I'd love to hear more about what sparked this career change.", timestamp: '2025-10-28T14:05:00Z' },
        { id: '3', sender: 'mentee', content: "Hi Sarah! Thanks for taking me on. I've been in investment banking for 5 years but always loved technology. I finally decided to pursue my passion and enrolled in a bootcamp. The learning curve is steep but I'm loving it!", timestamp: '2025-10-28T16:22:00Z' },
        { id: '4', sender: 'mentor', content: "That's amazing! Your finance background will actually be a huge asset, especially if you're interested in fintech. What technologies are you most excited about learning?", timestamp: '2025-10-29T10:15:00Z' },
        { id: '5', sender: 'mentee', content: "Right now I'm deep into React and Node.js. I'm building a personal finance tracker app - combining my two worlds! Would love your feedback on the architecture.", timestamp: '2025-10-29T18:30:00Z' },
        { id: '6', sender: 'mentor', content: "Perfect project choice! That'll definitely resonate with employers. Let's schedule a code review session. I can also introduce you to some fintech professionals in my network.", timestamp: '2025-11-01T11:00:00Z' }
      ],
      'pair-3': [
        { id: '1', sender: 'system', content: 'Mentorship started on November 5, 2025', timestamp: '2025-11-05T09:00:00Z' },
        { id: '2', sender: 'mentor', content: "Hi Priya! Great to meet you. I see you're looking to advance to a senior developer role and improve your leadership skills. These are exciting goals! What's your current experience level?", timestamp: '2025-11-05T09:05:00Z' },
        { id: '3', sender: 'mentee', content: "Hi Sarah! I've been a developer for about 18 months now, mainly working on backend services. I love the technical work but I want to start leading projects and mentoring junior developers. Any advice on making that transition?", timestamp: '2025-11-05T13:45:00Z' }
      ]
    };
    return conversations[pairId as keyof typeof conversations] || [];
  };

  // Filter conversations based on search
  const filteredConversations = myPairs.filter(pair => {
    const mentee = getMenteeData(pair.menteeId);
    return mentee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           mentee?.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    // Here you would typically send the message to your backend
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  const selectedPair = myPairs.find(p => p.id === selectedConversation);
  const selectedMentee = selectedPair ? getMenteeData(selectedPair.menteeId) : null;
  const conversationMessages = selectedConversation ? getConversationMessages(selectedConversation) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
            <p className="text-gray-700">
              Communicate with your mentees and track conversations
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {myPairs.filter(p => p.status === 'BOOKED').length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Active Chats</div>
            </div>
          </div>
        </div>
      </div>

      {myPairs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
          <p className="text-gray-600">
            Once you're matched with mentees, your conversations will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="grid lg:grid-cols-3 min-h-[600px]">
            {/* Conversation List */}
            <div className="lg:border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-y-auto max-h-[500px]">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map((pair) => {
                    const mentee = getMenteeData(pair.menteeId);
                    if (!mentee) return null;

                    const isSelected = selectedConversation === pair.id;
                    const isActive = pair.status === 'BOOKED';

                    return (
                      <div
                        key={pair.id}
                        onClick={() => setSelectedConversation(pair.id)}
                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                          isSelected ? 'bg-green-50 border-l-4 border-l-green-500' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-sm">
                              {mentee.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900 truncate">{mentee.name}</p>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {isActive ? 'Active' : 'Pending'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{mentee.email}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Match Score: {pair.score}%
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 flex flex-col">
              {!selectedConversation ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a mentee from the list to start messaging</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold">
                          {selectedMentee?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedMentee?.name}</h3>
                        <p className="text-sm text-gray-600">{selectedMentee?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                      {conversationMessages.map((message) => {
                        if (message.sender === 'system') {
                          return (
                            <div key={message.id} className="text-center">
                              <div className="inline-block bg-blue-100 px-3 py-1 rounded-full text-sm text-blue-800">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                {message.content}
                              </div>
                            </div>
                          );
                        }

                        if (message.sender === 'mentor') {
                          return (
                            <div key={message.id} className="flex justify-end">
                              <div className="max-w-xs lg:max-w-md bg-green-600 text-white rounded-lg p-3">
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-75 mt-1">
                                  <Check className="w-3 h-3 inline mr-1" />
                                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={message.id} className="flex">
                            <div className="max-w-xs lg:max-w-md bg-white border rounded-lg p-3 shadow-sm">
                              <p className="text-sm text-gray-900">{message.content}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(message.timestamp).toLocaleString([], { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      {/* Show placeholder if no messages */}
                      {conversationMessages.length === 0 && (
                        <div className="text-center py-8">
                          <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Start the conversation!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!messageText.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send size={16} />
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}