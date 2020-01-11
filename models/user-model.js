const { Schema, model } = require('mongoose')

const user = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: false
	},
	cart: {
		items: [
			{
				count: {
					type: Number,
					required: true,
					default: 1
				},
				itemId: {
					type: Schema.Types.ObjectId,
					ref: 'ListItem',
					required: true
				}
			}
		]
	}
})

user.methods.addToCart = function(item) {
	const items = [... this.cart.items]
	const idx = items.findIndex((el) => {
		return el.itemId.toString() === item._id.toString()
	})
	if (idx>=0) {
		items[idx].count++
	} else {
		items.push({
			itemId: item._id,
			count: 1
		})
	}

	this.cart = {items}
	return this.save()
}

user.methods.removeFromCart = function(id) {
	let items = [... this.cart.items]
	const idx = items.findIndex((el) => {
		return el.itemId.toString() === id.toString()
	})
	if (items[idx].count === 1) {
		items = items.filter((el) => {
			return el.itemId.toString() !== id.toString()
		})
	} else {
		items[idx].count--
	}

	this.cart = { items }
	return this.save()
}

user.methods.clearCart = function() {
	this.cart = {items: []}
	return this.save()
}

module.exports = model('User', user)