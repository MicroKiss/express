const {userStorage,Roles} = require('./storage')

function Authenticate (req, res, next) {
	let auth = req.headers.authorization;
	req.user = undefined;
	if (!auth) {
		next();
		return;
	}
	let username = auth.split(':')[0];
	let password = auth.split(':')[1];
	if (!username || !password) {
		next();
		return;
	}

	user = userStorage.GetOne ("username", username);
	if (user && user.password == password){
		req.user = user;
	}
	next();
}


function Restrict (req, res, next) {
	if (!req.user) {
		res.status(400).json('not authenticated');
		return;
	}

	next();
}

function RestrictAdmin (req, res, next) {
	if (!req.user) {
		res.status(400).json('not authenticated');
		return;
	}

	if (!req.user.roles.includes(Roles.Admin)){
		res.status(400).json('only admins can do that');
		return;
	}
	next()
}

function RestrictSelfParam (req, res, next) {
	if (!req.user) {
		res.status(400).json('not authenticated');
		return;
	}
	if (req.user.username != req.params.username){
		res.status(400).json('you cannot do that');
		return;
	}
	next();
}





module.exports = {RestrictAdmin,Authenticate, RestrictSelfParam, Restrict};