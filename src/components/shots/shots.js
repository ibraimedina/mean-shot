var firebase = require('firebase')

function emptyShot(criterias) {
	let emptyShot = {}
	for (c in criterias) {
		emptyShot[c] = 0
	}

	return emptyShot
}

module.exports = {
	props: ['onSave', 'user', 'criterias'],

	data: function() {
		return {
			shot: emptyShot(this.criterias),
			shots: []
		}
	},

	methods: {
		save: function() {
			var that = this
			this.shots.push(this.shot)
			this.onSave(this.user, this.shots).then(function() {
				that.shot = emptyShot(that.criterias)
			}, function(e) {
				console.error(e)
				that.shots.pop()
			})
		}
	}
}