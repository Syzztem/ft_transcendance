<script lang="ts" setup>

import { computed } from "@vue/reactivity";
import {reactive} from "vue";

class IMessage {
  constructor(content :string, sender:string) {
    this.content = content;
	this.sender = sender;
  }
  content: string
  sender:string
}

const state = reactive
	<{
	  messages: [IMessage]
	  currentMessage: string,
	  UserName: string,
	}>
	({
	  messages: [{content: '', sender: ''}],
	  currentMessage: '',
	  UserName:'JHoWn',
	})

function UpdateMessagesButton()
{
	var message = new IMessage(state.currentMessage, state.UserName);
	state.messages.push(message);
	state.currentMessage = ''
}

function UpdateMessages(e: KeyboardEvent)
{
  if (e.key === 'Enter')
	  UpdateMessagesButton();
}

</script>

<template>
	<v-layout>
			<v-container fluid id = "container">
			<v-main>
			<v-navigation-drawer class="users" location = "left">users
				<v-card height = 1000x>user 1</v-card>
			</v-navigation-drawer>
				<v-card height="1000px" color="#000FFF" id="messagebox">
				<v-card>messagebox</v-card>
					<div id="msgDiv" v-for="message in state.messages">
						<li v-if="message.content != ''">
							{{message.sender}}: {{message.content}}
						</li>
					</div>
				</v-card>
				<v-card>
					<input ref="inputbox" v-model="state.currentMessage" @keydown="UpdateMessages">
						<v-btn 
						size = "small"
						color = "secondary"
						@click = "UpdateMessagesButton"
						>
						Send
					</v-btn>
				</v-card>
			<v-navigation-drawer class="channels" location = "right">channels</v-navigation-drawer>
			</v-main>
		</v-container>
	</v-layout>
</template>


<style>
#container {
	font-family: "Pokemon";
	color: rgb(255, 200, 0);
	text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
  }

.users {
	font-family: "Pokemon";
	background-color: gray;
	color: rgb(255, 200, 0);
	text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
  }

#messagebox
{
	font-family: "Pokemon";
	background-color: moccasin;
	color: rgb(255, 200, 0);
	text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

.channels
{
	font-family: "Pokemon";
	background-color: beige;
	color: rgb(255, 200, 0);
	text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}

v-btn {
	font-family: "Pokemon";
	color: rgb(255, 200, 0);
	text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
}
</style>