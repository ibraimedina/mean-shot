var firebase = require('firebase')

function roundUp(num, precision) {
  return Math.ceil(num * precision) / precision
}

function emptyReview() {
	return {
		date: new Date(),
		users: {}
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
	return decodeURIComponent(email.replace('%2E','.'))
}

module.exports = {
	props: ['session'],

	data: function() {
		return emptyReview()
	},

	methods: {
		reset: function() {
			this.date = new Date()
			this.users = {}
		},

		render: function() {
			this.date = new Date(this.session.date)

			for (u in this.session.userData) {
				let user = decodeUserEmail(u)
				this.users[user] = resumeUserData(this.session.userData[u].shots)
			}
		}
	},

	mounted: function() {
		this.render()
	},

	watch: {
		session: function(s) {
			this.reset()
			this.session = s
			this.render()
		}
	}

}