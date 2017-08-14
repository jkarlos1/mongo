var SubscriberModel = require('../models/subscriber').SubscriberModel;
var FranchiseModel = require('../models/franchise').FranchiseModel;
var mailer = require('../helpers/mailer');


module.exports = function (app){

	app.post('/subscribers/create', function (req, res, next) {
		var subscriber_new = new SubscriberModel();
		subscriber_new.email = req.body.email_subscriber;
		subscriber_new.franchise = req.body.franchise_subscription;
		subscriber_new.name = req.body.name_subscription;
		console.log(subscriber_new)
		subscriber_new.save(function (err) {
		if (!err) {
			//hay que parametrizar mejor esto.
			var subject = "Suscripcion";
			var body = "Te has suscrito con exito a la franquicia";
			var from_name = "Giombu";
			var from_mail = "narc88@gmail.com";
			var html_content = "<a href='http://localhost:3000/subscriber/erase_subscriber/"+subscriber_new.email+"/"+subscriber_new.franchise+"'> Desuscribirse a estas ofertas </a>";
			mailer.send_mail(subscriber_new.email,subject,body,from_name,from_mail,html_content);
			res.redirect('/');
		} else {
		  
		 	console.log('error de suscripcion'+err)
		}
		});
	});

	//BORRA TODAS LAS SUSCRIPCIONES de ese mail
	app.post('/subscribers/erase_subscriber/:email', function (req, res, next) {
	   SubscriberModel.find({ "email":req.params.email }).remove();
	   res.redirect("/subscribers")
	});

	//Borra la suscripcion de la franquicia en cuestión.
	app.get('/subscribers/erase_subscriber/:email/:franchise', function (req, res, next) {
	   SubscriberModel.find({ "email":req.params.email , "franchise":req.params.franchise}).remove();
	   res.redirect("/subscribers")
	});

	app.get('/subscribers', function(req, res, next){

		console.log('subscriber - list'.cyan.bold);
		console.log(req.session.selected_franchise)
		FranchiseModel.find( {} , function(err, franchises){
			SubscriberModel.find( {} ).populate("franchise").exec(function(err, subscribers){
				if(!err){
					if(subscribers){
						console.log('subscriber - list - Se envian los subscribers encontrados');
						res.render('subscribers/list', {title: 'Lista de subscribers', subscribers : subscribers, franchises:franchises});
					}else{
						console.log('subscriber - list - No hay subscribers');
					}
				}else{
					console.log('subscriber - list - '.red.bold + err);
				}

		 	});
		 });
	});
}