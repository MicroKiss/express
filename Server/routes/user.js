const express = require('express');
const {userStorage} = require('../utility/storage')
const {RestrictAdmin, RestrictSelfParam} = require('../utility/authorization');

const router = express.Router();

router.route('/')
.get((req, res) => {
	let users = userStorage.Get ();
	users.forEach(user => {
		delete user.password;
		delete user.balance;
		delete user.roles;
		delete user.id;
	});
	res.json(users);
})
.post((req, res) => {
	if(!req.body.username || !req.body.password) {
		res.status(400).json('missing username or password');
		return;
	}
	try {
		if (userStorage.GetOne("username", req.body.username))
			throw ("username already exists");
		userStorage.Register(req.body.username, req.body.password);
		res.json("user created");
		return;
	} catch (error) {
		console.log(error);
		res.status(412).json(error);
		return;
	}
})

router.get('/all',RestrictAdmin, (req, res) => {
	res.json (userStorage.Get());
})

router.delete('/:username',RestrictAdmin, (req, res) => {
	try {
		let user = userStorage.GetOne("username", req.params.username)
		if (!user)
			throw ("username does not exist");
		userStorage.Delete (user.id);
		res.json("user deleted")
	} catch (error) {
		res.status(412).json(error)
	}
})

router.get('/get/:username',RestrictSelfParam, (req, res) => {
	res.json (userStorage.GetOne("username", req.params.username));
});


module.exports = router