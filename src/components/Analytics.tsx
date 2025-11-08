// src/components/Analytics.tsx
import type { Mentor, Mentee, Pairing } from '../types/domain';

interface AnalyticsProps {
  mentors: Mentor[];
  mentees: Mentee[];
  pairs: Pairing[];
  onViewUnpaired?: () => void;
  onOptimizeMatching?: () => void;
}

// Hero Analytics Section
function AnalyticsHero({ mentors, mentees, pairs }: Pick<AnalyticsProps, 'mentors' | 'mentees' | 'pairs'>) {
  const avgScore = pairs.length > 0 
    ? Math.round(pairs.reduce((sum, pair) => sum + pair.score, 0) / pairs.length)
    : 0;

  const unpairedMentees = mentees.filter(mentee => 
    !pairs.some(pair => pair.menteeId === mentee.id)
  );

  const matchingRate = mentees.length > 0 
    ? Math.round(((mentees.length - unpairedMentees.length) / mentees.length) * 100)
    : 0;

  const metrics = [
    { 
      label: 'Total Mentors', 
      value: mentors.length.toString(), 
      color: 'blue',
      icon: '👨‍💼',
      description: 'Available mentors in program'
    },
    { 
      label: 'Total Mentees', 
      value: mentees.length.toString(), 
      color: 'green',
      icon: '👩‍🎓',
      description: 'Participants seeking mentorship'
    },
    { 
      label: 'Active Pairs', 
      value: pairs.length.toString(), 
      color: 'purple',
      icon: '🤝',
      description: 'Successfully matched pairs'
    },
    { 
      label: 'Match Quality', 
      value: `${avgScore}%`, 
      color: 'orange',
      icon: '⭐',
      description: 'Average compatibility score'
    },
    { 
      label: 'Success Rate', 
      value: `${matchingRate}%`, 
      color: 'teal',
      icon: '🎯',
      description: 'Mentees successfully paired'
    },
    { 
      label: 'Unmatched', 
      value: unpairedMentees.length.toString(), 
      color: unpairedMentees.length > 0 ? 'red' : 'gray',
      icon: '⚠️',
      description: 'Mentees awaiting assignment'
    }
  ];

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border') => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
      gray: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }
    };
    return colorMap[color]?.[variant] || colorMap.gray[variant];
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`${getColorClasses(metric.color, 'bg')} ${getColorClasses(metric.color, 'border')} border rounded-xl p-4 sm:p-5 text-center transition-all hover:shadow-sm`}
        >
          <div className="text-lg sm:text-xl mb-1">{metric.icon}</div>
          <div className={`text-2xl sm:text-3xl font-bold ${getColorClasses(metric.color, 'text')} mb-1`}>
            {metric.value}
          </div>
          <div className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
            {metric.label}
          </div>
          <div className="text-xs text-gray-600 leading-tight">
            {metric.description}
          </div>
        </div>
      ))}
    </div>
  );
}

