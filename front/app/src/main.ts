import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import 'vuetify/styles'
import VueCropper from 'vue-cropper'; 
import 'vue-cropper/dist/index.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App).use(vuetify).use(VueCropper).use(store).use(router)

app.config.globalProperties.$store=store

app.mount('#app')