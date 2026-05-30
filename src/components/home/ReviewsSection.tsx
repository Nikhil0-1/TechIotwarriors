'use client';
import { useState } from 'react';
import styles from './ReviewsSection.module.css';

const REVIEWS = [
  {
    name: 'Aarav Mehta',
    role: 'ECE Student, IIT Bombay',
    text: 'The ESP32 Advanced course changed my engineering career. Building the automated security node with Telegram alerts gave me practical hardware skills that textbooks could never explain.',
    rating: 5,
    avatar: '👨‍💻',
  },
  {
    name: 'Priya Sharma',
    role: 'IoT Developer, Bangalore',
    text: 'Highly recommend the IoT kits! Getting matching sensors and step-by-step videos resolved my circuit connection issues instantly. The dual English/Hindi explanations are extremely simple.',
    rating: 5,
    avatar: '👩‍💻',
  },
  {
    name: 'Rohan Gupta',
    role: 'Hobbyist & Maker',
    text: 'I built a whole home automation system for my parents house using the ESP8266 WiFi modules course modules. The troubleshooting guides helped me solve the IP socket drop bugs in hours.',
    rating: 5,
    avatar: '🛠️',
  },
  {
    name: 'Sneha Patel',
    role: 'Embedded Software Intern',
    text: 'Passed the Arduino and Electronics module quiz, got my premium certified developer certificate and secured my core embedded hardware internship last week! Unbelievable support!',
    rating: 5,
    avatar: '🎓',
  },
];

export function ReviewsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className={`section ${styles.section}`} id="reviews">
      <div className={styles.bgGlow} />
      <div className="container">
        <div className="section-header reveal">
          <span className="section-badge">Success Stories</span>
          <h2 className="section-title">What Our <span className="text-gradient">Warriors Say</span></h2>
          <p className="section-subtitle">
            See how students and hardware enthusiasts are building real-world automation nodes and advancing their careers.
          </p>
        </div>

        <div className={`${styles.slider} reveal`}>
          {/* Main Review Card */}
          <div className={`glass-card ${styles.card}`}>
            <div className={styles.stars}>
              {Array.from({ length: REVIEWS[active].rating }).map((_, i) => (
                <span key={i} className={styles.star}>★</span>
              ))}
            </div>
            <p className={styles.text}>"{REVIEWS[active].text}"</p>
            <div className={styles.user}>
              <span className={styles.avatar}>{REVIEWS[active].avatar}</span>
              <div className={styles.userInfo}>
                <h4 className={styles.userName}>{REVIEWS[active].name}</h4>
                <p className={styles.userRole}>{REVIEWS[active].role}</p>
              </div>
            </div>
          </div>

          {/* Slider Pagination Controls */}
          <div className={styles.controls}>
            {REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`${styles.dot} ${active === idx ? styles.activeDot : ''}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
