// src/types/forms.ts
import type { UserRole } from './domain';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  name: string;
  phone?: string;
}

export interface MentorProfileFormData {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  org?: string;
  skills: string;
  interests: string;
  capacity: number;
  availability_slots: string;
  location?: string;
  bio?: string;
  experience?: string;
  linkedinUrl?: string;
  isAvailable: boolean;
  preferences: {
    maxMentees: number;
    communicationStyle: string;
    meetingFrequency: string;
  };
}

export interface MenteeProfileFormData {
  name: string;
  email: string;
  phone?: string;
  program_track?: string;
  goals: string;
  interests: string;
  preferred_skills: string;
  availability_slots: string;
  location?: string;
  priority?: number;
  bio?: string;
  background?: string;
  linkedinUrl?: string;
  preferences: {
    mentorshipDuration: string;
    communicationStyle: string;
    meetingFrequency: string;
  };
}

export interface AdminProfileFormData {
  name: string;
  phone?: string;
  permissions: string[];
}

export interface MessageFormData {
  content: string;
}

export interface MatchRequestFormData {
  message?: string;
}