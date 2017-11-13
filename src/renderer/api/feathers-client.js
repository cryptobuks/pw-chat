// import path from 'path'
import feathers from 'feathers/client'
import hooks from 'feathers-hooks'
import socketio from 'feathers-socketio/client'
import auth from 'feathers-authentication-client'
import authManagementService from 'feathers-authentication-management'
import io from 'socket.io-client'
// import rest from 'feathers-rest/client'
// import axios from 'axios'
// import storage from 'electron-json-storage'

// const dataPath = storage.getDataPath()

const APP_URL = 'https://potential-waffle-chat.herokuapp.com' // 'http://localhost:3030'

// console.log('App STorage Path', dataPath) // eslint-disable-line
// const { remote } = require('electron')
// const { app } = remote

// remote.getCurrentWindow().on('close', function() {
//   storage.set('feathers', JSON.parse())
// });

const socket = io(APP_URL, { transports: ['websocket'] })

const feathersClient = feathers()
  .configure(hooks())
  .configure(socketio(socket))
  // .configure(rest(APP_URL).axios(axios))
  .configure(auth({ storage: window.localStorage }))
  .configure(authManagementService())

export default feathersClient

export function getService (url) {
  return feathersClient.service(url)
}
