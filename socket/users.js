var UserModel = require('../models/user').UserModel;
var FranchiseModel = require('../models/franchise').FranchiseModel;

cleanSockets();

module.exports = function(socket, session, io){

	//Si el usuario esta logueado, actualizo su socket.id para poder enviar
	//correctamente las noticias o las notificaciones personales.
	if(session.user){
		UserModel.findById(session.user._id, function(err, user){
			if (err) throw err;
			if(user){
				user.sockets_list.push(socket.id);
				user.save(function(err){
					if (err) throw err;
				});
			}
		});
	}


	socket.on('disconnect', function() {
		if(session.user){
			UserModel.findById(session.user._id, function(err, user){
				if (err) throw err;

				if(user){
					var index = user.sockets_list.indexOf(socket.id);
					user.sockets_list.splice(index, 1);
					user.save(function(err){
						if (err) throw err;
					});
				}
			});
		}
	});


	socket.on('personal_echo', function(){
		if(session.user){
			UserModel.findById(session.user._id, function(err, user){
				if (err) throw err;

				if(user){
					if(user.socket_id){
						var client = io.sockets.socket(user.socket_id);
						client.emit('personal_echo', { message : 'hello ' + user.username });
					}
				}
			});
		}
	});

	//Ver para agregar en las news.
	socket.on('message', function(data){
		UserModel.findById(data.user_id, function(err, user){
			if (err) throw err;

			if(user){
				user.sockets_list.forEach(function(socket_id){
					io.sockets.socket(socket_id).emit('news.new', { message : data.message});
				});
			}
		});
	});

}



//Esta funcion limpia la lista de sockets de cada usuario para evitar que
//queden sockets viejos cuando reiniciamos el server
function cleanSockets(){

	UserModel.find({}, function(err, users){
		users.forEach(function(user){
			user.sockets_list = [];
			user.save(function(err){
				if (err) throw err;
			});
		});
	});

}
