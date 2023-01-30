<script setup lang="ts">

import vuetify from "@/plugins/vuetify";
import {reactive, ref, onMounted} from "vue";
import IMessage from '../models/IMessage'
import IChannel from "@/models/IChannel";
import IUser from "@/models/IUser";

const state = reactive
	<{
	  messages: [IMessage],
	  channels: [IChannel],
	  users: [IUser],
	  currentMessage: string,
	  UserName: string,
	}>
	({
	  messages: [{content: '', sender: ''}],
	  users:[{name: 'user1', channel_status:0}, {name: 'user2', channel_status:1},{name: 'user3', channel_status:1}],
	  channels: [{name: 'channel1'}, {name: 'channel2'},{name: 'channel3'}],
	  currentMessage: '',
	  UserName:'JHoWn',
	})

function UpdateMessagesButton()
{
	var message = new IMessage(state.currentMessage, state.UserName);
	state.messages.push(message);
	state.currentMessage = '';
}

function UpdateMessages(e: KeyboardEvent)
{
  if (e.key === 'Enter')
	  UpdateMessagesButton();
}
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
							<v-list-item v-for="user in state.users">
								<v-card id="usercard" class="d-flex align-center justify-center mt-4">
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
									</v-card-text>
								</v-card>
							</v-list-item>
						</v-card>
					</v-col>
					<v-spacer></v-spacer>

					<!-- Messages -->
					<v-col cols="7" class="ml-2 mr-2">
						<v-card id="Messagewrapper" height="85vh" width="58vw" class="d-flex rounded-xl" align="center" color="transparent" bordered="0" flat>
							<v-row>
								<v-card id="Messagebox" color="rgb(0, 0, 51, 0.87)" height="75vh" width="58vw">
									<v-card-title id="Messageboxtitle" class="mt-2 mb-2">
										JHoWn's channel
									</v-card-title>
									<div class ="Messagesscroller" align="left">
										<v-card-text>
											<div v-for="message in state.messages">
												<li v-if="message.content != ''">
													{{message.sender}}: {{message.content}}
												</li>
											</div>
										</v-card-text>
									</div>
								</v-card>
								<!--Message Input -->
								<v-card class="d-flex rounded-xl" color="green" height="10vh" width="50vw">
									<v-text-field id="Inputfield" class="mt-4 ml-10" autofocus v-model="state.currentMessage" @keydown="UpdateMessages">
									</v-text-field>
									<v-card-actions>
										<v-btn id="Btnsend" @click = "UpdateMessagesButton">
											Envoyer
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-row>
						</v-card>
					</v-col>
					<v-spacer></v-spacer>

					<!-- Channels -->
					<v-col cols="2">
						<v-card id="Channels" align="center" height="80vh" class="mt-2 mb-2 rounded-xl">
							<v-card-title class ="Channelstitle">
								channels
							</v-card-title>
							<v-card class="justify-center" id="Channelcreate">
								<v-btn>
									create channel
								</v-btn>
							</v-card>
							<v-card height="65vh" id="Channelscontent">
								<v-list-item v-for="channel in state.channels">
									{{channel.name}}
								</v-list-item>	
							</v-card>
							<v-card-actions><v-btn>leave/join channel</v-btn></v-card-actions>
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
}

#usercard
{
	background-color:	rgb(200, 164, 128);
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

#Inputfield
{
	/* bg-color="rgb(255, 255, 255)" */
	background-color:	rgb(255, 255, 255);
	font-family: 		"Pokemon";
	color:  			rgb(233, 150, 122);
}

.Messagesscroller {
	height:				80vh;
	display:			flex;
	flex-direction:		column-reverse;
	overflow-y:			scroll;
	scrollbar-color:	gold;
	scrollbar-width :	auto;
}

#Btnsend
{
	background-color:	blueviolet;
	font-family:		"Pokemon";
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
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

#Channelscontent
{
	background-color:	rgb(0, 0, 128);
	font-family:		"Pokemon";
	color:				rgb(255, 200, 0);
	text-shadow:		2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

.Channelcreate
{
	background-color:	moccasin;
}


</style>