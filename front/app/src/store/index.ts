import { createStore } from 'vuex'

const axios = require('axios')

const instance = axios.create({
  baseURL: "http://rcorenti.fr:3000"
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
    userInfos(state, userInfos) {
      state.userInfos = userInfos
      state.userInfos.profilePic = 'http://rcorenti.fr:3000/user/profilepic/' + userInfos.username
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
    changeProfilePic({commit}, userInfos) {
      return new Promise((resolve, reject) => {
        instance.post("/user/setpp/", userInfos)
        .then((response: any) => {
          resolve(response)
        })
        .catch((error: any) => {
          console.log(error)
          reject(error)
        })
      })
    }
  }
})

export default store