'use client';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Certificates.module.css';
import { getCertificates, saveCertificates, verifyCertificate, VerifiedCertificate } from '@/lib/db';
import { Shield, Zap, Lock, BookOpen, Download, Search, Check, Alert } from '@/components/ui/Icons';

export default function CertificatesPage() {
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
      // Find or create certificate record
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
        const completionDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
        
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
      
      // Allow DOM update, then draw
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

    // Dimensions
    canvas.width = 1600;
    canvas.height = 1100;

    // luxury dark background
    ctx.fillStyle = '#0B0B0B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Thick outer border (gold)
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 14;
    ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);

    // Inner thin border (gold)
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

    // Corner Ornaments
    ctx.fillStyle = '#D4AF37';
    const oSize = 90;
    const oThick = 6;
    // Top-Left
    ctx.fillRect(55, 55, oSize, oThick); ctx.fillRect(55, 55, oThick, oSize);
    // Top-Right
    ctx.fillRect(canvas.width - 55 - oSize, 55, oSize, oThick); ctx.fillRect(canvas.width - 55 - oThick, 55, oThick, oSize);
    // Bottom-Left
    ctx.fillRect(55, canvas.height - 55 - oThick, oSize, oThick); ctx.fillRect(55, canvas.height - 55 - oSize, oThick, oSize);
    // Bottom-Right
    ctx.fillRect(canvas.width - 55 - oSize, canvas.height - 55 - oThick, oSize, oThick); ctx.fillRect(canvas.width - 55 - oThick, canvas.height - 55 - oSize, oThick, oSize);

    // Header branding
    ctx.fillStyle = '#F8F7F2';
    ctx.font = 'bold 38px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TECH IOT WARRIORS', canvas.width / 2, 170);

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.fillText('P R E M I U M   I O T   L E A R N I N G   E C O S Y S T E M', canvas.width / 2, 210);

    // Certificate title
    ctx.fillStyle = '#F8F7F2';
    ctx.font = 'italic 28px "Inter", sans-serif';
    ctx.fillText('This is to certify that', canvas.width / 2, 330);

    // Student Name
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 64px "Space Grotesk", sans-serif';
    ctx.fillText(cert.studentName.toUpperCase(), canvas.width / 2, 430);

    // Core body
    ctx.fillStyle = '#CCCCCC';
    ctx.font = '22px "Inter", sans-serif';
    ctx.fillText('has successfully completed the premium theoretical and practical course program titled', canvas.width / 2, 510);

    ctx.fillStyle = '#F8F7F2';
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillText('“Tech IoT Warriors Certified IoT Developer”', canvas.width / 2, 580);

    ctx.fillStyle = '#CCCCCC';
    ctx.font = '20px "Inter", sans-serif';
    ctx.fillText(`For completing specialized training in: ${cert.courseName}`, canvas.width / 2, 640);
    ctx.fillText('Demonstrating competence in hardware circuit configuration, MCU C++ coding, and cloud database synch.', canvas.width / 2, 685);

    // Official gold seal medallion (Center bottom)
    const sealX = canvas.width / 2;
    const sealY = 830;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 65, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Spiked outer circle for seal
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 8]);
    ctx.beginPath();
    ctx.arc(sealX, sealY, 75, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 13px "Space Grotesk", sans-serif';
    ctx.fillText('OFFICIAL', sealX, sealY - 14);
    ctx.fillText('TIW SEAL', sealX, sealY + 6);
    ctx.fillText('VERIFIED', sealX, sealY + 26);

    // Signatures
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    // Left (Instructor)
    ctx.beginPath(); ctx.moveTo(220, 930); ctx.lineTo(520, 930); ctx.stroke();
    // Right (CEO Nikhil Kumar)
    ctx.beginPath(); ctx.moveTo(canvas.width - 520, 930); ctx.lineTo(canvas.width - 220, 930); ctx.stroke();

    // Drawing handwritten cursive CEO signature "Nikhil Kumar" on right
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold italic 36px "Brush Script MT", "Cursive", "Space Grotesk", sans-serif';
    ctx.fillText('Nikhil Kumar', canvas.width - 370, 890);

    // Instructor signature
    ctx.font = 'italic 28px "Brush Script MT", "Cursive", "Space Grotesk", sans-serif';
    ctx.fillText('Devendra Singh', 370, 895);

    // Signature labels
    ctx.fillStyle = '#F8F7F2';
    ctx.font = 'bold 18px "Space Grotesk", sans-serif';
    ctx.fillText('Devendra Singh', 370, 960);
    ctx.fillText('Nikhil Kumar', canvas.width - 370, 960);

    ctx.fillStyle = '#888888';
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillText('Chief IoT Instructor', 370, 985);
    ctx.fillText('CEO & Founder, Tech IoT Warriors', canvas.width - 370, 985);

    // UNIQUE CERTIFICATE NUMBER (Bottom Left - Only printed once!)
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 18px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Certificate No: ${cert.certNumber}`, 90, 1025);

    // Completion Date (Bottom Right)
    ctx.textAlign = 'right';
    ctx.fillText(`Completion Date: ${cert.completionDate}`, canvas.width - 90, 1025);

    // Draw Mock QR Code (Gold matrix box at bottom center-left for verification link)
    const qrX = 90;
    const qrY = 820;
    const qrS = 90;
    ctx.fillStyle = '#0B0B0B';
    ctx.fillRect(qrX, qrY, qrS, qrS);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.strokeRect(qrX, qrY, qrS, qrS);
    
    // Draw QR corners
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(qrX + 6, qrY + 6, 24, 24);
    ctx.fillRect(qrX + qrS - 30, qrY + 6, 24, 24);
    ctx.fillRect(qrX + 6, qrY + qrS - 30, 24, 24);
    ctx.fillStyle = '#0B0B0B';
    ctx.fillRect(qrX + 12, qrY + 12, 12, 12);
    ctx.fillRect(qrX + qrS - 24, qrY + 12, 12, 12);
    ctx.fillRect(qrX + 12, qrY + qrS - 24, 12, 12);
    
    // Draw some random code pixels
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(qrX + 36, qrY + 36, 18, 12);
    ctx.fillRect(qrX + 42, qrY + 12, 12, 18);
    ctx.fillRect(qrX + 12, qrY + 48, 18, 12);
    ctx.fillRect(qrX + 48, qrY + 60, 18, 24);
    ctx.fillRect(qrX + 66, qrY + 36, 12, 18);
    ctx.fillRect(qrX + 36, qrY + 66, 24, 12);
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
                        The certificate serial number <strong>"{verifyInput}"</strong> could not be validated in the Tech IoT Warriors register. Please check the character symbols formatting or contact administrative support at <code>support@techiotwarriors.com</code>.
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
