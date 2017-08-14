var socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);


socket.on('news', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});

socket.on('personal_echo', function(data){
	console.log(data.message);
});