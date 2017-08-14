
var io;

exports.setIO = function(_io){
	io = _io;
}

exports.handleSocketCalls = function(err, socket, session){

	//if (err) throw err;
	//Previene que falle la aplicacion cuando se detiene el server y quedan sessiones abiertas
	//Tengo que ver si puedo optimizar esto. Bengui 24/6.
	if(err){
		console.log(err);
	}

	//Previene que tire errores al buscar informacion de la session anterior cuando se reinicia
	//el servidor. Tengo que ver si puedo optimizar esto. Bengui 24/6.
	if(!session){
		session = {};
	}

	socket.emit('news', { message: 'welcome'});
	socket.on('log_this', function (data) {
		console.log(data);
	});


	//Esta bueno distribuir las llamadas en modulos para evitar generar una tormenta de codigo
	require('./users')(socket, session, io);
	require('./news')(socket, session, io);
	require('./countries')(socket, session, io);
	require('./cities')(socket, session, io);

};
