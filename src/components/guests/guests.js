module.exports = {
	props: ["guests"],

	data: function(){
		return {
			guest: ""
		}
	},
	
	methods: {
		add: function(){
			this.guests.push(this.guest)
			this.reset()
		},

		reset: function(){
			this.guest = ""
		}
	}
}
