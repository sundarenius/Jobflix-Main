<template>
  <v-container>
    <v-layout my-5 justify-center v-if="$store.state.profileInfo === 'userObject'">
      <v-flex style="min-height:33vh" my-5 xs8>
          <h1 class="display-1 text-xs-center mb-3 primary--text text--darken-2">
            <span class="jobflix-title">
              <v-icon class="black--text play-icon-title">play_arrow</v-icon>
              <span class="black--text jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
            </span>
          </h1>
          <v-progress-linear :indeterminate="true"></v-progress-linear>
      </v-flex>
    </v-layout>
    <div v-if="$store.state.profileInfo !== 'userObject'">
    <v-btn v-if="0" @click="test">TEST FROM PROFIL</v-btn>
    <v-layout class="black--text" justify-center row wrap>
       <v-btn @click="updateProfile" fab v-if="$vuetify.breakpoint.smAndUp && !hasProfileBeenModified" medium style="position:fixed;right:10px;top:55px;padding: 5px 10px;z-index:50" class="success lighten-1">
          <v-icon>save</v-icon>
        </v-btn>
        <v-btn @click="updateProfile" fab v-if="$vuetify.breakpoint.xsOnly && !hasProfileBeenModified" medium style="position:fixed;right:0px;top:50px;padding: 5px 10px;z-index:50" class="success lighten-1">
          <v-icon>save</v-icon>
        </v-btn>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <div style="font-weight:bold" class="display-1 py-2">
              Hantera din profil
            </div>
            <v-divider></v-divider>
            <div class="body-1 text-xs-left pt-2 pb-1">
              <p>
                Här redigerar du erfarenheter, utbildningar och övrig information som arbetsgivarna 
                får tillgång till i samband med din videopresentation.
              </p>
              <p>
                Försök nå en profilstyrka på medel/hög.
                Lägg sedan störst fokus på din
                <strong @click="$router.push('/share')" class="primary--text pointer">
                  videopresentation</strong>.
              </p>
            </div>
            <v-divider></v-divider>
            <div class="caption py-2 grey lighten-4">
              <v-icon class="primary--text" small>info</v-icon> 
              Dina uppgifter är endast synliga för de du bokat möte med, viktigt att den stämmer.
              <span v-if="activeAdsLength">
                Företag kan hitta dig när du har en videopresentation ute eller när du 
              söker direkt via <strong @click="$router.push('/ads')" class="primary--text pointer">annonser</strong>.
              </span>
               <span v-if="!activeAdsLength">
                Företag kan endast hitta dig när du har en videopresentation ute.
              </span>
            </div>
            <div class="body-1 mt-3">Mail:&nbsp;<span class="body-2">{{ profile.email }}</span></div>
            <v-text-field label="Tel. nr:" v-model="profile.phoneNr"></v-text-field>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex my-2 xs12>
        <v-flex xs12>
        <v-card>
          <v-layout v-show="!this.$vuetify.breakpoint.smAndDown" row>
          <v-flex @click="updateBackgroundImgModal = true" @mouseover="updateBackImg = true" @mouseout="updateBackImg = false" xs12>
            <v-img height="200px" width="100%" :src="profile.backgroundImg.i">
            <v-icon v-show="!updateBackImg" large class="grey--text pt-3 pl-3">photo_camera</v-icon>
            <v-btn v-show="updateBackImg" class="mt-3" round><v-icon class="pr-2" medium>photo_camera</v-icon>Uppdatera bakgrundsbild</v-btn>
            </v-img>
          </v-flex>
          </v-layout>

          <v-layout py-2 px-3 row wrap>
            <v-flex v-show="this.$vuetify.breakpoint.lgAndUp" xs2>
              <div style="width:120px">
                <v-img
                  style="border:3px solid lightgray;margin-top:-50px;border-radius:10px"
                  contain 
                  width="100%"
                  :src="profile.profilePic.i"
                >
                </v-img>
                <v-btn small @click="changeProfilePicModal = true" block outline round>Ändra profilbild</v-btn>
              </div>
            </v-flex>

            <v-layout row v-show="this.$vuetify.breakpoint.mdAndDown">
              <v-flex text-xs-left xs3>
                  <img
                    @click="changeProfilePicModal = true"
                    style="border:3px solid lightgray;margin-top:0px;width:80px;border-radius:10px"
                    contain
                    :src="profile.profilePic.i"/>
              </v-flex>
              <v-flex pl-3 xs10>
                <div class="text-xs-left title pt-3" style="font-weight:bold">
                  {{ profile.fullName }}
                </div>
                <v-layout wrap>
                  <v-flex @click="editTitle = true" pb-1 xs12>
                    <div v-show="profile.title !== ''" class="body-2 pt-1 teal--text">
                      {{ profile.title }}
                    </div>
                    <div v-show="profile.title === ''" class="body-2 pt-1 teal--text">
                      Klicka här för att skriva din yrkestitel
                    </div>
                  </v-flex>
                  <v-flex @click="editDescription = true" xs12>
                    <div v-show="profile.description !== ''" class="body-1">
                      {{ profile.description }}
                    </div>
                    <div v-show="profile.description === ''" class="body-1">
                      Klicka här för att skriva en beskrivning
                    </div>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>

          <v-flex md9 xs12 :pr-2="$vuetify.breakpoint.mdAndDown">
          <div v-show="$vuetify.breakpoint.lgAndUp">
            <div class="text-xs-left display-1 pt-3 pb-1" style="font-weight:bold">
              {{ profile.fullName }}
            </div>
            <v-tooltip bottom>
              <input placeholder="Skriv din yrkestitel / titlar här" slot="activator" style="width:100%" class="writeHover teal--text body-2 pb-1" v-model="profile.title"/>
              <span>Skriv in dina titlar</span>
            </v-tooltip>
            <v-tooltip bottom>
              <textarea placeholder="Skriv en beskrivning om dig eller din yrkesprofil här" slot="activator" style="width:100%" class="writeHover body-1" v-model="profile.description"></textarea>
              <span>Skriv 1-2 meningar om din yrkesprofil</span>
            </v-tooltip>
          </div>

          <v-layout style="margin-bottom:-15px">
            <v-flex mt-1 xs12 md5>
              <v-text-field
                v-model="profile.externLink"
                label="Frivillig länk som ex. projektsida, linkedin etc."
                placeholder="http://www.DINSIDA.se/"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <div class="pt-3" style="margin-bottom:-5px">
            <v-autocomplete
                v-model="profile.competences"
                :items="competencesChips"
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
          </div>

          <div class="body-1">
            <v-divider></v-divider>
            <v-btn @click="previewProfileDialog = true, fixaDescriptionArr()" flat :block="this.$vuetify.breakpoint.smAndDown" medium class="primary lighten-1 white--text mt-3" round>
              Förhandsgranska profil
              <v-icon class="ml-2">zoom_in</v-icon>
            </v-btn>
            <v-btn :loading="updatingProfile" :disabled="hasProfileBeenModified" @click="updateProfile" flat :block="this.$vuetify.breakpoint.smAndDown" round :class="{'mt-3 success lighten-1' : !hasProfileBeenModified, 'mt-3 grey lighten-1' : hasProfileBeenModified, }" slot="activator">
              Spara ändringar<v-icon class="ml-2">save</v-icon>
            </v-btn>

            <v-tooltip class="hidden-sm-and-down" style="position:absolute;right:0;bottom:13px;cursor:pointer"  bottom>
              <v-icon @click="infoDialog = true" slot="activator" large class="mr-2 info--text">info</v-icon>
              <span>Information</span>
            </v-tooltip>

          </div>

            <div class="grey lighten-3 py-1 px-2">
              <v-progress-linear
                :color="profileStrengthColor"
                height="15"
                :value="profileStrengthValue"
            ></v-progress-linear>
            <span class="body-1">Profilstyrka:
              <span class="body-2">{{ profileStrength }}</span>
            </span>
          </div>

          </v-flex>
          </v-layout>
          </v-card>

          <!-- WORK EXP EDIT -->
          <v-card class="mt-2">
            <v-layout py-2 px-3 row wrap>
              <v-flex :pr-5="this.$vuetify.breakpoint.mdAndUp" md8 xs12>
                <div class="title py-2 black--text"><v-icon class="black--text">work</v-icon> Erfarenhet</div>
                <v-divider class="teal my-1"></v-divider>
                <v-layout py-3 row wrap>
                  <v-flex style="position:relative" class="mb-3" v-bind:key="index" v-for="(exp, index) in profile.experience" xs12>
                    <div class="body-2">
                      <input placeholder="Skriv företagets namn här" slot="activator" style="width:100%;font-weight:bold" class="writeHover grey--text text--darken-1 subheading" v-model="exp.businessName"/>
                    </div>
                    <div style="position:absolute;right:10px;top:0px">
                      <v-tooltip bottom>
                        <v-btn @click="deleteExp(index)" slot="activator" fab flat small>
                          <v-icon medium style="font-weight:bold" class="grey--text">close</v-icon>
                        </v-btn>
                        <span>Ta bort erfarenhet</span>
                      </v-tooltip>
                    </div>
                  
                    <div class="subheading black--text" style="font-weight:bold">
                      <input placeholder="Skriv arbetstitel här" slot="activator" style="width:100%;font-weight:bold" class="writeHover black--text subheading" v-model="exp.workTitle"/>
                    </div>
                    <div @click="workDateDialog = true, profileIndex = index, eduOrWork = 0, month1 = '', month2 = '', nextMonth = false" class="grey--text py-1 writeHover">
                      <v-icon small>calendar_today</v-icon> <span>{{ exp.workPeriod }}</span>
                    </div>
                    <v-textarea
                      @click="jobDescriptionIndex = index, modifyDescription = true"
                      label="Arbetsbeskrivning"
                      placeholder="Skriv några meningar om tjänsten."
                      class="mt-2"
                      box
                      v-model="exp.description"
                      auto-grow
                    ></v-textarea>
                    <v-autocomplete
                      style="margin-top:-10px"
                      :items="competencesChips"
                      v-model="exp.competences"
                      label="Välj taggar"
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
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex>
                    <v-btn @click="addNewExperience" outline round class="black"><v-icon class="mr-2">note_add</v-icon> Lägg till erfarenhet</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
    
            <!-- Utbildning EDIT -->
              <v-flex md4 xs12>
                <div class="title py-2 black--text"><v-icon class="black--text">school</v-icon> Utbildning</div>
                <v-divider class="teal my-1"></v-divider>
                <v-layout py-3 row wrap>
                  <v-flex style="position:relative" class="mb-3" v-bind:key="index" v-for="(school, index) in profile.education" xs12>
                      <div style="position:absolute;right:10px;top:0">
                        <v-tooltip bottom>
                          <v-btn @click="deleteEdu(index)" slot="activator" fab flat small>
                            <v-icon medium style="font-weight:bold" class="grey--text">close</v-icon>
                          </v-btn>
                          <span>Ta bort utbildning</span>
                        </v-tooltip>
                      </div>
                    <div>
                      <input placeholder="Skriv skolans namn här" slot="activator" style="width:100%;font-weight:bold" class="writeHover grey--text subheading" v-model="school.schoolName"/>
                    </div>
                    <div class="pb-1">
                      <input placeholder="Skriv utbildningens ämne här" slot="activator" style="width:100%;font-weight:bold" class="writeHover black--text subheading" v-model="school.subject"/>
                    </div>
                    <div style="margin-top:-5px" @click="workDateDialog = true, profileIndex = index, eduOrWork = 1, month1 = '', month2 = '', nextMonth = false" class="grey--text py-1 writeHover">
                      <v-icon small>calendar_today</v-icon> <span>{{ school.eduPeriod }}</span>
                    </div>
                    <v-select
                      style="margin-bottom:-20px"
                      box
                      label="Typ av utbildning"
                     :items="educationItems"
                     v-model="school.schoolType"
                    ></v-select>
                    <v-autocomplete
                      v-model="school.competences"
                      :items="competencesChips"
                      label="Välj taggar"
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
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex>
                    <v-btn @click="addNewEducation" outline round class="black"><v-icon class="mr-2">note_add</v-icon> Lägg till utbildning</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>

            </v-layout>
          </v-card>

        </v-flex>
      </v-flex>

    </v-layout>

      <!-- DIALOGER NEDAN -->
      <!-- Info Dialog -->
            <v-dialog v-model="infoDialog" width="500" >
              <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>
                  <v-icon class="blue--text mr-3">info</v-icon> Info
                  <div @click="infoDialog = false" class="closeModal">
                    <v-icon large class="pointer">close</v-icon>
                  </div>
                </v-card-title>

                <v-card-text class="px-3">
                  <p>
                    Alla ändringar du gör på din profil kommer vara synbara för arbetsgivare när de kollar dina
                    videopresentationer. Se till att erfarenheter, utbildningar, bilder och kontaktuppgifter stämmer.
                  </p>
                  <p>
                    Taggarna från din profil påverkar inte hur dina videopresentationer visas.
                  </p>
                  <p>
                    Du kan förhandsgranska din profil för att se hur andra kommer att se din profil.
                    Spara dina ändringar när du är klar.
                  </p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="justify-center">
                  <v-btn block color="blue" flat @click="infoDialog = false" >
                    Stäng
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Date pickers DIALOG for the work -->
            <v-dialog v-model="workDateDialog" width="350" >
              <v-card>
                <v-card-title class="headline primary white--text title lighten-2" primary-title >
                  <div class="subheading" v-show="!nextMonth">Välj startdatum...</div>
                  <div class="subheading" v-show="nextMonth">Välj slutdatum eller lämna tom om detta är nuvarande</div>
                  <div @click="workDateDialog = false" class="closeModal">
                    <v-icon large class="pointer white--text">close</v-icon>
                  </div>
                </v-card-title>

                <v-layout justify-center row wrap>
                  <v-flex v-show="!nextMonth" text-xs-center xs12 my-2>
                    <v-date-picker v-model="month1" :show-current="todaysDate" type="month"></v-date-picker>
                  </v-flex>
                  <v-flex v-show="nextMonth" text-xs-center xs12 my-2>
                    <v-date-picker v-model="month2" :show-current="todaysDate" type="month"></v-date-picker>
                  </v-flex>
                </v-layout>

                <v-divider></v-divider>
                <v-card-actions class="justify-center">
                  <v-btn @click="nextMonth = true" v-show="!nextMonth" :disabled="month1 === ''" block color="blue" flat >
                    Välj slutdatum <v-icon>arrow_right</v-icon>
                  </v-btn>
                  <v-btn v-show="nextMonth" block color="blue" flat @click="workDateSetter(), workDateDialog = false" >
                    KLAR!
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- DIALOG för FÖRHANDSGRANSKNING AV PROFIL -->
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
                                <div v-bind:key="index" v-for="(x, index) in exp.descriptionArr">
                                  <p v-if="exp.description.length > 1" style="margin-bottom:-10px" :class="{'body-1' : true, 'pb-2' : !exp.competences.length > 0, 'pb-3' : exp.descriptionArr.length > 1 && index !== exp.descriptionArr.length - 1}">
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

            <v-dialog max-width="400" v-model="updatesHasBeenChanged">
              <v-card>
                <v-card-title class="justify-center primary lighten-2 white--text">
                  <div class="title">Dina ändringar har sparats <v-icon class="white--text">check_circle</v-icon></div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat round outline @click="updatesHasBeenChanged = false" block>OK!</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

    <!--  UPPDATERA PROFILBILD -->
    <v-dialog v-model="changeProfilePicModal" max-width="500">
      <v-card>
        <v-card-title class="primary lighten-3 justify-center">
          <div class="title white--text">
            Ändra profilbild
          </div>
          <div class="closeModal">
            <v-icon @click="changeProfilePicModal = false" large class="white--text">close</v-icon>
          </div>
        </v-card-title>
        <v-card-text class="text-xs-center">
          <img :src="profile.profilePic.i" style="max-width:50%;max-height:100px" alt="Profilbild">
          <v-btn round @click="onPickFile(1)" outline class="secondary" block>Välj fil <v-icon class="ml-2">computer</v-icon></v-btn>
          <input 
            v-show="0" 
            type="file" 
            ref="fileInputProfile" 
            accept="image/*"
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
        </v-card-text>
        <v-card-actions>
          <v-btn round :disabled="!uploadFinishedProfilePic" :loading="updatingProfile" @click="updateProfile" block class="success" flat>Spara <v-icon class="ml-1">cloud_upload</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--   UPPDATERA BAKGRUNDSBILDEN MODAL  -->
    <v-dialog v-model="updateBackgroundImgModal" max-width="500">
      <v-card>
        <v-card-title class="primary lighten-3 justify-center">
          <div class="title white--text">
            Ändra bakgrundsbild
          </div>
          <div class="closeModal">
            <v-icon @click="updateBackgroundImgModal = false" large class="white--text">close</v-icon>
          </div>
        </v-card-title>
        <v-card-text class="text-xs-center">
          <img :src="profile.backgroundImg.i" style="max-height:150px;max-width:100%" alt="Bakgrundsbild">
          <v-btn round @click="onPickFile(2)" outline class="secondary" block>Välj fil <v-icon class="ml-2">computer</v-icon></v-btn>
          <input 
            v-show="0" 
            type="file" 
            ref="fileInputBG" 
            accept="image/*"
            @change="onBackgroundPicked"
            >
            <div v-show="valueDeterminate > 0">
              <div v-show="valueDeterminate < 100" class="subheading pt-3" style="font-weight:bold">Laddar upp: {{ valueDeterminate }}%</div>
              <div v-show="valueDeterminate === 100" class="success--text subheading pt-3" style="font-weight:bold">
                  <span v-show="fileUploadError === ''">Klart! Din fil har laddats upp <v-icon small class="success--text">thumb_up</v-icon></span> 
                  <span v-show="fileUploadError !== ''" class="red--text body-2">{{ fileUploadError }}</span>
              </div>
              <v-progress-linear v-model="valueDeterminate"></v-progress-linear>
            </div>
        </v-card-text>
        <v-card-actions>
          <v-btn round :disabled="!uploadFinishedBackgroundIMG" :loading="updatingProfile" @click="updateProfile" block class="success" flat>Spara <v-icon class="ml-1">cloud_upload</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  ÄNDRA JOBB-BESKRIVNING  -->
    <v-dialog v-model="modifyDescription" max-width="600">
      <v-card>
        <v-card-title class="justify-center primary lighten-3 white--text">
          <div class="title">
            Jobbbeskrivning
          </div>
        </v-card-title>
        <v-card-text>
          <v-textarea
            label="Skriv in en arbetsbeskrivning"
            class="mt-2"
            box
            v-model="jobDescriptionHolder"
            auto-grow
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="modifyDescription = false" flat block round class="secondary lighten-1">Avsluta</v-btn>
          <v-btn @click="changeJobDescription" flat block round class="success lighten-1">KLAR!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="600" v-model="editTitle">
      <v-card>
        <v-card-title class="justify-center primary lighten-3 white--text">
          <div class="title">
            Ändra titel
          </div>
        </v-card-title>
        <v-card-text>
          <v-textarea
            label="Skriv din yrkestitel eller titlar"
            class="mt-2"
            box
            v-model="profile.title"
            auto-grow
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="editTitle = false" flat block round class="success lighten-1">Klar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="600" v-model="editDescription">
      <v-card>
        <v-card-title class="justify-center primary lighten-3 white--text">
          <div class="title">
            Ändra beskrivning
          </div>
        </v-card-title>
        <v-card-text>
          <v-textarea
            label="Skriv kort om din yrkesprofil/dig själv"
            class="mt-2"
            box
            v-model="profile.description"
            auto-grow
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="editDescription = false" flat block round class="success lighten-1">Klar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    </div>
  </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'

