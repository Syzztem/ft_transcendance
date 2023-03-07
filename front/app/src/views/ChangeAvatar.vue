<template>
  <v-container>
    <v-row justify="center">
      <v-card id="card" class="mt-6" color="transparent" height="700" width="300" flat>
        <div class="screen">
          <v-card height="270" color="rgb(0, 0, 0, 0.5)">
          <v-row justify="center" class="mt-2">
              <div class="avatar">
                <NiceAvatar v-if="ifRd"
                  ref="niceAvatar"
                  :size="size"
                  :face-color="faceColor"
                  :eye="eye"
                  :eye-brow="eyeBrow"
                  :ear="ear"
                  :earring="earring"
                  :mouth="mouth"
                  :hair="hair"
                  :hair-color="hairColor"
                  :nose="nose"
                  :glasses="glasses"
                  :beard="beard"
                  :beard-color="beardColor"
                  :shirt="shirt"
                  :shirt-color="shirtColor"
                  :bg-color="bgColor"
                />
                <cropper v-else class="cropper" :stencil-props="{ aspectRatio: 1 }" :src="url" />
              </div>
            </v-row>
          </v-card>
          <v-card color="transparent" class="mt-2" flat>
            <div class="options">
              <div class="buttons">
                <v-row justify="center">
                  <v-btn type="button" id="btn" class="mt-6" @click="random" height="120" width="250" color="rgb(0, 75, 255)">
                    Random
                  </v-btn>
                </v-row>
                <v-row justify="center">
                  <v-btn type="button" id="btn" class="mt-6" @click="upload" height="120"  width="250" color="rgb(0, 75, 255)">
                    Upload
                    <input type="file" id="btn" class="mt-6" @click="upload" @change="onFileChange" />
                  </v-btn>
                </v-row>
                <v-row justify="center">
                  <v-btn type="button" id="btn" class="mt-6" @click="sendPic" height="120"  width="250" color="rgb(0, 75, 255)">
                    Ok
                  </v-btn>
                </v-row>
              </div>
            </div>
          </v-card>
        </div>
      </v-card>
    </v-row>
  </v-container>
</template>
  
<script lang="ts">
import {
  EYES,
  EYEBROWS,
  EAR,
  EARRING,
  MOUTH,
  HAIR,
  NOSE,
  GLASSES,
  BEARD,
  SHIRT,
  SHIRT_COLORS,
  BG_COLORS,
  FACE_COLORS,
  HAIR_COLORS,
  BEARD_COLORS,
} from "@/components/NiceAvatar/types"
import NiceAvatar from "@/components/NiceAvatar/NiceAvatar.vue"
import { defineComponent, Events } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import store from '@/store'
  
export default defineComponent({
  components: {
    NiceAvatar,
    Cropper
  },
  data() {
    return {
      url: "",
      ifRd: true,
      size: 250,
      faceColor: FACE_COLORS[0],
      eye: EYES.OVAL,
      eyeBrow: EYEBROWS.EYEBROWS_UP,
      ear: EAR.SMALL,
      earring: EARRING.NONE,
      mouth: MOUTH.LAUGHING,
      hair: HAIR.FONZA,
      hairColor: HAIR_COLORS[0],
      nose: NOSE.CURVE,
      glasses: GLASSES.NONE,
      beard: BEARD.NONE,
      beardColor: BEARD_COLORS[0],
      shirt: SHIRT.COLLARED,
      shirtColor: SHIRT_COLORS[0],
      bgColor: BG_COLORS[0],
      FACE_COLORS
    };
  },
  computed: {
    eyesValues() {
      return Object.values(EYES)
    },
    eyeBrowsValues() {
      return Object.values(EYEBROWS)
    },
    earValues() {
      return Object.values(EAR)
    },
    earringValues() {
      return Object.values(EARRING)
    },
    mouthValues() {
      return Object.values(MOUTH)
    },
    hairValues() {
      return Object.values(HAIR)
    },
    noseValues() {
      return Object.values(NOSE)
    },
    glassesValues() {
      return Object.values(GLASSES)
    },
    beardValues() {
      return Object.values(BEARD)
    },
    shirtValues() {
      return Object.values(SHIRT)
    }
  },
  mounted() {
    this.random()
  },
  methods: {
    onFileChange(e: any) {
      const file = e.target.files[0]
      this.url = URL.createObjectURL(file)
    },
    random() {
      this.ifRd = true
      this.bgColor = this.getRandom(BG_COLORS)
      this.faceColor = this.getRandom(FACE_COLORS)
      this.beard = this.getRandom(Object.values(BEARD))
      this.beardColor = this.getRandom(BEARD_COLORS)
      this.eye = this.getRandom(Object.values(EYES))
      this.eyeBrow = this.getRandom(Object.values(EYEBROWS))
      this.ear = this.getRandom(Object.values(EAR))
      this.earring = this.getRandom(Object.values(EARRING))
      this.mouth = this.getRandom(Object.values(MOUTH))
      this.hair = this.getRandom(Object.values(HAIR))
      this.hairColor = this.getRandom(HAIR_COLORS)
      this.nose = this.getRandom(Object.values(NOSE))
      this.glasses = this.getRandom(Object.values(GLASSES))
      this.shirt = this.getRandom(Object.values(SHIRT))
      this.shirtColor = this.getRandom(SHIRT_COLORS)
    },
    getRandom(list: any) {
      return list[Math.floor(Math.random() * list.length)]
    },
    upload() {
      this.ifRd = false
    },
    sendPic() {
      this.$store.dispatch('changeProfilePic', { token: this.$store.state.user.token })
      .then(() => {
        
      }, (error) => {
          console.log(error)
      })
    }
  }
})
</script>
  
<style>
#btn {
  font-family: "pokemon";
  font-size: 50px;
  color: rgb(255, 200, 0);
  text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 0.5em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

#btn:hover {
  color: rgb(255, 233, 0);
}

.cropper {
	height: 250px;
	width: 250px;
	background: #DDD;
}
</style>