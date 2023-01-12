<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  el: '#app'
})
</script>

<template>
  <div>
    <router-link to="/">
      <img id="logo" alt="logo" src="@/assets/pokepong_logo.png">
    </router-link>
  </div>
  <div>
    <router-link to="/">
      <img id="optionsButton" alt="option_button" src='@/assets/optionsButton.png'>
    </router-link>
  </div>
  <router-view />
</template>

<style>
body {
  background-image: url("/src/assets/pokemons_background.png"), radial-gradient(pink, blue);
  background-repeat: no-repeat;
  background-size: 100%;
  background-position:center;
}

#logo {
  position: absolute;
  top: 0%;
  left: 34%;
  width: 30%;
}

#optionsButton {
  position: absolute;
  top: 2%;
  right: 2%;
  width: 10%;
}

@font-face {
  font-family: 'pokemon';
  src: local('pokemon'), url('/src/assets/fonts/Pokemon.ttf') format("truetype")
}
</style>
