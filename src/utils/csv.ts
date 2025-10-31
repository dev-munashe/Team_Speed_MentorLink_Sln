// src/utils/csv.ts
import Papa from 'papaparse';
import type { Mentor, Mentee } from '../types/domain';

export function splitList(s?: string): string[] {
  if (!s || typeof s !== 'string') return [];
  return s.split(/[,;]/).map(item => item.trim()).filter(item => item.length > 0);
}

export function normalizeSkill(s: string): string {
  return s.toLowerCase().trim();
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export async function parseMentorsCsv(file: File): Promise<Mentor[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const mentors: Mentor[] = results.data.map((row: any, index: number) => {
            // Handle various possible column names
            const name = row.name || row.Name || row.mentor_name || row['Mentor Name'] || '';
            const email = row.email || row.Email || row.mentor_email || row['Mentor Email'] || '';
            const skills = splitList(row.skills || row.Skills || row.expertise || row.Expertise || '');
            const interests = splitList(row.interests || row.Interests || '');
            const capacity = parseInt(row.capacity || row.Capacity || '1') || 1;
            const availability = splitList(row.availability_slots || row.availability || row.Availability || row['Availability Slots'] || '');
            
            if (!name || !email) {
              throw new Error(`Missing required fields (name, email) at row ${index + 1}`);
            }

            return {
              id: generateId(),
              name: name.trim(),
              email: email.trim(),
              phone: row.phone || row.Phone || '',
              role: row.role || row.Role || row.title || row.Title || '',
              org: row.org || row.Org || row.organization || row.Organization || row.company || row.Company || '',
              skills: skills.map(normalizeSkill),
              interests: interests.map(normalizeSkill),
              capacity,
              availability_slots: availability,
              location: row.location || row.Location || '',
              assignedCount: 0,
            };
          }).filter(mentor => mentor.name && mentor.email);

          resolve(mentors);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

export async function parseMenteesCsv(file: File): Promise<Mentee[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const mentees: Mentee[] = results.data.map((row: any, index: number) => {
            // Handle various possible column names
            const name = row.name || row.Name || row.mentee_name || row['Mentee Name'] || '';
            const email = row.email || row.Email || row.mentee_email || row['Mentee Email'] || '';
            const interests = splitList(row.interests || row.Interests || '');
            const preferredSkills = splitList(row.preferred_skills || row['Preferred Skills'] || row.skills_wanted || row['Skills Wanted'] || '');
            const availability = splitList(row.availability_slots || row.availability || row.Availability || row['Availability Slots'] || '');
            const goals = splitList(row.goals || row.Goals || row.learning_goals || row['Learning Goals'] || '');
            
            if (!name || !email) {
              throw new Error(`Missing required fields (name, email) at row ${index + 1}`);
            }

            return {
              id: generateId(),
              name: name.trim(),
              email: email.trim(),
              phone: row.phone || row.Phone || '',
              program_track: row.program_track || row['Program Track'] || row.track || row.Track || '',
              goals,
              interests: interests.map(normalizeSkill),
              preferred_skills: preferredSkills.map(normalizeSkill),
              availability_slots: availability,
              location: row.location || row.Location || '',
              priority: parseInt(row.priority || row.Priority || '0') || 0,
            };
          }).filter(mentee => mentee.name && mentee.email);

          resolve(mentees);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}