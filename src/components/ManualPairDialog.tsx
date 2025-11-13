// src/components/ManualPairDialog.tsx
import { useState, useEffect } from 'react';
import type { Mentor, Mentee, Pairing } from '../types/domain';
import { computeScore } from '../utils/scoring';

interface ManualPairDialogProps {
  mentors: Mentor[];
  mentees: Mentee[];
  currentPairs: Pairing[];
  onCreatePair: (mentorId: string, menteeId: string, reason: string) => void;
  onCancel: () => void;
}

export function ManualPairDialog({ mentors, mentees, currentPairs, onCreatePair, onCancel }: ManualPairDialogProps) {
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [selectedMenteeId, setSelectedMenteeId] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [previewScore, setPreviewScore] = useState<number | null>(null);

  // Predefined reasons for manual pairing
  const pairingReasons = [
    'Algorithm couldn\'t find suitable match',
    'Specific request from mentee',
    'Specific request from mentor',
    'Subject matter expertise match',
    'Geographic proximity',
    'Schedule compatibility',
    'Industry experience alignment',
    'Previous successful collaboration',
    'Special program requirements',
    'Other'
  ];

  // Calculate current assignment counts
  const assignmentCounts = new Map<string, number>();
  mentors.forEach(mentor => {
    const count = currentPairs.filter(p => p.mentorId === mentor.id).length;
    assignmentCounts.set(mentor.id, count);
  });

  // Get available mentors (those with capacity)
  const availableMentors = mentors.filter(mentor => {
    const currentAssigned = assignmentCounts.get(mentor.id) || 0;
    return currentAssigned < mentor.capacity;
  });

  // Get available mentees (those not already paired)
  const pairedMenteeIds = new Set(currentPairs.map(p => p.menteeId));
  const availableMentees = mentees.filter(mentee => !pairedMenteeIds.has(mentee.id));

  // Calculate preview score when both mentor and mentee are selected
  useEffect(() => {
    if (selectedMentorId && selectedMenteeId) {
      const mentor = mentors.find(m => m.id === selectedMentorId);
      const mentee = mentees.find(m => m.id === selectedMenteeId);
      
      if (mentor && mentee) {
        const currentAssigned = assignmentCounts.get(selectedMentorId) || 0;
        const { score } = computeScore(mentor, mentee, currentAssigned);
        setPreviewScore(score);
      }
    } else {
      setPreviewScore(null);
    }
  }, [selectedMentorId, selectedMenteeId, mentors, mentees, assignmentCounts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMentorId && selectedMenteeId && reason) {
      const finalReason = reason === 'Other' ? customReason : reason;
      onCreatePair(selectedMentorId, selectedMenteeId, finalReason);
    }
  };

  const isFormValid = selectedMentorId && selectedMenteeId && reason && 
    (reason !== 'Other' || customReason.trim());

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Create Manual Pair
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Mentor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Mentor:
              </label>
              <select
                value={selectedMentorId}
                onChange={(e) => setSelectedMentorId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a mentor...</option>
                {availableMentors.map(mentor => {
                  const assigned = assignmentCounts.get(mentor.id) || 0;
                  return (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name} ({assigned}/{mentor.capacity})
                    </option>
                  );
                })}
              </select>
              {availableMentors.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No mentors available (all at capacity)
                </p>
              )}
            </div>

            {/* Mentee Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Mentee:
              </label>
              <select
                value={selectedMenteeId}
                onChange={(e) => setSelectedMenteeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a mentee...</option>
                {availableMentees.map(mentee => (
                  <option key={mentee.id} value={mentee.id}>
                    {mentee.name}
                  </option>
                ))}
              </select>
              {availableMentees.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No mentees available (all already paired)
                </p>
              )}
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for manual pairing:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a reason...</option>
                {pairingReasons.map(reasonOption => (
                  <option key={reasonOption} value={reasonOption}>
                    {reasonOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Reason Input */}
            {reason === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify:
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter your reason for this manual pairing..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
            )}

            {/* Score Preview */}
            {previewScore !== null && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span>Compatibility Score:</span>
                    <span className={`font-medium ${
                      previewScore >= 70 ? 'text-green-600' : 
                      previewScore >= 50 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {previewScore}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {previewScore >= 70 ? 'Excellent match' :
                     previewScore >= 50 ? 'Good match' :
                     'Consider if this pairing meets specific needs'}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
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
                disabled={!isFormValid}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isFormValid
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Pair
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}