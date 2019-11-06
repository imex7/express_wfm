const router = require('express').Router()
const ListItemModel = require('../models/list-item-model')

router.get('/', async (req, res) => {
	res.removeHeader('X-Powered-By')
	res.setHeader('Date', new Date().toLocaleString())
	const list = await ListItemModel.getAll()
	res.render('list', {
		isList: true,
		list
	})
})

module.exports = router