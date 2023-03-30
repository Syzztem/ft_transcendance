<script lang="ts">
import IGameConfig from '../models/IGameConfig'
import { defineComponent } from 'vue'
import store from '@/store'
import { socket } from '../websocket'
import router from '@/router'

export default defineComponent({
  data() {
    return {
      gameConfig: Object() as IGameConfig,
      route: "",
      showOriginal: false,
      showPowerUps: false,
      gameSocket: socket,
      isMatchmaking: false,
      colorBackground: this.$store.state.game.colorBackground
    }
  },
  mounted() {
    this.gameSocket.on('redirectGame', (response: number) => {
      router.push({name: 'game', params: {id: response}})
    })
  },
  unmounted() {
    if (this.isMatchmaking)
      this.gameSocket.emit('leaveMatchmaking')
  },
  methods: {
    JoinMatchmaking() {
      this.isMatchmaking = true
      this.gameSocket.emit('joinMatchmaking')
    },
    originalModeToggle() {
      if (this.isMatchmaking)
        return ;
      this.gameConfig.mode = 'original'
      this.route = ""
      this.showOriginal = true
      this.showPowerUps = false
      this.JoinMatchmaking()
    },
    powerUpsModeToggle() {
      if (this.isMatchmaking)
        return ;
      this.gameConfig.mode = 'powerUps'
      this.route = ""
      this.showPowerUps = true
      this.showOriginal = false
    },
    HandleColorBackground(e: Event) {
      this.$store.commit("setColorBackground", e)
    }
  }
})
</script>

<template>
  <v-container>
    <v-row class="mt-5" justify="center">
      <v-card id="GameTitle" flat width="550" height="120" class="pb-3 mb-16">
        <v-row justify="center" class="mt-1">
          <p >
            Choose Game :
          </p>
        </v-row>
      </v-card>
    </v-row>
    <v-row justify="center">
      <v-card id="CardContent" height="auto" width="650" rounded flat black class="mx-16 pb-2">
          <v-row justify="center" class="mt-4 ml-16 mr-16 mb-2">

            <button id="ball-btn" @click="originalModeToggle" :class="[showOriginal ? 'active' : 'default-btn']">
              Original Pong
            </button>

            <!-- <v-spacer></v-spacer>

            <button id="ball-btn" @click="powerUpsModeToggle" :class="[showPowerUps ? 'active' : 'default-btn']">
                Poké Pong
            </button> -->
            <v-card class="px-3 py-5" id="LighterCard" width="200">
              <v-radio-group
                @update:model-value="HandleColorBackground($event)"
                label="Board color"
                v-model="colorBackground"
              >
                <v-radio label="Black" value="black" color="grey-darken-4"></v-radio>
                <v-radio label="Blue" value="blue" color="blue"></v-radio>
                <v-radio label="Red" value="red" color="red"></v-radio>
              </v-radio-group>
            </v-card>

          </v-row>
          <v-row justify="center" class=" mt-10 mb-1">
            <v-btn id="Yellow" height="90" @click="$router.push(route)">
              START
            </v-btn>
          </v-row>
        </v-card>
      </v-row>
  </v-container>
</template>

<style>

#LighterCard {
	background:	linear-gradient(0deg,rgba(54, 54, 172, 0.603) 0%, rgba(124, 110, 187, 0.61) 100%);
	border-radius: 10px;
	color:aliceblue;
}
</style>
<style scoped>

#CardContent {
	overflow: hidden;
}

#Yellow {
	color: rgb(255, 200, 0)!important;
	background:	linear-gradient(0deg,rgba(54, 54, 172, 0.603) 0%, rgba(124, 110, 187, 0.61) 100%);
	border-radius: 10px;
}

#GameTitle {
	background-color: transparent;
}

p {
  font-family: "pokemon";
  font-size: 70px;
  color: rgb(255, 200, 0);
  text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 0.5em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
  margin-left: 30px;
}

button {
  font-family: "pokemon";
  font-size: 50px;
  color: rgb(255, 200, 0);
  text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 0.5em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

button:hover {
  color: rgb(255, 233, 0);
}

.default-btn {
  background-image: url('@/assets/pokeball_button.png');
  border: none;
  background-color: transparent;
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  height: 250px;
  width: 250px;
  font-size: 53px;
}

.active {
  background-image: url('@/assets/open_pokeball_button.png');
  border: none;
  background-color: transparent;
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  height: 250px;
  width: 250px;
  font-size: 53px;
}

#card {
  border-radius: 5%;
}

</style>
