module.exports = {
	props: ['session', 'onChange'],

	data: function(){
		this.session.weapon.chargeType = 'gas'
		return {

		}
	},

	methods: {
		change: function(){
			return this.onChange()
		}
	}
}
