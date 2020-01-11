const {Schema, model} = require('mongoose')


const orderSchema = new Schema({
	items: [
		{
			count: {
				type: Number,
				required: true
			},
			itemId: {
				// type: Schema.Types.ObjectId,
				// ref: 'ListItem',
				// request: true
				type: Object,
				required: true
			}
		}
	],
	user: {
		name: String,
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = model('Order', orderSchema)