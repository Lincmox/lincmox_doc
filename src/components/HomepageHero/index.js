import React from 'react';
import styles from './styles.module.css';

export default function HomepageHero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Lincmox</h1>
        <p className={styles.heroSubtitle}>
          Control the LEDs of your LincStation N1 running Proxmox VE
        </p>
      </div>
    </div>
  );
}
