<template>
  <div>
    <v-container>
      <v-btn @click="test" v-if="0" style="position:absolute;z-index:5">Test fr. ads.vue</v-btn>
      <v-layout row wrap mt-4>
        <v-flex v-if="allAds === ''" xs12 px-5 md8 my-5 class="text-xs-center">
          <div style="font-weight:bold" class="display-1 pb-5">Hämtar data...</div>
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-flex>
        <!--  ALLT BÖRJAR HÄR  -->
        <!--  FILTER smAndDown  -->
        <v-flex mb-5 px-3 v-if="$vuetify.breakpoint.smAndDown && allAds !== ''" xs12>
          <v-btn @click="showFilter = !showFilter" outline round block>
            FILTRERA
          </v-btn>
          <v-navigation-drawer
            v-model="showFilter"
            fixed
            right
            clipped
            app
            style="z-index:20!important"
          >
            <div class="textPrio mt-3 pb-3">
              <div class="text-xs-center title pt-3 px-2 mb-2">
                Filter
              </div>
              <v-autocomplete
                :items="getBranschItems"
                v-model="bransch"
                class="px-2"
                label="Bransch"
              ></v-autocomplete>
              <v-autocomplete
                :items="getBranschUnderCategories"
                v-model="category"
                class="px-2"
                label="Kategori"
              ></v-autocomplete>
              <v-autocomplete
                class="px-2"
                label="Region"
                :items="filter.region"
                v-model="region"
              ></v-autocomplete>
              <v-select
                class="px-2"
                label="Omfattning"
                :items="omfattningItems"
                v-model="omfattning"
              ></v-select>
              <v-autocomplete
                class="px-2"
                :items="filter.competences"
                v-model="competences"
                label="Taggar/kunskaper (Sorterar annonser)"
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
              <div class="mx-2">
                <v-btn @click="cleanFilter" block round outline>Rensa filter</v-btn>
              </div>
            </div>
          </v-navigation-drawer>
        </v-flex>

        <!--  HÄR BÖRJAR ANNONSERNA  -->
        <v-flex style="position:relative" v-if="allAds !== ''" px-3 py-3 xs12 md8>
          <div>
            <div style="margin-top:-41px" class="title grey--text text--darken-4 pl-2 mb-3">
              {{ adsToShow.length }} 
              <span v-show="adsToShow.length === 1">ledigt jobb hittat</span>
              <span v-show="adsToShow.length !== 1">lediga jobb hittade</span> 
              <span v-if="bransch !== ''">- {{ bransch }} <span v-if="category !== ''">> {{ category }}</span></span>
             <span v-if="region !== ''">i {{ region }}</span>
            </div>
            <v-divider class="pb-3"></v-divider>
          </div>
          <v-layout @click="clickedAd(x)" px-2 align-center class="v-card mb-3 white py-3 hoverCard pointer" v-bind:key="x.id" v-for="x in adsToShow" row>
            <v-flex text-xs-center xs3 sm3>
              <img style="max-width:90px!important;max-height:110px!important" :src="x.logo" alt="Företagslogga">
            </v-flex>
            <v-flex :pl-3="$vuetify.breakpoint.xsOnly" xs10 sm10>
              <div class="body-2">
                {{ x.corp }}
              </div>
              <div class="body-2">
                {{ x.title }}
              </div>
              <div class="body-2 grey--text pb-1 text--darken-1">
                {{ x.bransch }} <span v-show="x.underCategory !== ''">> {{ x.underCategory }}</span>
              </div>
              <div class="body-1 pb-1">
                {{ getRealAboutShorter(x.about) }}
              </div>
              <div class="body-2 grey--text text--darken-2">
                Sista ansökningsdag: <span :class="{'red--text' : lastDayIsRunningUp(x.lastDay) }">{{ x.lastDay }}</span>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-if="$vuetify.breakpoint.mdAndUp" xs12 md4>
          <div class="textPrio v-card white mt-3 pb-3">
            <div class="title pt-3 px-2 mb-2">
              Filter
            </div>
            <v-autocomplete
              :items="getBranschItems"
              v-model="bransch"
              class="px-2"
              label="Bransch"
            ></v-autocomplete>
            <v-autocomplete
              :items="getBranschUnderCategories"
              v-model="category"
              class="px-2"
              label="Kategori"
            ></v-autocomplete>
            <v-autocomplete
              class="px-2"
              label="Region"
              :items="filter.region"
              v-model="region"
            ></v-autocomplete>
            <v-select
              class="px-2"
              label="Omfattning"
              :items="omfattningItems"
              v-model="omfattning"
            ></v-select>
            <v-autocomplete
              class="px-2"
              :items="filter.competences"
              v-model="competences"
              label="Taggar/kunskaper (Sorterar annonser)"
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
            <div class="mx-2">
              <v-btn @click="cleanFilter" block round outline>Rensa filter</v-btn>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>

    <!--     DIALOG FÖR ATT LÄSA ANNONS     -->
    <div v-if="currentAd !== ''">
      <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="1000" v-model="openAd">
        <v-card>
          <v-card-title class="primary lighten-2 justify-center">
            <div style="font-weight:bold" class="title white--text">
              {{ currentAd.corp }} - <span class="title white--text"> {{ currentAd.title }} </span>
            </div>
            <div style="position:absolute;right:5px;top:5px">
              <v-icon @click="openAd = false" class="pointer white--text" large>close</v-icon>
            </div>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex px-2 xs12 md8>
                <img class="my-2" style="max-width:150px!important;max-height:100px!important" :src="currentAd.logo" alt="Företags loggan">
                <div style="font-weight:bold" class="subheading pt-1">
                  {{ currentAd.title }}
                </div>
                <div class="body-2 py-3">
                  {{ currentAd.bransch }} <span v-if="currentAd.bransch !== ''">> {{ currentAd.underCategory }}</span>
                </div>
                <div>
                  <v-chip v-bind:key="tag" v-for="tag in currentAd.competences" small label color="green" text-color="white">
                    <v-icon left>label</v-icon>{{ tag }}
                  </v-chip>
                </div>
                
                <div v-bind:key="x" v-for="x in currentAd.getRealAbout" class="body-1 py-1">
                  <p :class="{'body-1' : x.length > 40, 'body-2' : x.length <= 40 }">{{ x }}</p>
                </div>
              </v-flex>
              <v-flex px-2 xs12 md4>
                <div style="font-weight:bold" class="title mb-3 secondary--text text--ligthen-1">
                  ANSÖK
                </div>
                <v-select
                  label="Välj en presentation att skicka"
                  :items="getCampaigns"
                  v-model="searchAd.campaign"
                ></v-select>
                <v-textarea
                  label="Skicka ett meddelande"
                  auto-grow
                  v-model="searchAd.msg"
                ></v-textarea>
                <div class="caption grey lighten-4 px-1 py-2">
                  <v-icon small>info</v-icon>
                  Viktigt att uppgifterna från din profil stämmer då de kommer att skickas
                  till företagets kontaktperson.
                </div>
                <v-btn flat :disabled="!skickaAnsokanBtn" @click="skickAnsokan(currentAd)" :loading="sendingAd" block class="success mt-2">
                  Skicka ansökan <v-icon class="ml-2">send</v-icon>
                </v-btn>
                <div v-if="currentAd.videoUrl !== ''">
                  <video preload controls width="100%" :src="currentAd.videoUrl.i"></video>
                </div>
                <v-divider></v-divider>
                <div class="body-2 black--text">Sista ansökningsdag: <span :class="{'red--text' : lastDayIsRunningUp(currentAd.lastDay) }">{{ currentAd.lastDay }}</span></div>
                <div class="body-2 pt-2">Om företaget</div>
                <div v-bind:key="x" v-for="x in corpDescriptionArr" class="body-1">
                  <p>{{ x }}</p>
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>

    <v-dialog max-width="400" v-model="hasBeenSent">
      <v-card>
        <v-card-title class="justify-center primary lighten-3 white--text">
          <div class="title">
            Din sökning har skickats <v-icon class="white--text">check_circle</v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="body-1">
            Din sökning har skickats och du kommer bli notifierad om
            företaget vill gå vidare med en intervju. 
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn round @click="hasBeenSent = false" block outline>Tack!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import Api from '@/service/firebase'

