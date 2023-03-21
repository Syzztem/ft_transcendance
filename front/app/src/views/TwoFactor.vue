<template>
  <v-container v-if="!isotp">
    <v-card>
      <img :src="qrcode">
      <h3>
        Code :
      </h3>
      <div style="display: flex; flex-direction: row;">
        <v-otp-input
          ref="otp"
          :disable="load"
          :num-inputs="6"
          @on-complete="validate"
        />
      </div>
      <v-overlay absolute :value="load">
        <v-progress-circular indeterminate color="primary">
        </v-progress-circular>
      </v-overlay>
    </v-card>
  </v-container>
  <v-container v-else>

  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import QRCode from 'qrcode'

export default defineComponent({
  data() {
    return {
      qrcode: '', //this.$store.state.userInfos.qrcode,
      isotp: this.$store.state.userInfos.isotp,
      otp: '',
      load: false
    }
  },
  mounted() {
    this.$store.dispatch('get2fa')
    this.isotp = this.$store.state.userInfos.isotp
    if (!this.isotp) {
      this.$store.dispatch('qrcode')
      QRCode.toDataURL(this.$store.state.userInfos.qrcode, (err, imageUrl) => {
        this.qrcode = imageUrl
      })
    }
  },
  methods: {
    validate(value: any) {
      this.load = true
      this.$store.dispatch('turnOn2fa', value)
      this.load = false
      const input = this.$refs['otp'] as any;
      input.clearInput()
    }
  }
})
</script>

<style scoped>
</style>