'use client';
import { useState, useEffect } from 'react';
import styles from './CircuitLibrary.module.css';
import { Search } from '@/components/ui/Icons';

import { getCircuits, Circuit } from '@/lib/db';

export default function CircuitLibraryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [circuits, setCircuits] = useState<Circuit[]>([]);

  useEffect(() => {
    setCircuits(getCircuits());
  }, []);

  const categories = ['All', ...Array.from(new Set(circuits.map(c => c.category)))];

  const filtered = circuits.filter(c => {
    const matchesCat = activeCategory === 'All' || c.category === activeCategory;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.pins.toLowerCase().includes(search.toLowerCase()) ||
                          c.working.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-badge">Pinout Database</span>
          <h1 className={styles.title}>IoT Circuit <span className="text-gradient">Schematics Library</span></h1>
          <p className={styles.subtitle}>
            Quick connection reference cards for common components, relays, sensors, screens, and actuators.
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
              placeholder="Search LED, SCL, GND pins..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`${styles.searchInput} form-input`}
            />
            <span className={styles.searchIcon}><Search size={18} /></span>
          </div>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {filtered.map((c, i) => (
            <div key={i} className={`glass-card ${styles.card}`}>
              <div className={styles.cardHeader}>
                <span className="tag">{c.category}</span>
                <h3 className={styles.cardTitle}>{c.title}</h3>
              </div>

              {/* Graphical Visual Diagram */}
              <div className={styles.diagram}>
                <code>{c.visual}</code>
              </div>

              <div className={styles.body}>
                <div className={styles.sectionDetail}>
                  <strong>Pins Wiring Connections:</strong>
                  <p>{c.pins}</p>
                </div>
                
                <div className={styles.sectionDetail} style={{ marginTop: 16 }}>
                  <strong>Working Principle:</strong>
                  <p>{c.working}</p>
                </div>

                <p className={styles.desc} style={{ marginTop: 16 }}>{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
