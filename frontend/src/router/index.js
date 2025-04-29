import { createRouter, createWebHistory } from 'vue-router'
import EditView from '../views/EditView.vue'
import PresentView from '../views/PresentView.vue'
import AudienceView from '../views/AudienceView.vue'
import i18n from '../i18n'
import { supportedLocales, defaultLocale } from '../i18n'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:locale?/edit',
      name: 'edit',
      component: EditView,
      props: true
    },
    {
      path: '/:locale?/present',
      name: 'present',
      component: PresentView,
      props: true
    },
    {
      path: '/:locale?/audience',
      name: 'audience',
      component: AudienceView,
      props: true
    },
    {
      path: '/',
      redirect: () => {
        return { path: `/${i18n.global.locale.value}/edit` }
      }
    }
  ]
})

// Navigation guard to check for language changes
router.beforeEach((to, from, next) => {
  // Get locale from route params or use default
  const locale = to.params.locale || defaultLocale
  
  // If locale is not supported, redirect to default locale
  if (!supportedLocales.includes(locale)) {
    return next(`/${defaultLocale}${to.path}`)
  }
  
  // Set i18n language
  i18n.global.locale.value = locale
  
  // Continue navigation
  return next()
})

export default router 