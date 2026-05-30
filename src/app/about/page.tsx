'use client';
import styles from './About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-badge">Our Mission</span>
          <h1 className={styles.title}>About <span className="text-gradient">Tech IoT Warriors</span></h1>
          <p className={styles.subtitle}>
            Building India's largest and most premium learning platform for hardware prototyping, MCU firmware, and IoT development.
          </p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={`glass-card ${styles.card}`}>
            <h2>🛠️ The Hardware Education Problem</h2>
            <p>
              Traditional computer science and electronics courses teach abstract theories, circuit equations, and memorized diagrams. 
              But when students try to compile actual code, wire pullups, or transmit sensor values to a real database, they encounter errors, 
              port detection bugs, and logic loops.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>Tech IoT Warriors</strong> was established to fix this. We teach completely by building <strong>real practical prototypes</strong>. 
              If you aren't plugging in wires, writing code in the IDE, and sending data to the cloud, you aren't learning!
            </p>
          </div>

          <div className={`glass-card ${styles.card}`} style={{ borderLeftColor: 'var(--matte-gold)' }}>
            <h2>🎯 What We Deliver</h2>
            <ul className={styles.list}>
              <li><strong>Pre-Tested Matching IoT Kits:</strong> No more ordering broken sensors or wrong parts. We ship verified hardware matching our curriculum modules.</li>
              <li><strong>Dual Language Instruction (English + Hindi):</strong> Easy, accessible explanations explaining embedded architecture logic.</li>
              <li><strong>Real Doubt Resolvers:</strong> Paste compilation logs, stack traces, and schematic loops. Get expert debugger assistance.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
