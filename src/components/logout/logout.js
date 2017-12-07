var firebase = require('firebase')

module.exports = {
	methods: {
		logout: function() {
			firebase
				.auth()
				.signOut()
				.then(this.onSuccess)
		},

		onSuccess: function() {
			location.reload()
		}
	}
}