function emptyShot() {
	return {
		score: 0,
		toBullseye: 0
	}
}

module.exports = {
	props: ['shot'],

	data: function() {
		return emptyShot()
	},
}