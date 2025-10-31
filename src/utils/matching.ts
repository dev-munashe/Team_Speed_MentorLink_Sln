// src/utils/matching.ts
import type { Mentor, Mentee, Pairing, MatchScore } from '../types/domain';
import { computeScore } from './scoring';
import { generateId } from './csv';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function runGreedyMatcher(
  mentors: Mentor[],
  mentees: Mentee[],
  threshold: number = 50
): { pairs: Pairing[]; scoresAudit: MatchScore[] } {
  const assignedCount = new Map<string, number>();
  const pairs: Pairing[] = [];
  const scoresAudit: MatchScore[] = [];

  // Initialize assigned count for all mentors
  mentors.forEach(mentor => {
    assignedCount.set(mentor.id, mentor.assignedCount || 0);
  });

  // Sort mentees by priority (desc) then shuffle for fairness
  const sortedMentees = [...mentees].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  const shuffledMentees = shuffleArray(sortedMentees);

  for (const mentee of shuffledMentees) {
    let bestMatch: {
      mentorId: string;
      menteeId: string;
      score: number;
      reasons: { key: string; contribution: number; note?: string }[];
    } | null = null;

    // Evaluate all mentors for this mentee
    for (const mentor of mentors) {
      const currentAssigned = assignedCount.get(mentor.id) || 0;
      const { score, reasons } = computeScore(mentor, mentee, currentAssigned);
      
      // Always add to audit trail
      scoresAudit.push({
        mentorId: mentor.id,
        menteeId: mentee.id,
        score,
        reasons,
      });

      // Only consider if mentor has capacity and meets threshold
      if (currentAssigned < mentor.capacity && score >= threshold) {
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = {
            mentorId: mentor.id,
            menteeId: mentee.id,
            score,
            reasons,
          };
        }
      }
    }

    // If we found a suitable match, create the pairing
    if (bestMatch) {
      pairs.push({
        id: generateId(),
        mentorId: bestMatch.mentorId,
        menteeId: bestMatch.menteeId,
        score: bestMatch.score,
        status: 'NOT_SENT',
      });

      // Update the assigned count
      const currentCount = assignedCount.get(bestMatch.mentorId) || 0;
      assignedCount.set(bestMatch.mentorId, currentCount + 1);
    }
  }

  return { pairs, scoresAudit };
}