import IChannel from '@/models/IChannel'
import { createStore } from 'vuex'
import { AxiosInstance } from 'axios'
import axios from 'axios'
import { chatSocket } from '@/websocket'
import { statusSocket } from '@/websocket'
import IDmList from '@/models/IDmList'
import IUser from '@/models/IUser'

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

const store = createStore({
  state: {
    twoFactorAuthenticated: false,
    isLogin: true,
    userInfos: {
      profilePic: '',
      username: '',
      isotp: false,
      qrcode: '',
      friends: []
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
    chat: {
      joined_channels:  [] as IChannel[],
      current_channel:  null as IChannel | IDmList | null,
      blocked_users: [],
      current_message:  "",
      available_channels: [] as IChannel [],
      dms_list: [
        {messages: [{content: 'test', id: 1, timestamp: '2022'}, {content: 'test2', id: 2, timestamp: '2022'}], sender: {id: 1, username: 'rcorenti', login42: 'toto', email: 'toto', rank: 0, token: 'qwe', wins: 0, losses: 0, level: 0, profilePic: '', friends: [], blocked: [], channels:[]}, receiver: {id: 2, username: 'tata', login42: 'tata', email: 'tata', rank: 0, token: 'iop', wins: 0, losses: 0, level: 0, profilePic: '', friends: [], blocked: [], channels:[]}, users: [{id: 1, username: 'rcorenti', login42: 'toto', email: 'toto', rank: 0, token: 'qwe', wins: 0, losses: 0, level: 0, profilePic: '', friends: [], blocked: [], channels:[]}, {id: 2, username: 'tata', login42: 'tata', email: 'tata', rank: 0, token: 'iop', wins: 0, losses: 0, level: 0, profilePic: '', friends: [], blocked: [], channels:[]}]}
      ] as IDmList[],
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
      state.userInfos.username = userInfos.username
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
    logout(state) {
      id = -1
      token = ''
      state.twoFactorAuthenticated = false
      localStorage.removeItem('id')
      localStorage.removeItem('token')
    },
    addChannel(state, newchan) {
      if (newchan) {
        const { name, password, isPrivate, users, id, messages } = newchan;
        console.log('password in channel create : ', password);
        console.log('messages in channel creation :', messages);
        const channelIndex = state.chat.joined_channels.findIndex(channel => channel.id === id);
        if (channelIndex === -1) {
          const newfront = { name, password, isPrivate, users, id: id, messages: [], mods: newchan.mods };
          state.chat.joined_channels.push(newfront);
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
    broadcast(state, message)
    {
      const {channel, sender, content} = message;
      const newMessage = {channel, sender, content};
      console.log(newMessage);
      const targetChannel = state.chat.joined_channels.find(ch => ch.id === channel.id);
      // Check if the target channel exists
      if (targetChannel) {
        // Push the new message to the target channel's messages array
        targetChannel.messages.push(newMessage);
      } else {
        console.error(`Channel not found: ${channel}`);
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
      console.log('isLogin: début');
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
    getStats({commit}) {
      return new Promise((resolve, reject) => {
        instance.get("/user/stats")
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
          console.log('New profile pic URL:', response.data)
          commit('profilePic', response.data)
          resolve(response)
        })
        .catch((error: any) => {
          console.log(error)
          resolve(error)
        })
      })
    },
    get2fa({commit}) {
      return new Promise((resolve, reject) => {
        instance.get('/auth/2fa/actived')
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
    async selectChannel({ commit }, channel) {
      for (const user of channel.users ? channel.users : channel.list[0].receiver) {
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
      commit("setCurrentChannel", channel);
    },
    rmChannel({ commit }, id) {
      if (id === -1)
        return
      commit("removeChannel", id);
    },
    createChannel({ commit }, channelInfos) {
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
				console.log('message from back :', message);
        commit("broadcast", message);
			})
		},
    getAllChannelsStore()
    {
      chatSocket.emit('getAll');;
    },
    stopReceiving()
    {
      chatSocket.off('displayMessage');
    },
    receiveStatus({commit}) {
      statusSocket.on('displayStatus', (status: any) => {
        commit('', status)
      })
    },
    updateChannelsStore({commit}, channel)
    {
      console.log('channel in store', channel);
      commit("addChannel", channel);
    },
  },
  getters: {
    getUsername(state) {
      return state.userInfos.username
    }
  }
})

export default store
