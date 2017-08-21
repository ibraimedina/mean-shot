require('./main.css')

// Framework initialization
var Vue = require('vue')
var VueMaterial = require('vue-material')
Vue.use(VueMaterial)
Vue.material.registerTheme('default', {
  primary: {
  	color: 'cyan',
  	hue: 800,
  },
  accent: {
  	color: 'orange',
  	hue: 500,
  },
  warn: {
  	color: 'red',
  	hue: 500,
  }
})

// Global components
var Header = require('./header/header.vue')
Vue.component('ms-header', Header)

// App initialization
var Home = require('./home/home.vue')
var App = new Vue({
  el: '#app',
  render: ce => ce(Home)
})
