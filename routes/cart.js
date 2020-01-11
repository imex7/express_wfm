const router = require('express').Router()
const ListItem = require('../models/list-item-model')

router.post('/add', async (req, res) => {
    res.removeHeader('X-Powered-By')
    res.setHeader('Date', new Date().toLocaleString())

    const item = await ListItem.findById(req.body.id)
    await req.user.addToCart(item)
    res.redirect('/cart')
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.itemId').execPopulate()
    const cart_list = user.cart.items.map((el) => {
        return {
            ...el.itemId._doc,
            count: el.count
        }
    })
    const cart_price = cart_list.reduce((total, el) => {
        return total += el.price * el.count
    }, 0)
    const cart = {
        items: cart_list,
        price_total: cart_price
    }
    res.status(200).json(cart)

})

router.get('/', async (req, res) => {
    const user = await req.user.populate('cart.items.itemId').execPopulate()
    const cart_list = user.cart.items.map((el) => {
        return {
                ...el.itemId._doc,
                count: el.count
            }
    })
    const cart_price = cart_list.reduce((total, el) => {
        return total += el.price * el.count
    }, 0)
    // console.log(cart_list)
    res.render('cart', {
        isCart: true,
        title: 'Корзина',
        items: cart_list,
        price_total: cart_price
    })
})


module.exports = router