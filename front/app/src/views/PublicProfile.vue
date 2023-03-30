<template>
    <v-container>
      <v-row justify="center">
        <v-card class="pa-4" max-width="1000">
          <v-row>
            <v-col cols="12" sm="4" class="text-center d-flex flex-column align-center">
              <v-avatar size="128" class="mb-4">
                <img :src="user.profilePic" alt="Avatar" />
              </v-avatar>
              <h2>{{ user.username }}</h2>
              <div class="button-container">
                <v-btn v-if="!isFriend" @click="addFriend" color="primary" small>Add friend</v-btn>
                <v-btn v-else @click="unfriend" color="primary" small>Delete friend</v-btn>
                <v-btn v-if="!isBlocked" @click="block" color="error" small>Block</v-btn>
                <v-btn v-else @click="unblock" color="error" small>Unblock</v-btn>
              </div>
            </v-col>
            <v-col cols="12" sm="8">
              <h3>Game statistics :</h3>
              <p>Wins : {{ user.wins }}</p>
              <p>Losses : {{ user.losses }}</p>
              <p>Ratio wins/losses : {{ (user.wins / user.losses).toFixed(2) }}</p>
              <p>Total Games : {{ (user.wins + user.losses) }}</p>
              <h3>Game History :</h3>
              <div class="game-history-container">
                <div v-for="(game, index) in user.games" :key="game.id">
                  <p>Date : {{ game.timestamp }}</p>
                  <p>Score : {{ game.player1Score }} : {{ game.player2Score }}</p>
                  <p>Winner : {{ game.winner }}</p>
                  <p>Looser : {{ game.looser }}</p>
                  <p>Game ID : {{ game.id }}</p>
                  <v-divider class="border-opacity-100"></v-divider>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    data() {
        return {
            user: this.$store.state.profileInfos,
            isFriend: this.$store.state.profileInfos.isFriend,
            isBlocked: this.$store.state.profileInfos.isBlocked,
            games: this.$store.state.profileInfos.games
        }
    },
    async mounted() {
        await this.$store.dispatch('getProfileInfos', this.$route.params.id)
        await this.$store.dispatch('getPic', this.user.username)
        this.user.profilePic = this.user.profilePic
    },
    methods: {
        async addFriend() {
            await this.$store.dispatch('addFriend', this.user.id)
            await this.$store.dispatch('getProfileInfos', this.$route.params.id)
        },
        async block() {
            await this.$store.dispatch('block', this.user.id)
            await this.$store.dispatch('getProfileInfos', this.$route.params.id)
        },
        async unfriend() {
            await this.$store.dispatch('unfriend', this.user.id)
            await this.$store.dispatch('getProfileInfos', this.$route.params.id)
        },
        async unblock() {
            await this.$store.dispatch('unblock', this.user.id)
            await this.$store.dispatch('getProfileInfos', this.$route.params.id)
        }
    }
  });
  </script>

<style scoped>
.v-avatar img {
  object-fit: cover;
  border-radius: 50%;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.button-container .v-btn {
  width: 100%;
  padding: 8px 12px;
  text-transform: none;
}

.game-history-container {
  max-height: 400px;
  overflow-y: auto;
}
</style>