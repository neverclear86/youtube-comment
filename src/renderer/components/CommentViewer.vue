<template>
  <div id="app">

    <el-input v-model="url">
      <el-button slot="append" @click="connectStream">Connect</el-button>
    </el-input>
    <el-input v-model="username">
      <el-color-picker v-model="userColor" slot="prepend"></el-color-picker>
      <el-button slot="append" @click="addUser">Add</el-button>
    </el-input>

    <webview :src="chatUrl" v-bind:preload="preload()">

    </webview>

  </div>
</template>

<script>
  import path from 'path'
  import { ipcRenderer } from 'electron'

  export default {
    name: 'CommentViewer',
    data() {
      return {
        url: "",
        chatUrl: "",
        username: "",
        userColor: "",
      }
    },
    mounted() {
      const webview = document.querySelector('webview')
      webview.addEventListener('dom-ready', () => {
        webview.openDevTools()
      })

      webview.addEventListener('ipc-message', event => {
        switch (event.channel) {
          case 'loadDB':
            ipcRenderer.send('loadDB')
            break
        }
      })

      ipcRenderer.on('loadedDB', (event, docs) => {
        webview.send('loadedDB', docs)
      })

      ipcRenderer.on('addedUser', (event, newUser) => {
        webview.send('addedUser', newUser)
      })
    },
    methods: {
      connectStream() {
        // TODO /html/head/meta[@property='og:image']とかから配信IDとれる
        if (!this.url.match(/https:\/\/www.youtube.com\/watch\?.*v=.*/)) {
          return
        }
        let v = this.url.match(/v=.*?(&|$)/)[0]
        this.chatUrl = 'https://www.youtube.com/live_chat?is_popout=1&' + v
      },
      addUser() {
        ipcRenderer.send('addUser', this.username, this.userColor)
      },
      preload() {
        return `file:${path.resolve(__dirname, '../webview', 'comment.js')}`
      }
    }
  }
</script>

<style >
  html, body, #app{
    margin: 0;
    height: 100%;
    width: 100%;
  }
  webview {
    position: absolute;
    top: 84px;
    left: 0;
    right: 0;
    bottom: 0;
  }

</style>