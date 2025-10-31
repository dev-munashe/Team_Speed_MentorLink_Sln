// src/utils/scoring.ts
import type { Mentor, Mentee } from '../types/domain';

export function jaccard(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 0;
  
  const setA = new Set(a.map(item => item.toLowerCase()));
  const setB = new Set(b.map(item => item.toLowerCase()));
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

export function availabilityOverlap(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  
  const setA = new Set(a.map(slot => slot.toLowerCase().trim()));
  const setB = new Set(b.map(slot => slot.toLowerCase().trim()));
  
  const hasOverlap = [...setA].some(slot => setB.has(slot));
  return hasOverlap ? 1 : 0;
}

export function locationProximity(a?: string, b?: string): number {
  if (!a || !b) return 0;
  return a.toLowerCase().trim() === b.toLowerCase().trim() ? 1 : 0;
}

export function capacityFitness(assigned: number, cap: number): number {
  if (assigned < cap) return 1;
  if (assigned === cap) return 0.2;
  return 0; // Over capacity
}

export function computeScore(
  mentor: Mentor, 
  mentee: Mentee, 
  assignedCount: number = 0
): { score: number; reasons: { key: string; contribution: number; note?: string }[] } {
  const weights = {
    skillOverlap: 0.40,
    interestOverlap: 0.20,
    availabilityOverlap: 0.20,
    locationProximity: 0.10,
    capacityLoad: 0.10,
  };

  const skillOverlap = jaccard(mentor.skills, mentee.preferred_skills);
  const interestOverlap = jaccard(mentor.interests, mentee.interests);
  const availOverlap = availabilityOverlap(mentor.availability_slots, mentee.availability_slots);
  const locationMatch = locationProximity(mentor.location, mentee.location);
  const capacityScore = capacityFitness(assignedCount, mentor.capacity);

  const contributions = [
    {
      key: 'Skills',
      contribution: skillOverlap * weights.skillOverlap * 100,
      note: `${Math.round(skillOverlap * 100)}% overlap in skills`,
    },
    {
      key: 'Interests',
      contribution: interestOverlap * weights.interestOverlap * 100,
      note: `${Math.round(interestOverlap * 100)}% overlap in interests`,
    },
    {
      key: 'Availability',
      contribution: availOverlap * weights.availabilityOverlap * 100,
      note: availOverlap > 0 ? 'Shared time slots available' : 'No shared availability',
    },
    {
      key: 'Location',
      contribution: locationMatch * weights.locationProximity * 100,
      note: locationMatch > 0 ? 'Same location' : 'Different locations',
    },
    {
      key: 'Capacity',
      contribution: capacityScore * weights.capacityLoad * 100,
      note: assignedCount < mentor.capacity ? 
        `Mentor available (${assignedCount}/${mentor.capacity})` : 
        assignedCount === mentor.capacity ?
        `Mentor at capacity (${assignedCount}/${mentor.capacity})` :
        `Mentor over capacity (${assignedCount}/${mentor.capacity})`,
    },
  ];

  const totalScore = Math.round(contributions.reduce((sum, c) => sum + c.contribution, 0));

  return {
    score: Math.max(0, Math.min(100, totalScore)),
    reasons: contributions,
  };
}