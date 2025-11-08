// src/pages/MatchingPage.tsx
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PairTable } from '../components/PairTable';
import { runGreedyMatcher } from '../utils/matching';
import { computeScore } from '../utils/scoring';
import type { Mentor, Mentee, Pairing } from '../types/domain';

interface MatchingPageProps {
  onNavigateToAnalysis?: () => void;
}

type MatchingStep = 'configure' | 'matching' | 'results' | 'review' | 'export';

const getStepIndex = (step: MatchingStep): number => {
  const steps: MatchingStep[] = ['configure', 'matching', 'results', 'review'];
  return steps.indexOf(step);
};

// Step Components
const ConfigureStep = ({ 
  threshold, 
  onThresholdChange, 
  onRunMatching, 
  mentorCount, 
  menteeCount,
  isLoading 
}: {
  threshold: number;
  onThresholdChange: (value: number) => void;
  onRunMatching: () => void;
  mentorCount: number;
  menteeCount: number;
  isLoading: boolean;
}) => (
  <div className="max-w-2xl mx-auto">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Configure Matching</h1>
      <p className="text-lg text-gray-600">
        Set your matching preferences before running the algorithm
      </p>
    </div>

    <div className="bg-white rounded-xl shadow-sm border p-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Data Overview */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Data Overview</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{mentorCount}</div>
                  <div className="text-sm text-gray-600">Mentors Ready</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{menteeCount}</div>
                  <div className="text-sm text-gray-600">Mentees Waiting</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Matching Settings */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Matching Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Match Quality Threshold: <span className="font-bold text-blue-600">{threshold}%</span>
              </label>
              <input
                type="range"
                min="40"
                max="80"
                value={threshold}
                onChange={(e) => onThresholdChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>40% (More matches)</span>
                <span>80% (Better quality)</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm">
                  <p className="text-amber-800 font-medium">Matching Algorithm</p>
                  <p className="text-amber-700 mt-1">
                    Lower thresholds create more pairs but may reduce match quality. 
                    Higher thresholds ensure better matches but may leave some mentees unmatched.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onRunMatching}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Running Matching Algorithm...</span>
            </div>
          ) : (
            '🎯 Start Matching Process'
          )}
        </button>
      </div>
    </div>
  </div>
);

