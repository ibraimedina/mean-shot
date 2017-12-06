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
	props : ['session'],

	data: function() {
		return {
			xexom: emptySession()
		}
	},

	created: function() {
		this.xexom.scenario = this.$route.params.id
		this.render()
	},

	mounted: function() {
	},

	methods: {
		render: function() {
			this.xexom.date = new Date(this.session.date)

			for (u in this.session.userData) {
				let email = decodeUserEmail(u)
				this.xexom.userData[email] = emptyUserData()
				this.xexom.userData[email].shots = this.session.userData[u].shots
				for (s in this.session.userData[u].shots) {
					let shot = this.session.userData[u].shots[s]
					this.xexom.userData[email].sum += shot.score
					this.xexom.userData[email].toBullseyeMean = (this.xexom.userData[email].toBullseyeMean * Number(s) + shot.toBullseye) / (Number(s) + 1)
					if (this.xexom.userData[email].toBullseyeMin > shot.toBullseye) this.xexom.userData[email].toBullseyeMin = shot.toBullseye
					if (this.xexom.userData[email].toBullseyeMax < shot.toBullseye) this.xexom.userData[email].toBullseyeMax = shot.toBullseye
				}
				this.xexom.userData[email].quantity = this.session.userData[u].shots.length;
				this.xexom.userData[email].mean = roundUp(this.xexom.userData[email].sum / this.xexom.userData[email].quantity, 100)
				this.xexom.userData[email].toBullseyeMean = roundUp(this.xexom.userData[email].toBullseyeMean, 100)
			}
		}
	}
}