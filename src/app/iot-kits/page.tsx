'use client';
import Link from 'next/link';
import styles from './IoTKits.module.css';
import { Box, Rocket, Zap } from '@/components/ui/Icons';

interface Kit {
  title: string;
  price: string;
  originalPrice: string;
  compatibility: string;
  items: string[];
  description: string;
  icon: string;
}

const KITS: Kit[] = [
  {
    title: 'Warriors Ultimate IoT Starter Kit',
    price: '₹2,499',
    originalPrice: '₹4,999',
    compatibility: 'Compatible with Electronics Basics, Arduino, & ESP8266 Modules.',
    items: [
      'Arduino Uno R3 Compatible Board',
      'ESP8266 NodeMCU V3 Controller',
      'DHT11 Temperature & Humidity Sensor',
      'Active Buzzer & 5V 1-Channel Relay Module',
      'SG90 Micro Servo Motor 180°',
      'Breadboard, 40x Jumper Wires (M-M, M-F), 10x Resistors'
    ],
    description: 'The complete starter kit containing every discrete sensor and microcontroller to build all beginner weather logging and smart home nodes.',
    icon: 'box'
  },
  {
    title: 'ESP32 Cam Smart Vision Advanced Kit',
    price: '₹3,299',
    originalPrice: '₹6,499',
    compatibility: 'Compatible with ESP32 Advanced & Capstone Project Modules.',
    items: [
      'ESP32 DevKit V1 Board with Dual Core',
      'ESP32-CAM Board with OV2640 Lens Module',
      'RC522 RFID Card & Keyfob Sensor',
      'Solonoid DC 12V Door Lock Driver',
      'High-Speed MicroSD 16GB Memory Card',
      'Gas Sensor MQ135, Ultrasonic Ranging module'
    ],
    description: 'Gear up for security, computer vision, local facial recognition databases, and dual core MQTT configurations.',
    icon: 'rocket'
  }
];

const KitIcon = ({ type, size = 36 }: { type: string; size?: number }) => {
  switch (type) {
    case 'rocket': return <Rocket size={size} color="var(--matte-gold)" />;
    case 'box':
    default: return <Box size={size} color="var(--matte-gold)" />;
  }
};

export default function IoTKitsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-badge">Hardware Gear</span>
          <h1 className={styles.title}>Official IoT <span className="text-gradient">Hardware Kits</span></h1>
          <p className={styles.subtitle}>
            Order high-quality, pre-tested microcontrollers and sensors delivered straight to your door across India.
          </p>
        </div>

        {/* Kits list */}
        <div className={styles.grid}>
          {KITS.map((kit, i) => (
            <div key={i} className={`glass-card ${styles.card}`}>
              <div className={styles.top}>
                <span className={styles.icon}>
                  <KitIcon type={kit.icon} />
                </span>
                <div className={styles.titles}>
                  <h3 className={styles.cardTitle}>{kit.title}</h3>
                  <span className={styles.compatibility}>{kit.compatibility}</span>
                </div>
              </div>

              <div className="gold-divider" style={{ margin: '20px 0' }} />

              <div className={styles.body}>
                <p className={styles.desc}>{kit.description}</p>
                <h4 className={styles.itemsTitle} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Box size={18} color="var(--matte-gold)" />
                  <span>Included in the Box:</span>
                </h4>
                <ul className={styles.list}>
                  {kit.items.map((item, idx) => (
                    <li key={idx} className={styles.listItem}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="gold-divider" style={{ margin: '20px 0' }} />

              <div className={styles.footer}>
                <div className={styles.pricing}>
                  <span className={styles.price}>{kit.price}</span>
                  <span className={styles.originalPrice}>{kit.originalPrice}</span>
                  <span className={styles.shipping}>Free Shipping across India</span>
                </div>
                <Link href={`/payment?kit=${i === 0 ? 'ultimate' : 'advanced'}`} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Order Kit Now <Zap size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
