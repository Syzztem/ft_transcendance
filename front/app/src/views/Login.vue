<template>
    <v-container>
        <v-row>
            <v-col class="d-flex justify-center mt-10" cols="12" id="col">
                <v-row justify="center">
                    <p v-if="status == 'loading_login'">
                        <input value="Loading..." type="button" disabled style="background-color: black;">
                    </p>
                    <p v-else>
                        <v-btn id="btn" :href="url" style="background-color: black;" height="100">LOGIN</v-btn>
                    </p>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import router from '@/router'
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import { socket, chatSocket} from '@/websocket'

export default defineComponent({
    data() {
        return {
            url: "http://" + process.env.VUE_APP_URL + ":3000/auth/42/callback"
        }
    },
    computed: {
        ...mapState(['status', 'twoFactorAuthenticated'])
    },
    async mounted() {
        if (this.$route.query.token) { 
            localStorage.setItem('token', this.$route.query.token as any)
            localStorage.setItem('id', this.$route.query.id?.toString() as any)
            socket.connect()
            await this.$store.dispatch('get2fa')
            console.log("twoFactorAuthenticated: ", this.$store.state.twoFactorAuthenticated)
            console.log("isotp: ", this.$store.state.userInfos.isotp)
            if (this.$store.state.userInfos.isotp && !this.$store.state.twoFactorAuthenticated)
                await this.$router.push('2fa')
            else {
                chatSocket.connect()
                await this.$router.push('userInfos')
            }
            return
        }
    }
})
</script>

<style scoped>
#btn {
    font-family: "pokemon";
}
</style>