'use client';
import { useState } from 'react';
import styles from './Community.module.css';

interface ForumThread {
  title: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  lastActive: string;
}

const THREADS: ForumThread[] = [
  {
    title: 'ESP32 Camera frame buffer memory issues with high resolution',
    author: 'Rohan_M',
    category: 'Hardware Troubleshooting',
    replies: 14,
    views: 120,
    lastActive: '2 hours ago'
  },
  {
    title: 'FreeRTOS dual core load balancing tips for sensor loops',
    author: 'Kunal_Embedded',
    category: 'ESP32 Advanced',
    replies: 8,
    views: 85,
    lastActive: '5 hours ago'
  },
  {
    title: 'ThingSpeak HTTP GET connection timeout in deep sleep mode',
    author: 'Pooja_Sharma',
    category: 'Sensors & Logging',
    replies: 19,
    views: 240,
    lastActive: '1 day ago'
  },
  {
    title: 'Blynk vs custom node-red dashboards for home relays control',
    author: 'Hobbyist_Vijay',
    category: 'Home Automation',
    replies: 32,
    views: 450,
    lastActive: '3 days ago'
  }
];

export default function CommunityPage() {
  const [threads, setThreads] = useState<ForumThread[]>(THREADS);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Hardware Troubleshooting');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newThread: ForumThread = {
      title: newTitle,
      author: 'You (Warrior Student)',
      category: newCategory,
      replies: 0,
      views: 1,
      lastActive: 'Just now'
    };

    setThreads([newThread, ...threads]);
    setNewTitle('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-badge">Warrior Forum</span>
          <h1 className={styles.title}>Developer <span className="text-gradient">Discussion Hub</span></h1>
          <p className={styles.subtitle}>
            Ask firmware bugs, check schematic wire loops, and share custom PCB layouts with thousands of IoT builders.
          </p>
        </div>

        <div className={styles.layout}>
          {/* Forum List */}
          <div className={styles.forumCol}>
            <div className={`glass-card ${styles.threadsCard}`}>
              <div className={styles.cardHeader}>
                <h3>Discussion Threads</h3>
                <span>{threads.length} topics</span>
              </div>

              <div className={styles.threadsList}>
                {threads.map((t, idx) => (
                  <div key={idx} className={styles.threadItem}>
                    <div className={styles.threadDetails}>
                      <span className="tag" style={{ alignSelf: 'flex-start' }}>{t.category}</span>
                      <h4 className={styles.threadTitle}>{t.title}</h4>
                      <div className={styles.threadMeta}>
                        <span>Started by {t.author}</span>
                        <span>• Active {t.lastActive}</span>
                      </div>
                    </div>
                    <div className={styles.threadStats}>
                      <span>💬 {t.replies} replies</span>
                      <span>👁️ {t.views} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Create Post sidebar */}
          <div className={styles.sidebar}>
            <div className={`glass-card ${styles.postCard}`}>
              <h3>💬 Create New Topic</h3>
              <form onSubmit={handlePost} className={styles.postForm}>
                <div className="form-group">
                  <label className="form-label">Topic Title:</label>
                  <input
                    type="text"
                    required
                    placeholder="Briefly state compilation bug or circuit logic query"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Topic Category:</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="form-input"
                    style={{ background: 'var(--dark-gray)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <option value="Hardware Troubleshooting">Hardware Troubleshooting</option>
                    <option value="ESP32 Advanced">ESP32 Advanced</option>
                    <option value="Sensors &amp; Logging">Sensors &amp; Logging</option>
                    <option value="Home Automation">Home Automation</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 12 }}>
                  Publish Topic 🚀
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
