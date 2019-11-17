import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'

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
    yourDatabaseString: '',
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
    welcomeModalCommit (state, payload) {
      state.profileInfo.welcomeModal = payload
    },
    notificationsCommit (state, payload) {
      state.notifications = payload
    },
    updateAllPresentationsWhenProfileIsUpdated (state) {
      let update = 0
      if (Object.keys(state.profileInfo.campaigns).length > 1) {
        for (let i in state.profileInfo.campaigns) {
          if (state.profileInfo.campaigns[i].active && state.profileInfo.campaigns[i].hasOwnProperty('profile')) {
            update = 1
            state.profileInfo.campaigns[i].profile = state.profileInfo.profil
          }
        }
      }
      if (update === 1) {
        store.commit('sendCampaignToCampaingsNode')
      }
    },
    sendCampaignToCampaingsNode (state) {
      firebase.database().ref('presentations').child(state.user.id)
        .set(state.profileInfo.campaigns)
      const x = JSON.stringify(state.profileInfo.campaigns)
      const presentationsOfficial = JSON.parse(x)
      for (var i in presentationsOfficial) {
        if (presentationsOfficial[i].hasOwnProperty('profile')) {
          presentationsOfficial[i].profile.fullName = 'Censurerat Namn'
          presentationsOfficial[i].profile.email = 'xx'
          presentationsOfficial[i].profile.phoneNr = 'xx'
          presentationsOfficial[i].name = 'Censurerat Namn'
          presentationsOfficial[i].email = 'xx'
          presentationsOfficial[i].userId = 'xx'
          presentationsOfficial[i].phoneNr = 'xx'
        }
      }
      firebase.database().ref('presentationsOffical').child(state.user.id)
        .set(presentationsOfficial)
    },
    lookForBevakningarStore (state, campaign) {
      let adminNotification
      let businessDBId
      let userDBId
      let bevakningDBId
      let notification = {
        msg: 'Du har fått en ny matchning i dina bevakningar. Gå till "Bevakningar" för att se den.',
        id: new Date().getTime(),
        pic: state.profileInfo.profil.profilePic,
        time: new Date().toISOString().substr(0, 19).replace('T', ' ')
      }
      let realNotificationArr
      firebase.database().ref('bevakningar').once('value', response => {
        const res = response.val()
        for (var i in res) {
          for (var x in res[i]) {
            if (res[i][x].hasOwnProperty('businessDBId')) {
              businessDBId = res[i][x].businessDBId
              userDBId = res[i][x].userDBId
              adminNotification = {
                emailTo: '',
                corp: 'Unknown(bev), lista ut med mailen',
                msg: 'En träff på bevakning',
                businessUser: '',
                notificationTo: 'Business',
                time: new Date().toISOString().substr(0, 19).replace('T', ' '),
                id: ''
              }
              if ((res[i][x].bransch === campaign.bransch) && (campaign.underCategory.includes(res[i][x].underCategory) || res[i][x].underCategory === '' || res[i][x].underCategory === res[i][x].bransch) && (campaign.region.includes(res[i][x].region) || res[i][x].region === 'Hela Sverige' || campaign.region.includes('Hela Sverige'))) {
                // OM den passerar så lägg till filter för erfarenhetsnivå och utbildning
                let newBusinessDBId = JSON.stringify(businessDBId)
                let newUserDBId = JSON.stringify(userDBId)
                if (res[i][x].utbildning === 'Alla' || res[i][x].utbildning === 'Grundskola') {
                  if (res[i][x].minExp === 'Visa alla') {
                    if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 0) {
                      // När den når hit så forstätter den med andra och uppdaterar businessDBId, se till och behålla variabel värdet
                      firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                        .once('value', response => {
                          let innerRes = response.val()
                          for (let y in innerRes.bevakningar) {
                            if ((innerRes.bevakningar[y].bransch === campaign.bransch) && (campaign.underCategory.includes(innerRes.bevakningar[y].underCategory) || innerRes.bevakningar[y].underCategory === '' || innerRes.bevakningar[y].underCategory === innerRes.bevakningar[y].bransch) && (campaign.region.includes(innerRes.bevakningar[y].region) || innerRes.bevakningar[y].region === 'Hela Sverige' || campaign.region.includes('Hela Sverige'))) {
                              bevakningDBId = y
                              firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                                .push(campaign)
                            }
                          }
                          // Dunka upp en notifikation på detta
                          innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                          innerRes.events.notifications.splice(1, 0, notification)
                          realNotificationArr = innerRes.events.notifications
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                            .update({notifications: realNotificationArr})
                          // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                          adminNotification.emailTo = innerRes.email
                          adminNotification.businessUser = innerRes.fullName
                          adminNotification.id = new Date().getTime() + 'ba'
                          firebase.database().ref('admin').child('notifications')
                            .push(adminNotification)
                        })
                    }
                  } else if (res[i][x].minExp === '1 år') {
                    if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 1) {
                      firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                        .once('value', response => {
                          let innerRes = response.val()
                          for (let y in innerRes.bevakningar) {
                            if (innerRes.bevakningar[y].id === campaign.id) {
                              bevakningDBId = y
                            }
                          }
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                            .push(campaign)
                          // Dunka upp en notifikation på detta
                          innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                          innerRes.events.notifications.splice(1, 0, notification)
                          realNotificationArr = innerRes.events.notifications
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                            .update({notifications: realNotificationArr})
                          // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                          adminNotification.emailTo = innerRes.email
                          adminNotification.businessUser = innerRes.fullName
                          adminNotification.id = new Date().getTime() + 'ba'
                          firebase.database().ref('admin').child('notifications')
                            .push(adminNotification)
                        })
                    }
                  } else if (res[i][x].minExp === '2 år') {
                    if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 2) {
                      firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                        .once('value', response => {
                          let innerRes = response.val()
                          for (let y in innerRes.bevakningar) {
                            if (innerRes.bevakningar[y].id === campaign.id) {
                              bevakningDBId = y
                            }
                          }
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                            .push(campaign)
                          // Dunka upp en notifikation på detta
                          innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                          innerRes.events.notifications.splice(1, 0, notification)
                          realNotificationArr = innerRes.events.notifications
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                            .update({notifications: realNotificationArr})
                          // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                          adminNotification.emailTo = innerRes.email
                          adminNotification.businessUser = innerRes.fullName
                          adminNotification.id = new Date().getTime() + 'ba'
                          firebase.database().ref('admin').child('notifications')
                            .push(adminNotification)
                        })
                    }
                  } else if (res[i][x].minExp === '3 år') {
                    if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 3) {
                      firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                        .once('value', response => {
                          let innerRes = response.val()
                          for (let y in innerRes.bevakningar) {
                            if (innerRes.bevakningar[y].id === campaign.id) {
                              bevakningDBId = y
                            }
                          }
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                            .push(campaign)
                          // Dunka upp en notifikation på detta
                          innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                          innerRes.events.notifications.splice(1, 0, notification)
                          realNotificationArr = innerRes.events.notifications
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                            .update({notifications: realNotificationArr})
                          // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                          adminNotification.emailTo = innerRes.email
                          adminNotification.businessUser = innerRes.fullName
                          adminNotification.id = new Date().getTime() + 'ba'
                          firebase.database().ref('admin').child('notifications')
                            .push(adminNotification)
                        })
                    }
                  } else if (res[i][x].minExp === '4 år') {
                    if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 4) {
                      firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                        .once('value', response => {
                          let innerRes = response.val()
                          for (let y in innerRes.bevakningar) {
                            if (innerRes.bevakningar[y].id === campaign.id) {
                              bevakningDBId = y
                            }
                          }
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                            .push(campaign)
                          // Dunka upp en notifikation på detta
                          innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                          innerRes.events.notifications.splice(1, 0, notification)
                          realNotificationArr = innerRes.events.notifications
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                            .update({notifications: realNotificationArr})
                          // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                          adminNotification.emailTo = innerRes.email
                          adminNotification.businessUser = innerRes.fullName
                          adminNotification.id = new Date().getTime() + 'ba'
                          firebase.database().ref('admin').child('notifications')
                            .push(adminNotification)
                        })
                    }
                  } else if (res[i][x].minExp === '5 år') {
                    if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 5) {
                      firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                        .once('value', response => {
                          let innerRes = response.val()
                          for (let y in innerRes.bevakningar) {
                            if (innerRes.bevakningar[y].id === campaign.id) {
                              bevakningDBId = y
                            }
                          }
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                            .push(campaign)
                          // Dunka upp en notifikation på detta
                          innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                          innerRes.events.notifications.splice(1, 0, notification)
                          realNotificationArr = innerRes.events.notifications
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                            .update({notifications: realNotificationArr})
                          // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                          adminNotification.emailTo = innerRes.email
                          adminNotification.businessUser = innerRes.fullName
                          adminNotification.id = new Date().getTime() + 'ba'
                          firebase.database().ref('admin').child('notifications')
                            .push(adminNotification)
                        })
                    }
                  } else if (res[i][x].minExp === '8 år') {
                    if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 8) {
                      firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                        .once('value', response => {
                          let innerRes = response.val()
                          for (let y in innerRes.bevakningar) {
                            if (innerRes.bevakningar[y].id === campaign.id) {
                              bevakningDBId = y
                            }
                          }
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                            .push(campaign)
                          // Dunka upp en notifikation på detta
                          innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                          innerRes.events.notifications.splice(1, 0, notification)
                          realNotificationArr = innerRes.events.notifications
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                            .update({notifications: realNotificationArr})
                          // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                          adminNotification.emailTo = innerRes.email
                          adminNotification.businessUser = innerRes.fullName
                          adminNotification.id = new Date().getTime() + 'ba'
                          firebase.database().ref('admin').child('notifications')
                            .push(adminNotification)
                        })
                    }
                  } else if (res[i][x].minExp === '10 år eller mer') {
                    if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 10) {
                      firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                        .once('value', response => {
                          let innerRes = response.val()
                          for (let y in innerRes.bevakningar) {
                            if (innerRes.bevakningar[y].id === campaign.id) {
                              bevakningDBId = y
                            }
                          }
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                            .push(campaign)
                          // Dunka upp en notifikation på detta
                          innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                          innerRes.events.notifications.splice(1, 0, notification)
                          realNotificationArr = innerRes.events.notifications
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                            .update({notifications: realNotificationArr})
                          // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                          adminNotification.emailTo = innerRes.email
                          adminNotification.businessUser = innerRes.fullName
                          adminNotification.id = new Date().getTime() + 'ba'
                          firebase.database().ref('admin').child('notifications')
                            .push(adminNotification)
                        })
                    }
                  }
                  // Hit upp
                } else if (res[i][x].utbildning === 'Gymnasium') {
                  if (res[i][x].minExp === 'Visa alla') {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '1 år') {
                  if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 1) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '2 år') {
                  if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 2) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '3 år') {
                  if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 3) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '4 år') {
                  if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 4) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '5 år') {
                  if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 5) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '8 år') {
                  if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 8) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '10 år eller mer') {
                  if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 10) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].utbildning === 'Yrkeshögskola') {
                  if (res[i][x].minExp === 'Visa alla') {
                    if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 0) {
                      firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                        .once('value', response => {
                          let innerRes = response.val()
                          for (let y in innerRes.bevakningar) {
                            if (innerRes.bevakningar[y].id === campaign.id) {
                              bevakningDBId = y
                            }
                          }
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                            .push(campaign)
                          // Dunka upp en notifikation på detta
                          innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                          innerRes.events.notifications.splice(1, 0, notification)
                          realNotificationArr = innerRes.events.notifications
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                            .update({notifications: realNotificationArr})
                          // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                          adminNotification.emailTo = innerRes.email
                          adminNotification.businessUser = innerRes.fullName
                          adminNotification.id = new Date().getTime() + 'ba'
                          firebase.database().ref('admin').child('notifications')
                            .push(adminNotification)
                        })
                    }
                  }
                  // Till HIT
                } else if (res[i][x].minExp === '1 år') {
                  if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 1) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '2 år') {
                  if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 2) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '3 år') {
                  if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 3) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '4 år') {
                  if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 4) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '5 år') {
                  if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 5) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '8 år') {
                  if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 8) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '10 år eller mer') {
                  if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 10) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].utbildning === 'Högskola') {
                  if (res[i][x].minExp === 'Visa alla') {
                    if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 0) {
                      firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                        .once('value', response => {
                          let innerRes = response.val()
                          for (let y in innerRes.bevakningar) {
                            if (innerRes.bevakningar[y].id === campaign.id) {
                              bevakningDBId = y
                            }
                          }
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                            .push(campaign)
                          // Dunka upp en notifikation på detta
                          innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                          innerRes.events.notifications.splice(1, 0, notification)
                          realNotificationArr = innerRes.events.notifications
                          firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                            .update({notifications: realNotificationArr})
                          // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                          adminNotification.emailTo = innerRes.email
                          adminNotification.businessUser = innerRes.fullName
                          adminNotification.id = new Date().getTime() + 'ba'
                          firebase.database().ref('admin').child('notifications')
                            .push(adminNotification)
                        })
                    }
                  }
                } else if (res[i][x].minExp === '1 år') {
                  if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 1) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '2 år') {
                  if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 2) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '3 år') {
                  if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 3) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '4 år') {
                  if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 4) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '5 år') {
                  if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 5) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '8 år') {
                  if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 8) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                } else if (res[i][x].minExp === '10 år eller mer') {
                  if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 10) {
                    firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user')
                      .once('value', response => {
                        let innerRes = response.val()
                        for (let y in innerRes.bevakningar) {
                          if (innerRes.bevakningar[y].id === campaign.id) {
                            bevakningDBId = y
                          }
                        }
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/bevakningar/' + bevakningDBId + '/presentations')
                          .push(campaign)
                        // Dunka upp en notifikation på detta
                        innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
                        innerRes.events.notifications.splice(1, 0, notification)
                        realNotificationArr = innerRes.events.notifications
                        firebase.database().ref('businessAccounts').child(JSON.parse(newBusinessDBId) + '/corpInfo/users/' + JSON.parse(newUserDBId) + '/user/events/')
                          .update({notifications: realNotificationArr})
                        // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
                        adminNotification.emailTo = innerRes.email
                        adminNotification.businessUser = innerRes.fullName
                        adminNotification.id = new Date().getTime() + 'ba'
                        firebase.database().ref('admin').child('notifications')
                          .push(adminNotification)
                      })
                  }
                }
              }
            }
          }
        }
      })
      .catch(function (error) {
        console.log(error.message)
      })
    }
  },
  actions: {
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
      if (state.profileInfo !== '' && state.yourDatabaseString !== '') {
        return state.profileInfo.welcomeModal
      }
    }
  }
})
