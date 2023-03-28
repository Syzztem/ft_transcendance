import IChannel from '@/models/IChannel'
import { createStore } from 'vuex'
import { AxiosInstance } from 'axios'
import axios from 'axios'

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
    twoFactorAuthenticated: false,
    isLogin: true,
    userInfos: {
      profilePic: '',
      username: '',
      isotp: false,
      qrcode: ''
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
    setisotp(state, infos) {
      state.userInfos.isotp = infos
    },
    setqrcode(state, code) {
      state.userInfos.qrcode = code
    },
    profileInfos(state, profileInfos) {
      state.profileInfos.username = profileInfos.username
    },
    profilePic(state, avatar) {
      state.userInfos.profilePic = avatar
    },
    userInfos(state, userInfos) {
      state.userInfos.username = userInfos.username
      state.twoFactorAuthenticated = userInfos.TwoFactorAuthenticated
    },
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
      const { name, password, isPrivate, users, messages } = newchan;
      const newfront = {name : name, password : password, isPrivate : isPrivate, users: users, messages : [], id: newchan.id}
      state.chat.joined_channels.push(newfront);
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
        instance.get("/user/id/" + localStorage.getItem('id'))
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
        instance.get("/user/id/" + id)
        .then((response: any) => {
          commit('profileInfos', response.data)
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
    changeUsername({commit}, userInfos) {
      return new Promise((resolve, reject) => {
        instance.patch("/user/username", userInfos)
        .then((response: any) => {
          commit('username', userInfos.username)
          commit('profilePic', 'http://' + process.env.VUE_APP_URL + ':3000/profilepics/' + userInfos.username + '.jpg')
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
    selectChannel({ commit }, channel) {
      commit("setCurrentChannel", channel);
    },
    rmChannel({ commit }, id) {
      commit("removeChannel", id);
    },
    createChannel({ commit }, channelInfos) {
      commit("addChannel", channelInfos);
    },

  },
  getters: {
    getUsername(state) {
      return state.userInfos.username
    }
  }
})

export default store