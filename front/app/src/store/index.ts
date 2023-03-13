import { createStore } from 'vuex'

const axios = require('axios')

const instance = axios.create({
  baseURL: 'http://' +  process.env.VUE_APP_URL + ':3000'
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

if (!token) {
  token: ''
}
else {
  try {
    instance.defaults.headers.common = {'Authorization': `Bearer ${token}`};
  } catch (ex) {
    token: ''
  }
}

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
    }
  },
  actions: {
    getUserInfos({commit}) {
      return new Promise((resolve, reject) => {
        instance.get("/user/id/" + id)
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
    }
  },
  getters: {
    getUsername(state) {
      return state.userInfos.username
    }
  }
})

export default store