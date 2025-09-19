import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Pujianto DEV",
  description: "Kumpulan ide project dan catatan saat gabut menulis kode",
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/pujiantodev.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Daftar Blog', link: '/blog/2024-03-deploy-laravel' }
    ],

    sidebar: {
      '/blog/': [
        {
          text: 'Daftar Blog',
          items: sidebarBlog()
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pujiantodev/pujianto.dev' }
    ],
    search: {
      provider: 'local'
    },
  }
})

function sidebarBlog() {
  return [
    {
      text: 'Daftar Dev Tools',
      link: '/blog/2025-09-dev-tools'
    },
    {
      text: 'Deploy Laravel',
      link: '/blog/2024-03-deploy-laravel'
    },
    {
      text: 'Helper Generate Code',
      link: '/blog/2024-03-helper-generate-code'
    },
    {
      text: 'Auto Deploy Laravel via GitHub Actions (Tanpa Docker)',
      link: '/blog/2025-06-auto-deploy-laravel-via-github-actions-tanpa-docker'
    },
    {
      text: 'Ekspor CSV Jutaan Data di Laravel Tanpa Library Eksternal (Hemat RAM & Otomatis Upload ke S3)',
      link: '/blog/2025-06-ekspor-csv-jutaan-data-di-laravel-tanpa-laravel-excel-hemat-ram-otomatis-upload-ke-s3'
    },
  ]
}