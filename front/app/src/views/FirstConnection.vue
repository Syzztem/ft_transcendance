<template>
    <v-container>
        <v-row>
            <v-col class="d-flex justify-center mt-10" cols="12" id="col">
                <v-row justify="center">
                    <v-card color="rgb(2, 105, 255, 0.5)">
                        <v-col>
                            <p>
                                CHOOSE USERNAME :
                            </p>
                        </v-col>
                        <v-col>
                            <input type="text" v-model="username" v-on:keyup.enter="ok" spellcheck="false">
                        </v-col>
                    </v-card>
                </v-row>
            </v-col>
            <!-- <v-col class="d-flex justify-center mt-10" cols="12" id="col">
                AVATAR
            </v-col>
            <v-col class="d-flex justify-center mt-10" cols="12" id="col">
                <v-row justify="center">
                    <v-btn class="btn" color="rgb(2, 105, 255)">
                        CHANGE AVATAR
                    </v-btn>
                </v-row>
            </v-col> -->
            <v-col class="d-flex justify-center mt-10" cols="12" id="col">
                <v-row justify="center">
                    <v-btn class="btn" @click="ok" color="rgb(2, 105, 255)">
                        OK
                    </v-btn>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCookies } from 'vue3-cookies'
import store from '@/store';

export default defineComponent({
    data() {
        return {
            username: ''
        }
    },
    mounted() {
    // if (store.state.user.id == -1) {
        // this.$router.push('/login')
        // return
    // }
    },
    methods: {
        ok() {
            this.$store.dispatch('changeUsername', {token: localStorage.getItem('token'), username: this.username})
            .then((res) => {
                this.$router.push('/')
            }
            , (error) => {
                console.log(error)
            })
        }
    }
})
</script>

<style scoped>
@import '~@/assets/fonts/stylesheet.css';

html, body {
  overflow: hidden !important;
}

.btn, p {
  font-family: "pokemon";
  text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
  color: rgb(255, 200, 0);
}

.btn:hover {
  color: rgb(255, 233, 0);
}

input, textarea {
    background-color: lightgrey;
    font-family: "pokemon";
}

</style>