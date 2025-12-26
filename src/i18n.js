import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export const loadLocaleMessages = () => {
  // Vite uses import.meta.glob instead of require.context
  const localeModules = import.meta.glob('./locales/**/*.json', { eager: true })

  const messages = {}

  for (const path in localeModules) {
    const matched = path.match(/([A-Za-z0-9-_]+)\.json$/i)
    
    if (matched && matched.length > 1) {
      const locale = matched[1]
      // Vite glob returns the module, extract default export or the module itself
      const module = localeModules[path]
      messages[locale] = module.default || module
    }
  }

  return messages
}

export default new VueI18n({
  locale: localStorage.lang || 'en-US',
  fallbackLocale: 'en-US',
  messages: loadLocaleMessages()
})
