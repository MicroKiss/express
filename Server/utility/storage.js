"use strict";
const fs = require('fs');
const config = require('config');
const { v4: uuidv4 } = require('uuid');

class Storage {
	constructor(filepath) {
		this.filepath = filepath;
		this.Init();
	}

	Init() {
		if (!fs.existsSync(this.filepath)){
			this.Save([]);
		} else {
			try {
				this.Get();
			} catch {
				this.Save([]);
			}
		}
	}

	Get () {
		if (fs.existsSync(this.filepath)){
			try {
				return JSON.parse(fs.readFileSync(this.filepath));
			} catch {
				return [];
			}
		} 
	}

	GetOne(property, value) {
		return (this.Get().find(record=>record[property] == value));
	}

	Save (data) {
		fs.writeFileSync(this.filepath, JSON.stringify(data,null, ' '));
	}

	Add (record) {
		if(record.id)
			throw("already has an id");
		let data = this.Get();
		record.id = uuidv4();
		data.push(record);
		this.Save(data);
	}

	Delete (id) {
		let data = this.Get();
		data = data.filter (record => record.id != id)
		this.Save(data);
	}

	Update(record) {
		let data = this.Get();
		for (let i = 0; i < data.length; i++) {
			if (data[i].id == record.id) {
				data[i] = record
				break;
			}
			
		}
		this.Save(data);
	}
}



const Roles = {
	User: "user",
	Admin: "admin"
};

class UserStorage extends Storage {
	constructor() {
		super (config.get('PATHS.USERS'));
	}
	Register (username,password){
		let newUser = {
			username : username,
			password : password,
			balance : 100,
			roles : [Roles.User]
		}
		super.Add(newUser);
	}
};


const TransactionTypes =  {
	Send: "send",
	Add: "add",
	Set: "set"
};

class TransactionStorage extends Storage {
	constructor() {
		super (config.get('PATHS.TRANSACTIONS'));
	}

	Register(sendername,receivername, type, amount) {
		let newTransaction = {
			sendername : sendername,
			receivername : receivername,
			type : type,
			amount : amount,
			date : Date.now()
		}
		super.Add(newTransaction);
	}
};

var userStorage = new UserStorage();
var transactionStorage = new TransactionStorage();

module.exports = {userStorage, Roles, transactionStorage, TransactionTypes};