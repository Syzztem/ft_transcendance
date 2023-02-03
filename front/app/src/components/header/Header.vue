<template>
    <v-app-bar elevation="5" color="#000FFF">
        <v-toolbar-title id="logo" style="cursor: pointer" @click="$router.push('/')" dark fixed app>
            POKEPONG
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <img v-if="user.profilePic" id="profilePic" :src="user.profilePic"/>
        <img v-else id="profilePic" src="@/assets/egg_picture.png" />
        <v-btn router :to="'/profil'">
            <p>
                {{ user.username }}
            </p>
        </v-btn>
        <v-btn v-if="$router.currentRoute.value.path == '/options'" @click="$router.go(-1)">
            <img id="optionsImg" src="@/assets/optionsButton.png"/>
        </v-btn>
        <v-btn v-else router :to="'/options'">
            <img id="optionsImg" src="@/assets/optionsButton.png"/>
        </v-btn>
    </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import store from '@/store';

export default defineComponent({
    data() {
        return {
        }
    },
    computed: {
        ...mapState({
            user: 'userInfos'
        })
    },
    mounted() {
        this.$store.dispatch('getUserInfos', { token: store.state.user.token })
    }
})
</script>

<style scoped>
#logo {
    font-family: "pokemon";
    color: rgb(255, 200, 0);
    text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 0.2em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
    font-size: 150%;
}
#logo:hover {
  color: rgb(255, 233, 0);
}
p {
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