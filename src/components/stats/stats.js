function roundUp(num, precision) {
  return Math.ceil(num * precision) / precision
}

function emptyBest() {
	return {
		date: 0,
		mean: 0,
		quantity: 0,
		sum: 0,
		toBullseyeMean: Infinity,
		user: ""
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
			toBullseyeMean: 0,
		}
	},

	methods: {
		reset: function() {
			this.mean = 0
			this.toBullseyeMean = 0
			this.best = emptyBest()
		},

		render: function() {
			for (ss in this.sessions) {
				let session = this.sessions[ss]
				for (u in session.userData) {
					let userMean = 0, userSum = 0, userToBullseyeMean = 0
					
					for (s in session.userData[u].shots) {
						let shot = session.userData[u].shots[s]
						userSum += shot.score
						userToBullseyeMean = (userToBullseyeMean * Number(s) + shot.toBullseye) / (Number(s) + 1)
						this.mean = (this.mean * Number(s) + shot.score) / (Number(s) + 1)
						this.toBullseyeMean = (this.toBullseyeMean * Number(s) + shot.toBullseye) / (Number(s) + 1)
					}

					userMean = roundUp(userSum / (session.userData[u].shots.length), 100)
					if (userMean > this.best.mean) {
						this.best = {
							date: new Date(session.date),
							mean: userMean,
							quantity: (session.userData[u].shots.length),
							sum: userSum,
							toBullseyeMean: roundUp(userToBullseyeMean, 100),
							user: decodeUserEmail(u)
						}
					}
				}
			}
			this.mean = roundUp(this.mean, 100)
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