'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getRegisteredUsers, updateUsersDb } from '@/lib/db';
import styles from './SignupPage.module.css';
import { Check, ArrowRight } from '@/components/ui/Icons';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const users = getRegisteredUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      setErrorMsg('This email address is already registered. Please Login.');
      return;
    }

    const newUser = {
      email: email.toLowerCase(),
      name,
      phone,
      role: 'Student' as const,
      isActive: false,
      isSuspended: false,
      status: 'Pending Verification' as const, // Blocked until manually verified
      devices: [],
      currentSessionId: ''
    };

    const updatedDb = [...users, newUser];
    updateUsersDb(updatedDb);
    setSuccess(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className={`glass-card ${styles.card}`}>
        {!success ? (
          <>
            <h1 className={styles.title}>Create <span className="text-gradient">Warrior Account</span></h1>
            <p className={styles.subtitle}>Sign up to access verified IoT code scripts, circuit pin maps, and course certifications.</p>

            {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

            <form onSubmit={handleSignup} className={styles.form}>
              <div className="form-group">
                <label className="form-label">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
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
                <label className="form-label">Secure Password:</label>
                <input
                  type="password"
                  required
                  placeholder="Create password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 12 }}>
                Register Account
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successBlock}>
            <span className={styles.successIcon} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={48} color="var(--matte-gold)" />
            </span>
            <h2>Registration Successful!</h2>
            <p>
              Your warrior account for <strong>{email}</strong> has been registered. 
              To activate your course access, proceed to our secure UPI QR payment screen.
            </p>
            <div className="gold-divider" style={{ margin: '20px 0' }} />
            <Link href={`/payment?email=${email}`} className="btn btn-primary w-full" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span>Proceed to QR Payment</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {!success && (
          <p className={styles.loginLink} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>Already a registered warrior?</span>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>Login here</span>
              <ArrowRight size={14} />
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
