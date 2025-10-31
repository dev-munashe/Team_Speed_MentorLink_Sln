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
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="space-y-2">
          <div className="text-sm">
            <div className="font-medium text-gray-900">{mentor.name}</div>
            <div className="text-gray-600">{mentor.email}</div>
          </div>
          
          <div className="text-center text-gray-400">↕</div>
          
          <div className="text-sm">
            <div className="font-medium text-gray-900">{mentee.name}</div>
            <div className="text-gray-600">{mentee.email}</div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
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
                className="text-xs border border-gray-300 rounded px-1 py-0.5"
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
      <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
        <p className="text-gray-500">No pairs to track. Create matches first.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(statusConfig).map(([status, config]) => {
        const statusPairs = pairsByStatus[status as PairStatus];
        
        return (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{config.label}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
                {statusPairs.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {statusPairs.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <p className="text-sm text-gray-500">No pairs in this status</p>
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