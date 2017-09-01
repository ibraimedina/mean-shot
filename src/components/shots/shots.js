var firebase = require('firebase')

function emptyShot() {
	return {
		value: 0
	}
}

module.exports = {
	props: ['onSave'],

	data: function() {
		return {
			shot: emptyShot(),
			shots: []
		}
	},

	methods: {
		save: function() {
			var that = this
			this.shots.push(this.shot)
			this.onSave(this.shots).then(function() {
				that.shot = emptyShot()
			}, function(e) {
				console.error(e)
			})
		}
	}
}