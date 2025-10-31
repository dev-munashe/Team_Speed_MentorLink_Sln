// src/components/UploadCsv.tsx
import { useState } from 'react';
import type { Mentor, Mentee } from '../types/domain';
import { parseMentorsCsv, parseMenteesCsv } from '../utils/csv';

interface UploadCsvProps {
  kind: 'mentors' | 'mentees';
  onDataLoaded: (data: Mentor[] | Mentee[]) => void;
  existingData?: Mentor[] | Mentee[];
}

export function UploadCsv({ kind, onDataLoaded, existingData = [] }: UploadCsvProps) {
  const [, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setLoading(true);

    try {
      let data: Mentor[] | Mentee[];
      
      if (kind === 'mentors') {
        data = await parseMentorsCsv(selectedFile);
      } else {
        data = await parseMenteesCsv(selectedFile);
      }

      setPreview(data.slice(0, 5)); // Show first 5 rows
      onDataLoaded(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
      setPreview([]);
    } finally {
      setLoading(false);
    }
  };

  const requiredColumns = kind === 'mentors'
    ? ['name', 'email', 'skills', 'capacity', 'availability_slots']
    : ['name', 'email', 'preferred_skills', 'availability_slots'];

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="mt-4">
            <label htmlFor={`file-upload-${kind}`} className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Upload {kind} CSV file
              </span>
              <input
                id={`file-upload-${kind}`}
                name={`file-upload-${kind}`}
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={handleFileChange}
              />
              <span className="mt-1 block text-xs text-gray-500">
                CSV files only
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <p className="font-medium">Required columns for {kind}:</p>
        <p>{requiredColumns.join(', ')}</p>
        {kind === 'mentors' && (
          <p className="mt-1">Optional: phone, role, org, interests, location</p>
        )}
        {kind === 'mentees' && (
          <p className="mt-1">Optional: phone, program_track, goals, interests, location, priority</p>
        )}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Processing CSV...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {existingData.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="text-sm text-green-700">
            ✓ Loaded {existingData.length} {kind}
          </div>
        </div>
      )}

      {preview.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Preview (first 5 rows):</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview[0] || {}).slice(0, 6).map((key) => (
                    <th key={key} className="px-2 py-1 text-left border-b border-gray-300 font-medium">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {Object.values(row).slice(0, 6).map((value: any, i) => (
                      <td key={i} className="px-2 py-1 border-b border-gray-200">
                        {Array.isArray(value) ? value.join(', ') : String(value || '').slice(0, 30)}
                        {String(value || '').length > 30 && '...'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}