const {Schema, model} = require('mongoose')

const listItem = new Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	img: String,
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
})

listItem.method('toClient', function () {
	const item = this.toObject()
	item.id = course._id
	delete item._id
	return item
})

module.exports = model('ListItem', listItem)