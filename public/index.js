//socket.io setup
var socket = io();
socket.on('connect', function () {
	console.log('connected to server.');
	socket.emit('newword', 'Hello! I am a new client testing out messaging.');
});
socket.on('disconnect', function () {
	console.log('disconnected.');
});

//NOTE: websockets do not guarantee that info arrives in same order it was sent
//nor does server send info in series in order
socket.on('data', function (data) {
	//console.log(data);
	draw(data.num, data.palette);
});


$(document).ready(function () {
	// dom loaded
});

var getdata1 = function () {
	return ['hello', 'bye'];
}

var getdata2 = function () {
	var arr = [];
	for (var i = 0; i < 10; i++) {
		arr.push(i);
	}
	return arr;
}

// vue.js
var app = new Vue({
	el: '#app',
	data: {
		collection: getdata1(),
		otherstuff: getdata2()
	}
});