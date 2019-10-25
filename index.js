const app = require('express')()
const path = require('path')
const exphbs = require('express-handlebars')

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.get('/', (req, res) => {
	res.removeHeader('X-Powered-By')
	res.setHeader('Date', new Date().toLocaleString() )
	res.render('index')
})

app.get('/about', (req, res) => {
	res.removeHeader('X-Powered-By')
	res.setHeader('Date', new Date().toLocaleString() )
	res.render('about')
})

const PORT = process.env.port || 3010
app.listen(PORT, () => {
	console.log(`Run at http://localhost:${PORT}`)
})
