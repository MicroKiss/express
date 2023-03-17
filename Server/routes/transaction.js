const express = require('express');
const {RestrictAdmin, Restrict} = require('../utility/authorization');
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

module.exports = router;