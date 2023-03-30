<template>
    <v-container>
      <v-row justify="center">
        <v-card>
          <v-row align="center">
            <v-col cols="12" sm="3" class="text-center">
              <v-avatar size="200">
                <img :src="user.avatar" :alt="user.username" />
              </v-avatar>
              <v-btn color="primary" @click="goToChangeAvatar" class="mt-2">
                Change avatar
              </v-btn>
            </v-col>
            <v-col cols="12" sm="9">
              <h1>{{ user.username }}</h1>
              <v-btn color="primary" @click="goToChangeUsername" class="mb-2">
                Change username
              </v-btn>
              <h2>Game Statistics</h2>
              <p>Total Games : {{ user.gameStats.played }}</p>
              <p>Wins : {{ user.gameStats.won }}</p>
              <p>Losses : {{ user.gameStats.lost }}</p>
              <h3>Game History :</h3>
              <div class="game-history-container">
                <div v-for="(game, index) in user.gameHistory" :key="game.id">
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
  import { defineComponent } from "vue";
  import { useRouter } from "vue-router";
  
  export default defineComponent({
    name: "PrivateProfile",
    data() {
      return {
        user: {
          id: 0,
          username: "",
          avatar: "",
          gameStats: {
            played: "",
            won: "",
            lost: "",
          },
          gameHistory: this.$store.state.profileInfos.games,
        },
      };
    },
    setup() {
      const router = useRouter();
      return { router };
    },
    async mounted() {
      await this.$store.dispatch("getStats");
      this.user.gameStats.played =
        this.$store.state.profileInfos.wins +
        this.$store.state.profileInfos.losses;
      this.user.gameStats.won = this.$store.state.profileInfos.wins;
      this.user.gameStats.lost = this.$store.state.profileInfos.losses;
      this.user.gameHistory = this.$store.state.profileInfos.games;
      this.user.avatar = this.$store.state.userInfos.profilePic;
      this.user.username = this.$store.state.userInfos.username;
    },
    methods: {
      goToChangeAvatar() {
        this.router.push("/avatar");
      },
      goToChangeUsername() {
        this.router.push("/username");
      },
    },
  });
  </script>
  
  <style scoped>
  .game-history-container {
    max-height: 400px;
    overflow-y: auto;
  }
  
  .v-image__image {
    max-width: 100%;
    height: auto;
  }
  </style>