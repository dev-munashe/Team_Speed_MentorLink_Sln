// src/portals/admin/pages/AdminMatchingPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { PairTable } from '../../../components/PairTable';
import { runGreedyMatcher } from '../../../utils/matching';

type MatchingStep = 'configure' | 'matching' | 'results' | 'review';

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
  <div className="max-w-2xl mx-auto px-4 sm:px-0">
    <div className="text-center mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Configure Matching</h1>
      <p className="text-base sm:text-lg text-gray-600 px-2 sm:px-0">
        Set your matching preferences before running the algorithm
      </p>
    </div>

    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-8">
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        {/* Data Overview */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Data Overview</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">Mentors</span>
              <span className="text-lg font-bold text-blue-700">{mentorCount}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-900">Mentees</span>
              <span className="text-lg font-bold text-green-700">{menteeCount}</span>
            </div>
          </div>
        </div>

        {/* Matching Configuration */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Algorithm Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Match Score: {threshold}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={threshold}
                onChange={(e) => onThresholdChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Higher thresholds create more selective matches
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
        <button
          onClick={onRunMatching}
          disabled={isLoading || mentorCount === 0 || menteeCount === 0}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              Running Algorithm...
            </>
          ) : (
            <>
              ⚡ Run Matching Algorithm
            </>
          )}
        </button>
        
        {(mentorCount === 0 || menteeCount === 0) && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Please upload both mentors and mentees data first
          </p>
        )}
      </div>
    </div>
  </div>
);

export function AdminMatchingPage() {
  const navigate = useNavigate();
  const { mentors, mentees, pairs, setPairs, setScores, swapPair } = useAppStore();
  const [currentStep, setCurrentStep] = useState<MatchingStep>('configure');
  const [threshold, setThreshold] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunMatching = async () => {
    setIsLoading(true);
    setCurrentStep('matching');

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { pairs: newPairs, scoresAudit } = runGreedyMatcher(mentors, mentees, threshold);
      
      setPairs(newPairs);
      setScores(scoresAudit);
      
      setCurrentStep('results');
    } catch (error) {
      console.error('Matching error:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToMessages = () => {
    navigate('/admin/messages');
  };

  const steps = [
    { id: 'configure', name: 'Configure', description: 'Set parameters' },
    { id: 'matching', name: 'Processing', description: 'Running algorithm' },
    { id: 'results', name: 'Results', description: 'Review matches' },
    { id: 'review', name: 'Review', description: 'Finalize pairs' }
  ];

  const currentStepIndex = getStepIndex(currentStep);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'configure':
        return (
          <ConfigureStep
            threshold={threshold}
            onThresholdChange={setThreshold}
            onRunMatching={handleRunMatching}
            mentorCount={mentors.length}
            menteeCount={mentees.length}
            isLoading={isLoading}
          />
        );
      case 'matching':
        return (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Matches</h2>
            <p className="text-gray-600">Our AI algorithm is finding the best mentor-mentee pairs...</p>
          </div>
        );
      case 'results':
      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Matching Results</h1>
              <p className="text-base sm:text-lg text-gray-600 px-2 sm:px-0">
                Review and finalize your mentor-mentee pairs
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Generated Pairs</h2>
                  <p className="text-sm text-gray-600">
                    {pairs.length} matches created from {mentors.length} mentors and {mentees.length} mentees
                  </p>
                </div>
                
                <div className="flex gap-3 mt-4 sm:mt-0">
                  <button
                    onClick={() => setCurrentStep('configure')}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← Reconfigure
                  </button>
                  <button
                    onClick={handleContinueToMessages}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue to Messages →
                  </button>
                </div>
              </div>

              <PairTable 
                pairs={pairs}
                mentors={mentors}
                mentees={mentees}
                onSwap={(pairId: string, newMentorId: string, justification: string) => {
                  // Update the global store - this will trigger re-render
                  swapPair(pairId, newMentorId);
                  
                  // Log for tracking/audit
                  console.log('Swap completed:', { pairId, newMentorId, justification, timestamp: new Date().toISOString() });
                }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Progress Steps */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-center overflow-x-auto pb-2 px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center shrink-0">
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-colors ${
                    index === currentStepIndex
                      ? 'bg-blue-600 text-white'
                      : index < currentStepIndex
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index < currentStepIndex ? '✓' : index + 1}
                </div>
                <div className="mt-1 sm:mt-2 text-center min-w-0">
                  <div className="text-xs font-medium text-gray-900 hidden sm:block">{step.name}</div>
                  <div className="text-xs text-gray-500 hidden sm:block">{step.description}</div>
                  <div className="text-xs font-medium text-gray-900 sm:hidden truncate max-w-[60px]">{step.name}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="w-6 sm:w-12 h-0.5 bg-gray-300 mx-2 sm:mx-4 -mt-6"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {renderCurrentStep()}
    </div>
  );
}