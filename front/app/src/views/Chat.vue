<script lang="ts">

import vuetify from "@/plugins/vuetify";
import {reactive, ref, onMounted} from "vue";
import IMessage from "@/models/IMessage";
import IChannel from "@/models/IChannel";
import IUser from "@/models/IUser";
import store from "@/store";
import { defineComponent } from 'vue';
import { mapActions ,mapState} from "vuex";
import { chatSocket } from "@/websocket";
import { onBeforeMount } from "vue";
import router from "@/router";

/*
	TODO :

	TEJ VUE WARNING !!
	update users in channels with leave/join front
	block
	PATCH bugs 2FA
	private channel
	invite to game(lina)
	change password channel
	promote
	ban (limited time)
	mute
	kick


	BACK
	change channel password
	kick (limited time)
	gestion de channel prive (front is sending the good DTO)

	- v-if display only available options (don t block if already blocked etc)
	- clickable profile on user -> opens 	OPTIONS PANEL	:	dm, profile page, add to friends, remove from friend block user, unblock user
											ADVANCED PANEL	:	promote/demote/ban/kick/unban
	persistance des messages
*/

export default defineComponent({
	data() {
		return {
			id: Number(localStorage.getItem('id')),
			options:
			[
				{ id: 1, title: 'Send DM' },
				{ id: 2, title: 'profile page' },
				{ id: 3, title: 'add friend' },
				{ id: 4, title: 'remove friend' },
				{ id: 5, title: 'block user' },
				{ id: 6, title: 'unblock user' },
				{ id: 7, title: 'invite to game' },
			],
			dialog: false,
			allchans_dialog: false,
			newChannel: {
				name: '',
				password: '',
				id: 0,
			},
			newJoinRequest:
			{
				channelName : '',
				password : '',
			},
			newMessage: '',
			chatSocket: chatSocket,
			avatar: this.$store.state.chat.avatars_list
		}
	},
	methods: {
		...mapActions(
			["selectChannel", "rmChannel", "receiveMessage", "joinChannel",
			"stopReceiving", "getUserChannels", "getAllChannelsStore", "updateChannelsStore"],),
		createPublicChannel(newChan : any)
		{
			const channel_dto = {
				name: newChan.name,
				adminId: this.id,
				password: newChan.password
			};
			this.chatSocket.emit('create', channel_dto);
			chatSocket.
			once('newChannel', (response: any) => {
				this.$store.dispatch('createChannel', response);
			})
			this.dialog = false;
		},
		async selectChannel(channel: IChannel) {
			await this.$store.dispatch('selectChannel', channel)
		},
		getAllChannels()
		{
			this.getAllChannelsStore();
			chatSocket.emit('getAll');
			this.allchans_dialog = true;
		},
		sendDM(message: string) {
			if (!this.current_channel)
				return
			console.log('obj: ', this.current_channel)
			const send = {
				message: message,
				id1: this.id,
				id2: this.current_channel.receiver.id
			}
			this.chatSocket.emit('sendDM', send)
		},
		sendMessage(newMessage: string)
		{
			if (!this.current_channel)
				return
			if (this.current_channel.sender)
				return this.sendDM(newMessage)
			const message_dto = {
				message : newMessage,
				channelId : this.current_channel.id,
				senderId : this.id,
			};
			this.newMessage = '';
			this.chatSocket.emit('newmsg' , message_dto);
		},

		async startReceivingMessages() {
			await this.receiveMessage();
		},
		async stopReceivingMessages()
		{
			await this.stopReceiving();
		},
		async updateChannels(channel : any)
		{
			await this.updateChannelsStore(channel);
		},
		joinChannel(channel : any, password : string)
		{
			const join_dto = {chanId: channel.id, uid: this.id, password : password};
			console.log('join dto :', join_dto);
			this.chatSocket.emit('join', join_dto);
		},
		leaveChannel(id : any)
		{
			const leave_dto = {chanId: id, uid: this.id, password : ''};
			console.log('leave DTO', leave_dto);
			this.chatSocket.emit('leave', leave_dto);
		},
		handleChatUsers(item: any, user: any) {
			switch(item.id) {
				case 1: {
					// this.chatSocket.emit('sendDM', dmDTO);
				}
				case 2: {
					this.$router.push('/profile/' + user.id)
				}
				// case 3: {
				// 	this.chatSocket.emit('addfriend', addfriendDTO)
				// }
				// case 4: {
				// 	this.chatSocket.emit('rmfriend', rmfriendDto)
				// }
				// case 5: {
				// 	this.chatSocket.emit('block user', )

				// }
				// case 6: {
				// 	this.chatSocket.emit('unblock user')
				// }
				// case 7: {}
			}
		}
	},
    computed: {
		user() {return this.$store.state.userInfos},
		username() {return this.$store.state.userInfos.username},
		channels() {return this.$store.state.chat.channels},
		joined_channels() {return this.$store.state.chat.joined_channels},
		dms_list() {return this.$store.state.chat.dms_list},
		current_channel() {return this.$store.state.chat.current_channel},
		blocked_users() {return this.$store.state.chat.blocked_users},
		available_channels() {return this.$store.state.chat.available_channels},
	},
	mounted() {
		this.startReceivingMessages();
		chatSocket.on('sendAllChannels', (channels : any) => {
			const res: any = []
			for (const chan of channels) {
				const index = this.$store.state.chat.joined_channels.findIndex((element: any) => element.id === chan.id)
				if (index === -1)
					res.push(chan)
			}
			this.$store.state.chat.available_channels = res
		})
		chatSocket.on('joined_channel', (res : any ) => {
			if (res.user.id == this.id)
			{
				this.updateChannels(res.channel);
				console.log("updateChannels");
			}
			else
				console.log(res.user.username + " joined " + res.channel.name)
		})
		chatSocket.on('left_channel' , (res: any) => {
			console.log("wubba lubba dub dub");
			console.log('leave channel uid dto :' , res.uid);
			console.log(`User ${res.uid} left channel ${res.channel}`);
			if (res.uid == this.id)
				this.rmChannel(res.channel.id);
			else
				console.log(res.uid + " left channel " + res.channel.name)
		})
		chatSocket.on('banned', (res:any) => {
			if (res.uid == this.id)
				this.rmChannel(res.channel.id);
			else
				console.log(res.uid + " was banned");
		})
		chatSocket.on('mod', (res: IChannel) => {
			console.log("promote/demote on " + res.name);
		})
		chatSocket.on('deleteChannel', (res: IChannel) => {
			console.log(res.name, " was deleted");
			this.rmChannel(res.id);
		})
	},
	unmounted() {
  		this.stopReceivingMessages();
		chatSocket.off('sendAllChannels');
		chatSocket.off('joined_channel');
		chatSocket.off('left_channel');
	},
})

