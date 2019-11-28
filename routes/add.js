const router = require('express').Router()
const ListItemModel = require('../models/list-item-model')

router.get('/', (req, res) => {
	res.removeHeader('X-Powered-By')
	res.setHeader('Date', new Date().toLocaleString())
	
	res.render('list-add', {
		isListAdd: true
	})
})

router.post('/', async (req, res) => {
	res.removeHeader('X-Powered-By')
	res.setHeader('Date', new Date().toLocaleString())
	
	let {title, price, img} = req.body
	// console.log(req.body)
	const list_item = new ListItemModel(title, price, img)
	await list_item.save()
	res.redirect('/list')
})

module.exports = router