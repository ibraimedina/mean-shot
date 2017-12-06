var firebase = require('firebase')

module.exports = {
	data: function() {
		return {
			user: null
		}
	},

	mounted: function() {
		this.user = firebase.auth().currentUser
	},

	updated: function() {
		this.user = firebase.auth().currentUser
	}
}