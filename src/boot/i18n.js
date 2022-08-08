import VueI18n from 'vue-i18n'
import messages from 'src/i18n'

const i18n = new VueI18n({
  locale: 'es-us',
  fallbackLocale: 'es-us',
  messages
})

export default ({ Vue, app }) => {
  // Set i18n instance on app
  Vue.use(VueI18n)
  app.i18n = i18n
}

export { i18n }
