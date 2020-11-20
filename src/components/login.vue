<template>
<div class="mainBackground white--text">
   <!--  EJ INLOGGADE TOOLBAR  -->
    <v-toolbar
      id="top"
      v-if="!userIsNotABusinessAndIsLoggedIn"
      class="mainBackground"
      fixed
      clipped-left
      app
      dark
      flat
    >
      <v-toolbar-title @click="$router.push('/hem')" class="mr-5 align-center pointer">
        <span class="jobflix-title-not-loggedin">
          <v-icon class="white--text play-icon-title-not-loggedin">play_arrow</v-icon>
          <span class="jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <a href="https://business.jobflix.se/" target="_blank">
          <v-btn large outline flat round class="white hidden-xs-only">
          <v-icon class="mr-2">business</v-icon>
          För företag
        </v-btn>
      </a>
      <v-btn @click="logInModal = true" large outline flat round class="white hidden-xs-only">
        <v-icon class="mr-2">lock</v-icon>
        Logga in
      </v-btn>
    </v-toolbar>

<section class="loginBackground pb-4">
  <v-container>
    <v-layout wrap row justify-center :py-5="$vuetify.breakpoint.smAndUp" :pt-4="$vuetify.breakpoint.xsOnly" :pb-5="$vuetify.breakpoint.xsOnly">
      <v-flex mb-4 px-3 xs12 md7>
        <div style="font-weight:bold" :class="{'display-2 mb-3' : $vuetify.breakpoint.smAndUp, 'display-1 mb-3' : $vuetify.breakpoint.xsOnly}">
          Snabba vägen till drömjobbet!
        </div>
        <div v-if="0" style="font-weight:bold" class="displayTitle mb-3">
          Visa vem du är med en videopresentation och få jobberbjudanden från företag
        </div>
        <div v-if="1" style="font-weight:bold;line-height:25px!important;" class="title mb-3">
          Visa vem du är med en videopresentation och få jobberbjudanden från företag
        </div>
        <div v-if="0" class="title mb-4">
          blabla
        </div>
        <div>
          <div class="my-3">
            <img @click="howItWorksVideo = true" style="max-width:400px" width="60%" src="@/assets/videoImg.50e589f.png" alt="">
          </div>
          <v-layout>
            <v-flex mt-3 xs8>
              <v-btn block @click="howItWorksVideo = true" large class="white--text title" outline flat round>
                <v-icon medium class="mr-2">play_arrow</v-icon>
                Hur det fungerar
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <!--  SIGN UP form  -->
      <v-flex px-3 md5>
          <div style="margin-bottom:-5px" v-if="wrongSignUp">
            <v-alert style="width:100%" type="error" v-model="wrongSignUp">{{ wrongSignUpMsg }}</v-alert>
          </div>
              <div style="font-weight:bold;margin-bottom:-10px" class="display-1 pb-3 text-xs-center">
                Kom igång nu - gratis!
              </div>
              <v-container class="pt-3 pb-4">
                  <form @submit.prevent="onSignUp">
                    <v-layout row>
                          <v-flex xs12>
                            <v-text-field
                              solo
                              append-icon="person"
                              name="fullname" 
                              label="För och efternamn" 
                              id="fullname"
                              v-model="fullname"
                              type="text"
                              required></v-text-field>
                          </v-flex>
                      </v-layout>

                    <v-layout row>
                          <v-flex xs12>
                            <v-text-field
                              solo
                              append-icon="mail"
                              name="mail" 
                              label="Din e-mail" 
                              id="mailSignUp"
                              v-model="mailSignUp"
                              type="mail"
                              required></v-text-field>
                          </v-flex>
                      </v-layout>

                  <v-layout row>
                          <v-flex xs12>
                            <v-text-field
                              solo
                              append-icon="vpn_key"
                              name="password" 
                              label="Lösenord" 
                              id="passwordSignUp"
                              v-model="passwordSignUp"
                              type="password"
                              :rules="[passIsLongerThanSix]"></v-text-field>
                          </v-flex>
                      </v-layout>

                      <v-layout wrap row>
                          <v-flex xs12>
                            <v-text-field
                              solo
                              append-icon="repeat"
                              name="confirmPassword" 
                              label="Upprepa lösenord" 
                              id="confirmPassword"
                              v-model="confirmPassword"
                              type="password"
                              :rules="[comparePasswords]"></v-text-field>
                          </v-flex>
                           <v-flex v-show="showGdpr" xs12>
                            <div class="body-2 pt-1" style="margin-top:-8px;margin-bottom:-13px">
                              <a class="white--text" target="_blank" href="https://info.jobflix.se/userterms">Allmäna villkor</a>
                            </div>
                            <v-checkbox
                              dark
                              label="Jag godkänner de allmäna villkoren"
                              v-model="gdrpAccept"
                            ></v-checkbox>
                          </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex style="margin-top:-10px" xs12>
                            <v-btn :loading="signingUp" round flat :disabled="!registerNewAccBtn" @click="onSignUp" class="success" block>Gå med nu</v-btn>
                          </v-flex>
                      </v-layout>
                    </form>
              </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</section>


  <section class="white secondary--text py-4">
    <v-container>
      <v-layout px-3 py-5 row wrap>
        <v-flex pb-5 text-xs-center xs12>
          <div :class="{'display-1 pb-3' : $vuetify.breakpoint.smAndUp, 'myDisplay-1 pb-3' : $vuetify.breakpoint.xsOnly}">
            Jobflix i tre steg
          </div>
        </v-flex>
        <v-flex mb-5 text-xs-center xs12 md4>
          <img height="150px" src="@/assets/profile-icon.svg" alt="Videorekrytering">
          <div style="font-weight:bold" class="subheading text-xs-center mt-3">
            1. Fixa din profil med erfarenheter &amp; utbildningar.
            <div class="body-2 pt-1 px-5">
              Lägg till titlar, beskrivning och personliga önskemål i profilen.
            </div>
          </div>
        </v-flex>
        <v-flex mb-5 text-xs-center xs12 md4>
          <img height="150px" src="@/assets/video-icon.jpg" alt="Söka jobb">
          <div style="font-weight:bold" class="subheading text-xs-center mt-3">
            2. Spela in en videopresentation &amp; ladda upp.
          </div>
          <div class="body-2 pt-1 px-5">
             Visa vem du är, vad du kan och vilka krav du har på din framtida tjänst och arbetsplats.
          </div>
        </v-flex>
        <v-flex text-xs-center xs12 md4>
           <img height="150px" src="@/assets/interview-icon.png" alt="Jobbintervju">
          <div style="font-weight:bold" class="subheading text-xs-center mt-3">
            3. Svara på intervjuförfrågningar från företag.
          </div>
          <div class="body-2 pt-1 px-5">
             Svara på intervjuförfrågningar från företag som matchar på dina preferenser och krav.
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </section>


   <section class="mainBackground py-4">
    <v-container>
      <v-layout row wrap px-3 py-5>
        <v-flex xs12>
          <div :class="{'display-1 pb-5 text-xs-center' : $vuetify.breakpoint.smAndUp, 'myDisplay-1 pb-5 text-xs-center' : $vuetify.breakpoint.xsOnly}">
            Från traditionellt till modernt jobbsökande
          </div>
        </v-flex>
        <v-flex :mb-3="$vuetify.breakpoint.xsOnly" text-xs-center xs12 md4>
          <img width="60%" src="@/assets/kandidat.png" alt="Jobbannons">
        </v-flex>
        <v-flex px-3 xs12 md8>
          <div class="subheading">
            <p>
              Största anledningen till att man är improduktiv och inte trivs med sitt arbete är att man inte jobbar
              med det man borde jobba med. Man har försökt passa in på en jobbannons.
            </p>
            <p>
              Tänk om du nu istället kunde visa upp vem du är och sätta dina preferenser på en arbetsgivare och arbetsplats
              och sedan låta "rätt" företag kontakta dig med "rätt" tjänst?
            </p>
            <p>
              Jobflix förändrar rektyteringsbranschen med ett nyare, modernare och ett mer framgångsrikt tänk. 
              Vi tror att öppenhet och transparens över vem du är och vad du vill skapar en WIN-WIN situation. 
              Var tydlig och ärlig med vad du söker så kommer rätt jobb att komma till dig!
            </p>
            <p>
              Arbete är en stor del av livet och påverkar hur man mår. Därför vill vi vara med och optimera dina chanser
              till ditt drömjobb.
            </p>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </section>

  <section class="grey lighten-4 py-4">
    <v-container>
      <v-layout class="secondary--text" row wrap px-3 py-5>
        <v-flex xs12>
          <div :class="{'display-1 pb-5 text-xs-center' : $vuetify.breakpoint.smAndUp, 'myDisplay-1 pb-5 text-xs-center' : $vuetify.breakpoint.xsOnly}">
            En smidig och användarvänlig portal
          </div>
        </v-flex>
        <v-flex px-3 xs12 md8>
          <div style="font-weight:bold" class="subheading">
            <p>
              Användarportalen är väldigt lätt att arbeta med.
              Du får live notifikationer när ett företag sett din presentation, profil
              och när du fått en intervjuförfrågan!
            </p>
            <p>
              Företag svarar på din presentation genom att skicka minst två intervjutider.
              De väljer antingen ett personligt möte, videomöte eller ett telefonmöte.
            </p>
            <p>
              När du accepterat en tid eller bett om en ny tid och sedan accepterat den
              så hamnar mötet automatiskt i båda era kalendrar med kontaktuppgifter.
            </p>
          </div>
        </v-flex>
        <v-flex text-xs-center xs12 md4>
          <img width="60%" src="@/assets/portalen.png" alt="">
        </v-flex>
      </v-layout>
    </v-container>
  </section>


  <section class="yellow darken-4 py-4">
    <v-container>
      <v-layout justify-center class="white--text" row wrap px-3 py-5>
        <v-flex xs12 md9>
          <div :class="{'display-1 pb-3 text-xs-center' : $vuetify.breakpoint.smAndUp, 'myDisplay-1 pb-3 text-xs-center' : $vuetify.breakpoint.xsOnly}">
            Söker du nya medarbetare?
          </div>
        </v-flex>
        <v-flex text-xs-center xs12>
          <div style="font-weight:bold" class="subheading py-3">
            Du som är företagare eller rekryterare ska använda Jobflix's business portal. Där kan du filtrera bland
            presentationer, se profiler, skicka inbjudningar och skapa bevakningar.
          </div>
          <div style="font-weight:bold" class="subheading">
            Du kan även annonsera ut lediga tjänster utan extra kostnad!
          </div>
          <div class="mt-3">
            <a href="https://business.jobflix.se/" target="_blank">
                <v-btn class="title white" flat round large>
                Till företagssidan
                <v-icon class="ml-2">business</v-icon>
              </v-btn>
            </a>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </section>

  <section v-if="0" class="mainBackground py-4">
    <v-container>
      <v-layout justify-center class="white--text" px-3 py-5 row wrap>
        <v-flex text-xs-center xs12 md9>
          <div :class="{'display-1 pb-4 text-xs-center' : $vuetify.breakpoint.smAndUp, 'myDisplay-1 pb-4 text-xs-center' : $vuetify.breakpoint.xsOnly}">
            Snabbtitt över hur marknaden ser ut på företagssidan...
          </div>
          <div style="font-weight:bold" class="text-xs-center subheading pb-3">
            Alla aktiva presentationer blir tillgängliga för företag i marknadsplatsen för företag. Där får de tillgång till din
            profil med CV och erfarenheter. Där skickar de mötesförfrågningar till dig.
          </div>
          <div style="font-weight:bold" class="text-xs-center subheading pb-3">
            Eftersom bara inloggade företagsanvändare har tillgång till den ocensurerade sidan så är presentationerna censurerade för
            icke företagsanvändare.
          </div>
          <div>
            <a href="https://business.jobflix.se/marknaden" target="_blank">
              <v-btn class="white white--text" flat round outline large>
                Till marknadsplatsen
                <v-icon>play_arrow</v-icon>
              </v-btn>
            </a>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </section>

  <section class="grey lighten-2 py-4">
    <v-container>
      <v-layout justify-center class="secondary--text"  px-3 py-5>
        <v-flex text-xs-center xs12 md9>
          <div :class="{'display-1 pb-3 text-xs-center' : $vuetify.breakpoint.smAndUp, 'myDisplay-1 pb-3 text-xs-center' : $vuetify.breakpoint.xsOnly}">
            Var inte för öppen. Stäng dörrarna!
          </div>
           <div style="font-weight:bold" class="subheading py-3">
             <p>
              Vi tror inte på att man blir nöjd i längden av att vara för öppen för "nya utmaningar" när man söker jobb. 
              Vi tror på att man istället ska stänga dörrarna och bara nöja sig med det man faktiskt gillar och vill arbeta med.  
            </p>
          </div>
          <div>
            <v-btn to="#top" flat round outline large>
              SKAPA KONTO NU - GRATIS!
              <v-icon>arrow_drop_up</v-icon>
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </section>



  <!-- LOGGA IN MODAL  -->
  <v-dialog v-model="logInModal" max-width="500">
        <v-card>
          <div v-if="wrongCredentialsMsg !== null">
            <v-alert style="width:100%" type="error" v-model="wrongCredentials">{{ wrongCredentialsMsg }}</v-alert>
          </div>
          <v-card-title class="justify-center pb-5">
              <div style="font-weight:bold" class="display-1 pb-4">Logga in</div>
              <div class="closeModal">
                <v-icon @click="logInModal = false" large class="pointer">close</v-icon>
              </div>
          </v-card-title>
          <v-card-text>
            <v-container>
              <form style="margin-top:-60px;margin-bottom:-20px">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name="email" 
                      label="Mail" 
                      id="mail"
                      v-model="email"
                      type="email"
                      append-icon="mail"
                      outline></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name="password" 
                      label="Lösenord" 
                      id="password"
                      v-model="password"
                      type="password"
                      append-icon="vpn_key"
                      outline></v-text-field>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn flat round :loading="loading" :disabled="!loggaInDisabled" type="submit" @click="onLogin" block class="success">Logga in</v-btn>
          </v-card-actions>
          <v-card-text class="text-xs-center">
            <v-divider style="margin-top:-15px"></v-divider>
            <div @click="forgotPasswordModel = true" class="body-2 primary--text pt-3" style="cursor:pointer">Har du glömt ditt lösenord?</div>
          </v-card-text>
        </v-card>
      </v-dialog>

    <v-dialog max-width="400" v-model="forgotPasswordModel">
      <v-card>
        <v-card-title class="primary lighten-3 justify-center">
          <div class="title white--text">
            Begär nytt lösenord.
          </div>
          <div class="closeModal">
            <v-icon @click="forgotPasswordModel = false" class="white--text" large>close</v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <v-text-field
            outline
            label="Din registrerade e-mail"
            v-model="lostPasswordEmail"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="sendingNewPassword" @click="sendNewPassword" :disabled="!lostPasswordEmail.length > 0" block class="primary">Begär nytt lösenord</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="550" v-model="lookForInbox">
      <v-card>
        <v-card-title class="primary lighten-2 justify-center">
          <div class="title white--text">
            Ett mail har skickats till {{ lostPasswordEmail }}
            <v-icon class="white--text">check_circle</v-icon>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn block @click="lookForInbox = false" flat>Stäng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="$vuetify.breakpoint.xsOnly" style="position:fixed;bottom:0px;height:56px;z-index:11;width:100vw" class="secondary lighten-1">
      <v-layout row>
        <v-flex text-xs-center xs6>
            <v-btn
            large
            class="secondary--text text--lighten-4 caption ml-4"
            flat
            @click="logInModal = true"
            >
            <v-layout wrap>
                <v-flex xs12>
                  <v-icon>lock</v-icon>
                </v-flex>
                <v-flex xs12>
                  <div>Logga in</div>
                </v-flex>
              </v-layout>
          </v-btn>
        </v-flex>
        <v-flex text-xs-center xs6>
            <v-btn
              large
              class="secondary--text text--lighten-4 caption mr-4"
              flat
              @click="toBusinessPortal"
            >
              <v-layout wrap>
                <v-flex xs12>
                  <v-icon>business</v-icon>
                </v-flex>
                <v-flex xs12>
                  <div>För företag</div>
                </v-flex>
              </v-layout>
            </v-btn>
        </v-flex>
      </v-layout>
    </div>

