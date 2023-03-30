<template>
  <v-container class="qrcontainer" v-if="!isotp">
    <v-card class="qrcard justify-center" id="LighterCard">
      <img :src="qrcode">
      <h3>
        Code :
      </h3>
      <div style="display: flex; flex-direction: row;">
        <v-text-field v-model="otp" hide-details density="compact" required minlength="6" maxlength="6" size="10" placeholder="2FA token" @keydown.enter="validate">
		</v-text-field>
		</div>
    </v-card>
  </v-container>
  <v-container v-else>
    <v-col class="d-flex justify-center mt-16" cols="12" id="col">
      <v-btn class="btn" @click="disable" style="color: #FFC800; font-size: 300%;" rounded color="rgb(0, 15, 255, 0.5)" flat width="50vw" max-width="500" height="15vh" max-height="200" min-height="100">
          <p class="p">
            disable 2fa
          </p>
        </v-btn>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import QRCode from 'qrcode'

export default defineComponent({
  data() {
    return {
      qrcode: '', //this.$store.state.userInfos.qrcode,
      isotp: this.$store.state.userInfos.isotp,
      otp: ''
    }
  },
  async mounted() {
    await this.$store.dispatch('get2fa')
    this.isotp = this.$store.state.userInfos.isotp
    if (!this.isotp) {
       await this.$store.dispatch('qrcode')
       QRCode.toDataURL(this.$store.state.userInfos.qrcode, (err, imageUrl) => {
         this.qrcode = imageUrl
       })
     }
  },
  methods: {
    async validate() {
      const code = this.otp
      this.otp = ''
      await this.$store.dispatch('turnOn2fa', code)
      await this.$store.dispatch('get2fa')
      this.isotp = this.$store.state.userInfos.isotp
    },
    async disable() {
      await this.$store.dispatch('turnOff2fa')
      await this.$store.dispatch('get2fa')
      this.isotp = this.$store.state.userInfos.isotp
    }
  }
})
</script>

<style scoped>

#LighterCard {
	background:	linear-gradient(0deg,rgba(53, 45, 161, 0.747) 0%, rgba(15, 0, 83, 0.89) 30%);
	border-radius: 10px;
	color:aliceblue;
	display: flex;
	flex-direction: column;
	backdrop-filter: blur(3px);
	align-items: center;

}
.qrcontainer {
	display: flex;
	justify-content: center;
	align-items: center;
}
.qrcard {
	width: 196px;
}

</style>
