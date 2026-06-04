'use client';
import { useState, useEffect } from 'react';
import styles from './LiveClasses.module.css';
import { Bell, Calendar, Clock } from '@/components/ui/Icons';
import { getLiveClasses, LiveClass } from '@/lib/db';

export default function LiveClassesPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [classesList, setClassesList] = useState<LiveClass[]>([]);

  useEffect(() => {
    setClassesList(getLiveClasses());

    const handleSync = (e: any) => {
      if (e.detail?.key === 'iot_live_classes') {
        setClassesList(getLiveClasses());
      }
    };
    window.addEventListener('db_sync', handleSync);
    return () => {
      window.removeEventListener('db_sync', handleSync);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-badge">Live Lab Streams</span>
          <h1 className={styles.title}>Weekly IoT <span className="text-gradient">Live Classes</span></h1>
          <p className={styles.subtitle}>
            Join live code editing, sensor debugging, and circuit diagnostics. Chat directly with lead embedded hardware instructors.
          </p>
        </div>

        {/* Reminder notification signup */}
        <div className={`glass-card ${styles.reminderBar}`}>
          <div className={styles.reminderContent}>
            <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={20} color="var(--matte-gold)" />
              <span>Never Miss a Live Build Session</span>
            </h3>
            <p>Get instant browser notifications and WhatsApp updates 15 minutes before the session streams.</p>
          </div>
          <button
            onClick={() => setSubscribed(p => !p)}
            className={`btn ${subscribed ? 'btn-secondary' : 'btn-primary'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            {subscribed ? 'Subscribed!' : 'Set Live Reminder'}
          </button>
        </div>

        {/* Classes Layout */}
        <div className={styles.grid}>
          {classesList.map((c, i) => (
            <div key={i} className={`glass-card ${styles.card} ${c.status === 'LIVE NOW' ? styles.liveCard : ''}`}>
              <div className={styles.cardHeader}>
                <span className={`badge ${c.status === 'LIVE NOW' ? 'badge-red' : c.status === 'UPCOMING' ? 'badge-gold' : 'badge-blue'}`}>
                  {c.status}
                </span>
                <span className={styles.dateTime} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} />
                  <span>{c.date}</span>
                  <span>|</span>
                  <Clock size={14} />
                  <span>{c.time}</span>
                </span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <span className={styles.instructor}>Lead Instructor: {c.instructor}</span>
              </div>

              <div className="gold-divider" style={{ margin: '20px 0' }} />

              <div className={styles.cardFooter}>
                {c.status === 'LIVE NOW' && (
                  <a href={c.meetingLink} target="_blank" rel="noreferrer" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>
                    Join Google Meet Classroom Now
                  </a>
                )}
                {c.status === 'UPCOMING' && (
                  <button className="btn btn-outline-gold w-full" style={{ justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '8px' }} disabled>
                    <Clock size={16} />
                    <span>Streaming Starts on {c.date}</span>
                  </button>
                )}
                {c.status === 'COMPLETED' && (
                  <div className={styles.replayArea}>
                    <strong>Replay Class Video:</strong>
                    <div className={styles.replayPlayer}>
                      <iframe
                        src={c.replayLink}
                        title={c.title}
                        allowFullScreen
                        className={styles.iframe}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
