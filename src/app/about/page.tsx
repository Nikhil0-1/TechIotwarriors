'use client';
import { useEffect, useState } from 'react';
import styles from './About.module.css';
import { getWebsiteConfig } from '@/lib/db';
import { Wrench, Award, Shield } from '@/components/ui/Icons';

export default function AboutPage() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    setConfig(getWebsiteConfig());
  }, []);

  if (!config) {
    return <div className="loading-overlay"><div className="loading-spinner" /></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-badge">Our Mission</span>
          <h1 className={styles.title}>About <span className="text-gradient">Tech IoT Warriors</span></h1>
          <p className={styles.subtitle}>
            {config.aboutMission}
          </p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={`glass-card ${styles.card}`}>
            <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Wrench size={22} color="var(--matte-gold)" />
              <span>The Hardware Education Problem</span>
            </h2>
            <div style={{ whiteSpace: 'pre-line', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              {config.aboutProblem}
            </div>
          </div>

          <div className={`glass-card ${styles.card}`} style={{ borderLeftColor: 'var(--matte-gold)' }}>
            <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Award size={22} color="var(--matte-gold)" />
              <span>What We Deliver</span>
            </h2>
            <ul className={styles.list}>
              {config.aboutDeliver.map((d: string, idx: number) => {
                const parts = d.split(':');
                if (parts.length > 1) {
                  return (
                    <li key={idx}>
                      <strong>{parts[0]}:</strong>{parts.slice(1).join(':')}
                    </li>
                  );
                }
                return <li key={idx}>{d}</li>;
              })}
            </ul>
          </div>

          {/* Premium Founder Section */}
          <div className={`glass-card ${styles.card}`} style={{ borderTop: '2px solid var(--matte-gold)', boxShadow: '0 4px 30px rgba(212, 175, 55, 0.05)' }}>
            <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--matte-gold)' }}>
              <Shield size={22} />
              <span>CEO &amp; Founder</span>
            </h2>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginTop: '16px', flexWrap: 'wrap' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--matte-gold), var(--gold-light))',
                color: 'var(--premium-black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.8rem',
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                flexShrink: 0
              }}>
                NK
              </div>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--luxury-white)' }}>{config.founderName}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--matte-gold)', fontWeight: 600 }}>{config.founderRole}</p>
                <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {config.founderBio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
