const app = require('express')()
const path = require('path')


app.get('/', (req, res) => {
	res.removeHeader('X-Powered-By')
	res.setHeader('Date', new Date().toLocaleString() )
	res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

const PORT = process.env.port || 3010
app.listen(PORT, () => {
	console.log(`Run at http://localhost:${PORT}`)
})