export default {
  data () {
    return {
      // Här börjar data för filtreringen
      bransch: '',
      category: '',
      region: '',
      competences: [],
      omfattning: '',
      // Slut på filter data
      omfattningItems: ['Alla', '100 %', '75 %', '50 %', '25 %'],
      openAd: false,
      currentAd: '',
      searchAd: {
        campaign: '',
        theAd: '',
        msg: '',
        theCampaign: ''
      },
      sendingAd: false,
      hasBeenSent: false,
      showFilter: false
    }
  },
  watch: {
    bransch: function () {
      this.category = ''
    },
    lookForNewCampaignCategorysChanges: function () {
      if (this.bransch === '') {
        for (let x in this.$store.state.filter.bransch) {
          for (let ii in this.$store.state.filter.bransch[x]) {
            if (this.$store.state.filter.bransch[x][ii] === this.category) {
              this.bransch = this.$store.state.filter.bransch[x].main
              setTimeout(() => {
                this.category = this.$store.state.filter.bransch[x][ii]
              }, 100)
            }
          }
        }
      }
    }
  },
  methods: {
    test () {
      console.log(this.currentAd)
    },
    lastDayIsRunningUp (date) {
      return date.replace(/-/g, '') <= new Date(new Date().setDate((new Date().getDate() + 7))).toISOString().substr(0, 10).replace(/-/g, '')
    },
    skickAnsokan (theAd) {
      var global = this
      var notification = {
        msg: 'Du har fått en ny sökande på en av dina annonser. Du hittar denna i "Annonsera" > "Dina annonser".',
        id: new Date().getTime(),
        time: new Date().toISOString().substr(0, 19).replace('T', ' '),
        pic: this.$store.state.profileInfo.profil.profilePic
      }
      var alreadyDone = 0
      var notificationArr
      this.sendingAd = true
      var theAdDBId
      this.searchAd.theAd = theAd
      for (var i in this.$store.state.profileInfo.campaigns) {
        if (this.$store.state.profileInfo.campaigns[i].campaignName === this.searchAd.campaign) {
          this.searchAd.theCampaign = this.$store.state.profileInfo.campaigns[i]
          break
        }
      }
      Api.business(
        `${theAd.businessDBId}/corpInfo/users/${theAd.userDBId}/user`,
        'once',
        response => {
          const res = response.val()
          res.events.notifications[0] = (res.events.notifications[0] + 1)
          res.events.notifications.splice(1, 0, notification)
          notificationArr = res.events.notifications
          for (var x in res.ads) {
            if (res.ads[x].hasOwnProperty('active')) {
              if (res.ads[x].id === theAd.id) {
                theAdDBId = x
              }
              for (var ii in res.ads[x].applicants) {
                if (res.ads[x].applicants[ii].hasOwnProperty('theCampaign') && res.ads[x].applicants[ii].theCampaign.userId === global.$store.state.user.id) {
                  if (res.ads[x].id === theAd.id) {
                    alreadyDone = 1
                  }
                }
              }
            }
          }
          if (alreadyDone === 0) {
            const first = Api.business(
              `${theAd.businessDBId}/corpInfo/users/${theAd.userDBId}/user/ads/${theAdDBId}/applicants`,
              'push',
              global.searchAd
            )
            const second = Api.business(
              `${theAd.businessDBId}/corpInfo/users/${theAd.userDBId}/user/events/`,
              'update',
              { notifications: notificationArr }
            )
            Promise.all([first, second])
            .then(res => {
              global.openAd = false
              global.hasBeenSent = true
              global.sendingAd = false
            })
            // TILLFÄLLIG ADMINNOTIFIKATION LÖSNING START *************
            let adminNotification = {
              emailTo: global.searchAd.theAd.mail,
              corp: global.searchAd.theAd.corp,
              msg: 'Svar/Ansökan på annons',
              businessUser: global.searchAd.theAd.name,
              notificationTo: 'Business',
              id: new Date().getTime() + 'ee' + Math.random()
            }
            Api.admin(
              'notifications',
              'push',
              adminNotification
            )
          // TILLFÄLLIG ADMINNOTIFIKATION LÖSNING SLUT *************
          } else {
            alert('Du har redan sökt på denna annons.')
            global.sendingAd = false
          }
        })
      .catch(function (error) {
        console.log(error)
      })
    },
    clickedAd (x) {
      this.openAd = true
      this.currentAd = x
    },
    cleanFilter () {
      this.bransch = ''
      this.category = ''
      this.region = ''
      this.competences = ''
      this.omfattning = ''
    },
    getRealAboutShorter (x) {
      if (x.length > 110) {
        return x.substring(0, 109) + '...'
      } else {
        return x + '...'
      }
    }
  },
  computed: {
    lookForNewCampaignCategorysChanges () {
      return this.category
    },
    allAds () {
      return this.$store.state.allAds
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
    skickaAnsokanBtn () {
      return (this.searchAd.campaign !== '') && (this.searchAd.msg !== '')
    },
    getCampaigns () {
      var arr = []
      for (var i in this.$store.state.profileInfo.campaigns) {
        if (this.$store.state.profileInfo.campaigns[i].hasOwnProperty('bransch')) {
          arr.push(this.$store.state.profileInfo.campaigns[i].campaignName)
        }
      }
      return arr
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
      if (this.bransch !== '') {
        for (var i in this.$store.state.filter.bransch) {
          if (this.bransch === this.$store.state.filter.bransch[i].main) {
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
    getBranschUnderCategoriesXX () {
      var arr = []
      if (this.bransch !== '') {
        for (var i in this.$store.state.filter.bransch) {
          if (this.bransch === this.$store.state.filter.bransch[i].main) {
            for (var ii in this.$store.state.filter.bransch[i]) {
              arr.push(this.$store.state.filter.bransch[i][ii])
            }
          }
        }
      }
      arr.shift()
      return arr
    },
    filter () {
      return this.$store.state.filter
    },
    adsToShow () {
      var arr = []
      if (this.allAds !== '') {
        this.allAds.forEach(val => {
          if ((val.lastDay >= new Date().toISOString().substr(0, 10)) && (this.bransch === val.bransch || this.bransch === '') && (this.category.includes(val.underCategory) || this.category === this.bransch || this.category === '' || val.underCategory === undefined) && (this.region.includes(val.region) || this.region === 'Hela Sverige' || this.region === '')) {
            if (this.omfattning === 'Alla' || this.omfattning === '100 %' || this.omfattning === '') {
              arr.push(val)
            } else if (this.omfattning === '75 %') {
              if (val.omfattning === '75 %' || val.omfattning === '50 %' || val.omfattning === '25 %') {
                arr.push(val)
              }
            } else if (this.omfattning === '50 %') {
              if (val.omfattning === '50 %' || val.omfattning === '25 %') {
                arr.push(val)
              }
            } else if (this.omfattning === '25 %') {
              if (val.omfattning === '25 %') {
                arr.push(val)
              }
            }
          }
        })
        if (this.competences !== '' || this.competences.length > 0) {
          arr.forEach(val => {
            val.competencesMatch = 0
            this.competences.forEach(el => {
              if (val.competences.includes(el)) {
                val.competencesMatch++
              }
            })
          })
          arr.sort((a, b) => {
            return b.competencesMatch - a.competencesMatch
          })
        } else {
          arr.sort((a, b) => {
            return b.id - a.id
          })
        }
      }
      return arr
    }
  },
  created () {
    let arr = []
    Api.ads('once', response => {
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
  }
}
</script>

<style>
p {
  margin-bottom: 5px !important;
}
</style>

