var UserModel = require('../models/user').UserModel;
var PromoterModel = require('../models/promoter').PromoterModel;
var checkAuth = require('../middleware/checkAuth');



module.exports = function(app){

	app.get('/promoters/register', checkAuth.user , function (req, res, next) {
		if(req.session.user.promoter.length > 0){
			res.redirect('/promoters/edit')
		}
		res.render('promoters/register', {title: 'Registro de Promotor' });
		
	});


	app.post('/promoters/add', function (req, res, next) {

		UserModel.findById( req.session.user._id , function(err, user){

			var promoter = new PromoterModel();
			promoter.page_title = req.body.page_title;
			promoter.page_body = req.body.page_body;
			promoter.subscribers_invite = req.body.subscribers_invite;

			if (err) throw err;


			UserModel.findOne({ username : req.body.parent_id }, function(err, parentUser){

				if (err) throw err;

				if(parentUser){

					promoter.parent_id = parentUser._id;


					console.log('Promoter');
					console.log(promoter);

					promoter.save(function(err){

						if (err) throw err;

						user.promoter = promoter;

						user.save(function(err){
							if (err) throw err;
							console.log(user);
							req.session.user=user;
							res.render('users/register', {title: 'Cargar Perfil de Promotor'});
						});

					});

				}else{
					//Debemos manejar este error o en mejor lugar evitar llegar a esta instancia
					//sugiriendo los usernames en el frontend
					throw new Error('No existe el usuario ' + req.body.parent_id);
				}


			});
	
		});

	});

	app.get('/promoters/edit', checkAuth.user , function (req, res, next) {

		UserModel.findById( req.session.user._id , function(err, user){
			if (err) throw err;
			UserModel.findById( req.session.user.promoter[0].parent_id , function(err, parent){
				res.render('promoters/edit', {title: 'Edicion de perfil de promotor', user:user, parent:parent});
			});
		});
	});


	app.post('/promoters/update', function (req, res, next) {
		UserModel.findOne({username: req.body.parent_id}, function(err, inviter){
			UserModel.update( { _id : req.session.user._id }, { "promoter.0.page_title" : req.body.page_title,
																"promoter.0.page_body" : req.body.page_body,
																"promoter.0.subscribers_invite" : req.body.subscribers_invite,
																"promoter.0.parent_id" : inviter._id,
																"promoter.0.page_title" : req.body.page_title
															} , callback);
			function callback (err, numAffected) {
			  	res.redirect('/promoters/'+req.session.user._id.toString());
			}
		});
	});

	app.get('/promoters/:id', checkAuth.user , function (req, res, next) {

		UserModel.findById( req.params.id , function(err, user){
			if (err) throw err;
			res.render('promoters/view', {title: 'Perfil de promotor', user:user});
		});
	});

	app.get('/intranet/promoters/list_sons/:start_item', function (req, res, next) {
		var query = UserModel.find({ 'promoter.parent_id': req.session.user._id });
		query.skip(req.params.start_item);
		query.limit(10);
		query.exec(function(err, sons){
			
			if (err) throw err;

			res.render('promoters/list_sons', {
				title: 'Tus promotores',
				user:req.session.user, 
				sons:sons
			});

		});
	});


}

