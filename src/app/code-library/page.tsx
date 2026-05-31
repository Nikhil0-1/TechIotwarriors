'use client';
import { useState, useEffect } from 'react';
import styles from './CodeLibrary.module.css';
import { Search, Copy, Download, BookOpen, Wrench } from '@/components/ui/Icons';

import { getCodeSnippets, CodeSnippet } from '@/lib/db';

export default function CodeLibraryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);

  useEffect(() => {
    setSnippets(getCodeSnippets());
  }, []);

  const categories = ['All', ...Array.from(new Set(snippets.map(s => s.category)))];

  const filtered = snippets.filter(s => {
    const matchesCat = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                          s.explanation.toLowerCase().includes(search.toLowerCase()) ||
                          s.code.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-badge">Firmware Repo</span>
          <h1 className={styles.title}>IoT Source <span className="text-gradient">Code Library</span></h1>
          <p className={styles.subtitle}>
            Validated firmware blocks, data loggers, WiFi sockets, and motor controllers ready to upload.
          </p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.tabs}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`${styles.tab} ${activeCategory === cat ? styles.activeTab : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search millis, analogRead, WiFi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`${styles.searchInput} form-input`}
            />
            <span className={styles.searchIcon}><Search size={18} /></span>
          </div>
        </div>

        {/* Code Grid */}
        <div className={styles.grid}>
          {filtered.map((s, i) => (
            <div key={i} className={`glass-card ${styles.card}`}>
              <div className={styles.cardHeader}>
                <span className="tag">{s.category}</span>
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <div className={styles.actions} style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleCopy(s.code, i)} className="btn btn-outline-gold btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Copy size={14} />
                    <span>{copiedIdx === i ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(s.code)}`} download="code.ino" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Download size={14} />
                    <span>Download</span>
                  </a>
                </div>
              </div>

              {/* Code Editor */}
              <div className={styles.editor}>
                <pre><code>{s.code}</code></pre>
              </div>

              {/* Descriptions */}
              <div className={styles.details}>
                <div className={styles.detailBlock}>
                  <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--matte-gold)' }}>
                    <BookOpen size={16} />
                    <span>Code Logic Explanation:</span>
                  </strong>
                  <p style={{ marginTop: '6px' }}>{s.explanation}</p>
                </div>
                
                <div className={styles.detailBlock} style={{ marginTop: 16 }}>
                  <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--matte-gold)' }}>
                    <Wrench size={16} />
                    <span>Common Compilation Errors &amp; Fixes:</span>
                  </strong>
                  <p style={{ marginTop: '6px' }}>{s.errorSolution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
