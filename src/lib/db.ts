'use client';

import { db } from './firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

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
  setDoc(doc(db, 'site_data', 'courses'), { value: courses }).catch(console.error);
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
  setDoc(doc(db, 'site_data', 'reviews'), { value: reviews }).catch(console.error);
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
  setDoc(doc(db, 'site_data', 'config'), { value: config }).catch(console.error);
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
  if (!certs) {
    const defaultCert: VerifiedCertificate[] = [
      {
        id: 'cert_tiw_default_1',
        certNumber: 'TIW-2026-0001',
        studentName: 'Nikhil Kumar',
        courseName: 'Real-world Smart IoT Industrial Projects',
        completionDate: '26 May 2026',
        verificationCode: 'TIW001',
        grade: 'Distinction'
      }
    ];
    localStorage.setItem('certificates_db', JSON.stringify(defaultCert));
    return defaultCert;
  }
  return JSON.parse(certs);
}

export function saveCertificates(certs: VerifiedCertificate[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('certificates_db', JSON.stringify(certs));
  setDoc(doc(db, 'site_data', 'certificates'), { value: certs }).catch(console.error);
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
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY_USERS_DB, JSON.stringify(users));
  setDoc(doc(db, 'site_data', 'users'), { value: users }).catch(console.error);
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

// ─────────────────────────────────────────────────────────
// CODE LIBRARY DATABASE
// ─────────────────────────────────────────────────────────
export interface CodeSnippet {
  id?: string;
  title: string;
  category: string;
  explanation: string;
  errorSolution: string;
  code: string;
}

export const DEFAULT_SNIPPETS: CodeSnippet[] = [
  {
    id: 'c-1',
    title: 'Non-Blocking Blink Code using millis()',
    category: 'LED Blink',
    explanation: 'Avoids using delay() which pauses execution of the microcontroller CPU. Uses millis() to compare current time elapsed with a previous timestamp, allowing multi-tasking.',
    errorSolution: 'If LED is constantly on, make sure interval variable has an appropriate millisecond value (e.g., 1000). Check logic condition parameters.',
    code: `unsigned long prevMillis = 0;\nconst long interval = 1000;\nint ledState = LOW;\n\nvoid setup() {\n  pinMode(2, OUTPUT);\n}\n\nvoid loop() {\n  unsigned long currentMillis = millis();\n  if (currentMillis - prevMillis >= interval) {\n    prevMillis = currentMillis;\n    ledState = (ledState == LOW) ? HIGH : LOW;\n    digitalWrite(2, ledState);\n  }\n}`
  },
  {
    id: 'c-2',
    title: 'Analog Sensor Reading with Rolling Average Filter',
    category: 'Sensor Code',
    explanation: 'Smooths out electric interference in analog values (like gas levels, light levels) by storing last 10 readings and calculating their mathematical mean average.',
    errorSolution: 'If readings return zero, make sure analog pin designation aligns with MCU hardware (e.g. A0 on Arduino, GPIO 34 on ESP32).',
    code: `const int numReadings = 10;\nint readings[numReadings];\nint readIndex = 0;\nint total = 0;\nint average = 0;\n\nvoid setup() {\n  Serial.begin(115200);\n  for (int i = 0; i < numReadings; i++) readings[i] = 0;\n}\n\nvoid loop() {\n  total = total - readings[readIndex];\n  readings[readIndex] = analogRead(34); // ESP32 Analog Pin\n  total = total + readings[readIndex];\n  readIndex = (readIndex + 1) % numReadings;\n  average = total / numReadings;\n  Serial.println(average);\n  delay(100);\n}`
  },
  {
    id: 'c-3',
    title: 'Secure WiFi Auto-Reconnect Setup',
    category: 'WiFi Connection',
    explanation: 'Connects to local WiFi. Checks WiFi.status() in loop and auto-triggers reconnect procedures if router socket drops connection.',
    errorSolution: 'Check SSID characters and password. In multi-band routers, make sure you connect to 2.4GHz band as most MCUs do not support 5GHz.',
    code: `#include <WiFi.h>\nconst char* ssid = "MyNetwork";\nconst char* pass = "MyPassword123";\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.begin(ssid, pass);\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(500);\n    Serial.print(".");\n  }\n  Serial.println("Connected!");\n}\n\nvoid loop() {\n  if (WiFi.status() != WL_CONNECTED) {\n    Serial.println("Connection Lost! Reconnecting...");\n    WiFi.disconnect();\n    WiFi.reconnect();\n    delay(5000);\n  }\n}`
  },
  {
    id: 'c-4',
    title: 'Sync Sensor Payload data to Google Firebase',
    category: 'Firebase',
    explanation: 'Pushes JSON strings containing humidity and temperature values directly to Firebase Realtime Database using REST API library.',
    errorSolution: 'Verify Firebase host link URL (must end with firebasedatabase.app) and auth database secret token.',
    code: `#include <WiFi.h>\n#include <FirebaseESP32.h>\n\nFirebaseData fbData;\nFirebaseConfig config;\nFirebaseAuth auth;\n\nvoid setup() {\n  Serial.begin(115200);\n  config.host = "PROJECT_ID.firebaseio.com";\n  config.signer.tokens.legacy_token = "AUTH_KEY";\n  Firebase.begin(&config, &auth);\n}\n\nvoid loop() {\n  float temp = 24.5;\n  if (Firebase.setFloat(fbData, "/sensors/temperature", temp)) {\n    Serial.println("Data Synced to Firebase!");\n  } else {\n    Serial.println(fbData.errorReason());\n  }\n  delay(5000);\n}`
  }
];

export function getCodeSnippets(): CodeSnippet[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('iot_code_snippets');
  if (!stored) {
    localStorage.setItem('iot_code_snippets', JSON.stringify(DEFAULT_SNIPPETS));
    return DEFAULT_SNIPPETS;
  }
  return JSON.parse(stored);
}

export function saveCodeSnippets(snippets: CodeSnippet[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('iot_code_snippets', JSON.stringify(snippets));
  setDoc(doc(db, 'site_data', 'snippets'), { value: snippets }).catch(console.error);
}

// ─────────────────────────────────────────────────────────
// CIRCUIT LIBRARY DATABASE
// ─────────────────────────────────────────────────────────
export interface Circuit {
  id?: string;
  title: string;
  category: string;
  pins: string;
  working: string;
  description: string;
  visual: string;
}

export const DEFAULT_CIRCUITS: Circuit[] = [
  {
    id: 'cir-1',
    title: 'LED Control Circuit with Current Limiting Resistor',
    category: 'LED',
    pins: 'LED Anode (+) to GPIO 2 via 220 Ohm Resistor, LED Cathode (-) to GND.',
    working: 'When the MCU GPIO goes HIGH (3.3V), current flows through the resistor and LED, illuminating it. The resistor prevents current from exceeding the 20mA LED rating.',
    description: 'The fundamental hello world circuit of hardware. Protects pins from high current burns.',
    visual: 'LED [Anode] ── [220Ω Resistor] ── GPIO 2 | LED [Cathode] ── GND'
  },
  {
    id: 'cir-2',
    title: 'Relay Switch Control with Optocoupler Isolation',
    category: 'Relay',
    pins: 'IN to GPIO 5, VCC to 5V, GND to GND. AC load wired in series with Normally Open (NO) terminal.',
    working: 'Triggering GPIO 5 LOW lights up the internal phototransistor inside the optocoupler. This triggers the electromagnet inside the mechanical relay, snapping the metallic contact to NO to close the external circuit.',
    description: 'Safe switching circuit to control 220V AC household appliances from a low-voltage 3.3V controller.',
    visual: 'GPIO 5 ── IN [Relay Module] | 220V Phase ── COM [Relay] | NO [Relay] ── AC Bulb'
  },
  {
    id: 'cir-3',
    title: 'I2C OLED Display Connection Guide',
    category: 'OLED',
    pins: 'VCC to 3.3V, GND to GND, SCL to GPIO 22, SDA to GPIO 21.',
    working: 'Communicates using Inter-Integrated Circuit (I2C) protocol. Serial Data (SDA) carries screen pixels byte payload, and Serial Clock (SCL) synchronizes packets transfer rate at 400kHz.',
    description: 'Clear, high-contrast monochrome screen connection for logging sensor values locally.',
    visual: 'SCL ── GPIO 22 | SDA ── GPIO 21 | VCC ── 3.3V | GND ── GND'
  },
  {
    id: 'cir-4',
    title: 'DHT11 / DHT22 Humidity & Temp Sensor Circuit',
    category: 'Sensors',
    pins: 'VCC to 3.3V, Data pin to GPIO 4, GND to GND. Add 10k Ohm pull-up resistor from Data pin to VCC.',
    working: 'DHT sensor transmits data packets consisting of 40 bits of temperature and humidity information over a single-wire bus. A pullup resistor holds the data bus line state stable.',
    description: 'Standard circuit for weather loggers. Reliable pullup setup prevents sensor timeouts.',
    visual: 'Data ── GPIO 4 (with 10kΩ Pull-up to 3.3V VCC) | GND ── GND'
  },
  {
    id: 'cir-5',
    title: 'SG90 Servo Motor Angle Controller',
    category: 'Motors',
    pins: 'PWM Orange Pin to GPIO 18, VCC Red to 5V (external), GND Brown to shared GND.',
    working: 'Sends a 50Hz PWM signal. Pulses between 1ms to 2ms dictate the servo position from 0 to 180 degrees. External power prevents ESP32 logic drops.',
    description: 'Precision mechanical positioning driver. Requires shared ground reference configuration.',
    visual: 'Orange PWM ── GPIO 18 | Red VCC ── 5V External | Shared GND ── GND'
  }
];

export function getCircuits(): Circuit[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('iot_circuits');
  if (!stored) {
    localStorage.setItem('iot_circuits', JSON.stringify(DEFAULT_CIRCUITS));
    return DEFAULT_CIRCUITS;
  }
  return JSON.parse(stored);
}

export function saveCircuits(circuits: Circuit[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('iot_circuits', JSON.stringify(circuits));
  setDoc(doc(db, 'site_data', 'circuits'), { value: circuits }).catch(console.error);
}

// ─────────────────────────────────────────────────────────
// PROJECTS SHOWCASE DATABASE
// ─────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  category: string;
  desc: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  components: string[];
  icon: string;
}

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'smart-home',
    title: 'Smart Home Automation Node',
    category: 'Automation Projects',
    desc: 'Control lights and AC relays via customized Blynk dashboard, mobile app, and offline physical switches.',
    complexity: 'Intermediate',
    components: ['ESP32', 'Relay Module', 'Optocouplers', 'Blynk Cloud'],
    icon: 'home',
  },
  {
    id: 'iot-weather-station',
    title: 'Solar Powered IoT Weather Station',
    category: 'Sensor Projects',
    desc: 'Log temperature, humidity, pressure, and UV index onto a ThingSpeak panel with low-power deep sleep mode.',
    complexity: 'Beginner',
    components: ['Arduino Uno', 'ESP8266', 'DHT22 Sensor', 'BMP280 Sensor'],
    icon: 'sun',
  },
  {
    id: 'robot-projects',
    title: 'WiFi Surveillance Robotic Rover',
    category: 'Robot Projects',
    desc: 'Steer an omnidirectional robot chassis via WebSocket stream. View low latency live video on dashboard.',
    complexity: 'Advanced',
    components: ['ESP32-CAM', 'L298D Motor Driver', 'Li-Ion Batteries', 'WebSockets'],
    icon: 'cpu',
  },
  {
    id: 'security-system',
    title: 'Smart RFID & Face Recognition Lock',
    category: 'Security System',
    desc: 'Verify credentials locally, trigger solonoids, send real-time intruder snapshot notifications to Telegram.',
    complexity: 'Advanced',
    components: ['ESP32 Cam', 'MFRC522 RFID Reader', 'Solenoid Lock', 'Telegram API'],
    icon: 'lock',
  },
  {
    id: 'sensor-projects',
    title: 'Wireless Air Quality & Gas Monitor',
    category: 'Sensor Projects',
    desc: 'Measure MQ135 PPM levels and display live charts on local OLED screen, push alerts when gas limits breach.',
    complexity: 'Beginner',
    components: ['Arduino Nano', 'MQ135 Gas Sensor', '0.96 Inch OLED', 'Buzzer'],
    icon: 'wifi',
  },
  {
    id: 'esp32-camera',
    title: 'AI Smart Parking Lot Sensor',
    category: 'ESP32 Camera',
    desc: 'Detect car presence using ultrasound grids, log analytics, sync slot availability to Google Firebase database.',
    complexity: 'Intermediate',
    components: ['ESP32', 'Ultrasonic Sensors', 'Firebase DB', 'Infrared Sensors'],
    icon: 'globe',
  },
];

