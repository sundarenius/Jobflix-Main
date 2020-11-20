import Api from '@/service/firebase'
import bevakningAlgorithm from './bevakningAlgorithm'
import { store as Store } from '@/store'

const lookForBevUpdateFb = (newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification, sortAll = false) => {
  let realNotificationArr
  Api.business(
    `${JSON.parse(newBusinessDBId)}/corpInfo/users/${JSON.parse(newUserDBId)}/user`,
    'once',
    response => {
      let innerRes = response.val()
      for (let y in innerRes.bevakningar) {
        if (sortAll) {
          if ((innerRes.bevakningar[y].bransch === campaign.bransch) && (campaign.underCategory.includes(innerRes.bevakningar[y].underCategory) || innerRes.bevakningar[y].underCategory === '' || innerRes.bevakningar[y].underCategory === innerRes.bevakningar[y].bransch) && (campaign.region.includes(innerRes.bevakningar[y].region) || innerRes.bevakningar[y].region === 'Hela Sverige' || campaign.region.includes('Hela Sverige'))) {
            bevakningDBId = y
            Api.business(
              `${JSON.parse(newBusinessDBId)}/corpInfo/users/${JSON.parse(newUserDBId)}/user/bevakningar/${bevakningDBId}/presentations`,
              'push',
              campaign
            )
          }
        } else {
          if (innerRes.bevakningar[y].id === campaign.id) {
            bevakningDBId = y
          }
        }
      }
      // Dunka upp en notifikation på detta
      innerRes.events.notifications[0] = (innerRes.events.notifications[0] + 1)
      innerRes.events.notifications.splice(1, 0, notification)
      realNotificationArr = innerRes.events.notifications
      Api.business(
        `${JSON.parse(newBusinessDBId)}/corpInfo/users/${JSON.parse(newUserDBId)}/user/events/'`,
        'update',
        { notifications: realNotificationArr }
      )
      // TILLFÄLLIG ADMINNOTIFIKATION TILL VI LÖSER AUTOMATISKA MAIL *****
      adminNotification.emailTo = innerRes.email
      adminNotification.businessUser = innerRes.fullName
      adminNotification.id = new Date().getTime() + 'ba'
      Api.admin(
        'notifications',
        'push',
        adminNotification
      )
    })
}

export const lookForBevakningar = (state, campaign) => {
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
  Api.bevakningar(
    'once',
    (response) => {
      bevakningAlgorithm(response, businessDBId, userDBId, adminNotification, campaign, lookForBevUpdateFb, bevakningDBId, notification)
    }
    )
}

export const sendCampaignToCampaingsNode = () => {
  const state = Store.state
  Api.presentations(
    state.user.id,
    'set',
    state.profileInfo.campaigns
  )
  const campaigns = JSON.stringify(state.profileInfo.campaigns)
  const presentationsOfficial = JSON.parse(campaigns)
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
  Api.presentationsOffical(
    state.user.id,
    'set',
    presentationsOfficial
  )
}

export const onLoadFireBaseData = (ctx, response) => {
  const res = response.val()
  ctx.$store.dispatch('setOnChangeData', {
    profileInfo: res.profileInfo,
    getPureProfileInfo: res.profileInfo.profil,
    notifications: res.profileInfo.events.notifications.shift(),
    notificationsArr: res.profileInfo.events.notifications
  })
  ctx.messagesObj = res.profileInfo.events.messages
  var newMessages = 0
  for (var m in res.profileInfo.events.messages) {
    if (res.profileInfo.events.messages[m].hasOwnProperty('newMessageForApplicant')) {
      newMessages = (newMessages + res.profileInfo.events.messages[m].newMessageForApplicant)
      if (ctx.messageWho !== '') {
        if (res.profileInfo.events.messages[m].businessUserId === ctx.messageWho.businessUserId) {
          ctx.theMessageConversion = res.profileInfo.events.messages[m]
          break
        }
      }
    }
  }
  ctx.messages = newMessages
  // Styr upp requests
  let requestLength = 0
  let newRequestArr = []
  for (var x in res.profileInfo.events.requests) {
    if (res.profileInfo.events.requests[x].accepted === 0) {
      requestLength = (requestLength + 1)
      if (res.profileInfo.events.requests[x].hasOwnProperty('accepted')) {
        newRequestArr.push(res.profileInfo.events.requests[x])
      }
    }
  }
  ctx.requests = requestLength
  ctx.requestsArr = newRequestArr
  var meetingEventsArr = []
  ctx.meetingEvents = []
  ctx.meetingEventDates = []
  // Fixa in färdiga appointments
  for (var i in res.profileInfo.events.appointments) {
    if (res.profileInfo.events.appointments[i].accepted === 1) {
      meetingEventsArr.push(res.profileInfo.events.appointments[i])
      ctx.meetingEventDates.push(res.profileInfo.events.appointments[i].acceptedTime.date)
    }
  }
  ctx.meetingEvents = meetingEventsArr
  ctx.$store.commit('setMeetingEvents', meetingEventsArr)
  if (this.count === 0) {
    this.updateLastLogin()
  }
  this.count++
}
