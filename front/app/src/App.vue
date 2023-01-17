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
      const img = document.querySelectorAll<HTMLElement>('.master');
      img.forEach((img) => {
        var pos = Math.random() * (window.innerWidth - 150);
        pos = Math.floor(pos);
        img.style.left = pos + "px";
        const width = Math.floor(Math.random() * 200 + 100)
        img.style.width = width + "px";
        img.style.animationDelay = Math.floor(Math.random() * 10) + "s";
        img.style.animationDuration = Math.floor(Math.random() * 5 + 3) + "s";
        img.style.filter = "blur(" + Math.pow(width / 125, 2) + "px)";
        img.style.animationTimingFunction = "linear";
        img.style.animationIterationCount = "infinite";
      });
    },
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
  <v-app style="background-color: #FFF000;">
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
</template>

<style scoped>
html, body {
  overflow: hidden !important;
}

.master {
  position: absolute;
  top: -200px;
  height: auto;
  overflow: hidden !important;
  animation: chute 4s infinite linear;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s
}

.fade-enter, .fade-leave-to {
  opacity: 0
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.2s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes chute {
  0% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(calc(75vh + 150px));
  }
  100% {
    transform: translateY(calc(100vh + 200px));
  }
}

</style>
