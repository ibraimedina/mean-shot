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
var Header = require('components/header/header.vue')
Vue.component('ms-header', Header)
var Login = require('components/login/login.vue')
Vue.component('ms-login', Login)
var Scenario = require('components/scenario/scenario.vue')
Vue.component('ms-scenario', Scenario)

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