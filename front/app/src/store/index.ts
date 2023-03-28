import IChannel from '@/models/IChannel'
import { createStore } from 'vuex'
import { AxiosInstance } from 'axios'
import { chatSocket } from '@/websocket'

const axios = require('axios')

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
    status: '',
    userInfos: {
      profilePic: '',
      username: ''
    },
    profileInfos: {
      profilePic: '',
      username: ''
    },
    chat: {
      joined_channels:  [] as IChannel[],
      current_channel:  null as IChannel | null,
      blocked_users:    [],
      current_message:  "",
    }
  },
  mutations: {
    setStatus(state, status) {
      state.status = status
    },
    profileInfos(state, profileInfos) {
      state.profileInfos.username = profileInfos.username
      state.profileInfos.profilePic = 'http://' +  process.env.VUE_APP_URL + ':3000/user/profilepic/' + profileInfos.username
    },
    userInfos(state, userInfos) {
      state.userInfos.username = userInfos.username
      state.userInfos.profilePic = 'http://' +  process.env.VUE_APP_URL + ':3000/user/profilepic/' + userInfos.username
    },
    logout(state) {
      id = -1
      token = ''
      localStorage.removeItem('id')
      localStorage.removeItem('token')
    },
    addChannel(state, newchan) {
      if (newchan) {
        const { name, password, isPrivate, users } = newchan;
        const newfront = { name, password, isPrivate, users, id: newchan.id, messages: [] };
        state.chat.joined_channels.push(newfront);
      }
    },
    setCurrentChannel(state, channel) {
      state.chat.current_channel = channel;
    },
    removeChannel(state, id) {
      state.chat.joined_channels = state.chat.joined_channels.filter(c => c.id !== id);
      state.chat.current_channel = null;
    },
    joinChannel(state, id)
    {
      // chatSocket.emit('join', {chanId : 3, uid : 33, password : ''});
    },
    broadcast(state, message)
    {
      const {channel, sender, content} = message;
      const newMessage = {channel, sender, content};
      console.log(newMessage);
      state.chat.current_channel?.messages.push(newMessage);
    },
    getAllChannels(state, channels)
    {
      console.log("getallchannels in front :", channels)
    }
  },
  actions: {
    getUserInfos({commit}) {
      if (!localStorage.getItem('id'))
        return ;
      return new Promise((resolve, reject) => {
        instance.get("/user/id/" + localStorage.getItem('id'))
        .then((response: any) => {
          commit('userInfos', response.data)
          resolve(response)
        })
        .catch((error: any) => {
          reject(error)
        })
      })
    },
    getProfileInfos({commit}, id) {
      return new Promise((resolve, reject) => {
        instance.get("/user/id/" + id)
        .then((response: any) => {
          commit('profileInfos', response.data)
          resolve(response)
        })
        .catch((error: any) => {
          reject(error)
        })
      })
    },
    changeUsername({commit}, userInfos) {
      return new Promise((resolve, reject) => {
        instance.patch("/user/username", userInfos)
        .then((response: any) => {
          commit('userInfos', response.data)
          resolve(response)
        })
        .catch((error: any) => {
          reject(error)
        })
      })
    },
    changeProfilePic({commit}, data) {
      return new Promise((resolve, reject) => {
        instance.post("/user/setpp/" + this.state.userInfos.username, data.formData)
        .then((response: any) => {
          resolve(response)
        })
        .catch((error: any) => {
          console.log(error)
          reject(error)
        })
      })
    },
    logout({commit}) {
      return new Promise((resolve, reject) => {
        instance.post("/auth/logout")
        .then((response: any) => {
          resolve(response)
        })
        .catch((error: any) => {
          console.log(error)
          reject(error)
        })
      })
    },
    getUserChannels({commit}) {
      if (!localStorage.getItem('id'))
        return ;
      return new Promise((resolve, reject) => {
        instance.get("/channel/getAll")
        .then((response: any) => {
          commit('getAllChannels', response.data)
          resolve(response)
        })
        .catch((error: any) => {
          reject(error)
        })
      })
    },
    selectChannel({ commit }, channel) {
      commit("setCurrentChannel", channel);
    },
    rmChannel({ commit }, id) {
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
      .on('sendAllChannels', (channels : any) =>
			{
				console.log('channels in front :', channels);
			})
		},
    stopReceiving()
    {
      chatSocket.off('displayMessage');
      chatSocket.off('sendAllChannels');
    }
  },
  getters: {
    getUsername(state) {
      return state.userInfos.username
    }
  }
})

export default store