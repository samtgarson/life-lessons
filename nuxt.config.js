import lessons from './assets/lessons.json'

export default {
  head: {
    htmlAttrs: {
      lang: 'en'
    },
    title: 'Lessons Learning',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Sam Garson\'s lessons learning' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },
  css: ['@/assets/main.sass'],
  modules: [
    ['@nuxtjs/google-analytics', {
      id: 'UA-39309435-3'
    }]
  ],
  loading: { color: '#3B8070' },
  generate: {
    routes: lessons.map(l => l.slug)
  }
}
