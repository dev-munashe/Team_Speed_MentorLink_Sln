// src/components/SwapDialog.tsx
import { useState, useEffect } from 'react';
import type { Mentor, Mentee, Pairing } from '../types/domain';
import { computeScore } from '../utils/scoring';

interface SwapDialogProps {
  pair: Pairing;
  mentors: Mentor[];
  mentees: Mentee[];
  currentPairs: Pairing[];
  onSwap: (newMentorId: string, justification: string) => void;
  onCancel: () => void;
}

export function SwapDialog({ pair, mentors, mentees, currentPairs, onSwap, onCancel }: SwapDialogProps) {
  const [selectedMentorId, setSelectedMentorId] = useState(pair.mentorId);
  const [previewScore, setPreviewScore] = useState(pair.score);
  const [justification, setJustification] = useState('');
  const [customReason, setCustomReason] = useState('');

  const currentMentee = mentees.find(m => m.id === pair.menteeId);

  // Predefined swap justification reasons
  const swapReasons = [
    'Better skill alignment',
    'Schedule compatibility',
    'Communication preferences',
    'Geographic proximity',
    'Industry experience match',
    'Personality fit',
    'Mentee request',
    'Mentor request',
    'Performance improvement',
    'Other'
  ];

  // Calculate current assignment counts
  const assignmentCounts = new Map<string, number>();
  mentors.forEach(mentor => {
    const count = currentPairs.filter(p => p.mentorId === mentor.id).length;
    assignmentCounts.set(mentor.id, count);
  });

  // Filter available mentors (those with capacity)
  const availableMentors = mentors.filter(mentor => {
    const currentAssigned = assignmentCounts.get(mentor.id) || 0;
    return currentAssigned < mentor.capacity || mentor.id === pair.mentorId;
  });

  useEffect(() => {
    if (currentMentee && selectedMentorId) {
      const mentor = mentors.find(m => m.id === selectedMentorId);
      if (mentor) {
        const currentAssigned = assignmentCounts.get(selectedMentorId) || 0;
        const adjustedCount = selectedMentorId === pair.mentorId ? currentAssigned - 1 : currentAssigned;
        const { score } = computeScore(mentor, currentMentee, adjustedCount);
        setPreviewScore(score);
      }
    }
  }, [selectedMentorId, currentMentee, mentors, assignmentCounts, pair.mentorId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMentorId !== pair.mentorId) {
      const finalJustification = justification === 'Other' ? customReason : justification;
      onSwap(selectedMentorId, finalJustification);
    } else {
      onCancel();
    }
  };

  if (!currentMentee) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Swap Mentor for {currentMentee.name}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select new mentor:
              </label>
              <select
                value={selectedMentorId}
                onChange={(e) => setSelectedMentorId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableMentors.map(mentor => {
                  const assigned = assignmentCounts.get(mentor.id) || 0;
                  return (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name} ({assigned}/{mentor.capacity})
                      {mentor.id === pair.mentorId && ' (current)'}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for swap:
              </label>
              <select
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a reason...</option>
                {swapReasons.map(reason => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {justification === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify:
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter your reason for this swap..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
            )}

            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm">
                <div className="flex justify-between items-center">
                  <span>Current score:</span>
                  <span className="font-medium">{pair.score}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>New score:</span>
                  <span className={`font-medium ${previewScore > pair.score ? 'text-green-600' : previewScore < pair.score ? 'text-red-600' : 'text-gray-900'}`}>
                    {previewScore}%
                    {previewScore > pair.score && ' ↑'}
                    {previewScore < pair.score && ' ↓'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  selectedMentorId === pair.mentorId || 
                  !justification || 
                  (justification === 'Other' && !customReason.trim())
                }
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedMentorId === pair.mentorId || 
                  !justification || 
                  (justification === 'Other' && !customReason.trim())
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {selectedMentorId === pair.mentorId ? 'No Change' : 'Confirm Swap'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}