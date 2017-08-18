var Vue = require('vue')
var Home = require('./home/home.vue')

new Vue({
  el: '#app',
  render: h => h(Home)
})
