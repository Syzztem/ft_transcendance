<template>
    <v-container>
        <v-card>
            <h3>
                Code :
            </h3>
            <div style="display: flex; flex-direction: row;">
                <input type="text" ref="otpInput" v-model="otp" required minlength="6" maxlength="6" size="10" placeholder="2FA token" @keydown.enter="validate">
            </div>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            otp: ''
        }
    },
    methods: {
        async validate() {
            const code = this.otp
            this.otp = ''
            await this.$store.dispatch('auth2fa', code)
            await this.$store.dispatch('get2fa')
            await this.$store.dispatch('getUserInfos')
            if (this.$store.state.twoFactorAuthenticated)
                this.$router.push('userInfos')
        },
    }
})
</script>

<style scoped>
</style>