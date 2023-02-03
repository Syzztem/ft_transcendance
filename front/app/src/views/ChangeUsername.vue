<template>
    <v-container>
        <v-card color="transparent" class="mt-4" height="15vh" flat>
            <v-row justify="center" class="mt-1">
                <h1>
                    CHANGE USERNAME :
                </h1>
            </v-row>
        </v-card>
        <v-card color="transparent" class="mt-12" flat>
            <input type="text" v-on:keyup.enter="changeUsername" v-model="username" spellcheck="false"/>
            <v-btn @click="changeUsername" class="ml-4">
                Change Username
            </v-btn>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';

export default defineComponent({
    data() {
        return {
            username: ''
        }
    },
    methods: {
        changeUsername() {
            if (this.username == '')
                return
            this.$store.dispatch('changeUsername', {username: this.username, token: store.state.user.token})
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
h1 {
    font-family: "pokemon";
    color: rgb(255, 200, 0);
    font-size: 7vh;
    text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 0.2em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}
input, textarea {
  background-color: #d1d1d1;
}
</style>