'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Certificates.module.css';
import { getCertificates, saveCertificates, verifyCertificate, VerifiedCertificate } from '@/lib/db';
import { Shield, BookOpen, Download, Search, Check, Alert } from '@/components/ui/Icons';

function CertificatesContent() {
  const [activeTab, setActiveTab] = useState<'generate' | 'verify'>('generate');
  const [studentName, setStudentName] = useState('');
  const [courseSelected, setCourseSelected] = useState('Beginner IoT Mastery Bootcamp');
  const [quizPassed, setQuizPassed] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [generatedCert, setGeneratedCert] = useState<VerifiedCertificate | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [verifyInput, setVerifyInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerifiedCertificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchParams = useSearchParams();

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fontId = 'certificate-luxury-fonts';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Alex+Brush&family=Montserrat:wght@400;500;600;700;800&display=swap';
      document.head.appendChild(link);
    }
    const img = new Image();
    img.onload = () => { logoImgRef.current = img; };
    img.src = '/tiw-logo-actual.jpg';
  }, []);

  const QUESTIONS = [
    { id: 1, q: 'Which protocol is standard for sending light, low-bandwidth telemetry data to IoT Brokers?', options: ['HTTP POST', 'MQTT Broker', 'FTP Protocol', 'SSH Terminal'], correct: 'MQTT Broker' },
    { id: 2, q: 'What is the voltage logic level threshold for ESP32 inputs/outputs?', options: ['5.0 Volts', '1.2 Volts', '3.3 Volts', '12.0 Volts'], correct: '3.3 Volts' },
    { id: 3, q: 'Which function runs continuously in an Arduino/ESP sketch?', options: ['setup()', 'init()', 'loop()', 'main()'], correct: 'loop()' }
  ];

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) { alert('Please enter your full name first.'); return; }
    setSubmittingQuiz(true);
    let correct = 0;
    QUESTIONS.forEach(q => { if (answers[q.id] === q.correct) correct++; });
    const finalScore = Math.round((correct / QUESTIONS.length) * 100);
    setScore(finalScore);
    if (finalScore >= 80) {
      const certs = getCertificates();
      const existing = certs.find(c => c.studentName.toLowerCase() === studentName.trim().toLowerCase() && c.courseName === courseSelected);
      let finalCert: VerifiedCertificate;
      if (existing) {
        finalCert = existing;
      } else {
        const nextId = certs.length + 1;
        const certNumber = `TIW-2026-${nextId.toString().padStart(4, '0')}`;
        const d = new Date();
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const completionDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        finalCert = { id: 'cert_' + Math.random().toString(36).substr(2,9), certNumber, studentName: studentName.trim(), courseName: courseSelected, completionDate, verificationCode: Math.random().toString(36).substr(2,6).toUpperCase(), grade: 'Distinction' };
        saveCertificates([...certs, finalCert]);
      }
      setGeneratedCert(finalCert);
      setQuizPassed(true);
      setTimeout(() => drawCertificate(finalCert), 200);
    } else { setQuizPassed(false); }
    setSubmittingQuiz(false);
  };

  const drawCertificate = (cert: VerifiedCertificate) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    document.fonts.ready.then(() => performDraw(ctx, canvas, cert));
  };

  // ═══════════════════════════════════════════════════════════════════════
  //  TECH IOT WARRIORS — Certificate Canvas Renderer
  //  All elements drawn programmatically to exactly match the reference.
  //  DYNAMIC: studentName, certNumber, completionDate, courseName
  //  FIXED: logo, layout, description, badges, signature
  // ═══════════════════════════════════════════════════════════════════════
  const performDraw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, cert: VerifiedCertificate) => {
    canvas.width  = 1600;
    canvas.height = 1100;
    const W  = canvas.width;
    const H  = canvas.height;
    const CX = W / 2;          // horizontal centre
    const PI = Math.PI;

    // ─── COLOURS ────────────────────────────────────────────────────────────
    const GOLD  = '#C9A84C';
    const ga    = (a: number) => `rgba(201,168,76,${a})`;
    const BLACK = '#111111';
    const GREY  = '#555555';
    const LGREY = '#888888';

    // ═══════════════════════════════════════════════════════════════════════
    // 1. BACKGROUND (white/ivory)
    // ═══════════════════════════════════════════════════════════════════════
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, W, H);

    // ═══════════════════════════════════════════════════════════════════════
    // 2. OUTER GOLD BORDER
    // ═══════════════════════════════════════════════════════════════════════
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2.2;
    ctx.strokeRect(24, 24, W - 48, H - 48);
    ctx.strokeStyle = ga(0.40); ctx.lineWidth = 0.6;
    ctx.strokeRect(32, 32, W - 64, H - 64);

    // ═══════════════════════════════════════════════════════════════════════
    // 3. CORNER ORNAMENTS  (crosshair brackets — top-right & bottom-left)
    // ═══════════════════════════════════════════════════════════════════════
    const crosshair = (ox: number, oy: number) => {
      ctx.strokeStyle = GOLD; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(ox - 22, oy); ctx.lineTo(ox + 22, oy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, oy - 22); ctx.lineTo(ox, oy + 22); ctx.stroke();
      ctx.beginPath(); ctx.arc(ox, oy, 3.8, 0, PI * 2);
      ctx.fillStyle = GOLD; ctx.fill();
    };
    crosshair(W - 42, 42);
    crosshair(42, H - 42);

    // ═══════════════════════════════════════════════════════════════════════
    // 4. TOP-LEFT BLACK CORNER SWEEP (with two gold accent curves)
    // ═══════════════════════════════════════════════════════════════════════
    ctx.fillStyle = BLACK;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(238, 0);
    ctx.bezierCurveTo(124, 16, 56, 72, 0, 238);
    ctx.closePath();
    ctx.fill();
    // Thick gold accent
    ctx.strokeStyle = GOLD; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(252, 0); ctx.bezierCurveTo(136, 20, 63, 80, 0, 252); ctx.stroke();
    // Thin inner gold line
    ctx.strokeStyle = ga(0.55); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(268, 0); ctx.bezierCurveTo(150, 27, 75, 92, 0, 268); ctx.stroke();

    // ═══════════════════════════════════════════════════════════════════════
    // 5. BOTTOM-RIGHT BLACK CORNER SWEEP
    // ═══════════════════════════════════════════════════════════════════════
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

    // ═══════════════════════════════════════════════════════════════════════
    // 6. RIGHT-SIDE PCB CIRCUIT TRACES (matching reference design)
    // ═══════════════════════════════════════════════════════════════════════
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

    // ═══════════════════════════════════════════════════════════════════════
    // 7. LEFT-SIDE CIRCUIT TRACES (lighter)
    // ═══════════════════════════════════════════════════════════════════════
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

    // ═══════════════════════════════════════════════════════════════════════
    // 8. LOGO — Pixel-perfect match to the uploaded Tech IoT Warriors logo
    //    Circle: gold open-arc, gap at upper-right
    //    T: gold crossbar (square caps) + thick black stem
    //    Traces: 5 horizontal gold lines with hollow end-circles
    //    Text: TECH (black bold) IoT (gold bold) | WARRIORS | tagline
    // ═══════════════════════════════════════════════════════════════════════
    // ═══════════════════════════════════════════════════════════════════════
    // 8. LOGO — Actual Uploaded Tech IoT Warriors Logo
    // ═══════════════════════════════════════════════════════════════════════
    if (logoImgRef.current) {
      const logoW = 280;
      const logoH = 280;
      ctx.drawImage(logoImgRef.current, CX - logoW / 2, 20, logoW, logoH);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 9. "CERTIFICATE" heading  — large Cinzel serif
    // ═══════════════════════════════════════════════════════════════════════
    ctx.textAlign = 'center';
    ctx.fillStyle = BLACK;
    ctx.font = '700 82px "Cinzel", serif';
    ctx.fillText('CERTIFICATE', CX, 397);

    // ═══════════════════════════════════════════════════════════════════════
    // 10. "OF COMPLETION" gold subtitle with long flanking gold lines
    // ═══════════════════════════════════════════════════════════════════════
    ctx.fillStyle = GOLD;
    ctx.font = '700 17px "Montserrat", sans-serif';
    ctx.fillText('OF COMPLETION', CX, 440);

    // Long flanking lines
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(CX - 380, 440); ctx.lineTo(CX - 178, 440); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CX + 178, 440); ctx.lineTo(CX + 380, 440); ctx.stroke();

    // Diamond ornaments at inner line ends
    const diamond = (dx: number, dy: number, s: number) => {
      ctx.fillStyle = GOLD;
      ctx.save(); ctx.translate(dx, dy); ctx.rotate(PI / 4);
      ctx.fillRect(-s / 2, -s / 2, s, s); ctx.restore();
    };
    diamond(CX - 181, 440, 7);
    diamond(CX + 181, 440, 7);

    // Small decorative diamond below subtitle
    diamond(CX, 462, 7.5);

    // ═══════════════════════════════════════════════════════════════════════
    // 11. "This is to proudly certify that"
    // ═══════════════════════════════════════════════════════════════════════
    ctx.fillStyle = GREY;
    ctx.font = 'italic 20px "Georgia", "Times New Roman", serif';
    ctx.fillText('This is to proudly certify that', CX, 513);

    // ═══════════════════════════════════════════════════════════════════════
    // 12. STUDENT NAME (DYNAMIC) — Alex Brush gold cursive, signature style
    // ═══════════════════════════════════════════════════════════════════════
    ctx.fillStyle = GOLD;
    ctx.font = '110px "Alex Brush", cursive';
    ctx.fillText(cert.studentName, CX, 625);

    // Decorative flourish underline
    const nw = Math.min(ctx.measureText(cert.studentName).width * 0.72, 640);
    ctx.strokeStyle = ga(0.38); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(CX - nw / 2, 650); ctx.lineTo(CX + nw / 2, 650); ctx.stroke();

    // ═══════════════════════════════════════════════════════════════════════
    // 13. "has successfully completed the course"
    // ═══════════════════════════════════════════════════════════════════════
    ctx.fillStyle = GREY;
    ctx.font = 'italic 19px "Georgia", "Times New Roman", serif';
    ctx.fillText('has successfully completed the course', CX, 698);

    // ═══════════════════════════════════════════════════════════════════════
    // 14. COURSE NAME (DYNAMIC) — bold Cinzel with arrow ornaments
    // ═══════════════════════════════════════════════════════════════════════
    ctx.fillStyle = BLACK;
    ctx.font = '700 31px "Cinzel", serif';
    const ctW = ctx.measureText(cert.courseName).width;
    ctx.fillText(cert.courseName, CX, 752);

    // Arrow ornaments
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

    // ═══════════════════════════════════════════════════════════════════════
    // 15. FIXED DESCRIPTION TEXT (exactly matching reference)
    // ═══════════════════════════════════════════════════════════════════════
    ctx.fillStyle = GREY;
    ctx.font = '400 16.5px "Montserrat", sans-serif';
    ctx.fillText('and has verified their engineering competence in hardware circuits configuration,', CX, 805);
    ctx.fillText('microcontroller programming, IoT communication, cloud integration,', CX, 829);
    ctx.fillText('and real-world project development.', CX, 853);

    // ═══════════════════════════════════════════════════════════════════════
    // 16. THIN GOLD SEPARATOR
    // ═══════════════════════════════════════════════════════════════════════
    ctx.strokeStyle = ga(0.28); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(112, 882); ctx.lineTo(W - 112, 882); ctx.stroke();

    // ═══════════════════════════════════════════════════════════════════════
    // 17. SKILL BADGES (5 badges — laurel wreaths + icons + labels)
    // ═══════════════════════════════════════════════════════════════════════
    const badges = [
      { l1: 'HARDWARE',     l2: 'EXPERTISE',   icon: 'chip'   },
      { l1: 'CODING',       l2: 'SKILLS',       icon: 'code'   },
      { l1: 'IoT & CLOUD',  l2: 'INTEGRATION',  icon: 'cloud'  },
      { l1: 'REAL PROJECT', l2: 'DEVELOPMENT',  icon: 'bulb'   },
      { l1: 'PRACTICAL',    l2: 'LEARNING',     icon: 'shield' },
    ];
    const bX0 = 380, bX1 = W - 380;
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

    // ═══════════════════════════════════════════════════════════════════════
    // 18. QR CODE BLOCK — bottom left (certNumber DYNAMIC)
    // ═══════════════════════════════════════════════════════════════════════
    {
      const qX = 110, qY = 895, qS = 90;
      ctx.strokeStyle = ga(0.55); ctx.lineWidth = 1.5; ctx.strokeRect(qX, qY, qS, qS);
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
      ctx.textAlign = 'center';
      ctx.fillStyle = LGREY; ctx.font = '500 11px "Montserrat", sans-serif';
      ctx.fillText('Scan to Verify Certificate', qX + qS/2, qY + qS + 20);
      ctx.fillStyle = GOLD; ctx.font = '600 12px "Montserrat", sans-serif';
      ctx.fillText(`Certificate No. : ${cert.certNumber}`, qX + qS/2, qY + qS + 38);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 19. SIGNATURE BLOCK — bottom right (FIXED — always Nikhil Kumar)
    //     Signature drawn in Alex Brush (cursive/handwritten style)
    // ═══════════════════════════════════════════════════════════════════════
    {
      const sigCX = W - 255;   // signature block centre x

      // ── Handwritten signature in Alex Brush (italic cursive)
      ctx.textAlign = 'center';
      ctx.fillStyle = BLACK;
      ctx.font = 'italic 60px "Alex Brush", cursive';
      ctx.fillText('Nikhil Kumar', sigCX, 928);

      // ── Signature underline
      ctx.strokeStyle = ga(0.38); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(sigCX - 128, 943); ctx.lineTo(sigCX + 128, 943); ctx.stroke();

      // ── Printed name (bold, below underline)
      ctx.fillStyle = BLACK;
      ctx.font = '700 15px "Montserrat", sans-serif';
      ctx.fillText('Nikhil Kumar', sigCX, 968);

      // ── Role
      ctx.fillStyle = LGREY;
      ctx.font = '400 12.5px "Montserrat", sans-serif';
      ctx.fillText('CEO & Founder', sigCX, 988);

      // ── Company name (bold)
      ctx.fillStyle = BLACK;
      ctx.font = '700 13px "Montserrat", sans-serif';
      ctx.fillText('Tech IoT Warriors', sigCX, 1008);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 20. COMPLETION DATE — bottom centre (DYNAMIC)
    // ═══════════════════════════════════════════════════════════════════════
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

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `TechIoTWarriors_Certificate_${studentName.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;
    setHasSearched(true);
    setVerificationResult(verifyCertificate(verifyInput.trim()));
  };

  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className="container">
        <div className={styles.header}>
          <span className="section-badge">Accredited Credentials</span>
          <h1 className={styles.title}>IoT Certificate <span className="text-gradient">Portal</span></h1>
          <p className={styles.subtitle}>
            Complete your competence passing test to generate your official developer credential, or instantly verify issued serial numbers.
          </p>
        </div>

        <div className={styles.tabButtonsRow}>
          <button onClick={() => setActiveTab('generate')} className={`${styles.tabBtn} ${activeTab==='generate' ? styles.activeTab : ''}`}>
            <BookOpen size={16} /><span>Generate Certificate</span>
          </button>
          <button onClick={() => setActiveTab('verify')} className={`${styles.tabBtn} ${activeTab==='verify' ? styles.activeTab : ''}`}>
            <Shield size={16} /><span>Verify Credentials</span>
          </button>
        </div>

        <div className={styles.workspace}>
          {activeTab === 'generate' && (
            <>
              {!quizPassed ? (
                <div className={`glass-card ${styles.quizCard}`}>
                  <h2>1. Enter Verification Details</h2>
                  <form onSubmit={handleQuizSubmit} className={styles.form}>
                    <div className="form-group">
                      <label className="form-label">Student Full Name (As printed on certificate):</label>
                      <input type="text" required placeholder="Enter your full name" value={studentName}
                        onChange={e => setStudentName(e.target.value)} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Select Finished IoT Course Program:</label>
                      <select value={courseSelected} onChange={e => setCourseSelected(e.target.value)}
                        className="form-input" style={{ background: 'var(--dark-gray)', border: '1px solid rgba(255,255,255,0.08)' }}>
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
                      Answer all MCQ questions correctly (min 80%) to generate your secure certificate.
                    </p>
                    {QUESTIONS.map((q, qi) => (
                      <div key={q.id} className={styles.questionBlock}>
                        <strong>Q{qi+1}: {q.q}</strong>
                        <div className={styles.options}>
                          {q.options.map(opt => (
                            <label key={opt} className={styles.optionLabel}>
                              <input type="radio" name={`q-${q.id}`} value={opt}
                                checked={answers[q.id]===opt} onChange={() => setAnswers(p => ({...p, [q.id]: opt}))} required />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    {score !== null && score < 80 && (
                      <div className={styles.errorAlert}>Score: {score}%. You need at least 80% to pass. Please review and retry.</div>
                    )}
                    <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 24 }} disabled={submittingQuiz}>
                      {submittingQuiz ? 'Evaluating...' : 'Evaluate Quiz & Generate Certificate'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className={styles.certOutput}>
                  <div className={`glass-card ${styles.successBar}`}>
                    <div>
                      <h3>🎉 Congratulations!</h3>
                      <p>Score: {score}% · Certificate No: <strong className="text-gold">{generatedCert?.certNumber}</strong></p>
                    </div>
                    <div className={styles.certButtons}>
                      <button onClick={handleDownload} className="btn btn-primary"><Download size={16} /> Download PNG</button>
                      <button onClick={() => setQuizPassed(false)} className="btn btn-secondary">Retake Test</button>
                    </div>
                  </div>
                  <div className={styles.canvasContainer}>
                    <canvas ref={canvasRef} className={styles.canvas} />
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'verify' && (
            <div className={`glass-card ${styles.verifyCard}`}>
              <h2>Verify Issued IoT Credentials</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
                Enter the certificate serial ID (e.g. <code>TIW-2026-0001</code>) to lookup records.
              </p>
              <form onSubmit={handleVerifySearch} className={styles.verifySearchForm}>
                <div className={styles.searchRow}>
                  <input type="text" required placeholder="Enter Certificate No (e.g. TIW-2026-0001)"
                    value={verifyInput} onChange={e => setVerifyInput(e.target.value)} className={`${styles.verifyInput} form-input`} />
                  <button type="submit" className="btn btn-primary"><Search size={16} /> Verify</button>
                </div>
              </form>
              {hasSearched && (
                <div style={{ marginTop: 32 }}>
                  {verificationResult ? (
                    <div className={`glass-card ${styles.verifiedResultBox}`}>
                      <div className={styles.resultHeader}>
                        <span className={styles.checkIcon}><Check size={20} /></span>
                        <div>
                          <h3 style={{ color: '#22c55e' }}>VERIFIED SECURE CREDENTIAL</h3>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tech IoT Warriors Database Record Match</p>
                        </div>
                      </div>
                      <div className="gold-divider" style={{ margin: '16px 0' }} />
                      <div className={styles.resultDetails}>
                        {[['Student Name', verificationResult.studentName],['Course Program', verificationResult.courseName],
                          ['Completion Date', verificationResult.completionDate],['Certificate No.', verificationResult.certNumber]
                        ].map(([label, value]) => (
                          <div key={label} className={styles.detailRow}>
                            <span>{label}:</span>
                            <strong className={label === 'Certificate No.' ? 'text-gold' : ''}>{value}</strong>
                          </div>
                        ))}
                        <div className={styles.detailRow}><span>Status:</span><span className="badge badge-green">Accredited Active</span></div>
                        <div className={styles.detailRow}><span>Signatory:</span><strong>Nikhil Kumar (CEO &amp; Founder)</strong></div>
                      </div>
                    </div>
                  ) : (
                    <div className={`glass-card ${styles.unverifiedResultBox}`}>
                      <div className={styles.resultHeader}>
                        <span className={styles.crossIcon}><Alert size={20} color="#EF4444" /></span>
                        <div>
                          <h3 style={{ color: '#EF4444' }}>CREDENTIAL MATCH FAILED</h3>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No Matching Records Found</p>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 12 }}>
                        Serial number <strong>&quot;{verifyInput}&quot;</strong> not found. Contact <code>support@techiotwarriors.com</code>
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
