// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  User, 
  AuthContextType, 
  LoginCredentials, 
  SignupData,
  AdminProfile,
  MentorProfile,
  MenteeProfile
} from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo/prototype (replace with real API later)
const MOCK_USERS: User[] = [
  {
    id: 'admin-1',
    email: 'admin@mentorlink.com',
    password: 'admin123',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    profileId: 'admin-profile-1'
  },
  {
    id: 'mentor-1',
    email: 'mentor@mentorlink.com',
    password: 'mentor123',
    role: 'mentor',
    isActive: true,
    createdAt: new Date('2024-01-02'),
    profileId: 'mentor-profile-1'
  },
  {
    id: 'mentee-1',
    email: 'mentee@mentorlink.com',
    password: 'mentee123',
    role: 'mentee',
    isActive: true,
    createdAt: new Date('2024-01-03'),
    profileId: 'mentee-profile-1'
  }
];

// Mock profiles (replace with real API later)
const MOCK_PROFILES: Record<string, AdminProfile | MentorProfile | MenteeProfile> = {
  'admin-profile-1': {
    id: 'admin-profile-1',
    userId: 'admin-1',
    name: 'System Administrator',
    phone: '+1-555-0123',
    permissions: ['upload_csv', 'run_matching', 'view_all_users', 'manage_pairings']
  } as AdminProfile,
  'mentor-profile-1': {
    id: 'mentor-profile-1',
    userId: 'mentor-1',
    name: 'John Doe',
    email: 'mentor@mentorlink.com',
    phone: '+1-555-0124',
    skills: ['JavaScript', 'React', 'Node.js'],
    interests: ['Web Development', 'Startups'],
    capacity: 3,
    availability_slots: ['Mon 17:00-19:00', 'Wed 17:00-19:00'],
    location: 'San Francisco',
    bio: 'Senior Software Engineer with 8 years of experience',
    experience: 'Full-stack developer specializing in React and Node.js',
    isAvailable: true,
    totalMentees: 2,
    rating: 4.8
  } as MentorProfile,
  'mentee-profile-1': {
    id: 'mentee-profile-1',
    userId: 'mentee-1',
    name: 'Jane Smith',
    email: 'mentee@mentorlink.com',
    phone: '+1-555-0125',
    program_track: 'Web Development',
    goals: ['Learn React', 'Build portfolio', 'Get job'],
    interests: ['Frontend Development', 'UI/UX'],
    preferred_skills: ['JavaScript', 'React', 'CSS'],
    availability_slots: ['Mon 17:00-19:00', 'Tue 19:00-21:00'],
    location: 'San Francisco',
    bio: 'Aspiring web developer transitioning from marketing',
    background: 'Marketing professional looking to switch to tech'
  } as MenteeProfile
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mentor-matcher-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Validate user still exists and is active
        const mockUser = MOCK_USERS.find(u => u.id === parsedUser.id && u.isActive);
        if (mockUser) {
          setUser({ ...mockUser, lastLoginAt: new Date() });
        } else {
          localStorage.removeItem('mentor-matcher-user');
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('mentor-matcher-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user by email and password (in real app, password would be hashed)
      const foundUser = MOCK_USERS.find(
        u => u.email === credentials.email && 
             u.password === credentials.password && 
             u.isActive
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      const userWithLastLogin = { ...foundUser, lastLoginAt: new Date() };
      setUser(userWithLastLogin);
      localStorage.setItem('mentor-matcher-user', JSON.stringify(userWithLastLogin));
      
      return userWithLastLogin; // Return the user for immediate use
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      if (MOCK_USERS.find(u => u.email === data.email)) {
        throw new Error('User with this email already exists');
      }

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Create new user (in real app, this would go to API)
      const newUser: User = {
        id: `${data.role}-${Date.now()}`,
        email: data.email,
        password: data.password,
        role: data.role,
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        profileId: `${data.role}-profile-${Date.now()}`
      };

      // Create profile based on role
      if (data.role === 'admin') {
        MOCK_PROFILES[newUser.profileId] = {
          id: newUser.profileId,
          userId: newUser.id,
          name: data.name,
          phone: data.phone,
          permissions: ['edit_profile']
        } as AdminProfile;
      }
      // For mentor/mentee, we'll create basic profiles that they can complete later

      MOCK_USERS.push(newUser);
      setUser(newUser);
      localStorage.setItem('mentor-matcher-user', JSON.stringify(newUser));
      
      return newUser; // Return the user for immediate use
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setError(null);
    localStorage.removeItem('mentor-matcher-user');
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}