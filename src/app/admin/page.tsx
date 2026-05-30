'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getRegisteredUsers, updateUsersDb, saveHomepageConfig, getHomepageConfig } from '@/lib/db';
import styles from './Admin.module.css';
import { Shield, Zap, Lock, Bell } from '@/components/ui/Icons';

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Announcement system
  const [announcement, setAnnouncement] = useState('');
  const [announcementsList, setAnnouncementsList] = useState<string[]>([]);

  // Page Editor
  const [heroHeading, setHeroHeading] = useState('');
  const [heroSubheading, setHeroSubheading] = useState('');

  // Info message
  const [infoMsg, setInfoMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    const current = getCurrentUser();
    if (!current || (current.role !== 'Super Admin' && current.role !== 'Instructor')) {
      // Redirect students out of admin panel
      if (typeof window !== 'undefined') window.location.href = '/login';
      return;
    }
    setAdminUser(current);

    // Initial load
    setUsersList(getRegisteredUsers());
    const storedPending = localStorage.getItem('pending_payments') || '[]';
    setPendingPayments(JSON.parse(storedPending));

    const config = getHomepageConfig();
    setHeroHeading(config.heroHeading);
    setHeroSubheading(config.heroSubheading);

    const announcements = localStorage.getItem('announcements') || '[]';
    setAnnouncementsList(JSON.parse(announcements));
  }, []);

  const refreshData = () => {
    setUsersList(getRegisteredUsers());
    const storedPending = localStorage.getItem('pending_payments') || '[]';
    setPendingPayments(JSON.parse(storedPending));
  };

  const handleApprovePayment = (email: string) => {
    const users = getRegisteredUsers();
    const updatedUsers = users.map(u => {
      if (u.email === email) {
        return { ...u, status: 'Active' as const };
      }
      return u;
    });
    updateUsersDb(updatedUsers);

    // Remove from pending list
    const updatedPending = pendingPayments.filter(p => p.email !== email);
    localStorage.setItem('pending_payments', JSON.stringify(updatedPending));
    setPendingPayments(updatedPending);

    setInfoMsg(`Approved payment screenshot for: ${email}. Account activated.`);
    refreshData();
  };

  const handleRejectPayment = (email: string) => {
    const users = getRegisteredUsers();
    const updatedUsers = users.map(u => {
      if (u.email === email) {
        return { ...u, status: 'None' as const };
      }
      return u;
    });
    updateUsersDb(updatedUsers);

    // Remove from pending list
    const updatedPending = pendingPayments.filter(p => p.email !== email);
    localStorage.setItem('pending_payments', JSON.stringify(updatedPending));
    setPendingPayments(updatedPending);

    setInfoMsg(`Rejected payment for: ${email}. Status reset.`);
    refreshData();
  };

  const toggleUserSuspension = (email: string) => {
    const users = getRegisteredUsers();
    const updatedUsers = users.map(u => {
      if (u.email === email) {
        return { ...u, isSuspended: !u.isSuspended };
      }
      return u;
    });
    updateUsersDb(updatedUsers);
    setInfoMsg(`Toggled suspension state for: ${email}`);
    refreshData();
  };

  const handleResetPassword = (email: string) => {
    setInfoMsg(`Dispatched secure reset password link to: ${email}`);
  };

  const handleSavePageConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveHomepageConfig({ heroHeading, heroSubheading });
    setInfoMsg('Homepage configuration changes updated. Check Home page! ✅');
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim()) return;

    const list = [announcement, ...announcementsList];
    localStorage.setItem('announcements', JSON.stringify(list));
    setAnnouncementsList(list);
    setAnnouncement('');
    setInfoMsg('Broadcast announcement dispatched to all active dashboard feeds.');
  };

  // Metrics
  const metrics = {
    totalStudents: usersList.filter(u => u.role === 'Student').length,
    activeSessions: usersList.filter(u => u.isActive).length,
    pendingVerifications: pendingPayments.length,
    revenue: usersList.filter(u => u.status === 'Active' && u.role === 'Student').length * 1499
  };

  if (!adminUser) return <div className="loading-overlay"><div className="loading-spinner" /></div>;

  return (
    <div className={styles.container}>
      <div className="container">
        {/* Admin Header */}
        <div className={`glass-card ${styles.header}`}>
          <div>
            <h2>🛡️ Tech IoT Warriors Control Room</h2>
            <p>Role Authorized: <span className="text-gold" style={{ fontWeight: 600 }}>{adminUser.name} ({adminUser.role})</span></p>
          </div>
          <div className={styles.badgeRow}>
            <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Shield size={12} /> Super Admin Access</span>
          </div>
        </div>

        {/* Info Notification Toast */}
        {infoMsg && (
          <div className={styles.infoToast}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Zap size={14} /> {infoMsg}</span>
            <button onClick={() => setInfoMsg('')} className={styles.toastClose}>✕</button>
          </div>
        )}

        <div className={styles.layout}>
          {/* Menu */}
          <div className={styles.sidebar}>
            <button onClick={() => setActiveTab('analytics')} className={`${styles.sideLink} ${activeTab === 'analytics' ? styles.activeSide : ''}`}>
              System Analytics
            </button>
            <button onClick={() => setActiveTab('payments')} className={`${styles.sideLink} ${activeTab === 'payments' ? styles.activeSide : ''}`}>
              Payments Screenshot approval ({pendingPayments.length})
            </button>
            <button onClick={() => setActiveTab('users')} className={`${styles.sideLink} ${activeTab === 'users' ? styles.activeSide : ''}`}>
              Student Management
            </button>
            <button onClick={() => setActiveTab('announcements')} className={`${styles.sideLink} ${activeTab === 'announcements' ? styles.activeSide : ''}`}>
              Announcement Systems
            </button>
            <button onClick={() => setActiveTab('editor')} className={`${styles.sideLink} ${activeTab === 'editor' ? styles.activeSide : ''}`}>
              Homepage Content Editor
            </button>
          </div>

          {/* Panel content */}
          <div className={styles.panel}>
            
            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className={styles.analytics}>
                <h3>System Analytics overview</h3>
                <div className={styles.metricsGrid}>
                  <div className={`glass-card ${styles.metricCard}`}>
                    <span>Total Students</span>
                    <strong>{metrics.totalStudents}</strong>
                  </div>
                  <div className={`glass-card ${styles.metricCard}`}>
                    <span>Active Sessions</span>
                    <strong>{metrics.activeSessions}</strong>
                  </div>
                  <div className={`glass-card ${styles.metricCard}`}>
                    <span>Pending Payments</span>
                    <strong>{metrics.pendingVerifications}</strong>
                  </div>
                  <div className={`glass-card ${styles.metricCard}`}>
                    <span>Est. Gross Revenue</span>
                    <strong>₹{metrics.revenue.toLocaleString()}</strong>
                  </div>
                </div>

                <div className={`glass-card ${styles.innerCard}`} style={{ marginTop: 32 }}>
                  <h4 style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Lock size={16} /> Current Platform Security Parameters</h4>
                  <ul className={styles.secList}>
                    <li>• Maximum Allowed Devices Per Account: <strong>2 Trusted devices</strong></li>
                    <li>• Active Concurrency Threshold: <strong>1 Active session</strong></li>
                    <li>• Suspicious Location Logins Actions: <strong>Enforce 2FA OTP</strong></li>
                  </ul>
                </div>
              </div>
            )}

            {/* Payments Approval Tab */}
            {activeTab === 'payments' && (
              <div className={styles.payments}>
                <h3>Manual UPI Screenshot Verification</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
                  Compare the uploaded receipt with the bank transaction records before approving.
                </p>

                {pendingPayments.length > 0 ? (
                  <div className={styles.paymentsList}>
                    {pendingPayments.map((p, idx) => (
                      <div key={idx} className={`glass-card ${styles.payItem}`}>
                        <div className={styles.payDetails}>
                          <h4>Student: {p.name}</h4>
                          <p>Email: {p.email} | Phone: {p.phone}</p>
                          <p className="text-gold" style={{ fontWeight: 600 }}>Item: {p.selectedCourse}</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Uploaded: {p.timestamp}</span>
                        </div>

                        {/* Invoice image stream */}
                        <div className={styles.screenshotFrame}>
                          <img src={p.screenshot} alt="Invoice screenshot" className={styles.screenshotImg} />
                        </div>

                        <div className={styles.payActions}>
                          <button onClick={() => handleApprovePayment(p.email)} className="btn btn-primary btn-sm w-full" style={{ justifyContent: 'center' }}>
                            Approve Payment
                          </button>
                          <button onClick={() => handleRejectPayment(p.email)} className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'center', marginTop: 8 }}>
                            Reject Screenshot
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <h4>No pending payments screenshot verifications.</h4>
                    <p>All students payments have been verified and processed.</p>
                  </div>
                )}
              </div>
            )}

            {/* Student management list */}
            {activeTab === 'users' && (
              <div className={styles.users}>
                <h3>Student Management console</h3>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course Access Status</th>
                        <th>Device count</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u, idx) => (
                        <tr key={idx}>
                          <td>{u.name} <span className="tag" style={{ fontSize: '0.65rem' }}>{u.role}</span></td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`badge ${u.status === 'Active' ? 'badge-green' : u.status === 'Pending Verification' ? 'badge-gold' : 'badge-red'}`}>
                              {u.status}
                            </span>
                            {u.isSuspended && <span className="badge badge-red" style={{ marginLeft: 8 }}>BANNED</span>}
                          </td>
                          <td>{u.devices.length} Devices</td>
                          <td>
                            <div className={styles.actionRow}>
                              <button onClick={() => toggleUserSuspension(u.email)} className={`btn btn-sm ${u.isSuspended ? 'btn-outline-gold' : 'btn-secondary'}`} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                                {u.isSuspended ? 'Unban' : 'Ban Account'}
                              </button>
                              <button onClick={() => handleResetPassword(u.email)} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                                Reset Password
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Announcements */}
            {activeTab === 'announcements' && (
              <div className={styles.announcements}>
                <h3>Broadcast announcements</h3>
                <form onSubmit={handlePostAnnouncement} className={styles.form}>
                  <div className="form-group">
                    <label className="form-label">Broadcast Message:</label>
                    <textarea
                      required
                      placeholder="Write global system announcements or weekly meeting reminders..."
                      value={announcement}
                      onChange={e => setAnnouncement(e.target.value)}
                      className="form-input"
                      rows={4}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Publish Announcement
                  </button>
                </form>

                <div className="gold-divider" style={{ margin: '24px 0' }} />

                <h4>Dispatched announcements:</h4>
                <ul className={styles.annList}>
                  {announcementsList.map((ann, i) => (
                    <li key={i} className={styles.annItem} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bell size={14} color="var(--matte-gold)" />
                      <span>{ann}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Homepage Editor */}
            {activeTab === 'editor' && (
              <div className={styles.editor}>
                <h3>Homepage Content Editor</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
                  Customize the landing header variables dynamically. Changes sync immediately.
                </p>

                <form onSubmit={handleSavePageConfig} className={styles.form}>
                  <div className="form-group">
                    <label className="form-label">Hero Main Heading text:</label>
                    <input
                      type="text"
                      required
                      value={heroHeading}
                      onChange={e => setHeroHeading(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hero Subheading description:</label>
                    <textarea
                      required
                      rows={4}
                      value={heroSubheading}
                      onChange={e => setHeroSubheading(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Save Homepage updates
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
