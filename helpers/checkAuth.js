var UserRoles = require('../models/user').UserRoles;

function isUser(user, callback){
	if(user){
		return callback();
	}else{
		return false;
	}
}

function isAdmin(user){
	var index = user.roles.indexOf(UserRoles.getAdmin());
	if (index == -1) {
		return false
	} else {
		return true
	}
}

exports.user = function (user) {
	if (!user) {
		return false
	} else {
		return true
	}
}

exports.admin = function (user) {
	return isAdmin(user);
}

exports.seller = function (user) {
	return isUser(user,function(){
		var index = user.roles.indexOf(UserRoles.getSeller());
		if (index != -1 || isAdmin(user)) {
			return true;
		} else {
			return false;
		}
	});
}

exports.promoter = function (user) {
	return isUser(user,function(){
		var index = user.roles.indexOf(UserRoles.getPromoter());
		if (index != -1 || isAdmin(user)) {
			return true;
		} else {
			return false;
		}
	});
}

exports.partner = function (user) {
	return isUser(user,function(){
		var index = user.roles.indexOf(UserRoles.getPartner());
		if (index != -1 || isAdmin(user)) {
			return true;
		} else {
			return false;
		}
	});
}

exports.member = function (user) {
	return isUser(user,function(){
		var index = user.roles.indexOf(UserRoles.getMember());
		if (index != -1 || isAdmin(user)) {
			return true;
		} else {
			return false;
		}
	});
}

exports.generalAdministrator = function (user) {
	return isUser(user,function(){
		var index = user.roles.indexOf(UserRoles.getGeneralAdministrator());
		if (index != -1 || isAdmin(user)) {
			return true;
		} else {
			return false;
		}
	});
}

exports.franchisorAdministrator = function (user) {
	return isUser(user,function(){
		var index = user.roles.indexOf(UserRoles.getFranchisorAdministrator());
		if (index != -1 || isAdmin(user)) {
			return true;
		} else {
			return false;
		}
	});
}

exports.list = function (user) {
	return UserRoles.list()
}

exports.searchmode = function (user) {
	var index = user.roles.indexOf("search");
	if (index == -1) {
		return true
	} else {
		return false
	}
}

//Funciones extra para chequear relacion con el deal, o similares

//isPartner
//Para ver si el usuario es partner de alguno de los branches asociados a la oferta.
exports.isPartner = function (user, store) {
	var found = false;
	for (var i = store.branches.length - 1; i >= 0; i--) {
		if(store.branches[i].partner == user._id){
			return true
		}
	};
	return false
}