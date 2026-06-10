'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCourses, Course } from '@/lib/db';
import styles from './page.module.css';
import { Search, Cpu, Zap, Globe, Wifi, Rocket, Wrench, Clock, BookOpen, Star } from '@/components/ui/Icons';

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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeDiff, setActiveDiff] = useState('All');
  const [search, setSearch] = useState('');

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

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = courses.filter(c => {
    const matchesDiff = activeDiff === 'All' || c.difficulty === activeDiff;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.desc.toLowerCase().includes(search.toLowerCase()) ||
                          c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesDiff && matchesSearch;
  });


  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-badge">IoT Learning Paths</span>
          <h1 className={styles.title}>Acquire <span className="text-gradient">Hardware Skills</span></h1>
          <p className={styles.subtitle}>
            Explore our curated learning journeys. Wire physical components, write MCU code, and hook sensors to real cloud databases.
          </p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.diffTabs}>
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setActiveDiff(d)}
                className={`${styles.tab} ${activeDiff === d ? styles.activeTab : ''}`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search Arduino, ESP32, WiFi, Relay..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`${styles.searchInput} form-input`}
            />
            <span className={styles.searchIcon}><Search size={18} /></span>
          </div>
        </div>

        {/* Courses Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map(course => (
              <div key={course.id} className={`glass-card ${styles.card}`}>
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

                <div className={styles.cardContent}>
                  <div className={styles.meta}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {course.duration}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={12} />
                      {course.lessons} Lessons
                    </span>
                  </div>
                  <h3 className={styles.cardTitle}>{course.title}</h3>
                  <p className={styles.cardDesc}>{course.desc}</p>

                  <div className={styles.rating}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} style={{ fill: 'var(--matte-gold)', stroke: 'var(--matte-gold)' }} />
                      {course.rating.toFixed(1)}
                    </span>
                    <div className={styles.tags}>
                      {course.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>

                  <div className="gold-divider" style={{ margin: '16px 0' }} />

                  <div className={styles.footer}>
                    <div className={styles.pricing}>
                      <span className={styles.price}>{course.price}</span>
                      <span className={styles.originalPrice}>{course.originalPrice}</span>
                    </div>
                    <Link href={`/courses/${course.id}`} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      Enroll Now <Zap size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <h3>No courses match your criteria.</h3>
            <p>Try searching for other terms or reset difficulty filters.</p>
            <button
              onClick={() => { setActiveDiff('All'); setSearch(''); }}
              className="btn btn-outline-gold btn-sm mt-md"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
