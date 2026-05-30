'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FEATURED_COURSES } from '@/components/home/CoursesSection';
import styles from './page.module.css';

export default function CoursesPage() {
  const [activeDiff, setActiveDiff] = useState('All');
  const [search, setSearch] = useState('');

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = FEATURED_COURSES.filter(c => {
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
            <span className={styles.searchIcon}>🔍</span>
          </div>
        </div>

        {/* Courses Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map(course => (
              <div key={course.id} className={`glass-card ${styles.card}`}>
                <div className={styles.thumbArea}>
                  <span className={styles.thumbIcon}>{course.thumbnail}</span>
                  <span className={`${styles.badge} badge ${course.difficulty === 'Beginner' ? 'badge-green' : course.difficulty === 'Intermediate' ? 'badge-blue' : 'badge-red'}`}>
                    {course.difficulty}
                  </span>
                  <div className={styles.thumbGlow} />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.meta}>
                    <span>⏱️ {course.duration}</span>
                    <span>📖 {course.lessons} Lessons</span>
                  </div>
                  <h3 className={styles.cardTitle}>{course.title}</h3>
                  <p className={styles.cardDesc}>{course.desc}</p>

                  <div className={styles.rating}>
                    <span>⭐️ {course.rating.toFixed(1)}</span>
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
                    <Link href={`/courses/${course.id}`} className="btn btn-primary btn-sm">
                      Enroll Now ⚡
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
