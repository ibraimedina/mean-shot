require('./main.css')


// Dataabse initialization
var Firebase = require('firebase')
var config = require('../configs/firebase.json')
Firebase.initializeApp(config)


// Framework initialization
var Vue = require('vue')
var VueMaterial = require('vue-material')
Vue.use(VueMaterial)
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

// App initialization
var Home = require('pages/home/home.vue')
var Session = require('pages/session/session.vue')

const routes = {
  '/': Home,
  '/session': Session,
}

var App = new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || Home
    }
  },
  render (h) { return h(this.ViewComponent) }
})
