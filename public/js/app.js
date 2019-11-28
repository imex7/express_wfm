const toCurrency = (val) => {
	return new Intl.NumberFormat('ru-RU', {
		currency: 'RUB',
		style: 'currency'
	}).format(val)
}

document.querySelectorAll(".price").forEach((el) => {
	el.textContent = toCurrency(el.textContent)
})

const cart = document.querySelector('#cart')
if (cart) {
	cart.addEventListener('click', (e) => {
		if (e.target.classList.contains("remove")) {
			let id = e.target.dataset.id
			fetch('/cart/remove/'+id, {
				method: 'delete'
			}).then((res) => {
				return (
					res.json()
				)
			}).then((d) => {
				console.log(d.price)
				if (d.items.length) {
					const html = d.items.map((el) => {
						return `
							<tr>
								<td>${el.title}</td>
								<td>${el.count}</td>
								<td>
									<button class="btn btn-small remove" data-id="${el.id}">Удалить</button>
								</td>
							</tr>							
						`
					}).join('')
					const tbody = cart.querySelector('tbody')
					tbody.innerHTML = html
					cart.querySelector('.price').textContent = toCurrency(d.price)
					console.dir(cart.querySelector('.price'))
					// console.dir(tbody)
				} else {
					cart.innerHTML = "<p>Пусто!!!</p>"
				}
			})
		}
	})
}