import { createStore } from 'vuex'

const axios = require('axios')

const instance = axios.create({
  baseURL: "http://rcorenti.fr:3000"
})

const store = createStore({
  state: {
    status: '',
    user: {
       id: -1,
       token: ''
    }
  },
  mutations: {
    setStatus(state, status) {
      state.status = status
    },
    logUser(state, user) {
      state.user = user
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
    }
  }
})

export default store