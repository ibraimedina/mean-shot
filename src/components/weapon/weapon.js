module.exports = {
	props: ['session', 'onChange'],

	data: function(){
		return {

		}
	},

	methods: {
		change: function(){
			return this.onChange()
		}
	}
}
