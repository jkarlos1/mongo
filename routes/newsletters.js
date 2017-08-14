var Mailer = require('../helpers/mailer');
var NewsletterModel = require('../models/newsletter').NewsletterModel;
var SubscriberModel = require('../models/subscriber').SubscriberModel;
var FranchiseModel = require('../models/franchise').FranchiseModel;
var DealModel = require('../models/deal').DealModel;
var mailer = require('express-mailer');



module.exports = function (app){
	//

	app.get('/newsletters/create', function(req, res, next){
		FranchiseModel.find().exec( function(err, franchises){
			DealModel.find().exec( function(err, deals){
				res.render('newsletters/create', {title: 'Crear newsletter', franchises:franchises, deals:deals});
			});
		});
	});

	app.post('/newsletters/filter_deals', function(req, res, next){
		newsletter = new NewsletterModel(req.param("newsletter"));
		var time_frame_init = req.param.start_timeframe
		var time_frame_end = req.param.end_timeframe
		FranchiseModel.findById(newsletter.franchise).exec( function(err, franchise){
		  	DealModel.find( {"franchises": {$in: [newsletter.franchise]},"end_date": {'$gte': new Date(time_frame_init), '$lt': new Date(time_frame_end)}  }).sort("-created").populate("images").exec(function(err, deals){
				if(err) throw err;
				if(deals.length > 0){
				    newsletter.description = 'Newsletter para la franquicia'+ franchise.name;
				    newsletter.save(function(){
				    	res.render('newsletters/filter_deals', {title: 'Finalizar Newsletter', franchise:franchise , id:newsletter.id , deals:deals});
					});
				}else{
					DealModel.find({}).sort("-created").populate("images").exec(function(err, deals){
						console.log("No hay ofertas bajo esas condiciones")
						if(err) throw err;
						if(deals.length > 0){
						    newsletter.description = 'Newsletter para la franquicia'+ franchise.name;
						    newsletter.save(function(){
						    	res.render('newsletters/finalize', {title: 'Finalizar Newsletter', franchise:franchise , id:newsletter.id , deals:deals});
							});
						}
					});
				}
		  	});
		});
	});

	app.post('/newsletters/send', function(req, res, next){
		console.log(req.body.newsletter);
		NewsletterModel.update( { _id : req.body.newsletter_id }, { $addToSet: { deals: { $each: req.body.newsletter.deals } } }, callback);
		function callback (err, numAffected) {
			NewsletterModel.findById(req.body.newsletter_id).exec( function(err, newsletter){
				if(err) throw err;
				if(newsletter){
					SubscriberModel.find({ "franchise" : newsletter.franchise}).exec( function(err, subscribers){
						FranchiseModel.findById(newsletter.franchise).exec( function(err, franchise){
							if(typeof franchise !== "undefined"){
							  	DealModel.find( {"_id": {$in: req.body.newsletter.deals }}).sort("-created").populate('franchises').populate("images").exec(function(err, deals){
									if(err) throw err;
									if(deals.length > 0){
										email_recievers = [];
										deals_newsletter = [];
										for (var i = subscribers.length - 1; i >= 0; i--) {
											email_recievers.push(subscribers[i].email)
										};
										for (var i = deals.length - 1; i >= 0; i--) {
											deals_newsletter.push(deals[i]._id);
										};
										console.log(deals);
										app.mailer.send('newsletters/default_template', {
									  		to: email_recievers,
									  		subject: 'Newsletter '+franchise.name, 
									  		deals: deals,
									  		franchise: franchise,
									  		host: "http://localhost:3000"
											}, function (err) {
										    	if (err) {
											      	console.log(err);
											      	res.send(JSON.stringify(err));
											      	return;
											    }
											    newsletter.deals = deals_newsletter;
											    newsletter.title = 'Newsletter '+franchise.name;
											    newsletter.description = 'Newsletter para la franquicia'+ franchise.name;
											    newsletter.save(function(){
											    	res.redirect('/newsletters/'+newsletter.id)
											    });
											    
											});
									}
							  	});
							}
						});
					});
				}
			});
		}
	});

	app.get('/newsletters/sendTest/:id', function(req, res, next){
		SubscriberModel.find({ "franchise" : req.params.id}).exec( function(err, subscribers){
			FranchiseModel.findById(req.params.id).exec( function(err, franchise){
				if(typeof franchise !== "undefined"){
				  	DealModel.find( /*{"franchises": {$in: [req.body.id]}}*/ ).sort("-created").populate('franchises').populate("images").exec(function(err, deals){
						if(err) throw err;
						if(deals.length > 0){
							email_recievers = [];
							deals_newsletter = [];
							for (var i = subscribers.length - 1; i >= 0; i--) {
								email_recievers.push(subscribers[i].email)
							};
							for (var i = deals.length - 1; i >= 0; i--) {
								deals_newsletter.push(deals[i]._id);
							};
							console.log(email_recievers);
							app.mailer.send('newsletters/default_template', {
						  		to: email_recievers,
						  		subject: 'Newsletter '+franchise.name, 
						  		deals: deals,
						  		franchise: franchise,
						  		host: "http://localhost:3000"
								}, function (err) {
							    	if (err) {
								      	console.log(err);
								      	res.send('There was an error sending the email');
								      	return;
								    }
								    newsletter = new NewsletterModel();
								    newsletter.franchise = req.params.id;
								    newsletter.deals = deals_newsletter;
								    newsletter.title = 'Newsletter '+franchise.name;
								    newsletter.description = 'Newsletter para la franquicia'+ franchise.name;
								    newsletter.save(function(){
								    	res.redirect('/newsletters/'+newsletter.id)
								    });
								    
								});
						}
				  	});
				}
			});
		});
	});
										
	app.get('/newsletters/test/:id', function (req, res, next) {
		FranchiseModel.find({ _id : req.params.id}).exec( function(err, franchise){
			if(err) throw err;
			if(franchise){
				DealModel.find( /*{"franchises": {$in: [req.body.id]}}*/  ).sort("-created").populate('franchises').populate("images").exec(function(err, deals){
					if(err) throw err;
					if(deals.length > 0){
						app.mailer.render('newsletters/default_template', {
							to: 'narc88@gmail.com',
							subject: 'Newsletter '+franchise.name,
							deals: deals,
							franchise: franchise,
							host: "http://localhost:3000"
						}, function (err, message) {
							if (err) {
						    	console.log(err);
						    	res.send('There was an error rendering the email');
						    	return;
						    }
						    res.header('Content-Type', 'text/plain');
						    res.send(message);
						});
					}
				});
			}
		});
	});

	app.get('/newsletters', function(req, res, next){
		NewsletterModel.find().sort("-name").populate("franchise").populate("deals").exec( function(err, newsletters){
			if(!err){
		        if(newsletters.length > 0){
		          console.log(newsletters);
		          res.render('newsletters/list', { title: 'Newsletter',
						                          newsletters : newsletters
						                        });
		        }else{
		          console.log('newsletter - view - No se encontro el newsletter ( ' + req.params.id +' )');
		        }
	        }else{
	            console.log('newsletter - view - '.red.bold + err);
	        }
		});
	});

	app.get('/newsletters/:id', function(req, res, next){
		NewsletterModel.findById(req.params.id).populate("franchise").populate("deals").exec( function(err, newsletter){
			if(!err){
		        if(newsletter){
		          console.log(newsletter);
		          res.render('newsletters/view', { title: 'Newsletter',
						                          newsletter : newsletter
						                        });
		        }else{
		          console.log('newsletter - view - No se encontro el newsletter ( ' + req.params.id +' )');
		        }
	        }else{
	            console.log('newsletter - view - '.red.bold + err);
	        }
	    });
	});

	app.get('/newslettersDrop', function(req, res, next){
		NewsletterModel.collection.drop(function (err) { 
			res.redirect('/');
		});
	});
}