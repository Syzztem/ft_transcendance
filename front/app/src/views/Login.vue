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
                    <v-form class="mt-10">
                        <v-col>
                            <p>
                                <label>
                                    USERNAME : 
                                </label>
                                <input type="text" v-model="loginUsername" spellcheck="false">
                            </p>
                        </v-col>
                        <v-col>
                            <p v-if="status == 'error_login'">
                                Invalid Username
                            </p>
                        </v-col>
                        <v-col class="mt-10">
                            <p v-if="status == 'loading_login'">
                                <input value="Loading..." type="button" disabled style="background-color: black;">
                            </p>
                            <p v-else>
                                <input value="LOGIN" type="button" @click="login" :disabled="!loginValidatedFields" style="background-color: black;">
                            </p>
                        </v-col>
                    </v-form>
                </v-card>
            </v-col>
            <v-col class="d-flex justify-center mt-2" cols="12" id="col">
                <v-card black color="rgb(0, 75, 255, 0.8)" width="100vw" height="40vh">
                    <v-card-title>
                        <v-row justify="center" class="mt-2">
                            <p>
                                SIGNIN
                            </p>
                        </v-row>
                    </v-card-title>
                    <v-form class="mt-10">
                        <v-col>
                            <p>
                                <label>
                                    USERNAME : 
                                </label>
                                <input type="text" v-model="signinUsername" spellcheck="false">
                            </p>
                        </v-col>
                        <v-col class="mt-10">
                            <p>
                                <label>
                                    EMAIL :
                                </label>
                                <input type="text" v-model="email" spellcheck="false">
                            </p>
                        </v-col>
                        <v-col>
                            <p v-if="status == 'error_create'">
                                Username Already Use
                            </p>
                        </v-col>
                        <v-col class="mt-10">
                            <p v-if="status == 'loading_create'">
                                <input value="Loading..." type="button" disabled style="background-color: black;">
                            </p>
                            <p v-else>
                                <input value="SIGNIN" type="button" @click="createAccount" :disabled="!signinValidatedFields" style="background-color: black;">
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
            email: "",
            loginUsername: "",
            signinUsername: ""
        }
    },
    methods: {
        createAccount() {
            this.$store.dispatch('createAccount', {
                username: this.signinUsername,
                email: this.email,
                token: "test"
            }).then(() => {
                this.loginUsername = this.signinUsername
                this.login()
            }, (error) => {
                console.log(error)
            })
        },
        login() {
            this.$store.dispatch('login', { username: this.loginUsername })
            .then(() => {
                this.$router.push('/')
            }, (error) => {
                console.log(error)
            })
        }
    },
    computed: {
        loginValidatedFields() {
            if (this.loginUsername != "")
                return true
            else
                return false
        },
        signinValidatedFields() {
            if (this.email != "" && this.signinUsername != "")
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