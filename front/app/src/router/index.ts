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

import TestWebsocket from '@/views/TestWebsocket.vue'


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
    path: '/',
    component: Home
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  store.dispatch('isLogin')
  if (authRequired && !store.state.isLogin) {
    return next('/login');
  }

  next();
})

export default router