</script>

<template>
	<v-container>
	<!-- Users -->
		<v-row id="MainRow">
			<v-col class="Column" align="center" width="100%">
				<v-card id="CardContent">
					<v-card-title class="CardTitle">
						Users
					</v-card-title>
					<ul v-if="current_channel">
						<li>
							<v-list-item v-for="user in current_channel.users">
								<v-card id="Usercard" class="d-flex align-center justify-center mt-4">
										<v-avatar size="60">
											<img
											:src="avatar.get(user.username)"
											alt="John"
											height="60"
											>
										</v-avatar>
									<v-card-text>
										{{user.username}}
										<v-menu activator="parent">
											<v-list id="LighterCard">
												<v-list-item v-for="(item, index) in options" :key="index" :value="index" @click="handleChatUsers(item, user)">
													<v-list-item-title>
														{{ item.title }}
													</v-list-item-title>
												</v-list-item>
											</v-list>
										</v-menu>
									</v-card-text>
								</v-card>
							</v-list-item>
						</li>
					</ul>
				</v-card>
			</v-col>

			<!-- Messages -->
			<v-col id="ChatColumn">
				<v-card id="Messagebox" width="100%">
					<v-card-title class="CardTitle" id="ChanTitle" v-if="current_channel">
						{{current_channel.name}}
					</v-card-title>
					<v-card-text class="Messagesscroller" height="100%" align="left">
						<ul v-if="current_channel">
							<div v-for="message in current_channel.messages">
								<li id="messContent" v-if="message.content != ''">
									<span id="username">{{message.sender.username}}</span>: {{message.content}}
								</li>
							</div>
						</ul>
					</v-card-text>
				</v-card>
				<v-row justify="center">
					<v-card id="Inputbox" class="d-flex" elevation="8">
						<v-text-field v-model="newMessage" v-on:keydown.enter="sendMessage(newMessage)" hide-details density="compact" id="Inputfield" autofocus>
						</v-text-field>
						<v-card-actions>
							<v-btn id="Btnsend"
							@click="sendMessage(newMessage)"
							>
								Send
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-row>
			</v-col>

			<!-- Channels -->
			<v-col class="Column" align="center" width="100%">
				<v-card id="CardContent" v-if="joined_channels">
					<v-card-title class ="CardTitle">
						channels
					</v-card-title>
					<v-card id="Channelcreate" class="justify-center">
						<v-btn id="Btnchannel" class="mt-2 mr-4 mb-2" @click="dialog = true">
							<p class="alttxt">
								Add
							</p>
							<img class="alticon" src="@/assets/add.png" />
						</v-btn>
						<v-dialog v-model="dialog" max-width="500px">
						<v-card id="Dialogbox">
							<v-card-title>
								Create a New Channel
							</v-card-title>
							<v-card-text>
								<v-text-field label="Channel Name" v-model="newChannel.name"></v-text-field>
								<v-text-field label="Password" v-model="newChannel.password"></v-text-field>
							</v-card-text>
							<v-card-actions>
							<v-spacer/>
								<v-btn color="error" text @click="dialog = false">Cancel</v-btn>
								<v-btn color="primary" @click="createPublicChannel(newChannel)">Create</v-btn>
							</v-card-actions>
						</v-card>
						</v-dialog>
						<v-btn id="Btnchannel" class="mt-2 mb-2"
							@click="getAllChannels"
						>
							<p class="alttxt">
								Search
							</p>
							<img class="alticon" src="@/assets/magnifying-glass.png" />
						</v-btn>
						<v-dialog v-model="allchans_dialog" max-width="500">
						<v-card id="Dialogbox">
							<v-card-title class="ChanlistTitle text-center">
								Channels list
							</v-card-title>
							<v-list-item v-for="channel in available_channels" :key="channel.id">
								<v-card
								id="LighterCard"
								class="d-flex flex-column align-center justify-center mt-4 mx-4 pa-4"
								height="auto"
								elevation="2"
								>
								<div class="d-flex align-center justify-center mb-2">
									<span class="font-weight-bold">{{channel.name}}</span>
								</div>
								<div class="d-flex align-center justify-center mb-2">
									<div class="d-flex align-center justify-center">
										<v-text-field v-model="newJoinRequest.password"
										class="mx-2"
										label="Password"
										type="password"
										single-line
										dense
										hide-details
										outlined
										style="width: 150px;"
										></v-text-field>
									</div>
									<v-btn color="primary" class="mr-2" @click="joinChannel(channel , newJoinRequest.password)">
										Join
									</v-btn>
									</div>
								</v-card>
							</v-list-item>
							</v-card>
						</v-dialog>
					</v-card>
					<v-card id="ChanContent" v-if="joined_channels">
								<v-list-item v-for="dm in dms_list">
									<v-card id="DMcard" class="d-flex align-center justify-center mt-4" height="5vh" @click="selectChannel(dm)">
										{{ dm.receiver.username }}
									</v-card>
								</v-list-item>
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
								class="altbtn"
								id="Btnchannel"
								@click="leaveChannel(current_channel ? current_channel.id : -1)"
								
							>
								<p class="alttxt">
								leave channel
								</p>
								<img class="alticon" src="@/assets/fleche-droite.png" />
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<style scoped>
.v-container {
	max-width: 			none;
	padding:			0px;
	display:			flex;
}

