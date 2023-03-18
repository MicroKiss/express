const path = require("path");

const dbPath = path.resolve(__dirname, "..", "db");


module.exports = {
	SERVER :{
		PORT: 3000
	},
	PATHS :{
		USERS: path.resolve(dbPath,"users.json"),
		TRANSACTIONS: path.resolve(dbPath,"transactions.json")
	}
  } 