<script lang="ts">

export default ({
  data() {
    return {
    }
  },
  //mounted() {
  //  this.$store.getters.
  //}
})
</script>

<template>
  <v-container>
    <v-row class="mt-2">
      <v-col class="d-flex justify-center" cols="12" id="col">
        <v-btn router :to="'/hub'" class="btn" style="color: #FFC800; font-size: 300%;" rounded color="rgb(0, 15, 255, 0.5)" flat width="50vw" max-width="500" height="15vh" max-height="200" min-height="100">
          <p class="p">
            GAME
          </p>
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-center mt-16" cols="12" id="col">
        <v-btn router :to="'/chat'" class="btn" style="color: #FFC800; font-size: 300%;" rounded color="rgb(0, 15, 255, 0.5)" flat width="50vw" max-width="500" height="15vh" max-height="200" min-height="100">
          <p class="p">
            CHAT
          </p>
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-center mt-16" cols="12" id="col">
        <v-btn router :to="'/hall'" class="btn" style="color: #FFC800; font-size: 300%;" rounded color="rgb(0, 15, 255, 0.5)" flat width="50vw" max-width="500" height="15vh" max-height="200" min-height="100">
          <p class="p">
            HALL OF FAME
          </p>
        </v-btn>
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
  text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

.btn:hover .p {
  color: rgb(255, 233, 0);
}

.p:hover {
  color: rgb(255, 233, 0);
}

</style>
