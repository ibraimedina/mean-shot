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
			session: emptySession(),
			onSession: false,
		}
	},

	methods: {
		start: function(param) {
			console.info("Let's get started", param)
			this.onSession = param.id !== null
			this.session.scenario = param.id
		},

		reset: function(param) {
			console.info("Ooh... do it again", param)
			this.onSession = false
			this.session = emptySession()
		},

		saveShots: function(shots) {
			this.session.shots = shots;
			return firebase.database().ref('sessions/' + this.session.date).set(this.session)
		}
	}
}