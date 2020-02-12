const router = require('express').Router()
const bcrypt = require('bcryptjs')
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
					res.redirect('/')
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
	} catch (error) {
		
	}
})

router.post('/register', async (req, res) => {
	try {
		const {rname, email, password, repeat} = req.body
		const candidate = await User.findOne({email})
		if (candidate) {
			req.flash('reg-error', 'Пользователь с таким емэйл уже существует')
			res.redirect('/auth/signin#register')
			console.log("Такой тип уже есть");
		} else {
			const hashPassword = await bcrypt.hash(password, 10)
			const user = new User({
				name: rname, email, password: hashPassword, cart: {items: []}
			})
			await user.save()
			res.redirect('/auth/signin#login')
			console.log("NO NAMED");
		}
	} catch (error) {
		console.log(error);
	}
})

module.exports = router