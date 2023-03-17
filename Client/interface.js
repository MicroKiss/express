import config from "./config.js";

function ShowError(where, what) {
	if(!where)
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
		transactionAddButton.hidden = false;
		transactionSetButton.hidden = false;
		adminModalButton.disabled = false;
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
	adminModalButton.disabled = false;
	transactionAddButton.hidden = true;
	transactionSetButton.hidden = true;
}

export { ShowError, ShowSuccess, UpdateUIAfterLogin, UpdateUIAfterLogout, UpdateBalanceUI}