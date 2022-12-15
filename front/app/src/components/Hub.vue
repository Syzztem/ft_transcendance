<script lang="ts">
import IGameConfig from '../models/IGameConfig'

export default {
  data() {
    return {
      showOriginal: true
    }
  },
  computed: {
    gameConfig: {
      get() {
        return this.$store.getters.getGameConfig
      },
      set(val: IGameConfig) {
        this.$store.commit('setGameConfig', val)
      }
  },
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
}
</script>
  
<template>
  <div>
    <p>Choose game mode :</p>
    <button id="originalModeButton" @click="originalModeToggle" :class="[showOriginal ? 'active' : '']">Original Mode</button>
    |
    <button id="powerUpsModeButton" @click="powerUpsModeToggle" :class="[showOriginal ? '' : 'active']">Power Ups Mode</button>
  </div>
  <div>
    <button id="startGameButton" @click="$router.push('game')">START GAME</button>
  </div>
</template>
  
<style scoped>
.active {
  background-color: greenyellow;
}
</style>