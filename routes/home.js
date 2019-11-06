const router = require('express').Router()

router.get('/', (req, res) => {
	res.removeHeader('X-Powered-By')
	res.setHeader('Date', new Date().toLocaleString())
	res.render('home', {
		isList: true
	})
})

module.exports = router