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

/*
	TODO :


	current : broadcast, dialog pop

	current :  add panel

	broadcast in correct channel id when receiving a message
	list channels -> front
	join , leave
	search channel
	moderation front -> todo : basic request tests
	channel history



	- clickable profile on user -> opens 	OPTIONS PANEL	:	dm, profile page, add to friends, remove from friend block user, unblock user
											ADVANCED PANEL	:	promote/demote/ban/kick/unban
	- v-if (blocked) -> display red block icon
	- v-if display only available options (don t block if already blocked etc)

*/

export default defineComponent({
	data() {
		return {
			id: Number(localStorage.getItem('id')),
			options: 
			[
				{ title: 'Send DM' },
				{ title: 'profile page' },
				{ title: 'add friend' },
				{ title: 'remove friend' },
				{ title: 'block user' },
				{ title: 'unblock user' },
				{ title: 'invite to game' },
			],
			dialog: false,
			allchans_dialog: false,
			newChannel: {
				name: '',
				password: '',
				id: 0,
			},
			newMessage: '',
			chatSocket: chatSocket,
		}
	},
	methods: {
		...mapActions(["selectChannel", "rmChannel", "sendMessage", "receiveMessage", "joinChannel","stopReceiving", "getUserChannels", "getAllChannelsStore"],),
		createChannel(newChan : any)
		{
			const channel_dto = {
				name: newChan.name,
				adminId: this.id,
				password: newChan.password,
			};
			this.chatSocket.emit('create', channel_dto);
			chatSocket.
			once('newChannel', (response: any) => {
				this.$store.dispatch('createChannel', response);
			})
			this.dialog = false;
		},
		getAllChannels()
		{
			console.log('getallchannels chat.vue')
			this.getAllChannelsStore();
			chatSocket.emit('getAll');
			this.allchans_dialog = true;

			
		},
		sendMessage(newMessage : string)
		{		
			const message_dto = {
				message : newMessage,
				channelId : this.current_channel.id,
				senderId : this.id,
			};
			this.chatSocket.emit('newmsg' , message_dto);
		},

		async startReceivingMessages() {
			await this.receiveMessage();
		},
		async stopReceivingMessages()
		{
			await this.stopReceiving();
		},

		// joinChannel()
		// {
		// 	const chan_id = 1;
		// 	const join_dto = {chanId: chan_id, uid: this.id, password : ''};
		// 	console.log('join DTO', join_dto);
		// 	this.chatSocket.emit('join', join_dto);
		// },
		// leaveChannel()
		// {
		// 	const chan_id = 1;
		// 	const join_dto = {chanId: chan_id, uid: this.id, password : ''};
		// 	console.log('join DTO', join_dto);
		// 	this.chatSocket.emit('leave', join_dto);
		// },
	},
    computed: {
		user() {return this.$store.state.userInfos},
		username() {return this.$store.state.userInfos.username},
		channels() {return this.$store.state.chat.channels},
		joined_channels() {return this.$store.state.chat.joined_channels},
		current_channel() {return this.$store.state.chat.current_channel},
		blocked_users() {return this.$store.state.chat.blocked_users},
		available_channels() {return this.$store.state.chat.available_channels}
	},
	mounted() {
		console.log('start receiving messages');
		this.startReceivingMessages();
		chatSocket.on('sendAllChannels', (channels : any) =>
		{this.$store.state.chat.available_channels = channels;})
	},
	unmounted() {
		console.log('hey we stop receiving ===> unmount');
  		this.stopReceivingMessages();
		chatSocket.off('sendAllChannels');
	},
})

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
							<ul v-if="current_channel">
								<li>
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
												{{user.username}}
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
								</li>
							</ul>
							</v-card>
						</v-card>
					</v-col>
					<v-spacer></v-spacer>

					<!-- Messages -->
					<v-col>
						<v-card :overflow-hidden="false" height="89vh" width="58vw" class="d-flex" align="center" color="transparent" bordered="0" flat>
							<v-row id = "RowMessagebox">
								<v-card id="Messagebox" class="rounded-xl mb-4" color="rgb(0, 0, 51, 0.87)" height="75vh" width="58vw">
									<v-card-title id="Messageboxtitle" class="align-item-center " v-if="current_channel">
										{{current_channel.name}}
									</v-card-title>
									<v-card-text class="Messagesscroller" align="left">
										<ul v-if="current_channel">
											<div v-for="message in current_channel.messages">
												<li v-if="message.content != ''">
													{{message.sender.username}}: {{message.content}}
												</li>
											</div>
										</ul>
									</v-card-text>
								</v-card>
								<v-row justify="center">
									<v-card id="Inputbox" class="d-flex justify-center align-center rounded-xl" height="10vh" width="50vw" elevation="8">
										<v-text-field v-model="newMessage" hide-details variant="plain" id="Inputfield" class = "ml-5" autofocus >
										</v-text-field>
										<v-card-actions>
											<v-btn id="Btnsend" height="5vh" width="7vw"
											@click="sendMessage(newMessage)"	
											>
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
								<v-dialog v-model="dialog" max-width="500px">
								<v-card>
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
										<v-btn color="primary" @click="createChannel(newChannel)">Create</v-btn>
									</v-card-actions>
								</v-card>
								</v-dialog>
								<v-btn id="Btnchannel" class="mt-2 mb-2"
									@click="getAllChannels"
								>
									🔎
								</v-btn>
								<v-dialog v-model="allchans_dialog" max-width="500">
  <v-card>
    <v-card-title class="text-h4 font-weight-bold text-center">
      Channels list
    </v-card-title>
    <v-divider></v-divider>
    <v-list-item-group>
      <v-list-item v-for="channel in available_channels" :key="channel.id">
        <v-card
          id="Channelcard"
          class="d-flex flex-column align-center justify-center mt-4 mx-4 pa-4"
          height="auto"
          elevation="2"
        >
          <div class="d-flex align-center justify-center mb-2">
            <span class="font-weight-bold">{{channel.name}}</span>
          </div>
          <div class="d-flex align-center justify-center mb-2">
            <v-btn color="primary" class="mr-2" @click="joinChannel(channel.id)">
              Join
            </v-btn>
          </div>
          <div class="d-flex align-center justify-center">
            <v-text-field
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
        </v-card>
      </v-list-item>
    </v-list-item-group>
  </v-card>
</v-dialog>

							</v-card>
							<v-card id="Channelscontent" height="65vh" v-if="joined_channels">
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
	overflow:			auto;
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
	overflow:			auto;
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