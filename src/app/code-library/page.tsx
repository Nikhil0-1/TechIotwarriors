'use client';
import { useState } from 'react';
import styles from './CodeLibrary.module.css';

interface CodeSnippet {
  title: string;
  category: string;
  explanation: string;
  errorSolution: string;
  code: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    title: 'Non-Blocking Blink Code using millis()',
    category: 'LED Blink',
    explanation: 'Avoids using delay() which pauses execution of the microcontroller CPU. Uses millis() to compare current time elapsed with a previous timestamp, allowing multi-tasking.',
    errorSolution: 'If LED is constantly on, make sure interval variable has an appropriate millisecond value (e.g., 1000). Check logic condition parameters.',
    code: `unsigned long prevMillis = 0;
const long interval = 1000;
int ledState = LOW;

void setup() {
  pinMode(2, OUTPUT);
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - prevMillis >= interval) {
    prevMillis = currentMillis;
    ledState = (ledState == LOW) ? HIGH : LOW;
    digitalWrite(2, ledState);
  }
}`
  },
  {
    title: 'Analog Sensor Reading with Rolling Average Filter',
    category: 'Sensor Code',
    explanation: 'Smooths out electric interference in analog values (like gas levels, light levels) by storing last 10 readings and calculating their mathematical mean average.',
    errorSolution: 'If readings return zero, make sure analog pin designation aligns with MCU hardware (e.g. A0 on Arduino, GPIO 34 on ESP32).',
    code: `const int numReadings = 10;
int readings[numReadings];
int readIndex = 0;
int total = 0;
int average = 0;

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < numReadings; i++) readings[i] = 0;
}

void loop() {
  total = total - readings[readIndex];
  readings[readIndex] = analogRead(34); // ESP32 Analog Pin
  total = total + readings[readIndex];
  readIndex = (readIndex + 1) % numReadings;
  average = total / numReadings;
  Serial.println(average);
  delay(100);
}`
  },
  {
    title: 'Secure WiFi Auto-Reconnect Setup',
    category: 'WiFi Connection',
    explanation: 'Connects to local WiFi. Checks WiFi.status() in loop and auto-triggers reconnect procedures if router socket drops connection.',
    errorSolution: 'Check SSID characters and password. In multi-band routers, make sure you connect to 2.4GHz band as most MCUs do not support 5GHz.',
    code: `#include <WiFi.h>
const char* ssid = "MyNetwork";
const char* pass = "MyPassword123";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected!");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connection Lost! Reconnecting...");
    WiFi.disconnect();
    WiFi.reconnect();
    delay(5000);
  }
}`
  },
  {
    title: 'Sync Sensor Payload data to Google Firebase',
    category: 'Firebase',
    explanation: 'Pushes JSON strings containing humidity and temperature values directly to Firebase Realtime Database using REST API library.',
    errorSolution: 'Verify Firebase host link URL (must end with firebasedatabase.app) and auth database secret token.',
    code: `#include <WiFi.h>
#include <FirebaseESP32.h>

FirebaseData fbData;
FirebaseConfig config;
FirebaseAuth auth;

void setup() {
  Serial.begin(115200);
  config.host = "PROJECT_ID.firebaseio.com";
  config.signer.tokens.legacy_token = "AUTH_KEY";
  Firebase.begin(&config, &auth);
}

void loop() {
  float temp = 24.5;
  if (Firebase.setFloat(fbData, "/sensors/temperature", temp)) {
    Serial.println("Data Synced to Firebase! ✅");
  } else {
    Serial.println(fbData.errorReason());
  }
  delay(5000);
}`
  }
];

export default function CodeLibraryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const categories = ['All', 'LED Blink', 'Sensor Code', 'WiFi Connection', 'Firebase'];

  const filtered = SNIPPETS.filter(s => {
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
            <span className={styles.searchIcon}>🔍</span>
          </div>
        </div>

        {/* Code Grid */}
        <div className={styles.grid}>
          {filtered.map((s, i) => (
            <div key={i} className={`glass-card ${styles.card}`}>
              <div className={styles.cardHeader}>
                <span className="tag">{s.category}</span>
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <div className={styles.actions}>
                  <button onClick={() => handleCopy(s.code, i)} className="btn btn-outline-gold btn-sm">
                    {copiedIdx === i ? 'Copied! ✅' : 'Copy 📋'}
                  </button>
                  <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(s.code)}`} download="code.ino" className="btn btn-primary btn-sm">
                    Download ⬇️
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
                  <strong>📖 Code Logic Explanation:</strong>
                  <p>{s.explanation}</p>
                </div>
                
                <div className={styles.detailBlock} style={{ marginTop: 12 }}>
                  <strong>🔧 Common Compilation Errors &amp; Fixes:</strong>
                  <p>{s.errorSolution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
