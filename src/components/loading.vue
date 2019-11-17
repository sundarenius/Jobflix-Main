<template>
  <section>
    <section class="mainBackground">
      <v-layout style="height:100vh!important" justify-center align-center wrap>
        <v-flex style="margin-top:-80px" xs6 text-xs-center>
          <v-btn @click="onLogout" v-if="0">Logga ut</v-btn>
          <span class="jobflix-title">
            <v-icon class="white--text play-icon-title">play_arrow</v-icon>
            <span class="white--text jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
          </span>
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-flex>
      </v-layout>
    </section>

    <v-dialog v-model="userIsNotApplicant" max-width="400">
      <v-card>
        <v-card-title class="primary lighten-3 white--text justify-center">
          <div class="title">Du måste registera konto</div>
        </v-card-title>
        <v-card-text class="py-3 px-3">
          Kontot du försöker logga in med finns ej registerat.
          Företagskonton går inte att logga in med på denna portal. 
          Vi hänvisar då till business.jobflix.se.
          Vänligen skapa ett konto först.
        </v-card-text>
        <v-card-actions>
          <v-btn @click="userIsNotApplicant = false" round outline block class="primary">OK!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

export default {
  data () {
    return {
      spinner: true,
      userIsNotABusinessUser: false,
      userIsNotApplicant: false
    }
  },
  watch: {
    profileInfo: function () {
      if (this.userIsNotABusinessUser === true) {
        this.spinner = false
        this.$store.state.initialDataIsLoading = false
      } else {
        this.userIsNotApplicant = true
      }
    },
    userIsNotApplicant: function () {
      if (this.userIsNotApplicant === false) {
        this.onLogout()
      }
    }
  },
  computed: {
    profileInfo () {
      return this.$store.state.getPureProfileInfo
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logout')
    }
  },
  created () {
    this.count = 1
    var global = this
    var userObject
    // Om user precis är signed up
    if (this.$store.state.userName !== '') {
      // Se till att fullName är stor bokstav först
      var y = this.$store.state.userName.split(' ')
      var newName = []
      y.forEach((val, index) => {
        var theWord = val[0].toUpperCase()
        theWord += val.substr(1).toLowerCase()
        newName.push(theWord)
      })
      this.$store.state.userName = newName.join().replace(/,/g, ' ')
      userObject = {
        welcomeModal: true,
        typeOfJobs: {
          bransch: '',
          category: '',
          region: ''
        },
        campaigns: [{
          active: false,
          campaignName: 'Nothing'
        }
        ],
        profil: {
          description: '',
          fullName: this.$store.state.userName,
          profilePic: {
            i: 'https://www.jobflix.se/images/profilepic-placeholder.png'
          },
          backgroundImg: {
            i: 'https://www.jobflix.se/images/bgImg-placeholder.jpg'
          },
          competences: '',
          title: '',
          experience: '',
          education: '',
          id: new Date().getTime(),
          email: this.$store.state.inititalUserInfo.email,
          phoneNr: '00-0000000',
          externLink: ''
        },
        userId: this.$store.state.user.id,
        lastLogIn: new Date().toISOString().substr(0, 19).replace('T', ' '),
        registered: new Date().toISOString().substr(0, 19).replace('T', ' '),
        events: {
          messages: [0],
          appointments: [0],
          notifications: [1, {
            msg: 'Välkommen till Jobflix! Sätt upp din profil och skapa en presentation för att komma igång!',
            date: new Date().toString().split(' ').splice(1, 4).join(' ')
          }],
          requests: [0]
        }
      }
      // Dunka upp ny användare
      // let theDBKey = firebase.database().ref().push().key
      let theDBKey = this.$store.state.user.id
      firebase.database().ref('applicants').child(theDBKey + '/profileInfo').set(userObject)
      .then(function (response) {
        global.$store.state.profileInfo = userObject
        global.$store.state.getPureProfileInfo = global.$store.state.profileInfo.profil
        global.$store.state.yourDatabaseString = theDBKey
        global.$store.state.loadTheSite = true
      })
    }
    // OM user redan var Signed Up
    if (this.$store.state.userName === '') {
      let theDBKey = this.$store.state.user.id
      firebase.database().ref('applicants').child(theDBKey + '/profileInfo/userId').once('value', response => {
        const res = response.val()
        if (res === null) {
          global.$store.state.getPureProfileInfo = 'Not found'
          global.userIsNotApplicant = true
        } else {
          global.userIsNotABusinessUser = true
          global.$store.state.loadTheSite = true
          global.$store.state.yourDatabaseString = theDBKey
          global.$store.state.profileInfo = 'userObject'
        }
      })
    }
    this.$store.state.userName = ''
  }
}
</script>

