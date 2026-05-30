'use client';
import { useState, useRef } from 'react';
import styles from './Certificates.module.css';

export default function CertificatesPage() {
  const [studentName, setStudentName] = useState('');
  const [courseSelected, setCourseSelected] = useState('Beginner IoT Mastery Bootcamp');
  const [quizPassed, setQuizPassed] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple MCQ Quiz
  const [answers, setAnswers] = useState<Record<number, string>>({});
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
      setQuizPassed(true);
      // Wait for React to render canvas, then draw
      setTimeout(drawCertificate, 100);
    } else {
      setQuizPassed(false);
    }
    setSubmittingQuiz(false);
  };

  const drawCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions for high-res horizontal certificate
    canvas.width = 1600;
    canvas.height = 1100;

    // Background Layer
    ctx.fillStyle = '#0B0B0B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Premium Border Lines (Gold Theme)
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90);

    // Corner Ornaments
    ctx.fillStyle = '#D4AF37';
    // Top Left
    ctx.fillRect(45, 45, 80, 8);
    ctx.fillRect(45, 45, 8, 80);
    // Top Right
    ctx.fillRect(canvas.width - 125, 45, 80, 8);
    ctx.fillRect(canvas.width - 53, 45, 8, 80);
    // Bottom Left
    ctx.fillRect(45, canvas.height - 53, 80, 8);
    ctx.fillRect(45, canvas.height - 125, 8, 80);
    // Bottom Right
    ctx.fillRect(canvas.width - 125, canvas.height - 53, 80, 8);
    ctx.fillRect(canvas.width - 53, canvas.height - 125, 8, 80);

    // Tech IoT Warriors Logo / Header
    ctx.fillStyle = '#F8F7F2';
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ TECH IOT WARRIORS', canvas.width / 2, 160);

    ctx.fillStyle = '#D4AF37';
    ctx.font = '18px "Inter", sans-serif';
    ctx.fillText('P R E M I U M   I O T   L E A R N I N G   E C O S Y S T E M', canvas.width / 2, 200);

    // Certificate Title
    ctx.fillStyle = '#F8F7F2';
    ctx.font = 'italic 28px "Inter", sans-serif';
    ctx.fillText('This is to certify that', canvas.width / 2, 320);

    // Student Name
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 64px "Space Grotesk", sans-serif';
    ctx.fillText(studentName.toUpperCase(), canvas.width / 2, 420);

    // Text Body
    ctx.fillStyle = '#CCCCCC';
    ctx.font = '22px "Inter", sans-serif';
    ctx.fillText('has successfully completed the premium theoretical and practical course program titled', canvas.width / 2, 500);

    ctx.fillStyle = '#F8F7F2';
    ctx.font = 'bold 32px "Space Grotesk", sans-serif';
    ctx.fillText(courseSelected, canvas.width / 2, 570);

    ctx.fillStyle = '#CCCCCC';
    ctx.font = '20px "Inter", sans-serif';
    ctx.fillText('and has verified their engineering competence in hardware circuits configuration, microcontroller C++ coding,', canvas.width / 2, 630);
    ctx.fillText('and cloud database synchronization. Verified via certificate module assessment testing.', canvas.width / 2, 670);

    // Gold Ribbon Medallion Visual
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 820, 60, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 16px "Space Grotesk", sans-serif';
    ctx.fillText('VERIFIED', canvas.width / 2, 815);
    ctx.fillText('DEVELOPER', canvas.width / 2, 835);

    // Signatures
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    // Left Sign Line
    ctx.beginPath();
    ctx.moveTo(250, 900);
    ctx.lineTo(550, 900);
    ctx.stroke();
    // Right Sign Line
    ctx.beginPath();
    ctx.moveTo(canvas.width - 550, 900);
    ctx.lineTo(canvas.width - 250, 900);
    ctx.stroke();

    ctx.fillStyle = '#F8F7F2';
    ctx.font = 'bold 20px "Space Grotesk", sans-serif';
    ctx.fillText('Devendra Singh', 400, 930);
    ctx.fillText('Amit Sharma', canvas.width - 400, 930);

    ctx.fillStyle = '#888888';
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillText('Chief IoT Instructor', 400, 955);
    ctx.fillText('Platform Moderator', canvas.width - 400, 955);
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

  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-badge">Accredited Credentials</span>
          <h1 className={styles.title}>IoT Certificate <span className="text-gradient">Portal</span></h1>
          <p className={styles.subtitle}>
            Enter your details, complete the passing assessment, and unlock your official certified hardware credentials.
          </p>
        </div>

        <div className={styles.workspace}>
          {/* Form & Quiz Panel */}
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
                    ⚠️ Score: {score}%. You need at least 80% to pass. Please review answers and try again.
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 24 }} disabled={submittingQuiz}>
                  {submittingQuiz ? 'Evaluating Test...' : 'Evaluate Quiz & Generate Certificate 🏆'}
                </button>
              </form>
            </div>
          ) : (
            <div className={styles.certOutput}>
              <div className={`glass-card ${styles.successBar}`}>
                <div>
                  <h3>🎉 Assessment Congratulations!</h3>
                  <p>You scored {score}%. Your certificate is ready to download.</p>
                </div>
                <div className={styles.certButtons}>
                  <button onClick={handleDownload} className="btn btn-primary">
                    Download Certificate PNG ⬇️
                  </button>
                  <button onClick={() => setQuizPassed(false)} className="btn btn-secondary">
                    Retake Quiz 🔁
                  </button>
                </div>
              </div>

              {/* Certificate Canvas Area */}
              <div className={styles.canvasContainer}>
                <canvas ref={canvasRef} className={styles.canvas} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
