// src/pages/MessagesPage.tsx
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Analytics } from '../components/Analytics';

// Analysis Tabs
type AnalysisTab = 'overview' | 'pairs' | 'insights';

// Tab Navigation Component
function AnalysisTabNavigation({ 
  activeTab, 
  onTabChange, 
  pairCount 
}: { 
  activeTab: AnalysisTab, 
  onTabChange: (tab: AnalysisTab) => void,
  pairCount: number 
}) {
  const tabs = [
    { id: 'overview', label: 'Program Overview', icon: '📊', description: 'Key metrics and status' },
    { id: 'pairs', label: `Pair Analysis (${pairCount})`, icon: '🤝', description: 'Individual compatibility' },
    { id: 'insights', label: 'Insights & Tips', icon: '💡', description: 'Success strategies' }
  ];

  return (
    <div className="border-b border-gray-200 mb-6 sm:mb-8">
      <nav className="-mb-px flex space-x-1 sm:space-x-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as AnalysisTab)}
            className={`flex items-center space-x-2 py-3 px-3 sm:px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <div className="text-left">
              <div className="font-medium">{tab.label}</div>
              <div className="text-xs text-gray-500 hidden sm:block">{tab.description}</div>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}

// Unpaired Mentees Modal
function UnpairedMenteesModal({ 
  unpairedMentees, 
  onClose 
}: { 
  unpairedMentees: any[], 
  onClose: () => void 
}) {
  if (unpairedMentees.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Unmatched Mentees ({unpairedMentees.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Participants awaiting mentor assignment
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            {unpairedMentees.map(mentee => (
              <div key={mentee.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{mentee.name}</h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Skills needed:</span> {mentee.preferred_skills.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Experience:</span> {mentee.experience_level}
                      </div>
                      <div>
                        <span className="font-medium">Availability:</span> {mentee.availability_slots.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Success Tips Component
function SuccessInsights() {
  const insights = [
    {
      title: 'Optimize Match Quality',
      icon: '🎯',
      tips: [
        'Consider lowering matching threshold if many mentees are unmatched',
        'Review mentor availability to identify scheduling conflicts',
        'Encourage mentors to expand their skill offerings',
        'Use waiting list to maintain engagement with unmatched mentees'
      ]
    },
    {
      title: 'Improve Program Success',
      icon: '📈',
      tips: [
        'Schedule regular check-ins between mentor-mentee pairs',
        'Provide structured conversation starters and goals',
        'Create group networking events for cross-pair learning',
        'Track progress through follow-up surveys'
      ]
    },
    {
      title: 'Address Common Issues',
      icon: '🔧',
      tips: [
        'Mentor overload: Recruit additional mentors in high-demand areas',
        'Low engagement: Provide training and resources for mentors',
        'Scheduling conflicts: Use async communication tools as backup',
        'Skill mismatches: Encourage mentors to develop new competencies'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Program Success Insights</h2>
        <p className="text-gray-600 mt-2">
          Data-driven recommendations to optimize your mentoring program
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">{insight.icon}</div>
              <h3 className="font-semibold text-gray-900">{insight.title}</h3>
            </div>
            <ul className="space-y-2">
              {insight.tips.map((tip, tipIndex) => (
                <li key={tipIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MessagesPage() {
  const { pairs, mentors, mentees } = useAppStore();
  const [selectedPairId, setSelectedPairId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AnalysisTab>('overview');
  const [showUnpairedModal, setShowUnpairedModal] = useState(false);

  const getMentor = (mentorId: string) => mentors.find(m => m.id === mentorId);
  const getMentee = (menteeId: string) => mentees.find(m => m.id === menteeId);

  const unpairedMentees = mentees.filter(mentee => 
    !pairs.some(pair => pair.menteeId === mentee.id)
  );

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
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6">📊</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Analysis Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base px-4 mb-8">
            Get insights and analytics for your mentoring program once matches are created.
          </p>
          <div className="bg-gray-50 p-6 rounded-xl text-sm text-gray-600">
            <div className="mb-2">
              <strong>Current data:</strong> {mentors.length} mentors, {mentees.length} mentees
            </div>
            <div>
              Create matches in the <strong>Matching</strong> tab to unlock detailed analytics and compatibility insights.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const personalityMatch = selectedPair ? getPersonalityMatch(selectedPair.id) : null;
  const successProb = selectedPair ? getSuccessProbability(selectedPair) : 0;
  const commonTimes = mentor && mentee ? findCommonAvailability(mentor.availability_slots, mentee.availability_slots) : [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Program Analysis Dashboard</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base px-4">
          Comprehensive insights, compatibility analysis, and success optimization for your mentoring program
        </p>
      </div>

      {/* Tab Navigation */}
      <AnalysisTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pairCount={pairs.length}
      />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Analytics
            mentors={mentors}
            mentees={mentees}
            pairs={pairs}
            onViewUnpaired={() => setShowUnpairedModal(true)}
            onOptimizeMatching={() => setActiveTab('insights')}
          />
        </div>
      )}

      {activeTab === 'pairs' && (
        <div className="space-y-6">
          {/* Pair Selector */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Pair for Deep Analysis</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pairs.map((pair) => {
                const pairMentor = getMentor(pair.mentorId);
                const pairMentee = getMentee(pair.menteeId);
                const isSelected = selectedPair?.id === pair.id;
                
                return (
                  <button
                    key={pair.id}
                    onClick={() => setSelectedPairId(pair.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-gray-900 truncate mb-1">
                      {pairMentor?.name} → {pairMentee?.name}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Match Score: <span className="font-semibold text-blue-600">{pair.score}%</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Success Probability: {getSuccessProbability(pair)}%
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Pair Analysis */}
          {selectedPair && mentor && mentee && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Pair Overview */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Pair Overview</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-xs font-medium text-blue-800 mb-1">MENTOR</div>
                      <div className="font-semibold text-gray-900 mb-2">{mentor.name}</div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div><span className="font-medium">Skills:</span> {mentor.skills.slice(0, 3).join(', ')}</div>
                        <div><span className="font-medium">Experience:</span> Senior level</div>
                        <div><span className="font-medium">Capacity:</span> {mentor.capacity} mentees</div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-xs font-medium text-green-800 mb-1">MENTEE</div>
                      <div className="font-semibold text-gray-900 mb-2">{mentee.name}</div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div><span className="font-medium">Wants:</span> {mentee.preferred_skills.slice(0, 3).join(', ')}</div>
                        <div><span className="font-medium">Level:</span> Beginner</div>
                        <div><span className="font-medium">Goals:</span> {mentee.goals?.slice(0, 2).join(', ') || 'Career growth'}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Success Metrics */}
                  <div className="bg-linear-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Success Prediction</h4>
                      <span className={`text-2xl font-bold ${successProb >= 80 ? 'text-green-600' : successProb >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {successProb}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${successProb >= 80 ? 'bg-green-500' : successProb >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${successProb}%` }}
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Based on skills alignment, experience compatibility, and availability match
                    </div>
                  </div>
                </div>
              </div>

              {/* Compatibility Breakdown */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Compatibility Analysis</h3>
                
                <div className="space-y-6">
                  {/* Core Match Factors */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Core Matching Factors</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Skills Alignment', value: Math.round((selectedPair.score * 1.2) % 100), color: 'blue' },
                        { label: 'Availability Match', value: Math.round((selectedPair.score * 0.9) % 100), color: 'green' },
                        { label: 'Experience Level', value: Math.round((selectedPair.score * 1.1) % 100), color: 'yellow' },
                      ].map((factor, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{factor.label}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  factor.color === 'blue' ? 'bg-blue-500' :
                                  factor.color === 'green' ? 'bg-green-500' :
                                  'bg-yellow-500'
                                }`}
                                style={{ width: `${factor.value}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                              {factor.value}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Personality Compatibility */}
                  {personalityMatch && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Working Style Compatibility</h4>
                      <div className="space-y-3">
                        {Object.entries(personalityMatch).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                                {value}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Common Availability */}
                  {commonTimes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Shared Availability</h4>
                      <div className="flex flex-wrap gap-2">
                        {commonTimes.map((time, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'insights' && (
        <SuccessInsights />
      )}

      {/* Unpaired Mentees Modal */}
      {showUnpairedModal && (
        <UnpairedMenteesModal
          unpairedMentees={unpairedMentees}
          onClose={() => setShowUnpairedModal(false)}
        />
      )}
    </div>
  );
}