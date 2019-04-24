/*
	Sahachel Flores & Ellen Hales
	CSC 337
	4/18/2019
	this file contains the web server code. It reads and writes
	the file favorites.txt depending on what the user implements
*/


const express = require("express");
const app = express();

const fs = require("fs");

const  bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

console.log("web server starting");
app.use(express.static('public'));

app.post('/', jsonParser, function (req, res) {

	res.header("Access-Control-Allow-Origin", "*");
	let message= {"msg":"default"};
	const name = req.body.name;
	const image = req.body.image;
	let info = name+":::"+image+"\n";

	console.log(name);
	console.log(image);
	console.log(info);

	fs.appendFile("favorites.txt", info, function(err) {
		if(err) {
			message = {"msg":"error, file was not saved"};
		}
		message = {"msg":"file was saved successfully!!!"};
		res.send(JSON.stringify(message));

	});

});

app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let json = {};
	let messages = [];
	let read = fs.readFileSync("favorites.txt",'utf8');
	let breakMess = read.split("\n");
	console.log(breakMess[0]);
	for(let i = 0; i < breakMess.length; i++) {
		let message = {};
		let list = breakMess[i].split(":::");
		message["name"] = list[0];
		message["image"] = list[1];
		messages.push(message);
	}
	json["meals"] = messages;
	console.log(json);
	res.send(json);

});

app.listen(process.env.PORT);
