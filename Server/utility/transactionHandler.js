const {userStorage, transactionStorage, TransactionTypes} = require ('./storage')

function SendBalance(sendername,receivername,amount) {
	if(amount <= 0)
		throw("minimum 1")
	if (sendername == receivername)
		throw("cannot send money to yourself");

	let sender = userStorage.GetOne ("username", sendername);
	let receiver = userStorage.GetOne ("username", receivername);

	if(!sender || !receiver)
		throw ("not existing user")

	if(sender.balance < amount)
		throw("not enough balance")

	sender.balance -= amount;
	receiver.balance += amount;
	userStorage.Update(sender);
	userStorage.Update(receiver);
	transactionStorage.Register (sender.username, receiver.username, TransactionTypes.Send, amount);
}


function AddBalance(sendername, receivername, amount) {
	if(amount <= 0)
		throw("minimum 1")

	let sender = userStorage.GetOne ("username", sendername);
	let receiver = userStorage.GetOne ("username", receivername);

	if(!sender || !receiver)
		throw ("not existing user")

	receiver.balance += amount;
	userStorage.Update(receiver);
	transactionStorage.Register (sender.username, receiver.username, TransactionTypes.Add, amount);
}


function SetBalance(sendername, receivername, amount) {
	let sender = userStorage.GetOne ("username", sendername);
	let receiver = userStorage.GetOne ("username", receivername);

	if(!sender || !receiver)
		throw ("not existing user")

	receiver.balance = amount;
	userStorage.Update(receiver);
	transactionStorage.Register (sender.username, receiver.username, TransactionTypes.Set, amount);
}


module.exports = {SendBalance, AddBalance, SetBalance};