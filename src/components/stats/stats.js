function roundUp(num, precision) {
  return Math.ceil(num * precision) / precision
}

function emptyBest() {
	return {
		date: new Date(),
		mean: 0,
		quantity: 0,
		sum: 0,
		toBullseyeMean: 0,
		toBullseyeMax: 0,
		toBullseyeMin: 0,
		user: ""
	}
}

function emptyUserData() {
	return {
		mean: 0,
		quantity: 0,
		sum: 0,
		toBullseyeMean: 0,
		toBullseyeMax: 0,
		toBullseyeMin: Infinity
	}
}

function decodeUserEmail(email) {
	return decodeURIComponent(email.replace('%2E','.'))
}

module.exports = {
	props: ['sessions'],

	data: function() {
		return {
			best: emptyBest(),
			mean: 0,
			userShotsMean: 0,
			toBullseyeMean: 0,
		}
	},

	methods: {
		reset: function() {
			this.best = emptyBest()
			this.mean = 0
			this.userShotsMean = 0
			this.toBullseyeMean = 0
		},

		render: function() {
			let totalShots = 0, totalUsers = 0
			for (ss in this.sessions) {
				let session = this.sessions[ss]
				for (u in session.userData) {
					let uData = emptyUserData()
					totalUsers++
					
					for (s in session.userData[u].shots) {
						let shot = session.userData[u].shots[s]
						totalShots++
						uData.sum += shot.score
						uData.toBullseyeMean = (uData.toBullseyeMean * Number(s) + shot.toBullseye) / (Number(s) + 1)
						if (uData.toBullseyeMin > shot.toBullseye) uData.toBullseyeMin = shot.toBullseye
						if (uData.toBullseyeMax < shot.toBullseye) uData.toBullseyeMax = shot.toBullseye
						this.mean = (this.mean * Number(s) + shot.score) / (Number(s) + 1)
						this.toBullseyeMean = (this.toBullseyeMean * Number(s) + shot.toBullseye) / (Number(s) + 1)
					}

					uData.mean = roundUp(uData.sum / session.userData[u].shots.length, 100)
					if (uData.mean > this.best.mean) {
						this.best = {
							date: new Date(session.date),
							mean: uData.mean,
							quantity: session.userData[u].shots.length,
							sum: uData.sum,
							toBullseyeMean: roundUp(uData.toBullseyeMean, 100),
							toBullseyeMax: uData.toBullseyeMax,
							toBullseyeMin: uData.toBullseyeMin,
							user: decodeUserEmail(u)
						}
					}
				}
			}
			this.mean = roundUp(this.mean, 100)
			this.userShotsMean = totalUsers && roundUp(totalShots / totalUsers, 1)
			this.toBullseyeMean = roundUp(this.toBullseyeMean, 100)
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