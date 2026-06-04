'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser, setCurrentUser, getRegisteredUsers, updateUsersDb, getCourses } from '@/lib/db';
import styles from './Dashboard.module.css';
import { BookOpen, Shield, Wrench, LogOut, Rocket, Play, Bell, Calendar, Trophy, Alert, Lock, Download, Box } from '@/components/ui/Icons';

function StudentDashboardContent() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load announcements
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      router.push('/login');
      return;
    }
    setUser(current);
    setName(current.name);
    setPhone(current.phone || '');

    // Load announcements
    const storedAnn = localStorage.getItem('announcements') || '[]';
    setAnnouncements(JSON.parse(storedAnn));

    // Handle profile photo from localStorage
    const savedPhoto = localStorage.getItem(`avatar_${current.email}`);
    if (savedPhoto) setPhoto(savedPhoto);

    const handleSync = (e: any) => {
      if (e.detail?.key === 'iot_users_database') {
        const fresh = getCurrentUser();
        if (fresh) {
          setUser(fresh);
          setName(fresh.name);
          setPhone(fresh.phone || '');
        }
      }
    };
    window.addEventListener('db_sync', handleSync);
    return () => {
      window.removeEventListener('db_sync', handleSync);
    };
  }, [router]);

  // Read URL query params to switch tabs and focus fields
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'security', 'profile', 'downloads'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    const focusParam = searchParams.get('focus');
    if (focusParam === 'password') {
      setActiveTab('profile');
      setTimeout(() => {
        const el = document.getElementById('password-form-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          el.style.animation = 'pulse-gold 1s ease 2';
        }
      }, 300);
    }
  }, [searchParams]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');

    const users = getRegisteredUsers();
    const updatedUsers = users.map(u => {
      if (u.email === user.email) {
        const updated = { ...u, name, phone };
        setCurrentUser(updated);
        setUser(updated);
        return updated;
      }
      return u;
    });

    updateUsersDb(updatedUsers);
    setSuccessMsg('Profile details updated successfully!');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setSuccessMsg('Account password updated successfully! Session key re-authorized.');
    setPassword('');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhoto(base64);
        localStorage.setItem(`avatar_${user.email}`, base64);
        setSuccessMsg('Profile avatar image synchronized.');
      };
      reader.readAsDataURL(file);
    }
  };

  const terminateSession = (device: string) => {
    const users = getRegisteredUsers();
    const updatedUsers = users.map(u => {
      if (u.email === user.email) {
        const updated = {
          ...u,
          devices: u.devices.filter(d => d !== device)
        };
        setCurrentUser(updated);
        setUser(updated);
        return updated;
      }
      return u;
    });
    updateUsersDb(updatedUsers);
    setSuccessMsg(`Session terminated on: ${device}`);
  };

  const handleLogout = () => {
    const users = getRegisteredUsers();
    const updatedUsers = users.map(u => {
      if (u.email === user?.email) {
        return { ...u, isActive: false, currentSessionId: '' };
      }
      return u;
    });
    updateUsersDb(updatedUsers);
    setCurrentUser(null);
    router.push('/login');
  };

  // Dynamic Course Downloads Scaffolder
  const getCourseDownloadsList = () => {
    const courses = getCourses();
    const list: any[] = [];
    
    courses.forEach(c => {
      // Add default resources based on course modules
      c.modules.forEach(m => {
        m.lessons.forEach(l => {
          if (l.resources && l.resources.length > 0) {
            l.resources.forEach(r => {
              list.push({
                courseTitle: c.title,
                fileName: r.name,
                fileType: r.type.toUpperCase(),
                url: r.url,
                id: l.id
              });
            });
          }
        });
      });
    });

    // Fallbacks if admin hasn't added resource files to DB yet
    if (list.length === 0) {
      return [
        { courseTitle: 'Electronics Basics & Circuit Designing', fileName: 'Electronics_Basics_Manual_V1.pdf', fileType: 'PDF', url: '#' },
        { courseTitle: 'Arduino Programming & Circuit Building', fileName: 'Arduino_Core_Schematics.pdf', fileType: 'PDF', url: '#' },
        { courseTitle: 'ESP8266 WiFi & Home Automation IoT', fileName: 'Relay_Home_Switchboard_Source.ino', fileType: 'INO', url: '#' },
        { courseTitle: 'ESP32 Advanced IoT with FreeRTOS & HTTP', fileName: 'FreeRTOS_Task_Queues_Examples.zip', fileType: 'ZIP', url: '#' },
        { courseTitle: 'Real-world Smart IoT Industrial Projects', fileName: 'ESP32_CCTV_Camera_Server_Firmware.zip', fileType: 'ZIP', url: '#' },
      ];
    }
    return list;
  };

  const handleSimulateDownload = (fileName: string) => {
    setSuccessMsg(`Initiated secure download: ${fileName}`);
    // Simulate minor download delay
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  if (!user) return <div className="loading-overlay"><div className="loading-spinner" /></div>;

  return (
    <div className={styles.container}>
      <div className="container">
        {/* Profile Card Header */}
        <div className={`glass-card ${styles.profileHeader}`}>
          <div className={styles.avatarCol}>
            <div className={styles.avatarFrame}>
              {photo ? (
                <img src={photo} alt="Avatar" className={styles.avatarImg} />
              ) : (
                <span className={styles.avatarPlaceholder}>{user.name.charAt(0)}</span>
              )}
              <label className={styles.uploadLabel} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--luxury-white)', fontWeight: 'bold' }}>EDIT</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <div className={styles.headerInfo}>
              <h2>Welcome back, {user.name}</h2>
              <span className="tag">{user.role}</span>
              <p>{user.email}</p>
            </div>
          </div>

          <div className={styles.headerStats}>
            <div className={styles.statBox}>
              <strong>82%</strong>
              <span>Course Progress</span>
            </div>
            <div className={styles.statBox}>
              <strong>2 / 4</strong>
              <span>Active Certs</span>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && <div className={styles.successAlert}>{successMsg}</div>}

        {/* Workspace Layout */}
        <div className={styles.layout}>
          {/* Sidebar Nav */}
          <div className={styles.sidebar}>
            <button
              onClick={() => setActiveTab('overview')}
              className={`${styles.sideLink} ${activeTab === 'overview' ? styles.activeSide : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <BookOpen size={16} />
              <span>Learning Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('downloads')}
              className={`${styles.sideLink} ${activeTab === 'downloads' ? styles.activeSide : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Download size={16} />
              <span>Download Resources</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${styles.sideLink} ${activeTab === 'security' ? styles.activeSide : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Shield size={16} />
              <span>Security &amp; Sessions</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`${styles.sideLink} ${activeTab === 'profile' ? styles.activeSide : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Wrench size={16} />
              <span>Profile Settings</span>
            </button>
            <button 
              onClick={handleLogout} 
              className={`${styles.sideLink} ${styles.logoutBtn}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <LogOut size={16} />
              <span>Log Out Account</span>
            </button>
          </div>

          {/* Main Dashboard Panel */}
          <div className={styles.panel}>
            {/* Tab 1: Learning Overview */}
            {activeTab === 'overview' && (
              <div className={styles.overview}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={20} color="var(--matte-gold)" />
                  <span>Continue Learning</span>
                </h3>
                
                {/* Course Card */}
                <div className={`glass-card ${styles.learningCard}`}>
                  <div className={styles.learningThumb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Rocket size={32} color="var(--matte-gold)" />
                  </div>
                  <div className={styles.learningContent}>
                    <span className="tag">ESP32 Advanced IoT</span>
                    <h4>ESP32 Advanced IoT with FreeRTOS &amp; HTTP</h4>
                    <p>Next Lesson: <strong>Lesson 4.1: ESP32 Dual Core Architecture &amp; Tasks</strong></p>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '40%' }} />
                    </div>
                    <span className={styles.progressLabel}>Module 4 of 5 (40% Complete)</span>
                  </div>
                  <button onClick={() => router.push('/courses/esp32-advanced-iot')} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Resume Lesson <Play size={12} />
                  </button>
                </div>

                <div className="gold-divider" style={{ margin: '24px 0' }} />

                {/* Notifications & Reminders */}
                <div className={styles.overviewGrid}>
                  <div className={`glass-card ${styles.innerCard}`}>
                    <h4 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Bell size={16} color="var(--matte-gold)" />
                      <span>Class Live Reminders &amp; Broadcasts</span>
                    </h4>
                    <ul className={styles.innerList}>
                      {announcements.length > 0 ? (
                        announcements.slice(0, 3).map((ann, idx) => (
                          <li key={idx} style={{ marginTop: idx > 0 ? 12 : 0 }}>
                            <strong style={{ color: 'var(--matte-gold)' }}>Notice:</strong>
                            <p>{ann}</p>
                          </li>
                        ))
                      ) : (
                        <li>
                          <strong style={{ color: '#EF4444' }}>Live Now:</strong>
                          <p>ESP32 Cam Smart Facial Lock Assembly is streaming. Join Classroom.</p>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className={`glass-card ${styles.innerCard}`}>
                    <h4 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Trophy size={16} color="var(--matte-gold)" />
                      <span>Acquired Certificates</span>
                    </h4>
                    <ul className={styles.innerList}>
                      <li>
                        <strong>✓ Electronics Basics Certified</strong>
                        <p>Verified on May 15, 2026. Credentials secure.</p>
                      </li>
                      <li style={{ marginTop: 12 }}>
                        <strong>✓ Arduino Mastery Certified</strong>
                        <p>Verified on May 22, 2026. Credentials secure.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Downloads tab */}
            {activeTab === 'downloads' && (
              <div className={styles.downloadsSection}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={20} color="var(--matte-gold)" />
                  <span>Download Course Resources</span>
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
                  Retrieve lecture worksheets, MCU C/C++ code scripts, and Fritzing wiring diagrams unlocked by your courses.
                </p>

                <div className={styles.downloadGrid}>
                  {getCourseDownloadsList().map((dl, idx) => (
                    <div key={idx} className={`glass-card ${styles.downloadCard}`}>
                      <div className={styles.downloadMeta}>
                        <span className={styles.dlCourseTitle}>{dl.courseTitle}</span>
                        <h4 className={styles.dlFileName}>{dl.fileName}</h4>
                        <span className={`badge ${dl.fileType === 'PDF' ? 'badge-green' : dl.fileType === 'ZIP' ? 'badge-blue' : 'badge-gold'}`} style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                          {dl.fileType} Resource File
                        </span>
                      </div>
                      <button onClick={() => handleSimulateDownload(dl.fileName)} className="btn btn-outline-gold btn-sm w-full flex-center" style={{ marginTop: 16 }}>
                        <Download size={14} /> Download File
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Security & Devices */}
            {activeTab === 'security' && (
              <div className={styles.security}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={20} color="var(--matte-gold)" />
                  <span>Device &amp; Session Management</span>
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
                  For compliance, you can authorize a maximum of 2 trusted devices. Only 1 active login session is permitted simultaneously.
                </p>

                <div className={`glass-card ${styles.innerCard}`}>
                  <h4>Active Trusted Devices ({user.devices.length} / 2)</h4>
                  <ul className={styles.deviceList}>
                    {user.devices.map((device: string, idx: number) => (
                      <li key={idx} className={styles.deviceItem}>
                        <div>
                          <strong>{device}</strong>
                          <p style={{ fontSize: '0.75rem', color: '#22c55e' }}>✓ Connected &amp; Authorized</p>
                        </div>
                        <button onClick={() => terminateSession(device)} className="btn btn-outline-gold btn-sm">
                          Revoke Access
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`glass-card ${styles.innerCard}`} style={{ marginTop: 24, borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <h4 style={{ color: '#EF4444', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Alert size={16} />
                    <span>Account Abuse Rules</span>
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 8 }}>
                    We automatically track multi-location concurrent logins. Sharing credentials with third parties will lead to permanent account suspension.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 4: Profile Settings */}
            {activeTab === 'profile' && (
              <div className={styles.profile}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={20} color="var(--matte-gold)" />
                  <span>Update Personal Information</span>
                </h3>
                <form onSubmit={handleProfileUpdate} className={styles.form} style={{ marginTop: 20 }}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Full Name:</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number:</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Save Profile Changes
                  </button>
                </form>

                <div className="gold-divider" style={{ margin: '32px 0' }} />

                <div id="password-form-section" style={{ transition: 'all 0.4s' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={20} color="var(--matte-gold)" />
                    <span>Update Account Password</span>
                  </h3>
                  <form onSubmit={handlePasswordUpdate} className={styles.form} style={{ marginTop: 20 }}>
                    <div className="form-group">
                      <label className="form-label">New Password:</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="form-input"
                        style={{ maxWidth: 350 }}
                      />
                    </div>
                    <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={<div className="loading-overlay"><div className="loading-spinner" /></div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}
