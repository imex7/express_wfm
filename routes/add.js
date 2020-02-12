const router = require('express').Router()
const ListItem = require('../models/list-item-model')
const guard = require('../middleware/guard')

router.get('/', guard, (req, res) => {
	res.render('list-add', {
		isListAdd: true
	})
})

router.post('/', guard, async (req, res) => {
	let {title, price, img, user} = req.body
	console.log(req.body)
	const list_item = new ListItem({
		title, price, img, userId: "5df0f9d0622d3063680403cb" 
	})
	try {
		await list_item.save()
		res.redirect('/list')
	} catch(err) {
		console.log(err)
	}
})

module.exports = router