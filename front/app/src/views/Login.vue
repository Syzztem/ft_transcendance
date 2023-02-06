<template>
    <v-container>
        <v-row>
            <v-col class="d-flex justify-center mt-10" cols="12" id="col">
                <v-card black color="rgb(0, 75, 255, 0.8)" width="100vw" height="40vh">
                    <v-card-title>
                        <v-row justify="center" class="mt-2">
                            <p>
                                LOGIN
                            </p>
                        </v-row>
                    </v-card-title>
                    <v-form v-on:submit.prevent class="mt-10">
                        <v-col>
                            <p>
                                <label>
                                    USERNAME : 
                                </label>
                                <input type="text" v-on:keyup.enter="createAccount" v-model="username" spellcheck="false">
                            </p>
                        </v-col>
                        <v-col>
                            <p v-if="status == 'error_login'">
                                Username Too Long (8 Chars max)
                            </p>
                        </v-col>
                        <v-col class="mt-10">
                            <p v-if="status == 'loading_login'">
                                <input value="Loading..." type="button" disabled style="background-color: black;">
                            </p>
                            <p v-else>
                                <input value="LOGIN" type="button" @click="createAccount" :disabled="!loginValidatedFields" style="background-color: black;">
                            </p>
                        </v-col>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'

export default defineComponent({
    data() {
        return {
            username: ""
        }
    },
    mounted() {
        if (this.$store.state.user.id != -1) {
            this.$router.push('/')
            return
        }
    },
    methods: {
        createAccount() {
            if (this.username == '')
                return
            if (this.username.length > 8) {
                this.$store.state.status = 'error_login'
                return
            }
            this.$store.dispatch('createAccount', {
                username: this.username,
                token: this.makeToken()
            }).then(() => {
                this.login()
            }, () => {
                this.login()
            })
        },
        login() {
            if (this.username == '')
                return
            this.$store.dispatch('login', { username: this.username })
            .then(() => {
                this.$router.push('/')
            }, (error) => {
                console.log(error)
            })
        },
        makeToken() {
            let res = ''
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            for (let i = 0; i < 16; i++)
                res += chars.charAt(Math.floor(Math.random() * chars.length))
            return res
        }
    },
    computed: {
        loginValidatedFields() {
            if (this.username != "")
                return true
            else
                return false
        },
        signinValidatedFields() {
            if (this.username != "")
                return true
            else
                return false
        },
        ...mapState(['status'])
    }
})
</script>

<style scoped>
p, input {
    font-family: "pokemon";
}

p {
    text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
    color: rgb(255, 233, 0);
}

input[type="text"] {
    background-color: white;
}

input[type="submit"] {
    background-color: black;
}
</style>