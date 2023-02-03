<template>
    <v-container>
        <v-card>
            <v-row justify="center">
                <img v-if="user.profilePic != null" :src="user.profilePic"/>
                <img v-else src="@/assets/egg_picture.png"/>
            </v-row>
            <v-row justify="center">
                <p>
                    {{ user.username }}
                </p>
            </v-row>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import { mapState } from 'vuex';

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
        if (store.state.user.id == -1) {
            this.$router.push('/login')
            return
        }
        this.$store.dispatch('getUserInfos', { token: store.state.user.token })
    }
})
</script>

<style scoped>
p, #btn {
  font-family: "pokemon";
  font-size: 70px;
  text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 0.5em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
  margin-left: 30px;
}
p {
    color: rgb(255, 200, 0);
}
</style>