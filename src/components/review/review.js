function roundUp(num, precision) {
  return Math.ceil(num * precision) / precision
}

function emptyReview() {
	return {
		date: new Date(),
		mean: 0,
		toBullseyeMean: 0,
		toBullseyeMax: 0,
		toBullseyeMin: Infinity
	}
}

module.exports = {
	props: ['session'],

	data: function() {
		return emptyReview()
	},

	methods: {
		reset: function() {
			this.date = new Date()
			this.mean = 0
			this.toBullseyeMean = 0
			this.toBullseyeMax = 0
			this.toBullseyeMin = Infinity
		},

		render: function() {
			this.date = new Date(this.session.date)

			for (s in this.session.shots) {
				let shot = this.session.shots[s]
				this.mean = (this.mean * Number(s) + shot.score) / (Number(s) + 1)
				this.toBullseyeMean = (this.toBullseyeMean * Number(s) + shot.toBullseye) / (Number(s) + 1)
				if (this.toBullseyeMin > shot.toBullseye) this.toBullseyeMin = shot.toBullseye
				if (this.toBullseyeMax < shot.toBullseye) this.toBullseyeMax = shot.toBullseye
			}
			this.mean = roundUp(this.mean, 100)
			this.toBullseyeMean = roundUp(this.toBullseyeMean, 100)
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