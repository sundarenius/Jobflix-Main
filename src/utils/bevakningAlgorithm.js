export default (response, businessDBId, userDBId, adminNotification, campaign, lookForBevUpdateFb, bevakningDBId, notification) => {
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
                lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification, true)
              }
            } else if (res[i][x].minExp === '1 år') {
              if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 1) {
                lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
              }
            } else if (res[i][x].minExp === '2 år') {
              if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 2) {
                lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
              }
            } else if (res[i][x].minExp === '3 år') {
              if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 3) {
                lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
              }
            } else if (res[i][x].minExp === '4 år') {
              if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 4) {
                lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
              }
            } else if (res[i][x].minExp === '5 år') {
              if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 5) {
                lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
              }
            } else if (res[i][x].minExp === '8 år') {
              if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 8) {
                lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
              }
            } else if (res[i][x].minExp === '10 år eller mer') {
              if (campaign.highestEducation >= 0 && campaign.yearsExperience >= 10) {
                lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
              }
            }
            // Hit upp
          } else if (res[i][x].utbildning === 'Gymnasium') {
            if (res[i][x].minExp === 'Visa alla') {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '1 år') {
            if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 1) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '2 år') {
            if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 2) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '3 år') {
            if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 3) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '4 år') {
            if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 4) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '5 år') {
            if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 5) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '8 år') {
            if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 8) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '10 år eller mer') {
            if (campaign.highestEducation >= 1 && campaign.yearsExperience >= 10) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].utbildning === 'Yrkeshögskola') {
            if (res[i][x].minExp === 'Visa alla') {
              if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 0) {
                lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
              }
            }
            // Till HIT
          } else if (res[i][x].minExp === '1 år') {
            if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 1) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '2 år') {
            if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 2) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '3 år') {
            if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 3) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '4 år') {
            if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 4) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '5 år') {
            if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 5) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '8 år') {
            if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 8) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '10 år eller mer') {
            if (campaign.highestEducation >= 2 && campaign.yearsExperience >= 10) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].utbildning === 'Högskola') {
            if (res[i][x].minExp === 'Visa alla') {
              if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 0) {
                lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
              }
            }
          } else if (res[i][x].minExp === '1 år') {
            if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 1) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '2 år') {
            if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 2) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '3 år') {
            if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 3) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '4 år') {
            if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 4) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '5 år') {
            if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 5) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '8 år') {
            if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 8) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          } else if (res[i][x].minExp === '10 år eller mer') {
            if (campaign.highestEducation >= 3 && campaign.yearsExperience >= 10) {
              lookForBevUpdateFb(newBusinessDBId, newUserDBId, campaign, bevakningDBId, notification, adminNotification)
            }
          }
        }
      }
    }
  }
}
