'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getRegisteredUsers, updateUsersDb } from '@/lib/db';
import styles from './PaymentPage.module.css';
import { Shield, Zap, Clock, ArrowRight } from '@/components/ui/Icons';

import { Suspense } from 'react';

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('Beginner IoT Mastery Bootcamp');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [status, setStatus] = useState<'NONE' | 'SUBMITTED'>('NONE');

  useEffect(() => {
    const urlEmail = searchParams.get('email') || '';
    const urlCourse = searchParams.get('course') || '';
    if (urlEmail) setEmail(urlEmail);
    if (urlCourse) {
      const formatted = urlCourse.replace(/-/g, ' ');
      setSelectedCourse(formatted.charAt(0).toUpperCase() + formatted.slice(1));
    }
  }, [searchParams]);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot) {
      alert('Please upload your transaction screenshot first.');
      return;
    }

    // Set user account verification to Pending Verification
    const users = getRegisteredUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex !== -1) {
      users[userIndex].status = 'Pending Verification';
      users[userIndex].name = name || users[userIndex].name;
      users[userIndex].phone = phone || users[userIndex].phone;
      updateUsersDb(users);
    } else {
      // Scaffold if not registered (e.g. direct pay)
      const newUser = {
        email: email.toLowerCase(),
        name,
        phone,
        role: 'Student' as const,
        isActive: false,
        isSuspended: false,
        status: 'Pending Verification' as const,
        devices: [],
        currentSessionId: ''
      };
      updateUsersDb([...users, newUser]);
    }

    // Store screenshot details mock in localStorage for Admin view
    const pendingScreen = {
      email,
      name,
      phone,
      selectedCourse,
      screenshot,
      timestamp: new Date().toLocaleDateString()
    };
    const currentPending = localStorage.getItem('pending_payments') || '[]';
    const parsedPending = JSON.parse(currentPending);
    localStorage.setItem('pending_payments', JSON.stringify([pendingScreen, ...parsedPending]));

    setStatus('SUBMITTED');
  };

  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className={`glass-card ${styles.card}`}>
        {status === 'NONE' ? (
          <>
            <h1 className={styles.title}>Secure <span className="text-gradient">UPI QR Checkout</span></h1>
            <p className={styles.subtitle}>Scan the official UPI code, complete the transaction, and upload the invoice screenshot.</p>

            <div className={styles.checkoutLayout}>
              {/* QR side */}
              <div className={styles.qrCol}>
                <div className={styles.qrFrame}>
                  {/* Generated clean SVG QR */}
                  <svg viewBox="0 0 100 100" width="180" height="180" className={styles.qrSvg}>
                    <rect width="100" height="100" fill="white" />
                    {/* Corners */}
                    <rect x="5" y="5" width="20" height="20" fill="black" />
                    <rect x="8" y="8" width="14" height="14" fill="white" />
                    <rect x="11" y="11" width="8" height="8" fill="black" />

                    <rect x="75" y="5" width="20" height="20" fill="black" />
                    <rect x="78" y="8" width="14" height="14" fill="white" />
                    <rect x="81" y="11" width="8" height="8" fill="black" />

                    <rect x="5" y="75" width="20" height="20" fill="black" />
                    <rect x="8" y="78" width="14" height="14" fill="white" />
                    <rect x="11" y="81" width="8" height="8" fill="black" />
                    {/* Random patterns */}
                    <rect x="35" y="35" width="10" height="10" fill="black" />
                    <rect x="55" y="35" width="15" height="5" fill="black" />
                    <rect x="35" y="55" width="5" height="15" fill="black" />
                    <rect x="55" y="55" width="20" height="20" fill="black" />
                    {/* Inner gold sign */}
                    <rect x="42" y="42" width="16" height="16" fill="#D4AF37" />
                  </svg>
                  <span className={styles.qrLabel}>UPI ID: pay@techiotwarriors</span>
                </div>
                <div className={styles.badgeRow} style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Shield size={12} /> Instant SSL
                  </span>
                  <span className="badge badge-gold">UPI Verified</span>
                </div>
              </div>

              {/* Form side */}
              <div className={styles.formCol}>
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
                    <label className="form-label">Email Address (Registered account):</label>
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
                    <label className="form-label">Phone Number:</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Selected Course Program or Kit:</label>
                    <input
                      type="text"
                      readOnly
                      value={selectedCourse}
                      className="form-input"
                      style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Upload Transaction Screenshot:</label>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="form-input"
                      style={{ padding: '10px 18px' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 12 }}>
                    Submit Receipt for Verification
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.pendingBlock}>
            <span className={styles.pendingIcon} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={48} color="var(--matte-gold)" />
            </span>
            <h2>Verification Pending</h2>
            <p className={styles.pendingText}>
              Your payment screenshot has been uploaded. Super admins are manually checking the receipt matching references.
            </p>
            <div className={styles.alert}>
              <strong>Status: Pending Verification</strong>
              <p>Access will be activated after payment verification. Typically takes 1-2 hours.</p>
            </div>
            <div className="gold-divider" style={{ margin: '20px 0' }} />
            <button onClick={() => router.push('/login')} className="btn btn-primary w-full" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span>Return to Login Portal</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="loading-overlay"><div className="loading-spinner" /></div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
