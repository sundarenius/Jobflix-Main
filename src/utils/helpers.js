import Api from '@/service/firebase'
import bevakningAlgorithm from './bevakningAlgorithm'

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
