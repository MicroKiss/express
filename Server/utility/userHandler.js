const {userStorage} = require ('./storage')

function CreateNewUser(username, password) {
	if (userStorage.Get("username", username))
		throw("username already taken");
	userStorage.Register (username,password);
}

function DeleteUser(username) {
	let user = userStorage.Get("username", username);
	if (!user) 
		throw "cannot delete not existing user";
	userStorage.Delete(user.id);
}

module.exports = {CreateNewUser, DeleteUser};