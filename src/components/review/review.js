var firebase = require('firebase')

function roundUp(num, precision) {
  return Math.ceil(num * precision) / precision
}

function emptyReview() {
	return {
		date: new Date(),
		users: {}
	}
}

function emptyUserData() {
	return {
		mean: 0,
		toBullseyeMean: 0,
		toBullseyeMax: 0,
		toBullseyeMin: Infinity
	}
}

function decodeUserEmail(email) {
	return decodeURIComponent(email.replace('%2E','.'))
}

module.exports = {
	props: ['session'],

	data: function() {
		return emptyReview()
	},

	methods: {
		reset: function() {
			this.date = new Date()
			this.users = {}
		},

		render: function() {
			this.date = new Date(this.session.date)

			for (u in this.session.userData) {
				let user = decodeUserEmail(u)
				this.users[user] = emptyUserData()
				for (s in this.session.userData[u].shots) {
					let shot = this.session.userData[u].shots[s]
					this.users[user].mean = (this.users[user].mean * Number(s) + shot.score) / (Number(s) + 1)
					this.users[user].toBullseyeMean = (this.users[user].toBullseyeMean * Number(s) + shot.toBullseye) / (Number(s) + 1)
					if (this.users[user].toBullseyeMin > shot.toBullseye) this.users[user].toBullseyeMin = shot.toBullseye
					if (this.users[user].toBullseyeMax < shot.toBullseye) this.users[user].toBullseyeMax = shot.toBullseye
				}
				this.users[user].mean = roundUp(this.users[user].mean, 100)
				this.users[user].toBullseyeMean = roundUp(this.users[user].toBullseyeMean, 100)
			}
		}
	},

	mounted: function() {
		this.render()
	},

	watch: {
		session: function(s) {
			this.reset()
			this.session = s
			this.render()
		}
	}

}