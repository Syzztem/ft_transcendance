<script lang="ts">

import vuetify from "@/plugins/vuetify";
import {reactive, ref, onMounted} from "vue";
import IMessage from '../models/IMessage'
import IChannel from "@/models/IChannel";
import IUser from "@/models/IUser";
import store from "@/store";
import { defineComponent } from 'vue';
import { mapActions } from "vuex";
import {io} from 'socket.io-client';

const socket = io('http://localhost:3000');

/*
	TODO :

	- clickable channels  -> makes it be currently selected in the store.
	- get all current channels / add channels
	- research channels button
	- v-if leave/join if currently selected != current_channel
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
		}
	},
	methods: {

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
		console.log('user id :' + this.user_id);
		store.dispatch('getUserChannels', {
			id: this.user_id
		});
		let channels = [];
		channels.push({name: 'test_channel00'});
		store.commit('setChannels', channels);
		store.commit('updateCurrentChannel', {name: 'Addedchan', users: [{name :'user44'}, {name: 'user35'}], messages:[{sender:'sender',content:'message'}]});
		socket.emit('findAllMessages', {}, (response : any) => {
			console.log(response);
		})
		// store.commit('addChannel', {name: 'Addedchan', users: [{name :'user96'}], messages:[{sender:'sender2',content:'added_channel_message'}]} );
		// store.commit('removeChannel', 'InitChan');
		// store.commit('updateCurrentChannel', {name: 'Addedchan', users: [{name :'user44'}], messages:[{sender:'sender',content:'message'}]});
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
					<v-col cols="2">
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
					<v-col cols="7" class="ml-2 mr-2">
						<v-card id="Messagewrapper" height="85vh" width="58vw" class="d-flex rounded-xl" align="center" color="transparent" bordered="0" flat>
							<v-row>
								<v-card id="Messagebox" color="rgb(0, 0, 51, 0.87)" height="75vh" width="58vw">
									<v-card-title id="Messageboxtitle" class="mt-2 mb-2">
										{{current_channel.name}}
									</v-card-title>
									<div class ="Messagesscroller" align="left">
										<v-card-text>
											<div v-for="message in current_channel.messages">
												<li v-if="message.content != ''">
													{{message.sender}}: {{message.content}}
												</li>
											</div>
										</v-card-text>
									</div>
								</v-card>
								<!--Message Input -->
								<v-row justify="center">
									<v-card id="Inputbox" class="d-flex rounded-xl" height="10vh" width="50vw">
										<v-text-field  id="Inputfield" class="mt-4 ml-10" autofocus>
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
					<v-col cols="2">
						<v-card id="Channels" class="mt-2 mb-2 rounded-xl" align="center" height="80vh" >
							<v-card-title class ="Channelstitle">
								channels
							</v-card-title>
							<v-card id="Channelcreate" class="justify-center">
								<v-btn id="Btnchannel" class="mt-4">
									+
								</v-btn>
								<v-btn id="Btnchannel" class="mt-4">
									🔎
								</v-btn>
							</v-card>
							<v-card id="Channelscontent" height="65vh" >
								<v-list-item v-for="channel in joined_channels">
									<v-card id="Channelcard" class="d-flex align-center justify-center mt-4" height="5vh">
										{{channel.name}}
									</v-card>
								</v-list-item>
							</v-card>
							<v-card id="Channelactions">
								<v-card-actions class="justify-center">
									<v-btn id="Btnchannel">
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
	background-color:	rgb(82, 88, 122);
	color:				rgb(255, 200, 0);
}

.Userstitle
{
	background-color:	rgb(47, 79, 79);
	font-family:		"Pokemon";
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

#Messagebox
{
	background-color:	moccasin;
	font-family:		"Pokemon";
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

#Messageboxtitle
{
	height:				5vh;
	background-color:	rgb(0, 0, 128);
	font-family:		"Pokemon";
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}



.Messagesscroller {
	height:				80vh;
	display:			flex;
	flex-direction:		column-reverse;
	overflow-y:			scroll;
	scrollbar-color:	gold;
	scrollbar-width :	auto;
}

#Inputbox
{
	background-color:	rgb(47, 79, 79);
}

#Inputfield
{
	background-color:	rgb(255, 255, 255);
	font-family: 		"Pokemon";
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
	background-color:	rgb(47, 79, 79);
	font-family:		"Pokemon";
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

.Channelstitle
{
	background-color:	rgb(47, 79, 79);
	font-family: 		"Pokemon";
	color:				 rgb(255, 200, 0);
	text-shadow: 		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

#Channelcard
{
	background-color:	rgb(82, 88, 122);
	color:				rgb(255, 200, 0);
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
	background-color:	grey;
}

#Channelactions
{
	background-color:	grey;
}


</style>