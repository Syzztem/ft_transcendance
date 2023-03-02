<template>
    <v-container>
        <v-card>
            <v-row justify="center">
                <img :src="$store.state.profileInfos.profilePic"/>
            </v-row>
            <v-row justify="center">
                <p>
                    {{ $store.state.profileInfos.username }}
                </p>
            </v-row>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import { mapState } from 'vuex';
import { routeLocationKey } from 'vue-router';

export default defineComponent({
    data() {
        return {
            username: ''
        }
    },
    mounted() {
        if (store.state.user.id == -1) {
            this.$router.push('/login')
            return
        }
        this.$store.dispatch('getProfileInfos', this.$route.params.id)
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