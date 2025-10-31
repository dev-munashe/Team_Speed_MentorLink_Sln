// src/components/MessagePreview.tsx
import { useState } from 'react';
import type { Mentor, Mentee, Pairing, MatchScore } from '../types/domain';
import { renderTemplate, oneLineReason, exportToCsv } from '../utils/strings';

interface MessagePreviewProps {
  pairs: Pairing[];
  mentors: Mentor[];
  mentees: Mentee[];
  scores: MatchScore[];
  template: string;
  programName: string;
  admin: { name: string; email: string; phone?: string };
  onMarkAsSent: (pairId: string) => void;
}

export function MessagePreview({
  pairs,
  mentors,
  mentees,
  scores,
  template,
  programName,
  admin,
  onMarkAsSent
}: MessagePreviewProps) {
  const [expandedPairs, setExpandedPairs] = useState<Set<string>>(new Set());

  const getMentor = (mentorId: string) => mentors.find(m => m.id === mentorId);
  const getMentee = (menteeId: string) => mentees.find(m => m.id === menteeId);
  const getScoreReasons = (mentorId: string, menteeId: string) =>
    scores.find(s => s.mentorId === mentorId && s.menteeId === menteeId)?.reasons || [];

  const toggleExpanded = (pairId: string) => {
    const newExpanded = new Set(expandedPairs);
    if (newExpanded.has(pairId)) {
      newExpanded.delete(pairId);
    } else {
      newExpanded.add(pairId);
    }
    setExpandedPairs(newExpanded);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log('Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const exportMessages = () => {
    const messagesData = pairs.map(pair => {
      const mentor = getMentor(pair.mentorId);
      const mentee = getMentee(pair.menteeId);
      const reasons = getScoreReasons(pair.mentorId, pair.menteeId);
      
      if (!mentor || !mentee) return null;

      const message = renderTemplate(template, {
        mentor_name: mentor.name,
        mentor_email: mentor.email,
        mentee_name: mentee.name,
        mentee_email: mentee.email,
        program_name: programName,
        one_line_reason: oneLineReason(reasons),
        admin_name: admin.name,
        admin_email: admin.email,
        admin_phone: admin.phone || '',
      });

      return {
        pair_id: pair.id,
        mentor_name: mentor.name,
        mentor_email: mentor.email,
        mentee_name: mentee.name,
        mentee_email: mentee.email,
        score: pair.score,
        status: pair.status,
        message: message.replace(/\n/g, ' '),
      };
    }).filter(Boolean);

    exportToCsv(messagesData, 'mentorship-messages.csv');
  };

  if (pairs.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
        <p className="text-gray-500">No pairs available. Create matches first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Message Previews ({pairs.length} pairs)
        </h3>
        <button
          onClick={exportMessages}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
        >
          Export All Messages CSV
        </button>
      </div>

      <div className="space-y-3">
        {pairs.map(pair => {
          const mentor = getMentor(pair.mentorId);
          const mentee = getMentee(pair.menteeId);
          const reasons = getScoreReasons(pair.mentorId, pair.menteeId);
          const isExpanded = expandedPairs.has(pair.id);

          if (!mentor || !mentee) return null;

          const message = renderTemplate(template, {
            mentor_name: mentor.name,
            mentor_email: mentor.email,
            mentee_name: mentee.name,
            mentee_email: mentee.email,
            program_name: programName,
            one_line_reason: oneLineReason(reasons),
            admin_name: admin.name,
            admin_email: admin.email,
            admin_phone: admin.phone || '',
          });

          return (
            <div key={pair.id} className="bg-white border rounded-lg">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpanded(pair.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">
                        {mentor.name} ↔ {mentee.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        pair.status === 'NOT_SENT' ? 'bg-gray-100 text-gray-700' :
                        pair.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {pair.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        Score: {pair.score}%
                      </span>
                    </div>
                    {!isExpanded && (
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {message.split('\n')[0]}...
                      </p>
                    )}
                  </div>
                  <div className="text-gray-400">
                    {isExpanded ? '−' : '+'}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t bg-gray-50">
                  <div className="mt-3 space-y-3">
                    <div className="bg-white p-3 rounded border">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                        {message}
                      </pre>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(message)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Copy Message
                      </button>
                      
                      {pair.status === 'NOT_SENT' && (
                        <button
                          onClick={() => onMarkAsSent(pair.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Mark as Sent
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}