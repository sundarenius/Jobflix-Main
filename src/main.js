import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase/app'
import 'firebase/auth'
import Vuetify from 'vuetify'
import { store } from './store.js'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyD9V-g85UHUsPJOuEdK7jARC-sO23eUHTI',
      authDomain: 'instawork-814df.firebaseapp.com',
      databaseURL: 'https://instawork-814df.firebaseio.com',
      projectId: 'instawork-814df',
      storageBucket: 'instawork-814df.appspot.com',
      messagingSenderId: '76780395694'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
      } else {
        this.$store.state.loadTheSite = true
        this.$router.push('/login')
      }
    })
  }
})
