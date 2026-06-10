'use client';
import { useEffect, useState } from 'react';
import styles from './FounderSection.module.css';
import { getWebsiteConfig } from '@/lib/db';
import { Shield, Zap, Wrench } from '../ui/Icons';

export function FounderSection() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    setConfig(getWebsiteConfig());

    const handleSync = (e: any) => {
      if (e.detail?.key === 'website_config_db') {
        setConfig(getWebsiteConfig());
      }
    };
    window.addEventListener('db_sync', handleSync);
    return () => {
      window.removeEventListener('db_sync', handleSync);
    };
  }, []);

  const name = config ? config.founderName : 'Nikhil Kumar';
  const role = config ? config.founderRole : 'CEO & Founder, Tech IoT Warriors';
  const bio = config ? config.founderBio : 'Nikhil Kumar is an IoT Architect and Founder of Tech IoT Warriors. Driven by a mission to transform hardware education, he has helped thousands of students move past theory into building actual hardware prototypes.';

  return (
    <section className={`section ${styles.section}`} id="founder">
      <div className={styles.glow} />
      <div className="container">
        <div className={`glass-card ${styles.card} reveal`}>
          <div className={styles.grid}>
            {/* Visual Column */}
            <div className={styles.visualCol}>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '10px' }}>
                {/* Founder */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className={styles.avatarFrame} style={{ width: '130px', height: '130px' }}>
                    {config?.founderPhoto ? (
                      <img src={config.founderPhoto} alt="Founder" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <span className={styles.avatarText} style={{ fontSize: '3.2rem' }}>NK</span>
                    )}
                    <div className={styles.avatarGlow} />
                  </div>
                  <strong style={{ color: 'var(--luxury-white)', fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>{name}</strong>
                  <span style={{ color: 'var(--matte-gold)', fontSize: '0.75rem', fontWeight: 600 }}>CEO & Founder</span>
                </div>

                {/* Co-Founder */}
                {config?.hasCoFounder !== false && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div className={styles.avatarFrame} style={{ width: '130px', height: '130px' }}>
                      {config?.coFounderPhoto ? (
                        <img src={config.coFounderPhoto} alt="Co-Founder" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <span className={styles.avatarText} style={{ fontSize: '3.2rem' }}>DK</span>
                      )}
                      <div className={styles.avatarGlow} />
                    </div>
                    <strong style={{ color: 'var(--luxury-white)', fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>{config?.coFounderName || 'Devendra Kumar'}</strong>
                    <span style={{ color: 'var(--matte-gold)', fontSize: '0.75rem', fontWeight: 600 }}>Co-Founder & CTO</span>
                  </div>
                )}
              </div>

              <div className={styles.badgeRow}>
                <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={12} /> IoT Architects
                </span>
                <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Wrench size={12} /> Hardware Makers
                </span>
              </div>
            </div>

            {/* Description Column */}
            <div className={styles.contentCol}>
              <span className="section-badge">Leadership Profile</span>
              <h2 className={styles.title}>
                From the <span className="text-gradient">CEO &amp; Founder</span>
              </h2>
              <div className={styles.divider} />
              
              <blockquote className={styles.quote}>
                "The hardware revolution isn't built on slides or circuit simulators. It's built on raw wires, compiled IDE logs, and cloud-synced databases."
              </blockquote>

              <p className={styles.bio}>
                {bio}
              </p>

              <div className={styles.founderMeta} style={{ display: 'flex', flexDirection: 'row', gap: '30px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong className={styles.founderName}>{name}</strong>
                  <span className={styles.founderRole}>{role}</span>
                </div>
                {config?.hasCoFounder !== false && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong className={styles.founderName}>{config?.coFounderName || 'Devendra Kumar'}</strong>
                    <span className={styles.founderRole}>{config?.coFounderRole || 'Co-Founder & CTO, Tech IoT Warriors'}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <span className={styles.brandBadge}>Tech IoT Warriors</span>
                <span className={styles.brandVerify} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={12} color="var(--matte-gold)" /> India's Premium hardware ecosystem
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
