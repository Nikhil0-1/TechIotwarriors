'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getHomepageConfig } from '@/lib/db';
import styles from './HeroSection.module.css';
import { Rocket, Zap, Wrench, Box, Trophy, Leaf, Award } from '../ui/Icons';

const TRUST_BADGES = [
  { icon: 'wrench', label: 'Real Hardware Projects' },
  { icon: 'award', label: 'Practical Learning' },
  { icon: 'trophy', label: 'Premium Certificate' },
  { icon: 'leaf', label: 'Beginner Friendly' },
];

const TrustIcon = ({ type, size = 16 }: { type: string; size?: number }) => {
  switch (type) {
    case 'wrench': return <Wrench size={size} color="var(--matte-gold)" />;
    case 'award': return <Award size={size} color="var(--matte-gold)" />;
    case 'trophy': return <Trophy size={size} color="var(--matte-gold)" />;
    case 'leaf': return <Leaf size={size} color="var(--matte-gold)" />;
    default: return <Award size={size} color="var(--matte-gold)" />;
  }
};

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [headings, setHeadings] = useState({
    heroHeading: 'Build Real IoT Projects, Not Just Theory',
    heroSubheading: 'Learn Arduino, ESP32 & ESP8266 through Real Projects, Video Lessons, Circuit Diagrams, Source Code, IoT Kits, Live Classes and Certifications.'
  });

  // Particle background
  useEffect(() => {
    // Read dynamic page configs
    const config = getHomepageConfig();
    setHeadings(config);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['rgba(212,175,55,', 'rgba(232,200,74,', 'rgba(180,140,30,'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212,175,55,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className={styles.hero} id="hero">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Background glow orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* Circuit grid */}
      <div className={styles.circuitGrid} />

      {/* Floating devices */}
      <div className={styles.floatingDevices}>
        <div className={`${styles.device} ${styles.arduino}`}>
          <ArduinoSVG />
          <span className={styles.deviceLabel}>Arduino UNO</span>
        </div>
        <div className={`${styles.device} ${styles.esp32}`}>
          <ESP32SVG />
          <span className={styles.deviceLabel}>ESP32</span>
        </div>
        <div className={`${styles.device} ${styles.esp8266}`}>
          <ESP8266SVG />
          <span className={styles.deviceLabel}>ESP8266</span>
        </div>
      </div>

      {/* Content */}
      <div className={`container ${styles.content}`}>
        <div className={styles.badge} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Rocket size={14} color="var(--matte-gold)" />
          <span>India's #1 Premium IoT Learning Platform</span>
        </div>

        <h1 className={styles.heading}>
          {headings.heroHeading.includes('Real') ? (
            <>
              Build <span className="text-gradient">Real IoT Projects</span>,<br />
              Not Just Theory
            </>
          ) : (
            headings.heroHeading
          )}
        </h1>

        <p className={styles.sub}>
          {headings.heroSubheading}
        </p>

        <div className={styles.buttons}>
          <Link href="/courses" className={`btn btn-primary btn-lg ${styles.btnGlow}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} /> Start Learning
          </Link>
          <Link href="/projects" className="btn btn-secondary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={18} /> Explore Projects
          </Link>
          <Link href="/iot-kits" className="btn btn-outline-gold btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Box size={18} /> Get IoT Kit
          </Link>
        </div>

        {/* Trust Badges */}
        <div className={styles.trustBadges}>
          {TRUST_BADGES.map(b => (
            <div key={b.label} className={styles.trustBadge}>
              <span className={styles.trustIcon}>
                <TrustIcon type={b.icon} />
              </span>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollDot} />
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}

function ArduinoSVG() {
  return (
    <svg viewBox="0 0 100 80" width="100" height="80" fill="none">
      <rect x="5" y="10" width="90" height="60" rx="8" fill="#1A1A2E" stroke="#00979D" strokeWidth="2"/>
      <rect x="15" y="5" width="6" height="12" rx="2" fill="#00979D"/>
      <rect x="25" y="5" width="6" height="12" rx="2" fill="#00979D"/>
      <rect x="35" y="5" width="6" height="12" rx="2" fill="#00979D"/>
      <rect x="45" y="5" width="6" height="12" rx="2" fill="#00979D"/>
      <rect x="55" y="5" width="6" height="12" rx="2" fill="#00979D"/>
      <circle cx="35" cy="40" r="15" fill="#00979D" opacity="0.2" stroke="#00979D" strokeWidth="1.5"/>
      <circle cx="35" cy="40" r="8" fill="#00979D"/>
      <rect x="60" y="28" width="20" height="12" rx="3" fill="#555" stroke="#888" strokeWidth="1"/>
      <text x="35" y="44" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">ATmega</text>
    </svg>
  );
}

function ESP32SVG() {
  return (
    <svg viewBox="0 0 100 80" width="100" height="80" fill="none">
      <rect x="10" y="8" width="80" height="64" rx="6" fill="#1A1A2E" stroke="#E74C3C" strokeWidth="2"/>
      <rect x="18" y="2" width="4" height="10" rx="1" fill="#888"/>
      <rect x="26" y="2" width="4" height="10" rx="1" fill="#888"/>
      <rect x="34" y="2" width="4" height="10" rx="1" fill="#888"/>
      <rect x="42" y="2" width="4" height="10" rx="1" fill="#888"/>
      <rect x="50" y="2" width="4" height="10" rx="1" fill="#888"/>
      <rect x="58" y="2" width="4" height="10" rx="1" fill="#888"/>
      <rect x="66" y="2" width="4" height="10" rx="1" fill="#888"/>
      <rect x="74" y="2" width="4" height="10" rx="1" fill="#888"/>
      <rect x="25" y="20" width="50" height="30" rx="4" fill="#E74C3C" opacity="0.15" stroke="#E74C3C" strokeWidth="1"/>
      <rect x="30" y="24" width="40" height="22" rx="3" fill="#2C3E50"/>
      <text x="50" y="39" textAnchor="middle" fill="#E74C3C" fontSize="7" fontWeight="bold">ESP32</text>
      <circle cx="22" cy="62" r="4" fill="#27AE60" opacity="0.8"/>
    </svg>
  );
}

function ESP8266SVG() {
  return (
    <svg viewBox="0 0 100 80" width="100" height="80" fill="none">
      <rect x="15" y="10" width="70" height="60" rx="5" fill="#1A1A2E" stroke="#8E44AD" strokeWidth="2"/>
      <rect x="20" y="4" width="3" height="10" rx="1" fill="#888"/>
      <rect x="27" y="4" width="3" height="10" rx="1" fill="#888"/>
      <rect x="34" y="4" width="3" height="10" rx="1" fill="#888"/>
      <rect x="41" y="4" width="3" height="10" rx="1" fill="#888"/>
      <rect x="48" y="4" width="3" height="10" rx="1" fill="#888"/>
      <rect x="55" y="4" width="3" height="10" rx="1" fill="#888"/>
      <rect x="62" y="4" width="3" height="10" rx="1" fill="#888"/>
      <rect x="69" y="4" width="3" height="10" rx="1" fill="#888"/>
      <rect x="25" y="18" width="50" height="28" rx="3" fill="#8E44AD" opacity="0.2" stroke="#8E44AD" strokeWidth="1"/>
      <text x="50" y="36" textAnchor="middle" fill="#8E44AD" fontSize="7" fontWeight="bold">ESP8266</text>
      <rect x="30" y="52" width="40" height="8" rx="2" fill="#333"/>
    </svg>
  );
}
