// src/components/Analytics.tsx
import type { Mentor, Mentee, Pairing } from '../types/domain';

interface AnalyticsProps {
  mentors: Mentor[];
  mentees: Mentee[];
  pairs: Pairing[];
}

export function Analytics({ mentors, mentees, pairs }: AnalyticsProps) {
  const avgScore = pairs.length > 0 
    ? Math.round(pairs.reduce((sum, pair) => sum + pair.score, 0) / pairs.length)
    : 0;
    
  const unpairedMentees = mentees.filter(mentee => 
    !pairs.some(pair => pair.menteeId === mentee.id)
  );

  const mentorUtilization = mentors.map(mentor => {
    const assigned = pairs.filter(pair => pair.mentorId === mentor.id).length;
    return { name: mentor.name, assigned, capacity: mentor.capacity };
  });

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Analytics</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{mentors.length}</div>
          <div className="text-xs sm:text-sm text-gray-600">Mentors</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">{mentees.length}</div>
          <div className="text-xs sm:text-sm text-gray-600">Mentees</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">{pairs.length}</div>
          <div className="text-xs sm:text-sm text-gray-600">Pairs Created</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-orange-600">{avgScore}%</div>
          <div className="text-xs sm:text-sm text-gray-600">Avg Score</div>
        </div>
      </div>

      {unpairedMentees.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
            Unpaired Mentees ({unpairedMentees.length})
          </h4>
          <div className="max-h-24 sm:max-h-32 overflow-y-auto">
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
              {unpairedMentees.map(mentee => (
                <li key={mentee.id} className="hyphens-auto">
                  {mentee.name} - wants: {mentee.preferred_skills.slice(0, 3).join(', ')}
                  {mentee.preferred_skills.length > 3 && '...'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div>
        <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Mentor Utilization</h4>
        <div className="max-h-32 sm:max-h-40 overflow-y-auto space-y-2">
          {mentorUtilization.map((mentor, index) => (
            <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-700 truncate flex-1 mr-2">{mentor.name}</span>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-gray-600 text-xs">{mentor.assigned}/{mentor.capacity}</span>
                <div className="w-12 sm:w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      mentor.assigned === mentor.capacity ? 'bg-green-500' :
                      mentor.assigned > mentor.capacity ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (mentor.assigned / mentor.capacity) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}