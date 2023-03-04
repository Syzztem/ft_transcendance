<script lang="ts">

import vuetify from "@/plugins/vuetify";
import {reactive, ref, onMounted} from "vue";
import IMessage from '../models/IMessage'
import IChannel from "@/models/IChannel";
import IUser from "@/models/IUser";
import store from "@/store";
import { defineComponent } from 'vue';
import { mapActions ,mapState} from "vuex";
import {io} from 'socket.io-client';

const socket = io('http://localhost:3000');

/*
	TODO :

	- create a dialog for add channel and search channels
	- add channel function
	- merge la branche de louis
	- implementer create_channel via l api.
	- clickable profile on user -> opens 	OPTIONS PANEL	:	dm, profile page, add to friends, remove from friend block user, unblock user
											ADVANCED PANEL	:	promote/demote/ban/kick/unban
	- v-if (blocked) -> display red block icon
	- v-if display only available options (don t block if already blocked etc)
*/

export default defineComponent({
	data() {
		return {
			options: 
			[
				{ title: 'Send DM' },
				{ title: 'profile page' },
				{ title: 'add friend' },
				{ title: 'remove friend' },
				{ title: 'block user' },
				{ title: 'unblock user' },
			],
			dialog: false,
			newChannel: {
			name: '',
			description: ''
			}
		}
	},
	methods: {
		...mapActions(["selectChannel", "rmChannel"]),
		createChannel() {
      // call Vuex action to create the channel with this.newChannel data
      // reset the form fields
      this.newChannel.name = '';
      this.newChannel.description = '';
      // close the dialog
      this.dialog = false;
    }

	},
    computed: {
		username()
		{
			return this.$store.state.userInfos.username;
		},
		channels() {
			return this.$store.state.chat.channels
		},
		joined_channels() {
			return this.$store.state.chat.joined_channels
		},
		current_channel() {
			return this.$store.state.chat.current_channel
		},
		blocked_users() {
			return this.$store.state.chat.blocked_users
		},
		user_id() {
			return this.$store.state.user.id
		},
	},
	mounted() {
		store.commit('addChannel', {name: 'channel1', id : 0, users: [{name :'user1'}], messages:[{sender:'user1',content:'salut'}]} );
		store.commit('addChannel', {name: 'channel2', id: 1, users: [{name :'user42'}], messages:[{sender:'user42',content:'pouet'}]} );
		store.commit('addChannel', {name: 'channel3', id: 2, users: [{name :'user99'}], messages:[{sender:'user99',content:'yo'}]} );
		// store.commit('setChannels', channels);
		// socket.emit('findAllMessages', {}, (response : any) => {
		// 	console.log(response);
		// })
		// console.log('Mounted:', this.channels, this.joined_channels, this.current_channel, this.blocked_users)
		// console.log('username:', this.username)
	},
})

// const state = reactive
// 	<{
// 	  messages: [IMessage],
// 	  channels: [IChannel],
// 	  users: [IUser],
// 	  currentMessage: string,
// 	  UserName: string,
// 	}>
// 	({
// 	  messages: [{content: '', sender: ''}],
// 	  users:[{name: 'user1', channel_status:0}, {name: 'user2', channel_status:1},{name: 'user3', channel_status:1}],
// 	  channels: [{name: 'channel1'}, {name: 'channel2'},{name: 'channel3'}],
// 	  currentMessage: '',
// 	  UserName:'JHoWn',
// 	})

// function UpdateMessagesButton()
// {
// 	var message = new IMessage(state.currentMessage, state.UserName);
// 	state.messages.push(message);
// 	state.currentMessage = '';
// }

// function UpdateMessages(e: KeyboardEvent)
// {
//   if (e.key === 'Enter')
// 	  UpdateMessagesButton();
// }


</script>

