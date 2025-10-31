// src/pages/MatchingPage.tsx
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MatchControls } from '../components/MatchControls';
import { PairTable } from '../components/PairTable';
import { runGreedyMatcher } from '../utils/matching';
import { computeScore } from '../utils/scoring';

interface MatchingPageProps {
  onNavigateToAnalysis?: () => void;
}

export function MatchingPage({ onNavigateToAnalysis }: MatchingPageProps) {
  const { 
    mentors, 
    mentees, 
    pairs, 
    setPairs, 
    setScores
  } = useAppStore();
  
  const [threshold, setThreshold] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [exportToast, setExportToast] = useState<string | null>(null);

  const handleRunMatching = async (matchThreshold: number) => {
    setIsLoading(true);
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = runGreedyMatcher(mentors, mentees, matchThreshold);
      setPairs(result.pairs);
      setScores(result.scoresAudit);
    } catch (error) {
      console.error('Matching failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPairs([]);
    setScores([]);
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
      <div className="text-center py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Matching</h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">
          Please upload mentor and mentee data first to start matching.
        </p>
        <div className="text-sm text-gray-500">
          Current data: {mentors.length} mentors, {mentees.length} mentees
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mentor-Mentee Matching</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base px-4">
          Run the matching algorithm to pair mentors with mentees
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <MatchControls
            onRunMatching={handleRunMatching}
            onReset={handleReset}
            isLoading={isLoading}
            threshold={threshold}
            onThresholdChange={setThreshold}
          />
        </div>
        
        <div className="lg:col-span-2">
          {pairs.length > 0 ? (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Matching Summary</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{pairs.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Pairs Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {Math.round(pairs.reduce((sum, pair) => sum + pair.score, 0) / pairs.length)}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Avg Score</div>
                </div>
                <div className="text-center col-span-2 sm:col-span-1">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                    {mentees.filter(mentee => !pairs.some(pair => pair.menteeId === mentee.id)).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Unmatched</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  ✅ Matching complete! View detailed analysis for each pair.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={exportToCSV}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  >
                    Quick Export
                  </button>
                  <button
                    onClick={onNavigateToAnalysis}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Analyze Pairs
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg border-2 border-dashed border-gray-300 text-center">
              <div className="text-gray-400 text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Match</h3>
              <p className="text-gray-600 text-sm">
                Use the controls on the left to run the matching algorithm and create mentor-mentee pairs.
              </p>
            </div>
          )}
        </div>
      </div>

      <PairTable
        pairs={pairs}
        mentors={mentors}
        mentees={mentees}
        onSwap={handleSwap}
      />

      {/* Export Section */}
      {pairs.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Export Matching Results</h3>
              <p className="text-sm text-gray-600 mt-1">
                Download {pairs.length} matches in your preferred format
              </p>
            </div>
            <div className="hidden sm:flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date().toLocaleDateString()}
            </div>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            
            <button
              onClick={exportToJSON}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Export JSON
            </button>
            
            <button
              onClick={exportSummaryReport}
              className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium shadow-sm sm:col-span-2 lg:col-span-1"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Summary Report
            </button>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="grid gap-2 sm:grid-cols-3 text-xs text-gray-600">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 shrink-0"></div>
                <div>
                  <strong>CSV:</strong> Perfect for Excel, Google Sheets, and data analysis tools
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 shrink-0"></div>
                <div>
                  <strong>JSON:</strong> Complete data structure for developers and integrations
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2 shrink-0"></div>
                <div>
                  <strong>Report:</strong> Human-readable summary for presentations and reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {pairs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Matching Algorithm Explanation</h3>
          <div className="text-xs sm:text-sm text-blue-800 space-y-1">
            <p><strong>Scoring weights:</strong> Skills (40%), Interests (20%), Availability (20%), Location (10%), Capacity (10%)</p>
            <p><strong>Process:</strong> Mentees are evaluated against all mentors, best available match above threshold is selected</p>
            <p><strong>Fairness:</strong> Mentees are processed in random order to ensure fair distribution</p>
          </div>
        </div>
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