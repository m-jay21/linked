import Vue from 'vue'
import store from '@/store'
import {Translations} from '@/translation'


import App from './App.vue'
import router from './router/index.js'
import '@/assets/css/tailwind.css'
import i18n from './i18n.js'

// Use global require (available in Electron renderer with nodeIntegration: true)
if (typeof require !== 'undefined') {
  const Storage = require('electron-store')
  window.mainStorage = new Storage({
    watch: true,
    defaults: {}
  })
} else if (window.require) {
  const Storage = window.require('electron-store')
  window.mainStorage = new Storage({
    watch: true,
    defaults: {}
  })
}

Vue.config.productionTip = false
Vue.use(Translations)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
