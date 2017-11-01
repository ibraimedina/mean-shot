var firebase = require('firebase')

function emptyScenario() {
	return {
		id: '',
		distance: null,
		environment: '',
		weapon: {
			caliber: null,
			maker: '',
			model: '',
		},
		ammunition: {
			caliber: null,
			weight: null,
			maker: '',
			material: '',
		},
		target: {
			size: null,
			material: '',
		}
	}
}

module.exports = {
	props: ['onSuccess', 'onError'],

	data: function() {
		return {
			scenario: {
				id: '',
				distance: 10,
				environment: 'indoor',
				weapon: {
					caliber: 6,
					maker: '',
					model: '',
				},
				ammunition: {
					caliber: 6,
					weight: 0.12,
					maker: '',
					material: 'plastic',
				},
				target: {
					size: 20,
					material: 'paper',
				}
			}
		}
	},

	methods: {
		clear: function() {
			this.scenario = emptyScenario()
		},

		save: function() {
			var that = this
			var scenarioRef = firebase.database().ref('scenarios/' + this.scenario.id)
			scenarioRef.once('value', function(snap) {
				if (snap.val() === null) {
					scenarioRef.set(that.scenario)
						.then(that.onSuccess, that.onError)
					console.debug("Scenario created with success! Go shot!")
				} else {
					that.scenario = snap.val()
					that.onSuccess(snap.val())
					console.debug("Scenario already created! Go shot!")
				}
			})
		}
	}
}