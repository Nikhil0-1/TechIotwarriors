'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Certificates.module.css';
import { getCertificates, saveCertificates, verifyCertificate, VerifiedCertificate } from '@/lib/db';
import { Shield, BookOpen, Download, Search, Check, Alert } from '@/components/ui/Icons';

function CertificatesContent() {
  const [activeTab, setActiveTab] = useState<'generate' | 'verify'>('generate');
  
  // Tab 1: Generation State
  const [studentName, setStudentName] = useState('');
  const [courseSelected, setCourseSelected] = useState('Beginner IoT Mastery Bootcamp');
  const [quizPassed, setQuizPassed] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [generatedCert, setGeneratedCert] = useState<VerifiedCertificate | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Tab 2: Verification State
  const [verifyInput, setVerifyInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerifiedCertificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchParams = useSearchParams();

  // Load verified certificate check from URL parameters
  useEffect(() => {
    const verifyId = searchParams.get('verify');
    if (verifyId) {
      setActiveTab('verify');
      setVerifyInput(verifyId);
      const record = verifyCertificate(verifyId);
      setVerificationResult(record);
      setHasSearched(true);
    }
  }, [searchParams]);

  // Load Google Fonts dynamically for certificate rendering
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fontId = 'certificate-luxury-fonts';
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Alex+Brush&family=Montserrat:wght@400;500;600;700&display=swap';
        document.head.appendChild(link);
      }
    }
  }, []);

  // Quiz questions
  const QUESTIONS = [
    {
      id: 1,
      q: 'Which protocol is standard for sending light, low-bandwidth telemetry data to IoT Brokers?',
      options: ['HTTP POST', 'MQTT Broker', 'FTP Protocol', 'SSH Terminal'],
      correct: 'MQTT Broker'
    },
    {
      id: 2,
      q: 'What is the voltage logic level threshold for ESP32 inputs/outputs?',
      options: ['5.0 Volts', '1.2 Volts', '3.3 Volts', '12.0 Volts'],
      correct: '3.3 Volts'
    },
    {
      id: 3,
      q: 'Which function runs continuously in an Arduino/ESP sketch?',
      options: ['setup()', 'init()', 'loop()', 'main()'],
      correct: 'loop()'
    }
  ];

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('Please enter your full name first.');
      return;
    }
    
    setSubmittingQuiz(true);
    let correctCount = 0;
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correct) correctCount++;
    });

    const finalScore = Math.round((correctCount / QUESTIONS.length) * 100);
    setScore(finalScore);

    if (finalScore >= 80) {
      const certs = getCertificates();
      const existing = certs.find(
        c => c.studentName.toLowerCase() === studentName.trim().toLowerCase() && 
             c.courseName === courseSelected
      );

      let finalCert: VerifiedCertificate;
      if (existing) {
        finalCert = existing;
      } else {
        const nextId = certs.length + 1;
        const certNumber = `TIW-2026-${nextId.toString().padStart(4, '0')}`;
        const dateObj = new Date();
        const completionDate = `${dateObj.getDate().toString().padStart(2, '0')} ${dateObj.toLocaleString('en-IN', { month: 'long' })} ${dateObj.getFullYear()}`;
        
        finalCert = {
          id: 'cert_' + Math.random().toString(36).substr(2, 9),
          certNumber,
          studentName: studentName.trim(),
          courseName: courseSelected,
          completionDate,
          verificationCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
          grade: 'Distinction'
        };

        saveCertificates([...certs, finalCert]);
      }

      setGeneratedCert(finalCert);
      setQuizPassed(true);
      setTimeout(() => drawCertificate(finalCert), 150);
    } else {
      setQuizPassed(false);
    }
    setSubmittingQuiz(false);
  };

  const drawCertificate = (cert: VerifiedCertificate) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (typeof document !== 'undefined') {
      document.fonts.ready.then(() => {
        performDraw(ctx, canvas, cert);
      });
    } else {
      performDraw(ctx, canvas, cert);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // CERTIFICATE CANVAS DRAW — matches reference image exactly
  // Dynamic fields: cert.studentName, cert.certNumber, cert.completionDate, cert.courseName
  // Everything else is FIXED to match the reference design
  // ═══════════════════════════════════════════════════════════════════════════════
  const performDraw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, cert: VerifiedCertificate) => {
    canvas.width  = 1600;
    canvas.height = 1100;
    const W  = canvas.width;
    const H  = canvas.height;
    const cx = W / 2;
    const PI = Math.PI;

    // ── COLORS ──────────────────────────────────────────────────────────────────
    const GOLD  = '#C9A84C';
    const GOLDA = (a: number) => `rgba(201,168,76,${a})`;
    const DARK  = '#111111';
    const GREY  = '#555555';
    const LGREY = '#888888';

    // ── BACKGROUND ──────────────────────────────────────────────────────────────
    ctx.fillStyle = '#FAFAF5';
    ctx.fillRect(0, 0, W, H);

    // ── OUTER GOLD BORDER ───────────────────────────────────────────────────────
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 2.2;
    ctx.strokeRect(26, 26, W - 52, H - 52);

    // ── INNER THIN GOLD BORDER ──────────────────────────────────────────────────
    ctx.strokeStyle = GOLDA(0.55);
    ctx.lineWidth = 0.7;
    ctx.strokeRect(36, 36, W - 72, H - 72);

    // ── CORNER CROSSHAIR (top-right + bottom-left) ──────────────────────────────
    const crosshair = (ox: number, oy: number) => {
      ctx.strokeStyle = GOLD; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(ox, oy - 20); ctx.lineTo(ox, oy + 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox - 20, oy); ctx.lineTo(ox + 20, oy); ctx.stroke();
      ctx.beginPath(); ctx.arc(ox, oy, 3.5, 0, PI * 2);
      ctx.fillStyle = GOLD; ctx.fill();
    };
    crosshair(W - 40, 40);  // top-right
    crosshair(40, H - 40);  // bottom-left

    // ── TOP-LEFT BLACK CORNER SWEEP ─────────────────────────────────────────────
    ctx.fillStyle = DARK;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(230, 0);
    ctx.bezierCurveTo(120, 18, 55, 75, 0, 230);
    ctx.closePath();
    ctx.fill();
    // Thick gold accent curve
    ctx.strokeStyle = GOLD; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(245, 0); ctx.bezierCurveTo(132, 22, 62, 82, 0, 245); ctx.stroke();
    // Thin inner gold line
    ctx.strokeStyle = GOLDA(0.55); ctx.lineWidth = 1.0;
    ctx.beginPath(); ctx.moveTo(260, 0); ctx.bezierCurveTo(146, 28, 72, 92, 0, 260); ctx.stroke();

    // ── BOTTOM-RIGHT BLACK CORNER SWEEP ────────────────────────────────────────
    ctx.fillStyle = DARK;
    ctx.beginPath();
    ctx.moveTo(W, H);
    ctx.lineTo(W - 230, H);
    ctx.bezierCurveTo(W - 120, H - 18, W - 55, H - 75, W, H - 230);
    ctx.closePath();
    ctx.fill();
    // Thick gold accent curve
    ctx.strokeStyle = GOLD; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(W - 245, H); ctx.bezierCurveTo(W - 132, H - 22, W - 62, H - 82, W, H - 245); ctx.stroke();
    // Thin inner gold line
    ctx.strokeStyle = GOLDA(0.55); ctx.lineWidth = 1.0;
    ctx.beginPath(); ctx.moveTo(W - 260, H); ctx.bezierCurveTo(W - 146, H - 28, W - 72, H - 92, W, H - 260); ctx.stroke();

    // ── RIGHT SIDE: PCB CIRCUIT TRACE PATTERN ──────────────────────────────────
    // Matching the reference: grid of horizontal lines extending inward with 90° jogs
    {
      const rx = W - 44;
      const ry = 166;
      ctx.strokeStyle = GOLDA(0.38); ctx.lineWidth = 1.3;
      const tracks = [
        { dy:   0, inset: 200, jog: 55, djog: 28 },
        { dy:  30, inset: 165, jog: 48, djog: 24 },
        { dy:  60, inset: 225, jog: 68, djog: 30 },
        { dy:  90, inset: 148, jog: 42, djog: 22 },
        { dy: 120, inset: 188, jog: 58, djog: 26 },
        { dy: 150, inset: 138, jog: 38, djog: 20 },
        { dy: 185, inset:  98, jog: 28, djog: 18 },
        { dy: 215, inset: 155, jog: 46, djog: 23 },
      ];
      tracks.forEach(t => {
        const y0 = ry + t.dy;
        const y1 = y0 + t.djog;
        const x1 = rx - t.jog;
        const x2 = x1 - 28;
        const x3 = rx - t.inset;
        ctx.beginPath();
        ctx.moveTo(rx, y0);
        ctx.lineTo(x1, y0);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x3, y1);
        ctx.stroke();
        // terminal dot
        ctx.beginPath(); ctx.arc(x3 - 3, y1, 2.5, 0, PI * 2);
        ctx.fillStyle = GOLDA(0.52); ctx.fill();
      });
      // Vertical connector bridges
      ctx.strokeStyle = GOLDA(0.32); ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(rx - 55, ry);      ctx.lineTo(rx - 55, ry + 90);  ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx - 105, ry + 30); ctx.lineTo(rx - 105, ry + 150); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx - 78, ry + 120); ctx.lineTo(rx - 78, ry + 215); ctx.stroke();
      // Small IC pad squares
      ctx.strokeStyle = GOLDA(0.30);
      [[rx - 168, ry + 18],[rx - 142, ry + 52],[rx - 122, ry + 84]].forEach(([px, py]) => {
        ctx.strokeRect(px - 5, py - 5, 10, 10);
      });
    }

    // ── LEFT SIDE: Lighter circuit traces ───────────────────────────────────────
    {
      const lx = 44;
      const ly = 546;
      ctx.strokeStyle = GOLDA(0.22); ctx.lineWidth = 1.1;
      [[0,108,16,16],[28,84,12,14],[56,122,18,18],[82,92,14,15]].forEach(([dy,len,jog,djog]) => {
        const y0 = ly + dy;
        const y1 = y0 + djog;
        ctx.beginPath();
        ctx.moveTo(lx, y0);
        ctx.lineTo(lx + len - jog - 28, y0);
        ctx.lineTo(lx + len - 28, y1);
        ctx.lineTo(lx + len, y1);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(lx + len + 3, y1, 2.2, 0, PI * 2);
        ctx.fillStyle = GOLDA(0.40); ctx.fill();
      });
    }

    // ── LOGO: Open-arc circle + T glyph ────────────────────────────────────────
    {
      const lx = cx;
      const ly = 148;
      const R  = 52;

      // Outer gold arc (gap at upper-right like reference)
      ctx.strokeStyle = GOLD; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(lx, ly, R, -PI * 0.76, PI * 0.62); ctx.stroke();

      // Inner thin arc
      ctx.strokeStyle = GOLDA(0.48); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(lx, ly, R - 9, -PI * 0.76, PI * 0.62); ctx.stroke();

      // T crossbar — gold
      ctx.strokeStyle = GOLD; ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(lx - 30, ly - 13); ctx.lineTo(lx + 30, ly - 13); ctx.stroke();

      // T stem — dark
      ctx.strokeStyle = DARK; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(lx, ly - 13); ctx.lineTo(lx, ly + 25); ctx.stroke();
      ctx.lineCap = 'butt';

      // Small circuit branch off right end of crossbar
      ctx.strokeStyle = GOLD; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lx + 24, ly - 13);
      ctx.lineTo(lx + 36, ly - 2);
      ctx.lineTo(lx + 50, ly - 2);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(lx + 52, ly - 2, 2.5, 0, PI * 2);
      ctx.fillStyle = GOLD; ctx.fill();

      // "TECH" (black) + "IoT" (gold) on same line, centred
      ctx.font = 'bold 36px "Montserrat", sans-serif';
      const tw = ctx.measureText('TECH ').width;
      const iw = ctx.measureText('IoT').width;
      const bx = cx - (tw + iw) / 2;
      ctx.textAlign = 'left';
      ctx.fillStyle = DARK;  ctx.fillText('TECH ', bx, 238);
      ctx.fillStyle = GOLD;  ctx.fillText('IoT',   bx + tw, 238);

      // "— WARRIORS —"
      ctx.textAlign = 'center';
      ctx.fillStyle = DARK;
      ctx.font = '700 14px "Montserrat", sans-serif';
      ctx.fillText('— WARRIORS —', cx, 264);

      // Tagline
      ctx.fillStyle = LGREY;
      ctx.font = '500 11.5px "Montserrat", sans-serif';
      ctx.fillText('BUILD  •  LEARN  •  INNOVATE', cx, 286);
    }

    // ── CERTIFICATE heading ─────────────────────────────────────────────────────
    ctx.textAlign = 'center';
    ctx.fillStyle = DARK;
    ctx.font = '700 80px "Cinzel", "Palatino Linotype", serif';
    ctx.fillText('CERTIFICATE', cx, 390);

    // "— OF COMPLETION —" gold subtitle
    ctx.fillStyle = GOLD;
    ctx.font = '700 18px "Montserrat", sans-serif';
    ctx.fillText('—  OF COMPLETION  —', cx, 432);

    // Gold lines flanking subtitle
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - 350, 432); ctx.lineTo(cx - 195, 432); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 195, 432); ctx.lineTo(cx + 350, 432); ctx.stroke();

    // Diamond ornament helper
    const diamond = (dx: number, dy: number, s: number) => {
      ctx.fillStyle = GOLD;
      ctx.save(); ctx.translate(dx, dy); ctx.rotate(PI / 4);
      ctx.fillRect(-s / 2, -s / 2, s, s);
      ctx.restore();
    };
    diamond(cx - 197, 432, 6.5);
    diamond(cx + 197, 432, 6.5);

    // Small diamond below "OF COMPLETION"
    diamond(cx, 454, 7.5);

    // ── "This is to proudly certify that" ──────────────────────────────────────
    ctx.fillStyle = GREY;
    ctx.font = 'italic 21px "Georgia", "Times New Roman", serif';
    ctx.fillText('This is to proudly certify that', cx, 508);

    // ── STUDENT NAME (DYNAMIC) — Alex Brush gold cursive ───────────────────────
    ctx.fillStyle = GOLD;
    ctx.font = '105px "Alex Brush", cursive';
    ctx.fillText(cert.studentName, cx, 618);

    // Decorative underline flourish
    const nw = Math.min(ctx.measureText(cert.studentName).width * 0.78, 640);
    ctx.strokeStyle = GOLDA(0.45); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(cx - nw / 2, 642); ctx.lineTo(cx + nw / 2, 642); ctx.stroke();

    // ── "has successfully completed the course" ────────────────────────────────
    ctx.fillStyle = GREY;
    ctx.font = 'italic 19px "Georgia", "Times New Roman", serif';
    ctx.fillText('has successfully completed the course', cx, 692);

    // ── COURSE NAME (DYNAMIC) — Cinzel bold with arrow ornaments ───────────────
    ctx.fillStyle = DARK;
    ctx.font = '700 32px "Cinzel", serif';
    const ctW = ctx.measureText(cert.courseName).width;
    ctx.fillText(cert.courseName, cx, 748);

    // Arrow ornaments flanking course title
    const arrowOrn = (ax: number, ay: number, dir: number) => {
      ctx.strokeStyle = GOLD; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax + dir * 18, ay);
      ctx.moveTo(ax + dir * 12, ay - 7);
      ctx.lineTo(ax + dir * 18, ay);
      ctx.lineTo(ax + dir * 12, ay + 7);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(ax + dir * 24, ay, 3, 0, PI * 2);
      ctx.fillStyle = GOLD; ctx.fill();
    };
    arrowOrn(cx - ctW / 2 - 46, 744, 1);
    arrowOrn(cx + ctW / 2 + 46, 744, -1);

    // ── FIXED description text (exactly as reference) ──────────────────────────
    ctx.fillStyle = GREY;
    ctx.font = '400 16.5px "Montserrat", sans-serif';
    ctx.fillText('and has verified their engineering competence in hardware circuits configuration,', cx, 800);
    ctx.fillText('microcontroller programming, IoT communication, cloud integration,', cx, 824);
    ctx.fillText('and real-world project development.', cx, 848);

    // ── Thin separator line ────────────────────────────────────────────────────
    ctx.strokeStyle = GOLDA(0.30); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(120, 878); ctx.lineTo(W - 120, 878); ctx.stroke();

    // ── 5 SKILL BADGES (laurel wreath + icon + label) ─────────────────────────
    // Placed in the centre zone between QR block and signature
    const badgeData = [
      { l1: 'HARDWARE',    l2: 'EXPERTISE',   icon: 'chip'   },
      { l1: 'CODING',      l2: 'SKILLS',       icon: 'code'   },
      { l1: 'IoT & CLOUD', l2: 'INTEGRATION',  icon: 'cloud'  },
      { l1: 'REAL PROJECT',l2: 'DEVELOPMENT',  icon: 'bulb'   },
      { l1: 'PRACTICAL',   l2: 'LEARNING',     icon: 'shield' },
    ];
    const bStartX   = 380;
    const bEndX     = W - 380;
    const bSpacing  = (bEndX - bStartX) / (badgeData.length - 1);
    const badgeCY   = 944;
    const wrR       = 38;

    const drawWreath = (bx: number, by: number) => {
      ctx.strokeStyle = GOLD; ctx.lineWidth = 1.2;
      // Left half wreath
      for (let i = 0; i < 10; i++) {
        const a = (200 + i * 11) * PI / 180;
        ctx.beginPath();
        ctx.ellipse(bx + Math.cos(a) * wrR, by + Math.sin(a) * wrR, 5, 2.2, a + PI / 2, 0, PI * 2);
        ctx.stroke();
      }
      // Right half wreath
      for (let i = 0; i < 10; i++) {
        const a = (340 - i * 11) * PI / 180;
        ctx.beginPath();
        ctx.ellipse(bx + Math.cos(a) * wrR, by + Math.sin(a) * wrR, 5, 2.2, a - PI / 2, 0, PI * 2);
        ctx.stroke();
      }
      // Bottom bow
      ctx.beginPath();
      ctx.moveTo(bx - 8, by + wrR + 4);
      ctx.lineTo(bx,     by + wrR + 1);
      ctx.lineTo(bx + 8, by + wrR + 4);
      ctx.stroke();
    };

    const drawBadgeIcon = (icon: string, bx: number, by: number) => {
      ctx.strokeStyle = GOLD; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
      if (icon === 'chip') {
        ctx.strokeRect(bx - 12, by - 10, 24, 20);
        ctx.fillStyle = GOLD; ctx.fillRect(bx - 5, by - 5, 10, 10);
        [[-12,-4],[-12,0],[-12,4],[12,-4],[12,0],[12,4]].forEach(([dx, dy]) => {
          ctx.beginPath(); ctx.moveTo(bx + dx, by + dy); ctx.lineTo(bx + dx + (dx < 0 ? -5 : 5), by + dy); ctx.stroke();
        });
      } else if (icon === 'code') {
        ctx.font = 'bold 22px "Courier New", monospace';
        ctx.fillStyle = GOLD; ctx.textAlign = 'center';
        ctx.fillText('</>', bx, by + 8);
      } else if (icon === 'cloud') {
        ctx.beginPath(); ctx.arc(bx, by + 2, 10, PI * 0.8, PI * 0.2); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx + 8, by - 2, 7, PI * 1.1, PI * 1.9); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx - 8, by - 1, 6, PI * 1.2, PI * 1.85); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx, by + 12); ctx.lineTo(bx, by - 14);
        ctx.moveTo(bx - 5, by - 8); ctx.lineTo(bx, by - 14); ctx.lineTo(bx + 5, by - 8); ctx.stroke();
      } else if (icon === 'bulb') {
        ctx.beginPath(); ctx.arc(bx, by - 6, 11, PI * 0.72, PI * 0.28); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx - 7, by + 5); ctx.lineTo(bx + 7, by + 5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx - 5, by + 8); ctx.lineTo(bx + 5, by + 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx - 4, by + 11); ctx.lineTo(bx + 4, by + 11); ctx.stroke();
      } else if (icon === 'shield') {
        ctx.beginPath();
        ctx.moveTo(bx, by - 13);
        ctx.lineTo(bx + 10, by - 8); ctx.lineTo(bx + 10, by + 2);
        ctx.quadraticCurveTo(bx + 10, by + 10, bx, by + 14);
        ctx.quadraticCurveTo(bx - 10, by + 10, bx - 10, by + 2);
        ctx.lineTo(bx - 10, by - 8); ctx.closePath(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(bx - 4, by + 1); ctx.lineTo(bx - 1, by + 5); ctx.lineTo(bx + 5, by - 3);
        ctx.stroke();
      }
      ctx.lineCap = 'butt';
    };

    badgeData.forEach((b, i) => {
      const bx = bStartX + i * bSpacing;
      drawWreath(bx, badgeCY);
      drawBadgeIcon(b.icon, bx, badgeCY);
      ctx.textAlign = 'center';
      ctx.fillStyle = DARK; ctx.font = '700 10.5px "Montserrat", sans-serif';
      ctx.fillText(b.l1, bx, badgeCY + wrR + 22);
      ctx.fillText(b.l2, bx, badgeCY + wrR + 35);
    });

    // ── BOTTOM LEFT: QR code block (cert.certNumber is DYNAMIC) ───────────────
    {
      const qrX = 110; const qrY = 895; const qrS = 90;
      ctx.strokeStyle = GOLDA(0.55); ctx.lineWidth = 1.5;
      ctx.strokeRect(qrX, qrY, qrS, qrS);

      const qrFinder = (fx: number, fy: number) => {
        ctx.fillStyle = DARK;  ctx.fillRect(fx,      fy,      22, 22);
        ctx.fillStyle = '#FAFAF5'; ctx.fillRect(fx + 4,  fy + 4,  14, 14);
        ctx.fillStyle = DARK;  ctx.fillRect(fx + 7,  fy + 7,   8,  8);
      };
      qrFinder(qrX + 5,        qrY + 5);
      qrFinder(qrX + qrS - 27, qrY + 5);
      qrFinder(qrX + 5,        qrY + qrS - 27);

      ctx.fillStyle = DARK;
      [[34,34],[38,34],[34,38],[44,34],[44,38],[50,34],[34,44],[34,50],[38,44],
       [44,50],[52,44],[56,50],[34,56],[40,56],[48,60],[34,62],[42,66],[50,58],
       [56,34],[60,40],[62,34],[58,46],[66,42],[62,52],[52,58],[58,62],[62,58],
       [66,62],[58,68],[64,68]].forEach(([dx, dy]) => {
        ctx.fillRect(qrX + dx, qrY + dy, 5, 5);
      });

      ctx.textAlign = 'center';
      ctx.fillStyle = LGREY; ctx.font = '500 11px "Montserrat", sans-serif';
      ctx.fillText('Scan to Verify Certificate', qrX + qrS / 2, qrY + qrS + 18);
      ctx.fillStyle = GOLD; ctx.font = '600 12px "Montserrat", sans-serif';
      ctx.fillText(`Certificate No. : ${cert.certNumber}`, qrX + qrS / 2, qrY + qrS + 36);
    }

    // ── BOTTOM RIGHT: FOUNDER SIGNATURE (FIXED — always Nikhil Kumar) ─────────
    {
      const sigX = W - 255;
      const sigY = 918;
      ctx.textAlign = 'center';

      // Handwritten signature in Alex Brush
      ctx.fillStyle = DARK;
      ctx.font = 'italic 56px "Alex Brush", cursive';
      ctx.fillText('Nikhil Kumar', sigX, sigY);

      // Signature underline
      ctx.strokeStyle = GOLDA(0.42); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(sigX - 125, sigY + 14); ctx.lineTo(sigX + 125, sigY + 14); ctx.stroke();

      // Printed name
      ctx.fillStyle = DARK; ctx.font = '700 15px "Montserrat", sans-serif';
      ctx.fillText('Nikhil Kumar', sigX, sigY + 40);

      // Role
      ctx.fillStyle = LGREY; ctx.font = '400 12.5px "Montserrat", sans-serif';
      ctx.fillText('CEO & Founder', sigX, sigY + 60);

      // Company in gold
      ctx.fillStyle = GOLD; ctx.font = '600 12.5px "Montserrat", sans-serif';
      ctx.fillText('Tech IoT Warriors', sigX, sigY + 80);
    }

    // ── BOTTOM CENTRE: Completion date (DYNAMIC) ──────────────────────────────
    ctx.textAlign = 'center';
    ctx.fillStyle = GREY; ctx.font = '500 14px "Montserrat", sans-serif';
    ctx.fillText(`Completed On : ${cert.completionDate}`, cx, 1048);

    ctx.strokeStyle = GOLD; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - 210, 1044); ctx.lineTo(cx - 114, 1044); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 114, 1044); ctx.lineTo(cx + 210, 1044); ctx.stroke();
    diamond(cx - 116, 1044, 5);
    diamond(cx + 116, 1044, 5);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tech_IoT_Warriors_Certificate_${studentName.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;
    setHasSearched(true);
    const result = verifyCertificate(verifyInput.trim());
    setVerificationResult(result);
  };

  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-badge">Accredited Credentials</span>
          <h1 className={styles.title}>IoT Certificate <span className="text-gradient">Portal</span></h1>
          <p className={styles.subtitle}>
            Complete your competence passing test to generate your official developer credential, or instantly verify issued serial numbers.
          </p>
        </div>

        {/* Dynamic Tabs */}
        <div className={styles.tabButtonsRow}>
          <button
            onClick={() => setActiveTab('generate')}
            className={`${styles.tabBtn} ${activeTab === 'generate' ? styles.activeTab : ''}`}
          >
            <BookOpen size={16} />
            <span>Generate Certificate</span>
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`${styles.tabBtn} ${activeTab === 'verify' ? styles.activeTab : ''}`}
          >
            <Shield size={16} />
            <span>Verify Credentials</span>
          </button>
        </div>

        <div className={styles.workspace}>
          {/* TAB A: Generate Certificate */}
          {activeTab === 'generate' && (
            <>
              {!quizPassed ? (
                <div className={`glass-card ${styles.quizCard}`}>
                  <h2>1. Enter Verification Details</h2>
                  <form onSubmit={handleQuizSubmit} className={styles.form}>
                    <div className="form-group">
                      <label className="form-label">Student Full Name (As printed on certificate):</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={studentName}
                        onChange={e => setStudentName(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Select Finished IoT Course Program:</label>
                      <select
                        value={courseSelected}
                        onChange={e => setCourseSelected(e.target.value)}
                        className="form-input"
                        style={{ background: 'var(--dark-gray)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <option value="Electronics Basics & Circuit Designing">Electronics Basics &amp; Circuit Designing</option>
                        <option value="Beginner IoT Mastery Bootcamp">Beginner IoT Mastery Bootcamp</option>
                        <option value="Arduino Programming & Circuit Building">Arduino Programming &amp; Circuit Building</option>
                        <option value="ESP8266 WiFi & Home Automation IoT">ESP8266 WiFi &amp; Home Automation IoT</option>
                        <option value="ESP32 Advanced IoT with FreeRTOS & HTTP">ESP32 Advanced IoT with FreeRTOS &amp; HTTP</option>
                        <option value="Real-world Smart IoT Industrial Projects">Real-world Smart IoT Industrial Projects</option>
                      </select>
                    </div>

                    <div className="gold-divider" style={{ margin: '24px 0' }} />

                    <h2>2. Complete Competence Assessment Quiz</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
                      You must answer all MCQ questions correctly (min 80%) to generate the secure verification badge.
                    </p>

                    {QUESTIONS.map((q, qidx) => (
                      <div key={q.id} className={styles.questionBlock}>
                        <strong>Q{qidx + 1}: {q.q}</strong>
                        <div className={styles.options}>
                          {q.options.map(opt => (
                            <label key={opt} className={styles.optionLabel}>
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                value={opt}
                                checked={answers[q.id] === opt}
                                onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                required
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    {score !== null && score < 80 && (
                      <div className={styles.errorAlert}>
                        Score: {score}%. You need at least 80% to pass. Please review answers and try again.
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 24 }} disabled={submittingQuiz}>
                      {submittingQuiz ? 'Evaluating Test...' : 'Evaluate Quiz & Generate Certificate'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className={styles.certOutput}>
                  <div className={`glass-card ${styles.successBar}`}>
                    <div>
                      <h3>Assessment Congratulations!</h3>
                      <p>You scored {score}%. Your secure unique certificate number is: <strong className="text-gold">{generatedCert?.certNumber}</strong></p>
                    </div>
                    <div className={styles.certButtons}>
                      <button onClick={handleDownload} className="btn btn-primary">
                        <Download size={16} /> Download PNG
                      </button>
                      <button onClick={() => setQuizPassed(false)} className="btn btn-secondary">
                        Retake Test
                      </button>
                    </div>
                  </div>

                  {/* Certificate Canvas Area */}
                  <div className={styles.canvasContainer}>
                    <canvas ref={canvasRef} className={styles.canvas} />
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB B: Verify Certificate */}
          {activeTab === 'verify' && (
            <div className={`glass-card ${styles.verifyCard}`}>
              <h2>Verify Issued IoT Credentials</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
                Enter the official auto-generated certificate serial ID (e.g. <code>TIW-2026-0001</code>) to lookup registration records.
              </p>

              <form onSubmit={handleVerifySearch} className={styles.verifySearchForm}>
                <div className={styles.searchRow}>
                  <input
                    type="text"
                    required
                    placeholder="Enter Certificate No (e.g. TIW-2026-0001)"
                    value={verifyInput}
                    onChange={e => setVerifyInput(e.target.value)}
                    className={`${styles.verifyInput} form-input`}
                  />
                  <button type="submit" className="btn btn-primary">
                    <Search size={16} /> Verify
                  </button>
                </div>
              </form>

              {hasSearched && (
                <div style={{ marginTop: 32 }}>
                  {verificationResult ? (
                    <div className={`glass-card ${styles.verifiedResultBox}`}>
                      <div className={styles.resultHeader}>
                        <span className={styles.checkIcon}><Check size={20} /></span>
                        <div>
                          <h3 style={{color: '#22c55e'}}>VERIFIED SECURE CREDENTIAL</h3>
                          <p style={{fontSize: '0.78rem', color: 'var(--text-muted)'}}>Tech IoT Warriors Database Record Match</p>
                        </div>
                      </div>
                      <div className="gold-divider" style={{margin: '16px 0'}} />
                      <div className={styles.resultDetails}>
                        <div className={styles.detailRow}>
                          <span>Student Name:</span>
                          <strong>{verificationResult.studentName}</strong>
                        </div>
                        <div className={styles.detailRow}>
                          <span>Course Program:</span>
                          <strong>{verificationResult.courseName}</strong>
                        </div>
                        <div className={styles.detailRow}>
                          <span>Completion Date:</span>
                          <strong>{verificationResult.completionDate}</strong>
                        </div>
                        <div className={styles.detailRow}>
                          <span>Verification Serial ID:</span>
                          <strong className="text-gold">{verificationResult.certNumber}</strong>
                        </div>
                        <div className={styles.detailRow}>
                          <span>Status:</span>
                          <span className="badge badge-green">Accredited Active</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span>Authorized Signatory:</span>
                          <strong>Nikhil Kumar (CEO &amp; Founder)</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`glass-card ${styles.unverifiedResultBox}`}>
                      <div className={styles.resultHeader}>
                        <span className={styles.crossIcon}><Alert size={20} color="#EF4444" /></span>
                        <div>
                          <h3 style={{color: '#EF4444'}}>CREDENTIAL MATCH FAILED</h3>
                          <p style={{fontSize: '0.78rem', color: 'var(--text-muted)'}}>No Matching Database Records Found</p>
                        </div>
                      </div>
                      <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 12}}>
                        The certificate serial number <strong>&quot;{verifyInput}&quot;</strong> could not be validated in the Tech IoT Warriors register. Please check the character symbols formatting or contact administrative support at <code>support@techiotwarriors.com</code>.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <Suspense fallback={<div className="loading-overlay"><div className="loading-spinner" /></div>}>
      <CertificatesContent />
    </Suspense>
  );
}
