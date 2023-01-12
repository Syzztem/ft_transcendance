<script lang="ts">
import IGameConfig from '../models/IGameConfig'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      showOriginal: true,
      gameConfig: Object() as IGameConfig
    }
  },
  methods: {
    originalModeToggle() {
      this.showOriginal = true
      this.gameConfig.mode = 'original'
    },
    powerUpsModeToggle() {
      this.showOriginal = false
      this.gameConfig.mode = 'powerUps'
    }
  },
  mounted() {
    this.gameConfig.mode = 'original'
  }
})
</script>
  
<template>
  <div>
    <button id="startGameButton" @click="$router.push('game')">START</button>
  </div>
  <div>
    <h1>Choose game mode:</h1>
    <button id="originalModeButton" @click="originalModeToggle" :class="[showOriginal ? 'active' : '']">Original Pong</button>
    <button id="powerUpsModeButton" @click="powerUpsModeToggle" :class="[showOriginal ? '' : 'active']">Poké Pong</button>
  </div>
</template>
  
<style scoped>
h1 {
  font-family: "pokemon";
  font-size: 70px;
  color: rgb(255, 200, 0);
  text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

button {
  font-family: "pokemon";
  color: rgb(255, 200, 0);
  text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
  width: 30vh;
  height: 30vh;
  max-width: 200px;
  max-height: 200px;
  border: none;
  background-color: transparent;
  overflow: hidden;
  background-image: url('/src/assets/pokeball_button.png');
  background-size: cover;
  background-repeat: no-repeat;
}

@media screen and (min-height: 581px) {
  button {
    font-size: 40px;
  }
}

@media screen and (max-height: 580px) and (min-height: 301px) {
  button {
    font-size: 20px;
  }
}

@media screen and (max-height: 300px) {
  button {
    font-size: 10px;
  }
}

button:focus {
  outline: none;
}

.active {
  background-image: url('/src/assets/open_pokeball_button.png');
}

#startGameButton {
  border: none;
  background-color: transparent;
  overflow: hidden;
  background-image: url('/src/assets/masterball_button.png');
  background-size: cover;
  background-repeat: no-repeat;
  height: 140px;
  width: 140px;
  font-family: "pokemon";
  font-size: 25px;
  color: rgb(255, 200, 0);
  text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}
</style>