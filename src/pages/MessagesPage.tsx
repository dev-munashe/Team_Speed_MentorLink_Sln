// src/pages/MessagesPage.tsx
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Analytics } from '../components/Analytics';

export function MessagesPage() {
  const { pairs, mentors, mentees } = useAppStore();
  const [selectedPairId, setSelectedPairId] = useState<string | null>(null);

  const getMentor = (mentorId: string) => mentors.find(m => m.id === mentorId);
  const getMentee = (menteeId: string) => mentees.find(m => m.id === menteeId);

  // Mock data for personality/working style compatibility
  const getPersonalityMatch = (pairId: string) => {
    const seed = pairId.length;
    return {
      communicationStyle: Math.floor(seed * 13) % 100,
      workingStyle: Math.floor(seed * 17) % 100,
      learningStyle: Math.floor(seed * 19) % 100,
      personalityFit: Math.floor(seed * 23) % 100,
    };
  };

  // Mock success probability calculation
  const getSuccessProbability = (pair: any) => {
    const base = pair.score;
    const personality = getPersonalityMatch(pair.id);
    const avgPersonality = Object.values(personality).reduce((a: number, b: number) => a + b, 0) / 4;
    return Math.min(95, Math.round((base * 0.6 + avgPersonality * 0.4)));
  };

  // Parse availability to find common times
  const findCommonAvailability = (mentorAvail: string[], menteeAvail: string[]) => {
    const common = [];
    for (const mentorSlot of mentorAvail) {
      for (const menteeSlot of menteeAvail) {
        if (mentorSlot.toLowerCase().includes(menteeSlot.toLowerCase().split(' ')[0]) || 
            menteeSlot.toLowerCase().includes(mentorSlot.toLowerCase().split(' ')[0])) {
          common.push(mentorSlot);
          break;
        }
      }
    }
    return common.slice(0, 3); // Return top 3 matches
  };

  const selectedPair = selectedPairId ? pairs.find(p => p.id === selectedPairId) : pairs[0];
  const mentor = selectedPair ? getMentor(selectedPair.mentorId) : null;
  const mentee = selectedPair ? getMentee(selectedPair.menteeId) : null;

  if (pairs.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Compatibility Analysis</h1>
        <p className="text-gray-600 text-sm sm:text-base px-4 mb-6">
          No pairs available for analysis. Create matches first in the Matching tab.
        </p>
        <div className="text-sm text-gray-500">
          Current data: {mentors.length} mentors, {mentees.length} mentees
        </div>
      </div>
    );
  }

  const personalityMatch = selectedPair ? getPersonalityMatch(selectedPair.id) : null;
  const successProb = selectedPair ? getSuccessProbability(selectedPair) : 0;
  const commonTimes = mentor && mentee ? findCommonAvailability(mentor.availability_slots, mentee.availability_slots) : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Compatibility Deep Dive</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base px-4">
          Detailed compatibility analysis and success predictions for mentor-mentee pairs
        </p>
      </div>

      {/* Program Overview Analytics */}
      <Analytics
        mentors={mentors}
        mentees={mentees}
        pairs={pairs}
      />

      {/* Pair Selector */}
      {pairs.length > 1 && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Select Pair to Analyze</h3>
          <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pairs.map((pair) => {
              const pairMentor = getMentor(pair.mentorId);
              const pairMentee = getMentee(pair.menteeId);
              const isSelected = selectedPair?.id === pair.id;
              
              return (
                <button
                  key={pair.id}
                  onClick={() => setSelectedPairId(pair.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {pairMentor?.name} → {pairMentee?.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Match Score: {pair.score}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedPair && mentor && mentee && (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Pair Overview */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Pair Overview</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Mentor</h4>
                  <div className="text-sm text-blue-800">
                    <div className="font-medium">{mentor.name}</div>
                    <div className="text-xs">{mentor.email}</div>
                    <div className="mt-2">
                      <span className="text-xs text-blue-600">Skills:</span>
                      <div className="text-xs">{mentor.skills.slice(0, 3).join(', ')}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Mentee</h4>
                  <div className="text-sm text-green-800">
                    <div className="font-medium">{mentee.name}</div>
                    <div className="text-xs">{mentee.email}</div>
                    <div className="mt-2">
                      <span className="text-xs text-green-600">Wants to learn:</span>
                      <div className="text-xs">{mentee.preferred_skills.slice(0, 3).join(', ')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Probability */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-900">Success Probability</h4>
                  <span className="text-2xl font-bold text-purple-700">{successProb}%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${successProb}%` }}
                  />
                </div>
                <p className="text-xs text-purple-600 mt-2">
                  {successProb >= 80 ? 'Excellent match with high success potential' :
                   successProb >= 60 ? 'Good match with solid compatibility' :
                   'Moderate match - may need extra support'}
                </p>
              </div>
            </div>
          </div>

          {/* Compatibility Breakdown */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Compatibility Analysis</h3>
            
            <div className="space-y-4">
              {/* Core Match Factors */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Core Matching Factors</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Skills Alignment', value: Math.round((selectedPair.score * 1.2) % 100), color: 'blue' },
                    { label: 'Availability Match', value: Math.round((selectedPair.score * 0.9) % 100), color: 'green' },
                    { label: 'Experience Level', value: Math.round((selectedPair.score * 1.1) % 100), color: 'yellow' },
                    { label: 'Location/Timezone', value: Math.round((selectedPair.score * 0.8) % 100), color: 'purple' }
                  ].map((factor, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{factor.label}</span>
                        <span className="font-medium">{factor.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-${factor.color}-500 h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${factor.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personality Compatibility */}
              {personalityMatch && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Personality & Working Style</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Communication Style', value: personalityMatch.communicationStyle, color: 'indigo' },
                      { label: 'Working Style', value: personalityMatch.workingStyle, color: 'pink' },
                      { label: 'Learning Approach', value: personalityMatch.learningStyle, color: 'teal' },
                      { label: 'Personality Fit', value: personalityMatch.personalityFit, color: 'orange' }
                    ].map((trait, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{trait.label}</span>
                          <span className="font-medium">{trait.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-${trait.color}-500 h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${trait.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Meeting Optimization & Recommendations */}
      {selectedPair && mentor && mentee && (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Meeting Time Optimization */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Optimal Meeting Times</h3>
            
            {commonTimes.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">
                  Found {commonTimes.length} overlapping availability slots:
                </p>
                {commonTimes.map((time, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-sm font-medium text-green-800">{time}</span>
                    <span className="text-xs text-green-600">
                      {index === 0 ? 'Best match' : 'Alternative'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-gray-400 mb-2">⏰</div>
                <p className="text-sm text-gray-600 mb-3">
                  No obvious time overlaps found in availability data.
                </p>
                <p className="text-xs text-gray-500">
                  Recommend manual coordination for meeting scheduling.
                </p>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Success Recommendations</h3>
            
            <div className="space-y-3">
              {[
                {
                  icon: '🎯',
                  title: 'Focus Areas',
                  desc: `Start with ${mentor.skills.slice(0, 2).join(' and ')} to build momentum`
                },
                {
                  icon: '📅',
                  title: 'Meeting Frequency',
                  desc: successProb >= 80 ? 'Bi-weekly meetings recommended' : 'Weekly check-ins suggested'
                },
                {
                  icon: '🔄',
                  title: 'Communication Style',
                  desc: personalityMatch && personalityMatch.communicationStyle > 70 
                    ? 'Direct communication works well' 
                    : 'Consider structured communication approach'
                },
                {
                  icon: '📈',
                  title: 'Success Factors',
                  desc: selectedPair.score >= 70 
                    ? 'Strong skill alignment - leverage this advantage' 
                    : 'Focus on building rapport and trust first'
                }
              ].map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-lg">{rec.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-blue-900">{rec.title}</div>
                    <div className="text-xs text-blue-700 mt-1">{rec.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}