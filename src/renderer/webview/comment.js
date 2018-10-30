const ipcRenderer = require('electron').ipcRenderer

let users = []

ipcRenderer.on('loadedDB', (event, docs) => {
  console.log(docs)
  users = docs
})

ipcRenderer.on('addedUser', (event, newUser) => {
  console.log(newUser)
  users.push(newUser)
})

window.onload = () => {
  ipcRenderer.send('loadDB')
  let comments = document.getElementsByTagName('yt-live-chat-text-message-renderer')
  console.log(comments)
  setInterval(() => {
    Array.from(comments).filter(v => {
      let authorName = v.querySelector('#author-name').textContent
      return users.map(v => v.name).includes(authorName)
    }).forEach(v => {
      let authorName = v.querySelector('#author-name').textContent
      v.style.backgroundColor = users.filter(v => v.name === authorName)[0].color
    })
  }, 500)
}