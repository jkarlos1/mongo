var DealModel = require('../models/deal').DealModel;
var QuestionModel = require('../models/question').QuestionModel;
var StoreModel = require('../models/store').StoreModel;
var SaleModel = require('../models/sale').SaleModel;
var CurrencyModel = require('../models/currency').CurrencyModel;
var Franchisor = require('./franchisors');
var FranchisorModel = require('../models/franchisor').FranchisorModel;
var FranchiseModel = require('../models/franchise').FranchiseModel;
var ImageModel = require('../models/image').ImageModel;
var CommissionModel = require('../models/commission').CommissionModel;
var CountryModel = require('../models/country').CountryModel;
var colors = require('colors');
var util = require('../helpers/util');
var mongoose = require('mongoose');
var CheckAuth = require('../middleware/checkAuth');
var DealStatus = require('../models/deal').DealStatus;
//Logging system
// var logentries = require('node-logentries');
// var log = logentries.logger({
//   token:'4ac8c7db-6c93-48a8-a250-77bd6e744a9d'
// });

function validateDealID(req, res, next){
	if(!util.checkObjectId(req.params.deal_id)){
			res.render('error', {
				description 	: 'No existe la oferta'
			});
			return;
	}else{
		next();
	}
}



module.exports = function (app){

	app.get('/deals/fix_shipping_cost', function(req, res, next){
		DealModel.find({}, function(err, deals){
			if (err) throw err;
			for (var i = 0; i < deals.length; i++) {
				if(deals[i].shipping_cost == null){
					deals[i].shipping_cost = 0;
					deals[i].save(function(err){
						if (err) throw err;
					});
				}
			};
		});
	});

	//Tenemos que agregar el filtro por franquicia por defecto, o seleccionada. Nico 21/04 - Si. Benji 12/05
	//REVISADO
	app.get('/deals/all/:page_number?*', CheckAuth.user, function(req, res, next){
		var page_number = 0;
		if(req.params.page_number){
			page_number = parseInt(req.params.page_number);
		}
		var page_size = 5;
		var skip = page_number * page_size;
		var more_deals = true;
		var next_page = page_number + 1;
		var previous_page = page_number - 1;

		DealModel.find( { seller : req.session.user._id } )
		.skip(skip)
		.limit(page_size)
		.sort("-created")
		.populate("images")
		.exec(function(err, deals){
			
			if(err) throw err;

			if(deals.length < page_size){
				more_deals = false;
			}

			res.render('deals/list', {
				title			: 'Lista de todas las ofertas',
				deals 			: deals,
				next_page		: next_page,
				previous_page	: previous_page,
				more_deals 		: more_deals
			});
			
	  	});
	});

	app.get('/deals/active/:page_number?*', CheckAuth.user, function(req, res, next){
		var page_number = 0;
		if(req.params.page_number){
			page_number = parseInt(req.params.page_number);
		}
		var page_size = 5;
		var skip = page_number * page_size;
		var more_deals = true;
		var next_page = page_number + 1;
		var previous_page = page_number - 1;

		var today = new Date();
		DealModel.find({seller : req.session.user._id, status : 'active'})
		.where('start_date').lte(today)
		.where('end_date').gte(today)
		.sort("-created")
		.populate("images")
		.exec(function(err, deals){
			
			if(err) throw err;

			if(deals.length < page_size){
				more_deals = false;
			}

			res.render('deals/list', {
				title: 'Lista de ofertas activas', 
				deals 			: deals,
				next_page		: next_page,
				previous_page	: previous_page,
				more_deals 		: more_deals
			});

	  	});
	});

	app.get('/deals/future/:page_number?*', CheckAuth.user, function(req, res, next){
		var page_number = 0;
		if(req.params.page_number){
			page_number = parseInt(req.params.page_number);
		}
		var page_size = 5;
		var skip = page_number * page_size;
		var more_deals = true;
		var next_page = page_number + 1;
		var previous_page = page_number - 1;

		var today = new Date();
		DealModel.find({ seller : req.session.user._id })
		.where('start_date').gt(today)
		.sort("-created")
		.populate("images")
		.exec(function(err, deals){
			
			if(err) throw err;

			if(deals.length < page_size){
				more_deals = false;
			}

			res.render('deals/list', {
				title: 'Lista de ofertas futuras', 
				deals : deals,
				next_page		: next_page,
				previous_page	: previous_page,
				more_deals 		: more_deals
			});
	  	});
	});

	app.get('/deals/mine', CheckAuth.user, function(req, res, next){
		var today = new Date();
		DealModel.find({"seller":req.session.user._id})
		.sort("-created")
		.populate("images").populate('franchises')
		.exec(function(err, deals){
			
			if(err) throw err;

			res.render('deals/list', {title: 'Mis ofertas', deals : deals});
	  	});
	});



	//Llama a la vista de creacion de una nueva deal
	//REVISADO
	//Estamos filtrando solo para las stores cargadas por ese usuario
	app.get('/deals/create', CheckAuth.user, CheckAuth.seller, function (req, res, next) {
		console.log('deals - create'.cyan.bold);
		StoreModel.find( { creator : req.session.user._id })
		.populate('franchisor')
		.populate('branches.franchise')
		.exec(function(err, stores){

			res.render('deals/create', {
				title: 'Cargar Oferta',
				stores 			: stores,
				deal_status		: DealStatus.list()
			});

		});
	});

	app.post('/deals/select_franchise', function(req, res, next){
		FranchiseModel.findById(req.body.franchise_id, function(err, franchise){
			if (err) throw err;
			req.session.expose.selected_franchise = franchise;
			res.redirect('/');
		});
	});



	//Agrega una nueva deal
	app.post('/deals/add', function (req, res, next) {

		var deal_new = req.body.deal;
		//Fechas
		deal_new.tagline = deal_new.tagline.split(",");
		//Armo la fecha de inicio
		deal_new.start_date = util.date_mongo(deal_new.start_date, deal_new.start_time);
		//Armo la fecha de fin
		deal_new.end_date = util.date_mongo(deal_new.end_date, deal_new.end_time);
		//Armo la fecha de inicio de canje
		deal_new.start_redeem = util.date_mongo(deal_new.start_redeem, "00:00");
		//Armo la fecha de fin de canje
		deal_new.end_redeem = util.date_mongo(deal_new.end_redeem, "00:00");

		//Establezco al usuario que crea la Deal como el vendedor
		deal_new.seller = req.session.user._id;
		
		//Quito las horas ya que no pertenecen al modelo
		delete deal_new.start_time;
		delete deal_new.end_time;

		//Genero la nueva deal a partir de la coleccion que arme
		var deal = new DealModel(deal_new);

		deal.save(function (err) {

			if (err) throw err;

			res.redirect('/deals/review/' + deal._id);

		});

	});


	


	app.get('/deals/erase_image/:id/:image_id', function (req, res, next) {
	    DealModel.update({_id: req.params.id}, 
	        {$pull: {images: {_id: req.params.image_id}}}, {upsert: true}, function(err, deal){
	        	console.log(err);
	        	res.redirect('/deals/view/' + req.params.id);
	        }
	    );
	});


	app.get('/deals/set_as_principal/:id/:image_id', function (req, res, next) {
		DealModel.findOne().where('_id').equals(req.params.id).exec(function (err, deal) {
	 	 if(!err){
				if(deal){
					console.log(deal.discount);
					for (var i = deal.images.length - 1; i >= 0; i--) {
						if(deal.images[i]._id == req.params.image_id){
							deal.images[i].default = true;
						}else{
							deal.images[i].default = false;
						}
					};
					deal.save(function (err) {});
				}else{
					console.log('deals - view - No se encontro el deal ( ' + req.body.deal_id +' )');
				}
			}else{
				console.log('deals - view - '.red.bold + err);
			}
		});
		DealModel.update({_id:req.params.id,'images._id':req.params.image_id},{$set:{'images.$.default':true}},{upsert: true}, function(err){        	
			res.redirect('/deals/view/' + req.params.id);
		});

	});
	

	//Lista las deals
	app.get('/deals/travel', function(req, res, next){
		
			DealModel.find( { 'tagline': { $in: ['viajes', 'viaje']}} ).sort("-created").exec(function(err, deals){
				if(!err){
					if(deals.count != 0){
						console.log(deals.count+"count")
						console.log('deal - list - Se envian los deals encontrados');
						res.render('deals/home', {title: 'Lista de deals', user: req.session.user,  deals : deals});
					}else{
						console.log('deal - list - No hay deals');
						res.render('not_found', {title: 'Oferta', user: req.session.user});
					}
				}else{
					console.log('deal - list - '.red.bold + err);
				}
		  	});
		
	});


	//Llama a la vista de edicion de una deal
	//REVISADO
	app.get('/deals/edit/:deal_id', validateDealID, CheckAuth.seller, function(req, res, next){
		DealModel.findById( req.params.deal_id, function(err, deal){
			if(err) throw err;
			if(deal){
				if(deal.seller != req.session.user._id){
					res.render('error', {
						description 	: 'No esta autorizado a editar la oferta'
					});
					return;
				}
				var extra = {};
				//Acomodo las fechas y horas para que sean humanamente visibles
				//estos campos deben ser eliminados antes de realizar el update
				extra.start_time = util.time_string(deal.start_date);
				extra.end_time = util.time_string(deal.end_date);
				extra.start_date = util.date_form(deal.start_date);
				extra.end_date = util.date_form(deal.end_date);
				extra.start_redeem = util.date_form(deal.start_redeem);
				extra.end_redeem = util.date_form(deal.end_redeem);

				console.log(deal);
				console.log(extra);

				StoreModel.findById( deal.store )
				.populate('franchisor')
				.populate('branches.franchise')
				.exec(function(err, store){

					if (err) throw err;

					res.render('deals/edit', {
						title 		: 'deal Edit', 
						user 		: req.session.user, 
						deal 		: deal,
						store 		: store,
						extra 		: extra
					});

				});

				

			}else{
				res.render('error', {
					description 	: 'La oferta no existe'
				});
			}
		});	
	});



	//Actualiza los campos de la deal
	app.post('/deals/update', CheckAuth.seller, function(req, res, next){

		DealModel.findById( req.body.deal._id , function(err, deal){
			if(err) throw err;

			if(deal && (deal.seller == req.session.user._id)){
				
				//Edicion del deal
				//Hacer que solo se graben los campos editados
				edited_deal = req.body.deal;
				//Tomo los datos del front-end y los formateo en los campos de formato date correspondiente
				//luego elemino los campos que no son necesario y actualizo la deal
				edited_deal.start_date = util.date_mongo(edited_deal.start_date, edited_deal.start_time);
				delete edited_deal.start_time;

				edited_deal.end_date = util.date_mongo(edited_deal.end_date, edited_deal.end_time);
				delete edited_deal.end_time;

				edited_deal.start_redeem = util.date_mongo(edited_deal.start_redeem, '00:00');
				edited_deal.end_redeem = util.date_mongo(edited_deal.end_redeem, '00:00');


				delete edited_deal._id;
				
				for (field in edited_deal){
					if(edited_deal[field] != ''){
						deal[field] = edited_deal[field];
						console.log('deal - update - Edito el campo '+ field);
					}
				}

				deal.save(function (err) {
					if (err) throw err;
					res.redirect('/deals/' + deal._id);
				});

			}else{
				console.log('deal - edit - No se encontro el deal ( ' + req.body.deal_id +' )');
			}

	  });

	});



	//Elimina una deal
	app.get('/deals/remove/:deal_id', validateDealID, function(req, res, next){

		DealModel.findById( req.params.deal_id , function(err, deal){
			if(!err) throw err;
			if(deal){
				if(deal.seller != req.session.user._id){
					res.render('error', {
						description 	: 'No esta autorizado a eliminar la oferta'
					});
					return;
				}
				//Elimino el deal
				deal.remove(function(err){
					if(!err) throw err;
					res.redirect('/deals');
				});
			}else{
				console.log('deals - remove - No se encontro el deal ( ' + req.params.deal_id +' )');
				res.redirect('/deals');
			}
		});

	});


	//Arma el menu de admin y redirecciona
	app.get('/deals/admin', function(req, res, next){
		res.render('deals/admin', {
			title : 'Lista de deals activos',
			user: req.session.user
		});

	});

	//Muestra la vista detallada de una deal en particular
	//Si la ruta matchea entra por esta, necesitamos distintas rutas Nico 4/6
	app.get('/deals/review/:deal_id', validateDealID, CheckAuth.seller, function(req, res, next){
		DealModel.findOne({"_id": req.params.deal_id })
		.populate('store')
		.populate("images")
		.populate('seller')
		.exec( function(err, deal){
			if(err) throw err;
			if(deal){
				if(deal.seller._id != req.session.user._id){
					res.render('error', {
						description 	: 'No esta autorizado a editar la oferta'
					});
					return;
				}

				DealModel.find()
				.nor([{ "_id":req.params.deal_id}])
				.populate('store')
				.exec( function(err, deals){

					if(err) throw err;
						
					QuestionModel.find({'deal':deal._id})
					.populate('user')
					.populate('deal')
					.exec( function(err, questions){
						
						if(err) throw err;
						
						res.render('deals/view', {
							title 			: 'Oferta', 
							deal  			: deal, 
							deals 			: deals, 
							questions 		: questions
						});
						
					});

				});
			}else{
				console.log('No se encontro el deal ( ' + req.body.deal_id +' )');
				res.render('not_found', {title: 'Oferta', user: req.session.user});
			}

		});
	});

	app.get('/deals/:deal_id', validateDealID, function(req, res, next){
		DealModel.findById( req.params.deal_id )
		.populate('store').populate("partner").populate("images")
		.exec( function(err, deal){
			if(err) throw err;
			if(deal){
				DealModel.find()
				.nor([{ "_id":req.params.deal_id}])
				.populate('store').populate("images")
				.exec( function(err, deals){
					if(err) throw err;
					QuestionModel.find({'deal':deal._id})
					.populate('user')
					.populate('deal')
					.exec( function(err, questions){
						if(err) throw err;
						console.log(questions)
						var callback = function(){

							console.log(questions)
							res.render('deals/show', {
								title 			: 'Oferta', 
								deal  			: deal, 
								deals 			: deals, 
								questions 		: questions
							});
						}
						var populatequestions = function(){
							console.log(questions)
							ImageModel.populate(questions, {path: 'user.images'}, callback);
						}
						ImageModel.populate(deal, {path: 'store.images'}, populatequestions);
					});
				});
			}else{
				console.log('No se encontro el deal ( ' + req.body.deal_id +' )');
				res.render('not_found', {title: 'Oferta', user: req.session.user});
			}

		});
	});

	app.get('/deals/summary/:deal_id', validateDealID, function(req, res, next){
		DealModel.findById( req.params.deal_id )
		.populate('store').populate("partner").populate("images").populate("seller").populate("branches").populate("franchises")
			.exec( function(err, deal){
			if(err) throw err;
			if(deal){
				QuestionModel.find({'deal':deal._id})
				.populate('user')
				.populate('deal')
				.exec( function(err, questions){
					console.log(deal)
					if(err) throw err;
					var callback = function(){
						res.render('deals/summary', {
							title 			: 'Oferta', 
							deal  			: deal,  
							questions 		: questions
						});
					}
					var populateSellerImages = function(){
						ImageModel.populate(deal, {path: 'seller.images'}, callback)
					}
					ImageModel.populate(deal, {path: 'store.images'}, populateSellerImages)
				});
			}else{
				console.log('No se encontro el deal ( ' + req.body.deal_id +' )');
				res.render('not_found', {title: 'Oferta', user: req.session.user});
			}

		});
	});


	//Actualiza los campos de la deal
	app.get('/deals/:id/state/:status', CheckAuth.user, CheckAuth.seller, function(req, res, next){

		DealModel.findById( req.params.id , function(err, deal){
			if(err) throw err;

			if(deal){
				
				if(req.params.status == "draft" ||req.params.status == "active" ||req.params.status == "closed" ){
					deal.status = req.params.status;
					deal.save(function (err) {
						if (err) throw err;
						res.send({"id":deal._id,
							"status":req.params.status});
					});
					
				}

				
			}else{
				res.send("Error");
			}

	  });

	});
	app.get('/deals/redeem_coupon/:sale_id/:coupon_code', CheckAuth.user, function(req, res, next){
		DealModel.findOne({"sales._id":req.params.sale_id})
		.populate('store').populate("images")
		.exec( function(err, deal){
			if(err) throw err;
			if(deal){
				var commission_new = new CommissionModel(); 
				commission_new.user_id = deal.seller;
				var sale_index = -1;
				var code_index = -1;
				var sale = new SaleModel();
				for (var i = 0 ; i < deal.sales.length ; i++) {
					if(deal.sales[i]._id == req.params.sale_id ){
						sale_index = i;
						sale = deal.sales[i];
					}
				};
				for (var i = 0; i < deal.sales[sale_index].coupons.length ; i++) {
					if(deal.sales[sale_index].coupons[i].code == req.params.coupon_code ){
						code_index = i;
					}
				};
				deal.sales[sale_index].coupons[code_index].status = "redeemed";
				deal.save(function(err){
					if(err){
						console.log(err);
					}
					commission_new.sale = req.params.sale_id;
					commission_new.currency = deal.currency
					commission_new.amount = (deal.promoter_percentage)/100*(deal.special_price)*(sale.coupons.length);
					commission_new.save(function(){
						app.emit("redeemed_coupon",deal, sale, req.params.coupon_code, req.session.user._id);
						app.emit("commission_event", "Commission_Seller", deal, commission_new, req.session.user);
					});
					res.redirect("/deals/"+deal._id);

				});
				
			}else{
				console.log('No se encontro el deal ( ' + req.body.deal_id +' )');
				res.render('not_found', {title: 'Oferta', user: req.session.user});
			}

		});
	});



	//Muestra deals activos.
	app.get('/', function(req, res, next){
			var search_query = '';
			var today = new Date();
			if(req.query.search_query){
				search_query = req.query.search_query;
			}
			if(req.session.expose.selected_franchise){
				var branches_list = [];
				StoreModel.aggregate()
				.unwind('branches')
				.match({ 'branches.franchise' :  mongoose.Types.ObjectId(req.session.expose.selected_franchise._id) })
				.group({ _id : '$branches.franchise', branches_list : { $push : '$branches._id'}})
				.exec(function(err, results){
					if( results.length ){
						branches_list = results[0].branches_list;
					}
					DealModel.find( { 
						status 		: 'active',
						branches 	: { $in : branches_list },
						title 		: {$regex : '.*' + search_query +'.*', $options : 'i'}
					})
					.where('start_date').lte(today)
					.where('end_date').gte(today)
					.limit(10)
					.where('franchises')
					.populate("images")
					.sort("-created")
					.exec(function (err, deals) {
						if (err) return handleError(err);
						if(deals){
							res.render('deals/home', {
								title 			: 'Ofertas', 
								deals 			: deals
							});
						}else{
							res.render('not_found', {title: 'No se encuentran ofertas'});
						}
					});

				});

			}else{
				DealModel.find( { 
					status 		: 'active',
					title 		: {$regex : '.*' + search_query +'.*', $options : 'i'} 
				})
				.where('start_date').lte(today)
				.where('end_date').gte(today)
				.limit(10)
				.sort("-created")
				.populate("images")
				.exec(function (err, deals) {
					if (err) return handleError(err);
					if(deals){
						res.render('deals/home', {
							title 			: 'Ofertas', 
							deals 			: deals
						});
					}else{
						res.render('not_found', {
							title: 'No se encuentran ofertas'
						});
					}
				});
			}
	});

}





