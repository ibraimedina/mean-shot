var firebase = require('firebase')

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

function emptySession() {
	return {
		date: null,
		userData: {},
		weapon: {
			initialCharge: 0,
			chargeType: ''
		}
	}
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
		this.load(this.$route.params.id)
	},

	watch: {
		'$route': function(to, from) {
			this.reset()
			this.load(to.params.id)
		}
	},

	methods: {
		start: function(scenario) {
			this.onSession = scenario.id !== null
			this.session.date = Date.now()
			this.session.scenario = scenario.id
			this.sessionUsers = [firebase.auth().currentUser.email]
			
			this.load(scenario.id)
		},

		reset: function(param) {
			this.onSession = false
			this.scenarios = []
			this.scenarioSessions = []
			this.session = emptySession()
			this.sessionUsers = []
			this.user = firebase.auth().currentUser
		},

		load: function(id) {
			this.user = firebase.auth().currentUser

			if (id) this.loadScenarioSessions(id)
			this.loadScenarios(id)
		},

		loadScenarios: function(id) {
			let that = this
			firebase.database().ref('scenarios' + (id ? `/${id}`: '')).on('value', function(snap) {
				if (snap.val() !== null) {
					if (snap.val().id)
						that.scenarios = [snap.val()]
					else
						that.scenarios = snap.val()
				}
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