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
			firebase.auth().onAuthStateChanged(function(user) {
				console.info("STATE CHANGED");
			  if (user) {
			    window.location.href = '/session'
			  } else {
			    console.info("user off");
			  }
			});

			firebase
				.auth()
				.signInWithEmailAndPassword(this.username, this.password)
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
				});
		}
	}
};