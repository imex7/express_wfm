const express = require('express')
const app = express()
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const multer = require('multer')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const home_routes = require('./routes/home')
const list_routes = require('./routes/list')
const list_add_routes = require('./routes/add')
const cart_routes = require('./routes/cart')
const profile_routes = require('./routes/profile')
const orders_routes = require('./routes/orders')
const auth_routes = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorMiddleware = require('./middleware/error')
const keys = require('./keys')

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
})

const store = new MongoStore({
	collection: 'sessions',
	uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({
	secret: keys.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store
}))
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'images')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now()+'-'+file.originalname)
	}
})
const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
const fileFilter = (req, file, cb) => {
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(null, false)
	}
}
app.use(multer({storage, fileFilter}).single('avatar'));
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)
app.use('/', home_routes)
app.use('/list', list_routes)
app.use('/list_add', list_add_routes)
app.use('/cart', cart_routes)
app.use('/profile', profile_routes)
app.use('/orders', orders_routes)
app.use('/auth', auth_routes)
app.use(errorMiddleware)

const PORT = process.env.port || 3010

let start = async () => {
	try {
		const mongoose_connect_opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		}
		await mongoose.connect(keys.MONGODB_URI, mongoose_connect_opts)
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
			})

	} catch(err) {
		console.log(err)
	}

}

start()


