const router = require('express').Router()
const CartModel = require('../models/cart-model')
const ListItemModel = require('../models/list-item-model')

router.post('/add', async (req, res) => {
    res.removeHeader('X-Powered-By')
    res.setHeader('Date', new Date().toLocaleString())

    const item = await ListItemModel.getOne(req.body.id)
    await CartModel.add(item)
    res.redirect('/cart')
})

router.delete('/remove/:id', async (req, res) => {
    const cart = await CartModel.remove(req.params.id)
    // console.log(cart)
    res.status(200).json(cart)

})

router.get('/', async (req, res) => {
    const cart = await CartModel.fetch()
    console.log(cart)
    res.render('cart', {
        isCart: true,
        title: 'Корзина',
        items: cart.items,
        price_total: cart.price
    })
})


module.exports = router