export function getProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('iot_projects');
  if (!stored) {
    localStorage.setItem('iot_projects', JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  }
  return JSON.parse(stored);
}

export function saveProjects(projects: Project[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('iot_projects', JSON.stringify(projects));
  setDoc(doc(db, 'site_data', 'projects'), { value: projects }).catch(console.error);
}

// ─────────────────────────────────────────────────────────
// LIVE CLASSES DATABASE
// ─────────────────────────────────────────────────────────
export interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  status: 'LIVE NOW' | 'UPCOMING' | 'COMPLETED';
  meetingLink?: string;
  replayLink?: string;
}

export const DEFAULT_LIVE_CLASSES: LiveClass[] = [
  {
    id: 'live-1',
    title: 'ESP32 Cam Smart Facial Lock Assembly & Debugging',
    instructor: 'Mr. Devendra (Senior IoT Lead)',
    date: 'June 05, 2026',
    time: '07:00 PM - 08:30 PM IST',
    status: 'LIVE NOW',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 'live-2',
    title: 'Connecting Local Sensors to AWS IoT Core MQTT Server',
    instructor: 'Mr. Devendra (Senior IoT Lead)',
    date: 'June 12, 2026',
    time: '07:00 PM - 08:30 PM IST',
    status: 'UPCOMING',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 'live-3',
    title: 'Troubleshooting Common C++ Compiler & Stack Pointer Errors',
    instructor: 'Mr. Amit Sharma (Embedded Dev)',
    date: 'May 24, 2026',
    time: '06:00 PM - 07:30 PM IST',
    status: 'COMPLETED',
    replayLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'live-4',
    title: 'Understanding Multi-Threading on ESP32 Dual Core using FreeRTOS',
    instructor: 'Mr. Devendra (Senior IoT Lead)',
    date: 'May 17, 2026',
    time: '07:00 PM - 09:00 PM IST',
    status: 'COMPLETED',
    replayLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  }
];

