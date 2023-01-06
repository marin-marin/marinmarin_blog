/**
 * @type {import('vitepress').UserConfig}
 */

import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/blog/',
  title: '🎈玛丽的码厩',
  titleTemplate: 'Marin',
  description: '玛丽的码厩',
  markdown: {
    theme: 'material-palenight',
    lineNumbers: false,
  },
  head: [
    // 添加图标
    ['link', { rel: 'icon', href: '/blog/favicon.ico' }],
  ],
})
