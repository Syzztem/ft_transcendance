import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Game from './components/Game.vue'
import Chat from './components/Chat.vue'
import Hub from './components/Hub.vue'


export default createRouter({
    history: createWebHistory(),
    routes: [
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
    ]
})