// src/pages/TrackingPage.tsx
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Kanban } from '../components/Kanban';
import type { PairStatus } from '../types/domain';

export function TrackingPage() {
  const { pairs, mentors, mentees, updatePairStatus } = useAppStore();
  const [, setMessageDialogPairId] = useState<string | null>(null);

  const handleStatusChange = (pairId: string, status: PairStatus) => {
    updatePairStatus(pairId, status);
  };

  const handleOpenMessage = (pairId: string) => {
    setMessageDialogPairId(pairId);
    // In a real app, this might open a modal or navigate to message view
    console.log('Open message for pair:', pairId);
  };

  const statusCounts = {
    NOT_SENT: pairs.filter(p => p.status === 'NOT_SENT').length,
    SENT: pairs.filter(p => p.status === 'SENT').length,
    BOOKED: pairs.filter(p => p.status === 'BOOKED').length,
  };

  const completionRate = pairs.length > 0 
    ? Math.round((statusCounts.BOOKED / pairs.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Pair Tracking</h1>
        <p className="mt-2 text-gray-600">
          Track the status of mentor-mentee pairs through the introduction process
        </p>
      </div>

      {pairs.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Overview</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{pairs.length}</div>
              <div className="text-sm text-gray-600">Total Pairs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{statusCounts.NOT_SENT}</div>
              <div className="text-sm text-gray-600">Not Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.SENT}</div>
              <div className="text-sm text-gray-600">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.BOOKED}</div>
              <div className="text-sm text-gray-600">Meetings Booked</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Completion Progress</span>
              <span>{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <Kanban
        pairs={pairs}
        mentors={mentors}
        mentees={mentees}
        onStatusChange={handleStatusChange}
        onOpenMessage={handleOpenMessage}
      />

      {pairs.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-800">
            <strong>No pairs to track.</strong> Create matches first in the Matching tab, then generate and send messages.
          </div>
        </div>
      )}

      {pairs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Usage Instructions</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Not Sent:</strong> Messages generated but not yet sent to participants</p>
            <p><strong>Sent:</strong> Introduction messages have been sent, waiting for participants to connect</p>
            <p><strong>Meeting Booked:</strong> Participants have scheduled their first meeting</p>
            <p>Use the dropdown on each card to update the status manually, or implement automated tracking in production.</p>
          </div>
        </div>
      )}
    </div>
  );
}