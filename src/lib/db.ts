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
  localStorage.setItem('iot_code_snippets', JSON.stringify(snippets));
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
  localStorage.setItem('iot_circuits', JSON.stringify(circuits));
}