//Estadisticas para ofertas

function map_by_day() {
	emit((this.created.getMonth()+1).toString()+this.created.getDate().toString()+this.created.getFullYear().toString() , 1);
}

function reduce_count(key, values) {
	var res = 0
	values.forEach(function (v) {
		res = res + 1 
	});
	return res;
}

exports.calculate_new_deals = function(req, res, next){
	mongoose.connection.db.executeDbCommand({mapreduce: "deals", map: map_by_day.toString(), reduce: reduce_count.toString(), out: {inline: 1}}, 
		function(err, deals){
			if(!err){
				console.log(deals.documents[0].results)
				if(!deals){
					console.log('No se han encontrado coincidencias')
				}else{
					res.writeHead(200, { 'Content-Type': 'application/json' });   
					res.write(JSON.stringify(deals.documents[0].results));
					res.end();
				}
			}else{
				if (err) throw err;
			}
		});
}


//Estadisticas


function map_by_day() {
	emit((this.created.getMonth()+1).toString() , 1);
}

function reduce_count(key, values) {
	var res = 0
	values.forEach(function (v) {
		res = res + 1 
	});
	return res;
}

exports.calculate_new_deals = function(req, res, next){
	var today = new Date();
	var year;
	var month;
	if(today.getMonth()>=5){
		year = today.getFullYear();
		month = today.getMonth()-5;
	}else{
		year = today.getFullYear()-1;
		month = today.getMonth()-5+12;
	}
	mongoose.connection.db.executeDbCommand({mapreduce: "deals", map: map_by_day.toString(), reduce: reduce_count.toString(), out: {inline: 1}, query: {created: {$gt: new Date(year, month, 1)}}},
		function(err, deals){
			if(!err){
				console.log(deals.documents[0].results)
				if(!deals){
					console.log('No se han encontrado coincidencias')
				}else{
					res.writeHead(200, { 'Content-Type': 'application/json' });   
					res.write(JSON.stringify(deals.documents[0].results));
					res.end();
				}
			}else{
				if (err) throw err;
			}
		});
}


