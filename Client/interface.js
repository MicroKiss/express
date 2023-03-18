import config from "./config.js";

function ShowError(where, what) {
	if (!where)
		return;
	where.classList.remove('alert-success');
	where.classList.add('alert-danger');
	where.innerHTML = what;
}

function ShowSuccess(where, what) {
	if (!where)
		return;
	where.classList.remove('alert-danger');
	where.classList.add('alert-success');
	where.innerHTML = what;
}

function UpdateBalanceUI() {
	mainBalanceLabel.innerHTML = config.loggedInUser.balance;
	transactionBalanceLabel.innerHTML = config.loggedInUser.balance;
}

function UpdateUIAfterLogin() {
	if (!config.loggedInUser) {
		throw "not logged in";
	}
	loginUsername.disabled = true;
	loginPassword.disabled = true;
	loginButton.disabled = true;
	logoutButton.disabled = false;
	transactionModalButton.disabled = false;
	mainBalanceLabel.innerHTML = config.loggedInUser.balance;
	mainBalanceLabel.classList.remove('text-danger');
	mainBalanceLabel.classList.add('text-success');
	transactionBalanceLabel.innerHTML = config.loggedInUser.balance;
	if (config.loggedInUser.roles.includes("admin")) {
		adminModalButton.disabled = false;
		transactionAddButton.hidden = false;
		transactionSetButton.hidden = false;
	}
}

function UpdateUIAfterLogout() {
	if (config.loggedInUser) {
		throw "logged in";
	}
	loginUsername.disabled = false;
	loginUsername.value = "";
	loginPassword.disabled = false;
	loginPassword.value = "";
	loginButton.disabled = false;
	logoutButton.disabled = true;
	transactionModalButton.disabled = true;
	mainBalanceLabel.innerHTML = "Login first";
	mainBalanceLabel.classList.remove('text-success');
	mainBalanceLabel.classList.add('text-danger');
	transactionBalanceLabel.innerHTML = "Login first";
	adminModalButton.disabled = true;
	transactionAddButton.hidden = true;
	transactionSetButton.hidden = true;
}

function FillUserTable(tableBody, data) {
	tableBody.innerHTML = "";
	data.forEach(item => {
		let rowData = [item.username, item.balance];
		InsertTableRow(tableBody, rowData)
	});

}

function FillTransactionTable(tableBody, data) {
	tableBody.innerHTML = "";
	data.forEach(item => {
		let rowData = [item.sendername, item.receivername, item.type,
		item.amount, new Date(item.date).toLocaleString()];
		InsertTableRow(tableBody, rowData)
	});

}

function FillUserListOptions(list, data) {
	list.innerHTML = "";
	data.forEach(user => {
		let opt = document.createElement("option");
		opt.value = user.username;
		opt.innerHTML = user.username;
		list.append(opt);
	});
}

function InsertTableRow(tableBody, item) {
	let row = tableBody.insertRow(0);

	for (let i = 0; i < item.length; i++) {
		let cell = row.insertCell(i);
		cell.innerHTML = item[i];
	}
}



export { ShowError, ShowSuccess, UpdateUIAfterLogin, UpdateUIAfterLogout, UpdateBalanceUI, FillUserTable, FillTransactionTable, FillUserListOptions, InsertTableRow }