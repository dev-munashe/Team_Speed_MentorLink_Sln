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
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Upload CSV Files</h1>
        <p className="mt-2 text-gray-600">
          Upload your mentor and mentee data to get started with matching
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Mentors</h2>
          <UploadCsv
            kind="mentors"
            onDataLoaded={(data) => setMentors(data as Mentor[])}
            existingData={mentors}
          />
          
          <div className="text-xs text-gray-500">
            <p className="font-medium">Sample mentor CSV columns:</p>
            <div className="mt-1 space-y-1">
              <p>name, email, skills, capacity, availability_slots</p>
              <p>Optional: phone, role, org, interests, location</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Mentees</h2>
          <UploadCsv
            kind="mentees"
            onDataLoaded={(data) => setMentees(data as Mentee[])}
            existingData={mentees}
          />
          
          <div className="text-xs text-gray-500">
            <p className="font-medium">Sample mentee CSV columns:</p>
            <div className="mt-1 space-y-1">
              <p>name, email, preferred_skills, availability_slots</p>
              <p>Optional: phone, program_track, goals, interests, location, priority</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {mentors.length > 0 && <span>✓ {mentors.length} mentors loaded</span>}
            {mentors.length > 0 && mentees.length > 0 && ' • '}
            {mentees.length > 0 && <span>✓ {mentees.length} mentees loaded</span>}
          </div>
          
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
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
        <h3 className="font-medium text-blue-900 mb-2">Sample Data Format</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Mentors:</strong> Include skills they can teach and their availability. Skills and availability should be comma-separated.</p>
          <p><strong>Mentees:</strong> Include preferred_skills they want to learn and their availability.</p>
          <p><strong>Availability format:</strong> Use any consistent format like "Mon 17:00-19:00, Tue 18:00-20:00"</p>
        </div>
      </div>
    </div>
  );
}