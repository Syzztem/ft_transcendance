<template>
  <v-container>
    <v-card id="card" black color="transparent" height="100vh" rounded flat>
    <v-row class="" justify="center">
      <v-card id="card" black color="transparent" height="50vh" rounded flat class="mr-10">
        <v-row justify="center" class="mt-16">
          <a href="https://profile.intra.42.fr/users/lnoirot">
            <img src="@/assets/lnoirot.jpg"/>
          </a>
        </v-row>
        <v-row justify="center">
            <p>
                LNOIROT
            </p>
        </v-row>
      </v-card>
      <v-card id="card" black color="transparent" height="50vh" rounded flat class="ml-10">
        <v-row justify="center" class="mt-16">
          <a href="https://profile.intra.42.fr/users/aedouard">
            <img src="@/assets/L.jpg" router />
          </a>
        </v-row>
        <v-row justify="center">
            <p>
                AEDOUARD
            </p>
        </v-row>
      </v-card>
    </v-row>
    <v-row class="mt-5" justify="center">
      <v-card id="card" black color="transparent" height="50vh" rounded flat class="mr-10">
        <v-row justify="center">
          <a href="https://profile.intra.42.fr/users/rcorenti">
            <img src="@/assets/rcorenti.jpg"/>
          </a>
        </v-row>
        <v-row justify="center">
            <p>
                RCORENTI
            </p>
        </v-row>
      </v-card>
      <v-card id="card" black color="transparent" height="50vh" rounded flat class="ml-10">
        <v-row justify="center">
          <a href="https://profile.intra.42.fr/users/lothieve">
            <img src="@/assets/sylvain.jpg"/>
          </a>
        </v-row>
        <v-row justify="center">
            <p>
                LOTHIEVE
            </p>
        </v-row>
      </v-card>
    </v-row>
    </v-card>
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
    mounted() {
    if (store.state.user.id == -1) {
        this.$router.push('/login')
        return
    }
  }
})
</script>

<style scoped>
p {
    font-family: "pokemon";
    text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 0.2em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
    color: rgb(255, 233, 0);
    font-size: 3vh;
}

img {
  height:30vh
}
</style>