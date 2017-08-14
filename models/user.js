// Creación de la Conexión
var mongoose = require('mongoose');


var PromoterSchema = require('./promoter').PromoterSchema
var ImageSchema = require('./image').ImageSchema;
var InvitationSchema = require('./invitation').InvitationSchema;
var NewSchema = require('./new').NewSchema;


var UserSchema = new mongoose.Schema({
	username				: { type: String, unique:true, required: true},
	email					: { type: String, required: true},
	password				: { type: String, required: true},
	facebook_id				: { type: Number},
	reset_password_token	: String,
	reset_password_sent_at	: Date,
	last_sign_in_at			: Date,
	current_sign_in_at		: Date,
	last_sign_in_ip			: String,
	name					: { type: String, required: true},
	lname					: { type: String, required: true},
	birthday				: { type: Date, required: true},
	gender					: { type: String},
	phone					: { type: String},
	mobile					: { type: String},
	address					: { type: String},
	city					: { type: mongoose.Schema.ObjectId, ref: 'City' },
	zip						: { type: String},
	created    			    : {type: Date, default: Date.now },
	modified				: {type: Date, default: Date.now },
	sockets_list			: [String],
	//Persona que te invitó.
	promoter_id 				: { type: mongoose.Schema.ObjectId, ref: 'User' },
	level					: { type: mongoose.Schema.ObjectId, ref: 'Level' },
	//Relacionados
	 invitation				: [InvitationSchema],
	 images 				: [{ type: mongoose.Schema.ObjectId, ref: 'Image' }],
	 promoter 				: [PromoterSchema],
	 roles 					: [{type:String}],
	 franchisor				: [{ type: mongoose.Schema.ObjectId, ref: 'Franchisor' }],
	news_list				: [NewSchema],
	//Verificar estos campos
});

UserSchema.set('versionKey', false);
exports.UserModel = mongoose.model('User', UserSchema);


exports.UserRoles = (function(){
	var admin = 'admin';
	var user = 'user';
	var member = 'member';
	var seller = 'seller';
	var partner = 'partner';
	var promoter = 'promoter';
	var generalAdministrator = 'generalAdministrator';
	var franchisorAdministrator = 'franchisorAdministratAr';

	return{
		list 		: function(){
			return [admin, user, member, seller, partner, promoter, generalAdministrator, franchisorAdministrator];
		},
		getAdmin 	: function(){
			return admin;
		},
		getUser 	: function(){
			return user;
		},
		getMember 	: function(){
			return member;
		},
		getSeller 	: function(){
			return seller;
		},
		getPromoter 	: function(){
			return promoter;
		},
		getPartner 	: function(){
			return partner;
		},
		getGeneralAdministrator 	: function(){
			return generalAdministrator;
		},
		getFranchisorAdministrator 	: function(){
			return franchisorAdministrator;
		}
	}
})();
