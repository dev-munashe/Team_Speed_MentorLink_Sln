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
  const [messages, setMessages] = useState<any[]>([]);

  // Handle navigation from other pages (e.g., from Message button)
  useEffect(() => {
    const navigationState = location.state as { selectedPairId?: string } | null;
    if (navigationState?.selectedPairId) {
      setSelectedConversation(navigationState.selectedPairId);
      // Clear the navigation state to avoid reselecting on page refresh
      window.history.replaceState(null, '');
    }
  }, [location.state]);

  // Initialize messages state
  useEffect(() => {
    const initialMessages = [
      // Pair 1 messages
      { id: '1-1', pairId: 'pair-1', sender: 'system', content: 'Mentorship started on October 28, 2025', timestamp: '2025-10-28T09:00:00Z' },
      { id: '1-2', pairId: 'pair-1', sender: 'mentor', content: "Hi Jamie! Welcome to the mentorship program. I'm excited to help you transition into software engineering. What specific areas would you like to focus on first?", timestamp: '2025-10-28T09:05:00Z' },
      { id: '1-3', pairId: 'pair-1', sender: 'mentee', content: "Hi Sarah! Thank you so much for taking me on. I'm really focused on landing my first software engineering role. I have some coding experience but I'm struggling with technical interviews and building a strong portfolio.", timestamp: '2025-10-28T14:30:00Z' },
      { id: '1-4', pairId: 'pair-1', sender: 'mentor', content: "Great focus areas! For technical interviews, let's start with data structures and algorithms practice. I recommend LeetCode and HackerRank. For your portfolio, what projects have you built so far?", timestamp: '2025-10-28T15:15:00Z' },
      { id: '1-5', pairId: 'pair-1', sender: 'mentee', content: "I've built a simple to-do app in React and a basic REST API in Node.js. But they feel pretty basic compared to what I see other candidates showcasing.", timestamp: '2025-10-29T10:20:00Z' },
      { id: '1-6', pairId: 'pair-1', sender: 'mentor', content: "Those are solid foundations! Let's enhance them - we can add authentication, database integration, and deployment. I'll also share some project ideas that really stand out to hiring managers.", timestamp: '2025-10-29T11:00:00Z' },
      
      // Pair 2 messages  
      { id: '2-1', pairId: 'pair-2', sender: 'system', content: 'Mentorship started on October 30, 2025', timestamp: '2025-10-30T09:00:00Z' },
      { id: '2-2', pairId: 'pair-2', sender: 'mentor', content: "Hi Marcus! Great to connect. I see you're looking to break into fintech - that's an exciting field! What draws you to fintech specifically?", timestamp: '2025-10-30T09:05:00Z' },
      { id: '2-3', pairId: 'pair-2', sender: 'mentee', content: "Hi Sarah! I'm fascinated by how technology is transforming financial services. I want to work on products that help people manage their money better. Plus, the technical challenges seem really interesting - handling large transaction volumes, security, real-time processing.", timestamp: '2025-10-30T16:45:00Z' },
      { id: '2-4', pairId: 'pair-2', sender: 'mentor', content: "I love that perspective! You're right about the technical challenges. Have you thought about what type of fintech company interests you most? Payment processors, investment platforms, lending, or something else?", timestamp: '2025-10-31T08:30:00Z' },
      { id: '2-5', pairId: 'pair-2', sender: 'mentee', content: "I'm really drawn to payment processing and digital banking. The idea of building systems that handle millions of transactions securely sounds both challenging and impactful.", timestamp: '2025-10-31T19:15:00Z' },
      { id: '2-6', pairId: 'pair-2', sender: 'mentor', content: "Perfect project choice! That'll definitely resonate with employers. Let's schedule a code review session. I can also introduce you to some fintech professionals in my network.", timestamp: '2025-11-01T11:00:00Z' },
      
      // Pair 3 messages
      { id: '3-1', pairId: 'pair-3', sender: 'system', content: 'Mentorship started on November 5, 2025', timestamp: '2025-11-05T09:00:00Z' },
      { id: '3-2', pairId: 'pair-3', sender: 'mentor', content: "Hi Priya! Great to meet you. I see you're looking to advance to a senior developer role and improve your leadership skills. These are exciting goals! What's your current experience level?", timestamp: '2025-11-05T09:05:00Z' },
      { id: '3-3', pairId: 'pair-3', sender: 'mentee', content: "Hi Sarah! I've been a developer for about 18 months now, mainly working on backend services. I love the technical work but I want to start leading projects and mentoring junior developers. Any advice on making that transition?", timestamp: '2025-11-05T13:45:00Z' }
    ];
    setMessages(initialMessages);
  }, []);

  // Find this mentor's pairs
  const mentor = mentors.find(m => m.email === user?.email);
  let myPairs = pairs.filter(pair => pair.mentorId === mentor?.id);

  // Mock data for compelling demonstration
  if (myPairs.length === 0) {
    myPairs = [
      { id: 'pair-1', mentorId: 'mentor-1', menteeId: 'mentee-1', score: 94, status: 'SENT' as const },
      { id: 'pair-2', mentorId: 'mentor-1', menteeId: 'mentee-2', score: 87, status: 'SENT' as const },
      { id: 'pair-3', mentorId: 'mentor-1', menteeId: 'mentee-3', score: 91, status: 'SENT' as const }
    ];
  }

  const mockMentees = [
    {
      id: 'mentee-1', 
      name: 'Kudzai Chigwedere',
      email: 'kudzai.c@uncommon.org'
    },
    {
      id: 'mentee-2',
      name: 'Panashe Mandaza', 
      email: 'panashe.m@uncommon.org'
    },
    {
      id: 'mentee-3',
      name: 'Tinotenda Sibanda',
      email: 'tino.s@uncommon.org'
    }
  ];

  const getMenteeData = (menteeId: string) => {
    const realMentee = mentees.find(m => m.id === menteeId);
    return realMentee || mockMentees.find(m => m.id === menteeId) || mockMentees[0];
  };

  // Mock conversation data for demonstration
  const getConversationMessages = (pairId: string) => {
    return messages.filter(msg => msg.pairId === pairId);
  };

  // Filter conversations based on search
  const filteredConversations = myPairs.filter(pair => {
    const mentee = getMenteeData(pair.menteeId);
    return mentee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           mentee?.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    // Create new message
    const newMessage = {
      id: `${selectedConversation}-${Date.now()}`,
      pairId: selectedConversation,
      sender: 'mentor',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    // Add message to state
    setMessages(prev => [...prev, newMessage]);
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
                {myPairs.filter(p => p.status === 'SENT').length}
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
                    const isActive = pair.status === 'SENT';

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