'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavBar.module.css';

const NAV_LINKS = [
  { label: 'Home',            href: '/' },
  { label: 'Courses',         href: '/courses' },
  { label: 'Projects',        href: '/projects' },
  { label: 'Circuit Library', href: '/circuit-library' },
  { label: 'Code Library',    href: '/code-library' },
  { label: 'Live Classes',    href: '/live-classes' },
  { label: 'Certificates',    href: '/certificates' },
  { label: 'IoT Kits',        href: '/iot-kits' },
  { label: 'Community',       href: '/community' },
  { label: 'About',           href: '/about' },
  { label: 'Contact',         href: '/contact' },
];

export function NavBar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>
              Tech <span className={styles.logoGold}>IoT</span> Warriors
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className={styles.links}>
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`${styles.link} ${pathname === l.href ? styles.active : ''}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className={styles.actions}>
            <button
              className={styles.iconBtn}
              onClick={() => setSearchOpen(p => !p)}
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
            <button className={styles.iconBtn} aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button className={styles.iconBtn} aria-label="Profile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            <Link href="/login" className="btn btn-secondary btn-sm" style={{padding:'9px 20px'}}>Login</Link>
            <Link href="/signup" className="btn btn-primary btn-sm" style={{padding:'9px 20px'}}>Sign Up</Link>
          </div>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}>
          <ul className={styles.mobileLinks}>
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} className={`${styles.mobileLink} ${pathname === l.href ? styles.active : ''}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.mobileActions}>
            <Link href="/login"  className="btn btn-secondary w-full" style={{justifyContent:'center'}}>Login</Link>
            <Link href="/signup" className="btn btn-primary  w-full" style={{marginTop:12,justifyContent:'center'}}>Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className={styles.searchOverlay} onClick={() => setSearchOpen(false)}>
          <div className={styles.searchBox} onClick={e => e.stopPropagation()}>
            <input
              autoFocus
              className={`${styles.searchInput} form-input`}
              placeholder="Search courses, projects, circuits, code..."
            />
            <button className={styles.searchClose} onClick={() => setSearchOpen(false)}>✕</button>
          </div>
        </div>
      )}
    </>
  );
}
