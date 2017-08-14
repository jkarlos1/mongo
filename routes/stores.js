var StoreModel = require('../models/store').StoreModel;
var UserModel = require('../models/user').UserModel;
var UserRoles = require('../models/user').UserRoles;
var BranchModel = require('../models/branch').BranchModel;
var CheckAuth = require('../middleware/checkAuth');
var FranchisorModel = require('../models/franchisor').FranchisorModel;
var CountryModel = require('../models/country').CountryModel;
var StateModel = require('../models/state').StateModel;
var FranchiseModel = require('../models/franchise').FranchiseModel;
var CityModel = require('../models/city').CityModel;
var Util = require('../helpers/util');
var _ = require('underscore');
// var Encrypter = require('./encryption_controller');

var createStoreBranch = function(req, res, message){
		CountryModel.find({}, function(err, countries){

			if (err) throw err;

			res.render('stores/create_store_branch', {
				title 			: 'Cargar tienda',
				countries 		: countries,
				message 		: message
			});

		});
}

var goHome = function(res){
	res.redirect('/stores/list');
};

module.exports = function(app){


	app.get('/stores/list/:page_number?*', CheckAuth.user, function(req, res, next){

		var query = {
			status 		: 'active',
			creator 	: req.session.user._id
		};

		var page_number = 0;
		if(req.params.page_number){
			page_number = parseInt(req.params.page_number);
		}
		var page_size = 5;
		var skip = page_number * page_size;
		var more_stores = true;
		var next_page = page_number + 1;
		var previous_page = page_number - 1;

		StoreModel.find(query)
		.skip(skip)
		.limit(page_size)
		.populate("images")
		.exec( function(err, stores){
			if(err) throw err;
			if(stores.length < page_size){
				more_stores = false;
			}
			res.render('stores/list', {
				title 		: 'Stores', 
				stores  	: stores,
				next_page		: next_page,
				previous_page	: previous_page,
				more_stores 		: more_stores
			});
		});
	});

	app.get('/stores/all', CheckAuth.user, function(req, res, next){

		var query = {
			status 		: 'active'
		};

		StoreModel.find(query).populate("images").exec( function(err, stores){
			if(err) throw err;
			res.render('stores/list', {title: 'Stores', stores : stores});
		});
	});	


	//Esta llamada solo tiene como finalidad facilitar el testing
	//no debe existir en el ambiente de produccion
	app.get('/stores/restore', function(req, res, next){

		StoreModel.find({}, function(err, stores){
			if(err) throw err;
			stores.forEach(function(store){
				store.status = 'active';
				store.save(function(err){
					if (err) throw err;
				});
			});

			goHome(res);
		});
	});




	app.get('/stores/create_store_branch', CheckAuth.user, CheckAuth.seller, function (req, res, next) {
		createStoreBranch(req, res);
	});



	app.post('/stores/add_store_branch', CheckAuth.user, CheckAuth.seller, function (req, res, next) {
		//and add the Franchise adn City to the Branch

		//Me tendria que cargar a mi mismo si es que es para mi, que es la opcion mas logica.
		UserModel.findOne({ username : req.body.branch.partner }, function(err, partner){

			if (err) throw err;

			var branch = new BranchModel(req.body.branch);
			branch.default = true;
			
			var store = new StoreModel(req.body.store);

			if (partner){
				branch.partner = partner._id;
				var index = partner.roles.indexOf(UserRoles.getPartner());

				if(index == -1){
					partner.roles.push(UserRoles.getPartner());
				}

				partner.save(function(err){
					if (err) throw err;
				});
			}else{
				console.log('Stores - ERROR - No existe el usuario ingresado');
				createStoreBranch(req, res,
					'No existe el usuario ingresado'
					);

				return;
			}

			store.creator = req.session.user._id;
			store.branches.push(branch);

			store.save(function(err){
				
				if (err){
					console.log('Stores - ERROR - ' + err);
					createStoreBranch(req, res, err);
					return;
				}else{

					res.redirect('/stores');
					
				}
			});
		});
	});


	app.get('/stores/edit/:id', CheckAuth.user, function (req, res, next) {
		if(!Util.checkObjectId(req.params.id)){
			goHome(res);
			return;
		}

		StoreModel.findById( req.params.id)
		.populate('franchisor')
		.exec(function(err, store){
			if(err) throw err;
			if(!store){
				goHome(res);
				return;
			}

			//Solo el creador del Store puede editarlo o un ADMIN
			if( (store.creator != req.session.user._id) && (req.session.user.roles.indexOf(UserRoles.getAdmin()) == -1)){
				goHome(res);
				return;
			}

			var options = {
				path	: 'country'
			};

			FranchisorModel.populate(store.franchisor, options , function(err, franchisor){
				if(err) throw err;
				res.render('stores/edit', {
					title			: 'Editar Store',
					store 			: store,
					franchisor 		: franchisor});
			});
		});
	});


	app.get('/stores/remove/:id', CheckAuth.user, function(req, res, next){
		if(!Util.checkObjectId(req.params.id)){
			goHome(res);
			return;
		}

		StoreModel.findById(req.params.id, function(err, store){
			store.status = 'deleted';
			store.save(function(err){
				if (err) throw err;
				goHome(res);
			});
		});
	});


	app.post('/stores/update', function (req, res, next) {

		StoreModel.findById( req.body.store_id , function(err, store){
			_.extend(store, req.body.store);

			store.save(function(err){
				if(err) throw err;
				console.log(store);
				res.redirect('/stores/review/' + store._id);
			});
		});

	});


	app.get('/stores/assign_partner/:id', function(req, res, next){
		StoreModel.findById( req.params.id ).exec( function(err, store){
			if(!err){
				if(store){
					res.render('stores/assign_partner', {title: 'Perfil', user:req.session.user, store:store});

				}else{
					console.log('users - view - No se encontro el user ( ' + req.body.user_id +' )');
				}
			}else{
				console.log('users - view - '.red.bold + err);
			}
		});
	});


	app.post('/stores/assign_partner_save', function(req, res, next){
		StoreModel.findById( req.body.store_id ).exec( function(err, store){
			if(!err){
				if(store && req.body.partner_id){
					UserModel.findOne({ username : req.body.partner_id }, function(err, user_found){
						console.log(user_found._id)
						store.branches[0].partner = user_found._id
						store.save(function(err){
							if(!err){
								user_found.partner = true;
								user_found.save(function(err){
									res.render('stores/view', {title: 'Perfil', user:req.session.user, store:store});
								});
							}else{
								console.log(err)
							}
						}
						);

					});

				}else{
					if (err) return handleError(err);
					console.log('usersss - view - No se encontro el user ( ' + req.body.user_id +' )');
				}
			}else{
				console.log('usessrs - view - '.red.bold + err);
			}
		});
	});


	//devuelve los branches para un store
	//:id -> store._id
	app.get('/stores/branches/:id:format(.json)?', function(req, res, next){
		StoreModel.findById(req.params.id)
		.populate('branches.franchise')
		.exec(function(err, store){

			if (err) throw err;

			if(store){
				res.json(store.branches);
			}else{
				res.json([]);
			}

		});
	});




	app.get('/stores/:store_id/branches/create', CheckAuth.user, CheckAuth.seller, function(req, res){
		if(!Util.checkObjectId(req.params.store_id)){
			goHome(res);
			return;
		}
		StoreModel.findById(req.params.store_id)
		.populate('franchisor')
		.exec(function(err, store){
			if(!store){
				goHome(res);
				return;
			}
			StateModel.find({ country : store.franchisor.country}, function(err, states){
				if (err) throw err;
				FranchiseModel.find( { franchisor : store.franchisor._id }, function(err, franchises){
					if (err) throw err;
					res.render('branches/create', {
						title 		: 'Crear sucursal',
						store 		: store,
						states		: states,
						franchises 	: franchises
					});
				});
			});
		});
	});

	app.post('/stores/:store_id/branches/create', CheckAuth.user, CheckAuth.seller, function(req, res){

		if(!Util.checkObjectId(req.params.store_id)){
			goHome(res);
			return;
		}

		StoreModel.findById(req.params.store_id, function(err, store){

			if(!store){
				goHome(res);
				return;
			}

			UserModel.findOne( { username : req.body.partner_username}, function(err, partner){
				if (err) throw err;

				var branch = new BranchModel(req.body.branch);
				branch.partner = partner._id;
				store.branches.push(branch);
				store.save(function(err){
					if (err) throw err;
					res.redirect('/stores/' + store._id + '/branches/' + branch._id);
				});
			});
		});
	});

	app.get('/stores/:store_id/branches/edit/:branch_id', CheckAuth.user, CheckAuth.seller, function(req, res){

		if(!Util.checkObjectId(req.params.store_id) || !Util.checkObjectId(req.params.branch_id)){
			goHome(res);
			return;
		}

		StoreModel.findById(req.params.store_id)
		.populate('branches.franchise')
		.populate('branches.partner')
		.populate('branches.city')
		.exec(function(err, store){

			if(!store){
				goHome(res);
				return;
			}

			var branch = _.find(store.branches, function(branch){
				return branch._id == req.params.branch_id;
			});

			if (!branch) {
				goHome(res);
				return;
			}
			var options = {
				path : 'state'
			}
			CityModel.populate(branch.city, options, function(err, city){
				if (err) throw err;
				console.log(branch);
				res.render('branches/edit', {
					title 		: 'Editar sucursal',
					branch 		: branch,
					store 		: store,
					city 		: city
				});
			});



		});
	});

	app.post('/stores/branches/update', CheckAuth.user, CheckAuth.seller, function(req, res){

		if(!Util.checkObjectId(req.body.store_id) || !Util.checkObjectId(req.body.branch_id)){
			goHome(res);
			return;
		}

		StoreModel.findById(req.body.store_id)
		.populate('branches.franchise')
		.populate('branches.partner')
		.populate('branches.city')
		.exec(function(err, store){

			if(!store){
				goHome(res);
				return;
			}

			var branch = _.find(store.branches, function(branch){
				return branch._id == req.body.branch_id;
			});

			if (!branch) {
				goHome(res);
				return;
			}

			_.extend(branch, req.body.branch);

			store.save(function(err){
				if (err) throw err;
				res.redirect('/stores/' + store._id + '/branches/' + branch._id );
			});

		});
	});

	app.get('/stores/:store_id/branches/remove/:branch_id', CheckAuth.user, CheckAuth.seller, function(req, res){

		if(!Util.checkObjectId(req.params.store_id) || !Util.checkObjectId(req.params.branch_id)){
			goHome(res);
			return;
		}

		StoreModel.findById(req.params.store_id, function(err, store){
			if (err) throw err;
			if(!store){
				goHome(res);
				return;
			}

			var branch = _.find(store.branches, function(branch){
				return branch._id == req.params.branch_id;
			});

			if(!branch){
				goHome(res);
				return;
			}

			var index = store.branches.indexOf(branch);
			if(index == -1 ){
				goHome(res);
				return;
			}

			store.branches.splice(index, 1);
			store.save(function(err){
				if (err) throw err;
				res.redirect('/stores/' + store._id);
			});


		});


	});


	app.get('/stores/:store_id/branches/:branch_id', CheckAuth.user, function(req, res){

		if(!Util.checkObjectId(req.params.store_id) || !Util.checkObjectId(req.params.store_id)){
			goHome(res);
			return;
		}

		StoreModel.findById(req.params.store_id)
		.populate('branches.franchise')
		.populate('branches.partner')
		.populate('branches.city')
		.exec(function(err, store){

			if(err) throw err;
			if(!store){
				goHome(res);
				return;
			}

			var branch = _.find(store.branches, function(branch){
				return branch._id == req.params.branch_id;
			});

			if(!branch){
				goHome(res);
				return;
			}

			var options = {
				path : 'state'
			}
			CityModel.populate(branch.city, options, function(err, city){
				if (err) throw err;
				console.log(branch);
				res.render('branches/view', {
					title 		: 'Detalles de la sucursal',
					branch 		: branch,
					store 		: store
				});
			});

		});
			

	});


	//Ver store sin ser usuario deberia ser posible. No?. agregue review, si queres las sacamos.

	//Esta llamada creo que deberia ser la vista privada, que solo la puedan ver el que creo el store
	//y sus partners.
	app.get('/stores/review/:id', CheckAuth.user, function(req, res, next){

		if(!Util.checkObjectId(req.params.id)){
			goHome(res);
			return;
		}

		StoreModel.findById( req.params.id )
		.populate('images')
		.populate('branches.partner')
		.exec(function(err, store){
			if(err) throw err;
			if(!store){
				goHome(res);
				return;
			}

			//Solo el creador del Store puede editarlo o un ADMIN
			if( (store.creator != req.session.user._id) && (req.session.user.roles.indexOf(UserRoles.getAdmin()) == -1)){
				goHome(res);
				return;
			}

			res.render('stores/view', {
				title: 'store',
				store : store
			});

		});
	});

	//Lo podria ver cualquiera (supongamos un posible comprador que no esta logueado.)
	//Claro esta llamada es publica, la puede ver cualquiera, vendria a ser la fachada del store. - BENJI
	app.get('/stores/:id', function(req, res, next){

		if(!Util.checkObjectId(req.params.id)){
			goHome(res);
			return;
		}

		StoreModel.findById( req.params.id )
		.populate('images')
		.exec(function(err, store){
			if(err) throw err;
			if(!store){
				goHome(res);
				return;
			}
			res.render('stores/show', {title: 'store', store : store});

		});
	});


}
