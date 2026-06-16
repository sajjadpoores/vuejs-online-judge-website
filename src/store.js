import { createStore } from 'vuex'
import axios from 'axios'
import Cookies from 'js-cookie'

export default createStore({
  state: {
    backendUrl: 'http://178.22.122.251:3000',
    profileDetail: {
      username: null,
      email: null,
      phone: null,
      nationalID: null,
      studentID: null,
      avatar_url: null
    },
    problems: [],
    myProblems: [],
    contests: [],
    myContests: []
  },
  mutations: {
    updateProfile (state, profile) {
      state.profileDetail = profile
    },
    updateProblems (state, problems) {
      state.problems = problems
      return state.problems
    },
    updateMyProblems (state, problems) {
      state.myProblems = problems
      return state.myProblems
    },
    updateContests (state, contests) {
      state.contests = contests
      return state.contests
    },
    updateMyContests (state, contests) {
      state.myContests = contests
    }
  },
  actions: {
    getProfile ({ commit }, jwt) {
      // if state is not already updated
      if (this.state.profileDetail.username === null) {
        axios
          .get(this.state.backendUrl + '/profile', {
            headers: {
              Authorization: jwt
            }
          })
          .then(response => {
            commit('updateProfile', response.data.body)
          })
          .catch(error => {
            // redirect home in case user is unathorized
            if (error.response.status === 401) {
              this.$router.push({ name: 'home' })
            }
            //  do nothing
          })
      }
    },
    updateProfile ({ commit }, profile) {
      commit('updateProfile', profile)
    },
    getProblems ({ commit }, type = 'all') {
      if (type === 'user') {
        var jwt = Cookies.get('auth')
        return axios
          .get(this.state.backendUrl + '/problem', {
            headers: {
              Authorization: jwt
            }
          })
          .then(response => {
            var problems = response.data.body
            // console.log(response)
            return commit('updateMyProblems', problems)
          })
          .catch(error => {
            // redirect home in case user is unathorized
            // if (error.response.status === 401) {
            //   this.$router.push({ name: 'home' })
            // }
            console.log(error.response)
          })
      } else {
        return axios
          .get(this.state.backendUrl + '/problem/all')
          .then(response => {
            var problems = response.data.body
            return commit('updateProblems', problems)
          })
          .catch(error => {
            // redirect home in case user is unathorized
            if (error.response.status === 401) {
              this.$router.push({ name: 'home' })
            }
            console.log(error.response)
          })
      }
    },
    getContests ({ commit }, type = 'all') {
      if (type === 'user') {
        var jwt = Cookies.get('auth')
        return axios
          .get(this.state.backendUrl + '/contest', {
            headers: {
              Authorization: jwt
            }
          })
          .then(response => {
            var contests = response.data.body
            // console.log(response)
            return commit('updateMyContests', contests)
          })
          .catch(error => {
            // redirect home in case user is unathorized
            // if (error.response.status === 401) {
            //   this.$router.push({ name: 'home' })
            // }
            console.log(error.response)
          })
      } else {
        return axios
          .get(this.state.backendUrl + '/contest/all')
          .then(response => {
            var contests = response.data.body
            return commit('updateContests', contests)
          })
          .catch(error => {
            // redirect home in case user is unathorized
            if (error.response.status === 401) {
              this.$router.push({ name: 'home' })
            }
            console.log(error.response)
          })
      }
    }
  }
})
