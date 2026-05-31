'use client';
import { useState, useEffect } from 'react';
import styles from './Contact.module.css';
import { MapPin, Mail, Phone, Shield } from '@/components/ui/Icons';
import { getWebsiteConfig } from '@/lib/db';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    setConfig(getWebsiteConfig());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;
    setSubmitted(true);
  };

  const emailText = config ? config.contactEmail : 'support@techiotwarriors.com';
  const phoneText = config ? config.contactPhone : '+91 98765 43210 (10 AM - 6 PM IST)';
  const abuseText = config ? config.contactAbuseEmail : 'abuse-prevention@techiotwarriors.com';
  const addressText = config ? config.contactAddress : 'Noida, UP, India';

  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-badge">Support Desk</span>
          <h1 className={styles.title}>Get In <span className="text-gradient">Touch</span></h1>
          <p className={styles.subtitle}>
            Have queries regarding premium courses, batch schedules, bulk institute orders, or custom kits delivery? Write to us.
          </p>
        </div>

        <div className={styles.layout}>
          {/* Info Card */}
          <div className={styles.infoCol}>
            <div className={`glass-card ${styles.card}`}>
              <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={22} color="var(--matte-gold)" />
                <span>Contact Information</span>
              </h2>
              <div className="gold-divider" style={{ margin: '18px 0' }} />
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <Mail size={20} color="var(--matte-gold)" />
                </span>
                <div>
                  <strong>Direct Email</strong>
                  <p>{emailText}</p>
                </div>
              </div>

              <div className={styles.infoItem} style={{ marginTop: 20 }}>
                <span className={styles.infoIcon}>
                  <Phone size={20} color="var(--matte-gold)" />
                </span>
                <div>
                  <strong>Phone / WhatsApp</strong>
                  <p>{phoneText}</p>
                </div>
              </div>

              <div className={styles.infoItem} style={{ marginTop: 20 }}>
                <span className={styles.infoIcon}>
                  <Shield size={20} color="var(--matte-gold)" />
                </span>
                <div>
                  <strong>Security Division</strong>
                  <p>{abuseText}</p>
                </div>
              </div>

              <div className={styles.infoItem} style={{ marginTop: 20 }}>
                <span className={styles.infoIcon}>
                  <MapPin size={20} color="var(--matte-gold)" />
                </span>
                <div>
                  <strong>Headquarters</strong>
                  <p>{addressText}</p>
                </div>
              </div>
            </div>
          </div>


          {/* Form Card */}
          <div className={styles.formCol}>
            <div className={`glass-card ${styles.card}`}>
              {!submitted ? (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className="form-group">
                    <label className="form-label">Full Name:</label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address:</label>
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Message:</label>
                    <textarea
                      required
                      placeholder="Detail your hardware query or corporate requirement..."
                      value={msg}
                      onChange={e => setMsg(e.target.value)}
                      className="form-input"
                      rows={5}
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 12 }}>
                    Send Message
                  </button>
                </form>
              ) : (
                <div className={styles.successBlock}>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you, {name}. Our support team will review your ticket and reply to {email} within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-outline-gold btn-sm mt-md">
                    Send another query
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
