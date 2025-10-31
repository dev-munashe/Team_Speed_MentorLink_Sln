// src/types/domain.ts
export type Slot = string; // e.g., "Mon 17:00-19:00"
export type Id = string;

export interface Mentor {
  id: Id;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  org?: string;
  skills: string[];       // comma-separated in CSV
  interests: string[];    // comma-separated in CSV
  capacity: number;
  availability_slots: Slot[];
  location?: string;
  assignedCount?: number;
}

export interface Mentee {
  id: Id;
  name: string;
  email: string;
  phone?: string;
  program_track?: string;
  goals?: string[];       // comma-separated in CSV
  interests: string[];    // comma-separated in CSV
  preferred_skills: string[];
  availability_slots: Slot[];
  location?: string;
  priority?: number;      // for future; default 0
}

export interface MatchScore {
  mentorId: Id;
  menteeId: Id;
  score: number; // 0–100
  reasons: { key: string; contribution: number; note?: string }[];
}

export type PairStatus = "NOT_SENT" | "SENT" | "BOOKED";

export interface Pairing {
  id: Id;
  mentorId: Id;
  menteeId: Id;
  score: number;
  status: PairStatus;
}

export interface IntroTemplateVars {
  mentor_name: string;
  mentor_email: string;
  mentee_name: string;
  mentee_email: string;
  program_name: string;
  one_line_reason: string;
  admin_name: string;
  admin_email: string;
  admin_phone?: string;
}