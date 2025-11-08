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
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = async (file: File) => {
    if (!file) return;

    setFile(file);
    setError(null);
    setLoading(true);

    try {
      let data: Mentor[] | Mentee[];
      
      if (kind === 'mentors') {
        data = await parseMentorsCsv(file);
      } else {
        data = await parseMenteesCsv(file);
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'text/csv') {
      handleFileChange(files[0]);
    }
  };

  const requiredColumns = kind === 'mentors'
    ? ['name', 'email', 'skills', 'capacity', 'availability_slots']
    : ['name', 'email', 'preferred_skills', 'availability_slots'];

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 transition-colors ${
          dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : existingData.length > 0 
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className={`mx-auto h-10 w-10 sm:h-12 sm:w-12 ${
            existingData.length > 0 ? 'text-green-500' : 'text-gray-400'
          }`}>
            {existingData.length > 0 ? (
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>
          <div className="mt-3 sm:mt-4">
            <label htmlFor={`file-upload-${kind}`} className="cursor-pointer">
              <span className={`mt-2 block text-sm font-medium ${
                existingData.length > 0 ? 'text-green-900' : 'text-gray-900'
              }`}>
                {existingData.length > 0 
                  ? `✓ ${existingData.length} ${kind} loaded - Click to replace`
                  : `Upload ${kind} CSV file or drag & drop here`
                }
              </span>
              <input
                id={`file-upload-${kind}`}
                name={`file-upload-${kind}`}
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={handleInputChange}
              />
              <span className="mt-1 block text-xs text-gray-500">
                {dragOver ? 'Drop your CSV file here' : 'CSV files only'}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Required columns for {kind}:</p>
        <p className="font-mono text-xs">{requiredColumns.join(', ')}</p>
        {kind === 'mentors' && (
          <p className="mt-1 text-gray-600">Optional: phone, role, org, interests, location</p>
        )}
        {kind === 'mentees' && (
          <p className="mt-1 text-gray-600">Optional: phone, program_track, goals, interests, location, priority</p>
        )}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">Processing CSV...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {existingData.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-green-700">
            ✓ Loaded {existingData.length} {kind}
          </div>
        </div>
      )}

      {preview.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs sm:text-sm font-medium text-gray-900">Preview (first 5 rows):</h4>
          <div className="overflow-x-auto -mx-1 sm:mx-0">
            <table className="min-w-full text-xs border border-gray-300 rounded">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview[0] || {}).slice(0, 4).map((key) => (
                    <th key={key} className="px-1 sm:px-2 py-1 text-left border-b border-gray-300 font-medium text-xs">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {Object.values(row).slice(0, 4).map((value: any, i) => (
                      <td key={i} className="px-1 sm:px-2 py-1 border-b border-gray-200 text-xs">
                        {Array.isArray(value) ? value.join(', ') : String(value || '').slice(0, 20)}
                        {String(value || '').length > 20 && '...'}
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