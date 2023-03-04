import { createStore } from 'vuex'

const axios = require('axios')

const instance = axios.create({
  baseURL: 'http://' +  process.env.VUE_APP_URL + ':3000'
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
    instance.defaults.headers.common.Authorization = `Bearer ${user.token}`;
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
      profilePic: '',
      username: ''
    },
    profileInfos: {
      profilePic: '',
      username: ''
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
    profileInfos(state, profileInfos) {
      state.profileInfos.username = profileInfos.username
      state.profileInfos.profilePic = 'http://' +  process.env.VUE_APP_URL + ':3000/user/profilepic/' + profileInfos.username
    },
    userInfos(state, userInfos) {
      state.userInfos.username = userInfos.username
      state.userInfos.profilePic = 'http://' +  process.env.VUE_APP_URL + ':3000/user/profilepic/' + userInfos.username
    },
    logout(state) {
      state.user = {
        id: -1,
        token: ''
      }
      localStorage.removeItem('user')
    }
  },
  actions: {
    login({commit}) {
      commit('setStatus', 'loading_login')
      return new Promise((resolve, reject) => {
        instance.get("/auth/42/callback")
        .then((response: any) => {
          console.log(response)
          commit('setStatus', '')
          commit('logUser', response.data)
          resolve(response)
        })
        .catch((error: any) => {
          console.log(error)
          commit('setStatus', 'error_login')
          reject(error)
        })
      })
    },
    getUserInfos({commit}) {
      return new Promise((resolve, reject) => {
        instance.get("/user/id/" + this.state.user.id)
        .then((response: any) => {
          console.log(response.data)
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
    }
  },
  getters: {
    getUsername(state) {
      return state.userInfos.username
    }
  }
})

export default store