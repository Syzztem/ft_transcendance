<script lang="ts">

export default ({
})
</script>

<template>
    <div>
      <button id="chatButton" @click="$router.push('chat')">CHAT</button>
      <button id="gameButton" @click="$router.push('hub')">GAME</button>
    </div>
</template>

<style scoped>
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

</style>
