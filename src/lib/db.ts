'use client';

export interface UserSession {
  email: string;
  name: string;
  phone?: string;
  role: 'Super Admin' | 'Instructor' | 'Moderator' | 'Student';
  isActive: boolean;
  isSuspended: boolean;
  status: 'Pending Verification' | 'Active' | 'None';
  devices: string[];
  currentSessionId: string;
}

// Global default courses configuration that admin can edit
export const DEFAULT_HOMEPAGE_TEXT = {
  heroHeading: 'Build Real IoT Projects, Not Just Theory',
  heroSubheading: 'Learn Arduino, ESP32 & ESP8266 through Real Projects, Video Lessons, Circuit Diagrams, Source Code, IoT Kits, Live Classes and Certifications.'
};

export function getHomepageConfig() {
  if (typeof window === 'undefined') return DEFAULT_HOMEPAGE_TEXT;
  const data = localStorage.getItem('homepage_config');
  return data ? JSON.parse(data) : DEFAULT_HOMEPAGE_TEXT;
}

export function saveHomepageConfig(config: typeof DEFAULT_HOMEPAGE_TEXT) {
  localStorage.setItem('homepage_config', JSON.stringify(config));
}

// User state simulation helper
const KEY_CURRENT_USER = 'iot_current_user';
const KEY_USERS_DB = 'iot_users_database';

export function getRegisteredUsers(): UserSession[] {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(KEY_USERS_DB);
  if (!users) {
    // Scaffold initial accounts
    const initialUsers: UserSession[] = [
      {
        email: 'admin@techiotwarriors.com',
        name: 'Super Admin Devendra',
        phone: '+91 99999 88888',
        role: 'Super Admin',
        isActive: true,
        isSuspended: false,
        status: 'Active',
        devices: ['Chrome Windows-PC Session-1'],
        currentSessionId: 'session_admin_123'
      },
      {
        email: 'student@techiotwarriors.com',
        name: 'Amit Patel',
        phone: '+91 88888 77777',
        role: 'Student',
        isActive: true,
        isSuspended: false,
        status: 'Active',
        devices: ['Safari MacOS Session-2'],
        currentSessionId: 'session_student_123'
      },
      {
        email: 'newbie@techiotwarriors.com',
        name: 'Suresh Kumar',
        phone: '+91 77777 66666',
        role: 'Student',
        isActive: false,
        isSuspended: false,
        status: 'Pending Verification',
        devices: [],
        currentSessionId: ''
      }
    ];
    localStorage.setItem(KEY_USERS_DB, JSON.stringify(initialUsers));
    return initialUsers;
  }
  return JSON.parse(users);
}

export function updateUsersDb(users: UserSession[]) {
  localStorage.setItem(KEY_USERS_DB, JSON.stringify(users));
}

export function getCurrentUser(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(KEY_CURRENT_USER);
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: UserSession | null) {
  if (user === null) {
    localStorage.removeItem(KEY_CURRENT_USER);
  } else {
    localStorage.setItem(KEY_CURRENT_USER, JSON.stringify(user));
  }
}