export default {
  data () {
    return {
      profile: {
        fullName: '',
        description: '',
        profilePic: '',
        backgroundImg: '',
        title: '',
        competences: [],
        experience: [],
        education: [],
        email: '',
        phoneNr: '',
        externLink: ''
      },
      profileIndex: '',
      updateBackImg: false,
      infoDialog: false,
      workDateDialog: false,
      month1: '',
      month2: '',
      nextMonth: false,
      previewProfileDialog: false,
      eduOrWork: '',
      newDescription: '',
      updatesHasBeenChanged: '',
      compareMeOriginal: '',
      changeProfilePicModal: false,
      valueDeterminate: 0,
      fileUploadError: '',
      uploadFinished: false,
      updatingProfile: false,
      updateBackgroundImgModal: false,
      jobDescriptionIndex: 0,
      modifyDescription: false,
      jobDescriptionHolder: '',
      editTitle: false,
      editDescription: false
    }
  },
  watch: {
    profileInfo: function () {
      this.updateJSONAtPage()
    },
    modifyDescription: function () {
      if (this.modifyDescription === false) {
        this.jobDescriptionHolder = ''
      } else {
        this.jobDescriptionHolder = this.profile.experience[this.jobDescriptionIndex].description
      }
    }
  },
  computed: {
    profileStrength () {
      const text = ['Låg', 'Medel', 'Hög', 'Mycket hög']
      if (this.profileStrengthValue < 30 && this.profileStrengthValue <= 30) {
        return text[0]
      } else if (this.profileStrengthValue > 30 && this.profileStrengthValue <= 60) {
        return text[1]
      } else if (this.profileStrengthValue > 60 && this.profileStrengthValue <= 80) {
        return text[2]
      } else if (this.profileStrengthValue > 80) {
        return text[3]
      }
    },
    profileStrengthValue () {
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
    activeAdsLength () {
      let arr = []
      for (let i in this.$store.state.allAds) {
        if (new Date(this.$store.state.allAds[i].lastDay.replace(/-/g, '/')).getTime() >= new Date().getTime() && this.$store.state.allAds[i].active) {
          arr.push(this.$store.state.allAds[i])
        }
      }
      return arr.length > 4
    },
    uploadFinishedBackgroundIMG () {
      if (this.$store.state.profileInfo.profil.backgroundImg.hasOwnProperty('i')) {
        return this.uploadFinished && this.$store.state.profileInfo.profil.backgroundImg.i !== undefined
      } else {
        return false
      }
    },
    uploadFinishedProfilePic () {
      if (this.$store.state.profileInfo.profil.profilePic.hasOwnProperty('i')) {
        return this.uploadFinished && this.$store.state.profileInfo.profil.profilePic.i !== undefined
      } else {
        return false
      }
    },
    hasProfileBeenModified () {
      return this.compareMeOriginal === JSON.stringify(this.profile)
    },
    educationItems () {
      var arr = []
      for (var i in this.$store.state.filter.utbildning) {
        if (this.$store.state.filter.utbildning[i] !== 'Alla') {
          arr.push(this.$store.state.filter.utbildning[i])
        }
      }
      return arr
    },
    profileInfo: {
      get () { return this.$store.getters.profileInfoGetter },
      set (value) { this.$store.commit('profileInfoCommit', value) }
    },
    person () {
      return this.$store.state.profileInfo.profil.fullName
    },
    profilBeskrivning () {
      return this.$store.state.profileInfo.profil.beskrivning
    },
    headTitle () {
      return this.$store.state.profileInfo.profil.title
    },
    profilePic () {
      return this.$store.state.profileInfo.profil.profilePic
    },
    newCampaign: {
      get () { return this.$store.getters.newCampaignGetter },
      set (value) { this.$store.commit('newCampaignCommit', value) }
    },
    todaysDate () {
      return new Date().toISOString().substr(0, 7)
    },
    competencesChips () {
      return this.$store.state.filter.competences
    }
  },
  methods: {
    test () {
      console.log(this.profile.education)
    },
    changeJobDescription () {
      this.profile.experience[this.jobDescriptionIndex].description = this.jobDescriptionHolder
      this.modifyDescription = false
    },
    onPickFile (nr) {
      if (nr === 1) {
        this.$refs.fileInputProfile.click()
      } else if (nr === 2) {
        this.$refs.fileInputBG.click()
      }
    },
    onFilePicked (event) {
      var global = this
      // Get file
      var file = event.target.files[0]
      // Create storage red
      var theUrl = new Date().getTime().toString()
      var storageRef = firebase.storage().ref('official-applicantImages/' + theUrl + file.name)
      // Upload file
      var task = storageRef.put(file)
      // Update progress bar
      task.on('state_changed',
        function progress (snapshot) {
          var percentage = (snapshot.bytesTransferred /
          snapshot.totalBytes) * 100
          global.valueDeterminate = Math.floor(percentage)
        },
        function error (err) {
          console.log(err)
          global.fileUploadError = 'Något gick fel och filen kunde inte laddas upp.'
        },
        function complete () {
          var myStorage = firebase.storage()
          var result
          var getImageUrl = function () {
            return myStorage.ref('official-applicantImages/' + theUrl + file.name).getDownloadURL()
          }
          result = getImageUrl()
          global.profile.profilePic = result
          global.uploadFinished = true
        }
      )
    },
    onBackgroundPicked (event) {
      var global = this
      // Get file
      var file = event.target.files[0]
      // Create storage red
      var theUrl = new Date().getTime().toString()
      var storageRef = firebase.storage().ref('official-applicantImages/' + theUrl + file.name)
      // Upload file
      var task = storageRef.put(file)
      // Update progress bar
      task.on('state_changed',
        function progress (snapshot) {
          var percentage = (snapshot.bytesTransferred /
          snapshot.totalBytes) * 100
          global.valueDeterminate = Math.floor(percentage)
        },
        function error (err) {
          console.log(err)
          global.fileUploadError = 'Något gick fel och filen kunde inte laddas upp.'
        },
        function complete () {
          var myStorage = firebase.storage()
          var result
          var getImageUrl = function () {
            return myStorage.ref('official-applicantImages/' + theUrl + file.name).getDownloadURL()
          }
          result = getImageUrl()
          global.profile.backgroundImg = result
          global.uploadFinished = true
        }
      )
    },
    deleteExp (index) {
      this.profile.experience.splice(index, 1)
    },
    deleteEdu (index) {
      this.profile.education.splice(index, 1)
    },
    addNewExperience () {
      var expObj =
        {
          id: this.expObjId(),
          businessName: '',
          workPeriod: 'Klicka för att välja start/slut datum',
          workTitle: '',
          competences: '',
          description: '',
          bransch: ''
        }
      this.profile.experience.push(expObj)
    },
    addNewEducation () {
      var eduObj =
        {
          id: this.eduObjID(),
          schoolName: '',
          subject: '',
          competences: '',
          eduPeriod: 'Klicka för att välja start/slut datum',
          schoolType: ''
        }
      this.profile.education.push(eduObj)
    },
    expObjId () {
      return this.profile.experience.length + new Date().getTime() + Math.random()
    },
    eduObjID () {
      return this.profile.education.length + new Date().getTime() + Math.random()
    },
    sortExperience () {
      let newArr = []
      let monthNames = ['Dec', 'Nov', 'Okt', 'Sep', 'Aug', 'Jul', 'Jun', 'Maj', 'Apr', 'Mar', 'Feb', 'Jan']
      if (this.profile.experience !== '' && this.profile.experience.length >= 1) {
        monthNames.forEach(val => {
          for (let i in this.profile.experience) {
            if (this.profile.experience[i].workPeriod.split(' ')[0] === val) {
              newArr.push(this.profile.experience[i])
            }
          }
        })
        newArr.sort((a, b) => {
          return b.workPeriod.split(' ')[1] - a.workPeriod.split(' ')[1]
        })
        for (let i in this.profile.experience) {
          if (this.profile.experience[i].workPeriod === 'Klicka för att välja start/slut datum' && this.profile.experience[i].businessName !== '' && this.profile.experience[i].workTitle !== '') {
            newArr.push(this.profile.experience[i])
          }
        }
        if (this.profile.education !== '' && this.profile.education.length >= 1) {
          let newEducationArr = []
          for (let i in this.profile.education) {
            if (this.profile.education[i].schoolName !== '' && this.profile.education[i].subject !== 'subject') {
              newEducationArr.push(this.profile.education[i])
            }
          }
          this.profile.education = newEducationArr
        }
        this.profile.experience = newArr
      }
    },
    workDateSetter () {
      // Denna hanterar datumet man väljer inne i "Date picker"
      var start = this.month1
      var end = this.month2
      var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
      var month1 = start.substring(5, 7)
      var year1 = start.substring(0, 4)
      var month2 = end.substring(5, 7)
      var year2 = end.substring(0, 4)
      var result = ''
      if (month1[0] > 0) {
        if (month2[0] > 0) {
          result = monthNames[month1 - 1] + ' ' + year1 + ' - ' + monthNames[month2 - 1] + ' ' + year2
        } else {
          result = monthNames[month1 - 1] + ' ' + year1 + ' - ' + monthNames[month2[1] - 1] + ' ' + year2
        }
      } else {
        if (month2[0] > 0) {
          result = monthNames[month1[1] - 1] + ' ' + year1 + ' - ' + monthNames[month2 - 1] + ' ' + year2
        } else {
          result = monthNames[month1[1] - 1] + ' ' + year1 + ' - ' + monthNames[month2[1] - 1] + ' ' + year2
        }
      }
      if (result.includes('undefined')) {
        result = result.replace('undefined', 'Nuvarande..')
      } else if (month1 > month2) {
        alert('Oj då! Ditt startdatum är senare än ditt slutdatum... Kanske borde du ändra det?')
      }
      if (this.eduOrWork === 0) {
        this.profile.experience[this.profileIndex].workPeriod = result
      } else {
        this.profile.education[this.profileIndex].eduPeriod = result
      }
    },
    updateProfile () {
      this.sortExperience()
      this.updatingProfile = true
      if (this.profile.experience.length === 0) {
        this.profile.experience = ''
      }
      if (this.profile.education.length === 0) {
        this.profile.education = ''
      }
      if (this.profile.competences.length === 0) {
        this.profile.competences = ''
      }
      if (this.profile.experience !== '') {
        this.profile.experience.forEach((val, index) => {
          var y = this.profile.experience[index].description
          var splitted = y.split('\n\n')
          this.profile.experience[index].descriptionArr = splitted
        })
      }
      // Uppdatera profildata
      firebase.database().ref('applicants').child(this.$store.state.yourDatabaseString + '/profileInfo/')
        .update({profil: this.profile})
      .then(res => {
        this.updatesHasBeenChanged = true
        this.updatingProfile = false
        this.changeProfilePicModal = false
        this.updateBackgroundImgModal = false
        if (this.profile.experience === '') {
          this.profile.experience = []
        }
        if (this.profile.education === '') {
          this.profile.education = []
        }
        if (this.profile.competences === '') {
          this.profile.competences = []
        }
        this.$store.commit('updateAllPresentationsWhenProfileIsUpdated')
      })
    },
    updateJSONAtPage () {
      this.profile.fullName = this.profileInfo.profil.fullName
      this.profile.description = this.profileInfo.profil.description
      this.profile.profilePic = this.profileInfo.profil.profilePic
      this.profile.backgroundImg = this.profileInfo.profil.backgroundImg
      if (this.profileInfo.profil.competences === undefined || this.profileInfo.profil.competences === '') {
        this.profile.competences = []
      } else {
        this.profile.competences = this.profileInfo.profil.competences
      }
      this.profile.title = this.profileInfo.profil.title
      this.profile.education = JSON.parse(JSON.stringify(this.profileInfo.profil.education))
      this.profile.experience = JSON.parse(JSON.stringify(this.profileInfo.profil.experience))
      this.profile.email = this.profileInfo.profil.email
      this.profile.phoneNr = this.profileInfo.profil.phoneNr
      this.profile.externLink = this.profileInfo.profil.externLink
      if (this.profile.experience === undefined || this.profile.experience === '') {
        this.profile.experience = []
      }
      if (this.profile.education === undefined || this.profile.education === '') {
        this.profile.education = []
      }
      // compareMeOriginal
      this.compareMeOriginal = JSON.stringify(this.profile)
    },
    fixaDescriptionArr () {
      // Fixa descriptionArr
      this.profile.experience.forEach((val, index) => {
        var y = this.profile.experience[index].description
        var splitted = y.split('\n\n')
        this.profile.experience[index].descriptionArr = splitted
      })
    }
  },
  mounted () {
    // Hämta profilinfo och fyll på lokala profilinfo
    if (this.$store.state.profileInfo !== 'userObject') {
      this.updateJSONAtPage()
    }
  }
}
</script>

<style>
.repeating-gradient {
    background-image: repeating-linear-gradient(-45deg,
    rgba(255,0,0,.25),
    rgba(255,0,0,.25) 5px,
    rgba(0,0,255,.25) 5px,
    rgba(0,0,255,.25) 10px
  )
  }
  .writeHover:hover {
    box-shadow: 2px 2px 2px 2px lightgrey;
    cursor: pointer;
  }
</style>
