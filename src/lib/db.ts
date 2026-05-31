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

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  url: string;
  isLocked: boolean;
  description?: string;
  isPreview?: boolean;
  resources?: { name: string; url: string; type: 'pdf' | 'zip' | 'project' }[];
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  desc: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  rating: number;
  price: string;
  originalPrice: string;
  thumbnail: string;
  tags: string[];
  isPremium: boolean;
  certificateEnabled: boolean;
  modules: Module[];
}

export interface Review {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface VerifiedCertificate {
  id: string;
  certNumber: string;
  studentName: string;
  courseName: string;
  completionDate: string;
  verificationCode: string;
  grade: string;
}

export interface WebsiteConfig {
  heroHeading: string;
  heroSubheading: string;
  statsStudents: string;
  statsLessons: string;
  statsCerts: string;
  statsProjects: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactAbuseEmail: string;
  aboutMission: string;
  aboutProblem: string;
  aboutDeliver: string[];
  footerTagline: string;
  footerCopyright: string;
  founderName: string;
  founderRole: string;
  founderBio: string;
}

// Default course content scaffolding
export const DEFAULT_COURSES: Course[] = [
  {
    id: 'electronics-basics',
    title: 'Electronics Basics & Circuit Designing',
    desc: 'Master resistors, transistors, capacitors, diodes, and schematic design using TinkerCAD and EasyEDA.',
    duration: '10 Hours',
    difficulty: 'Beginner',
    lessons: 3,
    rating: 4.8,
    price: '₹999',
    originalPrice: '₹2,999',
    thumbnail: 'zap',
    tags: ['Basic', 'Electronics'],
    isPremium: false,
    certificateEnabled: true,
    modules: [
      {
        title: 'Module 1: Electronics Basics & Tinkering',
        lessons: [
          { id: 'eb-1-1', title: 'Lesson 1.1: Welcome & Course Roadmap', duration: '12m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: false, description: 'Get started with electronics.', isPreview: true },
          { id: 'eb-1-2', title: 'Lesson 1.2: Volts, Amps, Resistance & Multimeters', duration: '25m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: false, description: 'Learn multimeters.', isPreview: true },
          { id: 'eb-1-3', title: 'Lesson 1.3: Working with Resistors & LEDs', duration: '18m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true, description: 'Learn serial and parallel resistor connections.', isPreview: false, resources: [{ name: 'LED Wiring Guide.pdf', url: '#', type: 'pdf' }] },
        ]
      }
    ]
  },
  {
    id: 'beginner-iot-mastery',
    title: 'Beginner IoT Mastery Bootcamp',
    desc: 'Kickstart your IoT journey with basic sensors, cloud communication, and standard data logging techniques.',
    duration: '18 Hours',
    difficulty: 'Beginner',
    lessons: 3,
    rating: 4.9,
    price: '₹1,499',
    originalPrice: '₹3,999',
    thumbnail: 'globe',
    tags: ['IoT', 'Beginner'],
    isPremium: true,
    certificateEnabled: true,
    modules: [
      {
        title: 'Module 1: Basic Sensors & Cloud Connections',
        lessons: [
          { id: 'bio-1-1', title: 'Lesson 1.1: Introduction to IoT Ecosystem', duration: '15m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: false, description: 'Learn what IoT actually is.', isPreview: true },
          { id: 'bio-1-2', title: 'Lesson 1.2: Wiring DHT11 Temperature Sensor', duration: '22m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true, description: 'Logging relative humidity.', isPreview: false },
          { id: 'bio-1-3', title: 'Lesson 1.3: Uploading telemetry logs to Blynk', duration: '30m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true, description: 'Configure Blynk virtual pins.', isPreview: false },
        ]
      }
    ]
  },
  {
    id: 'arduino-mastery',
    title: 'Arduino Programming & Circuit Building',
    desc: 'Program Arduino Uno/Nano from scratch. Work with displays, relays, serial monitors, and physical buttons.',
    duration: '15 Hours',
    difficulty: 'Beginner',
    lessons: 3,
    rating: 4.9,
    price: '₹1,299',
    originalPrice: '₹3,499',
    thumbnail: 'cpu',
    tags: ['Arduino', 'Coding'],
    isPremium: true,
    certificateEnabled: true,
    modules: [
      {
        title: 'Module 1: Arduino Microcontroller Core Programming',
        lessons: [
          { id: 'ard-1-1', title: 'Lesson 1.1: Arduino IDE Installation & Setup', duration: '15m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: false, isPreview: true },
          { id: 'ard-1-2', title: 'Lesson 1.2: Writing Your First Sketch (Blink)', duration: '22m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
          { id: 'ard-1-3', title: 'Lesson 1.3: Analog vs Digital Pins', duration: '30m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true }
        ]
      }
    ]
  },
  {
    id: 'esp8266-iot',
    title: 'ESP8266 WiFi & Home Automation IoT',
    desc: 'Build smart appliances, web controllers, Blynk IoT dashboard, and link switches to custom cloud webservers.',
    duration: '20 Hours',
    difficulty: 'Intermediate',
    lessons: 3,
    rating: 4.7,
    price: '₹1,699',
    originalPrice: '₹4,999',
    thumbnail: 'wifi',
    tags: ['ESP8266', 'WiFi'],
    isPremium: true,
    certificateEnabled: true,
    modules: [
      {
        title: 'Module 1: ESP8266 WiFi & Smart Home Server Node',
        lessons: [
          { id: 'esp8-1-1', title: 'Lesson 1.1: Understanding ESP8266 WiFi Modes', duration: '20m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: false, isPreview: true },
          { id: 'esp8-1-2', title: 'Lesson 1.2: Hosting a Local Web Server to Control Relays', duration: '35m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
          { id: 'esp8-1-3', title: 'Lesson 1.3: Connecting to Blynk Cloud Panel', duration: '28m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true }
        ]
      }
    ]
  },
  {
    id: 'esp32-advanced-iot',
    title: 'ESP32 Advanced IoT with FreeRTOS & HTTP',
    desc: 'Explore ESP32 dual core, BLE, mesh networks, AWS IoT Core integrations, and custom database webhooks.',
    duration: '28 Hours',
    difficulty: 'Advanced',
    lessons: 3,
    rating: 4.9,
    price: '₹2,499',
    originalPrice: '₹7,999',
    thumbnail: 'rocket',
    tags: ['ESP32', 'Advanced'],
    isPremium: true,
    certificateEnabled: true,
    modules: [
      {
        title: 'Module 1: ESP32 Advanced IoT, Deep Sleep & FreeRTOS',
        lessons: [
          { id: 'esp3-1-1', title: 'Lesson 1.1: ESP32 Dual Core Architecture & Tasks', duration: '32m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: false, isPreview: true },
          { id: 'esp3-1-2', title: 'Lesson 1.2: Deep Sleep Mode & RTC RAM Logging', duration: '25m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
          { id: 'esp3-1-3', title: 'Lesson 1.3: FreeRTOS Task Management & Queues', duration: '40m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true }
        ]
      }
    ]
  },
  {
    id: 'real-iot-projects',
    title: 'Real-world Smart IoT Industrial Projects',
    desc: 'Assemble ESP32 Cam surveillance, autonomous robots, smart agricultural nodes, and automated RFID doorlocks.',
    duration: '32 Hours',
    difficulty: 'Advanced',
    lessons: 3,
    rating: 5.0,
    price: '₹2,999',
    originalPrice: '₹9,999',
    thumbnail: 'wrench',
    tags: ['Hardware', 'Projects'],
    isPremium: true,
    certificateEnabled: true,
    modules: [
      {
        title: 'Module 1: Real IoT Practical Capstone Projects',
        lessons: [
          { id: 'rip-1-1', title: 'Lesson 1.1: Build ESP32 CCTV Camera Server', duration: '45m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: false, isPreview: true },
          { id: 'rip-1-2', title: 'Lesson 1.2: Sync Sensor Logs to Google Firebase Realtime DB', duration: '50m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
          { id: 'rip-1-3', title: 'Lesson 1.3: Certificate Quiz Preparation & Graduation', duration: '15m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true }
        ]
      }
    ]
  }
];

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Aarav Mehta',
    role: 'ECE Student, IIT Bombay',
    text: 'The ESP32 Advanced course changed my engineering career. Building the automated security node with Telegram alerts gave me practical hardware skills that textbooks could never explain.',
    rating: 5,
    avatar: 'user',
  },
  {
    id: 'rev-2',
    name: 'Priya Sharma',
    role: 'IoT Developer, Bangalore',
    text: 'Highly recommend the IoT kits! Getting matching sensors and step-by-step videos resolved my circuit connection issues instantly. The dual English/Hindi explanations are extremely simple.',
    rating: 5,
    avatar: 'user',
  },
  {
    id: 'rev-3',
    name: 'Rohan Gupta',
    role: 'Hobbyist & Maker',
    text: 'I built a whole home automation system for my parents house using the ESP8266 WiFi modules course modules. The troubleshooting guides helped me solve the IP socket drop bugs in hours.',
    rating: 5,
    avatar: 'wrench',
  },
  {
    id: 'rev-4',
    name: 'Sneha Patel',
    role: 'Embedded Software Intern',
    text: 'Passed the Arduino and Electronics module quiz, got my premium certified developer certificate and secured my core embedded hardware internship last week! Unbelievable support!',
    rating: 5,
    avatar: 'award',
  },
];

export const DEFAULT_WEBSITE_CONFIG: WebsiteConfig = {
  heroHeading: 'Build Real IoT Projects, Not Just Theory',
  heroSubheading: 'Learn Arduino, ESP32 & ESP8266 through Real Projects, Video Lessons, Circuit Diagrams, Source Code, IoT Kits, Live Classes and Certifications.',
  statsStudents: '12,400+',
  statsLessons: '350+',
  statsCerts: '4,800+',
  statsProjects: '120+',
  contactEmail: 'support@techiotwarriors.com',
  contactPhone: '+91 98765 43210 (10 AM - 6 PM IST)',
  contactAddress: 'Tech IoT Warriors HQ, Sector 62, Noida, UP, India',
  contactAbuseEmail: 'abuse-prevention@techiotwarriors.com',
  aboutMission: 'Building India\'s largest and most premium learning platform for hardware prototyping, MCU firmware, and IoT development.',
  aboutProblem: 'Traditional computer science and electronics courses teach abstract theories, circuit equations, and memorized diagrams. But when students try to compile actual code, wire pullups, or transmit sensor values to a real database, they encounter errors, port detection bugs, and logic loops.\n\nTech IoT Warriors was established to fix this. We teach completely by building real practical prototypes. If you aren\'t plugging in wires, writing code in the IDE, and sending data to the cloud, you aren\'t learning!',
  aboutDeliver: [
    'Pre-Tested Matching IoT Kits: No more ordering broken sensors or wrong parts. We ship verified hardware matching our curriculum modules.',
    'Dual Language Instruction (English + Hindi): Easy, accessible explanations explaining embedded architecture logic.',
    'Real Doubt Resolvers: Paste compilation logs, stack traces, and schematic loops. Get expert debugger assistance.'
  ],
  footerTagline: 'India\'s most premium IoT learning platform. Build real projects with Arduino, ESP32 & ESP8266.',
  footerCopyright: '© 2026 Tech IoT Warriors. All rights reserved.',
  founderName: 'Nikhil Kumar',
  founderRole: 'CEO & Founder, Tech IoT Warriors',
  founderBio: 'Nikhil Kumar is an IoT Architect, Embedded Systems Specialist, and the Founder of Tech IoT Warriors. Driven by a mission to transform hardware education, he has helped thousands of students move past theory into building actual hardware prototypes, smart robotics, and enterprise IoT networks.'
};

// Course getters / setters
export function getCourses(): Course[] {
  if (typeof window === 'undefined') return DEFAULT_COURSES;
  const courses = localStorage.getItem('courses_db');
  if (!courses) {
    localStorage.setItem('courses_db', JSON.stringify(DEFAULT_COURSES));
    return DEFAULT_COURSES;
  }
  return JSON.parse(courses);
}

export function saveCourses(courses: Course[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('courses_db', JSON.stringify(courses));
}

// Review getters / setters
export function getReviews(): Review[] {
  if (typeof window === 'undefined') return DEFAULT_REVIEWS;
  const reviews = localStorage.getItem('reviews_db');
  if (!reviews) {
    localStorage.setItem('reviews_db', JSON.stringify(DEFAULT_REVIEWS));
    return DEFAULT_REVIEWS;
  }
  return JSON.parse(reviews);
}

export function saveReviews(reviews: Review[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('reviews_db', JSON.stringify(reviews));
}

// WebsiteConfig getters / setters
export function getWebsiteConfig(): WebsiteConfig {
  if (typeof window === 'undefined') return DEFAULT_WEBSITE_CONFIG;
  const config = localStorage.getItem('website_config_db');
  if (!config) {
    localStorage.setItem('website_config_db', JSON.stringify(DEFAULT_WEBSITE_CONFIG));
    return DEFAULT_WEBSITE_CONFIG;
  }
  return JSON.parse(config);
}

export function saveWebsiteConfig(config: WebsiteConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('website_config_db', JSON.stringify(config));
}

// Backwards compatibility for homepage config
export function getHomepageConfig() {
  const config = getWebsiteConfig();
  return {
    heroHeading: config.heroHeading,
    heroSubheading: config.heroSubheading
  };
}

export function saveHomepageConfig(config: { heroHeading: string; heroSubheading: string }) {
  const current = getWebsiteConfig();
  saveWebsiteConfig({
    ...current,
    heroHeading: config.heroHeading,
    heroSubheading: config.heroSubheading
  });
}

// Verified Certificate getters / setters
export function getCertificates(): VerifiedCertificate[] {
  if (typeof window === 'undefined') return [];
  const certs = localStorage.getItem('certificates_db');
  return certs ? JSON.parse(certs) : [];
}

export function saveCertificates(certs: VerifiedCertificate[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('certificates_db', JSON.stringify(certs));
}

export function verifyCertificate(certNumber: string): VerifiedCertificate | null {
  const certs = getCertificates();
  return certs.find(c => c.certNumber.toUpperCase() === certNumber.trim().toUpperCase()) || null;
}

// User state simulation helper
const KEY_CURRENT_USER = 'iot_current_user';
const KEY_USERS_DB = 'iot_users_database';

export function getRegisteredUsers(): UserSession[] {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(KEY_USERS_DB);
  if (!users) {
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
