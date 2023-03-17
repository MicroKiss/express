var backendUrl = 'http://192.168.0.244:3000'


async function Get(route, auth) {
	let url = backendUrl + (route ? route : '')
	let headers = {}
	if (auth)
		headers.Authorization = auth;

	return await fetch(url, {
		method: "GET",
		headers: headers
	})
		.then((response) => {
			if (response.ok) {
				return [true, response.json()];
			} else {
				return [false, response.json()];
			}
		})
		.catch(e => {
			let errorPromise = new Promise((resolve, reject) => {
				setTimeout(() => {
				  resolve(e);
				}, 1);
			  });
			return [false, errorPromise];
		});
}

async function Post(route, jsonData = {}, auth) {
	let url = backendUrl + (route ? route : '')
	let headers = { "Content-Type": "application/json" };
	if (auth)
		headers.Authorization = auth;
	return await fetch(url, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(jsonData),
	})
		.then((response) => {
			if (response.ok) {
				return [true, response.json()];
			} else {
				return [false, response.json()];
			}
		})
		.catch(e => {
			let errorPromise = new Promise((resolve, reject) => {
				setTimeout(() => {
				  resolve(e);
				}, 1);
			  });
			return [false, errorPromise];
		});
}



export { Get, Post }