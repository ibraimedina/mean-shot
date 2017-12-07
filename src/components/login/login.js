var firebase = require('firebase')

module.exports = {
	data: function() {
		return {
			username: '',
			password: '',
		}
	},

	methods: {
		send: function() {
			firebase
				.auth()
				.signInWithEmailAndPassword(this.username, this.password)
				.then(this.onSuccess)
				.catch(this.onFail)
		},

		view: function() {
			firebase
				.auth()
				.signInAnonymously()
				.then(this.onSuccess)
				.catch(this.onFail)
		},

		onSuccess: function(user) {
			this.$router.push('/scenarios')
		},

		onFail: function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === 'auth/wrong-password') {
				alert('Wrong password.')
			} else {
				alert(errorMessage)
			}
			console.log(error)
		}
	}
};