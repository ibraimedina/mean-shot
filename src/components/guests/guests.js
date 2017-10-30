module.exports = {
	props: ["guests"],

	data: function(){
		return {
			guest: ""
		}
	},
	
	methods: {
		add: function(){
			if (this.guests.indexOf(this.guest) < 0) {
				this.guests.push(this.guest)
				this.reset()
			}
		},

		reset: function(){
			this.guest = ""
		}
	}
}
