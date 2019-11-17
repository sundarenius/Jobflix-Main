<template>
  <v-container v-if="finishedLoading">
    <v-btn v-if="0" @click="test">Test fr. konsulthem</v-btn>
    <v-layout justify-center row>
      <v-flex xs12>
        <!--  NY TOPP SEKTION  -->
          <v-layout v-if="$store.state.profileInfo !== 'userObject'" mt-3 row wrap>
            <v-flex pr-2 :pl-2="$vuetify.breakpoint.smAndDown" my-2 xs12 md4>
              
              <v-card
              class="mx-auto mainBackground"
              dark
              max-width="400"
            >
              <v-card-title>
                <v-list-tile-avatar color="grey darken-3">
                    <v-img
                      class="elevation-6"
                      :src="$store.state.profileInfo.profil.profilePic.i"
                    ></v-img>
                  </v-list-tile-avatar>
                <span class="title font-weight-bold pl-2">
                  {{ $store.state.profileInfo.profil.fullName.split(' ')[0] }}<span v-if="$store.state.profileInfo.profil.fullName.split(' ')[0][$store.state.profileInfo.profil.fullName.split(' ')[0].length - 1] !== 's'">s</span>
                  profil
                </span>
              </v-card-title>

              <v-card-text style="margin-top:-20px" class="text-xs-center font-weight-bold">
                <div>
                  <v-icon large>{{ profileStrengthValue > 40 ? 'check_circle' : 'edit' }}</v-icon>
                </div>
                <div class="pt-1">
                  1. Redigera i din profil.<span class="white--text">
                      (<span v-show="profileStrengthValue < 100">{{ Math.ceil(profileStrengthValue) }}%</span>
                      <span v-show="profileStrengthValue >= 100">100%</span>
                        <span v-show="profileStrengthValue <= 80">klar.</span>
                        <span v-show="profileStrengthValue > 80">stark.</span>)
                    </span>
                </div>
              </v-card-text>

                 <v-card-actions>
                    <v-btn outline to="/profil" round flat class="white">
                    Profilen
                    <v-icon>arrow_right</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn outline @click="helpModal = true" fab small class="white">
                    <v-icon medium>info</v-icon>
                  </v-btn>
              </v-card-actions>
            </v-card>
              
            </v-flex>
            <v-flex pr-2 :pl-2="$vuetify.breakpoint.smAndDown" my-2 xs12 md4>
               <v-card
              class="mx-auto mainBackground"
              dark
              max-width="400"
            >
              <v-card-title>
                <v-list-tile-avatar color="grey darken-3">
                    <v-icon class="white primary--text text--lighten-2">videocam</v-icon>
                  </v-list-tile-avatar>
                <span class="title font-weight-bold pl-2">Presentationer
                  ({{ Object.keys($store.state.profileInfo.campaigns).length - 1 }} st.)
                </span>
              </v-card-title>

              <v-card-text style="margin-top:-20px" class="text-xs-center font-weight-bold">
                <div>
                  <v-icon large>{{ Object.keys($store.state.profileInfo.campaigns).length > 1 ? 'check_circle' : 'close' }}</v-icon>
                </div>
                <div class="pt-1">
                  2. Ladda upp en videopresentation.
                </div>
              </v-card-text>
              
                  <v-card-actions>
                    <v-btn outline @click="$router.push('/share')" round flat class="white">
                    Skapa videopresentation
                    <v-icon class="ml-1">videocam</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn outline @click="helpModal = true" fab small class="white">
                    <v-icon medium>info</v-icon>
                  </v-btn>
              </v-card-actions>

            </v-card>
            </v-flex>
            <v-flex pr-2 :pl-2="$vuetify.breakpoint.smAndDown" my-2 xs12 md4>
               <v-card
              class="mx-auto mainBackground"
              dark
              max-width="400"
            >
              <v-card-title>
                <v-list-tile-avatar color="grey darken-3">
                    <v-icon large>work</v-icon>
                  </v-list-tile-avatar>
                <span class="title font-weight-bold pl-2">
                  KLAR!
                </span>
              </v-card-title>

              <v-card-text style="margin-top:-20px" class="text-xs-center font-weight-bold">
                <div>
                  <v-icon large>{{ Object.keys($store.state.profileInfo.campaigns).length > 1 ? 'check_circle' : 'close' }}</v-icon>
                </div>
                <div class="pt-1">
                  3. Klar! Vänta på erbjudanden.
                </div>
              </v-card-text>

                 <v-card-actions>
                    <v-btn outline @click="howItWorksVideo = true" round flat class="white">
                    <v-icon class="mr-1">play_arrow</v-icon>
                    Hur det fungerar
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn outline @click="helpModal = true" fab small class="white">
                    <v-icon medium>info</v-icon>
                  </v-btn>
              </v-card-actions>
            </v-card>
            </v-flex>
          </v-layout>

          <!--  MEDANS DATA HÄMTAS  -->
          <v-layout v-if="$store.state.profileInfo === 'userObject'" mt-3 row wrap>
            <v-flex pr-2 :pl-2="$vuetify.breakpoint.smAndDown" my-2 xs12 md4>
              
              <v-card
              class="mx-auto mainBackground"
              dark
              max-width="400"
            >
              <v-card-title>
                <v-list-tile-avatar color="grey darken-3">
                    <v-img
                      class="elevation-6"
                      src="https://www.jobflix.se/images/profilepic-placeholder.png"
                    ></v-img>
                  </v-list-tile-avatar>
                <span class="title font-weight-bold pl-2">
                  Hämtar data ... 
                 <v-progress-linear :indeterminate="true"></v-progress-linear>
                </span>
              </v-card-title>
            </v-card>
              
            </v-flex>
            <v-flex pr-2 :pl-2="$vuetify.breakpoint.smAndDown" my-2 xs12 md4>
               <v-card
              class="mx-auto mainBackground"
              dark
              max-width="400"
            >
              <v-card-title>
                <v-list-tile-avatar color="grey darken-3">
                    <v-icon class="white primary--text text--lighten-2">videocam</v-icon>
                  </v-list-tile-avatar>
                <span class="title font-weight-bold pl-2">
                  Hämtar data ... 
                 <v-progress-linear :indeterminate="true"></v-progress-linear>
                </span>
              </v-card-title>

            </v-card>
            </v-flex>
            <v-flex pr-2 :pl-2="$vuetify.breakpoint.smAndDown" my-2 xs12 md4>
               <v-card
              class="mx-auto mainBackground"
              dark
              max-width="400"
            >
              <v-card-title>
                <v-list-tile-avatar color="grey darken-3">
                    <v-icon large>work</v-icon>
                  </v-list-tile-avatar>
                <span class="title font-weight-bold pl-2">
                  Hämtar data ... 
                 <v-progress-linear :indeterminate="true"></v-progress-linear>
                </span>
              </v-card-title>
            </v-card>
            </v-flex>
          </v-layout>

        <v-flex xs12 my-2>
        <v-card class="py-3 px-3 white black--text">
          <v-layout row>
            <v-flex xs10 md8>
              <div v-if="campaignsArr.length > 0" class="text-xs-left title py-3">Statistik för dina presentationer ({{ campaignsArr.length - 1 }} st.)</div>
              <div v-if="campaignsArr.length === 0" class="text-xs-left title py-3">Statistik för dina presentationer (0 st.)</div>
            </v-flex>
            </v-layout>
            <!-- LISTA FÖR BIG SCREENS -->
        <div v-if="campaignsArr.length > 0" class="hidden-xs-only">
          <v-flex class="v-card grey lighten-3 mb-1" xs12>
            <v-layout fill-height align-center row wrap>
              <v-flex @click="sortCampaignsArr('active')" pl-2 xs2>
                <v-tooltip bottom>
                  <span :class="{'blue--text' : campaignSort.active, 'body-2' : true}" slot="activator" style="cursor:pointer">Status <v-icon style="color:inherit" small>{{ campaignSort.active ? 'arrow_drop_down' : '' }}</v-icon></span>
                <span>Status visar om din annons är aktiv och <br/> visas för din målgrupp <br/> eller om den är pausad.</span>
              </v-tooltip>
              </v-flex>
              <v-flex @click="sortCampaignsArr('campaignName')" xs2>
                <v-tooltip bottom>
                  <span :class="{'blue--text' : campaignSort.campaignName, 'body-2' : true}" slot="activator" style="cursor:pointer">Namn <v-icon style="color:inherit" small>{{ campaignSort.campaignName ? 'arrow_drop_down' : '' }}</v-icon></span>
                <span>Namnet på din presentation.</span>
              </v-tooltip>
              </v-flex>
              <v-flex @click="sortCampaignsArr('uniqueVideoViews')" xs2>
                <v-tooltip bottom>
                  <span :class="{'blue--text' : campaignSort.uniqueVideoViews, 'body-2' : true}" slot="activator" style="cursor:pointer">Visningar <v-icon style="color:inherit" small>{{ campaignSort.uniqueVideoViews ? 'arrow_drop_down' : '' }}</v-icon></span>
                <span>Antal (unika) personer som <br> spelat upp din videoannons.</span>
              </v-tooltip>
              </v-flex>
              <v-flex @click="sortCampaignsArr('invitations')" xs2>
                <v-tooltip bottom>
                  <span :class="{'blue--text' : campaignSort.invitations, 'body-2' : true}" slot="activator" style="cursor:pointer">Erbjudanden <v-icon style="color:inherit" small>{{ campaignSort.invitations ? 'arrow_drop_down' : '' }}</v-icon></span>
                <span>Antal intervju- inbjudningar <br> som videon har genererat.</span>
              </v-tooltip>
              </v-flex>
              <v-flex @click="sortCampaignsArr('uniqueProfileViews')" xs2>
                <v-tooltip bottom>
                  <span :class="{'blue--text' : campaignSort.uniqueProfileViews, 'body-2' : true}" slot="activator" style="cursor:pointer">Profilvisningar <v-icon style="color:inherit" small>{{ campaignSort.uniqueProfileViews ? 'arrow_drop_down' : '' }}</v-icon></span>
                <span>Antal unika profilvisningar som <br> videon har generarat.</span>
              </v-tooltip>
              </v-flex>
              <v-flex @click="sortCampaignsArr('epv')" xs2>
                <v-tooltip bottom>
                  <span :class="{'blue--text' : campaignSort.epv, 'body-2' : true}" slot="activator" style="cursor:pointer">EPV <v-icon style="color:inherit" small>{{ campaignSort.epv ? 'arrow_drop_down' : '' }}</v-icon></span>
                <span>Antal erbjudanden per <br> (unik) visad video i procent.</span>
              </v-tooltip>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex v-bind:key="c.id" v-for="c in campaignsArr" xs12>
            <v-layout v-if="c.hasOwnProperty('bransch')" class="v-card grey lighten-3 mb-2 hoverCard" fill-height align-center row wrap>
              <v-flex pl-2 xs2>
                <v-switch
                  @change="campaignStatWasChanged(c)"
                  v-model="c.active"
                  :label="kampanjStat(c.active)"
                  color="green"
                ></v-switch>
              </v-flex>
              <v-flex xs2>
                <div class="body-2">{{ c.campaignName }}</div>
                <div class="caption">{{ c.bransch }}</div>
              </v-flex>
              <v-flex xs2>
                <div class="body-1 pl-2">{{ c.uniqueVideoViews }}</div>
              </v-flex>
              <v-flex xs2>
                <div class="body-1 pl-2">{{ c.invitations }}</div>
              </v-flex>
              <v-flex xs2>
                <div class="body-1 pl-2">{{ c.uniqueProfileViews }}</div>
              </v-flex>
              <v-flex xs1>
                <div v-if="c.invitations > 0" class="body-1">{{ ((c.invitations / c.uniqueVideoViews) * 100).toFixed(2)  }} %</div>
                <div v-if="c.invitations === 0" class="body-1">0,00 %</div>
              </v-flex>
              <v-flex xs1>
                <v-tooltip bottom>
                <v-btn @click="previewCampaign(c), kampanjPlay = true" slot="activator" class="grey lighten-3" fab outline small>
                  <v-icon large class="black--text">zoom_in</v-icon>
                </v-btn>
                <span>Förhandsgranska annons</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex class="v-card grey lighten-3 mb-1" xs12>
            <v-layout fill-height align-center row wrap>
              <v-flex text-xs-left xs2>
                <span style="visibility:hidden" class="body-2 pl-2">Totalt:</span>
              </v-flex>
              <v-flex xs2>
                <span style="visibility:hidden">x</span>
              </v-flex>
              <v-flex xs2>
                <div class="body-2 pl-2">{{ totalViews }}</div>
                <div style="font-size:7pt">Totala visningar</div>
              </v-flex>
              <v-flex xs2>
                <div class="body-2 pl-2">{{ totalInvitations }}</div>
                <div style="font-size:7pt">Totala erbjudanden</div>
              </v-flex>
              <v-flex xs2>
                <div class="body-2 pl-2">{{ totalProfileViews }}</div>
                <div style="font-size:7pt">Totala profilvisningar</div>
              </v-flex>
              <v-flex xs2>
                <div class="body-2">{{ totalEPV }}</div>
                <div style="font-size:7pt">Total EPV</div>
              </v-flex>
            </v-layout>
          </v-flex>
         </div>
         <!-- LISTA FÖR SMALL SCREENS -->
         <div class="hidden-sm-and-up">
           <v-layout wrap>
             <v-flex v-bind:key="x.id" v-for="x in campaignsArr" xs12>
               <v-layout v-if="x.hasOwnProperty('bransch')" class="grey lighten-3 v-card mb-2" style="border-radius:10px" row wrap align-center px-2>
               <v-flex xs2>
                 <v-switch
                  @change="campaignStatWasChanged(x)"
                  v-model="x.active"
                  color="green"
                ></v-switch>
                <div style="position:absolute;margin-top:-16px">{{ kampanjStat(x.active) }}</div>
               </v-flex>
               <v-flex pl-2 xs7>
                 <div class="body-2">Namn: {{ x.campaignName }}</div>
                 <div class="body-1">Unika visningar: {{ x.uniqueVideoViews }}</div>
                 <div class="body-1">Erbjudanden: {{ x.invitations }}</div>
                 <div class="body-1">Unika profilvisningar: {{ x.uniqueProfileViews }}</div>
               </v-flex>
               <v-flex xs3>
                 <v-btn @click="previewCampaign(x), kampanjPlay = true" medium class="grey lighten-3" fab outline>
                  <v-icon x-large class="black--text">zoom_in</v-icon>
                </v-btn>
               </v-flex>
               <v-flex xs12 class="py-2">
                 <v-divider></v-divider>
                 <div class="body-1 pt-2">
                   <div v-if="x.invitations > 0" class="body-2">EPV: {{ ((x.invitations / x.uniqueVideoViews) * 100).toFixed(2)  }} %</div>
                  <div v-if="x.invitations === 0" class="body-2">EPV: 0,00 %</div>
                 </div>
               </v-flex>
               </v-layout>
             </v-flex>
           </v-layout>
         </div>
        </v-card>
        </v-flex>
        
        <v-flex my-2 xs12>
          <v-card class="white black--text">
            <v-card-title>
              <div class="title py-2">Kommande möten: {{ upComingMeetings.length }} st.</div>
            </v-card-title>
            <v-card-text>
              <v-layout justify-center wrap>
                <v-flex my-2 md10 xs12 class="v-card hoverCard grey lighten-4" v-bind:key="m.id" v-for="m in upComingMeetings">
                  <v-layout px-2 py-2 my-3 align-center row wrap>
                    <v-flex justify-center xs12 sm6>
                      <div class="body-2">Datum:&nbsp;<span class="success--text text--darken-3">{{ m.acceptedTime.date }}</span></div>
                      <div class="body-2">Företag:&nbsp;<span class="success--text text--darken-3">{{ m.corp }}</span></div>
                      <div class="body-2">Kontakt:&nbsp;<span class="success--text text--darken-3">{{ m.name }}</span></div>
                      <div class="body-2">Mobilnummer:&nbsp;<span class="success--text text--darken-3">{{ m.phoneNr }}</span></div>
                    </v-flex>
                    <v-flex :pl-2="$vuetify.breakpoint.mdAndUp" xs12 sm6>
                      <div class="body-2">Tid:&nbsp;<span class="success--text text--darken-3">{{ m.acceptedTime.time }}</span></div>
                      <div class="body-2">Typ:&nbsp;<span class="success--text text--darken-3">{{ m.type }}</span></div>
                      <div v-if="m.type === 'Personligt möte'" class="body-2">Plats:&nbsp;<span class="success--text text--darken-3">{{ m.adress }}</span></div>
                      <div class="body-2">Mail:&nbsp;<span class="success--text text--darken-3">{{ m.businessUserMail }}</span></div>
                    </v-flex>
                    <v-flex mt-2 text-xs-center xs12>
                      <v-btn @click="m.readMore = !m.readMore" block round outline small class="caption">Mer info <v-icon>{{m.readMore ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</v-icon></v-btn>
                      <div class="text-xs-left" v-show="m.readMore">
                        <div class="body-1 py-2"><span class="body-2">Meddelande:</span>&nbsp;{{ m.msg }}</div>
                        <div class="body-1 py-2"><span class="body-2">Om tjänsten:</span>&nbsp;{{ m.about }}</div>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-flex>

    </v-layout>


    <!-- HELP MODAL --> 
    <v-dialog v-model="helpModal" max-width="600">
      <v-card>
        <v-card-title class="primary lighten-2 justify-center">
          <div class="display-1 white--text">
            Guide
            <v-icon large class="white--text">info</v-icon>
          </div>
          <div class="closeModal">
            <v-icon class="white--text" large @click="helpModal = false">close</v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <div>
              <div class="title pt-3 pb-2">1. Redigera din profil</div>
              <div class="body-1 pb-3">
                Redigera din profil ( <v-icon @click="$router.push('/profil')" class="primary--text text--lighten-1">person</v-icon> ) med erfarenheter, utbildningar, telefonnummer och profilbild osv.
              </div>
              <div class="title pb-2 pb-2">2. Få tips</div>
              <div class="body-1 pb-3">
                Gå till <span class="primary--text pointer body-2" @click="toInspiration">inspirationsidan</span> för att få tips på hur du maximerar 
                responsen på din presentation
                samt maximerar möjligheterna till drömjobbet.
              </div>
              <div class="title pb-2">3. Ladda upp en videopresentation</div>
              <div class="body-1 pb-3">
                Gå till "skapa presentation" sidan på
                ( <span class="pointer body-2 px-1" @click="$router.push('/share')">
                  <v-icon class="success--text text--darken-1">videocam</v-icon>
                </span> )
                och spela in en videopresentation på ca 60 - 90 sekunder som du sedan laddar upp.
              </div>
              <div class="title pb-2">4. Vänta på erbjudanden</div>
              <div class="body-1 pb-3">
                <p>
                  Du är klar! Du kan följa statistiken för hur dina presentationer levererar på startsidan.
                  Alla dina aktiva presentationer är synliga för företag i företagsportalen.
                  Du kommer bli notifierad via mail när du fått en mötesförfrågan.
                </p>
                <p v-if="0">
                  Besök även <span class="primary--text body-2 pointer" @click="$router.push('ads')">annonssidan</span> 
                  för att ansöka på specifika tjänster med dina videopresentationer.
                </p>
              </div>
            </div>
        </v-card-text>
        <v-card-actions style="margin-top:-25px">
          <v-btn @click="helpModal = false" round class="secondary lighten-1 title" block flat>
            STÄNG
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


     <!-- Dialog för kampanjPlay -->
    <div v-if="playedCampaign !== ''">
      <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="700" v-model="kampanjPlay">
        <v-layout>
          <v-flex xs12 px-2 py-2 class="grey lighten-3">
            <v-card v-if="kampanjPlay" class="xs6 white">
                <v-card-title>
                  <v-avatar
                    size="28px"
                  >
                    <img
                      :src="playedCampaign.profile.profilePic.i"
                      alt="Avatar"
                    >
                  </v-avatar>
                  <span class="pl-2 body-2">{{ playedCampaign.name }}</span><span>&nbsp;- {{ playedCampaign.title }}</span>
                  <div class="closeModal">
                    <v-icon @click="kampanjPlay = false" large>close</v-icon>
                  </div>
                </v-card-title>
                  <v-divider class="pb-2"></v-divider>
                  <div v-if="playedCampaign.videoPlay" style="position:relative">
                      <v-btn @click="playedCampaign.videoPlay = false" style="position:absolute;margin-left:auto;margin-right:auto;left:0;right:0;top:37%" large fab flat class="white">
                        <v-icon large class="secondary--text">play_arrow</v-icon>
                      </v-btn>
                    <img style="min-height:200px" @click="playedCampaign.videoPlay = false" :src="playedCampaign.snapshot" width="100%" alt="Video snapshot">
                  </div>
                  <video v-show="!playedCampaign.videoPlay" loop playsinline width="100%" preload controls>
                    <source :src="playedCampaign.videoUrl.i" type="video/mp4">
                    Your browser does not support HTML5 video.
                  </video>
                    <v-card-text>
                      <div class="body-2">
                        <v-chip v-bind:key="x" v-for="x in playedCampaign.competences" small outline color="green" text-color="green">#{{ x }}</v-chip>
                      </div>
                      <div class="body-2 py-1 grey--text text--darken-2">
                        <span>{{ playedCampaign.bransch }}</span> <span v-show="playedCampaign.underCategory.length > 0">></span>
                        <span v-bind:key="x" v-for="(x, index) in playedCampaign.underCategory">{{ x }}<span v-show="index < playedCampaign.underCategory.length - 1">, </span></span>
                      </div>
                      <div class="body-2 grey--text text--darken-2">
                        <span class="green--text text--darken-3">Region:</span> 
                        <span v-bind:key="r" v-for="(r, index) in playedCampaign.region">{{ r }}<span v-show="index < playedCampaign.region.length - 1">, </span></span>
                        <span class="px-1">|</span>
                        <span class="body-2 pb-2 green--text text--darken-3">Nuvarande tjänst: <span class="body-2 grey--text text--darken-2">{{ playedCampaign.nuvarande }}</span></span>
                      </div>
                      <div>
                        <span class="body-1">
                          {{ playedCampaign.msg }}
                        </span>
                      </div>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn disabled class="green white--text" small round>
                      <span class="hidden-xs-only">Skicka inbjudan <v-icon small class="ml-1 white--text">send</v-icon></span>
                      <span class="hidden-sm-and-up">
                        <v-icon>send</v-icon>
                      </span>
                    </v-btn>
                    <v-btn @click="showProfile" class="primary lighten-1 hidden-xs-only" small flat round>
                      CV/Profil <v-icon small class="ml-1">person</v-icon>
                    </v-btn>
                    <v-btn @click="showProfile" class="primary lighten-1 hidden-sm-and-up" small flat round>
                    <v-icon>person</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn disabled class="grey grey--text text--darken-2 darken-2" small outline round>
                      Spara <v-icon>save_alt</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
        </v-dialog>
    </div>

  </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  data () {
    return {
      helpModal: false,
      kampanj: false,
      arrayEvents: ['2018-09-03', '2018-09-06', '2018-09-12', '2018-09-18', '2018-09-24'],
      campaignsArr: [],
      playedCampaign: '',
      kampanjPlay: false,
      finishedLoading: true,
      tips: false,
      campaignSort: {
        campaignName: false,
        active: false,
        uniqueVideoViews: false,
        invitations: false,
        uniqueProfileViews: false,
        epv: false
      }
    }
  },
  watch: {
    campaignData: function () {
      var campaignsArr = []
      for (var i in this.$store.state.profileInfo.campaigns) {
        if (i !== 'c1') {
          campaignsArr.push(this.$store.state.profileInfo.campaigns[i])
        }
      }
      this.campaignsArr = campaignsArr
    }
  },
  methods: {
    test () {
      console.log(this.campaignsArr.length)
    },
    showProfile () {
      this.$store.state.showProfile = true
    },
    toInspiration () {
      this.$router.push('/inspiration')
    },
    kampanjStat (active) {
      return active ? 'Aktiv' : 'Av'
    },
    campaignStatWasChanged (p) {
      this.campaignsArr.c1 = {active: false}
      var arr = []
      var fullArr = []
      var newCampaignObj
      var changeToFalse
      if (p.active === true) {
        arr.push(p.bransch)
        fullArr.push({bransch: p.bransch, active: p.active})
      }
      for (var i in this.$store.state.profileInfo.campaigns) {
        if (!arr.includes(this.$store.state.profileInfo.campaigns[i].bransch)) {
          arr.push(this.$store.state.profileInfo.campaigns[i].bransch)
          fullArr.push({
            bransch: this.$store.state.profileInfo.campaigns[i].bransch,
            active: this.$store.state.profileInfo.campaigns[i].active
          })
        } else {
          changeToFalse = 0
          if (p.id !== this.$store.state.profileInfo.campaigns[i].id) {
            fullArr.forEach(val => {
              if (val.bransch === this.$store.state.profileInfo.campaigns[i].bransch && val.active === true) {
                changeToFalse = 1
              }
            })
            if (changeToFalse === 1) {
              this.$store.state.profileInfo.campaigns[i].active = false
            }
          }
        }
      }
      newCampaignObj = this.$store.state.profileInfo.campaigns
      firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/')
        .update({campaigns: newCampaignObj})
      .then(res => {
        this.$store.commit('sendCampaignToCampaingsNode')
      })
    },
    sortCampaignsArr (par) {
      if (par !== 'campaignName' && par !== 'epv') {
        this.campaignsArr.sort((a, b) => {
          return b[par] - a[par]
        })
      } else if (par === 'campaignName') {
        this.campaignsArr.sort((a, b) => {
          return a[par].charCodeAt(0) - b[par].charCodeAt(0)
        })
      } else {
        this.campaignsArr.sort((a, b) => {
          return ((b.invitations / b.uniqueVideoViews) * 100).toFixed(2) - ((a.invitations / a.uniqueVideoViews) * 100).toFixed(2)
        })
      }
      // Visa vilken kampanj som är sorterad på vad
      for (var i in this.campaignSort) {
        if (i === par) {
          this.campaignSort[i] = true
        } else {
          this.campaignSort[i] = false
        }
      }
    },
    previewCampaign (c) {
      this.playedCampaign = c
    }
  },
  computed: {
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
    profileStrengthColor () {
      const colorArr = ['secondary', 'warning', 'info', 'success']
      if (this.profileStrengthValue <= 30) {
        return colorArr[0]
      } else if (this.profileStrengthValue > 30 && this.profileStrengthValue <= 60) {
        return colorArr[1]
      } else if (this.profileStrengthValue > 60 && this.profileStrengthValue <= 80) {
        return colorArr[2]
      } else if (this.profileStrengthValue > 80) {
        return colorArr[3]
      }
    },
    profile () {
      if (this.$store.state.profileInfo !== 'userObject') {
        return this.$store.state.profileInfo.profil
      }
    },
    howItWorksVideo: {
      get () { return this.$store.getters.howItWorksVideoGetter },
      set (value) { this.$store.commit('howItWorksVideoCommit', value) }
    },
    upComingMeetings () {
      var arr = this.meetingEvents.filter(val => {
        return val.acceptedTime.date >= new Date().toISOString().substr(0, 10)
      })
      arr.sort((a, b) => {
        return a.acceptedTime.date.replace(/-/g, '') - b.acceptedTime.date.replace(/-/g, '')
      })
      return arr
    },
    howManyActiveCampaigns () {
      var result = 0
      this.campaignsArr.forEach(val => {
        if (val.active === true) {
          result = (result + 1)
        }
      })
      return result
    },
    meetingEvents () {
      return this.$store.state.meetingEvents
    },
    getPureProfileInfo () {
      return this.$store.state.getPureProfileInfo
    },
    totalViews () {
      var result = 0
      this.campaignsArr.forEach(val => {
        if (val.hasOwnProperty('uniqueVideoViews')) {
          result += val.uniqueVideoViews
        }
      })
      return result
    },
    totalInvitations () {
      var result = 0
      this.campaignsArr.forEach(val => {
        if (val.hasOwnProperty('invitations')) {
          result += val.invitations
        }
      })
      return result
    },
    totalProfileViews () {
      var result = 0
      this.campaignsArr.forEach(val => {
        if (val.hasOwnProperty('uniqueProfileViews')) {
          result += val.uniqueProfileViews
        }
      })
      return result
    },
    totalEPV () {
      if (this.totalInvitations === 0) {
        return '0,00 %'
      } else {
        return ((this.totalInvitations / this.totalViews) * 100).toFixed(2) + ' %'
      }
    },
    profileInfo: {
      get () { return this.$store.getters.profileInfoGetter },
      set (value) { this.$store.commit('profileInfoCommit', value) }
    },
    campaignData () {
      return this.$store.state.profileInfo.campaigns
    }
  },
  mounted () {
    // Mounted functions
    var campaignsArr = []
    for (var i in this.$store.state.profileInfo.campaigns) {
      if (i !== 'c1') {
        campaignsArr.push(this.$store.state.profileInfo.campaigns[i])
      }
    }
    this.campaignsArr = campaignsArr
    this.sortCampaignsArr('campaignName')
  },
  created () {
    // Created
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.hoverCard:hover {
  box-shadow: 2px 2px 2px 3px lightgrey;
}
.cardHeaderFlowing {
  position: absolute;
  width: 90%;
  left:10%;
  margin-top: -15px;
}
</style>
