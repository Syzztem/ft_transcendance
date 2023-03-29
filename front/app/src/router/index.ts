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
import PublicProfile from '@/views/PublicProfile.vue'

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
    path: '/profile/:id',
    component: PublicProfile,
    props: route => {
      const idParam = route.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      return { id: parseInt(id) };
    }
  },
  {
    path: '/',
    component: Home
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  try {
    await store.dispatch('isLogin');
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    return next('/login');
  }
  await store.dispatch('getUserInfos');
  if (!store.state.isLogin) {
    return to.path === '/login' ? next() : next('/login');
  }
  if (store.state.userInfos.isotp && !store.state.twoFactorAuthenticated) {
    return to.path === '/2fa' ? next() : next('/2fa');
  }

  if (!store.state.userInfos.username) {
    return to.path === '/userInfos' ? next() : next('/userInfos');
  }

  if (to.path === '/login' || to.path === '/2fa' || to.path === '/userInfos') {
    return next('/');
  } else {
    return next();
  }
});

export default router