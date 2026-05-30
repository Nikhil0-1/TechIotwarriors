'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './ProjectsSection.module.css';

export interface Project {
  id: string;
  title: string;
  category: string;
  desc: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  components: string[];
  icon: string;
}

export const PROJECTS_DATA: Project[] = [
  {
    id: 'smart-home',
    title: 'Smart Home Automation Node',
    category: 'Automation Projects',
    desc: 'Control lights and AC relays via customized Blynk dashboard, mobile app, and offline physical switches.',
    complexity: 'Intermediate',
    components: ['ESP32', 'Relay Module', 'Optocouplers', 'Blynk Cloud'],
    icon: '🏠',
  },
  {
    id: 'iot-weather-station',
    title: 'Solar Powered IoT Weather Station',
    category: 'Sensor Projects',
    desc: 'Log temperature, humidity, pressure, and UV index onto a ThingSpeak panel with low-power deep sleep mode.',
    complexity: 'Beginner',
    components: ['Arduino Uno', 'ESP8266', 'DHT22 Sensor', 'BMP280 Sensor'],
    icon: '☀️',
  },
  {
    id: 'robot-projects',
    title: 'WiFi Surveillance Robotic Rover',
    category: 'Robot Projects',
    desc: 'Steer an omnidirectional robot chassis via WebSocket stream. View low latency live video on dashboard.',
    complexity: 'Advanced',
    components: ['ESP32-CAM', 'L298D Motor Driver', 'Li-Ion Batteries', 'WebSockets'],
    icon: '🤖',
  },
  {
    id: 'security-system',
    title: 'Smart RFID & Face Recognition Lock',
    category: 'Security System',
    desc: 'Verify credentials locally, trigger solonoids, send real-time intruder snapshot notifications to Telegram.',
    complexity: 'Advanced',
    components: ['ESP32 Cam', 'MFRC522 RFID Reader', 'Solenoid Lock', 'Telegram API'],
    icon: '🔐',
  },
  {
    id: 'sensor-projects',
    title: 'Wireless Air Quality & Gas Monitor',
    category: 'Sensor Projects',
    desc: 'Measure MQ135 PPM levels and display live charts on local OLED screen, push alerts when gas limits breach.',
    complexity: 'Beginner',
    components: ['Arduino Nano', 'MQ135 Gas Sensor', '0.96 Inch OLED', 'Buzzer'],
    icon: '💨',
  },
  {
    id: 'esp32-camera',
    title: 'AI Smart Parking Lot Sensor',
    category: 'ESP32 Camera',
    desc: 'Detect car presence using ultrasound grids, log analytics, sync slot availability to Google Firebase database.',
    complexity: 'Intermediate',
    components: ['ESP32', 'Ultrasonic Sensors', 'Firebase DB', 'Infrared Sensors'],
    icon: '🚗',
  },
];

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Automation Projects', 'Sensor Projects', 'Robot Projects', 'Security System'];

  const filteredProjects = activeCategory === 'All'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.category === activeCategory);

  return (
    <section className={`section ${styles.section}`} id="projects">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-badge">Premium Prototypes</span>
          <h2 className="section-title">Hardware <span className="text-gradient">Project Showcases</span></h2>
          <p className="section-subtitle">
            Explore step-by-step guides with circuits, code, viva questions, and diagnostics for real hardware builds.
          </p>
        </div>

        {/* Categories Tab */}
        <div className={`${styles.tabs} reveal`}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${styles.tab} ${activeCategory === cat ? styles.activeTab : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className={styles.grid}>
          {filteredProjects.map((p, idx) => (
            <div key={p.id} className={`glass-card ${styles.card} reveal reveal-delay-${(idx % 3) + 1}`}>
              <div className={styles.top}>
                <span className={styles.icon}>{p.icon}</span>
                <span className={`${styles.badge} badge ${p.complexity === 'Beginner' ? 'badge-green' : p.complexity === 'Intermediate' ? 'badge-blue' : 'badge-red'}`}>
                  {p.complexity}
                </span>
              </div>

              <div className={styles.body}>
                <span className={styles.category}>{p.category}</span>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.desc}>{p.desc}</p>

                <div className={styles.components}>
                  {p.components.map(comp => (
                    <span key={comp} className={styles.compBadge}>{comp}</span>
                  ))}
                </div>
              </div>

              <div className="gold-divider" style={{ margin: '16px 0 0 0' }} />

              <div className={styles.footer}>
                <Link href={`/projects/${p.id}`} className={styles.moreBtn}>
                  Explore Build details ➔
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-xl">
          <Link href="/projects" className="btn btn-primary btn-lg">
            Browse All Projects 🛠️
          </Link>
        </div>
      </div>
    </section>
  );
}
