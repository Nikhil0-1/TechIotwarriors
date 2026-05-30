'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PROJECTS_DATA } from '@/components/home/ProjectsSection';
import styles from './page.module.css';

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Automation Projects', 'Sensor Projects', 'Robot Projects', 'Security System', 'ESP32 Camera'];

  const filtered = PROJECTS_DATA.filter(p => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.desc.toLowerCase().includes(search.toLowerCase()) ||
                          p.components.some(c => c.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-badge">IoT Blueprints</span>
          <h1 className={styles.title}>Project <span className="text-gradient">Showcase Lab</span></h1>
          <p className={styles.subtitle}>
            Build industry-standard automation, camera stream relays, smart alarms, and environmental logs with detailed circuit guides.
          </p>
        </div>

        {/* Filter Bar */}
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
              placeholder="Search components or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`${styles.searchInput} form-input`}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
        </div>

        {/* Projects Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map(project => (
              <div key={project.id} className={`glass-card ${styles.card}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.icon}>{project.icon}</span>
                  <span className={`${styles.badge} badge ${project.complexity === 'Beginner' ? 'badge-green' : project.complexity === 'Intermediate' ? 'badge-blue' : 'badge-red'}`}>
                    {project.complexity}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.category}>{project.category}</span>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <p className={styles.cardDesc}>{project.desc}</p>

                  <div className={styles.components}>
                    {project.components.map(comp => (
                      <span key={comp} className={styles.compBadge}>{comp}</span>
                    ))}
                  </div>
                </div>

                <div className="gold-divider" style={{ margin: '16px 0 0 0' }} />

                <div className={styles.cardFooter}>
                  <Link href={`/projects/${project.id}`} className={styles.exploreLink}>
                    Explore Build Details ➔
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <h3>No hardware projects found.</h3>
            <p>Modify search keywords or select another filter tab.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearch(''); }}
              className="btn btn-outline-gold btn-sm mt-md"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
