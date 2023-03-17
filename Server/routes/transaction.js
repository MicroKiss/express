const express = require('express');
const {RestrictAdmin, Restrict, RestrictSelfParam} = require('../utility/authorization');
const { transactionStorage } = require('../utility/storage');
const {SendBalance, AddBalance, SetBalance} = require('../utility/transactionHandler');

const router = express.Router();


router.post('/send',Restrict, (req, res) => {
	try {
		SendBalance(req.user.username,req.body.username, parseInt (req.body.amount));
		res.json("money sent")
	} catch (error) {
		res.status(412).json(error)
	}
  
})

router.post('/add',RestrictAdmin, (req, res) => {
	try {
		AddBalance(req.user.username,req.body.username, parseInt (req.body.amount));
		res.json("money added")
	} catch (error) {
		res.status(412).json(error)
	}
})

router.post('/set',RestrictAdmin, (req, res) => {
	try {
		SetBalance(req.user.username,req.body.username, parseInt (req.body.amount));
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