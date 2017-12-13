var firebase = require('firebase')

function roundUp(num, precision) {
  return Math.ceil(num * precision) / precision
}

function emptySession() {
	return {
		date: new Date(),
		userData: {},
		weapon: {
			initialCharge: 0,
			chargeType: ''
		},
	}
}

function emptyUserData() {
	return {
		mean: 0,
		quantity: 0,
		sum: 0,
		toBullseyeMean: 0,
		toBullseyeMax: 0,
		toBullseyeMin: Infinity
	}
}

function decodeUserEmail(email) {
	return decodeURIComponent(email.replace(/\%2E/g, '.'))
}

module.exports = {
	props : ['scenario', 'date'],

	data: function() {
		return {
			session: emptySession(),
			rawSession: emptySession()
		}
	},

	created: function() {
	},

	mounted: function() {
		this.load(this.scenario, this.date)
	},

	methods: {
		reset: function() {
			this.session = emptySession()
			this.session.date = new Date(Number(this.date))

			this.rawSession = emptySession()
		},

		load: function(scenario, date) {
			let that = this
			firebase.database().ref('sessions/' + scenario + '/' + date).on('value', function(snap) {
				that.reset()
				if (snap.val() !== null)
					that.rawSession = snap.val()
				that.render()
			})
		},

		render: function() {
			for (u in this.rawSession.userData) {
				let email = decodeUserEmail(u)
				this.session.userData[email] = emptyUserData()
				this.session.userData[email].shots = this.rawSession.userData[u].shots
				for (s in this.rawSession.userData[u].shots) {
					let shot = this.rawSession.userData[u].shots[s]
					this.session.userData[email].sum += shot.score
					this.session.userData[email].toBullseyeMean = (this.session.userData[email].toBullseyeMean * Number(s) + shot.toBullseye) / (Number(s) + 1)
					if (this.session.userData[email].toBullseyeMin > shot.toBullseye) this.session.userData[email].toBullseyeMin = shot.toBullseye
					if (this.session.userData[email].toBullseyeMax < shot.toBullseye) this.session.userData[email].toBullseyeMax = shot.toBullseye
				}
				this.session.userData[email].quantity = this.rawSession.userData[u].shots.length;
				this.session.userData[email].mean = roundUp(this.session.userData[email].sum / this.session.userData[email].quantity, 100)
				this.session.userData[email].toBullseyeMean = roundUp(this.session.userData[email].toBullseyeMean, 100)
			}
		}
	}
}