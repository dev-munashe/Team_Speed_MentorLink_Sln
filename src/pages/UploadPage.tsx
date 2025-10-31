// src/pages/UploadPage.tsx
import { UploadCsv } from '../components/UploadCsv';
import { useAppStore } from '../store/useAppStore';
import type { Mentor, Mentee } from '../types/domain';

interface UploadPageProps {
  onNext: () => void;
}

export function UploadPage({ onNext }: UploadPageProps) {
  const { mentors, mentees, setMentors, setMentees } = useAppStore();

  const canProceed = mentors.length > 0 && mentees.length > 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Upload CSV Files</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base px-4">
          Upload your mentor and mentee data to get started with matching
        </p>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Mentors</h2>
          <UploadCsv
            kind="mentors"
            onDataLoaded={(data) => setMentors(data as Mentor[])}
            existingData={mentors}
          />
          
          <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Sample mentor CSV columns:</p>
            <div className="space-y-1">
              <p className="font-mono text-xs">name, email, skills, capacity, availability_slots</p>
              <p className="text-gray-600">Optional: phone, role, org, interests, location</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Mentees</h2>
          <UploadCsv
            kind="mentees"
            onDataLoaded={(data) => setMentees(data as Mentee[])}
            existingData={mentees}
          />
          
          <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Sample mentee CSV columns:</p>
            <div className="space-y-1">
              <p className="font-mono text-xs">name, email, preferred_skills, availability_slots</p>
              <p className="text-gray-600">Optional: phone, program_track, goals, interests, location, priority</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-600 text-center sm:text-left">
            {mentors.length > 0 && <span>✓ {mentors.length} mentors loaded</span>}
            {mentors.length > 0 && mentees.length > 0 && <span className="hidden sm:inline"> • </span>}
            {mentees.length > 0 && <span className={mentors.length > 0 ? "block sm:inline" : ""}>✓ {mentees.length} mentees loaded</span>}
          </div>
          
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              canProceed
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Matching
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Sample Data Format</h3>
        <div className="text-xs sm:text-sm text-blue-800 space-y-2">
          <p><strong>Mentors:</strong> Include skills they can teach and their availability. Skills and availability should be comma-separated.</p>
          <p><strong>Mentees:</strong> Include preferred_skills they want to learn and their availability.</p>
          <p><strong>Availability format:</strong> Use any consistent format like "Mon 17:00-19:00, Tue 18:00-20:00"</p>
        </div>
      </div>
    </div>
  );
}