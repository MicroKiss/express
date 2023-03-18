import { Get, Post } from "./serverconnection.js";
import { ShowError, ShowSuccess, FillUserTable, FillTransactionTable, FillUserListOptions, InsertTableRow } from "./interface.js";
import { UpdateUIAfterLogin, UpdateUIAfterLogout, UpdateBalanceUI, ShowToast } from "./interface.js";
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

	//we could encode the password before sending, then te server wouldn't know the users' real password but who cares for this little project :P
	let jsonToSend = {
		"username": username,
		"password": password
	}

	const [result, data] = await Post('/user', jsonToSend);
	data.then(data => {
		if (result) {
			HandleLogout();
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
	ShowToast("loggged out");
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
	if(!config.loggedInUser) {
		ShowToast("Not logged in");
		return;
	}
		ShowToast("Refreshed");
	let auth = `${config.loggedInUser.username}:${config.loggedInUser.password}`;
	UpdateBalance ();

	{
		const [result, data] = await Get('/user');
		data.then(data => {
			if (result) {
				FillUserListOptions(transactionUserList, data);
			} else {
				console.error(data);
			}
		});
	}
	{
		const [result, data] = await Get('/transaction/get/' + config.loggedInUser.username, auth);
		data.then(data => {
			if (result) {
				FillTransactionTable(transactionsTableBody, data);
			} else {
				console.error(data);
			}
		});
	}

	if (!config.loggedInUser.roles.includes("admin"))
		return;

	{
		const [result, data] = await Get('/user/all', auth);
		data.then(data => {
			if (result) {
				FillUserTable(adminUsersTableBody, data);
			} else {
				console.error(data);
			}
		});
	}

	{
		const [result, data] = await Get('/transaction/all', auth);
		data.then(data => {
			if (result) {
				FillTransactionTable(adminTransactionsTableBody, data)
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
	if (!amount) {
		ShowError(transactionError, "How much?");
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
			let trans = [config.loggedInUser.username, username, "send", amount, new Date().toLocaleString()];
			InsertTableRow(transactionsTableBody, trans)
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
	if (!amount) {
		ShowError(transactionError, "How much?");
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
			let trans = [config.loggedInUser.username, username, "add", amount, new Date().toLocaleString()];
			InsertTableRow(transactionsTableBody, trans)
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
	if (!amount) {
		ShowError(transactionError, "How much?");
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
			let trans = [config.loggedInUser.username, username, "set", amount, new Date().toLocaleString()];
			InsertTableRow(transactionsTableBody, trans)
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

transactionRefresh.addEventListener('click', PopulateFromServer);
mainRefresh.addEventListener('click', PopulateFromServer);

Get('/').then(([result, data]) => {
	if (!result) {
		alert("NO SERVER");
	}
})


