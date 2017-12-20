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

function resumeUserData(shots) {
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
			uData.criterias[c].unit = criteriaUnit(c)
			uData.criterias[c].summary = criteriaSummary(c, uData)
		}
	}

	return uData
}

// TODO: implement this to the user!
function criteriaUnit(criteria) {
	switch(criteria) {
		case 'toBullseye':
			return 'cm'
		case 'score':
		default:
			return ''
	}
}

// TODO: implement this to the user!
function criteriaSummary(criteria, data) {
	switch(criteria) {
		case 'score':
			return `scored ${data.criterias[criteria].sum} in ${data.quantity} shots`
		case 'toBullseye':
			return `${data.criterias[criteria].min}cm - ${data.criterias[criteria].max}cm`
		default:
			return `mean in ${data.quantity} shots`
	}
}

function decodeUserEmail(email) {
	return decodeURIComponent(email.replace(/\%2E/g, '.'))
}

module.exports = {
	props : ['scenario', 'date'],

	data: function() {
		return {
			session: emptySession(),
			rawSession: emptySession()
		}
	},

	created: function() {
	},

	mounted: function() {
		this.load(this.scenario, this.date)
	},

	methods: {
		reset: function() {
			this.session = emptySession()
			this.session.date = new Date(Number(this.date))

			this.rawSession = emptySession()
		},

		load: function(scenario, date) {
			let that = this
			firebase.database().ref('sessions/' + scenario + '/' + date).on('value', function(snap) {
				that.reset()
				if (snap.val() !== null)
					that.rawSession = snap.val()
				that.render()
			})
		},

		render: function() {
			for (u in this.rawSession.userData) {
				let email = decodeUserEmail(u)
				this.session.userData[email] = resumeUserData(this.rawSession.userData[u].shots)
				this.session.userData[email].shots = this.rawSession.userData[u].shots
			}
		}
	}
}