function roundUp(num, precision) {
  return Math.ceil(num * precision) / precision
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
function criteriaIsBetter(criteria, oldBest, newBest) {
	if (!newBest.mean) return false
	else if (!oldBest.mean) return true

	switch (criteria) {
		case 'toBullseye':
			return newBest.mean < oldBest.mean 
		case 'score':
		default:
			return newBest.mean > oldBest.mean
	}
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
	props: ['sessions'],

	data: function() {
		return {
			bests: {},
			means: {},
			userShotsMean: 0,
		}
	},

	methods: {
		reset: function() {
			this.bests = {}
			this.means = {}
			this.userShotsMean = 0
		},

		render: function() {
			let totalShots = 0, totalUsers = 0, criterias = []
			for (ss in this.sessions) {
				let session = this.sessions[ss]
				for (u in session.userData) {
					uData = resumeUserData(session.userData[u].shots)

					for (c in uData.criterias) {
						this.bests[c] = this.bests[c] || emptyCriteriaData()
						if (criteriaIsBetter(c, this.bests[c], uData.criterias[c])) {
							this.bests[c] = {
								date: new Date(session.date),
								quantity: uData.quantity,
								user: decodeUserEmail(u)
							}
							for (m in emptyCriteriaData()) {
								this.bests[c][m] = uData.criterias[c][m]
							}
						}

						this.means[c] = this.means[c] || emptyCriteriaData()
						this.means[c].mean = (this.means[c].mean*totalShots + uData.criterias[c].sum) / (totalShots + uData.quantity)
						this.means[c].unit = this.means[c].unit || uData.criterias[c].unit
						if (criterias.indexOf(c) == -1) criterias.push(c)
					}

					totalUsers++
					totalShots += session.userData[u].shots.length
				}
			}

			for (c in criterias) {
				this.means[criterias[c]].mean = roundUp(this.means[criterias[c]].mean, 100)
			}
			this.userShotsMean = totalUsers && roundUp(totalShots / totalUsers, 1)
		}
	},

	mounted: function() {
		this.render()
	},

	watch: {
		sessions: function(s) {
			this.reset()
			this.sessions = s
			this.render()
		}
	}
}