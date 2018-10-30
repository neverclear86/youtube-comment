import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'comment-viewer',
      component: require('@/components/CommentViewer').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
