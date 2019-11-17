<template>
<div>
  <v-layout my-5 justify-center v-if="$store.state.profileInfo === 'userObject'">
      <v-flex style="min-height:38vh" my-5 xs8>
          <h1 class="display-1 text-xs-center mb-3 primary--text text--darken-2">
            <span class="jobflix-title">
              <v-icon class="black--text play-icon-title">play_arrow</v-icon>
              <span class="black--text jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
            </span>
          </h1>
          <v-progress-linear :indeterminate="true"></v-progress-linear>
      </v-flex>
    </v-layout>
  <v-container v-if="$store.state.profileInfo !== 'userObject'">
    <v-btn v-if="0" style="position:absolute;z-index:5" @click="test">TEST fr. share.vue</v-btn>
    <v-layout justify-center row wrap>
      <!--  Main Content   -->
      <v-flex xs12>
        <v-flex xs12>
        <v-card class="white black--text px-3">
          <v-layout align-center row wrap>
          <v-flex xs12 md8>
          <div style="font-weight:bold" class="text-xs-left display-1 py-3">
            Skapa och redigera presentationer
          </div>
          <div class="body-1 py-2">
            <p>
              En videopresentation bör vara <strong>max 60 - 90 sekunder</strong> lång.
            </p>
            <p>
              Ge aldrig ut ditt telefonnummer eller mail i videon. Uppmana dom att skicka inbjudan via Jobflix.
            </p>
            <p>
              Det kan vara bra att skriva ner ett manus eller mall i förväg så du vet vad du ska säga.
            </p>
            <p style="margin-bottom:5px">
              Exempelmall:
            </p>
            <ul>
              <li>Berätta om dig själv. Minimera information från privatlivet, fokusera på det yrkesmässiga.</li>
              <li>Vad har du gjort tidigare och vad gör du idag?</li>
              <li>Vad söker du för jobb? Vad brinner du för? Hur skapar du värde för en arbetsgivare? 
                Berätta kortfattat och demonstrera gärna. 
              </li>
              <li>
                Vad har du för lönekrav och preferenser på din nästa arbetsplats?
              </li>
              <li>Tacka för att de sett din presentation och uppmana dom att skicka en mötesinbjudan till dig.</li>
            </ul>
            <p class="body-2 pt-2">
              <v-icon small>info</v-icon> Kom ihåg att en videopresentation inte behöver vara perfekt!
            </p>
          </div>
          </v-flex>
          <v-flex text-xs-center xs12 md4>
            <v-btn @click="playExampleVideo" large round outline class="primary primary--text">
              <v-icon class="mr-2">play_arrow</v-icon>
              Exempelpresentation
            </v-btn>
          </v-flex>
          </v-layout>
        </v-card>

      <!-- HÄR SAMLAS ALLA KAMPANJER -->
        <v-card class="white black--text mt-2">
          <v-layout px-3 py-3 row wrap>
          <v-flex xs12>
            <div class="title pb-3">
              Alla dina presentationer ({{ Object.keys(profileInfo.campaigns).length - 1 }} st.)
            </div>
            
            <div v-bind:key="campaign.id" v-for="campaign in profileInfo.campaigns">
              <v-layout style="background-color:#f1f1f1" v-if="campaign.hasOwnProperty('id')" align-center my-2 class="v-card hoverCard" xs12 px-2 row wrap>
                <v-flex py-1 :text-xs-center="$vuetify.breakpoint.smAndDown" xs6 md1>
                    <div class="body-2 pb-2">Status</div>
                  <div style="margin-top:-17px" class="pt-2">
                    <span class="body-2 white--text success" style="padding:2px 5px;border-radius:8px" v-show="campaign.active">Aktiv</span>
                    <span class="body-2 white--text secondary lighten-2" style="padding:2px 5px;border-radius:8px" v-show="!campaign.active">Pausad</span>
                  </div>
                </v-flex>
                <v-flex py-1 :text-xs-center="$vuetify.breakpoint.smAndDown" class="body-2 px-2" xs6 md3>
                  <div class="body-1">Namn</div>
                  <div class="body-2">{{ campaign.campaignName }}</div>
                </v-flex>
                <v-flex py-1 :text-xs-center="$vuetify.breakpoint.smAndDown" class="body-1" xs6 md3>
                  <div class="body-1">Titel</div>
                  <div class="body-2">{{ campaign.title }}</div>
                </v-flex>
                <v-flex py-1 :text-xs-center="$vuetify.breakpoint.smAndDown" class="body-1" xs6 md3>
                  <div class="body-1">Bransch</div>
                  <div class="body-2">{{ campaign.bransch }}</div>
                </v-flex>
                <v-flex class="body-1" xs12 md2>
                  <v-btn @click="editObj(campaign)" small round flat block class="secondary lighten-2">
                    <v-icon small class="mr-2">build</v-icon> Redigera
                  </v-btn>
                  <v-btn @click="playMyCampaign(campaign)" round small flat block class="success">
                    <v-icon>play_arrow</v-icon> Förhandsgranska
                  </v-btn>
                </v-flex>
              </v-layout>
            </div>

          </v-flex>
          </v-layout>
        </v-card>

        <v-card class="white black--text mt-2">
          <v-layout px-3 py-3 row wrap>
            <v-flex xs12>
              <div class="title">Skapa ny presentation
                <v-icon class="ml-1 indigo--text">videocam</v-icon>
              </div>
              <div class="caption pt-1">
                <v-icon small>info</v-icon>
                Fält markerade med * är obligatoriska.
              </div>
            </v-flex>
          <v-flex :pr-3="$vuetify.breakpoint.mdAndUp" xs12 md6>
            <v-text-field
              light
              box
              class="my-2"
              label="Presentationsnamn *"
              v-model="newCampaign.campaignName"
            ></v-text-field>
            <v-text-field
              ligth
              box
              class="my-2"
              label="Din yrkestitel *"
              v-model="newCampaign.title"
            ></v-text-field>
            <v-select
              ligth
              box
              class="my-2"
              label="När kan du börja? *"
              :items="getAvailability"
              v-model="newCampaign.status"
            ></v-select>
            <div>
              <img v-if="newCampaign.videoUrl.i === undefined" width="100%" height="100%" src="@/assets/videoplaceholder.jpg" alt="Video placeholder">
              <img style="min-height:200px" v-show="newCampaign.videoUrl.i !== undefined" :src="$store.state.uploadVideoSnapshotUrl" width="100%" height="250" alt="Video snapshot">
            </div>
            <div>
              <v-btn :disabled="uploadVideoBtn" block @click="onPickFile" round outline class="success success--text">
                <v-icon class="mr-2">videocam</v-icon>
                Ladda upp video *
              </v-btn>
            </div>
            <input
              v-show="0" 
              type="file" 
              ref="fileInput" 
              accept="video/*"
              @change="onFilePicked"
              >
              <div v-show="valueDeterminate > 0">
              <div v-show="valueDeterminate < 100" class="subheading pt-3" style="font-weight:bold">Laddar upp: {{ valueDeterminate }}%</div>
              <div v-show="valueDeterminate === 100" class="success--text subheading pt-3" style="font-weight:bold">
                  <span v-show="fileUploadError === ''">Klart! Din fil har laddats upp <v-icon small class="success--text">thumb_up</v-icon></span> 
                  <span v-show="fileUploadError !== ''" class="red--text body-2">{{ fileUploadError }}</span>
              </div>
              <v-progress-linear v-model="valueDeterminate"></v-progress-linear>
              </div>
          </v-flex>
          <v-flex :pl-3="$vuetify.breakpoint.mdAndUp" xs12 md6>
            <v-autocomplete
              light
              box
              label="Bransch *"
              :items="getBranschItems()"
              v-model="newCampaign.bransch"
              @change="zeroUnderCategories"
            ></v-autocomplete>
            <v-autocomplete
              light
              box
              multiple
              label="Underkategorier (Max 5)"
              :counter="5"
              :items="getBranschUnderCategories()"
              v-model="newCampaign.underCategory"
            ></v-autocomplete>
            <v-autocomplete
              ligth
              box
              label="Region *"
              multiple
              :counter="5"
              :items="filter.region"
              v-model="newCampaign.region"
            ></v-autocomplete>
              <v-autocomplete
                :counter="5"
                ligth
                box
                :items="filter.competences"
                v-model="newCampaign.competences"
                label="Tagga dina komptenser"
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
            <v-text-field
              box
              class="my-2"
              label="Nuvarande tjänst/position *"
              v-model="newCampaign.nuvarande"
            ></v-text-field>
            <v-textarea
              box
              class="my-2"
              label="Meddelande *"
              v-model="newCampaign.msg"
            ></v-textarea>
          </v-flex>
          <v-flex mt-3 text-xs-center xs12>
            <v-divider class="py-2"></v-divider>
            <v-layout row wrap>
              <v-flex xs12 px-3 lg6>
                <v-btn block @click="previewNewCampaign = true" round flat class="mt-2 primary">Förhandsgranska <v-icon class="ml-2">play_arrow</v-icon></v-btn>
              </v-flex>
              <v-flex xs12 px-3 lg6>
                <v-btn :loading="uploadingCampaign" :disabled="!uploadCampaignBtn" block @click="post" round flat class="mt-2 success">Publicera <v-icon class="ml-2">cloud_upload</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
          </v-layout>
        </v-card>

        </v-flex>
      </v-flex>
    </v-layout>

    <!-- Preview New Campaign -->
    <div v-if="newCampaign !== ''">
      <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="700" v-model="previewNewCampaign">
        <v-layout>
          <v-flex xs12 px-2 py-2 class="grey lighten-3">
            <v-card v-if="previewNewCampaign" class="xs6 white">
                <v-card-title>
                  <v-avatar
                    size="28px"
                  >
                    <img
                      :src="newCampaign.profile.profilePic.i"
                      alt="Avatar"
                    >
                  </v-avatar>
                  <span class="pl-2 body-2">{{ newCampaign.name }}</span><span>&nbsp;- {{ newCampaign.title }}</span>
                  <div class="closeModal">
                    <v-icon @click="previewNewCampaign = false" large>close</v-icon>
                  </div>
                </v-card-title>
                  <v-divider class="pb-2"></v-divider>
                  <div v-if="newCampaign.videoPlay && newCampaign.videoUrl.i !== undefined" style="position:relative">
                      <v-btn @click="newCampaign.videoPlay = false" style="position:absolute;margin-left:auto;margin-right:auto;left:0;right:0;top:37%" large fab flat class="white">
                        <v-icon large class="secondary--text">play_arrow</v-icon>
                      </v-btn>
                    <img style="min-height:200px" @click="newCampaign.videoPlay = false" :src="$store.state.uploadVideoSnapshotUrl" width="100%" alt="Video snapshot">
                  </div>
                  <div v-if="newCampaign !== '' && newCampaign.videoUrl.i !== undefined">
                    <video preload playsinline v-show="!newCampaign.videoPlay" width="100%" controls>
                      <source :src="newCampaign.videoUrl.i" type="video/mp4">
                      Your browser does not support HTML5 video.
                    </video>
                  </div>
                  <!-- PLACEHOLDER  -->
                  <div v-if="newCampaign !== ''">
                    <img v-if="newCampaign.videoUrl.i === undefined" src="@/assets/videoplaceholder.jpg" width="100%" alt="">
                  </div>
                    <v-card-text>
                      <div class="body-2 mb-1">
                        <v-chip v-bind:key="x" v-for="x in newCampaign.competences" small outline color="green" text-color="green">#{{ x }}</v-chip>
                      </div>
                      <div class="body-2 pb-1 grey--text text--darken-2">
                        {{ newCampaign.bransch }} <span v-show="newCampaign.underCategory.length > 0">></span>
                        <span v-bind:key="c" v-for="(c, index) in newCampaign.underCategory">{{ c }}<span v-show="index < newCampaign.underCategory.length - 1">, </span></span>
                      </div>
                      <div class="body-2 pb-1 grey--text text--darken-3">
                        <span class="green--text text--darken-3">Region:</span> <span v-bind:key="r" v-for="(r, index) in newCampaign.region">{{ r }}<span v-show="index < newCampaign.region.length - 1">, </span></span>
                        <span class="px-1">|</span>
                        <span class="green--text text--darken-3">Nuvarande tjänst</span>: <span class="body-2 grey--text text--darken-2">{{ newCampaign.nuvarande }}</span>
                      </div>
                      <div>
                        <span class="body-1">
                          {{ newCampaign.msg }}
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
                      CV/Profil <v-icon class="ml-1" small>person</v-icon>
                    </v-btn>
                    <v-btn @click="showProfile" class="primary lighten-1 hidden-sm-and-up" small flat round>
                        <v-icon>person</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn disabled class="grey grey--text text--darken-2 darken-2" small outline round>
                      Spara <v-icon class="ml-1">save_alt</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
        </v-dialog>
    </div>

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
                    <img style="min-height:200px" v-if="playedCampaign.snapshot !== ''" @click="playedCampaign.videoPlay = false" :src="playedCampaign.snapshot" width="100%" alt="Video snapshot">
                    <img style="min-height:200px" v-if="playedCampaign.snapshot === ''" @click="playedCampaign.videoPlay = false" :src="$store.state.uploadVideoSnapshotUrl" width="100%" alt="Video snapshot">
                  </div>
                  <video v-show="!playedCampaign.videoPlay" preload playsinline width="100%" controls>
                    <source :src="playedCampaign.videoUrl.i" type="video/mp4">
                    Your browser does not support HTML5 video.
                  </video>
                    <v-card-text>
                      <div class="body-2 mb-1">
                        <v-chip v-bind:key="x" v-for="x in playedCampaign.competences" small outline color="green" text-color="green">#{{ x }}</v-chip>
                      </div>
                      <div class="body-2 pb-1 grey--text text--darken-3">
                        <span class="body-2 grey--text text--darken-2">{{ playedCampaign.bransch }} 
                          <span v-bind:key="x" v-for="(x, index) in playedCampaign.underCategory" v-show="playedCampaign.underCategory.length > 0"><span v-show="index === 0">></span> {{ x }}<span v-show="index < playedCampaign.underCategory.length - 1">, </span></span></span>
                      </div>
                      <div class="body-2 pb-1 green--text text--darken-3">
                        Region: <span class="grey--text text--darken-2" v-bind:key="r" v-for="(r, index) in playedCampaign.region" v-show="playedCampaign.region.length > 0">{{ r }}<span v-show="index < playedCampaign.region.length - 1">, </span></span>
                        <span class="px-1">|</span>
                        <span>Nuvarande: <span class="grey--text text--darken-2">{{ playedCampaign.nuvarande }}</span></span>
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
                    <v-btn disabled class="blue blue--text hidden-xs-only" small outline round>
                      CV/Profil <v-icon class="ml-1" small>person</v-icon>
                    </v-btn>
                    <v-btn disabled class="blue blue--text hidden-sm-and-up" small outline round>
                        <v-icon>person</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn disabled class="grey grey--text text--darken-2 darken-2" small outline round>
                      Spara <v-icon class="ml-1">save_alt</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
        </v-dialog>
    </div>

    <!-- DIALOG FÖR REDIGERA KAMPANJ -->
    <div v-if="editCampaignObj !== ''">
      <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="670" v-model="editCampaign">
        <v-card v-if="editCampaign" class="xs6 white">
            <v-card-title class="justify-center primary lighten-3 white--text">
              <div class="title py-1">
                Redigera presentation
              </div>
              <div class="closeModal">
                <v-icon @click="editCampaign = false" large class="white--text pointer">close</v-icon>
              </div>
            </v-card-title>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex :pr-1="$vuetify.breakpoint.mdAndUp" xs12 md6>
                    <v-text-field
                      box
                      label="Yrekstitel"
                      v-model="editCampaignObj.title"
                    ></v-text-field>
                  </v-flex>
                  <v-flex :pl-1="$vuetify.breakpoint.mdAndUp" xs12 md6>
                    <v-select
                      :items="filter.region"
                      box
                      multiple
                      :counter="5"
                      label="Region"
                      v-model="editCampaignObj.region"
                  ></v-select>
                  </v-flex>
                  <v-flex :pr-1="$vuetify.breakpoint.mdAndUp" xs12 md6>
                    <v-select
                      box
                      label="Bransch"
                      :items="getBranschItems()"
                      v-model="editCampaignObj.bransch"
                      @change="zeroUnderCategories"
                    ></v-select>
                  </v-flex>
                  <v-flex :pl-1="$vuetify.breakpoint.mdAndUp" xs12 md6>
                    <v-select
                      box
                      multiple
                      label="Underkategorier (Max 5)"
                      :counter="5"
                      :items="getBranschUnderCategoriesEdit()"
                      v-model="editCampaignObj.underCategory"
                    ></v-select>
                  </v-flex>
                </v-layout>
                <div class="body-1">
                  <v-textarea
                    box
                    label="Meddelande"
                    v-model="editCampaignObj.msg"
                  ></v-textarea>
                </div>
                <div>
              <v-btn :disabled="updateVideoBtn" style="margin-top:-15px" block @click="onPickFileEdit" round outline class="success success--text mb-2">
                <v-icon class="mr-2">videocam</v-icon>
                Ladda upp ny video
              </v-btn>
            </div>
            <input
              v-show="0" 
              type="file" 
              ref="fileInputEdit"
              accept="video/*"
              @change="onFilePicked"
              >
              <div v-show="edit.valueDeterminate > 0">
              <div v-show="edit.valueDeterminate < 100" class="subheading pt-3" style="font-weight:bold">Laddar upp: {{ edit.valueDeterminate }}%</div>
              <div v-show="edit.valueDeterminate === 100" class="success--text subheading pt-3" style="font-weight:bold">
                  <span v-show="edit.fileUploadError === ''">Klart! Din fil har laddats upp <v-icon small class="success--text">thumb_up</v-icon></span> 
                  <span v-show="edit.fileUploadError !== ''" class="red--text body-2">{{ edit.fileUploadError }}</span>
              </div>
                <v-progress-linear v-model="edit.valueDeterminate"></v-progress-linear>
              </div>
                <div class="body-1">
                  <v-autocomplete
                    :counter="5"
                    box
                    :items="filter.competences"
                    v-model="editCampaignObj.competences"
                    label="Tagga dina relevanta komptenser"
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
                </div>
                <v-layout row wrap>
                  <v-flex :pr-1="$vuetify.breakpoint.mdAndUp" xs12 md6>
                    <v-text-field
                      box
                      label="Nuvarande position"
                      v-model="editCampaignObj.nuvarande"
                    ></v-text-field>
                  </v-flex>
                  <v-flex :pl-1="$vuetify.breakpoint.mdAndUp" xs12 md6>
                    <v-select
                      box
                      label="Tillgänglighet"
                      :items="filter.availability"
                      v-model="editCampaignObj.status"
                    ></v-select>
                  </v-flex>
                </v-layout>
                <v-flex style="margin-top:-15px" text-xs-center md12>
                  <div class="body-2 mb-1">Status:</div>
                  <div class="pb-1">
                  <span class="body-2 white--text" style="background:green;padding:2px 5px;border-radius:8px" v-show="editCampaignObj.active">Aktiv</span>
                  <span class="body-2 white--text" style="background:red;padding:2px 5px;border-radius:8px" v-show="!editCampaignObj.active">Pausad</span>
                </div>
                <v-btn @click="editCampaignObj.active = !editCampaignObj.active" block outline small round :class="{'secondary secondary--text mb-3' : editCampaignObj.active, 'success success--text mb-3' : !editCampaignObj.active}">
                  {{ editCampaignObj.active ? 'Pausa kampanj' : 'Aktivera kampanj' }} 
                  <v-icon class="ml-2">{{ editCampaignObj.active ? 'pause' : 'check_circle_outline'}}</v-icon>
                </v-btn>
                </v-flex>
              </v-card-text>
              <v-card-actions style="margin-top:-20px">
                <v-btn v-if="1" @click="playMyCampaign(editCampaignObj)" round flat block class="success">
                  <v-icon>play_arrow</v-icon> <span class="hidden-xs-only">Förhandsgranska</span>
                </v-btn>
                <v-btn flat :loading="loadingDelete" @click="updateOrDeleteCampaign(editCampaignObj.id, 1), loadingDelete = true" class="secondary lighten-2 white--text" round block >
                  <span class="hidden-xs-only">Ta bort kampanj</span>
                  <v-icon>delete</v-icon>
                </v-btn>
                <v-btn :disabled="!isVideoUploaded" flat :loading="loadingUpdate" @click="updateOrDeleteCampaign(editCampaignObj.id, 0), loadingUpdate = true" class="success lighten-1 white--text" round block >
                  <span>Spara ändringar </span>
                  <v-icon class="hidden-xs-only">autorenew</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>
    </div>

    <v-dialog max-width="400" v-model="updateWasSuccessfulNotification">
      <v-card>
        <v-card-title class="justify-center">
          <div class="title">Presentationen har uppdaterats <v-icon class="success--text">check_circle</v-icon></div>
        </v-card-title>
        <v-card-actions>
          <v-btn @click="updateWasSuccessfulNotification = false" block round outline>Tack!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="400" v-model="campaignUploadedModal">
      <v-card>
        <v-card-title class="justify-center success lighten-1">
          <div class="title white--text">Presentationen är publicerad <v-icon v-show="$vuetify.breakpoint.smAndUp" class="white--text">check_circle</v-icon></div>
        </v-card-title>
        <v-card-text>
          <div class="body-1">
            <p>
              Din presentation finns nu tillgänglig för företag i marknadsplatsen för företag, 
              den finns där så länge den har status 'aktiv'.
              Du blir notifierad här &amp; via mail när du fått en mötesförfrågan.
            </p>
            <p>
              Du kan följa statistik för din presentation på startsidan
              under "Statistik för dina presentationer" sektionen.
            </p>
            <p class="caption grey lighten-4 px-1 py-1">
              <v-icon small class="info--text text--darken-2">info</v-icon>  
              Eftersom Jobflix är en ny tjänst och fortfarande är i beta version för företagen så ber vi dig om 
              att ha förståelse över att fler företag kommer att ansluta sig inom kort.
            </p>
          </div>
        </v-card-text>
        <v-card-actions style="margin-top:-25px!important">
          <v-btn @click="campaignUploadedModal = false" block round outline>OK!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="400" v-model="uploadingPresentation">
      <v-card>
        <v-card-title class="justify-center primary lighten-3">
          <div class="title white--text">Laddar upp din presentation</div>
        </v-card-title>
        <v-card-actions>
          <v-btn block flat :loading="uploadingPresentation"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/database'

