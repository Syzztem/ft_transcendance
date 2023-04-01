<template>
    <v-container>
        <v-row>
            <v-col class="d-flex justify-center mt-10" cols="12" id="col">
                <v-row justify="center">
                    <p v-if="status == 'loading_login'">
                        <input value="Loading..." type="button" disabled style="background-color: black;">
                    </p>
                    <p v-else>
                        <v-btn id="btn" :href="url" height="100">LOGIN</v-btn>
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
	font-family:		"pokemon";
	align-items: 		stretch;
	font-size:			300%!important;
	background-color: transparent;
	background:			linear-gradient(180deg, rgba(28, 25, 94, 0) 0%, rgb(83, 83, 221) 35%, rgba(173, 120, 243, 0.815) 100%);
	backdrop-filter: 	blur(4px);
	color: 				rgb(255, 192, 55)!important;
	border-bottom:		solid 2px rgb(32, 38, 131);
	background-color: rgba(255, 0, 0, 0);
}

</style>
