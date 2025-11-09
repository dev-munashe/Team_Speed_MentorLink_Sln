// src/portals/mentee/pages/MenteeMessagesPage.tsx
import { useState, useEffect } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { MessageSquare, Send, Search, Calendar } from 'lucide-react';

export function MenteeMessagesPage() {
  const { pairs, mentors } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  // Find this mentee's conversations (simplified - in real app would find by mentee ID)
  let myConversations = pairs.filter(pair => pair.status === 'BOOKED');

  // Mock conversations for demonstration
  if (myConversations.length === 0) {
    myConversations = [
      { id: 'conv-1', mentorId: 'mentor-1', menteeId: 'mentee-1', score: 94, status: 'BOOKED' as const }
    ];
  }

  // Mock mentors and messages
  const mockMentors = [
    {
      id: 'mentor-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@techcorp.com',
      role: 'Senior Software Engineer',
      org: 'TechCorp Innovation Labs'
    }
  ];

  const getMentorData = (mentorId: string) => {
    return mentors.find(m => m.id === mentorId) || mockMentors.find(m => m.id === mentorId);
  };

  // Initialize messages state with mock data
  useEffect(() => {
    const initialMessages = [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'mentor-1',
        senderName: 'Sarah Chen',
        text: 'Hi Alex! Great to be your mentor. I reviewed your goals and I think we can make excellent progress together.',
        timestamp: '2025-11-07T10:30:00Z',
        isFromMentor: true
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: 'mentee-1',
        senderName: 'Alex Johnson',
        text: 'Thank you so much! I\'m really excited to learn from you. I\'ve been working on React but struggling with some advanced patterns.',
        timestamp: '2025-11-07T11:15:00Z',
        isFromMentor: false
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        senderId: 'mentor-1',
        senderName: 'Sarah Chen',
        text: 'Perfect! Let\'s start with custom hooks and context patterns. I\'ll send you some resources and we can discuss them in our next session.',
        timestamp: '2025-11-07T11:20:00Z',
        isFromMentor: true
      },
      {
        id: 'msg-4',
        conversationId: 'conv-1',
        senderId: 'mentee-1',
        senderName: 'Alex Johnson',
        text: 'That sounds great! When would be a good time for our first session?',
        timestamp: '2025-11-07T14:45:00Z',
        isFromMentor: false
      },
      {
        id: 'msg-5',
        conversationId: 'conv-1',
        senderId: 'mentor-1',
        senderName: 'Sarah Chen',
        text: 'I have availability Monday 7-8 PM or Wednesday 6-7 PM this week. Which works better for you?',
        timestamp: '2025-11-08T09:15:00Z',
        isFromMentor: true
      }
    ];
    setMessages(initialMessages);
  }, []);

  const getConversationMessages = (conversationId: string) => {
    return messages.filter(msg => msg.conversationId === conversationId);
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    // Create new message
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation,
      senderId: 'mentee-1',
      senderName: 'Alex Johnson',
      text: messageText,
      timestamp: new Date().toISOString(),
      isFromMentor: false
    };

    // Add message to state
    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
  };

  const selectedMentor = selectedConversation ? getMentorData(myConversations.find(c => c.id === selectedConversation)?.mentorId || '') : null;
  const conversationMessages = selectedConversation ? getConversationMessages(selectedConversation) : [];

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {myConversations.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">No conversations yet</p>
            </div>
          ) : (
            myConversations.map((conversation) => {
              const mentor = getMentorData(conversation.mentorId);
              if (!mentor) return null;

              const isSelected = selectedConversation === conversation.id;
              const lastMessage = messages
                .filter(msg => msg.conversationId === conversation.id)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-purple-50 border-r-2 border-purple-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{mentor.name}</h3>
                      <p className="text-xs text-gray-500">{mentor.role}</p>
                    </div>
                  </div>
                  {lastMessage && (
                    <div className="ml-13">
                      <p className="text-sm text-gray-600 truncate">
                        {lastMessage.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(lastMessage.timestamp)}
                      </p>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            {selectedMentor && (
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedMentor.name}</h3>
                      <p className="text-sm text-gray-600">{selectedMentor.role}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Calendar size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isFromMentor ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isFromMentor
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isFromMentor ? 'text-gray-500' : 'text-purple-100'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    messageText.trim()
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}