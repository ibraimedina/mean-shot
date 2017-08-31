var firebase = require('firebase')

module.exports = {
	props: ['onSuccess', 'onError'],

	data: function() {
		return {
			scenario: {
				id: '',
				distance: 0,
				environment: '',
				weapon: {
					caliber: 6,
					maker: '',
					model: '',
				},
				ammunition: {
					caliber: 6,
					weight: 0.12,
					maker: '',
					material: '',
				},
				target: {
					size: 20,
					material: '',
				}
			}
		}
	},

	methods: {
		save: function() {
			var that = this
			var scenarioRef = firebase.database().ref('scenarios/' + this.scenario.id)
			scenarioRef.once('value', function(snap) {
				if (snap.val() === null) {
					scenarioRef.set(that.scenario)
						.then(that.onSuccess, that.onError)
				} else {
					that.scenario = snap.val()
					that.onSuccess(snap.val())
					console.debug("Go shot!")
				}
			})
		}
	}
}