.ChanlistTitle {
	font-family: 		"pokemon"!important;
	color:				rgb(255, 200, 0);
	text-shadow:		0px 0px 3px rgb(5, 6, 105);
	font-size:			2em;
	letter-spacing: 	2px;
	padding-top: 20px;
	padding-bottom: 0px;
}

</style>

<style>

#MainRow {
	margin-top:			3%!important;
	margin-left:		5%!important;
	margin-bottom:		3%;
	margin-right:		5%;
	display:			flex;
	flex-direction:		row;
	gap: 				3%;
	flex-grow:			1;
	flex-basis:			0;
}

.Column {
	flex-grow:			1;
	overflow: 			hidden!important;
}

#ChatColumn {
	display:			flex;
	flex-direction:		column;
	gap:				20px;
	flex-grow:			5;
	overflow: 			hidden!important;
}

#ChanContent {
	background-color:	transparent;
	box-shadow:			none;
}

#CardContent
{
	background:			linear-gradient(0deg, rgba(140, 0, 255, 0.479) 0%, rgb(32, 32, 134) 7%, rgb(29 25 94) 13%, rgb(26 26 122 / 93%) 35%, rgb(55 53 155 / 71%) 100%);
	overflow:			auto;
	display:			flex;
	flex-direction:		column;
	backdrop-filter: 	blur(4px);
	height:				100%;
	border-bottom:		solid 6px rgba(218, 154, 255, 0.74);
	border-radius:		22px 22px 10px 10px;
}

