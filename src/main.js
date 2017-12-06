console.debug('=== STARTING UP MEAN-SHOT APPLICATION ===')


// Style
require('./main.css')


// Database
let Firebase = require('firebase')
let config = require('../configs/firebase.json')
Firebase.initializeApp(config)


// Framework
let Vue = require('vue')
let VueMaterial = require('vue-material')
Vue.use(VueMaterial)
Vue.material.registerTheme('default', require('../configs/vue-material-default.json'))
let VueRouter = require('vue-router')
Vue.use(VueRouter)

// Global components
Vue.component('ms-guests', require('components/guests/guests.vue'))
Vue.component('ms-header', require('components/header/header.vue'))
Vue.component('ms-login', require('components/login/login.vue'))
Vue.component('ms-review', require('components/review/review.vue'))
Vue.component('ms-scenario', require('components/scenario/scenario.vue'))
Vue.component('ms-scenarios', require('components/scenarios/scenarios.vue'))
Vue.component('ms-session', require('components/session/session.vue'))
Vue.component('ms-shot', require('components/shot/shot.vue'))
Vue.component('ms-shots', require('components/shots/shots.vue'))
Vue.component('ms-stats', require('components/stats/stats.vue'))
Vue.component('ms-summary', require('components/summary/summary.vue'))
Vue.component('ms-weapon', require('components/weapon/weapon.vue'))

// Global pages
let HomePage = require('pages/home/home.vue')
let ScenariosPage = require('pages/scenarios/scenarios.vue')

// App routes
const router = new VueRouter({
	mode: 'history',
	routes: [
		{path: '/', component: HomePage},
		{path: '/scenarios', component: ScenariosPage},
		{path: '/scenarios/:id([-\\w]+)/:date(\\d+)?', component: ScenariosPage, meta: {requiresAuth: true}}
	]
})
router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (Firebase.auth().currentUser) {
			next()
		} else {
			next({path: '/'})
		}
	} else {
		next()
	}
})


// App initialization
Firebase.auth().onAuthStateChanged(function() { // Just to know that auth() is ready :( #TODO
	let Main = require('./main.vue')
	let App = new Vue({
		router,
		el: '#app',
		render(h) { return h(Main) }
	})
})

