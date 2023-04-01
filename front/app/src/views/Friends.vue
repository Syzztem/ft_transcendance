<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>Friends List</h1>
          <div class="friends-list" :class="{ 'scrollable': friends.length > maxFriends }">
            <v-list>
              <v-list-item v-for="(friend, index) in friends" :key="index">
                <div class="avatar">
                  <img :src="friend.avatar" :alt="friend.username" />
                  <span :class="statusClass(friend.status)"></span>
                </div>
                <v-list-item-content>
                  <v-list-item-title>{{ friend.username }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn color="error" @click="removeFriend(index)">Supprimer</v-btn>
                </v-list-item-action>
                <v-divider :thickness="3" class="border-opacity-100" ></v-divider>
              </v-list-item>
            </v-list>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    data() {
      return {
        friends: this.$store.state.userInfos.friends,
        maxFriends: 2
      };
    },
    async mounted() {
      await this.$store.dispatch('getStats');
      console.log(this.friends)
      this.friends = this.$store.state.userInfos.friends;
    },
    methods: {
      async removeFriend(id: any) {
        await this.$store.dispatch('unfriend', id);
        await this.$store.dispatch('getProfileInfos', id);
      },
      statusClass(status: string) {
        switch (status) {
          case 'online':
            return 'status-online';
          case 'offline':
            return 'status-offline';
          case 'in-game':
            return 'status-in-game';
          default:
            return '';
        }
      }
    }
  });
  </script>
  
  <style scoped>
    .friends-list {
      height: 500px;
    }
    .scrollable {
      overflow-y: scroll; 
    }
    .status-online {
      display: inline-block;
      width: 10px;
      height: 10px;
      background-color: green;
      border-radius: 50%;
      margin-left: 5px;
    }
    .status-offline {
      display: inline-block;
      width: 10px;
      height: 10px;
      background-color: gray;
      border-radius: 50%;
      margin-left: 5px;
    }
    .status-in-game {
      display: inline-block;
      width: 10px;
      height: 10px;
      background-color: orange;
      border-radius: 50%;
      margin-left: 5px;
    }

    .avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}
.status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}
  </style>