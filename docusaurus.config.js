// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Lincmox',
  tagline: 'Control LincPlus LincStation N1 LEDs with Proxmox VE',
  url: 'https://doc.lincmox.ovh',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  favicon: 'img/favicon.svg',

  organizationName: 'Lincmox',
  projectName: 'lincmox_doc',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: ' ',
        logo: {
          alt: 'Lincmox Logo',
          src: 'img/lincmox-logo.png',
          srcDark: 'img/lincmox-logo-dark.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: '/docs/changelog/changelog/package',
            label: 'Changelog',
            position: 'left',
          },
          {
            href: 'https://github.com/Lincmox',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/',
              },
              {
                label: 'Installation',
                to: '/docs/get-started/installation',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/Lincmox',
              },
            ],
          },
        ],
        copyright: `Copyright ${new Date().getFullYear()} Lincmox. Built with Docusaurus.`,
      },
    }),
};

export default config;
