const router = require('express').Router()
const guard = require('../middleware/guard')
const User = require('../models/user-model')

router.get('/', guard, async (req, res) => {
	res.render('profile', {
		isProfile: true,
		user: req.user.toObject()
	})
})

router.post('/', guard, async (req, res) => {
	try {
		let filedata = req.file;
		console.log(filedata);
		if(!filedata)
			console.log("Ошибка при загрузке файла");
		else
			console.log("Файл загружен");
		const user = await User.findById(req.user._id)
		const toChange = {
			name: req.body.name,
			email: req.body.email
		}
		if (req.file) {
			toChange.avatarUrl = './' + req.file.filename
		}
		Object.assign(user, toChange)
		await user.save()
		res.redirect('/profile')
	} catch (err) {
		console.log(err)
	}
	
})

module.exports = router