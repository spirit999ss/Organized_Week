import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Organized Week Docs',
  tagline: 'Documentación oficial de Organized Week',
  url: 'https://organized-week.vercel.app',
  baseUrl: '/',
  organizationName: 'spirit999ss',
  projectName: 'Organized_Week',
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
    },
    navbar: {
      title: 'Organized Week',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentación',
        },
        {
          href: 'https://github.com/spirit999ss/Organized_Week',
          label: 'Código fuente',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentación',
          items: [{label: 'Introducción', to: '/docs/intro'}],
        },
        {
          title: 'Proyecto',
          items: [
            {
              label: 'Repositorio',
              href: 'https://github.com/spirit999ss/Organized_Week',
            },
          ],
        },
      ],
      copyright: `Organized Week · ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
