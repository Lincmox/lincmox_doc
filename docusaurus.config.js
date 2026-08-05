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

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        searchBarPosition: "right",
      },
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-zooming',
      {
        selector: '.markdown img',
        delay: 500,
        background: {
          light: 'rgba(255, 255, 255, 0.9)',
          dark: 'rgba(30, 30, 30, 0.9)',
        },
      },
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
        links: [],
        copyright: `Copyright ${new Date().getFullYear()} Lincmox. Built with Docusaurus.`,
      },
    }),
};

export default config;
