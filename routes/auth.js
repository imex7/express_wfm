const router = require('express').Router()
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator/check')
const {registerValidators} = require('../utils/validators')
const User = require('../models/user-model')

router.get('/signin', async (req, res) => {
	res.render('auth/login', {
		isLogin: true,
		regError: req.flash('reg-error'),
		signError: req.flash('sign-error')
	})
})

router.get('/signout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/signin#login')
	})
})

router.post('/signin', async (req, res) => {
	const { email, password} = req.body
	const candidate = await User.findOne({ email })
	try {
		if (candidate) {
			const areSame = await bcrypt.compare(password, candidate.password)
			if (areSame) {
				req.session.isAuthenticated = true
				req.session.user = candidate
				req.session.save((err) => {
					if (err) { throw err }
					res.redirect('/profile')
				})
				console.log("Зашел!!!");
			} else {
				req.flash('sign-error', 'Неверный пароль')
				res.redirect('/auth/signin#login')
				console.log("Пароль неверен");
			}
		} else {
			req.flash('sign-error', 'Такого пользователя не существует')
			res.redirect('/auth/signin#login')
			console.log("Нет тебя(((");
		}
	} catch (err) {
		console.log(err);
	}
})

router.post('/register', registerValidators, async (req, res) => {
	try {
		const {rname, email, password} = req.body
		// console.log(bcrypt)
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			req.flash('reg-error', errors.array()[0].msg)
			return res.status(422).redirect("/auth/signin#register")
		}
		const hashPassword = await bcrypt.hash(password, 10)
		const user = new User({
			name: rname, email, password: hashPassword, cart: {items: []}
		})
		let result = await user.save()
		if (result) {
			console.log("Ты зарегистрировался!")
		}
		res.redirect('/auth/signin#login')
	} catch (error) {
		console.log(error);
	}
})

module.exports = router