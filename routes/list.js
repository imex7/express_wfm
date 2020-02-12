const router = require('express').Router()
const ListItem = require('../models/list-item-model')
const guard = require('../middleware/guard')

router.get('/', async (req, res) => {
	res.removeHeader('X-Powered-By')
	res.setHeader('Date', new Date().toLocaleString())

	const list = await ListItem.find().populate('userId', 'name')
	// console.log(list)
	res.render('list', {
		isList: true,
		list
	})
})

router.get('/:id', async (req, res) => {
	const list_item = await ListItem.findById(req.params.id)
	res.render('list-item', {
		layout: 'main',
		list_item
	})
})

router.get('/:id/edit', guard, async (req, res) => {
	const list_item = await ListItem.findByIdAndUpdate(req.params.id)
	if (!req.query.allow) {
		return res.redirect('/')
	} else {
		res.render('list-edit', {
			list_item
		})
	}
})

router.post('/edit', guard, async (req, res) => {
	const {id} = req.body
	delete req.body.id
	await ListItem.findByIdAndUpdate(id, req.body)
	res.redirect('/list')
})

router.post('/remove', guard, async (req, res) => {
	console.log('Id--->>', req.body.id)
	await ListItem.deleteOne({
		_id: req.body.id
	})
	res.redirect('/list')
})

module.exports = router