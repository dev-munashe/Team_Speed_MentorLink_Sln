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
  NOT_SENT: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    bgColor: 'bg-yellow-50',
    icon: '📋'
  },
  SENT: { 
    label: 'Contacted', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'bg-blue-50',
    icon: '📧'
  },
  BOOKED: { 
    label: 'Connected', 
    color: 'bg-green-100 text-green-800 border-green-200',
    bgColor: 'bg-green-50',
    icon: '✅'
  },
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

    const config = statusConfig[pair.status];
    
    // Mock data for enhanced display
    const daysSinceCreated = Math.floor(Math.random() * 14) + 1;
    const commonSkills = mentor.skills.filter(skill => 
      mentee.preferred_skills.some(prefSkill => 
        prefSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(prefSkill.toLowerCase())
      )
    ).slice(0, 2);

    return (
      <div className={`bg-white border-2 ${config.color} rounded-xl p-4 shadow-sm hover:shadow-md transition-all`}>
        {/* Header with status */}
        <div className="flex items-center justify-between mb-3">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <span className="mr-1">{config.icon}</span>
            {config.label}
          </div>
          <span className="text-xs text-gray-500">
            {daysSinceCreated}d ago
          </span>
        </div>

        {/* Mentor Section */}
        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <div className="text-xs text-blue-600 font-medium mb-1">MENTOR</div>
          <div className="font-semibold text-gray-900 text-sm truncate mb-1">{mentor.name}</div>
          <div className="text-xs text-gray-600 truncate">{mentor.email}</div>
          <div className="mt-2">
            <div className="text-xs text-blue-700">
              <span className="font-medium">Skills:</span> {mentor.skills.slice(0, 2).join(', ')}
              {mentor.skills.length > 2 && '...'}
            </div>
            <div className="text-xs text-blue-700 mt-1">
              <span className="font-medium">Capacity:</span> {mentor.capacity} mentees
            </div>
          </div>
        </div>

        {/* Connection Arrow */}
        <div className="flex justify-center text-gray-400 text-lg mb-3">
          ↓
        </div>

        {/* Mentee Section */}
        <div className="bg-green-50 rounded-lg p-3 mb-3">
          <div className="text-xs text-green-600 font-medium mb-1">MENTEE</div>
          <div className="font-semibold text-gray-900 text-sm truncate mb-1">{mentee.name}</div>
          <div className="text-xs text-gray-600 truncate">{mentee.email}</div>
          <div className="mt-2">
            <div className="text-xs text-green-700">
              <span className="font-medium">Wants:</span> {mentee.preferred_skills.slice(0, 2).join(', ')}
              {mentee.preferred_skills.length > 2 && '...'}
            </div>
            {mentee.goals && mentee.goals.length > 0 && (
              <div className="text-xs text-green-700 mt-1">
                <span className="font-medium">Goals:</span> {mentee.goals.slice(0, 1).join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Match Quality & Common Skills */}
        <div className="bg-purple-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-purple-600 font-medium">COMPATIBILITY</div>
            <div className={`text-sm font-bold ${
              pair.score >= 80 ? 'text-green-600' : 
              pair.score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {pair.score}%
            </div>
          </div>
          
          {commonSkills.length > 0 && (
            <div className="text-xs text-purple-700">
              <span className="font-medium">Overlap:</span> {commonSkills.join(', ')}
            </div>
          )}
          
          <div className="w-full bg-purple-200 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${
                pair.score >= 80 ? 'bg-green-500' : 
                pair.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${pair.score}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Status:</label>
            <select
              value={pair.status}
              onChange={(e) => onStatusChange(pair.id, e.target.value as PairStatus)}
              className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(statusConfig).map(([status, config]) => (
                <option key={status} value={status}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenMessage && (
              <button
                onClick={() => onOpenMessage(pair.id)}
                className="flex-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg font-medium transition-colors"
              >
                💬 Message
              </button>
            )}
            <button
              onClick={() => {/* View details */}}
              className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-medium transition-colors"
            >
              👁️ Details
            </button>
          </div>

          {/* Progress indicator based on status */}
          {pair.status === 'SENT' && (
            <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded text-center">
              ⏳ Waiting for response
            </div>
          )}
          {pair.status === 'BOOKED' && (
            <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded text-center">
              🎉 Successfully connected!
            </div>
          )}
          {pair.status === 'NOT_SENT' && (
            <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-center">
              📋 Ready to send introduction
            </div>
          )}
        </div>
      </div>
    );
  };

  if (pairs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-4">📋</div>
        <p className="text-gray-500 text-sm sm:text-base">No pairs to track. Create matches first.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {Object.entries(statusConfig).map(([status, config]) => {
        const statusPairs = pairsByStatus[status as PairStatus];
        
        return (
          <div key={status} className="space-y-4">
            <div className={`${config.bgColor} rounded-lg p-4 border-2 ${config.color.split(' ')[2]}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{config.icon}</span>
                  <h3 className="font-semibold text-gray-900">{config.label}</h3>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${config.color}`}>
                  {statusPairs.length}
                </span>
              </div>
              
              <div className="mt-2 text-xs text-gray-600">
                {status === 'NOT_SENT' && 'Ready for outreach'}
                {status === 'SENT' && 'Awaiting participant response'}
                {status === 'BOOKED' && 'Successfully connected'}
              </div>
            </div>
            
            <div className="space-y-4">
              {statusPairs.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 text-center">
                  <div className="text-gray-400 text-2xl mb-2">✨</div>
                  <p className="text-sm text-gray-500">No pairs in this stage</p>
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