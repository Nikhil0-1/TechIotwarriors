'use client';
import Link from 'next/link';
import styles from './CTASection.module.css';
import { Rocket, Zap, BookOpen } from '../ui/Icons';

export function CTASection() {
  return (
    <section className={`section ${styles.section}`}>
      <div className={styles.glow} />
      <div className="container">
        <div className={`glass-card ${styles.card} reveal`}>
          <div className={styles.content}>
            <span className={styles.tagline} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Rocket size={16} color="var(--matte-gold)" />
              <span>Launch Your Hardware Career</span>
            </span>
            <h2 className={styles.title}>Are You Ready to Build Real-World IoT Projects?</h2>
            <p className={styles.desc}>
              Join over 15,000+ students, makers, and engineering professionals who are mastering Arduino, ESP32, circuits, firmware, and cloud connectivity step-by-step.
            </p>
            <div className={styles.buttons}>
              <Link href="/signup" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Create Free Account <Zap size={18} />
              </Link>
              <Link href="/courses" className="btn btn-secondary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                View Curriculum <BookOpen size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
