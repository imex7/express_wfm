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

router.get('/:id', async (req, res) => {
	const list_item = await ListItemModel.getOne(req.params.id)
	res.render('list-item', {
		layout: 'main',
		list_item
	})
})

router.get('/:id/edit', async (req, res) => {
	const list_item = await ListItemModel.getOne(req.params.id)
	if (!req.query.allow) {
		return res.redirect('/')
	} else {
		res.render('list-edit', {
			list_item
		})
	}
})

router.post('/edit', async (req, res) => {
	await ListItemModel.update(req.body)
	res.redirect('/list')
})

module.exports = router