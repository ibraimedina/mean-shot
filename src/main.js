require('./main.css')

// Dataabse initialization
var firebase = require('firebase')
var config = require('../configs/firebase.json')
firebase.initializeApp(config)

// Framework initialization
var Vue = require('vue')
var VueMaterial = require('vue-material')
Vue.use(VueMaterial)
Vue.material.registerTheme('default', require('../configs/vue-material-default.json'))

// Global components
var Header = require('./header/header.vue')
Vue.component('ms-header', Header)

// App initialization
var Home = require('./home/home.vue')
var App = new Vue({
  el: '#app',
  render: ce => ce(Home)
})
