'use client';
import { useState } from 'react';
import styles from './CircuitLibrary.module.css';
import { Search } from '@/components/ui/Icons';

interface Circuit {
  title: string;
  category: string;
  pins: string;
  working: string;
  description: string;
  visual: string;
}

const CIRCUITS: Circuit[] = [
  {
    title: 'LED Control Circuit with Current Limiting Resistor',
    category: 'LED',
    pins: 'LED Anode (+) to GPIO 2 via 220 Ohm Resistor, LED Cathode (-) to GND.',
    working: 'When the MCU GPIO goes HIGH (3.3V), current flows through the resistor and LED, illuminating it. The resistor prevents current from exceeding the 20mA LED rating.',
    description: 'The fundamental hello world circuit of hardware. Protects pins from high current burns.',
    visual: 'LED [Anode] ── [220Ω Resistor] ── GPIO 2 | LED [Cathode] ── GND'
  },
  {
    title: 'Relay Switch Control with Optocoupler Isolation',
    category: 'Relay',
    pins: 'IN to GPIO 5, VCC to 5V, GND to GND. AC load wired in series with Normally Open (NO) terminal.',
    working: 'Triggering GPIO 5 LOW lights up the internal phototransistor inside the optocoupler. This triggers the electromagnet inside the mechanical relay, snapping the metallic contact to NO to close the external circuit.',
    description: 'Safe switching circuit to control 220V AC household appliances from a low-voltage 3.3V controller.',
    visual: 'GPIO 5 ── IN [Relay Module] | 220V Phase ── COM [Relay] | NO [Relay] ── AC Bulb'
  },
  {
    title: 'I2C OLED Display Connection Guide',
    category: 'OLED',
    pins: 'VCC to 3.3V, GND to GND, SCL to GPIO 22, SDA to GPIO 21.',
    working: 'Communicates using Inter-Integrated Circuit (I2C) protocol. Serial Data (SDA) carries screen pixels byte payload, and Serial Clock (SCL) synchronizes packets transfer rate at 400kHz.',
    description: 'Clear, high-contrast monochrome screen connection for logging sensor values locally.',
    visual: 'SCL ── GPIO 22 | SDA ── GPIO 21 | VCC ── 3.3V | GND ── GND'
  },
  {
    title: 'DHT11 / DHT22 Humidity & Temp Sensor Circuit',
    category: 'Sensors',
    pins: 'VCC to 3.3V, Data pin to GPIO 4, GND to GND. Add 10k Ohm pull-up resistor from Data pin to VCC.',
    working: 'DHT sensor transmits data packets consisting of 40 bits of temperature and humidity information over a single-wire bus. A pullup resistor holds the data bus line state stable.',
    description: 'Standard circuit for weather loggers. Reliable pullup setup prevents sensor timeouts.',
    visual: 'Data ── GPIO 4 (with 10kΩ Pull-up to 3.3V VCC) | GND ── GND'
  },
  {
    title: 'SG90 Servo Motor Angle Controller',
    category: 'Motors',
    pins: 'PWM Orange Pin to GPIO 18, VCC Red to 5V (external), GND Brown to shared GND.',
    working: 'Sends a 50Hz PWM signal. Pulses between 1ms to 2ms dictate the servo position from 0 to 180 degrees. External power prevents ESP32 logic drops.',
    description: 'Precision mechanical positioning driver. Requires shared ground reference configuration.',
    visual: 'Orange PWM ── GPIO 18 | Red VCC ── 5V External | Shared GND ── GND'
  }
];

export default function CircuitLibraryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'LED', 'Relay', 'OLED', 'Sensors', 'Motors'];

  const filtered = CIRCUITS.filter(c => {
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
