<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({})
</script>

<template>
  <div>
    <button id="chatButton" @click="$router.push('chat')">Chat</button>
    |
    <button id="homeButton" @click="$router.push('/')">Home</button>
    |
    <button id="gameButton" @click="$router.push('hub')">Game</button>
  </div>
  <router-view />
</template>

<style scoped>
</style>
