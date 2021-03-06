// const webpack = require('webpack')
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'e-Akun',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'nuxt vuex featherjs e-akun' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: false,
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  router: {
    middleware: 'auth'
  },
  plugins: [
    { src: '~/plugins/vuetify', ssr: true },
    { src: '~/plugins/vue-validate', ssr: true }
  ],
  env: {
    APP_NAME: process.env.APP_NAME || 'e-Akun',
    ID_APP: process.env.ID_APP || '5a4b20a2cbf7231cdf7e909b',
    HOST_URL_SSO: process.env.HOST_URL_SSO || 'http://localhost:3000',
    HOST_URL_EPRESENSI: process.env.HOST_URL_EPRESENSI || 'http://localhost:8081',
    HOST_URL_API_SSO: process.env.HOST_URL_API_SSO || 'http://purbalinggakab.go.id:3030'
  }
}
