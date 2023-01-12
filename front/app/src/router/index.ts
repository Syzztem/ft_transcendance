import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Game from '../views/Game.vue'
import Hub from '../views/Hub.vue'
import Chat from '../views/Chat.vue'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/game',
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
    path: '/',
    component: Home
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
