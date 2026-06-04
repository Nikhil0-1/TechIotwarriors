'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjects, Project } from '@/lib/db';
import styles from './ProjectDetailsPage.module.css';
import { Wrench, Plug, Alert, Code, Copy, Download, Award, Zap } from '@/components/ui/Icons';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('code');

  useEffect(() => {
    const list = getProjects();
    const found = list.find(p => p.id === params.id);
    setProject(found || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '100px 0' }}>
        <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>Loading Build Details...</p>
      </div>
    );
  }

  if (!project) {
    notFound();
    return null;
  }

  const SAMPLE_CODE = `/*
 * Tech IoT Warriors - ${project.title}
 * Setup guide: Wire components according to schematic.
 */
#include <WiFi.h>
#include <WiFiClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT); // Builtin LED
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected!");
  digitalWrite(2, HIGH); // Confirm connection
}

void loop() {
  // Read sensor pins and transmit payload to dashboard
  delay(2000);
}`;

  const VIVA_QUESTIONS = [
    { q: 'Why is ESP32 preferred over Arduino Uno for IoT applications?', a: 'ESP32 has built-in WiFi and Bluetooth, a dual-core 240MHz processor, and more SRAM, whereas Arduino Uno has no network transceivers and runs on an 8-bit 16MHz MCU.' },
    { q: 'What is the purpose of the Deep Sleep modes on these microcontrollers?', a: 'Deep sleep disables the CPU, RAM, and WiFi radio, keeping only the RTC running. This drops current draw to micro-amperes, enabling battery-operated IoT nodes to run for years.' },
    { q: 'How do you prevent floating values on digital inputs?', a: 'By implementing internal or external Pull-up or Pull-down resistors, ensuring the micro-controller pin reads a constant logic HIGH or LOW when the sensor switch is open.' }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(SAMPLE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className="container">
        {/* Breadcrumb / Back button */}
        <div style={{ marginBottom: 24 }}>
          <Link href="/projects" className={styles.backBtn}>
            ← Back to Project Showcases
          </Link>
        </div>

        {/* Intro Grid */}
        <div className={styles.header}>
          <div>
            <span className="tag">{project.category}</span>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.desc}>{project.desc}</p>
          </div>
          <div className={styles.headerMeta}>
            <div className={`glass-card ${styles.complexityBox}`}>
              <span>Complexity Level</span>
              <h3>{project.complexity}</h3>
            </div>
          </div>
        </div>

        {/* Video Tutorial Slot */}
        <div className={styles.videoPlayer}>
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Video Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.iframe}
          />
        </div>

        <div className={styles.mainGrid}>
          {/* Left Main column */}
          <div className={styles.contentCol}>
            {/* Components Required */}
            <div className={`glass-card ${styles.card}`}>
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={20} color="var(--matte-gold)" />
                <span>Components Required</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Collect the following hardware components before wiring:</p>
              <ul className={styles.compList}>
                {project.components.map((c, i) => (
                  <li key={i} className={styles.compItem}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Wrench size={14} color="var(--text-muted)" />
                      <span>{c}</span>
                    </span>
                    <span className="badge badge-gold">x1 Unit</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Circuit Diagram & Wiring Guide */}
            <div className={`glass-card ${styles.card}`}>
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Plug size={20} color="var(--matte-gold)" />
                <span>Connection Wiring Schematic</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Follow this pins setup table carefully. Incorrect wiring may damage modules.</p>
              
              {/* Connection Table */}
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Module Component Pin</th>
                      <th>MCU Board Pin Connection</th>
                      <th>Wire Connection Type</th>
                      <th>Voltage Supply Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>VCC (Power Pin)</td>
                      <td>3.3V or 5V Pin</td>
                      <td>Male to Female Jumper</td>
                      <td>VCC Input</td>
                    </tr>
                    <tr>
                      <td>GND (Ground Pin)</td>
                      <td>GND Pin</td>
                      <td>Male to Female Jumper</td>
                      <td>0V Ground Reference</td>
                    </tr>
                    <tr>
                      <td>TX / Signal Out</td>
                      <td>GPIO 4 / RX2 Pin</td>
                      <td>Male to Female Jumper</td>
                      <td>UART Serial Rx</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={styles.wiringAlert} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Alert size={16} color="#EF4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong>Warning:</strong> Always disconnect your USB cable from your laptop before plugging wire jumpers. Check that the ESP32 logic level input does not exceed 3.3V.
                </div>
              </div>
            </div>

            {/* Code Tabs & Source Editor */}
            <div className={`glass-card ${styles.card}`}>
              <div className={styles.codeHeader}>
                <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Code size={20} color="var(--matte-gold)" />
                  <span>Tested Source Code</span>
                </h3>
                <div className={styles.codeButtons} style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleCopy} className="btn btn-outline-gold btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Copy size={14} />
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(SAMPLE_CODE)}`} download="sketch.ino" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Download size={14} />
                    <span>Download INO</span>
                  </a>
                </div>
              </div>
              
              <div className={styles.editor}>
                <pre>
                  <code>{SAMPLE_CODE}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Right sidebar column */}
          <div className={styles.sidebarCol}>
            {/* Simulation Tab */}
            <div className={`glass-card ${styles.card}`}>
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Code size={20} color="var(--matte-gold)" />
                <span>Circuit Virtual Simulation</span>
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                Test the circuit logic and view debug codes digitally on our simulator before assembling real boards.
              </p>
              <button className="btn btn-primary btn-sm w-full" style={{ justifyContent: 'center' }}>
                Launch Tinkercad Model
              </button>
            </div>

            {/* Viva Prep */}
            <div className={`glass-card ${styles.card}`}>
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="var(--matte-gold)" />
                <span>Interview / Viva Questions</span>
              </h3>
              <div className={styles.vivaList}>
                {VIVA_QUESTIONS.map((v, i) => (
                  <div key={i} className={styles.vivaItem}>
                    <strong>Q{i+1}: {v.q}</strong>
                    <p>{v.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Troubleshooting Guide */}
            <div className={`glass-card ${styles.card} ${styles.troubleCard}`}>
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={20} color="var(--matte-gold)" />
                <span>Troubleshooting &amp; Diagnostics</span>
              </h3>
              <ul className={styles.troubleList}>
                <li>
                  <strong>Problem: COM Port not detected</strong>
                  <p>Solution: Install CP210x or CH340 USB-to-UART drivers on Windows. Use a high-quality USB data cable.</p>
                </li>
                <li>
                  <strong>Problem: Failed to connect to ESP32: Timed out waiting for packet header</strong>
                  <p>Solution: Hold the physical "BOOT" button on the ESP32 board while the Arduino IDE compiles and shows "Connecting...".</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
