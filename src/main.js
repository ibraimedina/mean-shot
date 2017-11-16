require('./main.css')


// Dataabse initialization
var Firebase = require('firebase')
var config = require('../configs/firebase.json')
Firebase.initializeApp(config)


// Framework initialization
var Vue = require('vue')
var VueMaterial = require('vue-material')
Vue.use(VueMaterial)
var VueRouter = require('vue-router')
Vue.use(VueRouter)
Vue.material.registerTheme('default', require('../configs/vue-material-default.json'))


// Global components
Vue.component('ms-header', require('components/header/header.vue'))
Vue.component('ms-login', require('components/login/login.vue'))
Vue.component('ms-scenario', require('components/scenario/scenario.vue'))
Vue.component('ms-shots', require('components/shots/shots.vue'))
Vue.component('ms-review', require('components/review/review.vue'))
Vue.component('ms-weapon', require('components/weapon/weapon.vue'))
Vue.component('ms-stats', require('components/stats/stats.vue'))
Vue.component('ms-guests', require('components/guests/guests.vue'))
Vue.component('ms-summary', require('components/summary/summary.vue'))

// Global pages
var Home = require('pages/home/home.vue')
var Session = require('pages/session/session.vue')

// App routes
const router = new VueRouter({
  mode: 'history',
  routes: [
    {path: '/',         component: Home},
    {path: '/session/:id(\\d+)?',  component: Session}
  ]
})

// App initialization
var Main = require('./main.vue')
var App = new Vue({
  router,
  el: '#app',
  render(h) { return h(Main) }
})
