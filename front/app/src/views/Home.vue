<script lang="ts">

export default ({
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-center" cols="12">
        <v-btn router :to="'/chat'" class="btn" style="color: #F6D42A;" dark tile x-large depressed color="#121212" width="295" height="90">CHAT</v-btn>
      </v-col>
      <v-col class="d-flex justify-center" cols="12">
        <v-btn router :to="'/hub'" class="btn" style="color: #F6D42A;" dark tile x-large depressed color="#121212" width="295" height="90">GAME</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
@import '~@/assets/fonts/stylesheet.css';

html, body {
  overflow: hidden !important;
}

.btn {
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
  btn {
    font-size: 40px;
  }
}

@media screen and (max-height: 580px) and (min-height: 301px) {
  btn {
    font-size: 20px;
  }
}

@media screen and (max-height: 300px) {
  btn {
    font-size: 10px;
  }
}

btn:focus {
  outline: none;
}

</style>
