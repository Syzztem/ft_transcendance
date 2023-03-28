import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '@/store'
import Game from '@/views/Game.vue'
import Hub from '@/views/Hub.vue'
import Chat from '@/views/Chat.vue'
import Home from '@/views/Home.vue'
import Options from '@/views/Options.vue'
import ChangeUsername from '@/views/ChangeUsername.vue'
import ChangeAvatar from '@/views/ChangeAvatar.vue'
import TwoFactor from '@/views/TwoFactor.vue'
import Hall from '@/views/Hall.vue'
import Login from '@/views/Login.vue'
import Profil from '@/views/Profil.vue'
import FirstConnection from '@/views/FirstConnection.vue'
import twofa from '@/views/2fa.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/userinfos',
    component: FirstConnection
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/profil/:id',
    component: Profil
  },
  {
    name: 'game',
    path: '/game/:id',
    component: Game
  },
  {
    path: '/hub',
    component: Hub
  },
  {
    path: '/chat',
    component: Chat
  },
  {
    path: '/hall',
    component: Hall
  },
  {
    path: '/options',
    component: Options
  },
  {
    path: '/username',
    component: ChangeUsername
  },
  {
    path: '/avatar',
    component: ChangeAvatar
  },
  {
    path: '/twofactor',
    component: TwoFactor
  },
  {
    path: '/2fa',
    component: twofa
  },
  {
    path: '/',
    component: Home
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  await store.dispatch('isLogin')
  .then((res: any) => {}
  , (error: any) => {
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    return next('/login')
  })
  await store.dispatch('getUserInfos')
  if (!store.state.isLogin) {
    if (to.path === '/login') {
      return next();
    } else {
      return next('/login');
    }
  }
  if (store.state.userInfos.isotp && !store.state.twoFactorAuthenticated) {
    if (to.path === '/2fa') {
      return next();
    } else {
      return next('/2fa');
    }
  }
  if (!store.state.userInfos.username) {
    if (to.path === '/userInfos') {
      return next();
    } else {
      return next('/userInfos');
    }
  }
  if (to.path === '/login' || to.path === '/2fa' || to.path === '/userInfos') {
    return next('/');
  } else {
    return next();
  }
});

export default router
