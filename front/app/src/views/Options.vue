<template>
    <v-container>
      <v-row class="mt-2">
        <v-col class="d-flex justify-center" cols="12" id="col">
                <v-row justify="center">
                    <v-card flat color="transparent" width="350" height="100">
                        <v-row justify="center" class="mt-1">
                            <h1 class="h1" style="text-decoration: underline;">
                                OPTIONS:
                            </h1>
                        </v-row>
                    </v-card>
                </v-row>
        </v-col>
        <v-col class="d-flex justify-center" cols="12" id="col">
          <v-btn class="btn" router :to="'/username'" style="color: #FFC800; font-size: 300%;" rounded color="rgb(0, 15, 255, 0.5)" flat width="60vw" max-width="500" height="15vh" max-height="200" min-height="100">
            <p class="p">
              CHANGE USERNAME
            </p>
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center mt-2" cols="12" id="col">
          <v-btn class="btn" router :to="'/avatar'" style="color: #FFC800; font-size: 300%;" rounded color="rgb(0, 15, 255, 0.5)" flat width="60vw" max-width="500" height="15vh" max-height="200" min-height="100">
            <p class="p">
              CHANGE AVATAR
            </p>
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center mt-2" cols="12" id="col">
          <v-btn class="btn" router :to="'/twofactor'" style="color: #FFC800; font-size: 300%;" rounded color="rgb(0, 15, 255, 0.5)" flat width="60vw" max-width="500" height="15vh" max-height="200" min-height="100">
            <p class="p">
              TWO-FACTOR
            </p>
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center mt-2" cols="12" id="col">
          <v-btn @click="logout" class="btn" style="color: #FFC800; font-size: 300%;" rounded color="rgb(0, 15, 255, 0.5)" flat width="60vw" max-width="500" height="15vh" max-height="200" min-height="100">
            <p class="p">
              LOGOUT
            </p>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';

export default defineComponent({
    data() {
        return {
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('logout')
            this.$router.push('/login')
        }
    }
})
</script>

<style scoped>
p, h1 {
  font-family: "pokemon";
  color: rgb(255, 200, 0);
}
h1 {
    font-size: 7vh;
    text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 0.2em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}
p {
    text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 0.5em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}
</style>
