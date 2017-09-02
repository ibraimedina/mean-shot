function roundUp(num, precision) {
  return Math.ceil(num * precision) / precision
}

module.exports = {
	props: ['session'],

	data: function() {
		return {
			name: '',
			mean: 0,
			meanToBullseye: 0
		}
	},

	mounted: function() {
		this.name = this.session.date
		for (s in this.session.shots) {
			this.mean += this.session.shots[s].score
			this.meanToBullseye += this.session.shots[s].toBullseye
		}
		this.mean /= this.session.shots.length
		this.meanToBullseye /= this.session.shots.length

		this.mean = roundUp(this.mean, 100)
		this.meanToBullseye = roundUp(this.meanToBullseye, 100)
	}

}