const MatchingStep = () => (
  <div className="max-w-2xl mx-auto text-center">
    <div className="bg-white rounded-xl shadow-sm border p-12">
      <div className="space-y-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-blue-600 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Running Matching Algorithm</h2>
          <p className="text-gray-600">
            Analyzing compatibility scores and creating optimal mentor-mentee pairs...
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-600">Analyzing</div>
            <div className="text-lg font-semibold text-blue-600">Skills</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-600">Matching</div>
            <div className="text-lg font-semibold text-green-600">Availability</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-600">Optimizing</div>
            <div className="text-lg font-semibold text-purple-600">Pairs</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ResultsStep = ({ 
  pairs, 
  mentors, 
  mentees, 
  onViewDetails, 
  onRunAgain,
  onNavigateToAnalysis 
}: {
  pairs: Pairing[];
  mentors: Mentor[];
  mentees: Mentee[];
  onViewDetails: () => void;
  onRunAgain: () => void;
  onNavigateToAnalysis?: () => void;
}) => {
  const avgScore = pairs.length > 0 
    ? Math.round(pairs.reduce((sum, pair) => sum + pair.score, 0) / pairs.length) 
    : 0;
  const unpairedCount = mentees.filter(mentee => 
    !pairs.some(pair => pair.menteeId === mentee.id)
  ).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">🎉 Matching Complete!</h1>
        <p className="text-lg text-gray-600">
          Successfully created {pairs.length} mentor-mentee pairs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">{pairs.length}</div>
          <div className="text-sm font-medium text-gray-600">Successful Matches</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{avgScore}%</div>
          <div className="text-sm font-medium text-gray-600">Average Score</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">{unpairedCount}</div>
          <div className="text-sm font-medium text-gray-600">Unmatched Mentees</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">What's Next?</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={onViewDetails}
            className="group p-6 text-left border-2 border-blue-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">Review & Edit Pairs</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Examine individual matches, swap mentors, and fine-tune assignments
                </p>
              </div>
            </div>
          </button>

          {onNavigateToAnalysis && (
            <button
              onClick={onNavigateToAnalysis}
              className="group p-6 text-left border-2 border-purple-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-purple-600">Advanced Analytics</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Deep dive into matching insights and performance metrics
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onRunAgain}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Run matching again with different settings
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewStep = ({ 
  pairs, 
  mentors, 
  mentees, 
  onSwap, 
  onBackToResults, 
  onExport 
}: {
  pairs: Pairing[];
  mentors: Mentor[];
  mentees: Mentee[];
  onSwap: (pairId: string, newMentorId: string) => void;
  onBackToResults: () => void;
  onExport: () => void;
}) => (
  <div className="max-w-7xl mx-auto">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Matches</h1>
        <p className="text-lg text-gray-600">
          Fine-tune your {pairs.length} mentor-mentee pairs
        </p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={onBackToResults}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Summary
        </button>
        <button
          onClick={onExport}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Export Results
        </button>
      </div>
    </div>

    <PairTable
      pairs={pairs}
      mentors={mentors}
      mentees={mentees}
      onSwap={onSwap}
    />
  </div>
);

const ExportModal = ({ 
  pairs, 
  threshold, 
  onClose, 
  onExport 
}: {
  pairs: Pairing[];
  threshold: number;
  onClose: () => void;
  onExport: (format: string) => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full m-4">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Export Matching Results</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <button
            onClick={() => onExport('csv')}
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Export as CSV</h3>
                <p className="text-sm text-gray-600">Perfect for Excel, Google Sheets, and data analysis</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onExport('json')}
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Export as JSON</h3>
                <p className="text-sm text-gray-600">Complete data structure for developers and integrations</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onExport('report')}
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Summary Report</h3>
                <p className="text-sm text-gray-600">Human-readable summary for presentations and reviews</p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <strong>Export includes:</strong> {pairs.length} matches with {threshold}% minimum threshold
          </div>
        </div>
      </div>
    </div>
  </div>
);

export function MatchingPage({ onNavigateToAnalysis }: MatchingPageProps) {
  const { 
    mentors, 
    mentees, 
    pairs, 
    setPairs, 
    setScores
  } = useAppStore();
  
  const [currentStep, setCurrentStep] = useState<MatchingStep>('configure');
  const [threshold, setThreshold] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportToast, setExportToast] = useState<string | null>(null);

  const handleRunMatching = async () => {
    setCurrentStep('matching');
    setIsLoading(true);
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = runGreedyMatcher(mentors, mentees, threshold);
      setPairs(result.pairs);
      setScores(result.scoresAudit);
      
      setCurrentStep('results');
    } catch (error) {
      console.error('Matching failed:', error);
      setCurrentStep('configure');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewResults = () => {
    setCurrentStep('review');
  };

  // Export functionality
  const showToast = (message: string) => {
    setExportToast(message);
    setTimeout(() => setExportToast(null), 3000);
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (pairs.length === 0) return;

    const headers = [
      'Pair ID',
      'Mentor Name',
      'Mentor Email', 
      'Mentor Skills',
      'Mentee Name',
      'Mentee Email',
      'Mentee Preferred Skills',
      'Match Score',
      'Status',
      'Created Date'
    ];

    const rows = pairs.map(pair => {
      const mentor = mentors.find(m => m.id === pair.mentorId);
      const mentee = mentees.find(m => m.id === pair.menteeId);
      
      return [
        pair.id,
        mentor?.name || 'Unknown',
        mentor?.email || 'Unknown',
        mentor?.skills.join('; ') || '',
        mentee?.name || 'Unknown', 
        mentee?.email || 'Unknown',
        mentee?.preferred_skills.join('; ') || '',
        pair.score,
        pair.status || 'NOT_SENT',
        new Date().toISOString().split('T')[0]
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    downloadFile(csvContent, `mentor-matches-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    showToast('CSV file downloaded successfully!');
  };

  const exportToJSON = () => {
    if (pairs.length === 0) return;

    const exportData = {
      exportDate: new Date().toISOString(),
      matchingThreshold: threshold,
      summary: {
        totalPairs: pairs.length,
        totalMentors: mentors.length,
        totalMentees: mentees.length,
        averageScore: Math.round(pairs.reduce((sum, pair) => sum + pair.score, 0) / pairs.length),
        unpairedMentees: mentees.filter(mentee => !pairs.some(pair => pair.menteeId === mentee.id)).length
      },
      pairs: pairs.map(pair => {
        const mentor = mentors.find(m => m.id === pair.mentorId);
        const mentee = mentees.find(m => m.id === pair.menteeId);
        
        return {
          id: pair.id,
          score: pair.score,
          status: pair.status || 'NOT_SENT',
          mentor: {
            id: mentor?.id,
            name: mentor?.name,
            email: mentor?.email,
            skills: mentor?.skills,
            capacity: mentor?.capacity,
            availabilitySlots: mentor?.availability_slots
          },
          mentee: {
            id: mentee?.id,
            name: mentee?.name,
            email: mentee?.email,
            preferredSkills: mentee?.preferred_skills,
            availabilitySlots: mentee?.availability_slots,
            goals: mentee?.goals
          }
        };
      })
    };

    downloadFile(
      JSON.stringify(exportData, null, 2), 
      `mentor-matches-${new Date().toISOString().split('T')[0]}.json`, 
      'application/json'
    );
    showToast('JSON file downloaded successfully!');
  };

  const exportSummaryReport = () => {
    if (pairs.length === 0) return;

    const avgScore = Math.round(pairs.reduce((sum, pair) => sum + pair.score, 0) / pairs.length);
    const unpairedMentees = mentees.filter(mentee => !pairs.some(pair => pair.menteeId === mentee.id));
    
    const report = `
MENTOR MATCHING REPORT
Generated: ${new Date().toLocaleString()}
Matching Threshold: ${threshold}%

SUMMARY STATISTICS
==================
Total Mentors: ${mentors.length}
Total Mentees: ${mentees.length}
Successful Matches: ${pairs.length}
Unmatched Mentees: ${unpairedMentees.length}
Average Match Score: ${avgScore}%

MATCH DETAILS
=============
${pairs.map((pair, index) => {
  const mentor = mentors.find(m => m.id === pair.mentorId);
  const mentee = mentees.find(m => m.id === pair.menteeId);
  return `
${index + 1}. ${mentor?.name || 'Unknown'} ↔ ${mentee?.name || 'Unknown'}
   Score: ${pair.score}%
   Status: ${pair.status || 'NOT_SENT'}
   Mentor Skills: ${mentor?.skills.slice(0, 3).join(', ') || 'N/A'}
   Mentee Wants: ${mentee?.preferred_skills.slice(0, 3).join(', ') || 'N/A'}`;
}).join('\n')}

${unpairedMentees.length > 0 ? `
UNMATCHED MENTEES
=================
${unpairedMentees.map(mentee => 
  `• ${mentee.name} - Wants: ${mentee.preferred_skills.slice(0, 3).join(', ')}`
).join('\n')}` : ''}

Report generated by Mentor Matcher System
    `.trim();

    downloadFile(report, `mentor-matching-report-${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
    showToast('Summary report downloaded successfully!');
  };

  const handleSwap = (pairId: string, newMentorId: string) => {
    // Find the pair and update it
    const pair = pairs.find(p => p.id === pairId);
    if (pair) {
      const mentee = mentees.find(m => m.id === pair.menteeId);
      const mentor = mentors.find(m => m.id === newMentorId);
      
      if (mentee && mentor) {
        // Recalculate assignment counts after swap
        const otherPairs = pairs.filter(p => p.id !== pairId);
        const assignedCount = otherPairs.filter(p => p.mentorId === newMentorId).length;
        
        // Compute new score
        const { score } = computeScore(mentor, mentee, assignedCount);
        
        // Update the pair
        const updatedPairs = pairs.map(p => 
          p.id === pairId 
            ? { ...p, mentorId: newMentorId, score } 
            : p
        );
        
        setPairs(updatedPairs);
      }
    }
  };

  if (mentors.length === 0 || mentees.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start Matching</h1>
          <p className="text-gray-600 mb-6">
            Upload mentor and mentee data first to begin the matching process.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Current data:</strong> {mentors.length} mentors, {mentees.length} mentees
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center space-x-8">
            {[
              { key: 'configure', label: 'Configure', icon: '⚙️' },
              { key: 'results', label: 'Match', icon: '🎯' },
              { key: 'review', label: 'Review', icon: '👥' },
              { key: 'export', label: 'Export', icon: '📊' }
            ].map((step, index) => {
              const isCurrent = currentStep === step.key;
              const isCompleted = getStepIndex(currentStep) > index;
              const isActive = isCurrent || isCompleted;
              
              return (
                <li key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isActive 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.icon} {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      {currentStep === 'configure' && (
        <ConfigureStep
          threshold={threshold}
          onThresholdChange={setThreshold}
          onRunMatching={handleRunMatching}
          mentorCount={mentors.length}
          menteeCount={mentees.length}
          isLoading={isLoading}
        />
      )}

      {currentStep === 'matching' && (
        <MatchingStep />
      )}

      {currentStep === 'results' && (
        <ResultsStep
          pairs={pairs}
          mentors={mentors}
          mentees={mentees}
          onViewDetails={handleViewResults}
          onRunAgain={() => setCurrentStep('configure')}
          onNavigateToAnalysis={onNavigateToAnalysis}
        />
      )}

      {currentStep === 'review' && (
        <ReviewStep
          pairs={pairs}
          mentors={mentors}
          mentees={mentees}
          onSwap={handleSwap}
          onBackToResults={() => setCurrentStep('results')}
          onExport={() => setShowExportModal(true)}
        />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          pairs={pairs}
          threshold={threshold}
          onClose={() => setShowExportModal(false)}
          onExport={(format) => {
            if (format === 'csv') exportToCSV();
            else if (format === 'json') exportToJSON();
            else if (format === 'report') exportSummaryReport();
            setShowExportModal(false);
          }}
        />
      )}

      {/* Toast Notification */}
      {exportToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {exportToast}
          </div>
        </div>
      )}
    </div>
  );
}