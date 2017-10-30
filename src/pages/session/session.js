var firebase = require('firebase')

function emptySession() {
	return {
		date: Date.now(),
		userData: {},
		weapon: {
			initialCharge: 0,
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
			scenarioSessions: [],
			session: emptySession(),
			sessionUsers: []
		}
	},

	methods: {
		start: function(scenario) {
			this.onSession = scenario.id !== null
			this.session.scenario = scenario.id
			this.loadScenariosSessions(scenario.id)
			this.sessionUsers = [firebase.auth().currentUser.email]
		},

		reset: function(param) {
			this.onSession = false
			this.scenarioSessions = []
			this.session = emptySession()
			this.sessionUsers = [firebase.auth().currentUser.email]
		},

		saveShots: function(user, shots) {
			this.session.userData[encodeUserEmail(user)] = {shots}
			return firebase.database().ref('sessions/' + this.session.scenario + '/' + this.session.date).set(this.session)
		},

		loadScenariosSessions: function(scenario) {
			var that = this
			firebase.database().ref('sessions/' + scenario).on('value', function(snap){
				if (snap.val() !== null) {
					that.scenarioSessions = objectToArray(snap.val()).reverse()
				}
			})
		}
	}
}