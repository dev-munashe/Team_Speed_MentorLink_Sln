// src/store/useAppStore.ts
import { create } from 'zustand';
import type { Mentor, Mentee, Pairing, MatchScore, PairStatus, SwapRequest } from '../types/domain';

interface AppState {
  mentors: Mentor[];
  mentees: Mentee[];
  scores: MatchScore[];     // all computed scores (optional; for audits)
  pairs: Pairing[];
  swapRequests: SwapRequest[];
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
  addSwapRequest: (r: Omit<SwapRequest, 'id' | 'status' | 'createdAt' | 'reviewedAt' | 'reviewedBy'>) => void;
  approveSwapRequest: (requestId: string, approve: boolean, reviewer?: string) => void;
  addManualPair: (mentorId: string, menteeId: string, score: number, reason: string) => void;
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
  swapRequests: [],
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
      swapRequests: state.swapRequests,
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

  addSwapRequest: (r) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newReq: SwapRequest = {
      id,
      pairId: r.pairId,
      oldMentorId: r.oldMentorId,
      newMentorId: r.newMentorId,
      justification: r.justification,
      requestedBy: r.requestedBy,
      status: 'PENDING',
      createdAt: new Date(),
    };
    const swapRequests = [...(get().swapRequests || []), newReq];
    set({ swapRequests });
    saveToStorage(get());
  },

  approveSwapRequest: (requestId, approve, reviewer) => {
    const original = (get().swapRequests || []);
    const swapRequests: SwapRequest[] = original.map(req => {
      if (req.id === requestId) {
        const updated: SwapRequest = {
          ...req,
          status: approve ? 'APPROVED' : 'REJECTED',
          reviewedAt: new Date(),
          reviewedBy: reviewer,
        };
        // Perform the swap if approved
        if (approve) {
          get().swapPair(req.pairId, req.newMentorId);
        }
        return updated;
      }
      return req;
    });
    set({ swapRequests });
    saveToStorage(get());
  },

  addManualPair: (mentorId, menteeId, score, reason) => {
    const id = `manual-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newPair: Pairing = {
      id,
      mentorId,
      menteeId,
      score,
      status: 'NOT_SENT'
    };
    
    const pairs = [...get().pairs, newPair];
    set({ pairs });
    saveToStorage(get());
    
    // Log the manual pair creation
    console.log('Manual pair created:', {
      pairId: id,
      mentorId,
      menteeId,
      score,
      reason,
      timestamp: new Date().toISOString()
    });
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