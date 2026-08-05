/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['introduction/introduction', 'introduction/lincplus-lincstation-n1', 'introduction/proxmox-ve'],
    },
    {
      type: 'category',
      label: 'Get Started',
      items: ['get-started/installation', 'get-started/upgrading'],
    },
    {
      type: 'category',
      label: 'Documentation',
      items: [
        'documentation/command-line-interface',
        'documentation/daemon',
        'documentation/graphical-user-interface',
        'documentation/simulation',
      ],
    },
    {
      type: 'category',
      label: 'GitHub',
      items: ['github/repositories'],
    },
    {
      type: 'category',
      label: 'Changelog',
      items: ['changelog/changelog/package'],
    },
  ],
};

export default sidebars;
