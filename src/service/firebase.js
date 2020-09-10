import firebase from 'firebase/app'
import 'firebase/database'
import { store } from '@/store.js'

const db = () => firebase.database()
const storage = () => firebase.storage()

const errorMsg = (err) => console.error(err)

const ApiEvent = {
  once (callback, fb, then) {
    return fb.once('value', res => { callback(res) })
      .then(then)
      .catch(errorMsg)
  },
  update (data, fb, then) {
    return fb.update(data)
      .then(then)
      .catch(errorMsg)
  },
  push (data, fb, then) {
    return fb.push(data)
      .then(then)
      .catch(errorMsg)
  },
  set (data, fb, then) {
    return fb.set(data)
      .then(then)
      .catch(errorMsg)
  },
  remove (data, fb, then) {
    return fb.remove()
      .then(then)
      .catch(errorMsg)
  }
}

export default {
  onChange (ref, callback) {
    return db().ref(ref).child(store.state.userDbId).on('value', callback)
  },
  applicants (p, event, data, then) {
    const path = p || ''
    const fb = db().ref('applicants').child(store.state.userDbId + `/profileInfo/${path}`)
    return ApiEvent[event](data, fb, then)
  },
  business (path, event, data) {
    const fb = db().ref('businessAccounts').child(path)
    return ApiEvent[event](data, fb)
  },
  admin (path, event, data) {
    const fb = db().ref('admin').child(path)
    return ApiEvent[event](data, fb)
  },
  bevakningar (event, data) {
    const fb = db().ref('bevakningar')
    return ApiEvent[event](data, fb)
  },
  presentations (path, event, data) {
    const fb = db().ref('presentations').child(path)
    return ApiEvent[event](data, fb)
  },
  presentationsOffical (path, event, data) {
    const fb = db().ref('presentationsOffical').child(path)
    return ApiEvent[event](data, fb)
  },
  ads (event, callback) {
    const fb = db().ref('ads')
    return ApiEvent[event](callback, fb)
  },
  storage (fileName) {
    const uniqueId = new Date().getTime().toString()
    return storage().ref(`official-applicantImages/${uniqueId}/${fileName}`)
  },
  officialVideos (fileName) {
    const uniqueId = new Date().getTime().toString()
    return db().ref(`official-videos/${uniqueId}/${fileName}`)
  },
  videoSnapshots (fileName) {
    return db().ref('video-snapshots').child(fileName)
  }
}
