<script lang="ts">
import Header from './components/header/Header.vue'
import Footer from './components/Footer.vue'
import { defineComponent } from 'vue'
import {socket, chatSocket} from './websocket'

export default defineComponent({
  data() {
    return {
    }
  },
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
        let width = Math.floor(Math.random() * 200 + 100)
        img.style.width = width + "px"
        img.style.animationDelay = Math.floor(Math.random() * 10) + "s"
        img.style.animationDuration = Math.floor(Math.random() * 5 + 3) + "s"
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
    if (localStorage.getItem('token')){
      socket.connect()
      chatSocket.connect()
    }
  }
})
</script>

<template>
	<v-container id="background" fluid>
	<v-app style="background: rgba(0,0,0,0);">
		<div style="overflow: hidden;">
		<!-- <img v-for="n in 1" :key="n" src="@/assets/lorenzo_head.png" class="master" style=""/>
		<img v-for="n in 2" :key="n" src="@/assets/pikachu.png" class="master" style=""/>
		<img v-for="n in 2" :key="n" src="@/assets/bulbizarre.png" class="master" style=""/>
		<img v-for="n in 2" :key="n" src="@/assets/evoli.png" class="master" style=""/>
		<img v-for="n in 2" :key="n" src="@/assets/miaouss.png" class="master" style=""/>
		<img v-for="n in 2" :key="n" src="@/assets/rondoudou.png" class="master" style=""/>
		<img v-for="n in 2" :key="n" src="@/assets/ronflex.png" class="master" style=""/>
		<img v-for="n in 2" :key="n" src="@/assets/salameche.png" class="master" style=""/>
		<img v-for="n in 2" :key="n" src="@/assets/carapuce.png" class="master" style=""/> -->
		</div>
		<Header v-if="$route.path != '/game' && $route.path != '/login' && $route.path != '/userInfos'"/>
		<v-main class="mainClass">
		<router-view v-slot="{ Component }">
			<transition name="bounce" mode="out-in">
			<component :is="Component" />
			</transition>
		</router-view>
		</v-main>
	</v-app>
	</v-container>
</template>

<style>

.mainClass {
	padding-top: 60px!important;
	display: flex;
	overflow: hidden;
	align-items: stretch;
	justify-content: center;
}

.btn {
	font-family:		"pokemon";
	flex-grow:			1!important;
	letter-spacing:		4px!important;
	width:				100%!important;
	min-height:			95px!important;
	max-height:			130px!important;
	align-items: 		stretch;
	font-size:			300%!important;
	background:			linear-gradient(0deg, rgba(140, 0, 255, 0.479) 0%, rgb(29 25 94) 30%, rgb(26 26 122 / 93%) 35%, rgb(55 53 155 / 71%) 100%)!important;
	background-color:	rgba(240, 248, 255, 0)!important;
	backdrop-filter: 	blur(4px);
	color: 				rgb(255, 192, 55)!important;
	border-bottom:		solid 2px rgba(32, 39, 131, 0.603)!important;;
	text-shadow: 		0px 1px 6px rgb(23, 0, 155)!important;
}

.btn:hover .p {
	color:				rgb(252, 220, 133);
}

.p:hover {
	color:				rgb(252, 220, 133);
}

html, body {
  overflow: auto !important;
}

::-webkit-scrollbar{
	width: 8px!important;
	background-color: rgb(17, 19, 102);
}

::-webkit-scrollbar-thumb{
	background:			linear-gradient(0deg, rgba(198, 183, 211, 0.904) 0%, rgb(115, 112, 168) 100%)!important;
	border-radius: 30px;
}

::-webkit-scrollbar-track{
	background:			linear-gradient(0deg, rgba(21, 19, 95, 0.904) 0%, rgb(42, 35, 133) 100%)!important;
	border-radius: 30px;

}

</style>

<style scoped>

#background {
  background: url('@/assets/pokemons_background.png') no-repeat center ,radial-gradient(pink, rgb(13, 13, 180));
  background-size: 100%;
  padding: 0;
}
.master {
  position: absolute;
  top: -300px;
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
