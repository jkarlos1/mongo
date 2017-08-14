var NewModel = require('../models/new').NewModel;
var news_builder = require('../helpers/news_builder.js');
var util = require('../helpers/util');

module.exports = function(socket, session, io){

	socket.on('news.start', function (data) {
		
		// socket.emit('news.new', { 
		// 		title 		: 'Nueva noticia',
		// 		message 	: 'Esta es una nueva noticia',
		// 		date 		: util.date_time_string(new Date())
		// });
			
		if(session.user){

			NewModel.find({ to_user : session.user._id, informed:false})
			.populate('to_user')
			.populate('from_user')
			.populate('deal')
			.populate('event')
			.exec(function(err, news_list){
				if(err) throw err;
				var packed_new;
				
				for (var i = news_list.length - 1; i >= 0; i--) {

						packed_new = {};
						packed_new.title = news_list[i].event.type;
						packed_new.message = news_builder.make_news_string(news_list[i]);
						packed_new.date = util.date_time_string(news_list[i].created);


						socket.emit('news.new', packed_new);
				};
			});
		}

	});

	socket.on('news.random', function (data) {
		socket.emit('news.new', { message : 'Esta es una nueva noticia enviada el ' + new Date()});
	});

	socket.on('news.informed', function(){
		if(session.user){
			NewModel.find({ to_user : session.user._id, informed:false}, function(err, news){
				for (var i = news.length - 1; i >= 0; i--) {
					news[i].informed = true;
					news[i].save(function(err){
						if (err) throw err;
					});
				};
			});
		}
	});

}
