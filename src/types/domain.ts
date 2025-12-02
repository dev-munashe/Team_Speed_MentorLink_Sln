// src/types/domain.ts
export type Slot = string; // e.g., "Mon 17:00-19:00"
export type Id = string;

// ===== USER SYSTEM & AUTHENTICATION =====
export type UserRole = 'admin' | 'mentor' | 'mentee';

export interface User {
  id: Id;
  email: string;
  password?: string; // For demo/prototype purposes
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  profileId: Id; // Links to specific profile type
}

export interface AdminProfile {
  id: Id;
  userId: Id;
  name: string;
  phone?: string;
  permissions: string[];
}

// Enhanced profile types that extend existing interfaces
export interface MentorProfile extends Mentor {
  userId: Id;
  bio?: string;
  experience?: string;
  linkedinUrl?: string;
  isAvailable: boolean;
  totalMentees?: number;
  rating?: number;
  preferences?: {
    maxMentees?: number;
    communicationStyle?: string;
    meetingFrequency?: string;
  };
}

export interface MenteeProfile extends Mentee {
  userId: Id;
  bio?: string;
  background?: string;
  linkedinUrl?: string;
  currentMentorId?: Id;
  preferences?: {
    mentorshipDuration?: string;
    communicationStyle?: string;
    meetingFrequency?: string;
  };
}

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

export type PairStatus = "NOT_SENT" | "SENT";

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

// ===== MESSAGING SYSTEM =====
export interface Conversation {
  id: Id;
  participants: Id[]; // User IDs
  pairId?: Id; // Optional link to pairing
  lastMessageAt: Date;
  isActive: boolean;
}

export interface Message {
  id: Id;
  conversationId: Id;
  senderId: Id;
  content: string;
  sentAt: Date;
  readAt?: Date;
  messageType: 'text' | 'system'; // system for automated messages
}

// ===== NOTIFICATIONS =====
export type NotificationType = 
  | 'new_match' 
  | 'new_message' 
  | 'profile_update' 
  | 'system_announcement'
  | 'meeting_reminder';

export interface Notification {
  id: Id;
  userId: Id;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string; // Optional link to relevant page
}

// ===== ENHANCED MATCHING =====
export interface MatchRequest {
  id: Id;
  menteeId: Id;
  mentorId: Id;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  createdAt: Date;
  respondedAt?: Date;
}

// ===== SWAP REQUESTS =====
export interface SwapRequest {
  id: Id;
  pairId: Id;
  oldMentorId: Id;
  newMentorId: Id;
  justification: string;
  requestedBy?: string; // admin id or email
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}