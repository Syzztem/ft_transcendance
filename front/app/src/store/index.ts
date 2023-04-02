import IChannel from '@/models/IChannel'
import { createStore } from 'vuex'
import { AxiosInstance } from 'axios'
import axios from 'axios'
import { chatSocket } from '@/websocket'
import { statusSocket } from '@/websocket'
import IDmList from '@/models/IDmList'
import IUser from '@/models/IUser'
import IDmMessage from '@/models/IDmMessage'
import IMessage from '@/models/IMessage'

const instance : AxiosInstance = axios.create({
  baseURL: 'http://' +  process.env.VUE_APP_URL + ':3000'
})

instance.interceptors.request.use(function (request) {
  const token = localStorage.getItem('token')
  request.headers.Authorization = token ? `Bearer ${token}` : '';
  return request
})

let token: any = localStorage.getItem('token')
let id: any = localStorage.getItem('id')

function isChannel(item: IChannel | IDmList) : item is IChannel {
  return ((item as IChannel).name ? true : false)
}

const store = createStore({
  state: {
    twoFactorAuthenticated: false,
    isLogin: true,
    userInfos: {
      profilePic: '',
      username: '',
      isotp: false,
      qrcode: '',
      friends: [],
      channels: [] as IChannel [],
    },
    profileInfos: {
      profilePic: '',
      username: '',
      id: '',
      isFriend: false,
      isBlock: false,
      wins: 0,
      losses: 0,
      games: []
    },
    status: new Map<number, boolean>(),
    chat: {
      joined_channels:  [] as IChannel[],
      current_channel:  null as IChannel | IDmList | null,
      blocked_users: [],
      current_message:  "",
      available_channels: [] as IChannel [],
      dms_list: [] as IDmList[],
      avatars_list: new Map<string, string>()
    },
    game: {
      colorBackground: 'blue'
    },
  },
  mutations: {
    setisotp(state, infos) {
      state.userInfos.isotp = infos
    },
    setChatAvatars(state, userInfos) {
      state.chat.avatars_list.set(userInfos.username, userInfos.avatar)
    },
    setqrcode(state, code) {
      state.userInfos.qrcode = code
    },
    profileInfos(state, profileInfos) {
      state.profileInfos.username = profileInfos.username
      state.profileInfos.id = profileInfos.id
    },
    setPic(state, url) {
      state.profileInfos.profilePic = url
    },
    profilePic(state, avatar) {
      state.userInfos.profilePic = avatar
    },
    userInfos(state, userInfos) {
      state.userInfos = userInfos
      state.chat.joined_channels = userInfos.channels
      state.userInfos.isotp = userInfos.isTwoFactorAuthenticationEnabled
      state.twoFactorAuthenticated = userInfos.TwoFactorAuthenticated
    },
    setIsFriend(state, infos) {
      state.profileInfos.isFriend = infos
    },
    setIsBlock(state, infos) {
      state.profileInfos.isBlock = infos
    },
    setStats(state, stats) {
      state.profileInfos.wins = stats.wins
      state.profileInfos.losses = stats.losses
      state.profileInfos.games = stats.games
    },
    setFriends(state, friends) {
      state.userInfos.friends = friends
    },
    setStatus() {},
    username(state, username) {
      state.userInfos.username = username
    },
    isLogin(state, infos) {
      state.isLogin = infos
    },
    isOnline(state, infos) {
      state.status.set(infos.id, infos.online)
    },
    createDMList(state, list: IDmList) {
      const isAlreadyInList = state.chat.dms_list.some((item) => item.me === list.me && item.friend === list.friend && item.users[0] === list.users[0] && item.users[1] === list.users[1]);
      if (!isAlreadyInList)
        state.chat.dms_list.push(list);
    },
    logout(state) {
      id = -1
      token = ''
      state.twoFactorAuthenticated = false
      localStorage.removeItem('id')
      localStorage.removeItem('token')
    },
    addChannel(state, newchan) {
      if (newchan) {
        const channelIndex = state.chat.joined_channels.findIndex(channel => channel.id === id);
        if (channelIndex === -1) {
          state.chat.joined_channels.push(newchan);
        }
      }
    },
    addDM(state, dm) {

    },
    setCurrentChannel(state, channel) {
      state.chat.current_channel = channel;
    },
    removeChannel(state, id) {
      state.chat.joined_channels = state.chat.joined_channels.filter(c => c.id !== id);
      state.chat.current_channel = null;
    },
    setTwoFA(state, infos) {
      state.twoFactorAuthenticated = infos
    },
    broadcast(state, message: IMessage)
    {
      const targetChannel = state.chat.joined_channels.find(ch => ch.id === message.channel.id);
      // Check if the target channel exists
      if (targetChannel) {
        // Push the new message to the target channel's messages array
        if (!targetChannel.messages)
          targetChannel.messages = [];
        targetChannel.messages.push(message);
      } else {
        console.error(`Channel not found: ${message.channel}`);
      }
    },
    broadcastDM(state, message: IDmMessage) {
      if (message.content.length == 0) return;
      console.log("my id", state.userInfos.username);
      console.log("receiver", message.receiver.username);
      console.log("sender", message.sender.username);
      if (state.userInfos.username == message.sender.username)
      {
        console.log("sender")
        const dmList = state.chat.dms_list.find(list => list.friend.id == message.receiver.id)
        if (!dmList) return console.log("Unexpected");
        if (!dmList.messages) dmList.messages = [];
        dmList.messages.push(message);
        return;
      }
      const dmList = state.chat.dms_list.find(list => list.friend.id == message.sender.id)
      if (!dmList) {
        if (!state.chat.dms_list)
          state.chat.dms_list = [];
          state.chat.dms_list.push({
            messages: [message],
            me: message.receiver,
            friend: message.sender,
            users: [message.sender, message.receiver]
          });
      }
      else {
        if (!dmList.messages) dmList.messages = [];
        dmList.messages.push(message);
      }
    },
    getAllChannels(state, channels)
    {
      state.chat.available_channels = channels;
    },
    setColorBackground(state, color) {
      state.game.colorBackground = color
    }
  },

  actions: {
    isLogin({ commit }) {
      if (!localStorage.getItem('token')) {
        commit('isLogin', false)
        return
      }
      return new Promise((resolve, reject) => {
        instance.post('/auth/islogin', { 'token': localStorage.getItem('token') })
        .then((response: any) => {
          commit('isLogin', true)
          resolve(response)
        })
        .catch((error: any) => {
          commit('isLogin', false)
          resolve(error)
        })
      })
    },
    getUserInfos({commit}) {
      if (!localStorage.getItem('id'))
        return ;
      return new Promise((resolve, reject) => {
        instance.get("/user/me")
        .then((response: any) => {
          commit('userInfos', response.data)
          resolve(response)
        })
        .catch((error: any) => {
          resolve(error)
        })
      })
    },
    getProfileInfos({commit}, id) {
      return new Promise((resolve, reject) => {
        instance.post("/user/id/", {id: id})
        .then((response: any) => {
          commit('profileInfos', response.data)
          commit('setStats', response.data)
          resolve(response)
        })
        .catch((error: any) => {
          resolve(error)
        })
      })
    },
    getProfilePic({commit}, username) {
      return new Promise((resolve, reject) => {
        instance.get("/user/profilepic/" + username)
        .then((response: any) => {
          commit('profilePic', response.data)
          resolve(response)
        })
        .catch((error: any) => {
          resolve(error)
        })
      })
    },
    getPic({commit}, username) {
      return new Promise((resolve, reject) => {
        instance.get("/user/profilepic/" + username)
        .then((response: any) => {
          commit('setPic', response.data)
          resolve(response)
        })
        .catch((error: any) => {
          resolve(error)
        })
      })
    },
    getChatPic({commit}, username) {
      return new Promise((resolve, reject) => {
        instance.get("/user/profilepic/" + username)
        .then((response: any) => {
          commit('setChatAvatars', {username: username, avatar: response.data})
          resolve(response)
        })
        .catch((error: any) => {
          resolve(error)
        })
      })
    },
    getStats({commit}, id) {
      return new Promise((resolve, reject) => {
        instance.post("/user/id", {id: id, friends: true})
        .then((response: any) => {
          commit('setStats', response.data)
          commit('setFriends', response.data.friends)
          resolve(response)
        })
        .catch((error: any) => {
          resolve(error)
        })
      })
    },
    addFriend({commit}, id) {
      return new Promise((resolve, reject) => {
        instance.patch("/user/friend", {id: id})
        .then((res: any) => {
          commit('setIsFriend', true)
          resolve(res)
        })
        .catch((err: any) => {
          resolve(err)
        })
      })
    },
    deleteFriend({commit}, id) {
      return new Promise((resolve, reject) => {
        instance.patch("/user/unfriend", {id: id})
        .then((res: any) => {
          commit('setIsFriend', false)
          resolve(res)
        })
        .catch((err: any) => {
          resolve(err)
        })
      })
    },
    block({commit}, id) {
      return new Promise((resolve, reject) => {
        instance.patch("/user/block", {id: id})
        .then((res: any) => {
          commit('setIsBlock', true)
          resolve(res)
        })
        .catch((err: any) => {
          resolve(err)
        })
      })
    },
    unblock({commit}, id) {
      return new Promise((resolve, reject) => {
        instance.patch("/user/unblock", {id: id})
        .then((res: any) => {
          commit('setIsBlock', false)
          resolve(res)
        })
        .catch((err: any) => {
          resolve(err)
        })
      })
    },
    changeUsername({commit}, userInfos) {
      return new Promise((resolve, reject) => {
        instance.patch("/user/username", userInfos)
        .then((response: any) => {
          commit('username', userInfos.username)
          this.dispatch('getProfilePic', userInfos.username)
          resolve(response)
        })
        .catch((error: any) => {
          resolve(error)
        })
      })
    },
    changeProfilePic({commit}, data) {
      return new Promise((resolve, reject) => {
        instance.post("/user/setpp/" + this.state.userInfos.username, data.formData)
        .then((response: any) => {
          commit('profilePic', response.data)
          resolve(response)
        })
        .catch((error: any) => {
          resolve(error)
        })
      })
    },
    get2fa({commit}) {
      return new Promise((resolve, reject) => {
        instance.get('/user/me')
        .then((response: any) => {
          commit("setisotp", response.data)
          resolve(response)
        })
        .catch((error: any) => {
          resolve(error)
        })
      })
    },
    turnOn2fa({commit}, code) {
      return new Promise((resolve, reject) => {
        instance.post('/auth/2fa/turn-on', { "code": code })
        .then((response: any) => {
          resolve(response)
        })
        .catch((error: any) => {
          resolve(error)
        })
      })
    },
    turnOff2fa({commit}) {
      return new Promise((resolve, reject) => {
        instance.post('/auth/2fa/turn-off')
        .then((response: any) => {
          resolve(response)
        })
        .catch((error: any) => {
          resolve(error)
        })
      })
    },
    auth2fa({commit}, code) {
      return new Promise((resolve, reject) => {
        instance.post('/auth/2fa/authenticate', { "code": code })
        .then((response: any) => {
          resolve(response)
        })
        .catch((error: any) => {
          resolve(error)
        })
      })
    },
    qrcode({commit}) {
      return new Promise((resolve, reject) => {
        instance.post('/auth/2fa/generate')
        .then((response: any) => {
          commit("setqrcode", response.data)
          resolve(response)
        })
        .catch((error: any) => {
          resolve(error)
        })
      })
    },
    logout({commit}) {
      return new Promise((resolve, reject) => {
        instance.post("/auth/logout")
        .then((response: any) => {
          commit('logout')
          resolve(response)
        })
        .catch((error: any) => {
          commit('logout')
          resolve(error)
        })
      })
    },
    async selectChannel({ commit }, chat: IChannel | IDmList) {
      if (isChannel(chat)) {
        for (const user of chat.users) {
          const res: any = await new Promise((resolve, reject) => {
            instance.get("/user/profilepic/" + user.username)
            .then((response: any) => {
              resolve(response)
            })
            .catch((error: any) => {
              resolve(error)
            })
          })
          commit('setChatAvatars', { username: user.username, avatar: res.data })
        }
        commit("setCurrentChannel", chat);
      }
      else {
        const res: any = await new Promise((resolve, reject) => {
          instance.get("/user/profilepic/" + chat.friend.username)
          .then((response: any) => {
            resolve(response)
          })
          .catch((error: any) => {
            resolve(error)
          })
        })
        commit("setChatAvatars", {username: chat.friend.username, avatar: res.data})
        commit("setCurrentChannel", chat)
      }
    },
    rmChannel({ commit }, id) {
      if (id === -1)
        return
      commit("removeChannel", id);
    },
    createChannel({ commit }, channelInfos: IChannel) {
      commit("addChannel", channelInfos);
    },
    joinChannel({commit}, id)
    {
      commit("joinChannel", id);
    },
    receiveMessage({commit})
		{
			chatSocket.
			on('displayMessage', (message : any) =>
			{
        commit("broadcast", message);
			})
		},
    receiveDM({commit})
    {
      chatSocket.on("dm", (message: any) =>
      {
        commit("broadcastDM", message)
      })
    },
    getAllChannelsStore()
    {
      chatSocket.emit('getAll');
    },
    stopReceiving()
    {
      chatSocket.off('displayMessage');
      chatSocket.off('dm');
    },
    updateChannelsStore({commit}, channel)
    {
      commit("addChannel", channel);
    },
    isOnline({commit}, id) {
      chatSocket.emit('isOnline', id)
    },
    receiveIsOnline({commit}) {
      chatSocket.on('online', (id: number, online: boolean) => commit("isOnline", {id: id, online: online}))
    },
    stopOnline({commit}) {
      chatSocket.off('online')
    }
  },
  getters: {
    getUsername(state) {
      return state.userInfos.username
    }
  }
})

export default store
