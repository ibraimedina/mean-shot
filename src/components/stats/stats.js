function roundUp(num, precision) {
  return Math.ceil(num * precision) / precision
}

module.exports = {
	props: ['sessions'],

	data: function() {
		return {
			mean: 0,
			toBullseyeMean: 0
		}
	},

	methods: {
		reset: function() {
			this.mean = 0
			this.toBullseyeMean = 0
			// this.toBullseyeMax = 0
			// this.toBullseyeMin = Infinity
		},

		render: function() {
			console.debug(this.sessions)

			for (ss in this.sessions) {
				let session = this.sessions[ss]
				for (u in session.userData)
					for (s in session.userData[u].shots) {
						let shot = session.userData[u].shots[s]
						this.mean = (this.mean * Number(s) + shot.score) / (Number(s) + 1)
						this.toBullseyeMean = (this.toBullseyeMean * Number(s) + shot.toBullseye) / (Number(s) + 1)
						// if (this.toBullseyeMin > shot.toBullseye) this.toBullseyeMin = shot.toBullseye
						// if (this.toBullseyeMax < shot.toBullseye) this.toBullseyeMax = shot.toBullseye
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