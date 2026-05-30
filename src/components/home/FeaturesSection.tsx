'use client';
import styles from './FeaturesSection.module.css';
import { Video, Plug, Laptop, Cpu, Play, Box, Trophy, Zap, Leaf, MessageSquare } from '../ui/Icons';

const FEATURES = [
  { title: 'HD Video Classes', desc: 'Step-by-step high-quality practical video sessions for every project module.', icon: 'video' },
  { title: 'Circuit Diagrams', desc: 'Clear, high-resolution interactive circuit layouts and connection guides.', icon: 'plug' },
  { title: 'Full Source Code', desc: 'Clean, copy-pasteable, commented source codes for Arduino and ESP controllers.', icon: 'laptop' },
  { title: 'Real Hardware Projects', desc: 'Build smart home automation, weather monitoring, robotics, and CCTV systems.', icon: 'cpu' },
  { title: 'Weekly Live Classes', desc: 'Interactive live lessons and project building sessions with industry mentors.', icon: 'play' },
  { title: 'IoT Training Kits', desc: 'Get official hardware kits with all high-quality components delivered directly to you.', icon: 'box' },
  { title: 'Premium Certificate', desc: 'Get accredited certifications showing verified credentials on completion.', icon: 'trophy' },
  { title: 'Doubt Troubleshooting', desc: 'Get direct hardware troubleshooting & code debugging support from experts.', icon: 'zap' },
  { title: 'Beginner Friendly', desc: 'No prior coding or electronics experience required. We start from absolute zero.', icon: 'leaf' },
  { title: 'Hindi + Simple English', desc: 'Taught in dual-language formats so you can follow easily without language barriers.', icon: 'message' },
];

const FeatureIcon = ({ type, size = 32 }: { type: string; size?: number }) => {
  switch (type) {
    case 'video': return <Video size={size} color="var(--matte-gold)" />;
    case 'plug': return <Plug size={size} color="var(--matte-gold)" />;
    case 'laptop': return <Laptop size={size} color="var(--matte-gold)" />;
    case 'cpu': return <Cpu size={size} color="var(--matte-gold)" />;
    case 'play': return <Play size={size} color="var(--matte-gold)" />;
    case 'box': return <Box size={size} color="var(--matte-gold)" />;
    case 'trophy': return <Trophy size={size} color="var(--matte-gold)" />;
    case 'zap': return <Zap size={size} color="var(--matte-gold)" />;
    case 'leaf': return <Leaf size={size} color="var(--matte-gold)" />;
    case 'message': return <MessageSquare size={size} color="var(--matte-gold)" />;
    default: return <Cpu size={size} color="var(--matte-gold)" />;
  }
};

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
                <span className={styles.icon}>
                  <FeatureIcon type={feat.icon} />
                </span>
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
