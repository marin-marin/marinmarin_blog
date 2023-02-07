/**
 * @type {import('vitepress').UserConfig}
 */

import { defineConfig } from 'vitepress'

const sidebar = {
  '/': [
    {
      text: 'Home',
      items: [
        {
          text: 'Intro',
          link: '/'
        },
        {
          text: '2023',
          items: [
            { text: 'Vue3渲染源码分析', link: '/2023/Vue3渲染源码分析' },
            { text: 'Docker学习', link: '/2023/Docker学习' },
            { text: '前端规范制定', link: '/2023/前端规范制定' },
            { text: '从StateOfJs2022了解到的js新特性', link: '/2023/从StateOfJs2022了解到的js新特性' },
          ]
        },
        {
          text: '2022',
          items: [
            { text: '公司项目复盘', link: '/2022/公司项目复盘' },
            { text: '前端错误监控解决方案', link: '/2022/前端错误监控解决方案' },
          ]
        },
        {
          text: '2021',
          items: [
            { text: '做了一个绘图批注的轮子', link: '/2021/做了一个绘图批注的轮子' },
            { text: 'Input标签中文输入法预输入问题的处理', link: '/2021/Input标签中文输入法预输入问题的处理' },
            { text: 'JS类实现私有变量的各种方法', link: '/2021/JS类实现私有变量的各种方法' },
            { text: '前端工程化的处理', link: '/2021/前端工程化的处理' },
            { text: '一个对象结构嵌套覆盖的问题', link: '/2021/一个对象结构嵌套覆盖的问题' },
            { text: '从Vue2迁移到Vue3,我需要注意什么', link: '/2021/从Vue2迁移到Vue3,我需要注意什么' },
          ]
        },
        {
          text: '2020',
          items: [
            { text: 'Intersection Observer API', link: '/2020/Intersection Observer API' },
            { text: '在_textarea_中HighLight文字吧', link: '/2020/在_textarea_中HighLight文字吧' },
            { text: 'Nuxt.js 踩坑记录', link: '/2020/Nuxt.js 踩坑记录' },
            { text: '搞了个接头霸王', link: '/2020/搞了个接头霸王' },
            { text: '逮住Dropdown的尾巴', link: '/2020/逮住Dropdown的尾巴' },
            { text: '常见的数据结构(三)', link: '/2020/常见的数据结构(三)' },
            { text: '常见的数据结构(二)', link: '/2020/常见的数据结构(二)' },
            { text: '常见的数据结构(一)', link: '/2020/常见的数据结构(一)' },
            { text: '记一次的Table动态显示的奇葩需求', link: '/2020/记一次的Table动态显示的奇葩需求' },
          ]
        },
        {
          text: '2019',
          items: [
            { text: '我的(自)闭包 (雾)', link: '/2019/闭包' },
            { text: '函数的节流和防抖', link: '/2019/函数的节流和防抖' },
            { text: 'Vue事件传递', link: '/2019/Vue事件传递' },
            { text: '一些问题', link: '/2019/一些问题' },
            { text: '早期笔记', link: '/2019/早期笔记' },
          ]
        },
      ]
    }
  ]
}

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
  themeConfig: {
    sidebar
  }
})
