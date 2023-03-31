<!-- <template>
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
  </template> -->

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

<template>
	<v-container id="ProfileContainer">
		<v-row id="MainCol">
			<div class="CardSpacer"></div>
			<div id="CardContainer">
				<div id="TrainerPic">
					<img id="Pic" :src="user.avatar" :alt="user.username" />
					<div id="ChangepicBtn" @click="goToChangeAvatar">
						<img id="ChangepicIcon" src="@/assets/edit-image.png"/>
					</div>
				</div>
				<v-card id="TrainerCard">
					<div id="TrainerTxt">
						<span id="UsernameTitle">{{ user.username }} <span id="TrainerTitle">trainer card</span></span>
						<div id="ChangenameBtn" @click="goToChangeUsername">
							<img id="ChangepicIcon" src="@/assets/editer.png"/>
						</div>
					</div>
					<v-card id="TrainerStat">
						<h2>Game Statistics</h2>
						<p><span id="sub">Total Games</span> : {{ user.gameStats.played }}</p>
						<p><span id="sub">Wins</span> : {{ user.gameStats.won }}</p>
						<p><span id="sub">Losses</span> : {{ user.gameStats.lost }}</p>
					</v-card>
				</v-card>
			</div>
			<v-card id="HistoryContainer">
				<div id="itsaMatch">
				</div>
                <div id="itsaMatch" v-for="(game, index) in user.gameHistory" :key="game.id">
                  <p>Date : {{ game.timestamp }}</p>
                  <p>Score : {{ game.player1Score }} : {{ game.player2Score }}</p>
                  <p>Winner : {{ game.winner }}</p>
                  <p>Looser : {{ game.looser }}</p>
                  <p>Game ID : {{ game.id }}</p>
				</div>
			</v-card>
			<div class="CardSpacer"></div>
		</v-row>
	</v-container>
</template>

  <style scoped>

.CardSpacer {
	flex-grow:			3;
}

#ProfileContainer {
	display: 			flex;
	flex-direction: 	column;
	justify-content: 	center;
	align-items:		center;
}

#MainCol {
	display: 			flex;
	flex-direction: 	column;
	gap:				30px;
}

#CardContainer {
	display: 			grid;
	flex-grow: 			4;
	align-items: center;
	max-height:			190px;
	min-height:			190px;
	width:				500px;
}

#TrainerCard {
	grid-row-start: 2;
	grid-row-end: 2;
	grid-column-start: 2;
	grid-column-end: 4;
	grid-row: 1;
	border-left: solid 4px #1a0553;
	border-bottom: solid 3px #7e66c0;
	display: flex;
	border-radius: 8px;
	backdrop-filter: blur(7px);
	flex-direction: column;
	justify-content: stretch;
	align-items: center;
	background-color:	rgba(15, 0, 102, 0.664);
	width: 	420px;
	height: 200px;
}

#TrainerPic {
	grid-row-start: 1;
	grid-row-end: 1;
	grid-column-start: 1;
	grid-column-end: 3;
	grid-row: 1;
	z-index: 1;
	display: grid;
	height: 160px;
	width: 160px;
	align-items: end;
	justify-content: end;
}

#Pic {
	align-self: stretch;
	justify-self: stretch;
	border-radius: 50%;
	grid-column: 1;
	grid-row: 1;
	box-shadow: -2px 0px 3px #00000069;
	border-top: solid 4px #1a0553;
	border-right: solid 6px #1a0553;
	height: 160px;
	width: 160px;
}

#ChangepicBtn {
	background:	linear-gradient(0deg,rgb(197, 197, 197) 0%, rgb(167, 167, 177) 50%, rgba(169, 169, 240, 0.93) 100%);
	box-shadow: 0px 0px 3px #00000069;
	align-self: end;
	justify-self: end;
	grid-column: 1;
	grid-row: 1;
	backdrop-filter: blur(7px);
	height: 40px;
	width: 40px;
	z-index: 5;
	border-radius: 0px 90px 90px 90px;
}

#ChangepicIcon {
	height: 100%;
	width: 100%;
	padding: 7px;
}

#ChangepicBtn:hover {
	background:	linear-gradient(0deg,rgb(255, 255, 255) 0%, rgb(194, 194, 202) 50%, rgba(183, 183, 241, 0.93) 100%);
}

#ChangepicBtn:active {
	filter: brightness(1.3);
}

#TrainerTxt {
	flex-grow: 1;
	background:	linear-gradient(180deg,rgba(0, 0, 0, 0) 0%, rgba(7, 6, 71, 0.678) 100%);
	padding: 6px;
	height: 12px;
	align-self: end;
	width: 100%;
	display: grid;
}

#TrainerTitle {
	font-family: "pixel";
	font-size: 7px!important;
	color: rgb(132, 100, 173);
}

#UsernameTitle {
	font-family: "pokemon";
	font-size: 25px;
	text-shadow:	0px 0px 3px rgb(5, 6, 105);
	color: rgb(255, 217, 0);
	justify-self:center;
	letter-spacing: 4px;
	padding-left: 20px;
	padding-top: 3px;
	grid-row: 1;
}

#ChangenameBtn {
	background:	linear-gradient(0deg,rgb(197, 197, 197) 0%, rgb(167, 167, 177) 50%, rgba(169, 169, 240, 0.93) 100%);
	box-shadow: 0px 0px 3px #00000069;
	margin-top: 3px;
	justify-self: end;
	grid-row: 1;
	backdrop-filter: blur(7px);
	height: 28px;
	width: 28px;
	z-index: 5;
	border-radius: 90px 90px 90px 0px;
}

#ChangenameBtn:hover {
	background:	linear-gradient(0deg,rgb(255, 255, 255) 0%, rgb(194, 194, 202) 50%, rgba(183, 183, 241, 0.93) 100%);
}

#ChangenameBtn:active {
	filter: brightness(1.3);
}

#TrainerStat {
	flex-grow: 3;
	margin-right: 20px;
	margin-bottom: 15px;
	margin-top: 10px;
	align-self: end;
	background:	linear-gradient(0deg,rgba(128, 110, 163, 0.712) 0%, rgba(117, 120, 155, 0.274) 100%);
	border-radius: 10px 0px 10px 10px;
	padding: 6px;
	height: 24px;
	width: 300px;
	display: grid;
}

h2, p{
	font-style: none;
	font-family: pixel;
}

h2 {
	font-family: pixel;
	font-size: 17px;
	color:rgb(218, 176, 247);

}

p {
	font-size: 11px;
	color:rgb(201, 201, 212);

}

#sub {
	color:#fad635;
}

#HistoryContainer {
	flex-grow: 			4;
	min-height:			400px;
	border-top: solid 4px #5d44a3;
	border-bottom: solid 4px #1a0553;
	display: flex;
	border-radius: 13px;
	backdrop-filter: blur(12px);
	flex-direction: column;
	background-color:	rgba(24, 8, 112, 0.63);
}

#itsaMatch {
	flex-grow: 1;
	margin: 10px;
	background:	linear-gradient(0deg,rgba(128, 110, 163, 0.712) 0%, rgba(117, 120, 155, 0.274) 100%);
	border-radius: 10px 10px 10px 10px;
	padding: 6px;
	max-height: 100px;
	min-height: 100px;
	/* width: 300px; */
	display: grid;
}

  .game-history-container {
    max-height:			400px;
    overflow-y:			auto;
  }

  .v-image__image {
    max-width:			100%;
    height:				auto;
  }
  </style>

<!--
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
</style> -->
