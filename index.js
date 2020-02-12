const express = require('express')
const app = express()
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const home_routes = require('./routes/home')
const list_routes = require('./routes/list')
const list_add_routes = require('./routes/add')
const cart_routes = require('./routes/cart')
const orders_routes = require('./routes/orders')
const auth_routes = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const MONGODB_URI = 'mongodb+srv://admin:123@cluster0-gthmv.mongodb.net/express_wfm?retryWrites=true&w=majority'

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
})

const store = new MongoStore({
	collection: 'sessions',
	uri: MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
	secret: 'myLolSecretValue',
	resave: false,
	saveUninitialized: false,
	store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)
app.use('/', home_routes)
app.use('/list', list_routes)
app.use('/list_add', list_add_routes)
app.use('/cart', cart_routes)
app.use('/orders', orders_routes)
app.use('/auth', auth_routes)

const PORT = process.env.port || 3010

let start = async () => {
	try {
		const mongoose_connect_opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		}
		await mongoose.connect(MONGODB_URI, mongoose_connect_opts)
			.then(() => {
				console.log('------------------------------------------------------------------------------')
				console.log('-------------- Соединение с БД выполнено успешно -----------------------------')
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


