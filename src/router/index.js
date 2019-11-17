import Vue from 'vue'
import Router from 'vue-router'
import Konsult from '@/components/konsultHem'
import Profil from '@/components/profil'
import Share from '@/components/share'
import Values from '@/components/values'
import Login from '@/components/login'
import Loading from '@/components/loading'
import Test from '@/components/test'
import Ads from '@/components/ads'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/hem', name: 'KonsultHem', component: Konsult, beforeEnter: AuthGuard },
    { path: '/profil', name: 'Profil', component: Profil, beforeEnter: AuthGuard },
    { path: '/share', name: 'Share', component: Share, beforeEnter: AuthGuard },
    { path: '/inspiration', name: 'Bara value', component: Values, beforeEnter: AuthGuard },
    { path: '/login', name: 'Login', component: Login },
    { path: '/', name: 'Loading', component: Loading, beforeEnter: AuthGuard },
    { path: '/ads', name: 'Annonser', component: Ads, beforeEnter: AuthGuard },
    { path: '/test', name: 'Test', component: Test, beforeEnter: AuthGuard }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
