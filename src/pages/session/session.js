var firebase = require('firebase')

function emptySession() {
	return {
		date: Date.now(),
		weapon: {
			initialCharge: 0,
		},
	}
}

module.exports = {
	data: function(){
		return {
			onSession: false,
			scenarioSessions: [],
			session: emptySession(),
		}
	},

	methods: {
		start: function(scenario) {
			console.info("Let's get started", scenario)
			this.onSession = scenario.id !== null
			this.session.scenario = scenario.id
			this.loadScenariosSessions(scenario.id)
		},

		reset: function(param) {
			console.info("Ooh... do it again", param)
			this.onSession = false
			this.scenarioSessions = []
			this.session = emptySession()
		},

		saveShots: function(shots) {
			this.session.shots = shots;
			return firebase.database().ref('sessions/' + this.session.scenario + '/' + this.session.date).set(this.session)
		},

		loadScenariosSessions: function(scenario) {
			var that = this
			firebase.database().ref('sessions/' + scenario).once('value', function(snap){
				if (snap.val() !== null) {
					that.scenarioSessions = snap.val()
				}
			})
		}
	}
}