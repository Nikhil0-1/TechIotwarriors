'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getRegisteredUsers, setCurrentUser, updateUsersDb } from '@/lib/db';
import styles from './LoginPage.module.css';
import { Alert, Globe, ArrowRight } from '@/components/ui/Icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sharingDetected, setSharingDetected] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otpVal, setOtpVal] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const users = getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      setErrorMsg('User account not found. Please Sign Up first.');
      return;
    }

    if (user.isSuspended) {
      setErrorMsg('Your account has been suspended or banned by the moderator.');
      return;
    }

    // Block if payment is pending verification
    if (user.status === 'Pending Verification') {
      setErrorMsg('Access Blocked: Your account activation is pending manual payment verification.');
      return;
    }

    // Simulate Device Fingerprint Check (Anti-sharing Security rule)
    const newSessionId = 'session_' + Math.random().toString(36).substr(2, 9);
    const newDevice = 'Chrome Windows-PC Session-' + (user.devices.length + 1);

    // Rule: Maximum 2 trusted devices
    if (user.devices.length >= 2 && !user.devices.includes(newDevice)) {
      // Prompt for OTP validation for suspicious login / new device
      if (!showOtp) {
        setShowOtp(true);
        setErrorMsg('New device detected. OTP Verification required.');
        return;
      }
    }

    // Rule: Only 1 active session (New login logs out old session)
    if (user.devices.length > 0 && user.currentSessionId !== '') {
      setSharingDetected(true);
      // We will automatically replace old session
    }

    // Success login mapping
    const updatedUser = {
      ...user,
      isActive: true,
      currentSessionId: newSessionId,
      devices: Array.from(new Set([...user.devices, newDevice])).slice(-2) // max 2
    };

    // Update DB
    const updatedUsers = users.map(u => u.email === user.email ? updatedUser : u);
    updateUsersDb(updatedUsers);
    setCurrentUser(updatedUser);

    if (sharingDetected) {
      // Wait for user to acknowledge sharing overlay
      return;
    }

    proceedRedirect(updatedUser.role);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpVal === '1234') {
      setShowOtp(false);
      setErrorMsg('');
      // Proceed with normal login bypass
      const users = getRegisteredUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        const updatedUser = {
          ...user,
          isActive: true,
          currentSessionId: 'session_bypass_' + Math.random().toString(36).substr(2, 9)
        };
        setCurrentUser(updatedUser);
        proceedRedirect(updatedUser.role);
      }
    } else {
      setErrorMsg('Invalid OTP code. Try entering 1234.');
    }
  };

  const proceedRedirect = (role: string) => {
    if (role === 'Super Admin' || role === 'Instructor') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      
      {/* Account Sharing Warning Popup */}
      {sharingDetected && (
        <div className={styles.overlay}>
          <div className={`glass-card ${styles.popup}`}>
            <span className={styles.popupIcon}>
              <Alert size={36} color="#EF4444" />
            </span>
            <h2>Active Session Alert</h2>
            <p className={styles.popupText}>
              Your account is active on another device. Logging in here will automatically terminate the other active session.
            </p>
            <div className="gold-divider" style={{ margin: '16px 0' }} />
            <button
              onClick={() => {
                setSharingDetected(false);
                const current = localStorage.getItem('iot_current_user');
                if (current) {
                  const role = JSON.parse(current).role;
                  proceedRedirect(role);
                }
              }}
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center' }}
            >
              Understand &amp; Terminate Old Session
            </button>
          </div>
        </div>
      )}

      <div className={`glass-card ${styles.card}`}>
        <h1 className={styles.title}>Warrior <span className="text-gradient">Portal Login</span></h1>
        <p className={styles.subtitle}>Enter credentials to access dashboards, circuit sheets, and code libraries.</p>
        
        {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

        {!showOtp ? (
          <form onSubmit={handleLogin} className={styles.form}>
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
              <div className={styles.labelRow}>
                <label className="form-label">Password:</label>
                <a href="#" className={styles.forgot}>Forgot Password?</a>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 12 }}>
              Secure Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} className={styles.form}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              A verification code has been dispatched. Enter <strong>1234</strong> to simulate OTP confirmation.
            </p>
            <div className="form-group">
              <label className="form-label">Verification OTP Code:</label>
              <input
                type="text"
                required
                maxLength={4}
                placeholder="Enter 4-digit code"
                value={otpVal}
                onChange={e => setOtpVal(e.target.value)}
                className="form-input"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>
              Confirm OTP &amp; Authorize Device
            </button>
          </form>
        )}

        <div className="gold-divider" style={{ margin: '24px 0' }} />

        {/* Third-party logs */}
        <button
          onClick={() => {
            setEmail('student@techiotwarriors.com');
            setErrorMsg('Google simulation: Student credential loaded. Click Login.');
          }}
          className={styles.googleBtn}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Globe size={18} />
          <span>Login with Google Workspace</span>
        </button>

        <p className={styles.signupLink} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <span>New to Tech IoT Warriors?</span>
          <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span>Sign Up here</span>
            <ArrowRight size={14} />
          </Link>
        </p>

        {/* Demo helpers */}
        <div className={styles.demoHelpers}>
          <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Alert size={14} color="var(--matte-gold)" />
            <span>Developer Demos Login Credentials:</span>
          </strong>
          <p style={{ marginTop: '6px' }}>• Super Admin: <code>admin@techiotwarriors.com</code></p>
          <p style={{ marginTop: '4px' }}>• Active Student: <code>student@techiotwarriors.com</code></p>
          <p style={{ marginTop: '4px' }}>• Unverified Student: <code>newbie@techiotwarriors.com</code></p>
        </div>
      </div>
    </div>
  );
}
