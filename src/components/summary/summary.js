module.exports = {
	props: [
		'data'
			// {
			//		criteria
			//		highlights: {
			// 		quantity
			//			max
			// 		mean
			//			min
			// 		sum
			//			unit
			//			summary
			// 	}
			// }
		, 'lighter'	
	],

	methods: {
		roundUp: function(num, precision) {
		  return Math.ceil(num * precision) / precision
		}
	}
}