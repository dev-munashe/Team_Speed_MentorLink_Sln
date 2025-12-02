// src/portals/admin/pages/AdminUploadPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCsv } from '../../../components/UploadCsv';
import { useAppStore } from '../../../store/useAppStore';
import { Upload, Users, Target, CheckCircle2, Trash2, AlertTriangle } from 'lucide-react';
import type { Mentor, Mentee } from '../../../types/domain';

export function AdminUploadPage() {
  const navigate = useNavigate();
  const { 
    mentors, 
    mentees, 
    setMentors, 
    setMentees,
    resetAll
  } = useAppStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetAll();
    setShowResetConfirm(false);
  };

  const handleMentorsUpload = (data: Mentor[] | Mentee[]) => {
    setMentors(data as Mentor[]);
  };

  const handleMenteesUpload = (data: Mentor[] | Mentee[]) => {
    setMentees(data as Mentee[]);
  };

  const hasData = mentors.length > 0 && mentees.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Data</h1>
          <p className="text-lg text-gray-600">
            Import your mentor and mentee data to get started with the matching process
          </p>
        </div>
        {(mentors.length > 0 || mentees.length > 0) && (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="font-medium">Clear All</span>
          </button>
        )}
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Clear All Data?
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              This will permanently delete all uploaded mentors, mentees, and any existing pairs. You'll need to re-upload your CSV files to start fresh.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Status Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${mentors.length > 0 ? 'bg-green-100' : 'bg-blue-100'}`}>
              {mentors.length > 0 ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <Users className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Mentors</h3>
              <p className="text-sm text-gray-600">
                {mentors.length > 0 ? `${mentors.length} mentors uploaded` : 'Upload mentor data'}
              </p>
            </div>
          </div>
          
          <UploadCsv
            kind="mentors"
            onDataLoaded={handleMentorsUpload}
            existingData={mentors}
          />
          
          {mentors.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                ✓ Successfully uploaded {mentors.length} mentors
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${mentees.length > 0 ? 'bg-green-100' : 'bg-blue-100'}`}>
              {mentees.length > 0 ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <Target className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Mentees</h3>
              <p className="text-sm text-gray-600">
                {mentees.length > 0 ? `${mentees.length} mentees uploaded` : 'Upload mentee data'}
              </p>
            </div>
          </div>
          
          <UploadCsv
            kind="mentees"
            onDataLoaded={handleMenteesUpload}
            existingData={mentees}
          />
          
          {mentees.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                ✓ Successfully uploaded {mentees.length} mentees
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      {hasData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Ready for Matching</h3>
          </div>
          <p className="text-blue-700 mb-4">
            Great! You've uploaded both mentors and mentees. You can now proceed to configure and run the matching algorithm.
          </p>
          <button
            onClick={() => navigate('/admin/matching')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Matching →
          </button>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gray-50 border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">CSV Format Requirements</h3>
        <div className="grid gap-4 md:grid-cols-2 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Mentors CSV should include:</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• name, email, skills, interests</li>
              <li>• capacity (number), availability_slots</li>
              <li>• Optional: phone, role, org, location</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Mentees CSV should include:</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• name, email, goals, interests</li>
              <li>• preferred_skills, availability_slots</li>
              <li>• Optional: phone, program_track, location</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}