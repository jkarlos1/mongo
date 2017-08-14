var UserRoles = require('../models/user').UserRoles;


function isAdmin(user){
	var index = user.roles.indexOf(UserRoles.getAdmin());
	if (index == -1) {
		return false
	} else {
		return true
	}
}

var user = exports.user = function (req, res, next) {
	if (!req.session.user) {
		console.log('ERROR - user not logged in');
		res.redirect('/');
	} else {
		next();
	}
}

exports.admin = function (req, res, next) {
	user(req, res, function(){
		if (isAdmin(req.session.user)) {
			next();
		} else {
			console.log('not allowed');
			res.render('error', {
				description : 'El usuario logueado no es ADMIN'
			});
		}
	});
}

exports.promoter = function (req, res, next) {
	user(req, res, function(){
		var index = req.session.user.roles.indexOf(UserRoles.getPromoter());
		if (index != -1 || isAdmin(req.session.user)) {
			next();
		} else {
			console.log('not allowed');
			res.render('error', {
				description : 'El usuario logueado no es promotor'
			});
		}
	});
}

exports.seller = function (req, res, next) {
	user(req, res, function(){
		var index = req.session.user.roles.indexOf(UserRoles.getSeller());
		if (index != -1 || isAdmin(req.session.user)) {
			next();
		} else {
			console.log('not allowed');
			res.render('error', {
				description : 'El usuario logueado no es vendedor'
			});
		}
	});
}

exports.partner = function (req, res, next) {
	user(req, res, function(){
		var index = req.session.user.roles.indexOf(UserRoles.getPartner());
		if (index != -1 || isAdmin(req.session.user)) {
			next();
		} else {
			console.log('not allowed');
			res.render('error', {
				description : 'El usuario logueado no es partner'
			});
		}
	});
}

exports.member = function (req, res, next) {
	user(req, res, function(){
		var index = req.session.user.roles.indexOf(UserRoles.getMember());
		if (index != -1 || isAdmin(req.session.user)) {
			next();
		} else {
			console.log('not allowed');
			res.render('error', {
				description : 'El usuario logueado no es miembro'
			});
		}
	});
}

exports.generalAdministrator = function (req, res, next) {
	user(req, res, function(){
		var index = req.session.user.roles.indexOf(UserRoles.getGeneralAdministrator());
		if (index != -1 || isAdmin(req.session.user)) {
			next();
		} else {
			console.log('not allowed');
			res.render('error', {
				description : 'El usuario logueado no es Administrador General'
			});
		}
	});
}

exports.franchisorAdministrator = function (req, res, next) {
	user(req, res, function(){
		var index = req.session.user.roles.indexOf(UserRoles.getFranchisorAdministrator());
		if (index != -1 || isAdmin(req.session.user)) {
			next();
		} else {
			console.log('not allowed');
			res.render('error', {
				description : 'El usuario logueado no es Administrador de la Franquicia'
			});
		}
	});
}