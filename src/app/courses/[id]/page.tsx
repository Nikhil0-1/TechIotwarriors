'use client';
import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FEATURED_COURSES } from '@/components/home/CoursesSection';
import styles from './CourseDetailsPage.module.css';
import { Star, Clock, BookOpen, Play, Download, MessageSquare, Box, Zap } from '@/components/ui/Icons';

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const course = FEATURED_COURSES.find(c => c.id === params.id);
  if (!course) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState('lessons');
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [selectedVideo, setSelectedVideo] = useState({
    title: 'Lesson 1.1: Welcome & Course Roadmap',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder Embed
  });

  // Mandatory modules
  const MODULES = [
    {
      title: 'Module 1: Electronics Basics & Tinkering',
      lessons: [
        { title: 'Lesson 1.1: Welcome & Course Roadmap', duration: '12m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Lesson 1.2: Volts, Amps, Resistance & Multimeters', duration: '25m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Lesson 1.3: Working with Resistors & LEDs', duration: '18m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ]
    },
    {
      title: 'Module 2: Arduino Microcontroller Core Programming',
      lessons: [
        { title: 'Lesson 2.1: Arduino IDE Installation & Setup', duration: '15m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Lesson 2.2: Writing Your First C/C++ Sketch (Blink)', duration: '22m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Lesson 2.3: Analog vs Digital Pins', duration: '30m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ]
    },
    {
      title: 'Module 3: ESP8266 WiFi & Smart Home Server Node',
      lessons: [
        { title: 'Lesson 3.1: Understanding ESP8266 WiFi Modes', duration: '20m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Lesson 3.2: Hosting a Local Web Server to Control Relays', duration: '35m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Lesson 3.3: Connecting to Blynk Cloud Panel', duration: '28m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ]
    },
    {
      title: 'Module 4: ESP32 Advanced IoT, Deep Sleep & FreeRTOS',
      lessons: [
        { title: 'Lesson 4.1: ESP32 Dual Core Architecture & Tasks', duration: '32m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Lesson 4.2: Deep Sleep Mode & RTC RAM Logging', duration: '25m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Lesson 4.3: FreeRTOS Task Management & Queues', duration: '40m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ]
    },
    {
      title: 'Module 5: Real IoT Practical Capstone Projects',
      lessons: [
        { title: 'Lesson 5.1: Build ESP32 CCTV Camera Server', duration: '45m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Lesson 5.2: Sync Sensor Logs to Google Firebase Realtime DB', duration: '50m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Lesson 5.3: Certificate Quiz Preparation & Graduation', duration: '15m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <div className="container">
        {/* Course Intro Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className="tag">{course.difficulty}</span>
            <h1 className={styles.title}>{course.title}</h1>
            <p className={styles.desc}>{course.desc}</p>
            <div className={styles.metaRow} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Star size={14} style={{ fill: 'var(--matte-gold)', stroke: 'var(--matte-gold)' }} />
                {course.rating} Rating
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                {course.duration} Total Length
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <BookOpen size={14} />
                {course.lessons} Lectures
              </span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={`glass-card ${styles.pricingCard}`}>
              <span className={styles.price}>{course.price}</span>
              <span className={styles.origPrice}>{course.originalPrice}</span>
              <p className={styles.cardNote}>Instant enrollment, life-time access, full IoT kit compatible.</p>
              <Link href={`/payment?course=${course.id}`} className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 16 }}>
                Buy Course Now
              </Link>
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className={styles.workspace}>
          {/* Main Video View Column */}
          <div className={styles.videoCol}>
            <div className={styles.videoPlayer}>
              <iframe
                src={selectedVideo.url}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.iframe}
              />
            </div>
            <h2 className={styles.videoTitle}>{selectedVideo.title}</h2>

            {/* Content Tabs */}
            <div className={styles.tabs}>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`${styles.tabBtn} ${activeTab === 'lessons' ? styles.activeTab : ''}`}
              >
                Course Syllabus
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`${styles.tabBtn} ${activeTab === 'resources' ? styles.activeTab : ''}`}
              >
                Downloads &amp; Schematic Diagrams
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`${styles.tabBtn} ${activeTab === 'quiz' ? styles.activeTab : ''}`}
              >
                Quiz &amp; Certification
              </button>
            </div>

            {/* Tab Contents */}
            <div className={styles.tabContent}>
              {activeTab === 'lessons' && (
                <div className={styles.modulesList}>
                  {MODULES.map((mod, idx) => (
                    <div key={idx} className={styles.moduleItem}>
                      <button
                        onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                        className={styles.moduleHeader}
                      >
                        <span>{mod.title}</span>
                        <span>{expandedModule === idx ? '▲' : '▼'}</span>
                      </button>
                      {expandedModule === idx && (
                        <div className={styles.lessonsList}>
                          {mod.lessons.map((les, lidx) => (
                            <button
                              key={lidx}
                              onClick={() => setSelectedVideo({ title: les.title, url: les.url })}
                              className={`${styles.lessonBtn} ${selectedVideo.title === les.title ? styles.activeLesson : ''}`}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                            >
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <Play size={12} />
                                {les.title}
                              </span>
                              <span className={styles.duration}>{les.duration}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'resources' && (
                <div className={styles.resources}>
                  <h3>Download Project Resources</h3>
                  <p>All materials are verified by IoT engineers for compilation and circuit connectivity.</p>
                  
                  <div className={styles.downloadGrid}>
                    <div className={`glass-card ${styles.resourceCard}`}>
                      <h4 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--matte-gold)' }}>
                        <BookOpen size={18} />
                        Detailed Lecture Notes
                      </h4>
                      <p style={{ marginTop: '8px' }}>Full PDF summarizing electronics basics, Arduino architecture, and pin maps.</p>
                      <a href="#" className="btn btn-outline-gold btn-sm" style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Download size={14} /> Download PDF
                      </a>
                    </div>

                    <div className={`glass-card ${styles.resourceCard}`}>
                      <h4 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--matte-gold)' }}>
                        <Zap size={18} />
                        Circuit Schematic Layouts
                      </h4>
                      <p style={{ marginTop: '8px' }}>Fritzing diagrams, wiring schematics, and TinkerCAD virtual design links.</p>
                      <a href="#" className="btn btn-outline-gold btn-sm" style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Download size={14} /> Download ZIP
                      </a>
                    </div>

                    <div className={`glass-card ${styles.resourceCard}`}>
                      <h4 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--matte-gold)' }}>
                        <Box size={18} />
                        Microcontroller C/C++ Code
                      </h4>
                      <p style={{ marginTop: '8px' }}>Clean commented source codes, header files, libraries, and compilation parameters.</p>
                      <a href="#" className="btn btn-outline-gold btn-sm" style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Download size={14} /> Download Source ZIP
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className={styles.quiz}>
                  <h3>Module Certification Quiz</h3>
                  <p>Unlock the official "Tech IoT Warriors Certified IoT Developer" certificate by passing the final test with {'>'}80%.</p>
                  <div className={`glass-card ${styles.quizCard}`}>
                    <div className={styles.quizStats}>
                      <span>Questions: 15 MCQs</span>
                      <span>Passing Score: 80%</span>
                      <span>Attempts: Unlimited</span>
                    </div>
                    <Link href="/certificates" className="btn btn-primary" style={{ marginTop: 16 }}>
                      Start Quiz &amp; Get Certified
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Support Column */}
          <div className={styles.supportCol}>
            <div className={`glass-card ${styles.supportCard}`}>
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="var(--matte-gold)" />
                <span>Doubt Solving Center</span>
              </h3>
              <p style={{ marginTop: '6px' }}>Experiencing compilation compile errors, device connectivity issues or wrong circuit logic?</p>
              <div className="gold-divider" style={{ margin: '16px 0' }} />
              <div className={styles.supportInputs}>
                <textarea
                  placeholder="Paste your compilation error or query here. We resolve errors within 2 hours."
                  className="form-input"
                  rows={4}
                  style={{ resize: 'none' }}
                />
                <button className="btn btn-outline-gold btn-sm w-full" style={{ justifyContent: 'center', marginTop: 10 }}>
                  Submit Query
                </button>
              </div>
            </div>

            <div className={`glass-card ${styles.kitCard}`}>
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Box size={18} color="var(--matte-gold)" />
                <span>Course Hardware Kit</span>
              </h3>
              <p style={{ marginTop: '6px' }}>Make sure you have the official Tech IoT Warriors hardware kit containing the Arduino, ESP32, relays, sensors, wires, and modules.</p>
              <Link href="/iot-kits" className="btn btn-primary btn-sm w-full" style={{ justifyContent: 'center', marginTop: 12 }}>
                Buy Matching Kit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
