import firebase from 'firebase/app'
import 'firebase/database'
import { store } from '@/store.js'

const db = firebase.database()

const errorMsg = (err) => console.error(err)

const ApiEvent = {
  once (callback, fb) {
    return fb.once('value', res => { callback(res) })
      .catch(errorMsg)
  },
  update (data, fb) {
    return fb.update(data)
      .catch(errorMsg)
  },
  push (data, fb) {
    return fb.push(data)
      .catch(errorMsg)
  },
  set (data, fb) {
    return fb.set(data)
      .catch(errorMsg)
  }
}

export default {
  applicants (path, event, data) {
    const fb = db.ref('applicants').child(store.state.userDbId + `/profileInfo/${path}`)
    return ApiEvent[event](data, fb)
  },
  business (path, event, data) {
    const fb = db.ref('businessAccounts').child(path)
    return ApiEvent[event](data, fb)
  },
  admin (path, event, data) {
    const fb = db.ref('admin').child(path)
    return ApiEvent[event](data, fb)
  },
  bevakningar (event, data) {
    const fb = db.ref('bevakningar')
    return ApiEvent[event](data, fb)
  }
}
