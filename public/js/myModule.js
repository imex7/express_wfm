let boo = document.querySelector(".user").textContent
console.log(boo);


document.querySelector('#t_but').addEventListener('click', () => {
	promise.then((d) => {
		// alert(d)
		noklko()
	}).catch(alert)
	// promise2().then(alert)
})

let promise = new Promise((res, rej) => {
	// if (1>2) {
		res("BUKA")
	// } else {
		// rej(new Error('LOLOL'))
	// }
})

let promise2 = async () => {
	return "LLLLLL"
}

// alert('LOLOLOLO')