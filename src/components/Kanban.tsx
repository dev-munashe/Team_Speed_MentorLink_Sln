// src/components/Kanban.tsx
import type { Mentor, Mentee, Pairing, PairStatus } from '../types/domain';

interface KanbanProps {
  pairs: Pairing[];
  mentors: Mentor[];
  mentees: Mentee[];
  onStatusChange: (pairId: string, status: PairStatus) => void;
  onOpenMessage?: (pairId: string) => void;
}

const statusConfig = {
  NOT_SENT: { label: 'Not Sent', color: 'bg-gray-100 text-gray-800' },
  SENT: { label: 'Sent', color: 'bg-blue-100 text-blue-800' },
  BOOKED: { label: 'Meeting Booked', color: 'bg-green-100 text-green-800' },
};

export function Kanban({ pairs, mentors, mentees, onStatusChange, onOpenMessage }: KanbanProps) {
  const getMentor = (mentorId: string) => mentors.find(m => m.id === mentorId);
  const getMentee = (menteeId: string) => mentees.find(m => m.id === menteeId);

  const pairsByStatus = {
    NOT_SENT: pairs.filter(p => p.status === 'NOT_SENT'),
    SENT: pairs.filter(p => p.status === 'SENT'),
    BOOKED: pairs.filter(p => p.status === 'BOOKED'),
  };

  const PairCard = ({ pair }: { pair: Pairing }) => {
    const mentor = getMentor(pair.mentorId);
    const mentee = getMentee(pair.menteeId);

    if (!mentor || !mentee) return null;

    return (
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
        <div className="space-y-2">
          <div className="text-xs sm:text-sm">
            <div className="font-medium text-gray-900 truncate">{mentor.name}</div>
            <div className="text-gray-600 text-xs truncate">{mentor.email}</div>
          </div>
          
          <div className="text-center text-gray-400">↕</div>
          
          <div className="text-xs sm:text-sm">
            <div className="font-medium text-gray-900 truncate">{mentee.name}</div>
            <div className="text-gray-600 text-xs truncate">{mentee.email}</div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 border-t gap-2 sm:gap-0">
            <span className="text-xs text-gray-500">Score: {pair.score}%</span>
            <div className="flex items-center space-x-2">
              {onOpenMessage && (
                <button
                  onClick={() => onOpenMessage(pair.id)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Message
                </button>
              )}
              <select
                value={pair.status}
                onChange={(e) => onStatusChange(pair.id, e.target.value as PairStatus)}
                className="text-xs border border-gray-300 rounded px-1 py-1 min-h-8 flex-1 sm:flex-none"
              >
                {Object.entries(statusConfig).map(([status, config]) => (
                  <option key={status} value={status}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (pairs.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border text-center">
        <p className="text-gray-500 text-sm sm:text-base">No pairs to track. Create matches first.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {Object.entries(statusConfig).map(([status, config]) => {
        const statusPairs = pairsByStatus[status as PairStatus];
        
        return (
          <div key={status} className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">{config.label}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
                {statusPairs.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {statusPairs.length === 0 ? (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <p className="text-xs sm:text-sm text-gray-500">No pairs in this status</p>
                </div>
              ) : (
                statusPairs.map(pair => (
                  <PairCard key={pair.id} pair={pair} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}