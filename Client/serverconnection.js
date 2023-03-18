import config from "./config.js";

var server =config.server;


async function Get(route, auth) {
	let url = server + (route ? route : '')
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
	let url = server + (route ? route : '')
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