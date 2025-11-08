// src/pages/UploadPage.tsx
import { useState } from 'react';
import { UploadCsv } from '../components/UploadCsv';
import { useAppStore } from '../store/useAppStore';
import type { Mentor, Mentee } from '../types/domain';

interface UploadPageProps {
  onNext: () => void;
}

// Progress Steps Component
function ProgressSteps({ currentStep }: { currentStep: number }) {
  const steps = [
    { id: 1, name: 'Upload Data', shortName: 'Upload', description: 'Import CSV files' },
    { id: 2, name: 'Configure Match', shortName: 'Config', description: 'Set parameters' },
    { id: 3, name: 'Review Results', shortName: 'Review', description: 'Analyze pairs' },
    { id: 4, name: 'Export', shortName: 'Export', description: 'Download matches' }
  ];

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-center overflow-x-auto pb-2 px-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center shrink-0">
            <div className="flex flex-col items-center min-w-0">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-colors ${
                  step.id === currentStep
                    ? 'bg-blue-600 text-white'
                    : step.id < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.id < currentStep ? '✓' : step.id}
              </div>
              <div className="mt-1 sm:mt-2 text-center min-w-0">
                <div className="text-xs font-medium text-gray-900 hidden sm:block">{step.name}</div>
                <div className="text-xs text-gray-500 hidden sm:block">{step.description}</div>
                <div className="text-xs font-medium text-gray-900 sm:hidden truncate max-w-[60px]">{step.shortName}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="w-6 sm:w-12 h-0.5 bg-gray-300 mx-2 sm:mx-4 -mt-6"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Hero Section Component
function HeroSection({ mentorCount, menteeCount }: { mentorCount: number; menteeCount: number }) {
  const hasData = mentorCount > 0 || menteeCount > 0;

  return (
    <div className="text-center py-8 sm:py-12 bg-blue-50 rounded-xl mb-6 sm:mb-8 border border-blue-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
          Welcome to Mentor Matcher
        </h1>
        <p className="text-base sm:text-xl text-gray-600 mb-4 sm:mb-6">
          Intelligent pairing system for mentors and mentees
        </p>
        
        {hasData ? (
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border inline-block max-w-full">
            <div className="flex items-center justify-center space-x-6 sm:space-x-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{mentorCount}</div>
                <div className="text-xs sm:text-sm text-gray-600">Mentors Loaded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">{menteeCount}</div>
                <div className="text-xs sm:text-sm text-gray-600">Mentees Loaded</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border inline-block max-w-full">
            <p className="text-sm sm:text-base text-gray-600 px-2 sm:px-0">
              Start by uploading your mentor and mentee data files below
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Quick Start Guide Component
function QuickStartGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  const downloadSampleCsv = (type: 'mentors' | 'mentees') => {
    const headers = type === 'mentors' 
      ? ['name', 'email', 'skills', 'capacity', 'availability_slots', 'phone', 'role', 'org', 'interests', 'location']
      : ['name', 'email', 'preferred_skills', 'availability_slots', 'phone', 'program_track', 'goals', 'interests', 'location', 'priority'];
    
    const sampleRow = type === 'mentors'
      ? ['John Smith', 'john@company.com', 'JavaScript,React,Node.js', '3', 'Mon 17:00-19:00,Wed 18:00-20:00', '+1234567890', 'Senior Developer', 'Tech Corp', 'Web Development,Teaching', 'New York']
      : ['Jane Doe', 'jane@student.com', 'JavaScript,React', 'Mon 17:00-19:00,Wed 18:00-20:00', '+1234567891', 'Computer Science', 'Learn web development', 'Frontend,Career Growth', 'New York', '1'];

    const csv = [headers, sampleRow].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sample-${type}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg mb-6 sm:mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 sm:p-4 text-left flex items-center justify-between hover:bg-blue-100 transition-colors touch-manipulation"
        style={{ touchAction: 'manipulation' }}
      >
        <div className="pr-4">
          <h3 className="font-semibold text-blue-900 text-sm sm:text-base">Quick Start Guide</h3>
          <p className="text-xs sm:text-sm text-blue-700">Need help getting started? Download sample files and see format requirements</p>
        </div>
        <svg
          className={`w-5 h-5 text-blue-600 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="p-3 sm:p-4 pt-0 border-t border-blue-200">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-blue-900 mb-2 sm:mb-3 text-sm sm:text-base">📊 Sample Files</h4>
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => downloadSampleCsv('mentors')}
                  className="w-full text-left p-3 bg-white rounded border hover:border-blue-300 transition-colors touch-manipulation"
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className="font-medium text-xs sm:text-sm">Download Sample Mentors CSV</div>
                  <div className="text-xs text-gray-600">Complete with all required and optional columns</div>
                </button>
                <button
                  onClick={() => downloadSampleCsv('mentees')}
                  className="w-full text-left p-3 bg-white rounded border hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-sm">Download Sample Mentees CSV</div>
                  <div className="text-xs text-gray-600">Complete with all required and optional columns</div>
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-900 mb-2">📋 Data Requirements</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <div>
                  <strong>Required for Mentors:</strong>
                  <div className="font-mono text-xs bg-white p-2 rounded mt-1">name, email, skills, capacity, availability_slots</div>
                </div>
                <div>
                  <strong>Required for Mentees:</strong>
                  <div className="font-mono text-xs bg-white p-2 rounded mt-1">name, email, preferred_skills, availability_slots</div>
                </div>
                <div className="text-xs text-blue-600">
                  💡 Skills should be comma-separated (e.g., "JavaScript,React,Node.js")
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function UploadPage({ onNext }: UploadPageProps) {
  const { mentors, mentees, setMentors, setMentees } = useAppStore();

  const canProceed = mentors.length > 0 && mentees.length > 0;
  const totalProgress = ((mentors.length > 0 ? 1 : 0) + (mentees.length > 0 ? 1 : 0)) / 2 * 100;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ProgressSteps currentStep={1} />
      
      <HeroSection mentorCount={mentors.length} menteeCount={mentees.length} />
      
      <QuickStartGuide />

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 mb-6 sm:mb-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              👨‍🏫 Mentors
              {mentors.length > 0 && (
                <span className="ml-3 px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-medium rounded-full">
                  {mentors.length} loaded
                </span>
              )}
            </h2>
          </div>
          
          <UploadCsv
            kind="mentors"
            onDataLoaded={(data) => setMentors(data as Mentor[])}
            existingData={mentors}
          />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              👨‍🎓 Mentees
              {mentees.length > 0 && (
                <span className="ml-3 px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-medium rounded-full">
                  {mentees.length} loaded
                </span>
              )}
            </h2>
          </div>
          
          <UploadCsv
            kind="mentees"
            onDataLoaded={(data) => setMentees(data as Mentee[])}
            existingData={mentees}
          />
        </div>
      </div>

      {/* Progress Indicator */}
      {(mentors.length > 0 || mentees.length > 0) && (
        <div className="bg-white rounded-xl border p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Upload Progress</h3>
            <span className="text-sm text-gray-600">{totalProgress.toFixed(0)}% Complete</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-3 sm:mb-4">
            <div 
              className="bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm">
              <div className={`flex items-center ${mentors.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${mentors.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Mentors {mentors.length > 0 ? `(${mentors.length})` : ''}
              </div>
              <div className={`flex items-center ${mentees.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${mentees.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Mentees {mentees.length > 0 ? `(${mentees.length})` : ''}
              </div>
            </div>
            
            <button
              onClick={onNext}
              disabled={!canProceed}
              className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base touch-manipulation ${
                canProceed
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl active:transform active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              {canProceed ? 'Start Matching Process →' : 'Upload Both Files to Continue'}
            </button>
          </div>
        </div>
      )}

      {/* Empty State Call to Action */}
      {mentors.length === 0 && mentees.length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 px-4">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🚀</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Ready to Get Started?</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Upload your mentor and mentee CSV files to begin the matching process</p>
          <p className="text-xs sm:text-sm text-gray-500">
            Need sample data? Use the Quick Start Guide above to download template files
          </p>
        </div>
      )}
    </div>
  );
}