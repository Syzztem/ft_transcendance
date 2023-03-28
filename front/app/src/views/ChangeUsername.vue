<template>
    <v-container>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            Username taken
          </v-card-title>
          <v-card-text>
            The username you have chosen is already taken. Please choose a different one.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="dialog = false">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <v-card color="transparent" class="mt-4" height="15vh" flat>
        <v-row justify="center" class="mt-1">
          <h1>
            CHANGE USERNAME :
          </h1>
        </v-row>
      </v-card>
      <v-card color="transparent" class="mt-12" flat>
        <input type="text" v-on:keyup.enter="updateUsername" v-model="newUsername" spellcheck="false" />
        <v-btn @click="updateUsername" class="ml-4">
          Change Username
        </v-btn>
      </v-card>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useStore } from 'vuex';
  import router from '@/router';
  
  export default defineComponent({
    setup() {
      const store = useStore();
      const newUsername = ref('');
      const dialog = ref(false);
      const updateUsername = async () => {
        const res = await store.dispatch('changeUsername', {
          username: newUsername.value,
          token: store.state.userInfos.token,
        })
        if (res.response && res.response.status === 409)
          dialog.value = true;
        else
            router.push('/')
      };
      return {
        newUsername,
        updateUsername,
        dialog,
      };
    },
  });
  </script>
  
  <style scoped>
  h1 {
    font-family: 'pokemon';
    color: rgb(255, 200, 0);
    font-size: 7vh;
    text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 0.2em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
  }
  
  input,
  textarea {
    background-color: #d1d1d1;
  }
  </style>