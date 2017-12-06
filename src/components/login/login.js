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
			var that = this
			firebase
				.auth()
				.signInWithEmailAndPassword(that.username, that.password)
				.then(function(user) {
					that.$router.push('/scenarios')
				})
				.catch(function(error) {
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
					if (errorCode === 'auth/wrong-password') {
						alert('Wrong password.');
					} else {
						alert(errorMessage);
					}
					console.log(error);
			})
		}
	}
};