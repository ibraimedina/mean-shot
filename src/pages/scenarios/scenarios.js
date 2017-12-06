var firebase = require('firebase')

function emptySession() {
	return {
		date: null, //
		userData: {},
		weapon: {
			initialCharge: 0,
			chargeType: ''
		},
	}
}

function objectToArray(obj) {
	let array = []
	for (k in obj) {
		array.push(obj[k])
	}
	return array
}

function encodeUserEmail(email) {
	return encodeURIComponent(email).replace(/\./g, '%2E')
}

module.exports = {
	data: function(){
		return {
			onSession: false,
			scenarios: [],
			scenarioSessions: [],
			session: emptySession(),
			sessionUsers: [],
			user: null
		}
	},

	mounted: function() {
		this.load(this.$route.params.id, this.$route.params.date)
	},

	watch: {
		'$route': function(to, from) {
			this.reset()
			this.load(to.params.id, to.params.date)	
		}
	},

	methods: {
		start: function(scenario) {
			this.onSession = scenario.id !== null
			this.session.date = Date.now()
			this.session.scenario = scenario.id
			this.loadScenarioSessions(scenario.id)
			this.sessionUsers = [firebase.auth().currentUser.email]
		},

		reset: function(param) {
			this.onSession = false
			this.scenarios = []
			this.scenarioSessions = []
			this.session = emptySession()
			this.sessionUsers = [firebase.auth().currentUser.email]
		},

		load: function(id, date) {
			this.user = firebase.auth().currentUser

			if (date) {
				this.loadSession(id, date)
			} else {
				if (id) this.loadScenarioSessions(id)
				this.loadScenarios()
			}
		},

		loadScenarios: function() {
			let that = this
			firebase.database().ref('scenarios').on('value', function(snap) {
				that.reset()
				if (snap.val() !== null)
					that.scenarios = snap.val()
			})
		},

		loadSession: function(id, date) {
			let that = this
			firebase.database().ref('sessions/' + id + '/' + date).on('value', function(snap) {
				that.reset()
				if (snap.val() !== null)
					that.session = snap.val()
			})
		},

		loadScenarioSessions: function(scenario) {
			var that = this
			firebase.database().ref('sessions/' + scenario).on('value', function(snap){
				if (snap.val() !== null) {
					that.scenarioSessions = objectToArray(snap.val()).reverse()
				}
			})
		},

		saveShots: function(user, shots) {
			this.session.userData[encodeUserEmail(user)] = {shots}
			return firebase.database().ref('sessions/' + this.session.scenario + '/' + this.session.date)
				.set(this.session)
		}
	}
}