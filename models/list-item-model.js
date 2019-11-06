const uuid = require('uuid/v4')
const path = require('path')
const fs = require('fs')

class ListItemModel {

	constructor(title, price, img) {
		this.title = title
		this.price = price
		this.img = img
		this.id = uuid()
	}

	toJSON() {
		return {
			title: this.title,
			price: this.price,
			img: this.img,
			id: this.id
		}
	}

	async save() {
		const list = await ListItemModel.getAll()
		list.push(this.toJSON())
		return new Promise((res, rej) => {
			fs.writeFile(
				path.join(__dirname, '..', 'data', 'list-items.json'),
				JSON.stringify(list),
				(err, data) => {
					if (err) {
						rej(err)
					} else {
						res()
					}
				}
			)
		})
		console.log(list)
	}

	static getAll() {
		return new Promise((res, rej) => {
			fs.readFile(
				path.join(__dirname, '..', 'data', 'list-items.json'), 'utf-8',
				(err, data) => {
					if (err) {
						rej(err)
					} else {
						res(JSON.parse(data))
					}		
				}
			)
		})
	}

}

module.exports = ListItemModel