<template>
	<v-layout>
		<v-container fluid>
			<v-main>
				<!-- Users -->
				<v-row class="mt-2 mb-2">
					<v-col>
						<v-card id="Users" align="center" height="80vh" width="17vw" class="rounded-xl">
							<v-card-title class="Userstitle">
								Users
							</v-card-title>
							<v-card height="75vh" id="Userscontent">
							<v-list-item v-for="user in current_channel.users">
								<v-card id="Usercard" class="d-flex align-center justify-center mt-4">
									<v-badge class="mt-2" dot location="top right" color="green"> 
									<v-badge location="bottom end" class="mb-2">
										<template v-slot:badge>
											<img src="@/assets/sens_interdit.webp"/>
										</template>
										<v-avatar size="60">
											<img
											src="https://cdn.vuetifyjs.com/images/john.jpg"
											alt="John"
											height="60"
											>
										</v-avatar>
									</v-badge>
									</v-badge>
									<v-card-text>
										{{user.name}}
										<v-menu activator="parent">
											<v-list>
												<v-list-item v-for="(item, index) in options" :key="index" :value="index">
													<v-list-item-title>
														{{ item.title }}
													</v-list-item-title>
												</v-list-item>
											</v-list>
										</v-menu>
									</v-card-text>
								</v-card>
							</v-list-item>
							</v-card>
						</v-card>
					</v-col>
					<v-spacer></v-spacer>

					<!-- Messages -->
					<v-col>
						<v-card :overflow-hidden="false" height="89vh" width="58vw" class="d-flex" align="center" color="transparent" bordered="0" flat>
							<v-row id = "RowMessagebox">
								<v-card id="Messagebox" class="rounded-xl mb-4" color="rgb(0, 0, 51, 0.87)" height="75vh" width="58vw">
									<v-card-title id="Messageboxtitle" class="align-item-center ">
										{{current_channel.name}}
									</v-card-title>
										<v-card-text class="Messagesscroller" align="left">
											<div v-for="message in current_channel.messages">
												<li v-if="message.content != ''">
													{{message.sender}}: {{message.content}}
												</li>
											</div>
										</v-card-text>
								</v-card>
								<!--Message Input -->
								<v-row justify="center">
									<v-card id="Inputbox" class="d-flex justify-center align-center rounded-xl" height="10vh" width="50vw" elevation="8">
										<v-text-field hide-details variant="plain" id="Inputfield" class = "ml-5" autofocus>
										</v-text-field>
										<v-card-actions>
											<v-btn id="Btnsend" height="5vh" width="7vw">
												Send
											</v-btn>
										</v-card-actions>
									</v-card>
								</v-row>
							</v-row>
						</v-card>
					</v-col>
					<v-spacer></v-spacer>

					<!-- Channels -->
					<v-col>
						<v-card id="Channels" class=" rounded-xl" align="center" height="80vh" width="17vw" >
							<v-card-title class ="Channelstitle">
								channels
							</v-card-title>
							<v-card id="Channelcreate" class="justify-center">
								<v-btn id="Btnchannel" class="mt-2 mr-4 mb-2" @click="dialog = true">
									+
								</v-btn>
								<v-dialog v-model="dialog" persistent max-width="500px">
								<v-card>
									<v-card-title>
									Create a New Channel
									</v-card-title>

									<v-card-text>
									<v-text-field label="Channel Name" v-model="newChannel.name"></v-text-field>
									<v-text-field label="Description" v-model="newChannel.description"></v-text-field>
									<!-- add any other form fields here -->
									</v-card-text>

									<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="error" text @click="dialog = false">Cancel</v-btn>
									<v-btn color="primary" @click="createChannel()">Create</v-btn>
									</v-card-actions>
								</v-card>
								</v-dialog>
								<v-btn id="Btnchannel" class="mt-2 mb-2">
									🔎
								</v-btn>
							</v-card>
							<v-card id="Channelscontent" height="65vh" >
								<v-list-item v-for="channel in joined_channels" :key="channel.id">
									<v-card 
										id="Channelcard" 
										class="d-flex align-center justify-center mt-4" 
										height="5vh"
										@click="selectChannel(channel)"
										v-bind:class="{ 'highlight': current_channel && current_channel.id == channel.id}"
									>
										{{channel.name}}
									</v-card>
								</v-list-item>
							</v-card>
							<v-card id="Channelactions">
								<v-card-actions class="justify-center">
									<v-btn
										id="Btnchannel"
										@click="rmChannel(current_channel.id)"
									>
										leave channel
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-card>
					</v-col>
				</v-row>
			</v-main>
		</v-container>
	</v-layout>
</template>



<style>

#Users {
	background-color:	rgb(0, 0, 128);
	font-family:		"Pokemon";
	overflow:			hidden!important;
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
	scrollbar-color:	gold;
	scrollbar-width :	auto;
}

#Userscontent
{
	background-color:	rgb(0, 0, 128);
	overflow-y:			scroll;
	scrollbar-color:	gold;
	scrollbar-width :	auto;
}

#Usercard
{
	background-color:	#4f60c1;
	color:				rgb(255, 200, 0);
}

.Userstitle
{
	background-color:	#4f60c1;
	font-family:		"Pokemon";
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

#RowMessagebox
{
	margin: 0;
}

#Messagebox
{
	background-color:	moccasin;
	overflow:			hidden!important;
	font-family:		"Pokemon";
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

#Messageboxtitle
{
	height:				5vh;
	background-color:	rgb(0, 0, 128);
	text-align:			inherit;
	font-family:		"Pokemon";
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

.Messagesscroller {
	height:				70vh;
	display:			flex;
	overflow:			auto;
	flex-direction:		column-reverse;
}

#Inputbox
{
	background-color:	#4f60c1;
}

#Inputfield
{
	background-color:	rgb(255, 255, 255);
	font-family: 		"monospace";
	color:  			black;
}

#Btnsend
{
	background-color:	rgb(0, 0, 128);
	font-family:		"Pokemon";
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

#Btnchannel
{
	background-color:	rgb(255, 200, 0);
	font-family:		"Pokemon";
	color:				black
}

#Channels
{
	background-color:	#4f60c1;
	font-family:		"Pokemon";
	overflow: 			hidden!important;
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

.Channelstitle
{
	background-color: #4f60c1;
	font-family: 		"Pokemon";
	color:				 rgb(255, 200, 0);
	text-shadow: 		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

#Channelcard
{
    background-color: #4f60c1;
    color: #ffd483;
}

#Channelscontent
{
	background-color:	rgb(0, 0, 128);
	font-family:		"Pokemon";
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
	overflow-y:			scroll;
	scrollbar-color:	gold;
	scrollbar-width :	auto;
}

#Channelcreate
{
	background-color: #283aa3;
}

#Channelactions
{
	background-color: #283aa3;
}

.highlight {
    color:				#f1c23b!important;
    background-color:	#283aa3!important;
}


</style>