// src/components/PairTable.tsx
import { useState } from 'react';
import type { Mentor, Mentee, Pairing } from '../types/domain';
import { SwapDialog } from './SwapDialog';

interface PairTableProps {
  pairs: Pairing[];
  mentors: Mentor[];
  mentees: Mentee[];
  onSwap: (pairId: string, newMentorId: string, justification: string) => void;
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

  const handleSwapConfirm = (newMentorId: string, justification: string) => {
    if (selectedPair) {
      onSwap(selectedPair.id, newMentorId, justification);
      setSwapDialogOpen(false);
      setSelectedPair(null);
    }
  };

  if (pairs.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border text-center">
        <p className="text-gray-500 text-sm sm:text-base">No pairs created yet. Run matching to see results.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b bg-gray-50">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Match Results</h3>
        </div>
        
        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {pairs.map((pair) => {
            const mentor = getMentor(pair.mentorId);
            const mentee = getMentee(pair.menteeId);
            
            return (
              <div key={pair.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      pair.score >= 70 ? 'bg-green-100 text-green-800' :
                      pair.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {pair.score}%
                    </span>
                    <button
                      onClick={() => handleSwapClick(pair)}
                      className="text-blue-600 hover:text-blue-900 transition-colors text-sm font-medium"
                    >
                      Swap
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Mentor
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {mentor?.name || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {mentor?.email}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Mentee
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {mentee?.name || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {mentee?.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
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