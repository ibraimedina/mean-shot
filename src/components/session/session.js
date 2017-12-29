var firebase = require('firebase')

function roundUp(num, precision) {
  return Math.ceil(num * precision) / precision
}

function emptySession() {
	return {
		date: new Date(),
		userData: {},
		weapon: {
			initialCharge: 0,
			chargeType: ''
		},
	}
}

function emptyScenario() {
	return {
		author: '',
		id: '',
		distance: null,
		environment: '',
		weapon: {
			caliber: null,
			maker: '',
			model: '',
		},
		ammunition: {
			caliber: null,
			weight: null,
			maker: '',
			material: '',
		},
		target: {
			size: null,
			material: '',
		},
		criterias: {}
	}
}

function emptyCriteriaData() {
	return {
		max: null,
		mean: null,
		min: Infinity,
		sum: 0,
		summary: '',
		unit: ''
	}
}

function emptyUserData() {
	return {
		criterias: {},
		quantity: 0
	}
}

function resumeUserData(shots, criterias) {
	let uData = emptyUserData()
	uData.quantity = shots.length

	for (s in shots) {
		let shot = shots[s]
		for (c in shot) {
			uData.criterias[c] = uData.criterias[c] || emptyCriteriaData()
			uData.criterias[c].sum += shot[c]
			if (uData.criterias[c].max < shot[c]) uData.criterias[c].max = shot[c]
			if (uData.criterias[c].min > shot[c]) uData.criterias[c].min = shot[c]
			uData.criterias[c].mean = (uData.criterias[c].mean * Number(s) + shot[c]) / (Number(s) + 1)
			uData.criterias[c].unit = criterias[c] ? criterias[c].unit : (console.error('Unconfigured scenario criteria in shots:', c) || "")
			uData.criterias[c].summary = criteriaSummary(c, uData)
		}
	}

	return uData
}

// TODO: implement this to the user!
function criteriaSummary(criteria, data) {
	switch(criteria) {
		case 'score':
			return `${data.criterias[criteria].sum} in ${data.quantity} shots`
		case 'toBullseye':
			return `${data.criterias[criteria].min}${data.criterias[criteria].unit} - ${data.criterias[criteria].max}${data.criterias[criteria].unit}`
		default:
			return `mean in ${data.quantity} shots`
	}
}

function decodeUserEmail(email) {
	return decodeURIComponent(email.replace(/\%2E/g, '.'))
}

module.exports = {
	props : ['id', 'date'],

	data: function() {
		return {
			session: emptySession(),
			scenario: emptyScenario()
		}
	},

	mounted: function() {
		this.load(this.id, this.date)
	},

	methods: {
		reset: function() {
			this.scenario = emptyScenario()
			this.session = emptySession()
		},

		load: function(scenarioID, date) {
			this.reset()

			firebase.Promise.all([
				this.loadScenario(scenarioID),
				this.loadSession(scenarioID, date)
			])
			.then(this.render)
		},

		loadScenario: function(scenarioID) {
			let that = this
			return new firebase.Promise(function(resolve, reject){
				firebase.database().ref('scenarios/' + scenarioID).on('value', function(snap) {
					if (snap.val() !== null)
						that.scenario = snap.val()
					resolve()
				})
			})
		},

		loadSession: function(scenarioID, date) {
			let that = this
			return new firebase.Promise(function(resolve, reject){
				firebase.database().ref('sessions/' + scenarioID + '/' + date).on('value', function(snap) {
					if (snap.val() !== null) {
						that.session = snap.val()
						that.session.date = new Date(that.session.date)
					}
					resolve()
				})
			})
		},

		render: function() {
			for (u in this.session.userData) {
				let email = decodeUserEmail(u)
				this.session.userData[email] = resumeUserData(this.session.userData[u].shots, this.scenario.criterias)
				this.session.userData[email].shots = this.session.userData[u].shots
				delete this.session.userData[u]
			}
			this.$forceUpdate()
		}
	}
}