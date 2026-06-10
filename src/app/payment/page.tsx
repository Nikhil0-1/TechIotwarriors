'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getRegisteredUsers, updateUsersDb, getCourses, getCoupons, Coupon } from '@/lib/db';
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

  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const urlEmail = searchParams.get('email') || '';
    const urlCourse = searchParams.get('course') || '';
    const urlKit = searchParams.get('kit') || '';
    if (urlEmail) setEmail(urlEmail);
    
    if (urlCourse) {
      const courses = getCourses();
      const found = courses.find(c => c.id === urlCourse);
      if (found) {
        setSelectedCourse(found.title);
        const pVal = parseInt(found.price.replace(/[^\d]/g, ''), 10) || 0;
        const opVal = parseInt(found.originalPrice.replace(/[^\d]/g, ''), 10) || 0;
        setPrice(pVal);
        setOriginalPrice(opVal);
      } else {
        const formatted = urlCourse.replace(/-/g, ' ');
        setSelectedCourse(formatted.charAt(0).toUpperCase() + formatted.slice(1));
      }
    } else if (urlKit) {
      if (urlKit === 'ultimate') {
        setSelectedCourse('Warriors Ultimate IoT Starter Kit');
        setPrice(2499);
        setOriginalPrice(4999);
      } else if (urlKit === 'advanced') {
        setSelectedCourse('ESP32 Cam Smart Vision Advanced Kit');
        setPrice(3299);
        setOriginalPrice(6499);
      }
    }
  }, [searchParams]);

  const handleApplyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    setCouponError('');
    setAppliedCoupon(null);
    setDiscountAmount(0);

    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const coupons = getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());

    if (!coupon) {
      setCouponError('Invalid coupon code.');
      return;
    }

    if (!coupon.isActive) {
      setCouponError('This coupon is no longer active.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (new Date(coupon.expiryDate) < new Date(todayStr)) {
      setCouponError('This coupon has expired.');
      return;
    }

    // Apply discount
    setAppliedCoupon(coupon);
    let disc = 0;
    if (coupon.discountType === 'percentage') {
      disc = Math.round((price * coupon.discountValue) / 100);
    } else {
      disc = coupon.discountValue;
    }
    setDiscountAmount(disc);
  };

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
      price: Math.max(0, price - discountAmount),
      appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
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

                  {price > 0 && (
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(212, 175, 55, 0.15)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <span>Regular Price:</span>
                        <span style={{ textDecoration: 'line-through' }}>₹{originalPrice}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        <span>Course Price:</span>
                        <span>₹{price}</span>
                      </div>
                      
                      {appliedCoupon && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#22c55e', marginTop: '4px' }}>
                          <span>Coupon Discount ({appliedCoupon.code}):</span>
                          <span>- ₹{discountAmount}</span>
                        </div>
                      )}

                      <div className="gold-divider" style={{ margin: '10px 0' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--matte-gold)' }}>
                        <span>Payable Amount:</span>
                        <span>₹{Math.max(0, price - discountAmount)}</span>
                      </div>
                    </div>
                  )}

                  {price > 0 && (
                    <div className="form-group">
                      <label className="form-label">Have a Discount Coupon?</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Enter coupon code (e.g. WARRIOR10)"
                          value={couponCode}
                          onChange={e => setCouponCode(e.target.value)}
                          className="form-input"
                          style={{ textTransform: 'uppercase' }}
                        />
                        <button type="button" onClick={handleApplyCoupon} className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                          Apply
                        </button>
                      </div>
                      {couponError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{couponError}</p>}
                      {appliedCoupon && <p style={{ color: '#22c55e', fontSize: '0.8rem', marginTop: '4px' }}>✓ Coupon applied! Discount of {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `₹${appliedCoupon.discountValue}`} active.</p>}
                    </div>
                  )}

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
