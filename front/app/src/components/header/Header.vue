<template>
    <v-app-bar id="header" elevation="5" color="#000FFF">
      <v-toolbar-title id="logo" style="cursor: pointer" @click="$router.push('/')"
        dark
        fixed
        app>
        POKEPONG
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <img id="profilePic" :src="profilePicURL" />
      <v-btn id="Userbtn" router :to="'/me'">
        {{ username }}
      </v-btn>
      <v-btn
        v-if="$router.currentRoute.value.path == '/options'"
        @click="$router.go(-1)"
      >
        <img id="optionsImg" src="@/assets/optionsButton.png" />
      </v-btn>
      <v-btn v-else router :to="'/options'">
        <img id="optionsImg" src="@/assets/optionsButton.png" />
      </v-btn>
    </v-app-bar>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, watch } from 'vue';
  import { mapState, useStore } from 'vuex';

  export default defineComponent({
    data() {
      return {
        id: localStorage.id
      }
    },
    computed: {
      ...mapState({
        user: 'userInfos'
      })
    },
    setup() {
      const store = useStore()
      const profilePicURL = ref(store.state.userInfos.profilePic)

      const updateProfilePicURL = () => {
        profilePicURL.value = store.state.userInfos.profilePic + '?t=' + new Date().getTime()
      }

      setInterval(() => {
        updateProfilePicURL()
      }, 5000)

      watch(() => store.state.userInfos.profilePic, (newVal, oldVal) => {
        if (newVal !== oldVal)
            updateProfilePicURL()
      })

      const username = computed(() => store.getters.getUsername)

      return {
        username,
        profilePicURL
      }
    },
    async mounted() {
      const store = useStore()

      await store.dispatch('getUserInfos')
      if (store.getters.getUsername) {
        await store.dispatch('getProfilePic', store.getters.getUsername)
      }
    }
  })
</script>

<style scoped>
#Userbtn {
	font-family: "pokemon";
	letter-spacing: 4px;
	    color: rgb(255, 200, 0);
	text-shadow: 0px 1px 6px rgb(23, 0, 155)!important;
}

#logo {
    font-family: "pokemon";
    color: rgb(255, 200, 0);
	text-shadow: 0px 1px 6px rgb(23, 0, 155)!important;
    font-size: 150%;
}
#logo:hover {
  color: rgb(255, 233, 0);
}

#header {
	background:			linear-gradient(180deg, rgb(29 25 94) 0%, rgb(26 26 122 / 93%) 35%, rgba(83, 82, 168, 0.71) 100%);
	height: 60px;
}
.btnLogin {
  font-family: "pokemon";
  font-size: 20px;
  color: rgb(255, 200, 0);
  text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 0.5em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
  margin-left: 30px;
}
#optionsImg {
    width: 4vh;
}
#profilePic {
    width: 3vh;
}
</style>
