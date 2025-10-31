// src/store/useAppStore.ts
import { create } from 'zustand';
import type { Mentor, Mentee, Pairing, MatchScore, PairStatus } from '../types/domain';

interface AppState {
  mentors: Mentor[];
  mentees: Mentee[];
  scores: MatchScore[];     // all computed scores (optional; for audits)
  pairs: Pairing[];
  template: string;
  programName: string;
  admin: { name: string; email: string; phone?: string };
  setMentors: (x: Mentor[]) => void;
  setMentees: (x: Mentee[]) => void;
  setScores: (x: MatchScore[]) => void;
  setPairs: (x: Pairing[]) => void;
  setTemplate: (t: string) => void;
  setProgramName: (n: string) => void;
  setAdmin: (a: { name: string; email: string; phone?: string }) => void;
  updatePairStatus: (pairId: string, status: PairStatus) => void;
  swapPair: (pairId: string, newMentorId?: string, newMenteeId?: string) => void;
  resetAll: () => void;
}

const defaultTemplate = `Hi {{mentor_name}} and {{mentee_name}} — excited to connect you for {{program_name}}.

Why this match: {{one_line_reason}}

Next steps: please share your availability and pick a time for your first 20–30 min chat.

— {{admin_name}}, Program Team ({{admin_email}} {{admin_phone}})`;

const defaultState = {
  mentors: [],
  mentees: [],
  scores: [],
  pairs: [],
  template: defaultTemplate,
  programName: 'Mentorship Program',
  admin: { name: '', email: '', phone: '' },
};

// Simple persistence helpers
const saveToStorage = (state: any) => {
  try {
    const dataToSave = {
      mentors: state.mentors,
      mentees: state.mentees,
      scores: state.scores,
      pairs: state.pairs,
      template: state.template,
      programName: state.programName,
      admin: state.admin,
    };
    localStorage.setItem('mentor-matcher-data', JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem('mentor-matcher-data');
    if (saved) {
      return { ...defaultState, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return defaultState;
};

export const useAppStore = create<AppState>((set, get) => ({
  ...loadFromStorage(),
  
  setMentors: (mentors) => {
    set({ mentors });
    saveToStorage(get());
  },
  
  setMentees: (mentees) => {
    set({ mentees });
    saveToStorage(get());
  },
  
  setScores: (scores) => {
    set({ scores });
    saveToStorage(get());
  },
  
  setPairs: (pairs) => {
    set({ pairs });
    saveToStorage(get());
  },
  
  setTemplate: (template) => {
    set({ template });
    saveToStorage(get());
  },
  
  setProgramName: (programName) => {
    set({ programName });
    saveToStorage(get());
  },
  
  setAdmin: (admin) => {
    set({ admin });
    saveToStorage(get());
  },
  
  updatePairStatus: (pairId, status) => {
    const pairs = get().pairs.map(pair => 
      pair.id === pairId ? { ...pair, status } : pair
    );
    set({ pairs });
    saveToStorage(get());
  },
  
  swapPair: (pairId, newMentorId, newMenteeId) => {
    const pairs = get().pairs.map(pair => {
      if (pair.id === pairId) {
        return {
          ...pair,
          mentorId: newMentorId || pair.mentorId,
          menteeId: newMenteeId || pair.menteeId,
        };
      }
      return pair;
    });
    set({ pairs });
    saveToStorage(get());
  },
  
  resetAll: () => {
    set(defaultState);
    localStorage.removeItem('mentor-matcher-data');
  },
}));