const router = require('express').Router()
const Order = require('../models/order-model')


router.get('/', async (req, res) => {
	const orders =  await Order.find({
		'user.userId': req.user._id
	})
	const orders_mapped = orders.map((el) => {
		return {
			...el._doc,
			price: el.items.reduce((total, c) => {
				return total += c.count * c.itemId.price
			}, 0)
		}
	})
	// console.log('******************USER_ORDER***********')
	// console.log(orders_mapped)
	res.render('orders', {
		isOrder: true,
		orders: orders_mapped
	})
})

router.post('/', async (req, res) => {
	const user = await req.user.populate('cart.items.itemId').execPopulate()
	const items = user.cart.items.map((el) => {
		return {
			count: el.count,
			itemId: {
				...el.itemId._doc
			}
		}
	})
	const order = new Order({
		user: {
			name: req.user.name,
			userId: req.user
		},
		items
	})
	// console.log("******************USER***********")
	// console.log(user)
	// console.log("******************ITEMS***********")
	// console.log(items)
	// console.log("******************NEW_ORDER***********")
	// console.log(order)
	await order.save()
	await req.user.clearCart()

	res.redirect('/orders')
})

module.exports = router