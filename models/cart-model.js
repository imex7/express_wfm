const path = require('path')
const fs = require('fs')

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json')

class CartModel {

    static async add(item) {
        const cart = await CartModel.fetch()
        const index = cart.items.findIndex((el) => {
            return (
                el.id === item.id
            )
        })
        const candidate = cart.items[index]
        if (candidate) {
            candidate.count++
            cart.items[index] = candidate
        } else {
            item.count = 1
            cart.items.push(item)
        }
        cart.price += +item.price
        return new Promise((res, rej) => {
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if (err) {
                    rej(err)
                } else {
                    res()
                }
            })
        }) 
    }

    static async remove(id) {
        const cart = await CartModel.fetch()
        const index = cart.items.findIndex((el) => {
            return (
                el.id === id
            )
        })
        const item = cart.items[index]
        if (item.count === 1) {
            cart.items = cart.items.filter((el) => {
                return (
                    el.id !== id
                )
            })
        } else {
            cart.items[index].count--
        }
        cart.price -= +item.price
        return new Promise((res, rej) => {
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if (err) {
                    rej(err)
                } else {
                    res(cart)
                }
            })
        }) 
    }

    static async fetch() {
        return new Promise((res, rej) => {
            fs.readFile(p, 'utf-8', (err, data) => {
                if (err) {
                    rej()
                } else {
                    res(JSON.parse(data))
                }
            })
        })
    }

}

module.exports = CartModel