export function getLiveClasses(): LiveClass[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('iot_live_classes');
  if (!stored) {
    localStorage.setItem('iot_live_classes', JSON.stringify(DEFAULT_LIVE_CLASSES));
    return DEFAULT_LIVE_CLASSES;
  }
  return JSON.parse(stored);
}

export function saveLiveClasses(classes: LiveClass[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('iot_live_classes', JSON.stringify(classes));
  setDoc(doc(db, 'site_data', 'live_classes'), { value: classes }).catch(console.error);
}

// Handwritten Signature settings
export function getSignatureConfig() {
  if (typeof window === 'undefined') {
    return { name: 'Nikhil Kumar', designation: 'CEO & Founder', image: '' };
  }
  const saved = localStorage.getItem('certificate_signature_config');
  return saved ? JSON.parse(saved) : { name: 'Nikhil Kumar', designation: 'CEO & Founder', image: '' };
}

export function saveSignatureConfig(config: { name: string; designation: string; image: string }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('certificate_signature_config', JSON.stringify(config));
  setDoc(doc(db, 'site_data', 'signature'), { value: config }).catch(console.error);
}

// ─────────────────────────────────────────────────────────
// FIRESTORE REALTIME SYNC ENGINE
// ─────────────────────────────────────────────────────────
let isSyncInitialized = false;

export function setupFirestoreSync() {
  if (typeof window === 'undefined' || isSyncInitialized) return;
  isSyncInitialized = true;

  const syncKey = (key: string, docName: string, defaultValue: any) => {
    // 1. Initial local load / seed if empty
    const local = localStorage.getItem(key);
    if (!local) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }

    // 2. Set up realtime sync listener from Firestore
    const docRef = doc(db, 'site_data', docName);
    onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const cloudVal = snapshot.data().value;
        const currentLocal = localStorage.getItem(key);
        if (JSON.stringify(cloudVal) !== currentLocal) {
          localStorage.setItem(key, JSON.stringify(cloudVal));
          // Dispatch a custom event to notify components
          window.dispatchEvent(new CustomEvent('db_sync', { detail: { key } }));
        }
      } else {
        // Document doesn't exist, initialize Firestore with local data
        const currentLocal = localStorage.getItem(key);
        const dataToUpload = currentLocal ? JSON.parse(currentLocal) : defaultValue;
        setDoc(docRef, { value: dataToUpload }).catch(err => console.error("Firestore init error for " + docName, err));
      }
    }, (err) => {
      console.error("Firestore sync error for " + docName, err);
    });
  };

  // Sync keys
  syncKey('courses_db', 'courses', DEFAULT_COURSES);
  syncKey('reviews_db', 'reviews', DEFAULT_REVIEWS);
  syncKey('website_config_db', 'config', DEFAULT_WEBSITE_CONFIG);
  
  const defaultCerts = [
    {
      id: 'cert_tiw_default_1',
      certNumber: 'TIW-2026-0001',
      studentName: 'Nikhil Kumar',
      courseName: 'Real-world Smart IoT Industrial Projects',
      completionDate: '26 May 2026',
      verificationCode: 'TIW001',
      grade: 'Distinction'
    }
  ];
  syncKey('certificates_db', 'certificates', defaultCerts);

  const defaultUsers = [
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
  syncKey('iot_users_database', 'users', defaultUsers);
  syncKey('iot_code_snippets', 'snippets', DEFAULT_SNIPPETS);
  syncKey('iot_circuits', 'circuits', DEFAULT_CIRCUITS);
  syncKey('iot_projects', 'projects', DEFAULT_PROJECTS);
  syncKey('iot_live_classes', 'live_classes', DEFAULT_LIVE_CLASSES);
  syncKey('certificate_signature_config', 'signature', { name: 'Nikhil Kumar', designation: 'CEO & Founder', image: '' });
}

// Call setup immediately if on client side
if (typeof window !== 'undefined') {
  setupFirestoreSync();
}
