const {body} = require('express-validator/check')
const User = require('../models/user-model')

exports.registerValidators = [
	body('email')
		.isEmail()
		.withMessage('Инвалидный мэйл, дружище...')
		.custom(async (v, {req}) => {
			try {
				const user = await User.findOne({email: v})
				if (user) {
					return Promise.reject('Такой мэйл уже занят')
				}
			} catch (err) {
				console.log(err);
			}
		})
		.normalizeEmail(),

	body('password', 'Говенный у тя пайоль...')
		.isLength({min: 4, max: 6})
		.isAlphanumeric()
		.trim(),

	body('confirm')
		.custom((v, {req}) => {
			if(v !== req.body.password) {
				throw new Error('Пароли не совпадают!')
			}
		return true
		})
		.trim(),

	body('name')
		.trim()
]

exports.listValidators = [
	body('title').isLength({min: 3}).withMessage('Минимальная длина названия 3 символа').trim()
]