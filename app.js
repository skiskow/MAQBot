const querystring = require("querystring"),
    fetch = require("node-fetch");

//file io module
const fs = require('fs');

//Commands
var commands = [];
var uptimeStart;

const client_ID = "wy7ihv9surttczc5loyso4pbfcdf96";
const streams_URL = "https://api.twitch.tv/helix/streams";

const qs = querystring.stringify({
	first: 1,
	user_id : 47207841
});

const qUrl = `${streams_URL}?${qs}`;

const fetchArgs = {
    headers: {
        "Client-ID": client_ID
    }
};

fetch(qUrl, fetchArgs)
    .then(res => res.json())
    .then(data => {if(data != null){uptimeStart = data}})
    .catch(err => console.error(err));




function Command(name, call, private){
	this.identifier = name;
	this.call = call;
	this.global = private;
};

function addCommand(name, call, private){
	if(commandExists(name)){
		return;
	}
	commands.push(new Command(name, call, private));
	saveCommands();
}

function commandExists(name){
	for(var i=0;i<commands.length;i++){
		if (commands[i].name == name){
			return true;
		}
	}
	return false;
}

function saveCommands(){
	fs.writeFile('commands.txt', JSON.stringify(commands), (error) => {if(error != null){console.log(error)}});
	return;
}

function loadCommands(){
	fs.readFile('commands.txt', (err,data) => {
		if (err) console.log(err);
		commands = JSON.parse(data);
	});
}


//twitch chat api module
var tmi = require('tmi.js');

var emotes = [];

var options = {
	options: {
		debug: true
	},
	connection: {
		cluster: "aws",
		reconnect: "true"
	},
	identity: {
		username: "BabbiesFirstBot",
		password: "oauth:9fxf4caxh8ew406212v9b5gdow9gk2"
	},
	channels: ["Skiskow"]
};

var client = new tmi.client(options);
client.connect();
console.log(uptimeStart);

// loadCommands();

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();

client.on('chat', function(channel, userstate, message, self) {
	if(self) return;
	if(message.startsWith('!')){
		if(userstate.mod == true || userstate.username == channel.substring(1)){
			switch(message.substring(1).toLowerCase()){
				case 'hiya':
					client.say("skiskow","Hiya I'm a bot!");
					break;
				case 'uptime':
					client.say("skiskow", "Uptime is hard give me some time to learn how to do it.");
					break;
				// case 'template':
				// 	client.say("skiskow", "message");
				// 	break;
			}
		}	
	}
	fs.appendFile(channel  + dd + mm + yyyy + "log.txt", '\n' + userstate.username + ": " + message, (error) => {if(error != null){console.log(error)}});
	if(message.includes("?")){
		fs.appendFile(channel  + dd + mm + yyyy + "Questionlog.txt", '\n' + userstate.username + ": " + message, (error) => {if(error != null){console.log(error)}});
	}
});