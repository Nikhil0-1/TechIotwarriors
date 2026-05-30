'use client';
import styles from './FeaturesSection.module.css';

const FEATURES = [
  { title: 'HD Video Classes', desc: 'Step-by-step high-quality practical video sessions for every project module.', icon: '🎥' },
  { title: 'Circuit Diagrams', desc: 'Clear, high-resolution interactive circuit layouts and connection guides.', icon: '🔌' },
  { title: 'Full Source Code', desc: 'Clean, copy-pasteable, commented source codes for Arduino and ESP controllers.', icon: '💻' },
  { title: 'Real Hardware Projects', desc: 'Build smart home automation, weather monitoring, robotics, and CCTV systems.', icon: '🤖' },
  { title: 'Weekly Live Classes', desc: 'Interactive live lessons and project building sessions with industry mentors.', icon: '🔴' },
  { title: 'IoT Training Kits', desc: 'Get official hardware kits with all high-quality components delivered directly to you.', icon: '📦' },
  { title: 'Premium Certificate', desc: 'Get accredited certifications showing verified credentials on completion.', icon: '🏆' },
  { title: 'Doubt Troubleshooting', desc: 'Get direct hardware troubleshooting & code debugging support from experts.', icon: '⚡' },
  { title: 'Beginner Friendly', desc: 'No prior coding or electronics experience required. We start from absolute zero.', icon: '🌱' },
  { title: 'Hindi + Simple English', desc: 'Taught in dual-language formats so you can follow easily without language barriers.', icon: '🗣️' },
];

export function FeaturesSection() {
  return (
    <section className={`section ${styles.section}`} id="features">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-badge">Platform Pillars</span>
          <h2 className="section-title">Why Choose <span className="text-gradient">Tech IoT Warriors</span>?</h2>
          <p className="section-subtitle">
            We provide everything you need to become a professional IoT developer, focusing purely on building hardware.
          </p>
        </div>

        <div className={styles.grid}>
          {FEATURES.map((feat, idx) => (
            <div key={idx} className={`glass-card ${styles.card} reveal reveal-delay-${(idx % 3) + 1}`}>
              <div className={styles.iconContainer}>
                <span className={styles.icon}>{feat.icon}</span>
                <div className={styles.iconBg} />
              </div>
              <h3 className={styles.cardTitle}>{feat.title}</h3>
              <p className={styles.cardDesc}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
