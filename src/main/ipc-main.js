import path from 'path'
import { ipcMain, app } from 'electron'
import Datastore from 'nedb'


const dir = app.getPath('userData')
let db = new Datastore({
  filename: path.join(dir, 'user-color.db'),
  autoload: true
})


ipcMain.on('loadDB', event => {
  db.find({}, (err, docs) => {
    if (err) {
      console.error(err)
    }

    event.sender.send('loadedDB', docs)
  })
})


ipcMain.on('addUser', (event, userName, userColor) => {
  console.log(userName, userColor)
  db.insert({
    name: userName,
    color: userColor,
  }, (err, newUser) => {
    if (err) {
      console.error(err)
    }
    event.sender.send('addedUser', newUser)
  })
})