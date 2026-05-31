'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCurrentUser,
  getRegisteredUsers,
  updateUsersDb,
  getWebsiteConfig,
  saveWebsiteConfig,
  getCourses,
  saveCourses,
  getReviews,
  saveReviews,
  getCertificates,
  Course,
  Module,
  Lesson,
  Review
} from '@/lib/db';
import styles from './Admin.module.css';
import { Shield, Zap, Lock, Bell, Cpu, Globe, Wifi, Rocket, Wrench, Clock, BookOpen, Star, Play, Plus, Trash2, Edit3, ArrowUp, ArrowDown } from '@/components/ui/Icons';

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [infoMsg, setInfoMsg] = useState('');
  
  // Courses database
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  // Module syllabus reorder
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Lesson Edit Modal
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonModuleIndex, setLessonModuleIndex] = useState<number>(-1);
  const [lessonCourseId, setLessonCourseId] = useState<string>('');
  
  // Video upload simulator
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [uploadStatus, setUploadStatus] = useState('');
  const [youtubeUrlInput, setYoutubeUrlInput] = useState('');

  // Website Config Editor
  const [webConfig, setWebConfig] = useState<any>(null);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Certificate log
  const [certificatesLog, setCertificatesLog] = useState<any[]>([]);

  // Announcement systems
  const [announcement, setAnnouncement] = useState('');
  const [announcementsList, setAnnouncementsList] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const current = getCurrentUser();
    if (!current || (current.role !== 'Super Admin' && current.role !== 'Instructor')) {
      if (typeof window !== 'undefined') window.location.href = '/login';
      return;
    }
    setAdminUser(current);

    // Initial database loads
    setUsersList(getRegisteredUsers());
    setCoursesList(getCourses());
    setReviewsList(getReviews());
    setWebConfig(getWebsiteConfig());
    setCertificatesLog(getCertificates());

    const storedPending = localStorage.getItem('pending_payments') || '[]';
    setPendingPayments(JSON.parse(storedPending));

    const announcements = localStorage.getItem('announcements') || '[]';
    setAnnouncementsList(JSON.parse(announcements));
  }, []);

  const refreshData = () => {
    setUsersList(getRegisteredUsers());
    setCoursesList(getCourses());
    setReviewsList(getReviews());
    setCertificatesLog(getCertificates());
    const storedPending = localStorage.getItem('pending_payments') || '[]';
    setPendingPayments(JSON.parse(storedPending));
  };

  const showNotification = (msg: string) => {
    setInfoMsg(msg);
    setTimeout(() => setInfoMsg(''), 4000);
  };

  // UPI Payments Screen handlers
  const handleApprovePayment = (email: string) => {
    const users = getRegisteredUsers();
    const updatedUsers = users.map(u => {
      if (u.email === email) {
        return { ...u, status: 'Active' as const };
      }
      return u;
    });
    updateUsersDb(updatedUsers);

    const updatedPending = pendingPayments.filter(p => p.email !== email);
    localStorage.setItem('pending_payments', JSON.stringify(updatedPending));
    setPendingPayments(updatedPending);

    showNotification(`Approved UPI payment screenshot. Account activated for ${email}.`);
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

    const updatedPending = pendingPayments.filter(p => p.email !== email);
    localStorage.setItem('pending_payments', JSON.stringify(updatedPending));
    setPendingPayments(updatedPending);

    showNotification(`Rejected UPI payment. Status reset for ${email}.`);
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
    showNotification(`Toggled account ban state for: ${email}`);
    refreshData();
  };

  const handleResetPassword = (email: string) => {
    showNotification(`Dispatched secure password reset callback link to: ${email}`);
  };

  // BROADCAST SYSTEM
  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim()) return;

    const list = [announcement, ...announcementsList];
    localStorage.setItem('announcements', JSON.stringify(list));
    setAnnouncementsList(list);
    setAnnouncement('');
    showNotification('Broadcast announcement dispatched to all active dashboard feeds.');
  };

  // COURSE MANAGER CRUD
  const saveCourseState = (updatedCourses: Course[]) => {
    setCoursesList(updatedCourses);
    saveCourses(updatedCourses);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const newCourse: Course = {
      id: (data.get('id') as string).trim(),
      title: data.get('title') as string,
      desc: data.get('desc') as string,
      duration: data.get('duration') as string,
      difficulty: data.get('difficulty') as any,
      lessons: 0,
      rating: 5.0,
      price: '₹' + data.get('price'),
      originalPrice: '₹' + data.get('originalPrice'),
      thumbnail: data.get('thumbnail') as string,
      tags: (data.get('tags') as string).split(',').map(t => t.trim()),
      isPremium: data.get('isPremium') === 'true',
      certificateEnabled: data.get('certificateEnabled') === 'true',
      modules: []
    };

    if (coursesList.some(c => c.id === newCourse.id)) {
      alert('Course ID already exists!');
      return;
    }

    const updated = [...coursesList, newCourse];
    saveCourseState(updated);
    setIsCreatingCourse(false);
    showNotification(`New course "${newCourse.title}" successfully added.`);
  };

  const handleEditCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    const updated = coursesList.map(c => {
      if (c.id === editingCourse.id) {
        return editingCourse;
      }
      return c;
    });

    saveCourseState(updated);
    setEditingCourse(null);
    showNotification(`Course "${editingCourse.title}" configurations updated.`);
  };

  const handleDeleteCourse = (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this course? All syllabus links will be erased.')) return;
    const updated = coursesList.filter(c => c.id !== id);
    saveCourseState(updated);
    showNotification(`Course successfully deleted.`);
  };

  // SYLLABUS EDITORS (Modules)
  const handleAddModule = (courseId: string) => {
    const title = prompt('Enter New Module Name:');
    if (!title) return;

    const updated = coursesList.map(c => {
      if (c.id === courseId) {
        const newMod: Module = { title, lessons: [] };
        return {
          ...c,
          modules: [...c.modules, newMod]
        };
      }
      return c;
    });
    saveCourseState(updated);
    showNotification('Syllabus module added.');
  };

  const handleRenameModule = (courseId: string, modIdx: number) => {
    const course = coursesList.find(c => c.id === courseId);
    if (!course) return;

    const title = prompt('Rename Module Title:', course.modules[modIdx].title);
    if (!title) return;

    const updated = coursesList.map(c => {
      if (c.id === courseId) {
        const updatedMods = [...c.modules];
        updatedMods[modIdx] = { ...updatedMods[modIdx], title };
        return { ...c, modules: updatedMods };
      }
      return c;
    });
    saveCourseState(updated);
    showNotification('Syllabus module renamed.');
  };

  const handleDeleteModule = (courseId: string, modIdx: number) => {
    if (!confirm('Permanently delete this module and ALL its lessons?')) return;
    const updated = coursesList.map(c => {
      if (c.id === courseId) {
        const updatedMods = c.modules.filter((_, idx) => idx !== modIdx);
        // Recalculate lessons count
        const totalL = updatedMods.reduce((acc, m) => acc + m.lessons.length, 0);
        return { ...c, modules: updatedMods, lessons: totalL };
      }
      return c;
    });
    saveCourseState(updated);
    showNotification('Module deleted.');
  };

  const handleReorderModule = (courseId: string, modIdx: number, dir: 'up' | 'down') => {
    const updated = coursesList.map(c => {
      if (c.id === courseId) {
        const updatedMods = [...c.modules];
        const swapIdx = dir === 'up' ? modIdx - 1 : modIdx + 1;
        if (swapIdx < 0 || swapIdx >= updatedMods.length) return c;

        const temp = updatedMods[modIdx];
        updatedMods[modIdx] = updatedMods[swapIdx];
        updatedMods[swapIdx] = temp;
        return { ...c, modules: updatedMods };
      }
      return c;
    });
    saveCourseState(updated);
  };

  // SYLLABUS EDITORS (Lessons)
  const openLessonEditor = (courseId: string, modIdx: number, lesson: Lesson | null) => {
    setLessonCourseId(courseId);
    setLessonModuleIndex(modIdx);
    if (lesson) {
      setEditingLesson(lesson);
      setYoutubeUrlInput(lesson.url);
    } else {
      // Setup default new lesson
      setEditingLesson({
        id: 'les_' + Math.random().toString(36).substr(2, 9),
        title: 'New Lesson',
        duration: '15m',
        url: '',
        isLocked: true,
        description: '',
        isPreview: false,
        resources: []
      });
      setYoutubeUrlInput('');
    }
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    const updated = coursesList.map(c => {
      if (c.id === lessonCourseId) {
        const updatedMods = [...c.modules];
        const mod = updatedMods[lessonModuleIndex];
        const lesExists = mod.lessons.some(l => l.id === editingLesson.id);
        
        let updatedLessons;
        if (lesExists) {
          updatedLessons = mod.lessons.map(l => l.id === editingLesson.id ? { ...editingLesson, url: youtubeUrlInput } : l);
        } else {
          updatedLessons = [...mod.lessons, { ...editingLesson, url: youtubeUrlInput }];
        }

        updatedMods[lessonModuleIndex] = { ...mod, lessons: updatedLessons };
        const totalL = updatedMods.reduce((acc, m) => acc + m.lessons.length, 0);
        return { ...c, modules: updatedMods, lessons: totalL };
      }
      return c;
    });

    saveCourseState(updated);
    setEditingLesson(null);
    showNotification('Lesson saved successfully.');
  };

  const handleDeleteLesson = (courseId: string, modIdx: number, lesId: string) => {
    if (!confirm('Permanent delete lesson?')) return;
    const updated = coursesList.map(c => {
      if (c.id === courseId) {
        const updatedMods = [...c.modules];
        const mod = updatedMods[modIdx];
        const updatedLessons = mod.lessons.filter(l => l.id !== lesId);
        updatedMods[modIdx] = { ...mod, lessons: updatedLessons };
        const totalL = updatedMods.reduce((acc, m) => acc + m.lessons.length, 0);
        return { ...c, modules: updatedMods, lessons: totalL };
      }
      return c;
    });
    saveCourseState(updated);
    showNotification('Lesson deleted.');
  };

  // VIDEO FILE UPLOAD SIMULATOR
  const simulateVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setUploadProgress(0);
      setUploadStatus('Reading local MP4 container bits...');

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress === 20) {
          setUploadStatus('Uploading raw buffer to Secure Storage S3...');
        } else if (progress === 40) {
          setUploadStatus('Transcoding MP4 into private HLS (1080p, 720p stream profiles)...');
        } else if (progress === 70) {
          setUploadStatus('Enforcing secure DRM restrictions, locking download capabilities...');
        } else if (progress === 90) {
          setUploadStatus('Deploying verification key signatures on Edge Servers...');
        } else if (progress === 100) {
          clearInterval(interval);
          setUploadStatus('Encryption complete! Private Secure URL generated.');
          
          // Set simulated URL (Blob URL for current browser session playability)
          const mockURL = URL.createObjectURL(file);
          setYoutubeUrlInput(mockURL);
          showNotification('Simulated MP4 upload ingestion pipeline completed. Done!');
        }
      }, 400);
    }
  };

  // WEBSITE CONTENT EDITOR
  const handleSaveWebsiteConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webConfig) return;
    saveWebsiteConfig(webConfig);
    showNotification('Website dynamic configurations saved successfully. Check Home / About / Contact! ✅');
  };

  // REVIEWS EDITOR CRUD
  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    let updated;
    const exists = reviewsList.some(r => r.id === editingReview.id);
    if (exists) {
      updated = reviewsList.map(r => r.id === editingReview.id ? editingReview : r);
    } else {
      updated = [...reviewsList, editingReview];
    }

    setReviewsList(updated);
    saveReviews(updated);
    setEditingReview(null);
    showNotification('Review updated.');
  };

  const handleDeleteReview = (id: string) => {
    if (!confirm('Permanently delete review?')) return;
    const updated = reviewsList.filter(r => r.id !== id);
    setReviewsList(updated);
    saveReviews(updated);
    showNotification('Review deleted.');
  };

  // Metrics calculating
  const metrics = {
    totalStudents: usersList.filter(u => u.role === 'Student').length,
    activeSessions: usersList.filter(u => u.isActive).length,
    pendingVerifications: pendingPayments.length,
    revenue: usersList.filter(u => u.status === 'Active' && u.role === 'Student').length * 1499,
    coursesCount: coursesList.length,
    certificatesCount: certificatesLog.length
  };

  if (!adminUser || !webConfig) return <div className="loading-overlay"><div className="loading-spinner" /></div>;

  return (
    <div className={styles.container}>
      {/* Mobile Sidebar Hamburger Trigger */}
      <header className={styles.mobileBar}>
        <button className={styles.hamburgerBtn} onClick={() => setSidebarOpen(p => !p)}>
          <span></span><span></span><span></span>
        </button>
        <span className={styles.barTitle}>Tech IoT Warriors Control Panel</span>
      </header>

      <div className={styles.layout}>
        {/* Responsive Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <Zap size={20} color="var(--matte-gold)" />
            <h3>IoT Admin Panel</h3>
          </div>
          
          <nav className={styles.sideNav}>
            <button onClick={() => { setActiveTab('analytics'); setSidebarOpen(false); }} className={`${styles.sideLink} ${activeTab === 'analytics' ? styles.activeSide : ''}`}>
              <Shield size={16} /> <span>System Analytics</span>
            </button>
            <button onClick={() => { setActiveTab('courses'); setSidebarOpen(false); }} className={`${styles.sideLink} ${activeTab === 'courses' ? styles.activeSide : ''}`}>
              <BookOpen size={16} /> <span>Courses &amp; Syllabus</span>
            </button>
            <button onClick={() => { setActiveTab('editor'); setSidebarOpen(false); }} className={`${styles.sideLink} ${activeTab === 'editor' ? styles.activeSide : ''}`}>
              <Edit3 size={16} /> <span>Website Content</span>
            </button>
            <button onClick={() => { setActiveTab('payments'); setSidebarOpen(false); }} className={`${styles.sideLink} ${activeTab === 'payments' ? styles.activeSide : ''}`}>
              <Zap size={16} /> <span>UPI Screenshot approvals ({pendingPayments.length})</span>
            </button>
            <button onClick={() => { setActiveTab('users'); setSidebarOpen(false); }} className={`${styles.sideLink} ${activeTab === 'users' ? styles.activeSide : ''}`}>
              <Shield size={16} /> <span>Student Console</span>
            </button>
            <button onClick={() => { setActiveTab('certs'); setSidebarOpen(false); }} className={`${styles.sideLink} ${activeTab === 'certs' ? styles.activeSide : ''}`}>
              <Lock size={16} /> <span>Issued Certificates ({certificatesLog.length})</span>
            </button>
            <button onClick={() => { setActiveTab('announcements'); setSidebarOpen(false); }} className={`${styles.sideLink} ${activeTab === 'announcements' ? styles.activeSide : ''}`}>
              <Bell size={16} /> <span>Broadcast Feed</span>
            </button>
          </nav>

          <div className={styles.sidebarFooter}>
            <span className={styles.adminName}>{adminUser.name}</span>
            <span className={styles.adminRole}>{adminUser.role} Authorized</span>
          </div>
        </aside>

        {/* Panel View area */}
        <main className={styles.mainContent}>
          {/* Notification Toast */}
          {infoMsg && (
            <div className={styles.infoToast}>
              <span className={styles.toastFlex}><Zap size={14} /> {infoMsg}</span>
              <button onClick={() => setInfoMsg('')} className={styles.toastClose}>✕</button>
            </div>
          )}

          {/* Tab 1: System Analytics */}
          {activeTab === 'analytics' && (
            <div className={styles.panelSection}>
              <h2>🛡️ System Analytics Overview</h2>
              <p className={styles.secDesc}>Live system counters tracking payments, courses, credentials, and user traffic.</p>
              
              <div className={styles.metricsGrid}>
                <div className={`glass-card ${styles.metricCard}`}>
                  <span className={styles.metricLabel}>Total Registered Students</span>
                  <strong className={styles.metricVal}>{metrics.totalStudents}</strong>
                </div>
                <div className={`glass-card ${styles.metricCard}`}>
                  <span className={styles.metricLabel}>Active Dynamic Courses</span>
                  <strong className={styles.metricVal}>{metrics.coursesCount}</strong>
                </div>
                <div className={`glass-card ${styles.metricCard}`}>
                  <span className={styles.metricLabel}>UPI Pending verifications</span>
                  <strong className={styles.metricVal} style={{color: metrics.pendingVerifications > 0 ? 'var(--gold-light)' : 'inherit'}}>{metrics.pendingVerifications}</strong>
                </div>
                <div className={`glass-card ${styles.metricCard}`}>
                  <span className={styles.metricLabel}>Issued Certificates Log</span>
                  <strong className={styles.metricVal}>{metrics.certificatesCount}</strong>
                </div>
                <div className={`glass-card ${styles.metricCard}`}>
                  <span className={styles.metricLabel}>Active Device Sessions</span>
                  <strong className={styles.metricVal}>{metrics.activeSessions}</strong>
                </div>
                <div className={`glass-card ${styles.metricCard}`}>
                  <span className={styles.metricLabel}>Est. Course Revenue</span>
                  <strong className={styles.metricVal}>₹{metrics.revenue.toLocaleString()}</strong>
                </div>
              </div>

              <div className={`glass-card ${styles.detailsCard}`} style={{ marginTop: 24 }}>
                <h4 className={styles.cardHeaderFlex}><Lock size={16} /> Device Abuse Security Rules</h4>
                <ul className={styles.secList}>
                  <li>• Account Sharing Protection: <strong>Strictly enforced (Max 2 trusted devices)</strong></li>
                  <li>• Real-time IP Concurrency Check: <strong>Active (1 concurrent video stream allowed)</strong></li>
                  <li>• Suspicious Login Activity: <strong>Auto-dispatch device verification OTP (1234)</strong></li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Courses & Syllabus */}
          {activeTab === 'courses' && (
            <div className={styles.panelSection}>
              <div className={styles.flexHeader}>
                <div>
                  <h2>Course &amp; Syllabus Manager</h2>
                  <p className={styles.secDesc}>Add courses, modify modules, upload secure videos, and rearrange lessons dynamically.</p>
                </div>
                <button onClick={() => setIsCreatingCourse(true)} className="btn btn-primary btn-sm flex-center">
                  <Plus size={14} /> Add New Course
                </button>
              </div>

              {/* Course creation form */}
              {isCreatingCourse && (
                <div className={`glass-card ${styles.editorFormBox}`}>
                  <h3>Create New IoT Course</h3>
                  <form onSubmit={handleAddCourse} className={styles.gridForm}>
                    <div className="form-group">
                      <label className="form-label">Unique Course ID (e.g. arduino-pro):</label>
                      <input type="text" name="id" required className="form-input" placeholder="e.g. arduino-pro" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Course Title:</label>
                      <input type="text" name="title" required className="form-input" placeholder="Enter title" />
                    </div>
                    <div className="form-group" style={{gridColumn: 'span 2'}}>
                      <label className="form-label">Description Tagline:</label>
                      <textarea name="desc" required rows={2} className="form-input" placeholder="Brief outline" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration Length (e.g. 18 Hours):</label>
                      <input type="text" name="duration" required className="form-input" placeholder="e.g. 15 Hours" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Difficulty:</label>
                      <select name="difficulty" className="form-input" style={{background: 'var(--dark-gray)'}}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pricing INR (Numbers only, e.g. 1499):</label>
                      <input type="number" name="price" required className="form-input" placeholder="1499" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Original Price INR (e.g. 3999):</label>
                      <input type="number" name="originalPrice" required className="form-input" placeholder="3999" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Thumbnail Icon Class:</label>
                      <select name="thumbnail" className="form-input" style={{background: 'var(--dark-gray)'}}>
                        <option value="zap">Zap (Electronics)</option>
                        <option value="cpu">Cpu (Arduino/Hardware)</option>
                        <option value="wifi">Wifi (ESP8266/Smart)</option>
                        <option value="rocket">Rocket (ESP32/RTOS)</option>
                        <option value="globe">Globe (IoT Cloud)</option>
                        <option value="wrench">Wrench (Projects)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tags (comma-separated, e.g. Arduino, WiFi):</label>
                      <input type="text" name="tags" required className="form-input" placeholder="Arduino, WiFi" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Is Premium Content (Lock lessons):</label>
                      <select name="isPremium" className="form-input" style={{background: 'var(--dark-gray)'}}>
                        <option value="true">Locked for Non-Enrolled Students</option>
                        <option value="false">Free course</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Certificate Generation:</label>
                      <select name="certificateEnabled" className="form-input" style={{background: 'var(--dark-gray)'}}>
                        <option value="true">Enable Certificate generation upon assessment passing</option>
                        <option value="false">Disable Certificate</option>
                      </select>
                    </div>
                    <div className={styles.formBtnRow} style={{gridColumn: 'span 2'}}>
                      <button type="submit" className="btn btn-primary btn-sm">Add Course</button>
                      <button type="button" onClick={() => setIsCreatingCourse(false)} className="btn btn-secondary btn-sm">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Course edit details panel */}
              {editingCourse && (
                <div className={`glass-card ${styles.editorFormBox}`}>
                  <h3>Edit Course Details: {editingCourse.title}</h3>
                  <form onSubmit={handleEditCourseSubmit} className={styles.gridForm}>
                    <div className="form-group">
                      <label className="form-label">Course Title:</label>
                      <input type="text" value={editingCourse.title} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} required className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration:</label>
                      <input type="text" value={editingCourse.duration} onChange={e => setEditingCourse({...editingCourse, duration: e.target.value})} required className="form-input" />
                    </div>
                    <div className="form-group" style={{gridColumn: 'span 2'}}>
                      <label className="form-label">Description Tagline:</label>
                      <textarea value={editingCourse.desc} onChange={e => setEditingCourse({...editingCourse, desc: e.target.value})} required rows={2} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pricing INR (e.g. ₹1,499):</label>
                      <input type="text" value={editingCourse.price} onChange={e => setEditingCourse({...editingCourse, price: e.target.value})} required className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Original Price INR (e.g. ₹3,999):</label>
                      <input type="text" value={editingCourse.originalPrice} onChange={e => setEditingCourse({...editingCourse, originalPrice: e.target.value})} required className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Difficulty:</label>
                      <select value={editingCourse.difficulty} onChange={e => setEditingCourse({...editingCourse, difficulty: e.target.value as any})} className="form-input" style={{background: 'var(--dark-gray)'}}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Thumbnail:</label>
                      <select value={editingCourse.thumbnail} onChange={e => setEditingCourse({...editingCourse, thumbnail: e.target.value})} className="form-input" style={{background: 'var(--dark-gray)'}}>
                        <option value="zap">Zap</option>
                        <option value="cpu">Cpu</option>
                        <option value="wifi">Wifi</option>
                        <option value="rocket">Rocket</option>
                        <option value="globe">Globe</option>
                        <option value="wrench">Wrench</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Is Premium Content:</label>
                      <select value={String(editingCourse.isPremium)} onChange={e => setEditingCourse({...editingCourse, isPremium: e.target.value === 'true'})} className="form-input" style={{background: 'var(--dark-gray)'}}>
                        <option value="true">Locked</option>
                        <option value="false">Free</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Certificate Enabled:</label>
                      <select value={String(editingCourse.certificateEnabled)} onChange={e => setEditingCourse({...editingCourse, certificateEnabled: e.target.value === 'true'})} className="form-input" style={{background: 'var(--dark-gray)'}}>
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                      </select>
                    </div>
                    <div className={styles.formBtnRow} style={{gridColumn: 'span 2'}}>
                      <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
                      <button type="button" onClick={() => setEditingCourse(null)} className="btn btn-secondary btn-sm">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Course listings list */}
              <div className={styles.coursesGrid}>
                {coursesList.map(course => (
                  <div key={course.id} className={`glass-card ${styles.courseItemCard}`}>
                    <div className={styles.courseItemHeader}>
                      <span className={styles.itemTags}>
                        {course.tags.map(t => <span key={t} className="tag">{t}</span>)}
                      </span>
                      <div className={styles.itemActionRow}>
                        <button onClick={() => setEditingCourse(course)} className={styles.iconAction} title="Edit basic variables"><Edit3 size={14} /></button>
                        <button onClick={() => handleDeleteCourse(course.id)} className={styles.iconAction} style={{color: '#ef4444'}} title="Delete Course"><Trash2 size={14} /></button>
                      </div>
                    </div>

                    <h3 style={{margin: '12px 0 6px'}}>{course.title}</h3>
                    <p style={{fontSize: '0.82rem', color: 'var(--text-secondary)'}}>{course.desc}</p>

                    <div className={styles.metaStatRow}>
                      <span>Difficulty: <strong>{course.difficulty}</strong></span>
                      <span>Lessons: <strong>{course.lessons} lectures</strong></span>
                      <span>Price: <strong>{course.price}</strong></span>
                    </div>

                    <div className="gold-divider" style={{margin: '12px 0'}} />

                    {/* Expandable Syllabus Modules Drawer */}
                    <div className={styles.syllabusDrawer}>
                      <div className={styles.syllabusHeaderFlex} onClick={() => setExpandedCourseId(expandedCourseId === course.id ? null : course.id)}>
                        <span>📖 Course Syllabus ({course.modules.length} Modules)</span>
                        <span style={{color: 'var(--matte-gold)'}}>{expandedCourseId === course.id ? 'Hide Modules ▲' : 'Manage Syllabus ▼'}</span>
                      </div>

                      {expandedCourseId === course.id && (
                        <div className={styles.syllabusBody}>
                          <div className={styles.drawerActions}>
                            <button onClick={() => handleAddModule(course.id)} className="btn btn-outline-gold btn-sm w-full" style={{justifyContent: 'center', margin: '10px 0'}}>
                              <Plus size={14} /> Add Module Section
                            </button>
                          </div>

                          {course.modules.map((mod, modIdx) => (
                            <div key={modIdx} className={styles.syllabusModuleBox}>
                              <div className={styles.moduleMetaHeader}>
                                <strong>{mod.title}</strong>
                                <div className={styles.reorderControls}>
                                  <button onClick={() => handleReorderModule(course.id, modIdx, 'up')} disabled={modIdx === 0} className={styles.reorderBtn}><ArrowUp size={10} /></button>
                                  <button onClick={() => handleReorderModule(course.id, modIdx, 'down')} disabled={modIdx === course.modules.length - 1} className={styles.reorderBtn}><ArrowDown size={10} /></button>
                                  <button onClick={() => handleRenameModule(course.id, modIdx)} className={styles.reorderBtn} style={{color: '#e8c84a'}}>Rename</button>
                                  <button onClick={() => handleDeleteModule(course.id, modIdx)} className={styles.reorderBtn} style={{color: '#ef4444'}}>Delete</button>
                                </div>
                              </div>

                              {/* Lesson Links in Module */}
                              <div className={styles.lessonsListCol}>
                                {mod.lessons.map((les, lesIdx) => (
                                  <div key={les.id} className={styles.lessonItemRow}>
                                    <span className={styles.lesRowLeft}>
                                      <Play size={12} color="var(--matte-gold)" />
                                      <span>{les.title} ({les.duration})</span>
                                      {les.isLocked && <span className="badge badge-red" style={{fontSize: '8px', padding: '1px 4px'}}>Premium</span>}
                                      {les.isPreview && <span className="badge badge-green" style={{fontSize: '8px', padding: '1px 4px'}}>Preview</span>}
                                    </span>
                                    <span className={styles.lesRowRight}>
                                      <button onClick={() => openLessonEditor(course.id, modIdx, les)} className={styles.inlineActionBtn} style={{color: 'var(--gold-light)'}}><Edit3 size={11} /> Edit</button>
                                      <button onClick={() => handleDeleteLesson(course.id, modIdx, les.id)} className={styles.inlineActionBtn} style={{color: '#ef4444'}}><Trash2 size={11} /> Delete</button>
                                    </span>
                                  </div>
                                ))}

                                <button onClick={() => openLessonEditor(course.id, modIdx, null)} className={styles.addLessonLink} style={{marginTop: 6}}>
                                  <Plus size={11} /> Add Lesson to {mod.title.split(':')[0]}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Lesson Edit Drawer Modal Popup */}
              {editingLesson && (
                <div className={styles.modalOverlay}>
                  <div className={`glass-card ${styles.modalPopup}`}>
                    <h3>Edit Lesson &amp; Video Asset</h3>
                    <form onSubmit={handleSaveLesson} className={styles.lessonForm}>
                      <div className="form-group">
                        <label className="form-label">Lesson Title:</label>
                        <input type="text" value={editingLesson.title} onChange={e => setEditingLesson({...editingLesson, title: e.target.value})} className="form-input" required />
                      </div>
                      
                      <div className="grid-2">
                        <div className="form-group">
                          <label className="form-label">Duration Length (e.g. 20m):</label>
                          <input type="text" value={editingLesson.duration} onChange={e => setEditingLesson({...editingLesson, duration: e.target.value})} className="form-input" required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Locked states:</label>
                          <select value={String(editingLesson.isLocked)} onChange={e => setEditingLesson({...editingLesson, isLocked: e.target.value === 'true'})} className="form-input" style={{background: 'var(--dark-gray)'}}>
                            <option value="true">Premium content (Locked)</option>
                            <option value="false">Free content (Unlocked)</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Lesson Description / Outline text:</label>
                        <textarea value={editingLesson.description || ''} onChange={e => setEditingLesson({...editingLesson, description: e.target.value})} className="form-input" rows={2} placeholder="Explain what student learns here." />
                      </div>

                      <div className="grid-2">
                        <div className="form-group">
                          <label className="form-label">Is Allowed Free Preview:</label>
                          <select value={String(editingLesson.isPreview || false)} onChange={e => setEditingLesson({...editingLesson, isPreview: e.target.value === 'true'})} className="form-input" style={{background: 'var(--dark-gray)'}}>
                            <option value="false">No Preview</option>
                            <option value="true">Allow Preview before enrolling</option>
                          </select>
                        </div>
                      </div>

                      {/* Video Stream URL upload management */}
                      <div className={`glass-card ${styles.videoUploadBox}`}>
                        <h4>Secure Video Asset Integration</h4>
                        <div className="form-group">
                          <label className="form-label">Video Streaming Link (YouTube Embed or direct MP4 link):</label>
                          <input type="text" value={youtubeUrlInput} onChange={e => setYoutubeUrlInput(e.target.value)} className="form-input" placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ" required />
                        </div>

                        <div className={styles.fileUploadSplit}>
                          <div style={{flex: 1}}>
                            <label className={`btn btn-secondary btn-sm ${styles.fileLabelBtn}`}>
                              📁 Upload Secure MP4 File
                              <input type="file" accept="video/mp4" onChange={simulateVideoUpload} style={{display: 'none'}} />
                            </label>
                            <p style={{fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4}}>Simulation ingests, transcodes and DRM encrypts the MP4 container.</p>
                          </div>

                          {uploadProgress >= 0 && (
                            <div className={styles.uploadProgressCol}>
                              <div className={styles.progressTextFlex}>
                                <span>{uploadStatus}</span>
                                <strong>{uploadProgress}%</strong>
                              </div>
                              <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{width: `${uploadProgress}%`}} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={styles.formBtnRow} style={{marginTop: 18}}>
                        <button type="submit" className="btn btn-primary btn-sm">Save Lesson</button>
                        <button type="button" onClick={() => setEditingLesson(null)} className="btn btn-secondary btn-sm">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Website Content Editor */}
          {activeTab === 'editor' && (
            <div className={styles.panelSection}>
              <h2>Website Content &amp; Founder Editor</h2>
              <p className={styles.secDesc}>Update core components (Hero details, Stats counters, Reviews list, About &amp; Contact info, and CEO Founders profiles) instantly without coding.</p>

              <form onSubmit={handleSaveWebsiteConfig} className={styles.webEditorForm}>
                {/* Section A: Hero details */}
                <div className={`glass-card ${styles.editorGroupCard}`}>
                  <h3>1. Hero Landing Page Section</h3>
                  <div className="form-group">
                    <label className="form-label">Hero Main Heading (Wrap gold words in &lt;span class="text-gradient"&gt;):</label>
                    <input type="text" value={webConfig.heroHeading} onChange={e => setWebConfig({...webConfig, heroHeading: e.target.value})} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hero Subheading description:</label>
                    <textarea value={webConfig.heroSubheading} onChange={e => setWebConfig({...webConfig, heroSubheading: e.target.value})} className="form-input" rows={2} required />
                  </div>
                </div>

                {/* Section B: Stats counters */}
                <div className={`glass-card ${styles.editorGroupCard}`}>
                  <h3>2. Key Statistics Counters</h3>
                  <div className="grid-4">
                    <div className="form-group">
                      <label className="form-label">Total Students Value:</label>
                      <input type="text" value={webConfig.statsStudents} onChange={e => setWebConfig({...webConfig, statsStudents: e.target.value})} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Lessons Value:</label>
                      <input type="text" value={webConfig.statsLessons} onChange={e => setWebConfig({...webConfig, statsLessons: e.target.value})} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Certs Issued Value:</label>
                      <input type="text" value={webConfig.statsCerts} onChange={e => setWebConfig({...webConfig, statsCerts: e.target.value})} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Active Projects Value:</label>
                      <input type="text" value={webConfig.statsProjects} onChange={e => setWebConfig({...webConfig, statsProjects: e.target.value})} className="form-input" required />
                    </div>
                  </div>
                </div>

                {/* Section C: Founder branding */}
                <div className={`glass-card ${styles.editorGroupCard}`}>
                  <h3>3. Founder Branding (Nikhil Kumar)</h3>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Founder &amp; CEO Full Name:</label>
                      <input type="text" value={webConfig.founderName} onChange={e => setWebConfig({...webConfig, founderName: e.target.value})} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Founder Role Title:</label>
                      <input type="text" value={webConfig.founderRole} onChange={e => setWebConfig({...webConfig, founderRole: e.target.value})} className="form-input" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Founder Profile Bio:</label>
                    <textarea value={webConfig.founderBio} onChange={e => setWebConfig({...webConfig, founderBio: e.target.value})} className="form-input" rows={4} required />
                  </div>
                </div>

                {/* Section D: About details */}
                <div className={`glass-card ${styles.editorGroupCard}`}>
                  <h3>4. About Page &amp; Company details</h3>
                  <div className="form-group">
                    <label className="form-label">Mission Subheading Tagline:</label>
                    <input type="text" value={webConfig.aboutMission} onChange={e => setWebConfig({...webConfig, aboutMission: e.target.value})} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">The Core Hardware Problem description:</label>
                    <textarea value={webConfig.aboutProblem} onChange={e => setWebConfig({...webConfig, aboutProblem: e.target.value})} className="form-input" rows={4} required />
                  </div>
                </div>

                {/* Section E: Contact details */}
                <div className={`glass-card ${styles.editorGroupCard}`}>
                  <h3>5. Contact &amp; Support Info</h3>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Direct Support Email:</label>
                      <input type="email" value={webConfig.contactEmail} onChange={e => setWebConfig({...webConfig, contactEmail: e.target.value})} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Direct Support Phone / WhatsApp:</label>
                      <input type="text" value={webConfig.contactPhone} onChange={e => setWebConfig({...webConfig, contactPhone: e.target.value})} className="form-input" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Office Physical Address:</label>
                    <input type="text" value={webConfig.contactAddress} onChange={e => setWebConfig({...webConfig, contactAddress: e.target.value})} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Security Abuse Email:</label>
                    <input type="email" value={webConfig.contactAbuseEmail} onChange={e => setWebConfig({...webConfig, contactAbuseEmail: e.target.value})} className="form-input" required />
                  </div>
                </div>

                {/* Section F: Footer info */}
                <div className={`glass-card ${styles.editorGroupCard}`}>
                  <h3>6. Footer configuration</h3>
                  <div className="form-group">
                    <label className="form-label">Footer Brand tagline:</label>
                    <input type="text" value={webConfig.footerTagline} onChange={e => setWebConfig({...webConfig, footerTagline: e.target.value})} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Footer Copyright text:</label>
                    <input type="text" value={webConfig.footerCopyright} onChange={e => setWebConfig({...webConfig, footerCopyright: e.target.value})} className="form-input" required />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{alignSelf: 'flex-start', marginTop: 12}}>
                  Save Platform configuration
                </button>
              </form>

              <div className="gold-divider" style={{margin: '32px 0'}} />

              {/* Customer reviews manager */}
              <div className={styles.reviewsManagerSection}>
                <div className={styles.flexHeader}>
                  <div>
                    <h3>7. Customer Success Reviews</h3>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Manage student reviews listed on homepage dynamically.</p>
                  </div>
                  <button onClick={() => setEditingReview({id: 'rev_' + Math.random().toString(36).substr(2, 9), name: '', role: '', text: '', rating: 5, avatar: 'user'})} className="btn btn-outline-gold btn-sm">
                    <Plus size={12} /> Add Review
                  </button>
                </div>

                {/* Review editing modal */}
                {editingReview && (
                  <div className={styles.modalOverlay}>
                    <div className={`glass-card ${styles.modalPopup}`} style={{maxWidth: 500}}>
                      <h3>Save Review Feedback</h3>
                      <form onSubmit={handleSaveReview} className={styles.lessonForm}>
                        <div className="form-group">
                          <label className="form-label">Student Name:</label>
                          <input type="text" value={editingReview.name} onChange={e => setEditingReview({...editingReview, name: e.target.value})} className="form-input" required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Subtext Role (e.g. ECE Student, IIT):</label>
                          <input type="text" value={editingReview.role} onChange={e => setEditingReview({...editingReview, role: e.target.value})} className="form-input" required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Review text feedback:</label>
                          <textarea value={editingReview.text} onChange={e => setEditingReview({...editingReview, text: e.target.value})} className="form-input" rows={3} required />
                        </div>
                        <div className="grid-2">
                          <div className="form-group">
                            <label className="form-label">Review Rating Stars:</label>
                            <input type="number" min={1} max={5} value={editingReview.rating} onChange={e => setEditingReview({...editingReview, rating: Number(e.target.value)})} className="form-input" required />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Avatar icon type:</label>
                            <select value={editingReview.avatar} onChange={e => setEditingReview({...editingReview, avatar: e.target.value})} className="form-input" style={{background: 'var(--dark-gray)'}}>
                              <option value="user">Student User</option>
                              <option value="wrench">Wrench Maker</option>
                              <option value="award">Gold Awardee</option>
                            </select>
                          </div>
                        </div>
                        <div className={styles.formBtnRow}>
                          <button type="submit" className="btn btn-primary btn-sm">Save Review</button>
                          <button type="button" onClick={() => setEditingReview(null)} className="btn btn-secondary btn-sm">Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                <div className={styles.reviewsListCol}>
                  {reviewsList.map(rev => (
                    <div key={rev.id} className={`glass-card ${styles.reviewItemRow}`}>
                      <div>
                        <strong>{rev.name}</strong> <span style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>({rev.role})</span>
                        <p style={{fontSize: '0.82rem', marginTop: 4, color: 'var(--text-secondary)'}}>"{rev.text}"</p>
                        <span style={{color: 'var(--matte-gold)', fontSize: '0.75rem'}}>★ {rev.rating} rating</span>
                      </div>
                      <div className={styles.reviewActions}>
                        <button onClick={() => setEditingReview(rev)} className={styles.inlineActionBtn} style={{color: 'var(--gold-light)'}}><Edit3 size={11} /> Edit</button>
                        <button onClick={() => handleDeleteReview(rev.id)} className={styles.inlineActionBtn} style={{color: '#ef4444'}}><Trash2 size={11} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Payments Verification */}
          {activeTab === 'payments' && (
            <div className={styles.panelSection}>
              <h2>UPI Payments Screenshot Verification</h2>
              <p className={styles.secDesc}>Review and verify manual UPI screenshots uploaded by students to approve portal access.</p>

              {pendingPayments.length > 0 ? (
                <div className={styles.paymentsGrid}>
                  {pendingPayments.map((p, idx) => (
                    <div key={idx} className={`glass-card ${styles.payItemCard}`}>
                      <div className={styles.payDetails}>
                        <h3>{p.name}</h3>
                        <p>Email: {p.email} | Phone: {p.phone}</p>
                        <p style={{marginTop: 8}}>Purchasing Course: <strong className="text-gold">{p.selectedCourse}</strong></p>
                        <span className={styles.timeBadge}>Uploaded at: {p.timestamp}</span>
                      </div>

                      <div className={styles.screenshotViewer}>
                        <strong className="form-label">Payment Receipt:</strong>
                        <div className={styles.receiptBox}>
                          <img src={p.screenshot} alt="UPI Screenshot" className={styles.receiptImg} />
                        </div>
                      </div>

                      <div className={styles.payActionButtons}>
                        <button onClick={() => handleApprovePayment(p.email)} className="btn btn-primary btn-sm w-full" style={{justifyContent: 'center'}}>
                          Approve Enrollment
                        </button>
                        <button onClick={() => handleRejectPayment(p.email)} className="btn btn-secondary btn-sm w-full" style={{justifyContent: 'center', marginTop: 8}}>
                          Reject Screenshot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyStateBox}>
                  <h4>No pending payments screenshot verifications.</h4>
                  <p>All students payments have been verified and processed.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Student Console */}
          {activeTab === 'users' && (
            <div className={styles.panelSection}>
              <h2>Student Console &amp; Session Management</h2>
              <p className={styles.secDesc}>Manage user status, device authorization slots, account bans, and credentials resets.</p>

              <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course Status</th>
                        <th>Trusted Devices</th>
                        <th>Console Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u, idx) => (
                        <tr key={idx} className={u.isSuspended ? styles.bannedRow : ''}>
                          <td>
                            <strong>{u.name}</strong> 
                            <span className="badge badge-gold" style={{marginLeft: 8, fontSize: '0.65rem'}}>{u.role}</span>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`badge ${u.status === 'Active' ? 'badge-green' : u.status === 'Pending Verification' ? 'badge-gold' : 'badge-red'}`}>
                              {u.status}
                            </span>
                            {u.isSuspended && <span className="badge badge-red" style={{marginLeft: 6}}>BANNED</span>}
                          </td>
                          <td>{u.devices.length} slots active</td>
                          <td>
                            <div className={styles.actionBtnCell}>
                              <button onClick={() => toggleUserSuspension(u.email)} className={`btn btn-sm ${u.isSuspended ? 'btn-outline-gold' : 'btn-secondary'}`} style={{padding: '5px 10px', fontSize: '0.72rem'}}>
                                {u.isSuspended ? 'Unban User' : 'Ban Account'}
                              </button>
                              <button onClick={() => handleResetPassword(u.email)} className="btn btn-secondary btn-sm" style={{padding: '5px 10px', fontSize: '0.72rem'}}>
                                Reset Pwd
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Issued Certificates */}
          {activeTab === 'certs' && (
            <div className={styles.panelSection}>
              <h2>Issued Certificates Ledger</h2>
              <p className={styles.secDesc}>Verify and search issued developer certificate serials and completion dates.</p>

              <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Serial ID</th>
                        <th>Student Name</th>
                        <th>Accredited Course Program</th>
                        <th>Graduation Date</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificatesLog.length > 0 ? (
                        certificatesLog.map((c, idx) => (
                          <tr key={idx}>
                            <td className="text-gold" style={{fontWeight: 700}}>{c.certNumber}</td>
                            <td>{c.studentName}</td>
                            <td>{c.courseName}</td>
                            <td>{c.completionDate}</td>
                            <td><span className="badge badge-green">{c.grade} Passed</span></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)'}}>
                            No developer credentials have been generated yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 7: Announcements */}
          {activeTab === 'announcements' && (
            <div className={styles.panelSection}>
              <h2>Global Broadcast Feeds</h2>
              <p className={styles.secDesc}>Announce news, assignments reminders, or live Zoom meetings to all logged-in students.</p>

              <div className={`glass-card ${styles.editorFormBox}`} style={{maxWidth: 650}}>
                <form onSubmit={handlePostAnnouncement} className={styles.annForm}>
                  <div className="form-group">
                    <label className="form-label">Announcements broadcast body:</label>
                    <textarea required placeholder="Write a global notice (e.g. Scheduled Maintenance, New module released!)..." value={announcement} onChange={e => setAnnouncement(e.target.value)} className="form-input" rows={4} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{alignSelf: 'flex-start'}}>
                    Publish Broadcast
                  </button>
                </form>
              </div>

              <div className="gold-divider" style={{margin: '24px 0'}} />

              <h4>Dispatched Broadcast Notice Feeds:</h4>
              <div className={styles.annListCol}>
                {announcementsList.length > 0 ? (
                  announcementsList.map((ann, idx) => (
                    <div key={idx} className={`glass-card ${styles.annItemRow}`}>
                      <Bell size={14} color="var(--matte-gold)" />
                      <span>{ann}</span>
                    </div>
                  ))
                ) : (
                  <p style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>No broadcasts active.</p>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