</div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data () {
    return {
      signingUp: false,
      gdrpAccept: false,
      email: '',
      password: '',
      passwordSignUp: '',
      confirmPassword: '',
      mailSignUp: '',
      fullname: '',
      signUpDialog: false,
      e1: 0,
      logInModal: false,
      forgotPasswordModel: false,
      sendingNewPassword: false,
      lostPasswordEmail: '',
      lookForInbox: false
    }
  },
  methods: {
    test () {
      console.log('test')
    },
    toBusinessPortal () {
      window.location.href = 'https://business.jobflix.se/'
    },
    sendNewPassword () {
      const global = this
      this.sendingNewPassword = true
      firebase.auth().sendPasswordResetEmail(this.lostPasswordEmail)
      .then(function () {
        global.forgotPasswordModel = false
        global.lookForInbox = true
        global.sendingNewPassword = true
      })
      .catch(err => {
        console.log(err)
      })
    },
    onSignUp () {
      this.signingUp = true
      this.$store.state.inititalUserInfo.email = this.mailSignUp
      this.$store.dispatch('signUserUp', {email: this.mailSignUp, password: this.passwordSignUp, name: this.fullname})
    },
    onLogin () {
      // Vuex
      this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
    }
  },
  computed: {
    showGdpr () {
      return (this.fullname.length > 0 && this.fullname.includes(' ') && this.fullname.split(' ')[0].length > 1 && this.fullname.split(' ')[1].length > 1) && this.mailSignUp !== '' && this.passwordSignUp.length >= 6 && (this.passwordSignUp === this.confirmPassword)
    },
    howItWorksVideo: {
      get () { return this.$store.getters.howItWorksVideoGetter },
      set (value) { this.$store.commit('howItWorksVideoCommit', value) }
    },
    loading () {
      return this.$store.state.loadingUser
    },
    userIsNotABusinessAndIsLoggedIn () {
      return this.$store.state.profileInfo !== '' && this.$store.state.user !== null && this.$store.state.userDbId !== ''
    },
    wrongCredentialsMsg () {
      if (this.$store.state.authError !== null) {
        if (this.$store.state.authError.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') {
          return 'Finns ingen användare med denna mail registrerad'
        } else if (this.$store.state.authError.message === 'The password is invalid or the user does not have a password.') {
          return 'Fel lösenord. Försök igen'
        } else {
          return this.$store.state.authError.message
        }
      } else {
        return 'Inget felmeddelande'
      }
    },
    wrongCredentials () {
      return this.wrongCredentialsMsg !== 'Inget felmeddelande' && this.loggaInDisabled
    },
    wrongSignUpMsg () {
      if (this.$store.state.authError !== null) {
        return this.$store.state.authError.message
      } else {
        return 'Inget felmeddelande'
      }
    },
    wrongSignUp () {
      return this.wrongSignUpMsg !== 'Inget felmeddelande' && this.registerNewAccBtn
    },
    comparePasswords () {
      return this.passwordSignUp !== this.confirmPassword ? 'Lösenorden matchar inte!' : 'Bra, lösenorden matchar!'
    },
    passIsLongerThanSix () {
      return this.passwordSignUp.length >= 6 ? '' : 'Lösenordet måste vara minst 6 tecken långt'
    },
    user () {
      return this.$store.getters.user
    },
    loggaInDisabled () {
      return this.email !== '' && this.password.length >= 6
    },
    registerNewAccBtn () {
      return (this.fullname.length > 0 && this.fullname.includes(' ') && this.fullname.split(' ')[0].length > 1 && this.fullname.split(' ')[1].length > 1) && this.mailSignUp !== '' && this.passwordSignUp.length >= 6 && (this.passwordSignUp === this.confirmPassword) && (this.gdrpAccept)
    }
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.displayHeadline {
  font-size: 28px!important;
  line-height: 33px!important;
}
</style>
