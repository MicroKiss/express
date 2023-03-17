import { Get, Post } from "./serverconnection.js";
import { ShowError, ShowSuccess, UpdateUIAfterLogin, UpdateUIAfterLogout, UpdateBalanceUI } from "./interface.js";
import config from "./config.js";


var adminUsersTableBody = document.getElementById('adminUsersTableBody');



registerButton.addEventListener('click', HandleRegister);
async function HandleRegister() {
	registerError.innerHTML = '';
	let username = registerUsername.value;
	let password = registerPassword.value;

	if (!username || !password) {
		ShowError(registerError, "empty fields");
		return;
	}
	let jsonToSend = {
		"username": username,
		"password": password
	}

	const [result, data] = await Post('/user', jsonToSend);
	data.then(data => {
		if (result) {
			Login(username, password, loginError);
			ShowSuccess(registerError, data + ", and logged in");
			registerPassword.value = "";
			registerUsername.value = "";
		} else {
			ShowError(registerError, data);
		}
	});
}


async function Login(username, password, errorPlace) {
	let auth = `${username}:${password}`;
	const [result, data] = await Get('/user/get/' + username, auth);
	data.then(data => {
		if (result) {
			config.loggedInUser = data;
			UpdateUIAfterLogin();
			ShowSuccess(errorPlace, "logged in as: " + username);
			PopulateFromServer();
		} else {
			ShowError(errorPlace, data);
		}
	});
}

logoutButton.addEventListener('click', HandleLogout);
function HandleLogout() {
	config.loggedInUser = undefined;
	UpdateUIAfterLogout();
	ShowSuccess(loginError, "logged out :)");
}

loginButton.addEventListener('click', HandleLogin);
async function HandleLogin() {
	let username = loginUsername.value;
	let password = loginPassword.value;

	if (!username || !password) {
		ShowError(loginError, "empty fields");
		return;
	}
	Login(username, password, loginError);
}

async function PopulateFromServer() {
	{
		transactionUserList.innerHTML = "";
		const [result, data] = await Get('/user');
		data.then(data => {
			if (result) {
				data.forEach(user => {
					let opt = document.createElement("option");
					opt.value = user.username;
					opt.innerHTML = user.username;
					transactionUserList.append(opt);
				});
			} else {
				console.error(data);
			}
		});
	}
	{
		transactionsTableBody.innerHTML = "";
		let auth = `${config.loggedInUser.username}:${config.loggedInUser.password}`;
		const [result, data] = await Get('/transaction/get/' + config.loggedInUser.username, auth);
		data.then(data => {
			if (result) {
				data.reverse().forEach(item => {
					let row = transactionsTableBody.insertRow();
					let sender = row.insertCell(0);
					sender.innerHTML = item.sendername;
					let receiver = row.insertCell(1);
					receiver.innerHTML = item.receivername;
					let type = row.insertCell(2);
					type.innerHTML = item.type;
					let amount = row.insertCell(3);
					amount.innerHTML = item.amount;
					let date = row.insertCell(4);
					date.innerHTML = new Date(item.date).toLocaleString();
				});
			} else {
				console.error(data);
			}
		});
	}

	if (!config.loggedInUser.roles.includes("admin"))
		return;

		

		{
			adminUsersTableBody.innerHTML = "";
			let auth = `${config.loggedInUser.username}:${config.loggedInUser.password}`;
			const [result, data] = await Get('/user/all', auth);
			data.then(data => {
				if (result) {
					data.forEach(item => {
						let row = adminUsersTableBody.insertRow();
						let user = row.insertCell(0);
						user.innerHTML = item.username;
						let balance = row.insertCell(1);
						balance.innerHTML = item.balance;
					});
				} else {
					console.error(data);
				}
			});
		}

	{
		adminTransactionsTableBody.innerHTML = "";
		let auth = `${config.loggedInUser.username}:${config.loggedInUser.password}`;
		const [result, data] = await Get('/transaction/all', auth);
		data.then(data => {
			if (result) {
				data.reverse().forEach(item => {
					let row = adminTransactionsTableBody.insertRow();
					let sender = row.insertCell(0);
					sender.innerHTML = item.sendername;
					let receiver = row.insertCell(1);
					receiver.innerHTML = item.receivername;
					let type = row.insertCell(2);
					type.innerHTML = item.type;
					let amount = row.insertCell(3);
					amount.innerHTML = item.amount;
					let date = row.insertCell(4);
					date.innerHTML = new Date(item.date).toLocaleString();
				});
			} else {
				console.error(data);
			}
		});
	}
}


transactionSendButton.addEventListener('click', HandleSend);
async function HandleSend() {
	let username = transactionUserList.value;
	let amount = transactionAmount.value;
	if (!username) {
		ShowError(transactionError, "select a user");
		return;
	}
	if (amount < 1) {
		ShowError(transactionError, "minimum 1");
		return;
	}

	let auth = `${config.loggedInUser.username}:${config.loggedInUser.password}`;
	let jsonToSend = {
		"username": username,
		"amount": amount
	}

	const [result, data] = await Post('/transaction/send', jsonToSend, auth);
	data.then(data => {
		if (result) {
			console.log(data);
			ShowSuccess(transactionError, data);
			UpdateBalance();
		} else {
			ShowError(transactionError, data);
		}
	});
}

transactionAddButton.addEventListener('click', HandleAdd);
async function HandleAdd() {
	let username = transactionUserList.value;
	let amount = transactionAmount.value;
	if (!username) {
		ShowError(transactionError, "select a user");
		return;
	}
	if (amount < 1) {
		ShowError(transactionError, "minimum 1");
		return;
	}

	let auth = `${config.loggedInUser.username}:${config.loggedInUser.password}`;
	let jsonToSend = {
		"username": username,
		"amount": amount
	}

	const [result, data] = await Post('/transaction/add', jsonToSend, auth);
	data.then(data => {
		if (result) {
			console.log(data);
			ShowSuccess(transactionError, data);
			UpdateBalance();
		} else {
			ShowError(transactionError, data);
		}
	});
}

transactionSetButton.addEventListener('click', HandleSet);
async function HandleSet() {
	let username = transactionUserList.value;
	let amount = transactionAmount.value;
	if (!username) {
		ShowError(transactionError, "select a user");
		return;
	}

	let auth = `${config.loggedInUser.username}:${config.loggedInUser.password}`;
	let jsonToSend = {
		"username": username,
		"amount": amount
	}

	const [result, data] = await Post('/transaction/set', jsonToSend, auth);
	data.then(data => {
		if (result) {
			console.log(data);
			ShowSuccess(transactionError, data);
			UpdateBalance();
		} else {
			ShowError(transactionError, data);
		}
	});
}


async function UpdateBalance() {
	let auth = `${config.loggedInUser.username}:${config.loggedInUser.password}`;
	const [result, data] = await Get('/user/get/' + config.loggedInUser.username, auth);
	data.then(data => {
		if (result) {
			config.loggedInUser = data;
			UpdateBalanceUI();
		} else {
			console.error(data);
		}
	});
	
}

Get('/').then(([result, data]) => {
	if (!result) {
		alert("NO SERVER");
	}
})