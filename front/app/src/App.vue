<script lang="ts">
import Header from './components/header/Header.vue'
import Footer from './components/Footer.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    Header,
  },
  methods: {
    resize() {
      const img = document.querySelectorAll<HTMLElement>('.master')
      img.forEach((img) => {
        let pos = Math.random() * (window.innerWidth - 150)
        pos = Math.floor(pos)
        img.style.left = pos + "px"
        let dir = Math.floor(Math.random() * 2) ? true : false
        let width = Math.floor(Math.random() * 200 + 100)
        img.style.width = width + "px"
        img.style.animationDelay = Math.floor(Math.random() * 10) + "s"
        img.style.animationDuration = Math.floor(Math.random() * 5 + 3) + "s"
        img.style.filter = "blur(" + Math.pow(width / 125, 2) + "px)"
        img.style.animationTimingFunction = "linear"
        img.style.animationIterationCount = "infinite"
      })
    }
  },
  created() {
    window.addEventListener('resize', this.resize);
  },
  mounted() {
    this.resize();
  }
})
</script>

<template>
<v-container id="background" fluid>
  <v-app style="background: rgba(0,0,0,0);">
    <div style="overflow: hidden;">
      <img v-for="n in 2" :key="n" src="@/assets/pikachu.png" class="master" style=""/>
      <img v-for="n in 2" :key="n" src="@/assets/bulbizarre.png" class="master" style=""/>
      <img v-for="n in 2" :key="n" src="@/assets/evoli.png" class="master" style=""/>
      <img v-for="n in 2" :key="n" src="@/assets/miaouss.png" class="master" style=""/>
      <img v-for="n in 2" :key="n" src="@/assets/rondoudou.png" class="master" style=""/>
      <img v-for="n in 2" :key="n" src="@/assets/ronflex.png" class="master" style=""/>
      <img v-for="n in 2" :key="n" src="@/assets/salameche.png" class="master" style=""/>
      <img v-for="n in 2" :key="n" src="@/assets/carapuce.png" class="master" style=""/>
    </div>
    <Header/>
    <v-main>
      <transition name="bounce" mode="out-in">
        <router-view>
        </router-view>
      </transition>
    </v-main>
  </v-app>
</v-container>
</template>

<style scoped>
html, body {
  overflow: hidden !important;
}

#background {
  background: url('@/assets/pokemons_background.png') no-repeat center ,radial-gradient(pink, blue);
  background-size: 100%;
}
.master {
  position: absolute;
  top: -200px;
  height: auto;
  overflow: hidden !important;
  animation: pokemons 4s infinite linear;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s
}

.fade-enter, .fade-leave-to {
  opacity: 0
}

.bounce-enter-active {
  animation: pop 0.5s;
}

.bounce-leave-active {
  animation: pop 0.2s reverse;
}

@keyframes pop {
  from {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  to {
    transform: scale(1);
  }
}

@keyframes pokemons {
  50% {
    transform: translateY(calc(100vh + 500px)) rotate(720deg);
  }
  to {
    transform: translateY(0) rotate(1540deg);
  }
}
</style>
