const app = require('express')()
const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const home_routes = require('./routes/home')
const list_routes = require('./routes/list')
const list_add_routes = require('./routes/add')
const cart_routes = require('./routes/cart')

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(require('express').urlencoded({extended: true}))
app.use('/', home_routes)
app.use('/list', list_routes)
app.use('/list_add', list_add_routes)
app.use('/cart', cart_routes)

const PORT = process.env.port || 3010
app.listen(PORT, () => {
	console.log(`Run at http://localhost:${PORT}`)
})
