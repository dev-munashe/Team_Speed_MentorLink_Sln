// src/components/PairTable.tsx
import { useState } from 'react';
import type { Mentor, Mentee, Pairing } from '../types/domain';
import { SwapDialog } from './SwapDialog';

interface PairTableProps {
  pairs: Pairing[];
  mentors: Mentor[];
  mentees: Mentee[];
  onSwap: (pairId: string, newMentorId: string) => void;
}

export function PairTable({ pairs, mentors, mentees, onSwap }: PairTableProps) {
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState<Pairing | null>(null);

  const getMentor = (mentorId: string) => mentors.find(m => m.id === mentorId);
  const getMentee = (menteeId: string) => mentees.find(m => m.id === menteeId);

  const handleSwapClick = (pair: Pairing) => {
    setSelectedPair(pair);
    setSwapDialogOpen(true);
  };

  const handleSwapConfirm = (newMentorId: string) => {
    if (selectedPair) {
      onSwap(selectedPair.id, newMentorId);
      setSwapDialogOpen(false);
      setSelectedPair(null);
    }
  };

  if (pairs.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
        <p className="text-gray-500">No pairs created yet. Run matching to see results.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Match Results</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mentor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mentee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pairs.map((pair) => {
                const mentor = getMentor(pair.mentorId);
                const mentee = getMentee(pair.menteeId);
                
                return (
                  <tr key={pair.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {mentor?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {mentor?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {mentee?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {mentee?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pair.score >= 70 ? 'bg-green-100 text-green-800' :
                        pair.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {pair.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleSwapClick(pair)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Swap
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {swapDialogOpen && selectedPair && (
        <SwapDialog
          pair={selectedPair}
          mentors={mentors}
          mentees={mentees}
          currentPairs={pairs}
          onSwap={handleSwapConfirm}
          onCancel={() => {
            setSwapDialogOpen(false);
            setSelectedPair(null);
          }}
        />
      )}
    </>
  );
}