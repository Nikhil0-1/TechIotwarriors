'use client';
import Link from 'next/link';
import styles from './Footer.module.css';
import { Zap, Shield, Check } from '../ui/Icons';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Courses',         href: '/courses' },
    { label: 'Projects',        href: '/projects' },
    { label: 'Circuit Library', href: '/circuit-library' },
    { label: 'Code Library',    href: '/code-library' },
    { label: 'Live Classes',    href: '/live-classes' },
  ],
  Learn: [
    { label: 'Arduino',         href: '/courses?tag=arduino' },
    { label: 'ESP32',           href: '/courses?tag=esp32' },
    { label: 'ESP8266',         href: '/courses?tag=esp8266' },
    { label: 'IoT Projects',    href: '/projects' },
    { label: 'Electronics',     href: '/courses?tag=electronics' },
  ],
  Company: [
    { label: 'About Us',        href: '/about' },
    { label: 'Community',       href: '/community' },
    { label: 'IoT Kits',        href: '/iot-kits' },
    { label: 'Certificates',    href: '/certificates' },
    { label: 'Contact',         href: '/contact' },
  ],
};

import { useEffect, useState } from 'react';
import { getWebsiteConfig } from '@/lib/db';

export function Footer() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    setConfig(getWebsiteConfig());
  }, []);

  const tagline = config ? config.footerTagline : "India's most premium IoT learning platform. Build real projects with Arduino, ESP32 & ESP8266.";
  const copyright = config ? config.footerCopyright : "© 2026 Tech IoT Warriors. All rights reserved.";

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} />
      <div className="container">
        {/* Top */}
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={22} color="var(--matte-gold)" />
              <span className={styles.logoText}>Tech <span className={styles.gold}>IoT</span> Warriors</span>
            </Link>
            <p className={styles.tagline}>
              {tagline}
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--matte-gold)', marginTop: '8px', fontWeight: '500' }}>
              CEO & Founder: {config ? config.founderName : "Nikhil Kumar"}
            </p>
            <div className={styles.socials}>
              {['YouTube', 'Telegram', 'Instagram', 'GitHub'].map(s => (
                <a key={s} href="#" className={styles.social}>{s[0]}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>{group}</h4>
              <ul className={styles.linkList}>
                {links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className={styles.link}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className={styles.newsletter}>
            <h4 className={styles.groupTitle}>Stay Updated</h4>
            <p className={styles.newsletterText}>Get weekly IoT tutorials & project ideas</p>
            <form className={styles.newsletterForm} onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="form-input"
                style={{ borderRadius: '12px 0 0 12px', borderRight: 'none' }}
              />
              <button type="submit" className={styles.subBtn}>Subscribe</button>
            </form>
          </div>
        </div>

        <div className="gold-divider" />

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copy}>{copyright}</p>
          <div className={styles.legal}>
            <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <Link href="/terms"   className={styles.legalLink}>Terms of Service</Link>
            <Link href="/refund"  className={styles.legalLink}>Refund Policy</Link>
          </div>
          <div className={styles.badges} style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={12} /> Secure
            </span>
            <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Check size={12} /> Verified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

