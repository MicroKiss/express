const express = require('express');
const {RestrictAdmin, Restrict, RestrictSelfParam} = require('../utility/authorization');
const { transactionStorage } = require('../utility/storage');
const {SendBalance, AddBalance, SetBalance} = require('../utility/transactionHandler');

const router = express.Router();


router.post('/send',Restrict, (req, res) => {
	try {
		amount = parseInt (req.body.amount);
		if (!amount) 
			throw "amount is not a number"
		
		SendBalance(req.user.username,req.body.username, amount);
		res.json("money sent")
	} catch (error) {
		res.status(412).json(error)
	}
  
})

router.post('/add',RestrictAdmin, (req, res) => {
	try {
		amount = parseInt (req.body.amount);
		if (!amount) 
			throw "amount is not a number"

		AddBalance(req.user.username,req.body.username, amount);
		res.json("money added")
	} catch (error) {
		res.status(412).json(error)
	}
})

router.post('/set',RestrictAdmin, (req, res) => {
	try {
		amount = parseInt (req.body.amount);
		if (!amount) 
			throw "amount is not a number"
			
		SetBalance(req.user.username,req.body.username, amount);
		res.json("money set")
	} catch (error) {
		res.status(412).json(error)
	}
})

router.get('/all',RestrictAdmin, (req, res) => {
	res.json (transactionStorage.Get());
})

router.get('/get/:username',RestrictSelfParam, (req, res) => {
	let transactions = transactionStorage.Get();
	let username = req.params.username;
	res.json(transactions.filter (t => t.sendername == username || t.receivername == username));
});

module.exports = router;