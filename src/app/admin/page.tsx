'use client';
import { useState, useEffect, useRef } from 'react';
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
  saveCertificates,
  getSignatureConfig,
  saveSignatureConfig,
  getCodeSnippets,
  saveCodeSnippets,
  getCircuits,
  saveCircuits,
  getProjects,
  saveProjects,
  getLiveClasses,
  saveLiveClasses,
  Course,
  Module,
  Lesson,
  Review,
  CodeSnippet,
  Circuit,
  Project,
  LiveClass,
  DEFAULT_SNIPPETS,
  DEFAULT_CIRCUITS,
  DEFAULT_PROJECTS,
  DEFAULT_LIVE_CLASSES
} from '@/lib/db';
import styles from './Admin.module.css';
import { Shield, Zap, Lock, Bell, Cpu, Globe, Wifi, Rocket, Wrench, Clock, BookOpen, Star, Play, Plus, Trash2, Edit3, ArrowUp, ArrowDown, Download, Search } from '@/components/ui/Icons';

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

  // Libraries database
  const [codeSnippetsList, setCodeSnippetsList] = useState<CodeSnippet[]>([]);
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null);
  const [isCreatingSnippet, setIsCreatingSnippet] = useState(false);

  const [circuitsList, setCircuitsList] = useState<Circuit[]>([]);
  const [editingCircuit, setEditingCircuit] = useState<Circuit | null>(null);
  const [isCreatingCircuit, setIsCreatingCircuit] = useState(false);

  // Projects Showcase
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Live Classes
  const [liveClassesList, setLiveClassesList] = useState<LiveClass[]>([]);
  const [editingLiveClass, setEditingLiveClass] = useState<LiveClass | null>(null);
  const [isCreatingLiveClass, setIsCreatingLiveClass] = useState(false);

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
  const [isIssuingCert, setIsIssuingCert] = useState(false);
  const [newCertName, setNewCertName] = useState('');
  const [newCertCourse, setNewCertCourse] = useState('');
  const [newCertGrade, setNewCertGrade] = useState('Distinction');
  const [newCertDate, setNewCertDate] = useState('');
  const [previewCert, setPreviewCert] = useState<any | null>(null);
  const [certSearch, setCertSearch] = useState('');
  const [sigName, setSigName] = useState('Nikhil Kumar');
  const [sigDesignation, setSigDesignation] = useState('CEO & Founder');
  const [sigImage, setSigImage] = useState('');
  const adminCanvasRef = useRef<HTMLCanvasElement>(null);

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
    if (typeof window !== 'undefined') {
      const fontId = 'certificate-luxury-fonts';
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Alex+Brush&family=Montserrat:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(link);
      }
    }

    // Initial database loads
    setUsersList(getRegisteredUsers());
    setCoursesList(getCourses());
    setReviewsList(getReviews());
    setWebConfig(getWebsiteConfig());
    setCertificatesLog(getCertificates());
    setCodeSnippetsList(getCodeSnippets());
    setCircuitsList(getCircuits());
    setProjectsList(getProjects());
    setLiveClassesList(getLiveClasses());

    const sigConfig = getSignatureConfig();
    setSigName(sigConfig.name);
    setSigDesignation(sigConfig.designation);
    setSigImage(sigConfig.image);

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
    setCodeSnippetsList(getCodeSnippets());
    setCircuitsList(getCircuits());
    setProjectsList(getProjects());
    setLiveClassesList(getLiveClasses());
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

  // CODE SNIPPETS CRUD
  const handleSaveSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSnippet) return;

    let updated;
    const exists = codeSnippetsList.some(s => s.id === editingSnippet.id);
    if (exists) {
      updated = codeSnippetsList.map(s => s.id === editingSnippet.id ? editingSnippet : s);
    } else {
      updated = [...codeSnippetsList, { ...editingSnippet, id: 'c-' + (codeSnippetsList.length + 1) }];
    }

    setCodeSnippetsList(updated);
    saveCodeSnippets(updated);
    setEditingSnippet(null);
    setIsCreatingSnippet(false);
    showNotification('Code Snippet saved successfully.');
  };

  const handleDeleteSnippet = (id: string) => {
    if (!confirm('Permanently delete this code snippet?')) return;
    const updated = codeSnippetsList.filter(s => s.id !== id);
    setCodeSnippetsList(updated);
    saveCodeSnippets(updated);
    showNotification('Code Snippet deleted.');
  };

  const handleResetSnippets = () => {
    if (!confirm('Are you sure you want to reset Code Snippets to default demo data?')) return;
    setCodeSnippetsList(DEFAULT_SNIPPETS);
    saveCodeSnippets(DEFAULT_SNIPPETS);
    showNotification('Code Snippets reset to default data.');
  };

  const handleClearSnippets = () => {
    if (!confirm('Are you sure you want to delete ALL code snippets?')) return;
    setCodeSnippetsList([]);
    saveCodeSnippets([]);
    showNotification('All Code Snippets cleared.');
  };

  // CIRCUITS CRUD
  const handleSaveCircuit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCircuit) return;

    let updated;
    const exists = circuitsList.some(c => c.id === editingCircuit.id);
    if (exists) {
      updated = circuitsList.map(c => c.id === editingCircuit.id ? editingCircuit : c);
    } else {
      updated = [...circuitsList, { ...editingCircuit, id: 'cir-' + (circuitsList.length + 1) }];
    }

    setCircuitsList(updated);
    saveCircuits(updated);
    setEditingCircuit(null);
    setIsCreatingCircuit(false);
    showNotification('Circuit saved successfully.');
  };

  const handleDeleteCircuit = (id: string) => {
    if (!confirm('Permanently delete this circuit schematic?')) return;
    const updated = circuitsList.filter(c => c.id !== id);
    setCircuitsList(updated);
    saveCircuits(updated);
    showNotification('Circuit schematic deleted.');
  };

  const handleResetCircuits = () => {
    if (!confirm('Are you sure you want to reset Circuits to default demo data?')) return;
    setCircuitsList(DEFAULT_CIRCUITS);
    saveCircuits(DEFAULT_CIRCUITS);
    showNotification('Circuits reset to default data.');
  };

  const handleClearCircuits = () => {
    if (!confirm('Are you sure you want to delete ALL circuits?')) return;
    setCircuitsList([]);
    saveCircuits([]);
    showNotification('All Circuits cleared.');
  };

  // PROJECTS CRUD
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    let updated;
    const exists = projectsList.some(p => p.id === editingProject.id);
    if (exists) {
      updated = projectsList.map(p => p.id === editingProject.id ? editingProject : p);
    } else {
      updated = [...projectsList, editingProject];
    }

    setProjectsList(updated);
    saveProjects(updated);
    setEditingProject(null);
    setIsCreatingProject(false);
    showNotification('Project blueprint saved successfully.');
  };

  const handleDeleteProject = (id: string) => {
    if (!confirm('Permanently delete this project?')) return;
    const updated = projectsList.filter(p => p.id !== id);
    setProjectsList(updated);
    saveProjects(updated);
    showNotification('Project showcase deleted.');
  };

  const handleResetProjects = () => {
    if (!confirm('Are you sure you want to reset Projects to default demo data?')) return;
    setProjectsList(DEFAULT_PROJECTS);
    saveProjects(DEFAULT_PROJECTS);
    showNotification('Projects reset to default data.');
  };

  const handleClearProjects = () => {
    if (!confirm('Are you sure you want to delete ALL projects?')) return;
    setProjectsList([]);
    saveProjects([]);
    showNotification('All Projects cleared.');
  };

  // LIVE CLASSES CRUD
  const handleSaveLiveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLiveClass) return;

    let updated;
    const exists = liveClassesList.some(lc => lc.id === editingLiveClass.id);
    if (exists) {
      updated = liveClassesList.map(lc => lc.id === editingLiveClass.id ? editingLiveClass : lc);
    } else {
      updated = [...liveClassesList, editingLiveClass];
    }

    setLiveClassesList(updated);
    saveLiveClasses(updated);
    setEditingLiveClass(null);
    setIsCreatingLiveClass(false);
    showNotification('Live class saved successfully.');
  };

  const handleDeleteLiveClass = (id: string) => {
    if (!confirm('Permanently delete this live class session?')) return;
    const updated = liveClassesList.filter(lc => lc.id !== id);
    setLiveClassesList(updated);
    saveLiveClasses(updated);
    showNotification('Live class session deleted.');
  };

  const handleResetLiveClasses = () => {
    if (!confirm('Are you sure you want to reset Live Classes to default demo data?')) return;
    setLiveClassesList(DEFAULT_LIVE_CLASSES);
    saveLiveClasses(DEFAULT_LIVE_CLASSES);
    showNotification('Live Classes reset to default data.');
  };

  const handleClearLiveClasses = () => {
    if (!confirm('Are you sure you want to delete ALL live classes?')) return;
    setLiveClassesList([]);
    saveLiveClasses([]);
    showNotification('All Live Classes cleared.');
  };

  // CERTIFICATES MANAGEMENT
  const getTodayDateFormatted = () => {
    const d = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleManualIssueCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim()) {
      alert('Please enter student name.');
      return;
    }
    const certs = getCertificates();
    let maxNum = 0;
    certs.forEach(c => {
      const match = c.certNumber.match(/TIW-2026-(\d+)/);
      if (match) {
        const val = parseInt(match[1], 10);
        if (val > maxNum) maxNum = val;
      }
    });
    const nextNum = maxNum + 1;
    const certNumber = `TIW-2026-${nextNum.toString().padStart(4, '0')}`;

    const newCert = {
      id: 'cert_' + Math.random().toString(36).substr(2, 9),
      certNumber,
      studentName: newCertName.trim(),
      courseName: newCertCourse || 'Real-world Smart IoT Industrial Projects',
      completionDate: newCertDate.trim() || getTodayDateFormatted(),
      verificationCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
      grade: newCertGrade
    };

    const updated = [...certs, newCert];
    saveCertificates(updated);
    setCertificatesLog(updated);
    setIsIssuingCert(false);
    setNewCertName('');
    showNotification(`Certificate ${certNumber} issued successfully.`);
    
    // Set preview cert and render it after a short delay
    setPreviewCert(newCert);
    setTimeout(() => {
      drawAdminCertificate(newCert);
    }, 200);
  };

  const handleDeleteCertificate = (certNumber: string) => {
    if (!confirm(`Are you sure you want to delete certificate ${certNumber}?`)) return;
    const certs = getCertificates();
    const updated = certs.filter(c => c.certNumber !== certNumber);
    saveCertificates(updated);
    setCertificatesLog(updated);
    showNotification(`Certificate ${certNumber} deleted.`);
  };

  const handleResetCertificates = () => {
    if (!confirm('Are you sure you want to reset all certificates to the default reference certificate?')) return;
    const defaultCert = [
      {
        id: 'cert_tiw_default_1',
        certNumber: 'TIW-2026-0001',
        studentName: 'Nikhil Kumar',
        courseName: 'Real-world Smart IoT Industrial Projects',
        completionDate: '26 May 2026',
        verificationCode: 'TIW001',
        grade: 'Distinction'
      }
    ];
    saveCertificates(defaultCert);
    setCertificatesLog(defaultCert);
    showNotification('Certificates reset to reference default.');
  };

  const handleClearCertificates = () => {
    if (!confirm('Are you sure you want to delete ALL certificates? This will empty the ledger.')) return;
    saveCertificates([]);
    setCertificatesLog([]);
    showNotification('All certificates cleared from database.');
  };

  const handleSaveSignatureInfo = (e: React.FormEvent) => {
    e.preventDefault();
    saveSignatureConfig({ name: sigName, designation: sigDesignation, image: sigImage });
    showNotification('Signatory name & designation updated.');
  };

  const handleSignatureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSigImage(base64);
      saveSignatureConfig({ name: sigName, designation: sigDesignation, image: base64 });
      showNotification('Handwritten signature file uploaded successfully.');
    };
    reader.readAsDataURL(file);
  };

  const drawAdminCertificate = (cert: any) => {
    const canvas = adminCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1600;
    canvas.height = 1100;

    const logoImg = new Image();
    logoImg.src = '/tiw-logo-actual.jpg';

    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    const verifyUrl = `${window.location.origin}/certificates?verify=${cert.certNumber}`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;

    const sigConfig = getSignatureConfig();
    const sigImg = new Image();
    if (sigConfig.image) {
      sigImg.crossOrigin = 'anonymous';
      sigImg.src = sigConfig.image;
    }

    const loadPromise = (img: HTMLImageElement) => {
      return new Promise<HTMLImageElement>((resolve) => {
        if (!img.src) {
          resolve(img);
          return;
        }
        if (img.complete && img.naturalWidth > 0) {
          resolve(img);
        } else {
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
        }
      });
    };

    Promise.all([loadPromise(logoImg), loadPromise(qrImg), loadPromise(sigImg)]).then(([loadedLogo, loadedQr, loadedSig]) => {
      document.fonts.ready.then(() => {
        performAdminDraw(ctx, canvas, cert, loadedLogo, loadedQr, loadedSig, sigConfig);
      });
    });
  };

  const performAdminDraw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    cert: any,
    loadedLogo: HTMLImageElement,
    loadedQr: HTMLImageElement,
    loadedSig: HTMLImageElement,
    sigConfig: { name: string, designation: string, image: string }
  ) => {
    canvas.width  = 1600;
    canvas.height = 1100;
    const W  = canvas.width;
    const H  = canvas.height;
    const CX = W / 2;
    const PI = Math.PI;

    const GOLD  = '#B2872A';
    const ga    = (a: number) => `rgba(178,135,42,${a})`;
    const BLACK = '#111111';
    const GREY  = '#444444';
    const LGREY = '#666666';

    // 1. BACKGROUND (soft cream/off-white with concentric dotted rings)
    ctx.fillStyle = '#FCFAF6';
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.strokeStyle = 'rgba(178, 135, 42, 0.05)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([2, 8]);
    for (let r = 250; r < 1400; r += 60) {
      ctx.beginPath();
      ctx.arc(CX, 100, r, 0, PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // 2. OUTER GOLD BORDER
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2.2;
    ctx.strokeRect(24, 24, W - 48, H - 48);
    ctx.strokeStyle = ga(0.40); ctx.lineWidth = 0.6;
    ctx.strokeRect(32, 32, W - 64, H - 64);

    // 3. CORNER ORNAMENTS
    const crosshair = (ox: number, oy: number) => {
      ctx.strokeStyle = GOLD; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(ox - 22, oy); ctx.lineTo(ox + 22, oy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, oy - 22); ctx.lineTo(ox, oy + 22); ctx.stroke();
      ctx.beginPath(); ctx.arc(ox, oy, 3.8, 0, PI * 2);
      ctx.fillStyle = GOLD; ctx.fill();
    };
    crosshair(W - 42, 42);
    crosshair(42, H - 42);

    // 4. TOP-LEFT BLACK CORNER SWEEP
    ctx.fillStyle = BLACK;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(238, 0);
    ctx.bezierCurveTo(124, 16, 56, 72, 0, 238);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = GOLD; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(252, 0); ctx.bezierCurveTo(136, 20, 63, 80, 0, 252); ctx.stroke();
    ctx.strokeStyle = ga(0.55); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(268, 0); ctx.bezierCurveTo(150, 27, 75, 92, 0, 268); ctx.stroke();

    ctx.strokeStyle = GOLD; ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(40, 95);
    ctx.lineTo(40, 40);
    ctx.lineTo(95, 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(40, 40, 3.5, 0, PI * 2);
    ctx.fillStyle = GOLD;
    ctx.fill();

    // 5. BOTTOM-RIGHT BLACK CORNER SWEEP
    ctx.fillStyle = BLACK;
    ctx.beginPath();
    ctx.moveTo(W, H);
    ctx.lineTo(W - 238, H);
    ctx.bezierCurveTo(W - 124, H - 16, W - 56, H - 72, W, H - 238);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = GOLD; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(W - 252, H); ctx.bezierCurveTo(W - 136, H - 20, W - 63, H - 80, W, H - 252); ctx.stroke();
    ctx.strokeStyle = ga(0.55); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(W - 268, H); ctx.bezierCurveTo(W - 150, H - 27, W - 75, H - 92, W, H - 268); ctx.stroke();

    ctx.strokeStyle = GOLD; ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(W - 40, H - 95);
    ctx.lineTo(W - 40, H - 40);
    ctx.lineTo(W - 95, H - 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W - 40, H - 40, 3.5, 0, PI * 2);
    ctx.fillStyle = GOLD;
    ctx.fill();

    // 6. RIGHT-SIDE PCB CIRCUIT TRACES
    {
      ctx.strokeStyle = ga(0.40); ctx.lineWidth = 1.4;
      const rx = W - 46;
      const ry = 160;
      const tracks = [
        { dy: 0,   inset: 200, jog: 52, dj: 28 },
        { dy: 28,  inset: 164, jog: 44, dj: 24 },
        { dy: 56,  inset: 222, jog: 64, dj: 30 },
        { dy: 84,  inset: 144, jog: 38, dj: 22 },
        { dy: 112, inset: 186, jog: 55, dj: 26 },
        { dy: 140, inset: 132, jog: 34, dj: 20 },
        { dy: 175, inset: 98,  jog: 26, dj: 18 },
        { dy: 205, inset: 158, jog: 47, dj: 24 },
      ];
      tracks.forEach(t => {
        const y0 = ry + t.dy, y1 = y0 + t.dj;
        const x1 = rx - t.jog, x2 = x1 - 28, x3 = rx - t.inset;
        ctx.beginPath(); ctx.moveTo(rx, y0); ctx.lineTo(x1, y0); ctx.lineTo(x2, y1); ctx.lineTo(x3, y1); ctx.stroke();
        ctx.beginPath(); ctx.arc(x3 - 3, y1, 2.8, 0, PI * 2);
        ctx.fillStyle = ga(0.55); ctx.fill();
      });
      ctx.strokeStyle = ga(0.28); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(rx - 52, ry);      ctx.lineTo(rx - 52, ry + 84);  ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx - 104, ry + 28); ctx.lineTo(rx - 104, ry + 140); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx - 78, ry + 112); ctx.lineTo(rx - 78, ry + 205); ctx.stroke();
      ctx.strokeStyle = ga(0.25);
      [[rx-172, ry+16],[rx-148, ry+50],[rx-126, ry+82]].forEach(([px,py]) => ctx.strokeRect(px-5, py-5, 10, 10));
    }

    // 7. LEFT-SIDE CIRCUIT TRACES
    {
      ctx.strokeStyle = ga(0.20); ctx.lineWidth = 1.1;
      const lx = 46, ly = 544;
      [[0,108,15,16],[26,84,12,14],[52,123,18,18],[78,92,14,15]].forEach(([dy,len,jog,dj]) => {
        const y0 = ly + dy, y1 = y0 + dj;
        ctx.beginPath(); ctx.moveTo(lx, y0); ctx.lineTo(lx + len - jog - 28, y0);
        ctx.lineTo(lx + len - 28, y1); ctx.lineTo(lx + len, y1); ctx.stroke();
        ctx.beginPath(); ctx.arc(lx + len + 3, y1, 2.2, 0, PI * 2);
        ctx.fillStyle = ga(0.35); ctx.fill();
      });
    }

    // 8. LOGO
    if (loadedLogo && loadedLogo.naturalWidth > 0) {
      const logoW = 250;
      const logoH = 250;
      ctx.drawImage(loadedLogo, CX - logoW / 2, 28, logoW, logoH);
    }

    // 9. "CERTIFICATE" heading
    ctx.textAlign = 'center';
    ctx.fillStyle = BLACK;
    ctx.font = '700 82px "Cinzel", serif';
    ctx.fillText('CERTIFICATE', CX, 397);

    // 10. "OF COMPLETION" gold subtitle
    ctx.fillStyle = GOLD;
    ctx.font = '700 17px "Montserrat", sans-serif';
    ctx.fillText('OF COMPLETION', CX, 440);

    ctx.strokeStyle = GOLD; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(CX - 380, 440); ctx.lineTo(CX - 178, 440); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CX + 178, 440); ctx.lineTo(CX + 380, 440); ctx.stroke();

    const diamond = (dx: number, dy: number, s: number) => {
      ctx.fillStyle = GOLD;
      ctx.save(); ctx.translate(dx, dy); ctx.rotate(PI / 4);
      ctx.fillRect(-s / 2, -s / 2, s, s); ctx.restore();
    };
    diamond(CX - 181, 440, 7);
    diamond(CX + 181, 440, 7);
    diamond(CX, 462, 7.5);

    // 11. "This is to proudly certify that"
    ctx.fillStyle = GREY;
    ctx.font = 'italic 20px "Georgia", "Times New Roman", serif';
    ctx.fillText('This is to proudly certify that', CX, 513);

    // 12. STUDENT NAME
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1.5;
    ctx.shadowOffsetY = 1.5;
    ctx.fillStyle = GOLD;
    ctx.font = '115px "Alex Brush", cursive';
    ctx.fillText(cert.studentName, CX, 625);
    ctx.restore();

    const nw = Math.min(ctx.measureText(cert.studentName).width * 0.72, 640);
    ctx.strokeStyle = ga(0.38); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(CX - nw / 2, 650); ctx.lineTo(CX + nw / 2, 650); ctx.stroke();

    // 13. "has successfully completed the course"
    ctx.fillStyle = GREY;
    ctx.font = 'italic 19px "Georgia", "Times New Roman", serif';
    ctx.fillText('has successfully completed the course', CX, 698);

    // 14. COURSE NAME
    ctx.fillStyle = BLACK;
    ctx.font = '700 31px "Cinzel", serif';
    const ctW = ctx.measureText(cert.courseName).width;
    ctx.fillText(cert.courseName, CX, 752);

    const arrOrn = (ax: number, ay: number, dir: number) => {
      ctx.strokeStyle = GOLD; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + dir * 20, ay);
      ctx.moveTo(ax + dir * 13, ay - 7); ctx.lineTo(ax + dir * 20, ay); ctx.lineTo(ax + dir * 13, ay + 7);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(ax + dir * 27, ay, 3.5, 0, PI * 2);
      ctx.fillStyle = GOLD; ctx.fill();
    };
    arrOrn(CX - ctW / 2 - 50, 748, 1);
    arrOrn(CX + ctW / 2 + 50, 748, -1);

    // 15. FIXED DESCRIPTION TEXT
    ctx.fillStyle = GREY;
    ctx.font = '400 16.5px "Montserrat", sans-serif';
    ctx.fillText('and has verified their engineering competence in hardware circuits configuration,', CX, 805);
    ctx.fillText('microcontroller programming, IoT communication, cloud integration,', CX, 829);
    ctx.fillText('and real-world project development.', CX, 853);

    // 16. THIN GOLD SEPARATOR
    ctx.strokeStyle = ga(0.28); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(112, 882); ctx.lineTo(W - 112, 882); ctx.stroke();

    // 17. SKILL BADGES
    const badges = [
      { l1: 'HARDWARE',     l2: 'EXPERTISE',   icon: 'chip'   },
      { l1: 'CODING',       l2: 'SKILLS',       icon: 'code'   },
      { l1: 'IoT & CLOUD',  l2: 'INTEGRATION',  icon: 'cloud'  },
      { l1: 'REAL PROJECT', l2: 'DEVELOPMENT',  icon: 'bulb'   },
      { l1: 'PRACTICAL',    l2: 'LEARNING',     icon: 'shield' },
    ];
    const bX0 = CX - 320, bX1 = CX + 320;
    const bGap = (bX1 - bX0) / (badges.length - 1);
    const bCY  = 950;
    const wR   = 37;

    const drawWreath = (bx: number, by: number) => {
      ctx.strokeStyle = GOLD; ctx.lineWidth = 1.2;
      for (let i = 0; i < 10; i++) {
        const a = (200 + i * 11) * PI / 180;
        ctx.beginPath(); ctx.ellipse(bx + Math.cos(a)*wR, by + Math.sin(a)*wR, 5.5, 2.4, a + PI/2, 0, PI*2); ctx.stroke();
      }
      for (let i = 0; i < 10; i++) {
        const a = (340 - i * 11) * PI / 180;
        ctx.beginPath(); ctx.ellipse(bx + Math.cos(a)*wR, by + Math.sin(a)*wR, 5.5, 2.4, a - PI/2, 0, PI*2); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(bx-8, by+wR+5); ctx.lineTo(bx, by+wR+2); ctx.lineTo(bx+8, by+wR+5); ctx.stroke();
    };

    const drawBIcon = (icon: string, bx: number, by: number) => {
      ctx.strokeStyle = GOLD; ctx.fillStyle = GOLD; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
      ctx.textAlign = 'center';
      if (icon === 'chip') {
        ctx.strokeRect(bx-12, by-10, 24, 20); ctx.fillRect(bx-5, by-5, 10, 10);
        [[-12,-4],[-12,0],[-12,4],[12,-4],[12,0],[12,4]].forEach(([dx,dy]) => {
          ctx.beginPath(); ctx.moveTo(bx+dx, by+dy); ctx.lineTo(bx+dx+(dx<0?-5:5), by+dy); ctx.stroke();
        });
      } else if (icon === 'code') {
        ctx.font = 'bold 21px "Courier New", monospace'; ctx.fillStyle = GOLD; ctx.fillText('</>', bx, by+8);
      } else if (icon === 'cloud') {
        ctx.beginPath(); ctx.arc(bx-5, by+2, 8, PI*0.8, PI*0.2); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx+6, by-1, 7, PI*1.0, PI*2.0); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx-13, by+3, 5, PI*1.2, PI*1.85); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx, by+12); ctx.lineTo(bx, by-13);
        ctx.moveTo(bx-5, by-8); ctx.lineTo(bx, by-14); ctx.lineTo(bx+5, by-8); ctx.stroke();
      } else if (icon === 'bulb') {
        ctx.beginPath(); ctx.arc(bx, by-5, 11, PI*0.72, PI*0.28); ctx.stroke();
        [6,9,12].forEach(dy => { ctx.beginPath(); ctx.moveTo(bx-(7-dy*0.3), by+dy); ctx.lineTo(bx+(7-dy*0.3), by+dy); ctx.stroke(); });
        ctx.beginPath(); ctx.moveTo(bx, by-5); ctx.lineTo(bx, by+2); ctx.stroke();
      } else if (icon === 'shield') {
        ctx.beginPath(); ctx.moveTo(bx, by-13); ctx.lineTo(bx+11, by-8); ctx.lineTo(bx+11, by+2);
        ctx.quadraticCurveTo(bx+11, by+12, bx, by+16); ctx.quadraticCurveTo(bx-11, by+12, bx-11, by+2);
        ctx.lineTo(bx-11, by-8); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx-4, by+1); ctx.lineTo(bx-1, by+5); ctx.lineTo(bx+6, by-4); ctx.stroke();
      }
      ctx.lineCap = 'butt';
    };

    badges.forEach((b, i) => {
      const bx = bX0 + i * bGap;
      drawWreath(bx, bCY);
      drawBIcon(b.icon, bx, bCY);
      ctx.textAlign = 'center'; ctx.fillStyle = BLACK; ctx.font = '700 10px "Montserrat", sans-serif';
      ctx.fillText(b.l1, bx, bCY + wR + 24); ctx.fillText(b.l2, bx, bCY + wR + 37);
    });

    // 18. QR CODE BLOCK
    {
      const qX = 110, qY = 895, qS = 90;
      ctx.strokeStyle = ga(0.55); ctx.lineWidth = 1.5; ctx.strokeRect(qX, qY, qS, qS);
      
      if (loadedQr && loadedQr.naturalWidth > 0) {
        ctx.drawImage(loadedQr, qX + 4, qY + 4, qS - 8, qS - 8);
      } else {
        const qrFinder = (fx: number, fy: number) => {
          ctx.fillStyle = BLACK;   ctx.fillRect(fx, fy, 24, 24);
          ctx.fillStyle = '#FAFAFA'; ctx.fillRect(fx+4, fy+4, 16, 16);
          ctx.fillStyle = BLACK;   ctx.fillRect(fx+8, fy+8,  8,  8);
        };
        qrFinder(qX+4, qY+4); qrFinder(qX+qS-28, qY+4); qrFinder(qX+4, qY+qS-28);
        ctx.fillStyle = BLACK;
        [[34,34],[38,34],[34,38],[44,34],[44,38],[50,34],[34,44],[34,50],[38,44],
         [44,50],[52,44],[56,50],[34,56],[40,56],[48,60],[34,62],[42,66],[50,58],
         [56,34],[60,40],[62,34],[58,46],[66,42],[62,52],[52,58],[58,62],[62,58],
         [66,62],[58,68],[64,68],[38,68],[44,72]].forEach(([dx,dy]) => ctx.fillRect(qX+dx, qY+dy, 5, 5));
      }

      ctx.textAlign = 'center';
      ctx.fillStyle = LGREY; ctx.font = '500 11px "Montserrat", sans-serif';
      ctx.fillText('Scan to Verify Certificate', qX + qS/2, qY + qS + 20);
      ctx.fillStyle = GOLD; ctx.font = '600 12px "Montserrat", sans-serif';
      ctx.fillText(`Certificate No. : ${cert.certNumber}`, qX + qS/2, qY + qS + 38);
    }

    // 19. SIGNATURE BLOCK
    {
      const sigCX = W - 255;

      // Handwritten signature image or text fallback
      if (loadedSig && loadedSig.naturalWidth > 0) {
        const sigW = 240;
        const sigH = 90;
        ctx.drawImage(loadedSig, sigCX - sigW / 2, 932 - sigH, sigW, sigH);
      } else {
        ctx.textAlign = 'center';
        ctx.fillStyle = BLACK;
        ctx.font = 'italic 72px "Alex Brush", cursive';
        ctx.fillText(sigConfig.name, sigCX, 904);
      }

      ctx.strokeStyle = ga(0.5); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(sigCX - 128, 938); ctx.lineTo(sigCX + 128, 938); ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = BLACK;
      ctx.font = '700 15px "Montserrat", sans-serif';
      ctx.fillText(sigConfig.name, sigCX, 966);

      ctx.fillStyle = LGREY;
      ctx.font = '500 12.5px "Montserrat", sans-serif';
      ctx.fillText(sigConfig.designation, sigCX, 988);

      ctx.fillStyle = BLACK;
      ctx.font = '800 13px "Montserrat", sans-serif';
      ctx.fillText('Tech IoT Warriors', sigCX, 1008);
    }

    // 20. COMPLETION DATE
    ctx.textAlign = 'center';
    ctx.fillStyle = GREY;
    ctx.font = '500 14px "Montserrat", sans-serif';
    ctx.fillText(`Completed On : ${cert.completionDate}`, CX, 1054);

    ctx.strokeStyle = GOLD; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(CX-222, 1050); ctx.lineTo(CX-118, 1050); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CX+118, 1050); ctx.lineTo(CX+222, 1050); ctx.stroke();
    diamond(CX - 120, 1050, 5.5);
    diamond(CX + 120, 1050, 5.5);
  };

  const handleDownloadAdminCert = (cert: any) => {
    const canvas = adminCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `TechIoTWarriors_Certificate_${cert.studentName.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  const handlePrintAdminCertPdf = (cert: any) => {
    const canvas = adminCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Tech IoT Warriors Certificate - ${cert.studentName.replace(/\\s+/g, '_')}</title>
          <style>
            @page { size: landscape; margin: 0; }
            body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #fff; }
            img { max-width: 100%; max-height: 100%; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
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
            <button onClick={() => { setActiveTab('codelib'); setSidebarOpen(false); }} className={`${styles.sideLink} ${activeTab === 'codelib' ? styles.activeSide : ''}`}>
              <Cpu size={16} /> <span>Code Library</span>
            </button>
            <button onClick={() => { setActiveTab('circuitlib'); setSidebarOpen(false); }} className={`${styles.sideLink} ${activeTab === 'circuitlib' ? styles.activeSide : ''}`}>
              <Wrench size={16} /> <span>Circuit Library</span>
            </button>
            <button onClick={() => { setActiveTab('projects'); setSidebarOpen(false); }} className={`${styles.sideLink} ${activeTab === 'projects' ? styles.activeSide : ''}`}>
              <Wrench size={16} /> <span>Projects Showcase</span>
            </button>
            <button onClick={() => { setActiveTab('liveclasses'); setSidebarOpen(false); }} className={`${styles.sideLink} ${activeTab === 'liveclasses' ? styles.activeSide : ''}`}>
              <Play size={16} /> <span>Live Classes</span>
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
              <div className={styles.flexHeader}>
                <div>
                  <h2><Lock size={24} style={{verticalAlign: 'middle', marginRight: 8}} /> Issued Certificates Ledger</h2>
                  <p className={styles.secDesc}>Verify, search, issue, and manage dynamic developer credentials.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => {
                    setNewCertName('');
                    setNewCertCourse('Real-world Smart IoT Industrial Projects');
                    setNewCertGrade('Distinction');
                    setNewCertDate(getTodayDateFormatted());
                    setIsIssuingCert(true);
                  }} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={14} /> Issue Certificate
                  </button>
                  <button onClick={handleResetCertificates} className="btn btn-outline-gold btn-sm">
                    Reset to Default Reference
                  </button>
                  <button onClick={handleClearCertificates} className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>
                    Clear Ledger
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '20px' }}>
                {/* Left Side: Search & Table */}
                <div style={{ flex: '1 1 600px', minWidth: '300px' }}>
                  <div className={styles.searchRow} style={{ marginBottom: '16px', display: 'flex', gap: '8px', maxWidth: '400px' }}>
                    <input
                      type="text"
                      placeholder="Search student or cert number..."
                      value={certSearch}
                      onChange={e => setCertSearch(e.target.value)}
                      className="form-input"
                      style={{ width: '100%' }}
                    />
                  </div>

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
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {certificatesLog.filter(c => {
                            const term = certSearch.toLowerCase();
                            return c.studentName.toLowerCase().includes(term) ||
                                   c.certNumber.toLowerCase().includes(term) ||
                                   c.courseName.toLowerCase().includes(term);
                          }).length > 0 ? (
                            certificatesLog.filter(c => {
                              const term = certSearch.toLowerCase();
                              return c.studentName.toLowerCase().includes(term) ||
                                     c.certNumber.toLowerCase().includes(term) ||
                                     c.courseName.toLowerCase().includes(term);
                            }).map((c, idx) => (
                              <tr key={idx}>
                                <td className="text-gold" style={{fontWeight: 700}}>{c.certNumber}</td>
                                <td>{c.studentName}</td>
                                <td>{c.courseName}</td>
                                <td>{c.completionDate}</td>
                                <td><span className="badge badge-green">{c.grade} Passed</span></td>
                                <td>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => {
                                      setPreviewCert(c);
                                      setTimeout(() => drawAdminCertificate(c), 200);
                                    }} className="btn btn-outline-gold btn-xs" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                                      Preview
                                    </button>
                                    <button onClick={() => handleDeleteCertificate(c.certNumber)} className="btn btn-secondary btn-xs" style={{ padding: '4px', color: '#ef4444' }}>
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} style={{textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)'}}>
                                No matching developer credentials found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Side: Signatory & Signature Settings */}
                <div style={{ flex: '0 0 320px', width: '320px', minWidth: '320px' }}>
                  <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--matte-gold)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Shield size={16} /> Signatory Settings
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Manage custom signatures and printed metadata drawn on all certificates.
                    </p>

                    <form onSubmit={handleSaveSignatureInfo} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Signatory Name:</label>
                        <input
                          type="text"
                          value={sigName}
                          onChange={e => setSigName(e.target.value)}
                          className="form-input"
                          style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                          required
                        />
                      </div>
                      
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Designation:</label>
                        <input
                          type="text"
                          value={sigDesignation}
                          onChange={e => setSigDesignation(e.target.value)}
                          className="form-input"
                          style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                          required
                        />
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Signature File (Transparent PNG):</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSignatureFileChange}
                          className="form-input"
                          style={{ fontSize: '0.78rem', padding: '6px 8px' }}
                        />
                      </div>

                      {sigImage && (
                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Uploaded Signature Preview:</span>
                          <div style={{ background: '#fff', borderRadius: '4px', padding: '8px', display: 'flex', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.1)' }}>
                            <img src={sigImage} alt="Signature Preview" style={{ maxHeight: '50px', maxWidth: '100%', objectFit: 'contain' }} />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSigImage('');
                              saveSignatureConfig({ name: sigName, designation: sigDesignation, image: '' });
                              showNotification('Custom signature cleared. Using fallback cursive text.');
                            }}
                            className="btn btn-secondary btn-xs"
                            style={{ alignSelf: 'flex-start', marginTop: '4px', color: '#ef4444', border: 'none' }}
                          >
                            Remove Custom Signature
                          </button>
                        </div>
                      )}

                      <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '6px', fontSize: '0.8rem', padding: '8px 12px' }}>
                        Save Text Settings
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Modal Overlay for Manual Certificate Issuance */}
              {isIssuingCert && (
                <div className={styles.modalOverlay}>
                  <div className={`glass-card ${styles.modalPopup}`} style={{ maxWidth: '500px', width: '90%' }}>
                    <h3>Issue Developer Certificate</h3>
                    <form onSubmit={handleManualIssueCert} className={styles.lessonForm}>
                      <div className="form-group">
                        <label className="form-label">Student Full Name:</label>
                        <input type="text" value={newCertName} onChange={e => setNewCertName(e.target.value)} className="form-input" placeholder="e.g. Nikhil Kumar" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Accredited Course Program:</label>
                        <select value={newCertCourse} onChange={e => setNewCertCourse(e.target.value)} className="form-input" style={{ background: 'var(--dark-gray)' }} required>
                          <option value="Electronics Basics & Circuit Designing">Electronics Basics &amp; Circuit Designing</option>
                          <option value="Beginner IoT Mastery Bootcamp">Beginner IoT Mastery Bootcamp</option>
                          <option value="Arduino Programming & Circuit Building">Arduino Programming &amp; Circuit Building</option>
                          <option value="ESP8266 WiFi & Home Automation IoT">ESP8266 WiFi &amp; Home Automation IoT</option>
                          <option value="ESP32 Advanced IoT with FreeRTOS & HTTP">ESP32 Advanced IoT with FreeRTOS &amp; HTTP</option>
                          <option value="Real-world Smart IoT Industrial Projects">Real-world Smart IoT Industrial Projects</option>
                          {coursesList.map(course => (
                            <option key={course.id} value={course.title}>{course.title}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Completion Date:</label>
                        <input type="text" value={newCertDate} onChange={e => setNewCertDate(e.target.value)} className="form-input" placeholder="e.g. 26 May 2026" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Grade Classification:</label>
                        <select value={newCertGrade} onChange={e => setNewCertGrade(e.target.value)} className="form-input" style={{ background: 'var(--dark-gray)' }} required>
                          <option value="Distinction">Distinction</option>
                          <option value="First Class">First Class</option>
                          <option value="Pass">Pass</option>
                        </select>
                      </div>
                      <div className={styles.formBtnRow} style={{ marginTop: 18 }}>
                        <button type="submit" className="btn btn-primary btn-sm">Issue &amp; Preview</button>
                        <button type="button" onClick={() => setIsIssuingCert(false)} className="btn btn-secondary btn-sm">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Modal Overlay for Canvas Certificate Preview */}
              {previewCert && (
                <div className={styles.modalOverlay}>
                  <div className={`glass-card ${styles.modalPopup}`} style={{ maxWidth: '850px', width: '95%' }}>
                    <div className={styles.flexHeader} style={{ marginBottom: '16px' }}>
                      <div>
                        <h3>Certificate Preview</h3>
                        <p className={styles.secDesc} style={{ margin: 0 }}>Certificate ID: <strong className="text-gold">{previewCert.certNumber}</strong></p>
                      </div>
                      <button onClick={() => setPreviewCert(null)} className="btn btn-secondary btn-xs" style={{ minWidth: 'unset', padding: '4px 8px' }}>✕</button>
                    </div>
                    
                    <div style={{ position: 'relative', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: '55vh', overflow: 'auto', marginBottom: '16px' }}>
                      <canvas ref={adminCanvasRef} style={{ maxWidth: '100%', maxHeight: '50vh', width: 'auto', height: 'auto', display: 'block', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button onClick={() => handleDownloadAdminCert(previewCert)} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Download size={14} /> Download PNG
                      </button>
                      <button onClick={() => handlePrintAdminCertPdf(previewCert)} className="btn btn-outline-gold btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Shield size={14} /> Print / Save PDF
                      </button>
                      <button type="button" onClick={() => setPreviewCert(null)} className="btn btn-secondary btn-sm">
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
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

          {/* Tab 8: Code Library */}
          {activeTab === 'codelib' && (
            <div className={styles.panelSection}>
              <div className={styles.flexHeader}>
                <div>
                  <h2><Cpu size={24} style={{verticalAlign: 'middle', marginRight: 8}} /> Code Library Manager</h2>
                  <p className={styles.secDesc}>Manage code snippets displayed in the code library.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => {
                    setEditingSnippet({ title: '', category: '', explanation: '', errorSolution: '', code: '' });
                    setIsCreatingSnippet(true);
                  }} className="btn btn-primary btn-sm flex-center" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={14} /> Add Snippet
                  </button>
                  <button onClick={handleResetSnippets} className="btn btn-outline-gold btn-sm flex-center">
                    Reset to Defaults
                  </button>
                  <button onClick={handleClearSnippets} className="btn btn-secondary btn-sm flex-center" style={{ color: '#ef4444' }}>
                    Delete All
                  </button>
                </div>
              </div>

              <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Explanation</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {codeSnippetsList.length > 0 ? (
                        codeSnippetsList.map((snippet, idx) => (
                          <tr key={snippet.id || idx}>
                            <td><strong>{snippet.title}</strong></td>
                            <td><span className="tag">{snippet.category}</span></td>
                            <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {snippet.explanation}
                            </td>
                            <td>
                              <div className={styles.actionBtnCell}>
                                <button onClick={() => {
                                  setEditingSnippet(snippet);
                                  setIsCreatingSnippet(false);
                                }} className="btn btn-secondary btn-sm" style={{ padding: '5px 10px', fontSize: '0.72rem' }}>
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteSnippet(snippet.id || '')} className="btn btn-secondary btn-sm" style={{ padding: '5px 10px', fontSize: '0.72rem', color: '#ef4444' }}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                            No code snippets found in database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Code Snippet Add/Edit Modal */}
              {editingSnippet && (
                <div className={styles.modalOverlay}>
                  <div className={`glass-card ${styles.modalPopup}`}>
                    <h3>{isCreatingSnippet ? 'Create New Code Snippet' : 'Edit Code Snippet'}</h3>
                    <form onSubmit={handleSaveSnippet} className={styles.lessonForm}>
                      <div className="form-group">
                        <label className="form-label">Title:</label>
                        <input type="text" value={editingSnippet.title} onChange={e => setEditingSnippet({ ...editingSnippet, title: e.target.value })} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category (e.g. LED Blink, WiFi):</label>
                        <input type="text" value={editingSnippet.category} onChange={e => setEditingSnippet({ ...editingSnippet, category: e.target.value })} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Explanation / Description:</label>
                        <textarea value={editingSnippet.explanation} onChange={e => setEditingSnippet({ ...editingSnippet, explanation: e.target.value })} className="form-input" rows={3} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Troubleshooting / Error Solution:</label>
                        <textarea value={editingSnippet.errorSolution} onChange={e => setEditingSnippet({ ...editingSnippet, errorSolution: e.target.value })} className="form-input" rows={2} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Arduino C++ Source Code:</label>
                        <textarea value={editingSnippet.code} onChange={e => setEditingSnippet({ ...editingSnippet, code: e.target.value })} className="form-input" rows={8} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} required />
                      </div>
                      <div className={styles.formBtnRow} style={{ marginTop: 18 }}>
                        <button type="submit" className="btn btn-primary btn-sm">Save Snippet</button>
                        <button type="button" onClick={() => setEditingSnippet(null)} className="btn btn-secondary btn-sm">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 9: Circuit Library */}
          {activeTab === 'circuitlib' && (
            <div className={styles.panelSection}>
              <div className={styles.flexHeader}>
                <div>
                  <h2><Wrench size={24} style={{verticalAlign: 'middle', marginRight: 8}} /> Circuit Library Manager</h2>
                  <p className={styles.secDesc}>Manage circuits and pins wiring instructions.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => {
                    setEditingCircuit({ title: '', category: '', pins: '', working: '', description: '', visual: '' });
                    setIsCreatingCircuit(true);
                  }} className="btn btn-primary btn-sm flex-center" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={14} /> Add Circuit
                  </button>
                  <button onClick={handleResetCircuits} className="btn btn-outline-gold btn-sm flex-center">
                    Reset to Defaults
                  </button>
                  <button onClick={handleClearCircuits} className="btn btn-secondary btn-sm flex-center" style={{ color: '#ef4444' }}>
                    Delete All
                  </button>
                </div>
              </div>

              <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {circuitsList.length > 0 ? (
                        circuitsList.map((circuit, idx) => (
                          <tr key={circuit.id || idx}>
                            <td><strong>{circuit.title}</strong></td>
                            <td><span className="tag">{circuit.category}</span></td>
                            <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {circuit.description}
                            </td>
                            <td>
                              <div className={styles.actionBtnCell}>
                                <button onClick={() => {
                                  setEditingCircuit(circuit);
                                  setIsCreatingCircuit(false);
                                }} className="btn btn-secondary btn-sm" style={{ padding: '5px 10px', fontSize: '0.72rem' }}>
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteCircuit(circuit.id || '')} className="btn btn-secondary btn-sm" style={{ padding: '5px 10px', fontSize: '0.72rem', color: '#ef4444' }}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                            No circuits found in database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Circuit Add/Edit Modal */}
              {editingCircuit && (
                <div className={styles.modalOverlay}>
                  <div className={`glass-card ${styles.modalPopup}`}>
                    <h3>{isCreatingCircuit ? 'Create New Circuit' : 'Edit Circuit'}</h3>
                    <form onSubmit={handleSaveCircuit} className={styles.lessonForm}>
                      <div className="form-group">
                        <label className="form-label">Title:</label>
                        <input type="text" value={editingCircuit.title} onChange={e => setEditingCircuit({ ...editingCircuit, title: e.target.value })} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category (e.g. LED, Relay, OLED):</label>
                        <input type="text" value={editingCircuit.category} onChange={e => setEditingCircuit({ ...editingCircuit, category: e.target.value })} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Wiring Pin Connections:</label>
                        <textarea value={editingCircuit.pins} onChange={e => setEditingCircuit({ ...editingCircuit, pins: e.target.value })} className="form-input" rows={2} placeholder="VCC to 3.3V, GND to GND..." required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Working Principle:</label>
                        <textarea value={editingCircuit.working} onChange={e => setEditingCircuit({ ...editingCircuit, working: e.target.value })} className="form-input" rows={3} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Short Description:</label>
                        <textarea value={editingCircuit.description} onChange={e => setEditingCircuit({ ...editingCircuit, description: e.target.value })} className="form-input" rows={2} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">ASCII Diagram / Visual Representation:</label>
                        <input type="text" value={editingCircuit.visual} onChange={e => setEditingCircuit({ ...editingCircuit, visual: e.target.value })} className="form-input" placeholder="LED [Anode] ── [220Ω] ── GPIO 2" required />
                      </div>
                      <div className={styles.formBtnRow} style={{ marginTop: 18 }}>
                        <button type="submit" className="btn btn-primary btn-sm">Save Circuit</button>
                        <button type="button" onClick={() => setEditingCircuit(null)} className="btn btn-secondary btn-sm">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 10: Projects Showcase */}
          {activeTab === 'projects' && (
            <div className={styles.panelSection}>
              <div className={styles.flexHeader}>
                <div>
                  <h2><Wrench size={24} style={{verticalAlign: 'middle', marginRight: 8}} /> Projects Showcase Manager</h2>
                  <p className={styles.secDesc}>Manage hardware blueprints displayed in the project showcase.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => {
                    setEditingProject({ id: '', title: '', category: '', desc: '', complexity: 'Beginner', components: [], icon: 'cpu' });
                    setIsCreatingProject(true);
                  }} className="btn btn-primary btn-sm flex-center" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={14} /> Add Project
                  </button>
                  <button onClick={handleResetProjects} className="btn btn-outline-gold btn-sm flex-center">
                    Reset to Defaults
                  </button>
                  <button onClick={handleClearProjects} className="btn btn-secondary btn-sm flex-center" style={{ color: '#ef4444' }}>
                    Delete All
                  </button>
                </div>
              </div>

              <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Complexity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectsList.length > 0 ? (
                        projectsList.map((project, idx) => (
                          <tr key={project.id || idx}>
                            <td><strong>{project.title}</strong></td>
                            <td><span className="tag">{project.category}</span></td>
                            <td>
                              <span className={`badge ${project.complexity === 'Beginner' ? 'badge-green' : project.complexity === 'Intermediate' ? 'badge-blue' : 'badge-red'}`}>
                                {project.complexity}
                              </span>
                            </td>
                            <td>
                              <div className={styles.actionBtnCell}>
                                <button onClick={() => {
                                  setEditingProject(project);
                                  setIsCreatingProject(false);
                                }} className="btn btn-secondary btn-sm" style={{ padding: '5px 10px', fontSize: '0.72rem' }}>
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteProject(project.id)} className="btn btn-secondary btn-sm" style={{ padding: '5px 10px', fontSize: '0.72rem', color: '#ef4444' }}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                            No projects found in database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Project Add/Edit Modal */}
              {editingProject && (
                <div className={styles.modalOverlay}>
                  <div className={`glass-card ${styles.modalPopup}`}>
                    <h3>{isCreatingProject ? 'Create New Project' : 'Edit Project Blueprint'}</h3>
                    <form onSubmit={handleSaveProject} className={styles.lessonForm}>
                      <div className="form-group">
                        <label className="form-label">Course/Project Unique ID (slug, lowercase, no spaces):</label>
                        <input type="text" value={editingProject.id} onChange={e => setEditingProject({ ...editingProject, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="form-input" placeholder="e.g. solar-tracker" required disabled={!isCreatingProject} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Title:</label>
                        <input type="text" value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category (e.g. Sensor Projects, Robot Projects):</label>
                        <input type="text" value={editingProject.category} onChange={e => setEditingProject({ ...editingProject, category: e.target.value })} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Complexity:</label>
                        <select value={editingProject.complexity} onChange={e => setEditingProject({ ...editingProject, complexity: e.target.value as any })} className="form-input" style={{ background: 'var(--dark-gray)' }} required>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Icon Type:</label>
                        <select value={editingProject.icon} onChange={e => setEditingProject({ ...editingProject, icon: e.target.value })} className="form-input" style={{ background: 'var(--dark-gray)' }} required>
                          <option value="cpu">Cpu</option>
                          <option value="home">Home</option>
                          <option value="sun">Sun</option>
                          <option value="lock">Lock</option>
                          <option value="wifi">Wifi</option>
                          <option value="globe">Globe</option>
                          <option value="wrench">Wrench</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Components Required (comma separated, e.g. ESP32, LDR, Resistor):</label>
                        <input type="text" value={editingProject.components.join(', ')} onChange={e => setEditingProject({ ...editingProject, components: e.target.value.split(',').map(c => c.trim()).filter(c => c !== '') })} className="form-input" placeholder="ESP32, Relay..." required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description / Subtitle:</label>
                        <textarea value={editingProject.desc} onChange={e => setEditingProject({ ...editingProject, desc: e.target.value })} className="form-input" rows={3} required />
                      </div>
                      <div className={styles.formBtnRow} style={{ marginTop: 18 }}>
                        <button type="submit" className="btn btn-primary btn-sm">Save Project</button>
                        <button type="button" onClick={() => setEditingProject(null)} className="btn btn-secondary btn-sm">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 11: Live Classes */}
          {activeTab === 'liveclasses' && (
            <div className={styles.panelSection}>
              <div className={styles.flexHeader}>
                <div>
                  <h2><Play size={24} style={{verticalAlign: 'middle', marginRight: 8}} /> Live Classes Manager</h2>
                  <p className={styles.secDesc}>Manage weekly live sessions and YouTube stream replays.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => {
                    setEditingLiveClass({ id: 'live-' + (liveClassesList.length + 1), title: '', instructor: '', date: '', time: '', status: 'UPCOMING', meetingLink: '', replayLink: '' });
                    setIsCreatingLiveClass(true);
                  }} className="btn btn-primary btn-sm flex-center" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={14} /> Add Live Class
                  </button>
                  <button onClick={handleResetLiveClasses} className="btn btn-outline-gold btn-sm flex-center">
                    Reset to Defaults
                  </button>
                  <button onClick={handleClearLiveClasses} className="btn btn-secondary btn-sm flex-center" style={{ color: '#ef4444' }}>
                    Delete All
                  </button>
                </div>
              </div>

              <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Instructor</th>
                        <th>Date &amp; Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveClassesList.length > 0 ? (
                        liveClassesList.map((liveClass, idx) => (
                          <tr key={liveClass.id || idx}>
                            <td><strong>{liveClass.title}</strong></td>
                            <td>{liveClass.instructor}</td>
                            <td>{liveClass.date} ({liveClass.time})</td>
                            <td>
                              <span className={`badge ${liveClass.status === 'LIVE NOW' ? 'badge-red' : liveClass.status === 'UPCOMING' ? 'badge-gold' : 'badge-blue'}`}>
                                {liveClass.status}
                              </span>
                            </td>
                            <td>
                              <div className={styles.actionBtnCell}>
                                <button onClick={() => {
                                  setEditingLiveClass(liveClass);
                                  setIsCreatingLiveClass(false);
                                }} className="btn btn-secondary btn-sm" style={{ padding: '5px 10px', fontSize: '0.72rem' }}>
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteLiveClass(liveClass.id)} className="btn btn-secondary btn-sm" style={{ padding: '5px 10px', fontSize: '0.72rem', color: '#ef4444' }}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                            No live classes found in database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Class Add/Edit Modal */}
              {editingLiveClass && (
                <div className={styles.modalOverlay}>
                  <div className={`glass-card ${styles.modalPopup}`}>
                    <h3>{isCreatingLiveClass ? 'Create New Live Class' : 'Edit Live Class'}</h3>
                    <form onSubmit={handleSaveLiveClass} className={styles.lessonForm}>
                      <div className="form-group">
                        <label className="form-label">Title:</label>
                        <input type="text" value={editingLiveClass.title} onChange={e => setEditingLiveClass({ ...editingLiveClass, title: e.target.value })} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Lead Instructor:</label>
                        <input type="text" value={editingLiveClass.instructor} onChange={e => setEditingLiveClass({ ...editingLiveClass, instructor: e.target.value })} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date (e.g. June 15, 2026):</label>
                        <input type="text" value={editingLiveClass.date} onChange={e => setEditingLiveClass({ ...editingLiveClass, date: e.target.value })} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Time Slot (e.g. 07:00 PM - 08:30 PM IST):</label>
                        <input type="text" value={editingLiveClass.time} onChange={e => setEditingLiveClass({ ...editingLiveClass, time: e.target.value })} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Streaming Status:</label>
                        <select value={editingLiveClass.status} onChange={e => setEditingLiveClass({ ...editingLiveClass, status: e.target.value as any })} className="form-input" style={{ background: 'var(--dark-gray)' }} required>
                          <option value="UPCOMING">UPCOMING</option>
                          <option value="LIVE NOW">LIVE NOW</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </div>
                      {editingLiveClass.status === 'LIVE NOW' && (
                        <div className="form-group">
                          <label className="form-label">Meeting Join Link (e.g. Google Meet URL):</label>
                          <input type="url" value={editingLiveClass.meetingLink || ''} onChange={e => setEditingLiveClass({ ...editingLiveClass, meetingLink: e.target.value })} className="form-input" placeholder="https://meet.google.com/..." required />
                        </div>
                      )}
                      {editingLiveClass.status === 'COMPLETED' && (
                        <div className="form-group">
                          <label className="form-label">YouTube Replay Embed Link:</label>
                          <input type="url" value={editingLiveClass.replayLink || ''} onChange={e => setEditingLiveClass({ ...editingLiveClass, replayLink: e.target.value })} className="form-input" placeholder="https://www.youtube.com/embed/..." required />
                        </div>
                      )}
                      <div className={styles.formBtnRow} style={{ marginTop: 18 }}>
                        <button type="submit" className="btn btn-primary btn-sm">Save Live Class</button>
                        <button type="button" onClick={() => setEditingLiveClass(null)} className="btn btn-secondary btn-sm">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
