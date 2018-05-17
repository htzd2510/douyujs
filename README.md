DouyuTV API Wrapper
===================

NodeJS Wrapper for DouyuTV APIs

forked from [yingnansong/douyujs](https://github.com/yingnansong/douyujs) 

更新日志
--------
### v0.1.3
修改`utils.deserialize`避免对ic等包含'/'的字段继续序列化
### v0.1.2
 修改readme
### v0.1.1

utils 根据 [xiaozhuai](https://github.com/xiaozhuai) 在 https://github.com/yingnansong/douyujs/issues/2#issuecomment-371020628 的回复修改

按照 《斗鱼弹幕服务器第三方接入协议v1.6.2 》更新心跳包

Supported Platforms
-------------------

This library has been tested with:

- IO.js v2.5.0

Installation
------------

	npm install douyu

API Usage
---------

	// Import library
	var douyu = require('douyu');
	
	// Initialize Room entity
	var roomID = "424559";
	var room = new douyu.ChatRoom(roomID);
	
	// System level events handler
	room.on('connect', function(message){
		console.log('DouyuTV ChatRoom #' + roomID + ' connected.');
	});
	room.on('error', function(error){
		console.error('Error: ' + error.toString());
	});
	room.on('close', function(hasError){
		console.log('DouyuTV ChatRoom #' + roomID + ' disconnected' + hasError ? ' because of error.' : '.');
	});
	
	// Chat server events
	room.on('chatmsg', function(message){
		console.log('[' + message.nn + ']: ' + message.txt);
	});
	
	// Knock, knock ...
	room.open();

