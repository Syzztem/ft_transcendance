import IChannel from '@/models/IChannel'
import { createStore } from 'vuex'

const axios = require('axios')

const instance = axios.create({
  baseURL: "http://localhost:3000"
})

let user: any = localStorage.getItem('user')
if (!user) {
  user = {
    id: -1,
    token: ''
  }
}
else {
  try {
    user = JSON.parse(user)
  } catch (ex) {
    user = {
      id: -1,
      token: ''
    }
  }
}

const store = createStore({
  state: {
    status: '',
    user: user,
    userInfos: {
      picture: '',
      username: ''
      
    },
    chat: {
      channels:         Array<IChannel>(),
      joined_channels:  Array<IChannel>(),
      current_channel:  <IChannel> {},
      blocked_users:    [],
      current_message:  "",
    }

  },
  mutations: {
    setStatus(state, status) {
      state.status = status
    },
    logUser(state, user) {
      localStorage.setItem('user', JSON.stringify(user))
      state.user = user
    },
    userInfos(state, userInfos) {
      state.userInfos = userInfos
    },
    logout(state) {
      state.user = {
        id: -1,
        token: ''
      }
      localStorage.removeItem('user')
    },
    initChannels(state) {
      state.chat.joined_channels = [{name: 'InitChan', users: [{name :'user44'}], messages:[{sender: 'oyo', content: 'aya'}]}];
    },
    addChannel(state, newchan) {
      state.chat.joined_channels.push(newchan);
    },
    removeChannel(state, channelName) {
      state.chat.joined_channels = state.chat.joined_channels.filter(c => c.name !== channelName);
    },
    updateCurrentChannel (state, current){
      state.chat.current_channel = current;
    },
  },
  actions: {
    createAccount({commit}, userInfos) {
      commit('setStatus', 'loading_create')
      return new Promise((resolve, reject) => {
        commit
        instance.post("/user/new", userInfos)
        .then((response: any) => {
          commit('setStatus', 'created')
          resolve(response)
        })
        .catch((error: any) => {
          commit('setStatus', 'error_create')
          reject(error)
        })
      })
    },
    login({commit}, userInfos) {
      commit('setStatus', 'loading_login')
      return new Promise((resolve, reject) => {
        instance.post("/user/login", userInfos)
        .then((response: any) => {
          commit('setStatus', '')
          commit('logUser', response.data)
          resolve(response)
        })
        .catch((error: any) => {
          commit('setStatus', 'error_login')
          reject(error)
        })
      })
    },
    getUserInfos({commit}, userInfos) {
      return new Promise((resolve, reject) => {
        instance.post("/user/infos", userInfos)
        .then((response: any) => {
          commit('userInfos', response.data)
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
    }
  }
})

export default store