// Mentor Utilization Section
function MentorUtilization({ mentors, pairs }: { mentors: Mentor[], pairs: Pairing[] }) {
  const mentorUtilization = mentors.map(mentor => {
    const assigned = pairs.filter(pair => pair.mentorId === mentor.id).length;
    const utilizationRate = mentor.capacity > 0 ? (assigned / mentor.capacity) * 100 : 0;
    return { 
      name: mentor.name, 
      assigned, 
      capacity: mentor.capacity,
      utilizationRate: Math.round(utilizationRate),
      status: assigned === mentor.capacity ? 'full' : 
              assigned > mentor.capacity ? 'overloaded' : 
              assigned === 0 ? 'available' : 'partial'
    };
  });

  const availableMentors = mentorUtilization.filter(m => m.assigned < m.capacity);
  const overloadedMentors = mentorUtilization.filter(m => m.assigned > m.capacity);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Mentor Utilization</h3>
          <p className="text-sm text-gray-600 mt-1">
            Capacity management and availability tracking
          </p>
        </div>
        <div className="flex items-center space-x-4 text-xs sm:text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Available ({availableMentors.length})</span>
          </div>
          {overloadedMentors.length > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Overloaded ({overloadedMentors.length})</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {mentorUtilization.map((mentor, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm sm:text-base text-gray-900 truncate">
                {mentor.name}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs sm:text-sm text-gray-600">
                  {mentor.assigned} of {mentor.capacity} slots filled
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  mentor.status === 'full' ? 'bg-blue-100 text-blue-700' :
                  mentor.status === 'overloaded' ? 'bg-red-100 text-red-700' :
                  mentor.status === 'available' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {mentor.utilizationRate}%
                </span>
              </div>
            </div>
            <div className="ml-4 w-24 sm:w-32">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    mentor.status === 'full' ? 'bg-blue-500' :
                    mentor.status === 'overloaded' ? 'bg-red-500' :
                    mentor.status === 'available' ? 'bg-green-500' :
                    'bg-yellow-500'
                  }`}
                  style={{
                    width: `${Math.min(100, mentor.utilizationRate)}%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Unpaired Mentees Alert
function UnpairedMenteesAlert({ 
  mentees, 
  pairs, 
  onViewUnpaired, 
  onOptimizeMatching 
}: { 
  mentees: Mentee[], 
  pairs: Pairing[],
  onViewUnpaired?: () => void,
  onOptimizeMatching?: () => void
}) {
  const unpairedMentees = mentees.filter(mentee => 
    !pairs.some(pair => pair.menteeId === mentee.id)
  );

  if (unpairedMentees.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-center space-x-3">
          <div className="shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-lg">✅</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-green-900">All Mentees Matched!</h4>
            <p className="text-sm text-green-700 mt-1">
              Congratulations! Every mentee has been successfully paired with a mentor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6">
      <div className="flex items-start space-x-3">
        <div className="shrink-0">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-amber-600 text-lg">⚠️</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-amber-900">
            {unpairedMentees.length} Mentee{unpairedMentees.length > 1 ? 's' : ''} Need Assignment
          </h4>
          <p className="text-sm text-amber-700 mt-1 mb-3">
            These participants are waiting for mentor assignments. Consider adjusting matching criteria or recruiting additional mentors.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {unpairedMentees.slice(0, 4).map(mentee => (
              <div key={mentee.id} className="bg-white rounded-lg px-3 py-2 text-xs">
                <div className="font-medium text-gray-900 truncate max-w-32">
                  {mentee.name}
                </div>
                <div className="text-gray-600 truncate">
                  Wants: {mentee.preferred_skills.slice(0, 2).join(', ')}
                  {mentee.preferred_skills.length > 2 && '...'}
                </div>
              </div>
            ))}
            {unpairedMentees.length > 4 && (
              <div className="bg-white rounded-lg px-3 py-2 text-xs flex items-center text-gray-600">
                +{unpairedMentees.length - 4} more
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {onViewUnpaired && (
              <button
                onClick={onViewUnpaired}
                className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                View All Unmatched
              </button>
            )}
            {onOptimizeMatching && (
              <button
                onClick={onOptimizeMatching}
                className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                Optimize Matching
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Analytics({ 
  mentors, 
  mentees, 
  pairs, 
  onViewUnpaired, 
  onOptimizeMatching 
}: AnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Hero Metrics */}
      <AnalyticsHero mentors={mentors} mentees={mentees} pairs={pairs} />
      
      {/* Unpaired Mentees Alert */}
      <UnpairedMenteesAlert 
        mentees={mentees} 
        pairs={pairs}
        onViewUnpaired={onViewUnpaired}
        onOptimizeMatching={onOptimizeMatching}
      />
      
      {/* Mentor Utilization */}
      <MentorUtilization mentors={mentors} pairs={pairs} />
    </div>
  );
}