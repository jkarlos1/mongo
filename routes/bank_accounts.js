var BonusModel = require('../models/bonus').BonusModel;
var UserModel = require('../models/user').UserModel;
var DealModel = require('../models/deal').DealModel;
var PaymentModel = require('../models/payment').PaymentModel;
var BankAccountModel = require('../models/bank_account').BankAccountModel;
var CommissionModel = require('../models/commission').CommissionModel;
var mongoose = require('mongoose');
var CheckAuth = require('../middleware/checkAuth');
var Encrypter = require('../helpers/encryption');

module.exports = function(app){
	
	app.get('/bank_accounts',CheckAuth.user ,function(req, res, next){
		BankAccountModel.find({}).exec( function(err, bank_accounts){
			if (err) throw err;
			res.json(bank_accounts);
		});
	});

	app.get('/bank_accounts/create',CheckAuth.user, function (req, res, next) {
		res.render('bank_accounts/create', {title: 'Informacion Bancaria'})
	});

	app.post('/bank_accounts/add',CheckAuth.user, function (req, res, next) {
		var bank_account_new = new BankAccountModel();
		bank_account_new.user = req.session.user._id;
		bank_account_new.bank_name = Encrypter.encrypt(req.body.bank_account.bank_name);
		bank_account_new.curp = Encrypter.encrypt(req.body.bank_account.curp);
		bank_account_new.bank_clabe = Encrypter.encrypt(req.body.bank_account.bank_clabe);
		bank_account_new.bank_rute = Encrypter.encrypt(req.body.bank_account.bank_rute);
		bank_account_new.bank_number = Encrypter.encrypt(req.body.bank_account.bank_number);
		bank_account_new.ife = Encrypter.encrypt(req.body.bank_account.ife);
		bank_account_new.save(function (err) {
			if (!err) {
				res.redirect('users/profile');
			} else {
				res.redirect('/');
			}
		});
	});

	app.get('/bank_accounts/view',CheckAuth.user, function(req, res, next){
		BankAccountModel.findOne( {_id: req.params.id} , function(err, bank_accounts){
			if(!err){
				if(bank_accounts){
					var bank_account= new BankAccountModel();
					bank_account.bank_name = Encrypter.decrypt(bank_accounts.bank_name);
					bank_account.bank_clabe = Encrypter.decrypt(bank_accounts.bank_clabe);
					bank_account.bank_rute = Encrypter.decrypt(bank_accounts.bank_rute);
					bank_account.bank_number = Encrypter.decrypt(bank_accounts.bank_number);
					bank_account.curp = Encrypter.decrypt(bank_accounts.curp);
					bank_account.ife = Encrypter.decrypt(bank_accounts.ife);
					res.render('bank_accounts/view', {title: 'Bank Account Information', bank_account : bank_account, user:req.session.user});
				}else{
					console.log('No encontro la info bancaria.'.red.bold + err);
				}
			}else{
				
			}

	  });
	});

	app.get('/bank_accounts/list',CheckAuth.user, function(req, res, next){
		BankAccountModel.find( {user: req.session.user._id} , function(err, bank_accounts){
			if(!err){
				if(bank_accounts){
					for (var i = bank_accounts.length - 1; i >= 0; i--) {
						bank_accounts[i].bank_name = Encrypter.decrypt(bank_accounts[i].bank_name);
						bank_accounts[i].bank_clabe = Encrypter.decrypt(bank_accounts[i].bank_clabe);
						bank_accounts[i].bank_rute = Encrypter.decrypt(bank_accounts[i].bank_rute);
						bank_accounts[i].bank_number = Encrypter.decrypt(bank_accounts[i].bank_number);
						bank_accounts[i].curp = Encrypter.decrypt(bank_accounts[i].curp);
						bank_accounts[i].ife = Encrypter.decrypt(bank_accounts[i].ife);
					};
					res.render('bank_accounts/list', {title: 'Bank Account Information', bank_accounts : bank_accounts});
				}else{
					console.log('No encontro la info bancaria.'.red.bold + err);
				}
			}else{
				
			}

	  	});
	});

	
}