// Totales vendidos por mes.

function map_sales_total_by_month() {
	var total = 0  
	for (var idx = 0; idx < this.sales.length; idx++) {
		total= total + this.sales[idx].coupons.length;
	}
	var amount = total * this.special_price
	emit((this.created.getMonth()+1).toString() , amount);
}

function reduce_count_total_by_month(key, values) {
	var res = 0
	values.forEach(function (v) {
		res = res + v
	});
	return res;
}

exports.calculate_total_by_month = function(req, res, next){
	var today = new Date();
	var year;
	var month;
	if(today.getMonth()>=5){
		year = today.getFullYear();
		month = today.getMonth()-5;
	}else{
		year = today.getFullYear()-1;
		month = today.getMonth()-5+12;
	}
	mongoose.connection.db.executeDbCommand({mapreduce: "deals", map: map_sales_total_by_month.toString(), reduce: reduce_count_total_by_month.toString(), out: {inline: 1}, query: {created: {$gt: new Date(year, month, 1)}}},
		function(err, deals){
			if(!err){
				console.log(deals);
				if(!deals){
					console.log('No se han encontrado coincidencias')
				}else{
					res.writeHead(200, { 'Content-Type': 'application/json' });   
					res.write(JSON.stringify(deals.documents[0].results))
					res.end();
				}
			}else{
				if (err) throw err;
			}
		});
}

//Total de cupones

function map_coupon_total_by_month() {
	var total = 0  
	for (var idx = 0; idx < this.sales.length; idx++) {
		total= total + this.sales[idx].coupons.length;
	}
	emit((this.created.getMonth()+1).toString() , total);
}

exports.calculate_coupon_total_by_month = function(req, res, next){
	var today = new Date();
	var year;
	var month;
	if(today.getMonth()>=5){
		year = today.getFullYear();
		month = today.getMonth()-5;
	}else{
		year = today.getFullYear()-1;
		month = today.getMonth()-5+12;
	}
	mongoose.connection.db.executeDbCommand({mapreduce: "deals", map: map_coupon_total_by_month.toString(), reduce: reduce_count_total_by_month.toString(), out: {inline: 1}, query: {created: {$gt: new Date(year, month, 1)}}}, 
		function(err, deals){
			if(!err){
				console.log(deals);
				if(!deals){
					console.log('No se han encontrado coincidencias')
				}else{
					res.writeHead(200, { 'Content-Type': 'application/json' });   
					res.write(JSON.stringify(deals.documents[0].results))
					res.end();
				}
			}else{
				if (err) throw err;
			}
		});
}