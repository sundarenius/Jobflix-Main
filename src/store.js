import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import { sendCampaignToCampaingsNode } from '@/utils/helpers'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    showProfile: false,
    howItWorksVideo: false,
    loadTheSite: false,
    inititalUserInfo: {
      email: ''
    },
    allAds: '',
    userName: '',
    user: null,
    loadingUser: false,
    authError: null,
    profileInfo: '',
    getPureProfileInfo: '',
    initialDataIsLoading: true,
    notifications: 0,
    notificationsArr: '',
    userDbId: '',
    meetingEvents: [],
    uploadVideoUrl: '',
    uploadVideoSnapshotUrl: '',
    uploadVideoSnapshotUrlObject: {
      i: ''
    },
    filter: {
      region: [],
      minExp: [],
      utbildning: [],
      bransch: [],
      competences: [],
      availability: []
    }
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loadingUser = payload
    },
    userName (state, payload) {
      state.userName = payload
    },
    setError (state, payload) {
      state.authError = payload
    },
    clearError (state) {
      state.error = null
    },
    showProfileCommit (state, payload) {
      state.showProfile = payload
    },
    howItWorksVideoCommit (state, payload) {
      state.howItWorksVideo = payload
    },
    profileInfoCommit (state, payload) {
      state.profileInfo = payload
    },
    setGetPureProfileInfo (state, payload) {
      state.getPureProfileInfo = payload
    },
    welcomeModalCommit (state, payload) {
      state.profileInfo.welcomeModal = payload
    },
    notificationsCommit (state, payload) {
      state.notifications = payload
    },
    setNotificationsArr (state, payload) {
      state.notificationsArr = payload
    },
    setProfileCampaigns (state, payload) {
      state.profileInfo.campaigns[payload.index] = payload.data
    },
    setMeetingEvents (state, payload) {
      state.meetingEvents = payload
    }
  },
  actions: {
    setOnChangeData ({ commit }, payload) {
      commit('profileInfoCommit', payload.profileInfo)
      commit('setGetPureProfileInfo', payload.getPureProfileInfo)
      commit('notificationsCommit', payload.notifications)
      commit('setNotificationsArr', payload.notificationsArr)
    },
    updateAllPresentationsWhenProfileIsUpdated ({ commit, state }) {
      let update = 0
      if (Object.keys(state.profileInfo.campaigns).length > 1) {
        for (let i in state.profileInfo.campaigns) {
          if (state.profileInfo.campaigns[i].active && state.profileInfo.campaigns[i].hasOwnProperty('profile')) {
            update = 1
            commit('setProfileCampaigns', { data: state.profileInfo.profil, index: i })
          }
        }
      }
      if (update === 1) {
        sendCampaignToCampaingsNode()
      }
    },
    signUserUp ({commit}, payload) {
      commit('userName', payload.name)
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.user.uid
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.user.uid
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {id: payload.uid})
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
      location.reload()
    }
  },
  getters: {
    showProfile (state) {
      return state.showProfile
    },
    howItWorksVideoGetter (state) {
      return state.howItWorksVideo
    },
    notifications (state) {
      return state.notifications
    },
    user (state) {
      return state.user
    },
    profileInfoGetter (state) {
      return state.profileInfo
    },
    welcomeModal (state) {
      if (state.profileInfo !== '' && state.userDbId !== '') {
        return state.profileInfo.welcomeModal
      }
    }
  }
})
