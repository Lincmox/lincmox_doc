import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Installation',
    link: '/docs/get-started/installation',
    description: (
      <>
        Get started with Lincmox on your LincStation N1 running Proxmox VE.
      </>
    ),
  },
  {
    title: 'Command Line Interface',
    link: '/docs/documentation/command-line-interface',
    description: (
      <>
        Control LEDs and monitor system status from the command line.
      </>
    ),
  },
  {
    title: 'Upgrading',
    link: '/docs/get-started/upgrading',
    description: (
      <>
        Keep your Lincmox installation up to date.
      </>
    ),
  },
  {
    title: 'Simulation',
    link: '/docs/documentation/simulation',
    description: (
      <>
        Test Lincmox without hardware using simulation mode.
      </>
    ),
  },
];

function Feature({title, link, description}) {
  return (
    <div className={clsx('col col--6')}>
      <Link to={link} className={styles.featureCard}>
        <div className="text--center padding-horiz--md">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