export default {
  data () {
    return {
      testWatch: 0,
      uploadingPresentation: false,
      newCampaign: {
        campaignName: '',
        title: '',
        name: '',
        videoUrl: '',
        competences: '',
        nuvarande: '',
        msg: '',
        active: true,
        bransch: '',
        underCategory: [],
        region: [],
        profilePic: '',
        profile: '',
        status: '',
        id: '',
        userId: this.$store.state.user.id,
        uniqueVideoViews: 0,
        uniqueProfileViews: 0,
        invitations: 0,
        uniqueProfileViewers: ['xx'],
        uniqueVideoViewers: ['xx'],
        invitationsUsers: ['x'],
        highestEducation: '',
        yearsExperience: '',
        timeStamp: '',
        videoPlay: true,
        applicantDBId: this.$store.state.yourDatabaseString,
        email: '',
        phoneNr: ''
      },
      kampanjPlay: true,
      playedCampaign: '',
      editCampaign: false,
      editCampaignObj: '',
      originalEditCampaignObj: '',
      previewNewCampaign: false,
      valueDeterminate: 0,
      fileUploadError: '',
      edit: {
        valueDeterminate: 0,
        fileUploadError: '',
        value: false
      },
      branschPick: ['Data & IT', 'Administartion'],
      statusItems: ['Tillgänglig snarast', '1 mån. uppsägningstid', '3 mån. uppsägningstid', '6 mån. uppsägningstid eller mer'],
      updateWasSuccessfulNotification: false,
      loadingUpdate: false,
      loadingDelete: false,
      campaignUploadedModal: false,
      snapshotUrl: '',
      uploadingCampaign: false,
      uploadingNewSnapshot: false,
      updateVideoBtn: false
    }
  },
  watch: {
    lookForNewCampaignCategorysChanges: function () {
      if (this.newCampaign.bransch === '') {
        for (let x in this.$store.state.filter.bransch) {
          for (let ii in this.$store.state.filter.bransch[x]) {
            if (this.$store.state.filter.bransch[x][ii].includes(this.newCampaign.underCategory[0])) {
              this.newCampaign.bransch = this.$store.state.filter.bransch[x].main
              setTimeout(() => {
                this.newCampaign.underCategory = [this.$store.state.filter.bransch[x][ii]]
              }, 100)
            }
          }
        }
      }
    },
    editCampaign: function () {
      this.editCampaign ? this.edit.value = true : this.edit.value = false
    },
    watchProfileInfo: function () {
      this.newCampaign.name = this.$store.state.profileInfo.profil.fullName
      this.newCampaign.profilePic = this.$store.state.profileInfo.profil.profilePic.i
      this.newCampaign.profile = this.$store.state.profileInfo.profil
      this.newCampaign.email = this.$store.state.profileInfo.profil.email
      this.newCampaign.phoneNr = this.$store.state.profileInfo.profil.phoneNr
    },
    watchUploadVideoSnapshotUrl: function () {
      if (this.$store.state.uploadVideoSnapshotUrlObject.i !== undefined) {
        if (this.$store.state.uploadVideoSnapshotUrlObject.i.length > 4) {
          this.uploadingNewSnapshot = false
          if (this.edit.value) {
            this.editCampaignObj.snapshot = this.$store.state.uploadVideoSnapshotUrlObject.i
          } else {
            this.$store.state.uploadVideoSnapshotUrl = this.$store.state.uploadVideoSnapshotUrlObject.i
            this.snapshotUrl = this.$store.state.uploadVideoSnapshotUrlObject.i
          }
        }
      }
    }
  },
  methods: {
    test () {
      console.log(this.$store.state.uploadVideoSnapshotUrlObject.i)
    },
    showProfile () {
      this.$store.state.showProfile = true
    },
    playExampleVideo () {
      this.playedCampaign = {
        name: 'Jacob Ekblad',
        profile: {
          profilePic: {
            i: 'https://www.jobflix.se/images/profilepic-placeholder.png'
          }
        },
        title: 'Säljchef (Exempel)',
        videoUrl: {
          i: 'https://firebasestorage.googleapis.com/v0/b/instawork-814df.appspot.com/o/official-videos%2F1547054545282D7A05FB9-BD12-45EC-AACE-D79453CF1BD3.MOV?alt=media&token=5e606f68-877a-44f8-800b-85c4a8c4387e'
        },
        snapshot: 'https://firebasestorage.googleapis.com/v0/b/instawork-814df.appspot.com/o/video-snapshots%2Fsnapshot4.png?alt=media&token=5af4a46e-7ede-4ef2-9bc7-c7c4407be2d3',
        competences: ['B2B', 'Marknadsföring', 'Företagsekonomi', 'Försäljning', 'Service'],
        nuvarande: 'Säljchef',
        msg: 'Söker nu nya utmaningar inom företagsförsäljning. Skicka en inbjudan så hoppas jag vi ses!',
        active: true,
        bransch: 'Försäljning',
        underCategory: ['Försäljningschef', 'B2B', 'B2C', 'Account manager', 'Key account manager'],
        region: ['Stocholm', 'Uppsala'],
        videoPlay: true
      }
      this.kampanjPlay = true
    },
    zeroUnderCategories () {
      this.newCampaign.underCategory = ''
      if (this.editCampaignObj !== '') {
        this.editCampaignObj.underCategory = ''
      }
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
      if (this.newCampaign.bransch !== '') {
        for (var i in this.$store.state.filter.bransch) {
          if (this.newCampaign.bransch === this.$store.state.filter.bransch[i].main) {
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
    getBranschUnderCategoriesEdit () {
      var arr = []
      for (var i in this.$store.state.filter.bransch) {
        if (this.editCampaignObj.bransch === this.$store.state.filter.bransch[i].main) {
          for (var ii in this.$store.state.filter.bransch[i]) {
            arr.push(this.$store.state.filter.bransch[i][ii])
          }
        }
      }
      arr.shift()
      return arr
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onPickFileEdit () {
      this.$refs.fileInputEdit.click()
    },
    onFilePicked (event) {
      var global = this
      this.uploadingNewSnapshot = true
      this.updateVideoBtn = true
      if (global.edit.value) {
        this.editCampaignObj.videoUrl = ''
        this.editCampaignObj.snapshot = ''
        this.edit.valueDeterminate = 1
      } else {
        this.updateVideoBtn = false
        this.newCampaign.videoUrl = ''
        this.valueDeterminate = 1
      }
      // Get file
      var file = event.target.files[0]
      // Create storage red
      var theUrl = new Date().getTime().toString()
      var storageRef = firebase.storage().ref('official-videos/' + theUrl + file.name)
      // Upload file
      var task = storageRef.put(file)
      // Update progress bar
      task.on('state_changed',
        function progress (snapshot) {
          var percentage = (snapshot.bytesTransferred /
          snapshot.totalBytes) * 100
          if (global.edit.value) {
            global.edit.valueDeterminate = Math.floor(percentage)
          } else {
            global.valueDeterminate = Math.floor(percentage)
          }
        },
        function error (err) {
          console.log(err)
          if (global.edit.value) {
            global.edit.fileUploadError = 'Något gick fel och filen kunde inte laddas upp.'
          } else {
            global.fileUploadError = 'Något gick fel och filen kunde inte laddas upp.'
          }
        },
        function complete () {
          var myStorage = firebase.storage()
          var giveMe
          var getImageUrl = function () {
            return myStorage.ref('official-videos/' + theUrl + file.name).getDownloadURL()
          }
          giveMe = getImageUrl()
          if (global.edit.value) {
            global.editCampaignObj.videoUrl = giveMe
          } else {
            global.newCampaign.videoUrl = giveMe
            global.$store.state.uploadVideoUrl = giveMe
          }
        }
      )
      // SNAPSHOTTA VIDEON
      var fileReader = new FileReader()
      if (file.type.match('image')) {
        fileReader.readAsDataURL(file)
      } else {
        fileReader.onload = function () {
          var blob = new Blob([fileReader.result], {type: file.type})
          var url = URL.createObjectURL(blob)
          var video = document.createElement('video')
          var timeupdate = function () {
            if (snapImage()) {
              video.removeEventListener('timeupdate', timeupdate)
              video.pause()
            }
          }
          video.addEventListener('loadeddata', function () {
            if (snapImage()) {
              video.removeEventListener('timeupdate', timeupdate)
            }
          })
          var snapImage = function () {
            var canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
            var image = canvas.toDataURL()
            var success = image.length > 100
            if (success) {
              global.uploadSnapshotToFirebase(image)
              URL.revokeObjectURL(url)
            } else {
              global.updateVideoBtn = false
            }
            return success
          }
          video.addEventListener('timeupdate', timeupdate)
          video.preload = 'metadata'
          video.src = url
          // Load video in Safari / IE11
          video.muted = true
          video.playsInline = true
          video.play()
        }
        fileReader.readAsArrayBuffer(file)
      }
    },
    uploadSnapshotToFirebase (image) {
      let global = this
      let nr = [1, 32, 54, 234, 9834, 32, 'gg', 'sdf', 'as', 'wef', 'gfg', 'qwe', 43, 54, 65, 234, 54, 234, 54, 23, 45, 'x']
      let fileName = new Date().getTime() + nr[Math.floor(Math.random() * 10)] + this.$store.state.profileInfo.profil.fullName.split(' ')[0]
      let theImage = image.substr(22)
      let uploadTask = firebase.storage().ref('video-snapshots').child(fileName).putString(theImage, 'base64', {contentType: 'image/png'})
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          // VISA INGET
        }, function (error) {
          console.log(error)
          global.uploadingNewSnapshot = false
        }, function () {
          // Upload completed successfully, now we can get the download URL
          var myStorage = firebase.storage()
          var giveMe
          var getImageUrl = function () {
            return myStorage.ref('video-snapshots').child(fileName).getDownloadURL()
          }
          giveMe = getImageUrl()
          global.$store.state.uploadVideoSnapshotUrlObject = giveMe
        }
      )
    },
    playMyCampaign (par) {
      this.playedCampaign = par
      this.kampanjPlay = true
    },
    editObj (par) {
      this.originalEditCampaignObj = JSON.stringify(par)
      this.editCampaignObj = par
      this.edit.valueDeterminate = 0
      this.editCampaign = true
    },
    updateOrDeleteCampaign (videoId, nr) {
      var theCampaign
      var global = this
      this.uploadingPresentation = true
      firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString)
        .once('value', response => {
          const res = response.val()
          for (var i in res.profileInfo.campaigns) {
            if (res.profileInfo.campaigns[i].id === videoId) {
              res.profileInfo.campaigns[i].profile = global.$store.state.profileInfo.profil
              theCampaign = i
              break
            }
          }
          if (nr === 0) {
            // Uppdatera kampanj
            global.editCampaignObj.videoPlay = true
            firebase.database().ref('applicants').child(global.$store.state.yourDatabaseString + '/profileInfo/campaigns/')
              .update({[theCampaign]: global.editCampaignObj})
            .then(res => {
              global.uploadingPresentation = false
              global.loadingUpdate = false
              global.loadingDelete = false
              global.editCampaign = false
              global.updateWasSuccessfulNotification = true
              global.limitPresentationsToOnePerBransch(global.editCampaignObj)
              global.$store.commit('sendCampaignToCampaingsNode')
            })
          } else if (nr === 1) {
            // Ta bort kampanj
            firebase.database().ref('applicants').child(global.$store.state.yourDatabaseString + '/profileInfo/campaigns/' + theCampaign)
              .remove()
            .then(res => {
              global.uploadingPresentation = false
              global.loadingUpdate = false
              global.loadingDelete = false
              global.editCampaign = false
              global.updateWasSuccessfulNotification = true
              global.$store.commit('sendCampaignToCampaingsNode')
            })
          }
        })
        .catch(function (error) {
          console.log(error.message)
        })
    },
    limitPresentationsToOnePerBransch (p) {
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
    },
    post () {
      // Postar ny kampanj
      // Räkna ut arbetslivserfaenheten
      this.uploadingPresentation = true
      var arr = []
      var newArr
      var values = []
      this.uploadingCampaign = true
      this.newCampaign.videoPlay = true
      this.newCampaign.snapshot = this.$store.state.uploadVideoSnapshotUrl
      this.newCampaign.timeStamp = new Date().getTime()
      for (var y in this.$store.state.profileInfo.profil.experience) {
        arr.push(this.$store.state.profileInfo.profil.experience[y].workPeriod)
      }
      newArr = arr.join(' ').split(' ')
      newArr.forEach(val => {
        if (val === 'Nuvarande..') {
          val = new Date().toISOString().substr(0, 4)
        }
        if (!isNaN(val)) {
          if (!values.includes(val)) {
            values.push(val)
          }
        }
      })
      let realValues = []
      for (let i in values) {
        if (values[i].length > 0) {
          realValues.push(values[i])
        }
      }
      realValues.sort((a, b) => {
        return a - b
      })
      if (!isNaN(Number(realValues[realValues.length - 1]) - Number(realValues[0]))) {
        this.newCampaign.yearsExperience = Number(realValues[realValues.length - 1]) - Number(realValues[0])
      } else {
        this.newCampaign.yearsExperience = 0
      }
      // Forstätt med resten...
      var educationLevel = 0
      for (var i in this.$store.state.profileInfo.profil.education) {
        if (this.$store.state.profileInfo.profil.education[i].schoolType === 'Högskola' && educationLevel < 3) {
          educationLevel = 3
        } else if (this.$store.state.profileInfo.profil.education[i].schoolType === 'Yrkeshögskola' && educationLevel < 2) {
          educationLevel = 2
        } else if (this.$store.state.profileInfo.profil.education[i].schoolType === 'Gymnasium' && educationLevel < 1) {
          educationLevel = 1
        } else if (this.$store.state.profileInfo.profil.education[i].schoolType === 'Grundskola' && educationLevel <= 0) {
          educationLevel = 0
        }
      }
      this.newCampaign.highestEducation = educationLevel
      this.newCampaign.id = new Date().getTime() + 'yi' + Math.random()
      firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/campaigns')
        .push(this.newCampaign)
      .then(res => {
        // Leta efter bevakningar som nästa function
        this.limitPresentationsToOnePerBransch(this.newCampaign)
        let newCampaignHolder = JSON.stringify(this.newCampaign)
        this.$store.commit('lookForBevakningarStore', JSON.parse(newCampaignHolder))
        this.$store.commit('sendCampaignToCampaingsNode')
        this.uploadingPresentation = false
        this.loadingUpdate = false
        this.campaignUploadedModal = true
        this.uploadingCampaign = false
        // Nollställ newCampaign Objeketet
        this.newCampaign.title = ''
        this.newCampaign.competences = []
        this.newCampaign.nuvarande = ''
        this.newCampaign.msg = ''
        this.newCampaign.bransch = ''
        this.newCampaign.underCategory = []
        this.newCampaign.region = []
        this.newCampaign.status = ''
        this.newCampaign.campaignName = ''
      })
    }
  },
  computed: {
    watchUploadVideoSnapshotUrl () {
      return this.$store.state.uploadVideoSnapshotUrlObject.i
    },
    lookForNewCampaignCategorysChanges () {
      return this.newCampaign.underCategory
    },
    watchProfileInfo () {
      return this.$store.state.profileInfo
    },
    uploadVideoBtn () {
      if (this.newCampaign.videoUrl.hasOwnProperty('i')) {
        return true
      } else {
        return false
      }
    },
    isVideoUploaded () {
      if (this.editCampaignObj.videoUrl.hasOwnProperty('i')) {
        return this.editCampaignObj.videoUrl.i !== undefined && this.originalEditCampaignObj !== JSON.stringify(this.editCampaignObj) && !this.uploadingNewSnapshot && this.editCampaignObj.msg !== '' && this.editCampaignObj.nuvarande !== ''
      } else {
        return false
      }
    },
    uploadCampaignBtn () {
      // Denna tar hänsyn till allt pluss kollar att videon o snapshot url har laddats klart
      if (this.newCampaign.videoUrl.hasOwnProperty('i')) {
        return this.newCampaign.videoUrl.i !== undefined && !this.uploadingNewSnapshot && this.newCampaign.nuvarande !== '' && this.newCampaign.msg !== 'Skriv ditt meddelande...' && this.newCampaign.msg !== '' && this.newCampaign.bransch !== '' && this.newCampaign.region.length > 0 && this.newCampaign.status !== ''
      } else {
        return false
      }
      // Följande kan publicera utan video -- Kör denna under production...
      // return this.newCampaign.nuvarande !== '' && this.newCampaign.msg !== 'Skriv ditt meddelande...' && this.newCampaign.bransch !== '' && this.newCampaign.region !== '' && this.newCampaign.status !== ''
    },
    filter () {
      return this.$store.state.filter
    },
    getAvailability () {
      var arr = []
      for (var i in this.$store.state.filter.availability) {
        if (this.$store.state.filter.availability[i] !== 'Visa alla') {
          arr.push(this.$store.state.filter.availability[i])
        }
      }
      return arr
    },
    competenceChips () {
      var arr = ['html', 'css', 'scss', 'sass', 'javasript', 'python', 'angular', 'vue', '.net', 'java', 'marketing', 'marknadsföring', 'försäljning']
      var newArr = []
      var x
      arr.forEach(val => {
        x = val.replace(val[0], val[0].toUpperCase())
        newArr.push(x)
      })
      return newArr.sort()
    },
    profileInfo: {
      get () { return this.$store.getters.profileInfoGetter },
      set (value) { this.$store.commit('profileInfoCommit', value) }
    }
  },
  mounted () {
    if (this.$store.state.uploadVideoUrl !== '') {
      this.newCampaign.videoUrl = this.$store.state.uploadVideoUrl
    }
    if (this.$store.state.profileInfo !== 'userObject') {
      this.newCampaign.name = this.$store.state.profileInfo.profil.fullName
      this.newCampaign.name = this.$store.state.profileInfo.profil.fullName
      this.newCampaign.profilePic = this.$store.state.profileInfo.profil.profilePic.i
      this.newCampaign.profile = this.$store.state.profileInfo.profil
      this.newCampaign.email = this.$store.state.profileInfo.profil.email
      this.newCampaign.phoneNr = this.$store.state.profileInfo.profil.phoneNr
    }
  }
}
</script>

<style scoped>
li {
  padding: 3px 0 !important;
}
</style>
