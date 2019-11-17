<template>
  <v-app
    id="inspire"
  >
  <div class="mainBackground fill-height" v-if="!loadTheSite">
      <!--  ANVÄND v-if="!loadTheSite under production -->
      <v-container fill-height>
        <v-layout justify-center align-center>
          <v-flex style="margin-top:-100px" xs7>
            <h1 class="display-1 text-xs-center mb-2 primary--text text--darken-2">
              <span class="jobflix-title">
                <v-icon class="white--text play-icon-title">play_arrow</v-icon>
                <span class="white--text jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
              </span>
            </h1>
            <v-btn v-if="0" @click="onLogout">LOGGA UT</v-btn>
            <v-progress-linear :indeterminate="true"></v-progress-linear>
            <div v-show="0">
                <router-view/>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <!-- LADDA SIDA  -->
    <div v-if="loadTheSite">
      <v-navigation-drawer
        id="app-drawer"
        v-if="userIsNotABusinessAndIsLoggedIn"
        v-model="drawer"
        app
        dark
        floating
        persistent
        mobile-break-point="991"
        width="260"
        class="zIndex30OnSmall fill-height mainBackground"
      >
        <v-layout
          class="fill-height mainBackground px-3"
          column
        >
          <v-list-tile @click="$router.push('/hem')">
            <h1
              style="font-weight:bold!important;letter-spacing:2px!important;margin-top:30px;margin-left:-6px"
              class="text-xs-center mb-2">
              <span class="jobflix-title">
                <v-icon style="font-size:30px!important;position:absolute;;left:-13px;top:-7.5px" class="white--text">play_arrow</v-icon>
                <span style="font-size:30px!important;margin-left:-6px" class="jobflix-title1">Job</span><span style="font-size:30px!important" class="jobflix-title2">flix</span>
              </span>
            </h1>
          </v-list-tile>
          <v-divider style="margin-bottom:10px;margin-top:5px"/>
          <v-btn
            v-for="link in sideBarItems"
            :key="link.text"
            :to="link.link"
            active-class="success"
            class="white--text"
            flat
            style="text-transform:none;border-radius:5px;margin:0 0 12px 0;height:45px"
            >
            <v-icon class="grey--text text--lighten-4">{{ link.icon }}</v-icon>
            <span class="ml-3 body-1 grey--text text--lighten-2">{{ link.text }}</span>
            <v-spacer></v-spacer>
          </v-btn>
          <v-divider style="margin-bottom:10px"/>
          <v-btn
            v-for="(link, index) in sideBarItems2"
            :key="link.text"
            @click="openWindow(index)"
            active-class="success"
            class="white--text"
            flat
            style="text-transform:none;border-radius:5px;margin:0 0 12px 0;height:45px"
            >
            <v-icon class="grey--text text--lighten-4">{{ link.icon }}</v-icon>
            <span class="ml-3 body-1 grey--text text--lighten-2">{{ link.text }}</span>
            <v-spacer></v-spacer>
            <span v-if="index === 0">{{ messages }}</span>
            <span v-if="index === 1">{{ appointments }}</span>
            <span v-if="index === 2">{{ (calculateReqArr.length - 1) }}</span>
            <span v-if="index === 3">{{ notifications }}</span>
          </v-btn>

        </v-layout>
      </v-navigation-drawer>

    <!-- INLOGGADE TOOLBAR -->
    <v-toolbar
      v-if="userIsNotABusinessAndIsLoggedIn"
      app
      flat
      prominent
      :class="{'mainBackground' : $vuetify.breakpoint.xsOnly, 'grey lighten-3' : $vuetify.breakpoint.smAndUp}"
    >
    <div class="v-toolbar-title">
      <v-toolbar-title
        class="tertiary--text font-weight-light"
      >
        <v-layout row align-center>
          <v-flex xs2>
            <v-btn
              v-if="$vuetify.breakpoint.xsOnly"
              class="v-btn--simple white--text"
              dark
              icon
              @click="drawer = true"
            >
              <v-icon
                large
                color="white">menu</v-icon>
            </v-btn>
           <div v-if="$store.state.getPureProfileInfo !== '' && !$vuetify.breakpoint.xsOnly && $route.path === '/hem'" class="text-xs-left display-1 pt-3 pb-1 secondary--text" style="font-weight:bold">
            {{ $store.state.getPureProfileInfo.fullName.split(' ')[0] }}<span v-show="$store.state.getPureProfileInfo.fullName.split(' ')[0].charAt($store.state.getPureProfileInfo.fullName.split(' ')[0].length - 1) !== 's'">s</span> arbetsportal
          </div>
          <div v-if="$store.state.getPureProfileInfo !== '' && !$vuetify.breakpoint.xsOnly && $route.path === '/profil'" class="text-xs-left display-1 pt-3 pb-1 secondary--text" style="font-weight:bold">
            Profilen
          </div>
          <div v-if="$store.state.getPureProfileInfo !== '' && !$vuetify.breakpoint.xsOnly && $route.path === '/share'" class="text-xs-left display-1 pt-3 pb-1 secondary--text" style="font-weight:bold">
            Presentationer
          </div>
          </v-flex>
          <v-flex xs10>
            <div
              v-if="$vuetify.breakpoint.xsOnly"
              @click="$router.push('/hem')"
              style="font-weight:bold!important"
              class="display-1 text-xs-center jobflix-title">
                <v-icon
                  medium
                  class="white--text play-icon-title"
                  style="left:3px!important;top:2px;margin-left:10px"
                  >
                  play_arrow
                </v-icon>
                <span style="margin-left:10px" class="white--text jobflix-title1">JOB</span><span class="jobflix-title2">FLIX</span>
            </div>
          </v-flex>
          <v-flex v-if="$vuetify.breakpoint.xsOnly" @click="$router.push('/share')" style="position:absolute;right:60px;top:12.5px" xs2>
            <v-icon x-large color="white">videocam</v-icon>
          </v-flex>
        </v-layout>
      </v-toolbar-title>
    </div>

    <v-spacer/>
    <v-toolbar-items v-if="$vuetify.breakpoint.smAndUp">
      <v-flex
        align-center
        layout
        py-2
      >
        <router-link
          class="toolbar-items"
          to="/hem"
        >
          <v-icon
            medium
            class="grey--text text--darken-2">dashboard</v-icon>
        </router-link>
        <div
          slot="activator"
          class="toolbar-items pointer ml-4"
          @click="messagesDialog = true"
        >
          <v-badge :overlap="messages > 0" :color="badgeColorMessages" left>
           <span :class="{'transparentText' : messages === 0}" slot="badge">{{ messages }}</span>
            <v-icon
              medium
              class="grey--text text--darken-2">messages</v-icon>
          </v-badge>
        </div>
        <div
          slot="activator"
          class="toolbar-items pointer"
          @click="kalenderWindow = true"
        >
          <v-badge :overlap="appointments > 0" :color="badgeColorAppointments" left>
           <span :class="{'transparentText' : appointments === 0}" slot="badge">{{ appointments }}</span>
            <v-icon
              medium
              class="grey--text text--darken-2">calendar_today</v-icon>
          </v-badge>
        </div>
        <div
          slot="activator"
          class="toolbar-items pointer ml-4"
          @click="requestWindow = true"
        >
          <v-badge :overlap="(calculateReqArr.length - 1) > 0" :color="badgeColorRequests" left>
            <span :class="{'transparentText' : (calculateReqArr.length - 1) <= 0}" slot="badge">
              {{ calculateReqArr.length - 1 }}
            </span>
            <v-icon
              medium
              class="grey--text text--darken-2">person_add</v-icon>
          </v-badge>
        </div>
        <div
          slot="activator"
          class="toolbar-items pointer ml-4"
          @click="notificationsWindow = true, zeroNotifications()"
        >
          <v-badge :overlap="notifications > 0" :color="badgeColorNotifications" left>
            <span :class="{'transparentText' : notifications === 0}" slot="badge">
              {{ notifications }}
            </span>
            <v-icon
              medium
              class="grey--text text--darken-2">notifications</v-icon>
          </v-badge>
        </div>
        <v-btn
          style="height:45px;border-radius:5px"
          small
          class="toolbar-items success mx-4"
          to="/share"
        >
          <v-icon
            large
            color="white">videocam</v-icon>
        </v-btn>
        <router-link
          class="toolbar-items mr-3"
          to="/profil"
        >
          <v-icon
            medium
            class="grey--text text--darken-2">person</v-icon>
        </router-link>
      </v-flex>
    </v-toolbar-items>
    <v-menu offset-y>
        <v-btn
          slot="activator"
          flat
          :class="{'grey--text text--darken-2' : $vuetify.breakpoint.smAndUp, 'white--text' : $vuetify.breakpoint.xsOnly}"
          fab
          small
        >
          <v-icon large>arrow_drop_down</v-icon>
        </v-btn>
        <v-layout justify-center class="white" style="z-index:5;width:200px" wrap>
          <v-flex class="grey lighten-4" text-xs-center pt-2 xs12>
            <div class="caption">Hantera</div>
            <v-divider class="mt-1"></v-divider>
          </v-flex>
          <v-flex @click="onLogout" style="cursor:pointer;border-top:1px solid lightgrey" class="hoverDropMenu" text-xs-center py-2 xs12>
            <div class="caption primary--text text--darken-2">Logga ut</div>
          </v-flex>
          <v-flex @click="$router.push('/profil')" style="cursor:pointer;border-top:1px solid lightgrey" class="hoverDropMenu" text-xs-center py-2 xs12>
            <div class="caption primary--text text--darken-2">Profil</div>
          </v-flex>
          <v-flex @click="$router.push('/share')" style="cursor:pointer;border-top:1px solid lightgrey" class="hoverDropMenu" text-xs-center py-2 xs12>
            <div class="caption primary--text text--darken-2">Presentationer</div>
          </v-flex>
          <v-flex @click="$router.push('/ads')" style="cursor:pointer;border-top:1px solid lightgrey" class="hoverDropMenu" text-xs-center py-2 xs12>
            <div class="caption primary--text text--darken-2">Annonser</div>
          </v-flex>
        </v-layout>
      </v-menu>
  </v-toolbar>

    <v-content class="grey lighten-3 marginBottomSmall">
      <v-btn v-if="0" style="position:absolute;z-index:10" class="blue white--text" small flat @click="test">TEST FROM APP.VUE</v-btn>
      <v-btn v-if="0" style="position:absolute;z-index:10;margin-top:40px" small flat class="orange white--text" @click="loadFireBaseData">Load firebasedata</v-btn>
            <transition name="component-fade" mode="out-in">
              <router-view/>
            </transition>
              <v-footer
              height="auto"
              color="secondary--text"
            >
            <v-layout wrap>
              <v-flex xs12>
                <v-layout
              class="grey lighten-4"
              justify-center
              row
              wrap
            >
            <v-container>
              <v-layout :my-4="$vuetify.breakpoint.xsOnly" px-3 row wrap>
                <v-flex xs12 sm6>
                  <div style="font-weight:bold" class="subheading secondary--text pb-1">
                    Kategorier
                  </div>
                  <span class="body-2 pb-1">
                    <a target="_blank" href="https://business.jobflix.se/">För arbetsgivare
                      <v-icon small>business</v-icon>
                    </a>
                  </span>
                  <span class="px-1">|</span>
                  <span class="body-2 pb-1">
                    <a href="https://www.jobflix.se">För jobbsökande
                      <v-icon small>work</v-icon>
                    </a>
                  </span>
                  <span class="px-1">|</span>
                  <span class="body-2">
                    <a target="_blank" href="https://info.jobflix.se/faq">FAQ
                      <v-icon small>help</v-icon>
                    </a>
                  </span>
                </v-flex>
                <v-flex :mt-3="$vuetify.breakpoint.xsOnly" xs12 sm6>
                  <div style="font-weight:bold" class="subheading pb-1 secondary--text">
                    Övrigt
                  </div>
                  <span class="body-2">
                    <a target="_blank" href="https://info.jobflix.se">Om Jobflix</a>
                  </span>
                  <span class="px-1">|</span>
                  <span class="body-2 py-1">
                    <a target="_blank" href="https://info.jobflix.se/kontakt">Press</a>
                  </span>
                  <span class="px-1">|</span>
                  <span class="body-2">
                    <a target="_blank" href="https://info.jobflix.se/kontakt">Kontakt</a>
                  </span>
                </v-flex>
                </v-layout>
                </v-container>
              </v-layout>
              </v-flex>

              <v-flex class="white lighten-3 white--text" xs12>
              <v-layout wrap>
                <v-container style="margin-top:-15px;margin-bottom:-15px">
                  <v-layout py-3 px-2 row wrap>
                    <v-flex xs12>
                      <span class="body-1 secondary--text">
                        <span class="jobflix-title" style="font-size:13px !important;position:relative">
                          <v-icon style="position:absolute;left:3px;top:-1.3px" small class="black--text">play_arrow</v-icon>
                          <span class="black--text jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
                      </span>
                        &copy; {{ new Date().getFullYear() }}</span>
                         <a target="_blank" href="https://info.jobflix.se/userterms">
                            <v-btn small class="secondary--text" flat round>
                              Villkor
                            </v-btn>
                         </a>
                         <a target="_blank" href="https://info.jobflix.se/policy">
                            <v-btn small class="secondary--text" flat round>
                              Sekretesspolicy
                            </v-btn>
                         </a>
                         <a target="_blank" href="https://info.jobflix.se/faq">
                          <v-btn small class="secondary--text" flat round>
                            Hjälp
                          </v-btn>
                        </a>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-layout>
              </v-flex>
            </v-layout>
          </v-footer>
    </v-content>


      <v-layout row v-if="userIsNotABusinessAndIsLoggedIn && (profile !== '' && profile !== 'userObject')">
        <v-flex xs12 v-if="$vuetify.breakpoint.xsOnly && profileStrengthValue < 40 && userIsNotABusinessAndIsLoggedIn" @click="$router.push('/profil')" style="position:fixed;bottom:50px;font-weight:bold;z-index:20;width:100%!important" class="py-3 text-xs-center red subheading white--text pointer">
          <v-icon class="mr-2 white--text">warning</v-icon>
          Steg 1 av 2: Redigera i din profil
          <v-icon class="white--text">person</v-icon>
        </v-flex>

          <v-flex xs12 v-if="$vuetify.breakpoint.smAndUp && profileStrengthValue < 40 && userIsNotABusinessAndIsLoggedIn" @click="$router.push('/profil')" style="position:fixed;bottom:0;font-weight:bold;z-index:20;width:100%!important" class="py-3 text-xs-center red subheading white--text pointer">
            <v-icon class="mr-2 white--text">warning</v-icon>
            Steg 1 av 2: Redigera i din profil
            <v-icon class="white--text">person</v-icon>
          </v-flex>

          <v-flex xs12 v-if="$vuetify.breakpoint.xsOnly && allCampaigns.length === 0 && profileStrengthValue >= 40 && userIsNotABusinessAndIsLoggedIn" @click="$router.push('/share')" style="position:fixed;bottom:50px;font-weight:bold;z-index:20;width:100%!important" class="py-3 text-xs-center red subheading white--text pointer">
            <v-icon class="mr-2 white--text">warning</v-icon>
            Steg 2 av 2: Skapa videopresentation
            <v-icon class="white--text">videocam</v-icon>
          </v-flex>

          <v-flex xs12 v-if="$vuetify.breakpoint.smAndUp && allCampaigns.length === 0 && profileStrengthValue >= 40 && userIsNotABusinessAndIsLoggedIn" @click="$router.push('/share')" style="position:fixed;bottom:0;font-weight:bold;z-index:20;width:100%!important" class="py-3 text-xs-center red subheading white--text pointer">
            <v-icon class="mr-2 white--text">warning</v-icon>
            Steg 2 av 2: Skapa videopresentation
            <v-icon class="white--text">videocam</v-icon>
          </v-flex>
      </v-layout>

     <v-bottom-nav
      v-if="userIsNotABusinessAndIsLoggedIn"
      class="hidden-sm-and-up white"
      :active.sync="bottomNav"
      :value="true"
      fixed
      height="50"
      >
      <v-layout pt-1 justify-center align-center>

        <v-flex text-xs-center xs2>
              <v-icon @click="toHome" color="grey" flat value="market" medium>dashboard</v-icon>
          </v-flex>

        <v-flex @click="kalenderWindow = true" text-xs-center xs2>
            <v-badge :overlap="appointments > 0" :color="badgeColorAppointments" left>
              <span slot="badge">{{ appointments }}</span>
              <v-icon :class="{'grey--text' : appointments === 0, 'green--text text--darken-3' : appointments > 0}" flat value="calendar" medium>today</v-icon>
            </v-badge>
        </v-flex>

        <v-flex @click="requestWindow = true" text-xs-center xs2>
              <v-badge :overlap="(calculateReqArr.length - 1) > 0" :color="badgeColorRequests" left>
                <span slot="badge">{{ (calculateReqArr.length - 1) }}</span>
                <v-icon :class="{'grey--text' : (calculateReqArr.length - 1) === 0, 'green--text text--darken-3' : (calculateReqArr.length - 1) > 0}" flat value="requests" medium>person_add</v-icon>
              </v-badge>
        </v-flex>

          <v-flex @click="notificationsWindow = true, zeroNotifications()" text-xs-center xs2>
              <v-badge :overlap="notifications > 0" :color="badgeColorNotifications" left>
                <span slot="badge">{{ notifications }}</span>
                <v-icon :class="{'grey--text' : notifications === 0, 'grey--text text--darken-3' : notifications > 0}" flat value="notifications" medium>notifications</v-icon>
              </v-badge>
          </v-flex>

          <v-flex @click="messagesDialog = true" text-xs-center xs2>
              <v-badge :overlap="messages > 0" :color="badgeColorMessages" left>
                <span slot="badge">{{ messages }}</span>
                <v-icon :class="{'grey--text' : messages === 0, 'grey--text text--darken-3' : messages > 0}" flat value="notifications" medium>message</v-icon>
              </v-badge>
          </v-flex>

          <v-flex text-xs-center xs2>
              <v-icon @click="toProfil" class="grey--text text--darken-2" flat value="market" medium>person_outline</v-icon>
          </v-flex>

      </v-layout>
    </v-bottom-nav>

    <!-- Nedan är Dialogen för notifikationer -->
    <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" v-model="notificationsWindow" max-width="580px">
      <v-card>
        <v-card-title class="title justify-center primary lighten-3 white--text">
          Dina senaste notifikationer
          <v-icon class="white--text ml-2">notifications</v-icon>
          <div class="closeModal">
            <v-icon @click="notificationsWindow = false" class="pointer white--text" large>close</v-icon>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div v-show="typeof(x) !== 'number'" v-bind:key="i" v-for="(x, i) in notificationsArr" style="border-bottom:1px solid lightgrey" class="body-2 py-3 pl-2">
            <div class="body-2">{{ x.msg }}</div>
            <div class="body-1 pt-1">
              <v-icon class="pr-1 orange--text" small>access_time</v-icon> {{ giveMeDate(x.date) }}
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

  <!-- Nedan är Dialogen för mötesinbjudningar -->
    <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" v-model="requestWindow" max-width="650px">
      <v-card class="white">
        <v-card-title class="title primary lighten-2 white--text">
          <span v-show="calculateReqArr.length - 1 > 0">
            <span v-show="(calculateReqArr.length - 1) > 0">Grattis!&nbsp;</span>Du har {{ (calculateReqArr.length - 1) }} ny<span v-show="(calculateReqArr.length - 1) > 1 || (calculateReqArr.length - 1) === 0">a</span>&nbsp;förfrågning<span v-show="(calculateReqArr.length - 1) > 1 || (calculateReqArr.length - 1) === 0">ar</span>
            <v-icon class="white--text ml-2">work</v-icon>
          </span>
          <span v-show="(calculateReqArr.length - 1) === 0">
            Du har för tillfället inga nya förfrågningar
            <v-icon class="white--text ml-1">work</v-icon>
          </span>
          <div class="closeModal">
            <v-icon class="white--text" @click="requestWindow = false" large>close</v-icon>
          </div>
        </v-card-title>
        <v-card-text class="grey lighten-4">
          <div class="body-1 px-2 py-4" v-if="requests === 0">
            Du har för tillfället inga förfrågningar. Du kommer bli notifierad via mail så
            fort du fått en förfrågan. Gå till "<v-icon small>videocam</v-icon>" i menyn
            för att skapa och redigera dina presentationer.
          </div>
          <v-card v-bind:key="i" v-for="(req, i) in calculateReqArr">
            <v-layout v-if="req.accepted === 0" row class="my-3 px-2 py-2" wrap>
              <v-flex md4>
                <div class="body-2">Företag &amp; kontaktperson:</div>
                <div style="font-weight:bold" class="subheading success--text text--darken-3">{{ req.corp }}</div>
                <div class="body-2 black--text">{{ req.name }}</div>
                <div class="body-2 black--text">{{ req.phoneNr }}</div>
              </v-flex>
              <v-flex md3>
                <div class="body-2">Mötesinbjudan:</div>
                <div class="body-2 success--text text--darken-3">{{ req.type }}</div>
                <div v-if="req.type === 'Personligt möte'" class="body-1 black--text">{{ req.adress }}</div>
                <div class="body-2 primary--text">
                  <a style="text-decoration:none" target="_blank" :href="req.website">Besök hemsida</a>
                </div>
                <div v-if="req.ad !== ''" class="body-2 primary--text">
                  <a @click="currentAd = req.ad, openAd = true" style="text-decoration:none" target="_blank">Se annons</a>
                </div>
              </v-flex>
              <v-flex md5>
                <div class="body-2">Tider:</div>
                <v-layout align-center row wrap>
                  <v-flex md12>
                    <v-radio-group style="margin-top:5px" v-model="req.acceptedTime">
                      <v-radio
                        color="success"
                        class="body-2 black--text"
                        v-for="x in req.dates"
                        :key="x.date"
                        :label="`${x.date} kl. ${x.time}`"
                        :value="x"
                      ></v-radio>
                    </v-radio-group>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex style="margin-top:-15px" pb-2 xs12>
                <div class="body-2">Om tjänsten:</div>
                <div class="body-1">{{ req.about }}</div>
              </v-flex>
              <v-flex pb-2 v-if="req.msg !== ''" xs12>
                <div class="body-2">Meddelande:</div>
                <div class="body-1">{{ req.msg }}</div>
              </v-flex>
              <v-flex xs12>
                <div class="red--text text--darken-1 body-2">Svar senast: {{ latestAnswerDate(req) }}</div>
              </v-flex>
              <v-flex xs12>
                <v-layout row>
                  <v-flex px-2 md4>
                    <v-btn round flat :loading="sending" @click="requestResponse(req, 1)" :disabled="req.acceptedTime === 'xx'" class="success" block>
                      <span class="hidden-xs-only">Acceptera tid</span>
                      <span class="hidden-sm-and-up">
                        <v-icon large>check_circle</v-icon>
                      </span>
                    </v-btn>
                </v-flex>
                <v-flex px-2 md4>
                  <v-btn :loading="sending" round flat @click="newTimePlease = true, thanksButNo = false, answerMsgDialog = true, requestHolder = req" class="blue white--text" block>
                    Be om ny tid
                  </v-btn>
              </v-flex>
              <v-flex px-2 md4>
                <v-btn :loading="sending" round flat @click="thanksButNo = true, newTimePlease = false, answerMsgDialog = true, requestHolder = req" class="secondary" block>
                  <span class="hidden-xs-only">Avböj</span>
                  <span class="hidden-sm-and-up">
                    <v-icon large>close</v-icon>
                  </span>
                </v-btn>
              </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>

  <v-dialog v-model="answerMsgDialog" max-width="400">
        <v-card>
          <v-card-title>
            <div v-show="newTimePlease" class="title">Vilka dagar/tider brukar passa bäst för dig?</div>
            <div v-show="thanksButNo" class="title">Varför avböjer du?</div>
          </v-card-title>
          <div class="px-3">
            <v-textarea
              color="blue"
              label="Skriv in ditt meddelande"
              v-model="answerMsgHolder"
            ></v-textarea>
          </div>
          <v-card-actions>
            <v-btn flat round :disabled="!answerMsgText" :loading="sending" block class="success" v-if="newTimePlease === true" @click="requestResponse(requestHolder, 2)">Skicka</v-btn>
            <v-btn flat round :disabled="!answerMsgText" :loading="sending" block class="success" v-if="thanksButNo === true" @click="requestResponse(requestHolder, 3)">Skicka</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

  <!-- Nedan är dialog för kalender -->
  <v-layout row justify-center>
    <v-dialog
      :fullscreen="$vuetify.breakpoint.xsOnly"
      v-model="kalenderWindow"
      max-width="800"
    >
      <v-card>
        <v-layout @click="openBookedMeetings" row wrap>
            <v-card-title class="title">
              Kalender / Bokade möten
              <div class="closeModal">
              <v-icon @click="kalenderWindow = false" class="pointer" large>close</v-icon>
            </div>
            </v-card-title>
            <v-date-picker
              color="green lighten-1"
              v-model="date"
              full-width
              :landscape="!this.$vuetify.breakpoint.smAndDown"
              class="my-3"
              :events="allAppointmentDates"
              event-color="green"
            ></v-date-picker>
          </v-layout>
          
          <v-layout class="grey lighten-4" px-3 py-2 row wrap>
            <v-flex xs12>
              <div class="title pb-3">
                Kommande möten: {{ appointments }}
              </div>
            </v-flex>
            <v-flex @click="date = m.acceptedTime.date, bokatMote = true" v-bind:key="index" v-for="(m, index) in comingAppointments" xs12 md5>
              <v-layout v-if="index <= 3" class="v-card white pointer" align-center mb-1 px-2 py-2 mr-2 row wrap>
                <v-flex xs2>
                  <v-avatar
                      size="40px"
                    >
                    <img :src="m.logo" alt="Logga">
                  </v-avatar>
                </v-flex>
                <v-flex xs10>
                  <div class="body-2">
                    {{ m.corp }} ({{ m.name }})
                  </div>
                  <div class="body-1">
                    Datum: <span class="body-2 success--text text--darken-2">{{ m.acceptedTime.date }} kl. {{ m.acceptedTime.time }}</span>
                  </div>
                  <div class="body-1">
                    {{ m.type }}
                    <span v-if="m.type === 'Personligt möte'">{{ m.adress }}</span>
                  </div>
                  <div class="body-1">
                    Telefon: {{ m.phoneNr }}
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12>
              <v-btn block @click="showAllAppointments = !showAllAppointments" flat small>
                Visa fler
                <v-icon>{{ showAllAppointments ? 'arrow_drop_up' : 'arrow_drop_down' }}</v-icon>
              </v-btn>
              <v-layout row wrap v-show="showAllAppointments">
                <v-flex @click="date = m.acceptedTime.date, bokatMote = true" v-bind:key="index" v-for="(m, index) in comingAppointments" xs12 md5>
                  <v-layout v-if="index > 3" class="v-card white pointer" align-center mb-1 px-2 py-2 mr-2 row wrap>
                    <v-flex pl-1 xs2>
                      <v-avatar
                          size="40px"
                        >
                        <img :src="m.logo" alt="Profilbild">
                      </v-avatar>
                    </v-flex>
                    <v-flex xs10>
                      <div class="body-2">
                        {{ m.corp }} ({{ m.name }})
                      </div>
                      <div class="body-1">
                        Datum: <span class="body-2 success--text text--darken-2">{{ m.acceptedTime.date }} kl. {{ m.acceptedTime.time }}</span>
                      </div>
                      <div class="body-1">
                        {{ m.type }}
                        <span v-if="m.type === 'Personligt möte'">{{ m.adress }}</span>
                      </div>
                      <div class="body-1">
                        Telefon: {{ m.phoneNr }}
                      </div>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>

      </v-card>
    </v-dialog>
  </v-layout>

  <!-- Nedan är för öppnade kalenderdatum -->
  <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" v-model="bokatMote" width="600" >
      <v-card>
        <v-card-title class="headline success lighten-1 white--text" primary-title>
          {{date}} - Bokade möten:&nbsp;<span :class="{'white--text' : bookedMeetingsThisDay.length > 0}">{{ bookedMeetingsThisDay.length }} st.</span>
          <div class="closeModal">
            <v-icon class="white--text" @click="bokatMote = false" large>close</v-icon>
          </div>
        </v-card-title>
        <v-card-text class="grey lighten-3">
          <div v-bind:key="i" v-for="(m, i) in bookedMeetingsThisDay" class="body-2 v-card white">
            <v-layout px-2 py-2 my-3 align-center row wrap>
              <v-flex justify-center md6>
                <div class="body-2">Företag:&nbsp;<span class="success--text text--darken-3">{{ m.corp }}</span></div>
                <div class="body-2">Kontakt:&nbsp;<span class="success--text text--darken-3">{{ m.name }}</span></div>
                <div class="body-2">Mobilnummer:&nbsp;<span class="success--text text--darken-3">{{ m.phoneNr }}</span></div>
              </v-flex>
              <v-flex :pl-2="$vuetify.breakpoint.mdAndUp" md6>
                <div class="body-2">Tid:&nbsp;<span class="success--text text--darken-3">{{ m.acceptedTime.time }}</span></div>
                <div class="body-2">Typ:&nbsp;<span class="success--text text--darken-3">{{ m.type }}</span></div>
                <div v-if="m.type === 'Personligt möte'" class="body-2">Plats:&nbsp;<span class="success--text text--darken-3">{{ m.adress }}</span></div>
                <div class="body-2">Email:&nbsp;<span class="success--text text--darken-3">{{ m.businessUserMail }}</span></div>
              </v-flex>
              <v-flex mt-2 text-xs-center xs12>
                <v-btn @click="m.readMore = !m.readMore" block round flat outline small class="secondary caption">Mer <v-icon>{{m.readMore ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</v-icon></v-btn>
                <div class="text-xs-left" v-show="m.readMore">
                  <div class="body-1 py-2"><span class="body-2">Meddelande:</span>&nbsp;{{ m.msg }}</div>
                  <div class="body-1 py-2"><span class="body-2">Om tjänsten:</span>&nbsp;{{ m.about }}</div>
                  <v-btn @click="messagesDialog = true, messageWho = m" round flat small class="success mt-3">Skicka meddelande <v-icon small class="ml-2">message</v-icon></v-btn>
                </div>
              </v-flex>
            </v-layout>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

     <!-- DIALOG FÖR Meddelanden -->
    <v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" max-width="900" v-model="messagesDialog">
      <v-card class="grey lighten-3 black--text">
        <v-card-title class="justify-center primary lighten-1 white--text">
          <div class="title">Meddelanden <v-icon class="orange--text text--lighten-2">messages</v-icon></div>
          <v-btn @click="messagesDialog = false" fab flat small style="position:absolute;right:5px;top:3px">
            <v-icon x-large class="white--text">close</v-icon>
          </v-btn>
        </v-card-title>
          <v-layout style="min-height:300px" row>
            <v-flex style="border-right:1px solid black;position:relative" xs12 md4>
              <div class="grey lighten-2 title px-3 py-3">
                Dina kontakter
                <v-tooltip style="position:absolute;right:8px;top:17px;cursor:help" bottom>
                  <v-icon slot="activator" class="primary--text">help</v-icon>
                  <span>En kontakt skapas automatiskt med den du har bokat möte med.</span>
                </v-tooltip>
              </div>
              <div v-bind:key="index" v-for="(x, index) in uniqueMeetingEvents" @click="messageWho = x, openSmallMsg = true, scrollToBottomMsg(), zeroMessage(x)" :class="{'grey lighten-3' : index % 2 === 0 && messageWho.name !== x.name, 'white' : index % 2 !== 0  && messageWho.name !== x.name, 'primary lighten-5' : messageWho.name === x.name}">
                <div style="cursor:pointer" class="py-2 pl-1">
                <v-badge :color="newMessagesForTheConvers(x.businessUserId) ? 'blue' : 'transparent'" right>
                <span :class="{'white--text' : newMessagesForTheConvers(x.businessUserId), 'transparentText' : !newMessagesForTheConvers(x.businessUserId)}" overlap slot="badge">{{ newMessagesForTheConvers(x.businessUserId) }}</span>
                <span style="margin-top:-10px" :class="{'pl-2 body-1' : messageWho.name !== x.name, 'pl-2 body-2' : messageWho.name === x.name }">{{ x.name }}</span>
                </v-badge>
                </div>
                <v-divider></v-divider>
              </div>
            </v-flex>
            <v-flex v-if="$vuetify.breakpoint.mdAndUp" style="position:relative;border:2px solid white" px-4 py-3 xs12 md8>
              <div v-if="messageWho !== ''" style="font-weight:bold" class="subheading primary--text">{{ messageWho.name }}</div>
              <div class="body-2 primary--text">{{ messageWho.corp }}</div>
              <div id="messageContainer" style="overflow-y:auto;max-height:400px;margin-bottom:70px">
              <v-layout mt-1 v-bind:key="index" v-for="(x, index) in theMessageConversion.msg" :justify-end="x.from === 'applicant'" :justify-start="x.from === 'business'">
                <v-flex mr-2 xs6>
                  <div :class="{'body-1 primary lighten-4 px-2 py-2' : x.from === 'applicant', 'body-1 white px-2 py-2' : x.from === 'business'}" style="border-radius:10%">
                    {{ x.msg }}
                  </div>
                </v-flex>
              </v-layout>
              </div>
              <div>
                <div style="position:absolute;bottom:0px;left:5px" class="writeMessage">
                  <v-text-field
                    color="primary"
                    placeholder="Skriv ditt meddelande..."
                    v-model="newMessage"
                  >
                  </v-text-field>
                </div>
                <div>
                  <v-tooltip style="position:absolute;bottom:10px;right:15px" bottom>
                    <v-btn @click="sendMessage" slot="activator" small flat fab><v-icon medium class="primary--text">send</v-icon></v-btn>
                    <span>Skicka meddelande</span>
                  </v-tooltip>
                </div>
              </div>
            </v-flex>
          </v-layout>
      </v-card>
    </v-dialog>

  <!-- Skriva meddelanden för small screens  -->
  <div v-if="$vuetify.breakpoint.smAndDown">
    <v-dialog fullscreen v-model="openSmallMsg">
      <v-card class="white" style="position:relative">
        <v-layout row wrap>
           <v-flex px-2 py-3 xs12>
              <v-card-title class="white justify-center">
                <v-layout justify-center wrap>
                  <v-flex style="margin-top:-20px" text-xs-center xs12>
                    <div v-if="messageWho !== ''" style="font-weight:bold" class="subheading primary--text">
                      {{ messageWho.name }}
                    </div>
                  </v-flex>
                  <v-flex text-xs-center xs12>
                     <div v-if="messageWho !== ''" style="font-weight:bold" class="body-2 primary--text">
                      {{ messageWho.corp }}
                    </div>
                  </v-flex>
                </v-layout>
                <v-btn @click="openSmallMsg = false" style="position:absolute;right:15px;top:12px" fab small flat>
                  <v-icon class="primary--text text--darken-2" x-large>close</v-icon>
                </v-btn>
              </v-card-title>
              <div id="messageContainer" style="overflow-y:auto;max-height:400px;margin-bottom:70px">
              <v-layout mt-1 v-bind:key="index" v-for="(x, index) in theMessageConversion.msg" :justify-end="x.from === 'applicant'" :justify-start="x.from === 'business'">
                <v-flex mr-2 xs6>
                  <div :class="{'body-1 primary lighten-4 px-2 py-2' : x.from === 'applicant', 'body-1 success lighten-4 px-2 py-2' : x.from === 'business'}" style="border-radius:10%">
                    {{ x.msg }}
                  </div>
                </v-flex>
              </v-layout>
              </div>
              <div>
                <div style="position:absolute;bottom:0px;left:5px" class="writeMessage">
                  <v-text-field
                    color="primary"
                    placeholder="Skriv ditt meddelande..."
                    v-model="newMessage"
                  >
                  </v-text-field>
                </div>
                <div>
                  <v-tooltip style="position:absolute;bottom:10px;right:15px" bottom>
                    <v-btn @click="sendMessage" slot="activator" small flat fab><v-icon medium class="primary--text">send</v-icon></v-btn>
                    <span>Skicka meddelande</span>
                  </v-tooltip>
                </div>
              </div>
            </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>

  <!--   NOTIFIKATION FÖR SKICKAD REPSONS PÅ FÖRFRÅGAN   -->
  <v-dialog max-width="400" v-model="responsWasSentModal">
    <v-card>
      <v-card-title class="primary lighten-3 justify-center">
        <div class="title white--text">
          Din respons har skickats <v-icon class="white--text">check_circle</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <div class="body-1 px-2 py-2">
          {{ requestResponseModalText }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn round @click="responsWasSentModal = false" block outline class="secondary">OK!</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

    <!--     DIALOG FÖR ATT LÄSA ANNONS     -->
    <div v-if="currentAd !== ''">
      <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="1000" v-model="openAd">
        <v-card>
          <v-card-title class="primary lighten-3 justify-center">
            <div class="title white--text">
              {{ currentAd.corp }}
            </div>
            <div class="title white--text">
              {{ currentAd.title }}
            </div>
            <div style="position:absolute;right:5px;top:5px">
              <v-icon @click="openAd = false" class="pointer white--text" large>close</v-icon>
            </div>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex px-2 xs12 md8>
                <div style="font-weight:bold" class="subheading">
                  {{ currentAd.corp }}
                </div>
                <div style="font-weight:bold" class="subheading pt-1">
                  {{ currentAd.title }}
                </div>
                <div class="body-2 py-3">
                  {{ currentAd.bransch }} <span v-if="currentAd.bransch !== ''">> {{ currentAd.underCategory }}</span>
                </div>
                <div>
                  <v-chip v-bind:key="i" v-for="(tag, i) in currentAd.competences" small label color="green" text-color="white">
                    <v-icon left>label</v-icon>{{ tag }}
                  </v-chip>
                </div>
                <img class="my-2" style="max-width:170px!important;max-height:100px!important" :src="currentAd.logo" alt="Företagsloggan">
                <div v-bind:key="i" v-for="(x, i) in currentAd.getRealAbout" class="body-1 py-3">
                  <p :class="{'body-1' : x.length > 40, 'body-2' : x.length <= 40 }">{{ x }}</p>
                </div>
              </v-flex>
              <v-flex px-2 xs12 md4>
                <div v-if="currentAd.videoUrl !== ''">
                  <video preload controls width="100%" :src="currentAd.videoUrl.i"></video>
                </div>
                <div class="body-1 pb-3">
                  Företaget har valt att skicka denna annons som extramaterial för inbjudan.
                </div> 
                <v-divider></v-divider>
                <div class="body-2 pt-2">Om företaget</div>
                <div v-bind:key="i" v-for="(x, i) in corpDescriptionArr" class="body-1">
                  <p>{{ x }}</p>
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>

    <!-- SKICKAR RESPONS  -->
    <v-dialog max-width="410" v-model="sendingResponse">
      <v-card>
        <v-card-title class="primary lighten-3 justify-center white--text">
          <div class="title">Skickar din respons...</div>
        </v-card-title>
        <v-card-text class="text-xs-center">
          Vätnta medans vi behandlar din respons ...
          <v-btn :loading="sendingResponse" flat block>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>


  <div v-if="welcomeModal">
    <v-dialog max-width="700" v-model="welcomeModal">
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">Välkommen</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="e1 > 2" step="2">Jobb</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3">Profiluppgifter</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card
              class="mb-5"
              color="grey lighten-4"
            >
            <v-card-text>
              <p class="title">
                Välkommen till Jobflix!
              </p>
              <p>
                <v-layout row>
                  <v-flex xs9>
                    Med Jobflix behöver inte du söka jobbet, jobbet söker dig!
                  </v-flex>
                  <v-flex text-xs-center xs3>
                    <img
                      height="50px"
                      src="@/assets/cv-icon.png" 
                      alt="Välkommen">
                  </v-flex>
                </v-layout>
              </p>
              <p>
                Börja med att redigera i din profil.
                Ladda sedan upp en videopresentation där du berättar vem du är, vad för jobb du söker
                och vilka förväntningar du har på din nästa arbetsgivare.
              </p>
              <p>
                Din presentation finns då synlig för arbetsgivare och de kan då enkelt kontakta dig om 
                de matchar in på dina preferenser.
              </p>
            </v-card-text>
            </v-card>

            <v-btn
              class="success subheading"
              round
              block
              @click="e1 = 2"
            >
              Nästa
              <v-icon>arrow_right</v-icon>
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card
              class="mb-5"
              color="grey lighten-4"
            >
              <v-card-text>
                <p class="title">
                  Vad söker du för typ av jobb?
                </p>
                <v-layout row wrap>
                  <v-flex :pr-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
                    <v-autocomplete
                      label="Bransch"
                      :items="getBranschItems"
                      v-model="filter.bransch"
                    >
                    </v-autocomplete>
                  </v-flex>
                  <v-flex :pl-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
                    <v-autocomplete
                      label="Underkategori"
                      :items="getBranschUnderCategories"
                      v-model="filter.category"
                      multiple
                      :counter="5"
                    >
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs12>
                    <v-autocomplete
                      label="Region"
                      :items="$store.state.filter.region"
                      v-model="filter.region"
                    >
                    </v-autocomplete>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>

            <v-btn
              class="success subheading"
              round
              block
              @click="e1 = 3"
            >
              Nästa
              <v-icon>arrow_right</v-icon>
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card
              class="mb-5"
              color="grey lighten-4"
            >
              <v-card-text v-if="$store.state.profileInfo !== 'userObject' && $store.state.profileInfo !== ''">
                <p class="title">
                  Din profil
                </p>
                <v-text-field
                  label="Skriv din yrkestitel"
                  v-model="$store.state.profileInfo.profil.title"
                ></v-text-field>
                <v-text-field
                  label="Beskriv dig själv kortfattat"
                  v-model="$store.state.profileInfo.profil.description"
                ></v-text-field>
                <v-text-field
                  label="Tel. nr"
                  v-model="$store.state.profileInfo.profil.phoneNr"
                ></v-text-field>
                <v-autocomplete
                    :counter="5"
                    box
                    :items="$store.state.filter.competences"
                    v-model="$store.state.profileInfo.profil.competences"
                    label="Tagga relevanta komptenser"
                    multiple
                    chips
                  >
                <template
                  slot="selection"
                  slot-scope="data"
                >
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    close
                    class="v-chip--select-multi"
                    @input="data.parent.selectItem(data.item)"
                  >
                    <v-avatar
                      class="accent white--text"
                      v-text="data.item.slice(0, 1).toUpperCase()"
                    ></v-avatar>
                    {{ data.item }}
                  </v-chip>
                </template>
              </v-autocomplete>
              <div class="caption px-1 py-1 grey lighten-2">
                <v-icon small>info</v-icon>
                Fortsätt redigera direkt från profilen med erfarenheter och utbildningar.
                Lägg sedan upp en videopresentation så är du färdig!
              </div>
              </v-card-text>
            </v-card>

            <v-btn
              class="success"
              round
              block
              @click="welcomeModalBox = false, welcomeModalDone()"
            >
              KLAR
            </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-dialog>
  </div>

    <!--******   Hur det fungerar video Modal    ******-->
      <v-dialog max-width="700" v-model="howItWorksVideo">
        <v-card>
          <v-layout align-center>
            <v-flex align-center text-xs-center>
              <div style="position:absolute;right:0;z-index:20">
                <v-btn @click="howItWorksVideo = false" small fab flat class="secondary pointer">
                    <v-icon large class="white--text">close</v-icon>
                </v-btn>
              </div>
                <video style="margin-bottom:-7px" width="100%" preload controls>
                  <source src="https://firebasestorage.googleapis.com/v0/b/instawork-814df.appspot.com/o/jobflix-videos%2FJobflix_Swedish.mp4?alt=media&token=4d8399d4-9356-4239-9b94-e4da97b23de6" type="video/mp4">
                  Your browser does not support HTML5 video.
                </video>
            </v-flex>
          </v-layout>
        </v-card>
      </v-dialog>

      <!-- DIALOG för FÖRHANDSGRANSKNING AV PROFIL -->
      <div v-if="userIsNotABusinessAndIsLoggedIn && profile !== '' && profile !== undefined">
        <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" v-model="previewProfileDialog" width="950" >
              <v-card>
                 <v-flex :py-2="$vuetify.breakpoint.smAndUp" :px-2="$vuetify.breakpoint.smAndUp" class="grey lighten-3" xs12>
                    <v-card>
                      <v-layout v-show="$vuetify.breakpoint.mdAndUp" row>
                        <v-flex xs12>
                          <v-img height="180px" width="100%" :src="profile.backgroundImg.i">
                          </v-img>
                        </v-flex>
                        <div class="closeModal">
                          <v-btn fab small flat class="secondary lighten-1" @click="previewProfileDialog = false">
                            <v-icon large class="white--text">close</v-icon>
                          </v-btn>
                        </div>
                      </v-layout>

                      <v-layout row wrap>
                        <v-flex v-show="$vuetify.breakpoint.mdAndUp" xs2>
                          <v-img
                          class="ml-2"
                          style="border:4px solid lightgray;margin-top:-50px;border-radius:10px"
                          contain 
                          width="130px" 
                          :src="profile.profilePic.i"
                          >
                          </v-img>
                        </v-flex>
                        <v-flex style="position:relative" v-show="this.$vuetify.breakpoint.smAndDown" xs12>
                          <img height="100px" width="100%" :src="profile.backgroundImg.i">
                          <img
                            style="border:3px solid lightgray;margin-top:0px;position:absolute;bottom:-6px;left:16px;border-radius:10px"
                            :src="profile.profilePic.i"
                            height="105px"
                            >
                          <div class="closeModal">
                            <v-btn small fab flat class="secondary">
                              <v-icon @click="previewProfileDialog = false" medium class="white--text">close</v-icon>
                            </v-btn>
                          </div>
                        </v-flex>
                      <v-flex pl-2 md9 xs12 :pr-2="this.$vuetify.breakpoint.mdAndDown">
                      <div class="text-xs-left display-1 pt-3" style="font-weight:bold">
                        {{ profile.fullName }}
                      </div>
                        <div class="teal--text body-2 py-1">{{ profile.title }}</div>

                        <div class="body-1">{{ profile.description }}</div>

                        <div v-if="profile.externLink.includes('http')" class="body-2 pt-1" style="margin-bottom:-7px">
                          <a target="_blank" :href="profile.externLink">{{ profile.externLink }}</a>
                        </div>

                      <div class="pt-3 mb-2">
                        <v-chip small v-bind:key="x" v-for="x in profile.competences" label color="success" text-color="white">
                          <v-icon small class="pr-1">label</v-icon>{{ x }}
                        </v-chip>
                      </div>
                      </v-flex>
                      </v-layout>
                      </v-card>

                      <v-card class="mt-2">
                        <v-layout py-2 px-3 row wrap>
                          <v-flex :pr-5="this.$vuetify.breakpoint.mdAndUp" md8 xs12>
                            <div class="title py-2 black--text"><v-icon class="black--text">work</v-icon> Erfarenhet</div>
                            <v-divider class="teal mt-1"></v-divider>
                            <v-layout py-3 row wrap>
                              <v-flex v-bind:key="index" v-for="(exp, index) in profile.experience" style="position:relative" class="mb-3" xs12>
                                <div class="subheading grey--text">
                                  <div style="width:100%;font-weight:bold">{{ exp.businessName }}</div>
                                </div>
                              
                                <div class="subheading black--text" style="font-weight:bold">
                                  <div style="width:100%;font-weight:bold" class="black--text subheading">{{ exp.workTitle }}</div>
                                </div>
                                <div class="grey--text py-1">
                                  <v-icon small>calendar_today</v-icon> <span>{{ exp.workPeriod }}</span>
                                </div>
                                <div v-bind:key="i" v-for="(x, i) in exp.descriptionArr">
                                  <p v-if="exp.description.length > 1" style="margin-bottom:-10px" :class="{'body-1' : true, 'pb-2' : !exp.competences.length > 0}">
                                    {{ x }}
                                  </p>
                                </div>
                                <div v-if="exp.competences.length > 0" class="pt-3 mb-2">
                                  <v-chip small v-bind:key="x" v-for="x in exp.competences" label color="success" text-color="white">
                                    <v-icon small class="pr-1">label</v-icon>{{ x }}
                                  </v-chip>
                                </div>
                                <v-divider :class="{'mt-2' : !exp.competences.length > 0}"></v-divider>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                
                        <!-- Utbildning -->
                          <v-flex md4 xs12>
                            <div class="title py-2 black--text"><v-icon class="black--text">school</v-icon> Utbildning</div>
                            <v-divider class="teal mt-1"></v-divider>
                            <v-layout py-3 row wrap>
                              <v-flex style="position:relative" class="mb-3" v-bind:key="index" v-for="(school, index) in profile.education" xs12>
                                <div style="font-weight:bold" class="body-2 grey--text">
                                  {{ school.schoolName }}
                                </div>
                                <div class="subheading black--text" style="font-weight:bold">
                                  {{ school.subject }}
                                </div>
                                <div class="grey--text py-1">
                                  <v-icon small>calendar_today</v-icon> <span>{{ school.eduPeriod }}</span>
                                </div>
                                <div class="pt-1 mb-2">
                                  <v-chip small v-bind:key="x" v-for="x in school.competences" label color="success" text-color="white">
                                    <v-icon small class="pr-1">label</v-icon>{{ x }}
                                  </v-chip>
                                </div>
                                <v-divider></v-divider>
                              </v-flex>
                            </v-layout>
                          </v-flex>

                        </v-layout>
                      </v-card>

                    </v-flex>
              </v-card>
            </v-dialog>
      </div>

  </div>

  </v-app>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  data () {
    return {
      welcomeModalBox: true,
      e1: 0,
      getFilterOnce: 0,
      drawer: null,
      filter: {
        bransch: '',
        category: [],
        region: ''
      },
      sideBarItems: [
        { icon: 'dashboard', text: 'Översikt', link: '/hem' },
        { icon: 'person', text: 'Profilen', link: '/profil' },
        { icon: 'videocam', text: 'Presentationer', link: '/share' },
        { icon: 'work', text: 'Annonser', link: '/ads' },
        { icon: 'star', text: 'Tips & Råd', link: '/inspiration' }
      ],
      sideBarItems2: [
        { icon: 'message', text: 'Meddelanden' },
        { icon: 'today', text: 'Möten' },
        { icon: 'person_add', text: 'Mötesförfrågningar' },
        { icon: 'notifications', text: 'Notifikationer' }
      ],
      clipped: false,
      fixed: false,
      requests: 0,
      requestsArr: '',
      messages: 0,
      messagesObj: '',
      bottomNav: 'person',
      date: '',
      meetingEvents: [],
      meetingEventDates: [],
      bookedMeetingsThisDay: [],
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      miniVariant: false,
      right: true,
      title: 'Jobflix',
      bokatMote: false,
      count: 0,
      notificationsWindow: false,
      requestWindow: false,
      kalenderWindow: false,
      radioGroupTimes: '',
      answerMsgDialog: false,
      newTimePlease: false,
      thanksButNo: false,
      declineReqReasons: '',
      requestHolder: '',
      answerMsg: '',
      answerRadioChooses: '',
      messagesDialog: false,
      openSmallMsg: false,
      messageWho: '',
      theMessageConversion: '',
      newMessage: '',
      sending: false,
      responsWasSentModal: false,
      requestResponseModalText: '',
      userIsNotABusinessUser: false,
      showAllAppointments: false,
      openAd: false,
      currentAd: '',
      answerMsgHolder: '',
      sendingResponse: false,
      firstLoad: 0
    }
  },
  watch: {
    welcomeModalBox: function () {
      if (this.welcomeModalBox === false) {
        this.welcomeModalFalseForever()
      }
    },
    userIsNotABusinessAndIsLoggedIn: function () {
      if (this.userIsNotABusinessAndIsLoggedIn) {
        this.$store.state.loadTheSite = true
        this.$router.push('/hem')
        this.loadFireBaseData()
      }
    },
    kalenderStat: function () {
      if (this.kalenderStat === true) {
        this.date = new Date().toISOString().substr(0, 10)
      }
    },
    theMessageConversion: function () {
      this.scrollToBottomMsg()
    },
    messagesDialog: function () {
      if (this.messagesDialog === true) {
        this.scrollToBottomMsg()
      }
    },
    messageWho: function () {
      var found = 0
      for (var i in this.messagesObj) {
        if (this.messagesObj[i].businessUserId === this.messageWho.businessUserId) {
          this.theMessageConversion = this.messagesObj[i]
          found = 1
        }
      }
      if (found === 0) {
        this.theMessageConversion = ''
      }
    },
    date: function () {
      if (this.$store.state.profileInfo !== 'userObject') {
        this.bookedMeetingsThisDay = []
        this.allAppointments.forEach(val => {
          if (val.acceptedTime.date === this.date) {
            this.bookedMeetingsThisDay.push(val)
          }
        })
        if (this.firstLoad === 0) {
          this.firstLoad = 1
          this.deleteOldAppointments()
        }
      }
    },
    lookForBranschFilter: function () {
      this.filter.category = []
    },
    lookForNewCampaignCategorysChanges: function () {
      if (this.filter.bransch === '') {
        for (let x in this.$store.state.filter.bransch) {
          for (let ii in this.$store.state.filter.bransch[x]) {
            if (this.$store.state.filter.bransch[x][ii].includes(this.filter.category)) {
              this.filter.bransch = this.$store.state.filter.bransch[x].main
              setTimeout(() => {
                this.filter.category = [this.$store.state.filter.bransch[x][ii]]
              }, 100)
            }
          }
        }
      }
    }
  },
  methods: {
    test () {
      console.log('test from app.vue')
    },
    welcomeModalDone () {
      const title = JSON.parse(JSON.stringify(this.$store.state.profileInfo.profil.title))
      const description = JSON.parse(JSON.stringify(this.$store.state.profileInfo.profil.description))
      const competences = JSON.parse(JSON.stringify(this.$store.state.profileInfo.profil.competences))
      const phoneNr = JSON.parse(JSON.stringify(this.$store.state.profileInfo.profil.phoneNr))
      if (this.filter.bransch !== '' || this.filter.category !== '' || this.filter.region !== '') {
        if (this.filter.category.length === 0) {
          this.filter.category = ''
        }
        firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/')
        .update({typeOfJobs: this.filter})
      }
      if (title.length > 0 || description.length > 0) {
        if (competences.length > 0) {
          firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/profil/')
          .update({competences: competences})
        }
        firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/profil/')
        .update({title: title})
        firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/profil/')
        .update({description: description})
        firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/profil/')
        .update({phoneNr: phoneNr})
      }
    },
    deleteOldAppointments () {
      let newObj = {'xx': 0}
      let foundOldAppointments = 0
      for (let i in this.allAppointments) {
        var date = this.allAppointments[i].acceptedTime.date.replace(/-/g, '/')
        if (new Date(date).getTime() > new Date().setDate((new Date().getDate() - 40))) {
          newObj[i] = this.allAppointments[i]
        } else {
          foundOldAppointments = 1
        }
      }
      if (foundOldAppointments === 1) {
        console.log(newObj)
        firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/events/')
        .update({appointments: newObj})
      }
    },
    getFilter () {
      if (this.getFilterOnce === 0) {
        const global = this
        this.getFilterOnce = 1
        // Dunka upp filter för alla
        const url = 'https://prisio-b9e89.firebaseio.com/filter.json'
        fetch(url)
        .then(res => {
          return res.json()
        })
        .then(data => {
          const res = data
          global.$store.state.filter.region = res.region
          global.$store.state.filter.minExp = res.minExp
          global.$store.state.filter.utbildning = res.education
          global.$store.state.filter.bransch = res.categories
          res.tags.sort()
          global.$store.state.filter.competences = res.tags
          global.$store.state.filter.availability = res.availability
        })
        .catch(function (error) {
          console.log(error.message)
        })
      }
    },
    welcomeModalFalseForever () {
      firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/')
        .update({welcomeModal: false})
      // Notifiera new user till admin notifications och maila
      let adminNotification = {
        name: this.$store.state.profileInfo.profil.fullName,
        mail: this.$store.state.profileInfo.profil.email,
        id: new Date().getTime() + 'nu',
        msg: 'Privatperson har signat upp ett konto precis',
        notificationTo: 'Privatperson',
        time: new Date().toISOString().substr(0, 19).replace('T', ' ')
      }
      firebase.database().ref('admin').child('notifications')
        .push(adminNotification)
    },
    loadFireBaseData () {
      const global = this
      const database = firebase.database()
      database.ref('applicants').child(global.$store.state.yourDatabaseString).on('value', response => {
        global.$store.state.profileInfo = response.val().profileInfo
        global.$store.state.getPureProfileInfo = response.val().profileInfo.profil
        global.$store.state.notifications = response.val().profileInfo.events.notifications.shift()
        global.$store.state.notificationsArr = response.val().profileInfo.events.notifications
        global.messagesObj = response.val().profileInfo.events.messages
        var newMessages = 0
        for (var m in response.val().profileInfo.events.messages) {
          if (response.val().profileInfo.events.messages[m].hasOwnProperty('newMessageForApplicant')) {
            newMessages = (newMessages + response.val().profileInfo.events.messages[m].newMessageForApplicant)
            if (global.messageWho !== '') {
              if (response.val().profileInfo.events.messages[m].businessUserId === global.messageWho.businessUserId) {
                global.theMessageConversion = response.val().profileInfo.events.messages[m]
                break
              }
            }
          }
        }
        global.messages = newMessages
        // Styr upp requests
        let requestLength = 0
        let newRequestArr = []
        for (var x in response.val().profileInfo.events.requests) {
          if (response.val().profileInfo.events.requests[x].accepted === 0) {
            requestLength = (requestLength + 1)
            if (response.val().profileInfo.events.requests[x].hasOwnProperty('accepted')) {
              newRequestArr.push(response.val().profileInfo.events.requests[x])
            }
          }
        }
        global.requests = requestLength
        global.requestsArr = newRequestArr
        var meetingEventsArr = []
        global.meetingEvents = []
        global.meetingEventDates = []
        // Fixa in färdiga appointments
        for (var i in response.val().profileInfo.events.appointments) {
          if (response.val().profileInfo.events.appointments[i].accepted === 1) {
            meetingEventsArr.push(response.val().profileInfo.events.appointments[i])
            global.meetingEventDates.push(response.val().profileInfo.events.appointments[i].acceptedTime.date)
          }
        }
        global.meetingEvents = meetingEventsArr
        global.$store.state.meetingEvents = meetingEventsArr
        if (this.count === 0) {
          this.updateLastLogin()
        }
        this.count++
      })
    },
    updateLastLogin () {
      const giveMeDate = new Date().toISOString().substr(0, 19).replace('T', ' ')
      firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/')
        .update({lastLogIn: giveMeDate})
      // Passa på att hämta alla annonserna
      let arr = []
      firebase.database().ref('ads')
        .once('value', response => {
          const res = response.val()
          for (var i in res) {
            for (var xx in res[i]) {
              if (res[i][xx].hasOwnProperty('active') && res[i][xx].active === true) {
                arr.push(res[i][xx])
              }
            }
          }
          this.$store.state.allAds = arr
        })
        .catch(function (error) {
          console.log(error)
        })
      for (let i in this.$store.state.profileInfo.campaigns) {
        if (this.$store.state.profileInfo.campaigns[i].hasOwnProperty('videoPlay')) {
          this.$store.state.profileInfo.campaigns[i].videoPlay = true
        }
      }
      this.getFilter()
    },
    openWindow (index) {
      switch (index) {
        case 0:
          this.messagesDialog = true
          break
        case 1:
          this.kalenderWindow = true
          break
        case 2:
          this.requestWindow = true
          break
        case 3:
          this.notificationsWindow = true
          break
      }
    },
    zeroMessage (msg) {
      // Nollställ msg notifications för denna surr
      var theMessageDBId
      var zero = 0
      var global = this
      setTimeout(function () {
        if (global.theMessageConversion.newMessageForApplicant > 0) {
          firebase.database().ref('applicants').child(global.$store.state.yourDatabaseString + '/profileInfo/events/messages')
          .once('value', response => {
            const res = response.val()
            for (var i in res) {
              if (res[i].businessUserId === msg.businessUserId) {
                theMessageDBId = i
                break
              }
            }
            firebase.database().ref('applicants').child(global.$store.state.yourDatabaseString + '/profileInfo/events/messages/' + theMessageDBId)
              .update({newMessageForApplicant: zero})
          })
          .catch(function (error) {
            console.log(error.message)
          })
        }
      }, 200)
    },
    scrollToBottomMsg () {
      var global = this
      setTimeout(function () {
        var container = global.$el.querySelector('#messageContainer')
        container.scrollTop = container.scrollHeight
      }, 100)
    },
    sendMessage () {
      var businessUserId
      if (this.messageWho !== '') {
        businessUserId = this.messageWho.businessUserId
      }
      var conversionExists = 0
      var theConversionId
      var global = this
      var newMsgBusinessNotification
      if (businessUserId !== undefined && this.newMessage.length > 0) {
        // Ny konversation
        var newMessageObj = {
          newMessageForBusiness: 1,
          newMessageForApplicant: 0,
          businessUserId: businessUserId,
          applicantUserId: this.$store.state.user.id,
          businessDBId: 'xx',
          businessUserDBId: 'xx',
          applicantDBId: this.$store.state.yourDatabaseString,
          msg: [{
            msg: this.newMessage,
            from: 'applicant'
          }]
        }
        // Denna dunkar vi upp i existing surr
        var pushExisting = {
          from: 'applicant',
          msg: this.newMessage
        }
        // Admin notifikation
        let adminNotification = {
          businessUser: this.messageWho.name,
          corp: this.messageWho.corp,
          emailTo: this.messageWho.businessUserMail,
          msg: 'Du har fått ett nytt meddelande, logga in för att se meddelandet.',
          notificationTo: 'Business',
          time: new Date().toISOString().substr(0, 19).replace('T', ' '),
          id: new Date().getTime() + 'dd' + Math.random()
        }
        // Kolla om konversationen finns eller om det ska läggas upp en ny + Lägg upp för applicant Sidan
        firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/events/messages')
          .once('value', response => {
            const res = response.val()
            for (var i in res) {
              if (res[i].businessUserId === businessUserId) {
                conversionExists = 1
                theConversionId = i
                break
              }
            }
            if (conversionExists === 1) {
              firebase.database().ref('applicants').child(global.$store.state.yourDatabaseString + '/profileInfo/events/messages/' + theConversionId + '/msg')
                .push(pushExisting)
            } else {
              firebase.database().ref('applicants').child(global.$store.state.yourDatabaseString + '/profileInfo/events/messages')
                .push(newMessageObj)
            }
            // Dunka upp till business messages
            var businessDBMessageId
            firebase.database().ref('businessAccounts').child(global.messageWho.businessDBId + '/corpInfo/users/' + global.messageWho.businessUserDBId + '/user')
              .once('value', res => {
                const response = res.val()
                // Om konversen existerar
                if (conversionExists === 1) {
                  for (var xx in response.events.messages) {
                    if (response.events.messages[xx].hasOwnProperty('applicantUserId')) {
                      if (response.events.messages[xx].applicantUserId === global.$store.state.user.id) {
                        businessDBMessageId = xx
                        newMsgBusinessNotification = response.events.messages[xx].newMessageForBusiness
                        firebase.database().ref('businessAccounts').child(global.messageWho.businessDBId + '/corpInfo/users/' + global.messageWho.businessUserDBId + '/user/events/messages/' + businessDBMessageId + '/msg')
                          .push(pushExisting)
                        newMsgBusinessNotification = (newMsgBusinessNotification + 1)
                        firebase.database().ref('businessAccounts').child(global.messageWho.businessDBId + '/corpInfo/users/' + global.messageWho.businessUserDBId + '/user/events/messages/' + businessDBMessageId)
                          .update({newMessageForBusiness: newMsgBusinessNotification})
                        break
                      }
                    }
                  }
                } else {
                  // Surret är nytt och måste dunkas upp även hos businessUsern
                  firebase.database().ref('businessAccounts').child(global.messageWho.businessDBId + '/corpInfo/users/' + global.messageWho.businessUserDBId + '/user/events/messages')
                    .push(newMessageObj)
                }
                // Dunka upp till adminNotification i firebase
                firebase.database().ref('admin').child('notifications')
                  .push(adminNotification)
              })
            .catch(function (error) {
              console.log(error.message)
            })
          })
          .catch(function (error) {
            console.log(error.message)
          })
      } else {
        alert('Du måste välja en användare att meddela först')
      }
      this.newMessage = ''
    },
    newMessagesForTheConvers (id) {
      for (var i in this.messagesObj) {
        if (this.messagesObj[i].businessUserId === id) {
          return this.messagesObj[i].newMessageForApplicant
        }
      }
    },
    latestAnswerDate (req) {
      // Gör om denna att räkna från dagens req skickades, inte från new Date() 'alltså idag. Knas ...
      var daysToAdd
      switch (req.deadline) {
        case '5 dagar':
          daysToAdd = 5
          break
        case '1 vecka':
          daysToAdd = 7
          break
        case '2 veckor':
          daysToAdd = 14
          break
        case '3 veckor':
          daysToAdd = 21
          break
        case '1 månad':
          daysToAdd = 31
          break
        case '2 månader':
          daysToAdd = 60
          break
        case '3 månader':
          daysToAdd = 90
          break
        case '6 månader':
          daysToAdd = 180
          break
      }
      var time = new Date(req.dateAndTimeAtSend).setDate((new Date(req.dateAndTimeAtSend).getDate() + daysToAdd))
      var date = new Date(time)
      return date.toString().split(' ').splice(1, 3).join(' ')
    },
    openBookedMeetings (e) {
      if (e.path.length > 15) {
        if (e.path[9].className.includes('v-picker--date')) {
          this.bokatMote = true
        }
      }
    },
    requestResponse (req, answer) {
      const database = firebase.database()
      req.accepted = answer
      req.answerMsg = this.answerMsgHolder
      this.sendingResponse = true
      var global = this
      var theNotificationArr
      this.sending = true
      var notification = {
        id: new Date().getTime(),
        time: new Date().toISOString().substr(0, 19).replace('T', ' ')
      }
      if (req.accepted === 1) {
        notification.msg = global.$store.state.profileInfo.profil.fullName + ' har accepterat din förfrågan.'
        firebase.database().ref('businessAccounts').child(req.businessDBId + '/corpInfo/users/' + req.businessUserDBId + '/user/events/appointments')
          .push(req)
      } else if (req.accepted === 2) {
        notification.msg = global.$store.state.profileInfo.profil.fullName + ' har bett om en ny tid.'
      } else if (req.accepted === 3) {
        notification.msg = global.$store.state.profileInfo.profil.fullName + ' har avböjt din förfrågan.'
      }
      firebase.database().ref('businessAccounts').child(req.businessDBId + '/corpInfo/users/' + req.businessUserDBId + '/user/')
        .once('value', response => {
          const res = response.val()
          res.events.notifications.splice(1, 0, notification)
          theNotificationArr = res.events.notifications
          theNotificationArr[0] = (theNotificationArr[0] + 1)
          database.ref('businessAccounts').child(req.businessDBId + '/corpInfo/users/' + req.businessUserDBId + '/user/events/')
            .update({notifications: theNotificationArr})
        })
        .catch(function (error) {
          console.log(error)
        })
      database.ref('businessAccounts').child(req.businessDBId + '/corpInfo/users/' + req.businessUserDBId + '/user/events/requests/')
      .update({[req.dbKey]: req})
      .then(res => {
        if (answer === 1) {
          global.requestResponseModalText = 'Kontaktpersonen har blivit notifierad. Mötet finns sparade i era båda kalendrar nu!'
        } else if (answer === 2) {
          global.requestResponseModalText = 'Kontaktpersonen har blivit notifierad och du blir notifierad när personen skickat en ny tid.'
        } else {
          global.requestResponseModalText = 'Kontaktpersonen har blivit notifierad.'
        }
        global.responsWasSentModal = true
        global.sending = false
        global.answerMsgDialog = false
        global.sendingResponse = false
      })
      // Gör samma men lägg upp till användarens databas
      if (req.accepted === 1) {
        firebase.database().ref('applicants').child(global.$store.state.yourDatabaseString + '/profileInfo/events/appointments')
          .push(req)
      } else if (req.accepted === 3) {
        let res = global.$store.state
        for (var q in res.profileInfo.campaigns) {
          if (res.profileInfo.campaigns[q].id === req.userCampaign.id) {
            for (var cc in res.profileInfo.campaigns[q].invitationsUsers) {
              if (res.profileInfo.campaigns[q].invitationsUsers[cc] === req.businessUserId) {
                delete res.profileInfo.campaigns[q].invitationsUsers[cc]
              }
            }
          }
        }
        firebase.database().ref('applicants').child(global.$store.state.yourDatabaseString + '/profileInfo/')
          .update({campaigns: global.$store.state.profileInfo.campaigns})
      }
      // Ta bort applicantens request i firebase
      for (var o in global.$store.state.profileInfo.events.requests) {
        if (global.$store.state.profileInfo.events.requests[o].id === req.id) {
          delete global.$store.state.profileInfo.events.requests[o]
        }
      }
      firebase.database().ref('applicants').child(global.$store.state.yourDatabaseString + '/profileInfo/events/')
        .update({requests: global.$store.state.profileInfo.events.requests})
    // ******* Dunka till admin START ****************
      if (req.accepted === 1) {
        let adminNotification = {
          emailTo: req.businessUserMail,
          corp: req.corp,
          msg: notification.msg,
          accepted: req.accepted,
          businessUser: req.name,
          notificationTo: 'Business',
          time: new Date().toISOString().substr(0, 19).replace('T', ' '),
          id: new Date().getTime() + 'bb' + Math.random()
        }
        firebase.database().ref('admin').child('notifications')
          .push(adminNotification)
      } else if (req.accepted === 2) {
        let adminNotification = {
          businessUser: req.name,
          emailTo: req.businessUserMail,
          corp: req.corp,
          msg: notification.msg,
          accepted: req.accepted,
          time: new Date().toISOString().substr(0, 19).replace('T', ' '),
          id: new Date().getTime() + 'cc' + Math.random()
        }
        firebase.database().ref('admin').child('notifications')
          .push(adminNotification)
      }
      // ****** Dunka till admin (Tillfällig lösning tills vi löser automatiska mailutskick) SLUT *****************
    },
    giveMeDate (d) {
      var x
      if (d !== undefined) {
        if (d.split(' ')[0] === new Date().toString().split(' ').splice(1, 3)[0] && d.split(' ')[1] === new Date().toString().split(' ').splice(1, 3)[1] && d.split(' ')[2] === new Date().toString().split(' ').splice(1, 3)[2] && d.split(' ')[3].split(':')[0] === new Date().toString().split(' ').splice(1, 4)[3].split(':')[0]) {
          x = 'Alldeles nyss'
        } else if (d.split(' ')[0] === new Date().toString().split(' ').splice(1, 3)[0] && d.split(' ')[1] === new Date().toString().split(' ').splice(1, 3)[1] && d.split(' ')[2] === new Date().toString().split(' ').splice(1, 3)[2]) {
          x = 'Idag'
        } else {
          x = d.split(' ').splice(0, 3).join(' ')
        }
      } else {
        x = '--'
      }
      return x
    },
    onLogout () {
      this.$store.state.loadTheSite = false
      this.$store.dispatch('logout')
    },
    zeroNotifications () {
      if (this.$store.state.notificationsArr[0] > 0) {
        var newArr = this.$store.state.notificationsArr
        newArr[0] = 0
        newArr.splice(21)
        const database = firebase.database()
        database.ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/events/')
          .update({notifications: newArr})
      }
    },
    toProfil () {
      return this.$router.push('/profil')
    },
    toTips () {
      return this.$router.push('/inspiration')
    },
    toCreate () {
      return this.$router.push('/share')
    },
    toHome () {
      return this.$router.push('/hem')
    }
  },
  computed: {
    lookForBranschFilter () {
      return this.filter.bransch
    },
    lookForNewCampaignCategorysChanges () {
      return this.filter.category
    },
    getBranschItems () {
      var arr = []
      for (var i in this.$store.state.filter.bransch) {
        arr.push(this.$store.state.filter.bransch[i].main)
      }
      return arr
    },
    getBranschUnderCategories () {
      var arr = []
      if (this.filter.bransch !== '') {
        for (var i in this.$store.state.filter.bransch) {
          if (this.filter.bransch === this.$store.state.filter.bransch[i].main) {
            for (var ii in this.$store.state.filter.bransch[i]) {
              arr.push(this.$store.state.filter.bransch[i][ii])
            }
          }
        }
      } else {
        for (let x in this.$store.state.filter.bransch) {
          for (let ii in this.$store.state.filter.bransch[x]) {
            if (ii !== 'main') {
              arr.push(this.$store.state.filter.bransch[x][ii])
            }
          }
        }
      }
      arr.shift()
      return arr
    },
    previewProfileDialog: {
      get () { return this.$store.getters.showProfile },
      set (value) { this.$store.commit('showProfileCommit', value) }
    },
    allAppointments () {
      let arr = []
      for (let i in this.$store.state.profileInfo.events.appointments) {
        if (this.$store.state.profileInfo.events.appointments[i].hasOwnProperty('accepted')) {
          if (this.$store.state.profileInfo.events.appointments[i].accepted === 1) {
            arr.push(this.$store.state.profileInfo.events.appointments[i])
          }
        }
      }
      return arr
    },
    allAppointmentDates () {
      if (this.$store.state.profileInfo !== 'userObject' && this.$store.state.profileInfo !== '') {
        let arr = []
        for (let i in this.$store.state.profileInfo.events.appointments) {
          if (this.$store.state.profileInfo.events.appointments[i].hasOwnProperty('accepted')) {
            if (this.$store.state.profileInfo.events.appointments[i].accepted === 1) {
              arr.push(this.$store.state.profileInfo.events.appointments[i].acceptedTime.date)
            }
          }
        }
        return arr
      }
    },
    profileStrengthValue () {
      if (this.profile !== undefined && this.profile !== 'userObject' && this.profile !== '') {
        let add = 6.1
        let points = 0
        points = this.profile.profilePic !== '' ? points += 4 : points += 0
        points = this.profile.title !== '' ? points += add : points += 0
        points = this.profile.description !== '' ? points += add : points += 0
        points = this.profile.competences.length > 0 ? points += add : points += 0
        // Arbete
        points = this.profile.experience.length > 0 ? points += add : points += 0
        if (this.profile.experience.length > 0) {
          points = this.profile.experience[0].description !== '' ? points += 3 : points += 0
          points = this.profile.experience[0].businessName !== '' ? points += add : points += 0
          points = this.profile.experience[0].workTitle !== '' ? points += add : points += 0
          points = this.profile.experience[0].workPeriod !== 'Klicka för att välja start/slut datum' ? points += add : points += 0
        }
        points = this.profile.experience.length > 1 || this.profile.education.length > 1 ? points += add : points += 0
        if (this.profile.experience.length > 1) {
          points = this.profile.experience[1].description !== '' ? points += 3 : points += 0
          points = this.profile.experience[1].businessName !== '' ? points += add : points += 0
          points = this.profile.experience[1].workTitle !== '' ? points += add : points += 0
          points = this.profile.experience[1].workPeriod !== 'Klicka för att välja start/slut datum' ? points += add : points += 0
        } else if (this.profile.education.length > 1) {
          points = this.profile.education[1].schoolName !== '' ? points += 4.6 : points += 0
          points = this.profile.education[1].subject !== '' ? points += 4.6 : points += 0
          points = this.profile.education[1].eduPeriod !== 'Klicka för att välja start/slut datum' ? points += 4.6 : points += 0
          points = this.profile.education[1].schoolType !== '' ? points += 4.6 : points += 0
        }
        // Utbildning
        points = this.profile.education.length > 0 ? points += add : points += 0
        if (this.profile.education.length > 0) {
          points = this.profile.education[0].schoolName !== '' ? points += add : points += 0
          points = this.profile.education[0].subject !== '' ? points += add : points += 0
          points = this.profile.education[0].eduPeriod !== 'Klicka för att välja start/slut datum' ? points += add : points += 0
          points = this.profile.education[0].schoolType !== '' ? points += add : points += 0
        }
        return points
      } else {
        return 5
      }
    },
    profile () {
      if (this.$store.state.profileInfo !== 'userObject') {
        if (this.$store.state.profileInfo.profil.experience === '') {
          this.$store.state.profileInfo.profil.experience = []
        }
        if (this.$store.state.profileInfo.profil.education === '') {
          this.$store.state.profileInfo.profil.education = []
        }
        return this.$store.state.profileInfo.profil
      } else {
        return ''
      }
    },
    howItWorksVideo: {
      get () { return this.$store.getters.howItWorksVideoGetter },
      set (value) { this.$store.commit('howItWorksVideoCommit', value) }
    },
    welcomeModal: {
      get () { return this.welcomeModalBox && this.$store.getters.welcomeModal },
      set (value) { this.welcomeModalBox = value }
    },
    corpDescriptionArr () {
      var newArr = []
      if (this.currentAd !== '') {
        var arr = this.currentAd.corpDescription.split(String.fromCharCode(10))
        arr.forEach(val => {
          if (val.length > 0) {
            newArr.push(val)
          }
        })
      }
      return newArr
    },
    calculateReqArr () {
      var arr = []
      var time
      var foundPassedReq = 0
      for (var i in this.requestsArr) {
        // Gör om denna att räkna från dagens req skickades, inte från new Date() 'alltså idag. Knas ...
        var daysToAdd
        switch (this.requestsArr[i].deadline) {
          case '5 dagar':
            daysToAdd = 5
            break
          case '1 vecka':
            daysToAdd = 7
            break
          case '2 veckor':
            daysToAdd = 14
            break
          case '3 veckor':
            daysToAdd = 21
            break
          case '1 månad':
            daysToAdd = 31
            break
          case '2 månader':
            daysToAdd = 60
            break
          case '3 månader':
            daysToAdd = 90
            break
          case '6 månader':
            daysToAdd = 180
            break
        }
        time = new Date(this.requestsArr[i].dateAndTimeAtSend).setDate((new Date(this.requestsArr[i].dateAndTimeAtSend).getDate() + daysToAdd))
        if ((time >= new Date().getTime()) && (this.requestsArr[i].accepted === 0)) {
          arr.push(this.requestsArr[i])
        } else {
          // När en gammal request tas bort, så se till o ta bort id från den kampanjen oxå
          var newInvArr = []
          for (var c in this.$store.state.profileInfo.campaigns) {
            if (this.$store.state.profileInfo.campaigns[c].hasOwnProperty('bransch') && this.$store.state.profileInfo.campaigns[c].id === this.requestsArr[i].userCampaign.id) {
              this.$store.state.profileInfo.campaigns[c].invitationsUsers.forEach(val => {
                if (val !== this.requestsArr[i].businessUserId) {
                  newInvArr.push(val)
                  this.$store.state.profileInfo.campaigns[c].invitationsUsers = newInvArr
                }
              })
            }
          }
          foundPassedReq = 1
        }
      }
      arr.unshift(0)
      if (foundPassedReq === 1) {
        firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/')
          .update({campaigns: this.$store.state.profileInfo.campaigns})
        firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/events/')
          .update({requests: arr})
      }
      return arr
    },
    userIsNotABusinessAndIsLoggedIn () {
      return this.$store.state.profileInfo !== '' && this.$store.state.user !== null && this.$store.state.yourDatabaseString !== ''
    },
    loadTheSite () {
      return this.$store.state.loadTheSite
    },
    allCampaigns () {
      var arr = []
      for (var i in this.$store.state.profileInfo.campaigns) {
        if (this.$store.state.profileInfo.campaigns[i].hasOwnProperty('id')) {
          arr.push(this.$store.state.profileInfo.campaigns[i])
        }
      }
      return arr
    },
    uniqueMeetingEvents () {
      var allIds = []
      var arr = []
      this.meetingEvents.forEach(val => {
        if (!allIds.includes(val.businessUserId)) {
          allIds.push(val.businessUserId)
          arr.push(val)
        }
      })
      return arr
    },
    answerMsgText () {
      return this.answerMsgHolder.length > 1
    },
    notificationsArr () {
      return this.$store.state.notificationsArr
    },
    notifications: {
      get () { return this.$store.getters.notifications },
      set (value) { this.$store.commit('notificationsCommit', value) }
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined && !this.$store.state.initialDataIsLoading
    },
    appointments () {
      var arr = this.meetingEventDates.filter(val => {
        return val >= new Date().toISOString().substr(0, 10)
      })
      return arr.length
    },
    comingAppointments () {
      var arr = this.meetingEvents.filter(val => {
        return val.acceptedTime.date >= new Date().toISOString().substr(0, 10)
      })
      arr.sort((a, b) => {
        return a.acceptedTime.date.replace(/-/g, '') - b.acceptedTime.date.replace(/-/g, '')
      })
      return arr
    },
    notificationsStat () {
      return this.notifications === 0 ? 'notifications' : 'notifications'
    },
    badgeColorAppointments () {
      return this.appointments > 0 ? 'red' : 'transparent'
    },
    badgeColorRequests () {
      return (this.calculateReqArr.length - 1) > 0 ? 'red' : 'transparent'
    },
    badgeColorNotifications () {
      return this.notifications > 0 ? 'red' : 'transparent'
    },
    badgeColorMessages () {
      return this.messages > 0 ? 'red' : 'transparent'
    },
    kalenderStat () {
      return this.kalenderWindow
    },
    profileInfo () {
      return this.$store.state.profileInfo
    }
  },
  mounted () {
    // Mounted
  },
  created () {
    // Created
  }
}
</script>

<style>
.footerMarginSmall {
  margin-bottom:56px!important;
}
.v-badge__badge {
  font-size: 7.5pt !important;
  font-weight: bold !important;
  height: 17px !important;
  width: 17px !important;
  margin-top: 6px !important;
  margin-left: 7px !important;
}
.myFlexBtw {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hoverCard:hover {
  box-shadow: 2px 2px 5px 2px lightgrey;
}
.blueHover:hover {
  background-color: blue;
  color:white;
}
.v-radio label {
  color: #333 !important;
}
.pointer {
  cursor: pointer;
}
.mainBackgroundLight {
  background: #dfe9f3; /* fallback for old browsers */
  background: -webkit-linear-gradient(to top, #dfe9f3 0%, white 100%); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top, #dfe9f3 0%, white 100%); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.mainBackground {
  background: #4b6cb7; /* fallback for old browsers */
  background: -webkit-linear-gradient(to left, #4b6cb7 , #182848); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to left, #4b6cb7 , #182848); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.jobflix-title {
  padding-right: 1px;
  padding-left: 15px;
  border-radius: 3px;
  font-family: unset;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 22px;
  letter-spacing: 2px;
  position: relative;
}
.jobflix-title-not-loggedin {
  padding-right: 1px;
  padding-left: 15px;
  border-radius: 3px;
  font-family: unset;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 26px;
  letter-spacing: 2px;
  position: relative;
}
.jobflix-title1 {
  color: #fff;
}
.jobflix-title2 {
  color: orange;
}
.play-icon-title {
  position: absolute;
  z-index: 2;
  left: -3px;
  top: -1px;
}
.play-icon-title-not-loggedin {
  position: absolute;
  z-index: 2;
  left: -4px;
  top: 1px;
}
.transparentText {
  color: transparent !important;
}
.writeMessage {
  position: absolute;
  width: 100%;
  max-width: 95%;
  bottom:0;
}
.v-btn {
  text-transform: none!important;
}
.v-card, .v-dialog, .v-menu__content {
  border-radius: 2px!important;
}
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .1s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.closeModal {
  position: absolute;
  top: 10px;
  right: 10px;
}
.zeroMarginOnSmall {
  margin-left:0px !important;
}
video {
  max-height: 350px!important;
}
img {
  max-height: 350px!important;
}
a {
  text-decoration: none!important;
}
.title {
  line-height: 25px!important;
}
.display-1 {
  font-weight: bold!important;
}
.display-2 {
  font-weight: bold!important;
}
.myDisplay-1 {
  font-size: 30px;
  line-height: 35px;
  font-weight: bold;
}
.displayTitle {
  font-size: 32px;
  line-height: 37px;
  font-weight: bold;
}
@media only screen and (max-width: 600px) {
    .container {
        padding: 0px !important;
    }
    .v-card, .v-dialog, .v-menu__content {
      border-radius: 0px!important;
    }
    .myDisplay-1 {
      font-size: 27px;
      line-height: 35px;
      font-weight: bold;
    }
    .zIndex30OnSmall {
      z-index: 30!important;
    }
}
.hoverDropMenu:hover {
  background-color: #b6d5e4;
}
.container {
  max-width: 1264px!important;
}

@media only screen and (max-width: 960px) {
    .marginBottomSmall {
      margin-bottom: 53px;
    }
}
@media only screen and (max-width: 600px) {
    .display-1 {
      font-size: 28px !important;
      line-height: 35px !important;
    }
}
</style>
