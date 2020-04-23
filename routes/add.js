const router = require('express').Router()
const {validationResult} = require('express-validator/check')
const ListItem = require('../models/list-item-model')
const guard = require('../middleware/guard')
const {listValidators} = require('../utils/validators')

router.get('/', guard, (req, res) => {
	res.render('list-add', {
		isListAdd: true
	})
})

router.post('/', guard, listValidators, async (req, res) => {
	let {title, price, img, user} = req.body

	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(422).render('list-add', {
			isListAdd: true,
			error: errors.array()[0].msg,
			data: {
				title, price, img
			}
		})

	}
	console.log(req.body)
	const list_item = new ListItem({
		title, price, img, userId: user
	})
	try {
		await list_item.save()
		res.redirect('/list')
	} catch(err) {
		console.log(err)
	}
})

module.exports = router