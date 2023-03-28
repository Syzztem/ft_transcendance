<template>
    <v-container>
        <v-row>
            <v-col class="d-flex justify-center mt-10" cols="12" id="col">
                <v-row justify="center">
                    <v-dialog v-model="usernameTakenDialog" max-width="300">
                        <v-card>
                            <v-card-title class="text-h5">Erreur</v-card-title>
                            <v-card-text>
                                The username is already taken. Please choose another.
                            </v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" text @click="usernameTakenDialog = false">Fermer</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="changeProfilePicDialog" max-width="300">
                        <v-card>
                            <v-card-title class="text-h5">Changer la photo de profil ?</v-card-title>
                            <v-card-text>
                                Souhaitez-vous changer votre photo de profil maintenant ?
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="primary" text @click="redirectToChangeProfilePic">Oui</v-btn>
                                <v-btn color="secondary" text @click="redirectToHome">Non</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-card color="rgb(2, 105, 255, 0.5)">
                        <v-col>
                            <p>
                                CHOOSE USERNAME :
                            </p>
                        </v-col>
                        <v-col>
                            <input type="text" v-model="newUsername" v-on:keyup.enter="ok" spellcheck="false">
                        </v-col>
                    </v-card>
                </v-row>
            </v-col>
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
import store from '@/store';
import { computed } from '@vue/reactivity';

export default defineComponent({
    data() {
        return {
            newUsername: '',
            usernameTakenDialog: false,
            profilePicURL: '',
            changeProfilePicDialog: false
        }
    },
    async mounted() {
        await this.$store.dispatch('getProfilePic')
        this.profilePicURL = this.$store.state.userInfos.profilePic
    },
    setup() {
        return {
            username: computed(() => store.getters.getUsername)
        }
    },
    methods: {
        async ok() {
            await this.$store.dispatch('changeUsername', { username: this.newUsername })
            .then((res: any) => {
                this.changeProfilePicDialog = true;
            }
            , (error: any) => {
                console.log(error)
                if (error.response && error.response.status === 409) {
                    this.usernameTakenDialog = true;
                }
            })
        },
        redirectToChangeProfilePic() {
            this.changeProfilePicDialog = false;
            this.$router.push('/avatar');
        },
        redirectToHome() {
            this.changeProfilePicDialog = false;
            this.$router.push('/');
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