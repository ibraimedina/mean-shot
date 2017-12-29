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

function criteriaIsBetter(criteria, criteriaConfig, oldBest, newBest) {
	if (!newBest[criteriaConfig.measure]) return false
	else if (!oldBest[criteriaConfig.measure]) return true

	switch (criteriaConfig.better) {
		case '-':
			return newBest[criteriaConfig.measure] < oldBest[criteriaConfig.measure] 
		case '+':
		default:
			return newBest[criteriaConfig.measure] > oldBest[criteriaConfig.measure]
	}
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
	return decodeURIComponent(email.replace('%2E','.'))
}

module.exports = {
	props: ['sessions', 'criterias'],

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
					uData = resumeUserData(session.userData[u].shots, this.criterias)

					for (c in uData.criterias) {
						this.bests[c] = this.bests[c] || emptyCriteriaData()
						if (criteriaIsBetter(c, this.criterias[c], this.bests[c], uData.criterias[c])) {
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