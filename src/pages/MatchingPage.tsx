// src/pages/MatchingPage.tsx
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MatchControls } from '../components/MatchControls';
import { Analytics } from '../components/Analytics';
import { PairTable } from '../components/PairTable';
import { runGreedyMatcher } from '../utils/matching';
import { computeScore } from '../utils/scoring';

export function MatchingPage() {
  const { 
    mentors, 
    mentees, 
    pairs, 
    setPairs, 
    setScores
  } = useAppStore();
  
  const [threshold, setThreshold] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Matching</h1>
        <p className="text-gray-600 mb-6">
          Please upload mentor and mentee data first to start matching.
        </p>
        <div className="text-sm text-gray-500">
          Current data: {mentors.length} mentors, {mentees.length} mentees
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Mentor-Mentee Matching</h1>
        <p className="mt-2 text-gray-600">
          Run the matching algorithm to pair mentors with mentees
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
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
          <Analytics
            mentors={mentors}
            mentees={mentees}
            pairs={pairs}
          />
        </div>
      </div>

      <PairTable
        pairs={pairs}
        mentors={mentors}
        mentees={mentees}
        onSwap={handleSwap}
      />
      
      {pairs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Matching Algorithm Explanation</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Scoring weights:</strong> Skills (40%), Interests (20%), Availability (20%), Location (10%), Capacity (10%)</p>
            <p><strong>Process:</strong> Mentees are evaluated against all mentors, best available match above threshold is selected</p>
            <p><strong>Fairness:</strong> Mentees are processed in random order to ensure fair distribution</p>
          </div>
        </div>
      )}
    </div>
  );
}