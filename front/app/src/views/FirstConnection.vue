<template>
    <v-container>
        <v-row>
            <v-col class="d-flex justify-center mt-10" cols="12" id="col">
                <v-row justify="center">
                    <v-card color="rgb(2, 105, 255, 0.5)">
                        <v-col>
                            <p>
                                token: {{ cookies.get('token') }}
                            </p>
                            <p>
                                id: {{ cookies.get('id') }}
                            </p>
                            <p>
                                CHOOSE USERNAME :
                            </p>
                        </v-col>
                        <v-col>
                            <!-- v-on:keyup.enter="" -->
                            <input type="text" v-model="username" spellcheck="false">
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
    setup() {
        const { cookies } = useCookies()
        return { cookies }
    },
    mounted() {
    // if (store.state.user.id == -1) {
        // this.$router.push('/login')
        // return
    // }
    },
    methods: {
        ok() {
            this.$store.dispatch('changeUsername', { username: this.username, id: this.cookies.get('id'), token: this.cookies.get('token') })
            .then((res) => {
                console.log(res)
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