<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>Friends List</h1>
          <div class="friends-list" :class="{ 'scrollable': friends.length > maxFriends }">
            <v-list>
              <v-list-item v-for="(friend, index) in friends" :key="index">
                <div class="avatar">
                  <img class="pic" :src="avatar.get(friend.username)" :alt="friend.username" />
                  <span class="status" :class="statusClass(friend.id)"></span>
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
        maxFriends: 2,
        avatar: this.$store.state.chat.avatars_list
      };
    },
    async mounted() {
      await this.$store.dispatch('receiveIsOnline')
      await this.$store.dispatch('isOnline')
      await this.$store.dispatch('getUserInfos');
      this.friends = this.$store.state.userInfos.friends;
      for (let friend of this.friends) {
        await this.$store.dispatch('getChatPic', friend.username)
      }
    },
    unmounted() {
      this.$store.dispatch('stopOnline')
    },
    methods: {
      async removeFriend(id: any) {
        await this.$store.dispatch('unfriend', id);
        await this.$store.dispatch('getProfileInfos', id);
      },
      statusClass(id: number) {
        const res: any = this.getStatus(id)
        return res ? 'status-offline': 'status-online';
      },
      async getStatus(id: number) {
        await this.$store.dispatch('isOnline', id)
        return this.$store.state.status.get(id)
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
  height: 100%;
  width: 100%;
  padding: 7px;
  background-color: green;
  border-radius: 50%;
  border: 2px solid white;
}
.status-offline {
  height: 100%;
  width: 100%;
  padding: 7px;
  background-color: rgb(122, 122, 122);
  border-radius: 50%;
  border: 2px solid white;
}

    .avatar {
  display: grid;
  align-items: end;
  justify-content: end;
  width: 48px;
  height: 48px;
  /* border-radius: 50%; */
  /* overflow: hidden; */
}

.pic {
  border-radius: 50%;
  align-self: stretch;
  justify-self: stretch;
  grid-column: 1;
  grid-row: 1;
  width: 48px;
  height: 48px;
}
.status {
  /* position: absolute; */
  width: 12px;
  height: 12px;
  border-radius: 50%;
  z-index: 5;
  border: 2px solid white;
  align-self: end;
  justify-self: end;
  grid-column: 1;
  grid-row: 1;
}
  </style>