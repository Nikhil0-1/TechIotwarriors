'use client';
import Link from 'next/link';
import styles from './CoursesSection.module.css';
import { Cpu, Zap, Globe, Wifi, Rocket, Wrench, Clock, BookOpen, Star } from '../ui/Icons';
import { useEffect, useState } from 'react';
import { getCourses, Course } from '@/lib/db';

export const FEATURED_COURSES: Course[] = [
  {
    id: 'electronics-basics',
    title: 'Electronics Basics & Circuit Designing',
    desc: 'Master resistors, transistors, capacitors, diodes, and schematic design using TinkerCAD and EasyEDA.',
    duration: '10 Hours',
    difficulty: 'Beginner',
    lessons: 15,
    rating: 4.8,
    price: '₹999',
    originalPrice: '₹2,999',
    thumbnail: 'zap',
    tags: ['Basic', 'Electronics'],
    isPremium: false,
    certificateEnabled: true,
    modules: [],
  },
  {
    id: 'beginner-iot-mastery',
    title: 'Beginner IoT Mastery Bootcamp',
    desc: 'Kickstart your IoT journey with basic sensors, cloud communication, and standard data logging techniques.',
    duration: '18 Hours',
    difficulty: 'Beginner',
    lessons: 25,
    rating: 4.9,
    price: '₹1,499',
    originalPrice: '₹3,999',
    thumbnail: 'globe',
    tags: ['IoT', 'Beginner'],
    isPremium: false,
    certificateEnabled: true,
    modules: [],
  },
  {
    id: 'arduino-mastery',
    title: 'Arduino Programming & Circuit Building',
    desc: 'Program Arduino Uno/Nano from scratch. Work with displays, relays, serial monitors, and physical buttons.',
    duration: '15 Hours',
    difficulty: 'Beginner',
    lessons: 22,
    rating: 4.9,
    price: '₹1,299',
    originalPrice: '₹3,499',
    thumbnail: 'cpu',
    tags: ['Arduino', 'Coding'],
    isPremium: false,
    certificateEnabled: true,
    modules: [],
  },
  {
    id: 'esp8266-iot',
    title: 'ESP8266 WiFi & Home Automation IoT',
    desc: 'Build smart appliances, web controllers, Blynk IoT dashboard, and link switches to custom cloud webservers.',
    duration: '20 Hours',
    difficulty: 'Intermediate',
    lessons: 28,
    rating: 4.7,
    price: '₹1,699',
    originalPrice: '₹4,999',
    thumbnail: 'wifi',
    tags: ['ESP8266', 'WiFi'],
    isPremium: true,
    certificateEnabled: true,
    modules: [],
  },
  {
    id: 'esp32-advanced-iot',
    title: 'ESP32 Advanced IoT with FreeRTOS & HTTP',
    desc: 'Explore ESP32 dual core, BLE, mesh networks, AWS IoT Core integrations, and custom database webhooks.',
    duration: '28 Hours',
    difficulty: 'Advanced',
    lessons: 35,
    rating: 4.9,
    price: '₹2,499',
    originalPrice: '₹7,999',
    thumbnail: 'rocket',
    tags: ['ESP32', 'Advanced'],
    isPremium: true,
    certificateEnabled: true,
    modules: [],
  },
  {
    id: 'real-iot-projects',
    title: 'Real-world Smart IoT Industrial Projects',
    desc: 'Assemble ESP32 Cam surveillance, autonomous robots, smart agricultural nodes, and automated RFID doorlocks.',
    duration: '32 Hours',
    difficulty: 'Advanced',
    lessons: 40,
    rating: 5.0,
    price: '₹2,999',
    originalPrice: '₹9,999',
    thumbnail: 'wrench',
    tags: ['Hardware', 'Projects'],
    isPremium: true,
    certificateEnabled: true,
    modules: [],
  },
];

const CourseIcon = ({ type, size = 42 }: { type: string; size?: number }) => {
  switch (type) {
    case 'zap': return <Zap size={size} color="var(--matte-gold)" />;
    case 'globe': return <Globe size={size} color="var(--matte-gold)" />;
    case 'cpu': return <Cpu size={size} color="var(--matte-gold)" />;
    case 'wifi': return <Wifi size={size} color="var(--matte-gold)" />;
    case 'rocket': return <Rocket size={size} color="var(--matte-gold)" />;
    case 'wrench': return <Wrench size={size} color="var(--matte-gold)" />;
    default: return <BookOpen size={size} color="var(--matte-gold)" />;
  }
};

const isImageUrl = (url: string) => {
  return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:image'));
};

export function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setCourses(getCourses());

    const handleSync = (e: any) => {
      if (e.detail?.key === 'courses_db') {
        setCourses(getCourses());
      }
    };
    window.addEventListener('db_sync', handleSync);
    return () => {
      window.removeEventListener('db_sync', handleSync);
    };
  }, []);

  return (
    <section className={`section ${styles.section}`} id="courses">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-badge">Premium Courses</span>
          <h2 className="section-title">Our Featured <span className="text-gradient">Learning Journeys</span></h2>
          <p className="section-subtitle">
            Choose from beginner basics to advanced industrial projects. Learn by assembling actual hardware circuits.
          </p>
        </div>

        <div className={styles.grid}>
          {courses.map((course, idx) => (
            <div key={course.id} className={`glass-card ${styles.card} reveal reveal-delay-${(idx % 3) + 1}`}>
              {/* Card Thumbnail Area */}
              <div className={styles.thumbArea}>
                {isImageUrl(course.thumbnail) ? (
                  <img src={course.thumbnail} alt={course.title} className={styles.thumbImage} />
                ) : (
                  <span className={styles.thumbIcon}>
                    <CourseIcon type={course.thumbnail} />
                  </span>
                )}
                <span className={`${styles.badge} badge ${course.difficulty === 'Beginner' ? 'badge-green' : course.difficulty === 'Intermediate' ? 'badge-blue' : 'badge-red'}`}>
                  {course.difficulty}
                </span>
                <div className={styles.thumbGlow} />
              </div>

              {/* Card Info */}
              <div className={styles.cardContent}>
                <div className={styles.meta}>
                  <span className={styles.metaItem}>
                    <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    {course.duration}
                  </span>
                  <span className={styles.metaItem}>
                    <BookOpen size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    {course.lessons} Lessons
                  </span>
                </div>
                <h3 className={styles.title}>{course.title}</h3>
                <p className={styles.desc}>{course.desc}</p>

                {/* Rating */}
                <div className={styles.rating}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} style={{ fill: 'var(--matte-gold)', stroke: 'var(--matte-gold)' }} />
                    {course.rating.toFixed(1)}
                  </span>
                  <div className={styles.tags}>
                    {course.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>

                <div className="gold-divider" style={{ margin: '16px 0' }} />

                {/* Price and Action */}
                <div className={styles.footer}>
                  <div className={styles.pricing}>
                    <span className={styles.price}>{course.price}</span>
                    <span className={styles.originalPrice}>{course.originalPrice}</span>
                  </div>
                  <Link href={`/courses/${course.id}`} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Enroll Now <Zap size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-xl">
          <Link href="/courses" className="btn btn-secondary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            View All Courses <BookOpen size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

