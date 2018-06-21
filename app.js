//file io module
const fs = require('fs');

//twitch chat api module
var tmi = require('tmi.js');

var commands = [];

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

client.on('chat', function(channel, userstate, message, self) {
	if(self) return;
	fs.appendFile(channel + "log.txt", '\n' + message, (error) => {if(error != null){console.log(error)}});
})