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
import VOtpInput from "vue3-otp-input";
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.min.css'


const vuetify = createVuetify({
  components,
  directives,
  icons: {  
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  }
})

const app = createApp(App).use(vuetify).use(VueCropper).use(store).use(router)

app.config.globalProperties.$store=store

app.component('v-otp-input', VOtpInput).mount('#app')