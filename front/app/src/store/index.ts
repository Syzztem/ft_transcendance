import IChannel from '@/models/IChannel'
import { createStore } from 'vuex'
import { AxiosInstance } from 'axios'

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

// if (!token) {
//   token: ''
// }
// else {
//   try {
//     instance.defaults.headers.common.Authorization = `Bearer ${token}`;
//   } catch (ex) {
//     token: ''
//   }
// }

// if (!token) {
//   token: ''
// }
// else {
//   try {
    // instance.defaults.headers.common = {'Authorization': `Bearer ${token}`};
//   } catch (ex) {
//     token: ''
//   }
// }

// const config = {
//   headers: {
//     Authorization: 'Bearer ${token}'
//   }
// }

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
      const copy = Object.assign({}, newchan);
      state.chat.joined_channels.push(copy);
    },
    setCurrentChannel(state, channel) {
      state.chat.current_channel = channel;
    },
    removeChannel(state, id) {
      state.chat.joined_channels = state.chat.joined_channels.filter(c => c.id !== id);
      state.chat.current_channel = null;
    },
  },
  actions: {
    getUserInfos({commit}) {
      if (!localStorage.getItem('id')) // better solution ?
        return ;
      return new Promise((resolve, reject) => {
        instance.get("/user/id/" + localStorage.getItem('id'))
        .then((response: any) => {
          console.log("Response from the front: ",response.data)
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
          console.log(response.data)
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
    selectChannel({ commit }, channel) {
      commit("setCurrentChannel", channel);
    },
    rmChannel({ commit }, id) {
      commit("removeChannel", id);
    },
    // createChannel({ commit }, channel)
    // {
    //   commit("addChannel", channel);
    // },
    createChannel({ commit }, channelInfos) {
    return new Promise((resolve, reject) => {
      instance
        .post("new", channelInfos)
        .then((response : any) => {
          const newChannel = response.data;
          commit("addChannel", newChannel);
          resolve(response);
        })
        .catch((error : any) => {
          reject(error);
        });
    });
  },
  },
  getters: {
    getUsername(state) {
      return state.userInfos.username
    }
  }
})

export default store