#Usercard
{
	background-color:	rgb(55 53 155 / 71%);
	color:				rgb(255, 200, 0);
}

.CardTitle
{
	font-family:		"Pokemon";
	height:				35px!important;
	min-height:			35px!important;
	flex-shrink: 0;
	flex-grow: 1;
	flex-basis: 0;
	letter-spacing:		1.5px!important;
	color:				#ffae00;
	text-shadow:		0px 0px 3px rgb(5, 6, 105);
	background:			linear-gradient(180deg, rgb(29 25 94) 0%, rgb(30, 30, 126) 30%, rgba(55, 53, 155, 0) 100%);
}

#ChanTitle {
	text-align:			center;
	height:				35px!important;
	min-height:			35px!important;
}

#Dialogbox
{
	background:			linear-gradient(0deg, rgb(33, 0, 87) 0%, rgba(55, 26, 122, 0.93) 35%, rgba(55, 43, 170, 0.555) 100%);
	backdrop-filter: 	blur(6px);
	border-radius:		10px 10px 10px 10px;
	border-bottom:		solid 6px rgba(151, 88, 187, 0.74);
	overflow:			auto!important;
	font-family:		"pixel";
	color:				rgb(212, 211, 221);
}

.Messagesscroller {
	flex-direction:		column-reverse!important;
	flex-grow:			1;
	flex-basis:			0!important;
	padding-left:		20px!important;
	display:			flex;
	overflow-x:			auto;
}

#Messagebox
{
	background:			linear-gradient(0deg, rgb(29 25 94) 0%, rgb(26 26 122 / 93%) 35%, rgb(55 53 155 / 71%) 100%);
	backdrop-filter: 	blur(4px);
	border-radius:		22px 22px 10px 10px;
	height:				100%;
	flex-grow:			2;
	display:			flex;
	flex-direction: 	column;
	justify-content:	stretch;
	border-bottom: 		solid 6px white;
	overflow:			hidden!important;
	font-family:		"Pokemon";
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

#Inputbox
{
	background:			linear-gradient(180deg, rgb(45, 40, 138) 0%, rgba(70, 68, 167, 0.788) 100%);
	flex-grow: 			1;
	display: 			flex;
	backdrop-filter:	blur(4px);
	border-radius:		10px;
	flex-direction:		row;
	align-items:		center;
	gap : 				5px;
	margin: 12px;
}

#Inputfield
{
	background-color:	rgb(255, 255, 255);
	font-family: 		"pixel";
	letter-spacing: 	0.7px;
	border-radius:		5px;
	flex-grow:			1;
	font-size:			0.7em;
	margin: 12px;
	color:  			black;
}

#Btnsend
{
	background-color:	rgb(0, 0, 128);
	font-family:		"Pokemon";
	width:				60px;
	height:				40px;
	flex-grow:			0;
	flex-basis:			0;
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

#Btnchannel
{
	background:			linear-gradient(180deg, rgb(255, 189, 89) 0%, rgb(221, 151, 0) 100%);
	font-family:		"Pokemon";
	color:				rgb(11, 45, 95);
}

#Channelcard
{
    background-color:	rgb(76, 75, 177);
}

#DMcard
{
    background-color: #c73232;
    color: #ffd483;
}

#Channelscontent
{
	background-color:	rgb(0, 0, 128);
	font-family:		"Pokemon";
    color:				#ffce74;
}

#Channelcreate
{
	background-color: 	transparent;
}

#Channelactions
{
	width: 100%;
	background-color:	#16268000;
	position: fixed;
	bottom: 0;
	left: 0;
}

.highlight {
    color:				#ffae00!important;
    background-color:	#162680!important;
}

.alticon {
	display: 			none;
}

#messContent {
	font-family: 		"pixel";
	font-size: 			10px;
	text-shadow: 		none;
	color: 				rgb(255, 255, 255);
}

#username {
	color: 				rgb(149, 151, 245);
}

@media(max-width: 1477px) {

#Btnchannel {
	padding: 			0px;
	min-width: 			0px!important;
}

.alticon {
	display: 			block;
	width: 				35px!important;
	height: 			35px!important;
	filter: 			invert(7%) sepia(33%) saturate(7480%) hue-rotate(242deg) brightness(95%) contrast(101%);
}

.alttxt {
	display: 			none;
}

}

</style>
