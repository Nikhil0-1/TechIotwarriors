'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './StatsSection.module.css';

const STATS = [
  { label: 'Total Students', value: 15420, suffix: '+', icon: '👥' },
  { label: 'Projects Built', value: 450, suffix: '+', icon: '🔧' },
  { label: 'Courses Offered', value: 24, suffix: '+', icon: '📚' },
  { label: 'Certificates Issued', value: 8900, suffix: '+', icon: '🏆' },
];

export function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className="container">
        <div className={`glass-card ${styles.grid}`}>
          {STATS.map((stat, idx) => (
            <div key={idx} className={styles.item}>
              <div className={styles.icon}>{stat.icon}</div>
              <div className={styles.content}>
                <h3 className={styles.number}>
                  {started ? <CountUp value={stat.value} /> : '0'}
                  {stat.suffix}
                </h3>
                <p className={styles.label}>{stat.label}</p>
              </div>
              {idx < STATS.length - 1 && <div className={styles.divider} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUp({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}
