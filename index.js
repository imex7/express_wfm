const express = require('express')
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const home_routes = require('./routes/home')
const list_routes = require('./routes/list')
const list_add_routes = require('./routes/add')
const cart_routes = require('./routes/cart')
const orders_routes = require('./routes/orders')
const User = require('./models/user-model')

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use( async (req, res, next) => {
	try {
		const user = await User.findById('5df0f9d0622d3063680403cb')
		req.user = user
		next()
	} catch (error) {
		console.log(error)
	}
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', home_routes)
app.use('/list', list_routes)
app.use('/list_add', list_add_routes)
app.use('/cart', cart_routes)
app.use('/orders', orders_routes)

const PORT = process.env.port || 3010

 let start = async () => {
	try {
		const db_conn_string = 'mongodb+srv://admin:123@cluster0-gthmv.mongodb.net/express_wfm?retryWrites=true&w=majority'
		const mongoose_connect_opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		}
		await mongoose.connect(db_conn_string, mongoose_connect_opts)
			.then(() => {
				console.log('------------------------------------------------------------------------------')
				console.log('-------------- Соединение с БД выполнено успешно -----------------------------')
				const createUser = async () => {
					const candidate = await User.findOne()
					if (!candidate) {
						const user = new User({
							name: 'Jenya',
							cart: {items: []}
						})
						await user.save()
					}
				}
				createUser()
				app.listen(PORT, () => {
					console.log(`-------------- Сервер работает по адресу http://localhost:${PORT} ---------------`)
					console.log('------------------------------------------------------------------------------')
				})			
			}
			).catch((err) => {
				console.log('------------------------------------------------------------------------------')
				console.log('-------------- Соединение с БД НЕ выполнено !!! ------------------------------')
				console.log('------------------------------------------------------------------------------')
				// console.log(err)
			})

	} catch(err) {
		// console.log(err)
	}

}

start()


