
var events = require('events');
var util = require('util');
var Client = require('./net/client');

function Room(roomID){
	events.EventEmitter.call(this);
	this.roomID = roomID;
	this.client = null;
}
util.inherits(Room, events.EventEmitter);

Room.prototype.open = function(){
	this.client = new Client();
	this.client.on('connect', this.onConnected.bind(this));
	this.client.on('message', this.onMessage.bind(this));
	this.client.connect();
}

Room.prototype.keepAlive = function(){
	this.client.send({
		type: 'mrkl'
	});
}

Room.prototype.onConnected = function(){

	var self = this;

	// console.log('[Room] Client connected. Sending LOGIN request.');

	// Send LOGIN request
	this.client.send({
		type: 'loginreq',
		roomid: this.roomID,
		ver: 20190530,
		ct: 0
	});

	// Send KEEP_ALIVE request every 45 seconds
	setInterval(function(){
		self.keepAlive();
	}, 45000);

	this.emit('connect');

	this.client.on('error', this.onError.bind(this));
	this.client.on('close', this.onClosed.bind(this));
}


Room.prototype.onError = function(err){
	console.error('[Room] Error: ' + err.toString());
	this.emit('error', err);
}

Room.prototype.onClosed = function(had_error){
	this.emit('close', had_error);
}

Room.prototype.onMessage = function(message){

	var messageType = message.attr('type');
	if(!messageType) {
		console.error('[Room] Cannot get type of message');
		return;
	}

	if(messageType == 'loginres') {
		// console.log('[Room] LOGIN response received. Sending JOIN_GROUP request.');

		// Send JOIN_GROUP request
		this.client.send({
			type: 'joingroup',
			rid: this.roomID,
			gid: -9999
		});
	}

	// console.log('[Room] Received message: ' + JSON.stringify(message.body));
	this.emit(messageType, message.body);
}

module.exports = Room;

