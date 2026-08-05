import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const features = [
  {
    title: 'Getting Started',
    link: '/docs/get-started/installation',
    description: 'Get started with Lincmox on your LincStation N1 running Proxmox VE.',
  },
  {
    title: 'CLI',
    link: '/docs/documentation/command-line-interface',
    description: 'Control the LEDs and monitor the system from the command line.',
  },
  {
    title: 'Upgrading',
    link: '/docs/get-started/upgrading',
    description: 'Update your Lincmox installation.',
  },
  {
    title: 'Simulation',
    link: '/docs/documentation/simulation',
    description: 'Test Lincmox without hardware using simulation mode.',
  },
];

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className={styles.featuresGrid}>
        {features.map((feature) => (
          <a key={feature.title} href={feature.link} className={styles.featureCard}>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDescription}>{feature.description}</p>
            <span className={styles.featureLink}>Learn more →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
