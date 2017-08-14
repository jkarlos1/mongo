var SaleModel = require('../models/sale').SaleModel;
var StoreModel = require('../models/store').StoreModel;
var CouponModel = require('../models/coupon').CouponModel;
var DealModel = require('../models/deal').DealModel;
var UserModel = require('../models/user').UserModel;
var NewModel = require('../models/new').NewModel;
var CommissionModel = require('../models/commission').CommissionModel;
var EventModel = require('../models/event').EventModel;
var Encrypter = require('../helpers/encryption');
var PDFDocument = require('pdfkit');
var CheckAuth = require('../middleware/checkAuth');
var mongoose = require('mongoose');
var CountryModel = require('../models/country').CountryModel;

module.exports = function(app){

	app.get('/sales/checkout/:id', function (req, res, next) {
		DealModel.findById( req.params.id ).populate("images").exec(function(err, deal){
			if(!err){
				if(deal){
				 var list = new Array() 
				 //falta validar la cantidad de cupones comprados para ver si el tope por usuario no es mayor al remanente de cupones.
					for (var i = 1; i <= deal.max_coupons_by_user ; i++) {
						list[i-1] = i;
					};
					CountryModel.find({}, function(err, countries){
								if (err) throw err;
						res.render('sales/checkout', {
							title 				: 'Detalle del pedido', 
							deal 				: deal , 
							list 				: list,
							countries 			: countries,
							redirect_url 		: '/sales/checkout/' + req.params.id
						});
					});
				}else{
				 // res.render('sales/checkout', {title: 'Error'});
				}
			}else{
			}
		});
		
	});

	/**
		 * Realiza el guardado de la compra
		 *
		 * @return void
		 * @author Nicolas Ronchi
	**/
	app.post('/sales/buy',  function (req, res, next) {
		
		DealModel.findById( req.body.id ).populate("store").exec(function(err, deal){
			if(!err){
				if(deal){
					var sale_new = new SaleModel();
					sale_new.payment_method = req.body.payment_type;
					sale_new.status = 'Approved';
					sale_new.user = req.session.user._id;
					for(var i=1;i<=req.body.quantity;i++){
						var coupon_new = new CouponModel();
						coupon_new.code = Encrypter.random_text_code();
						coupon_new.status = 'unredeemed';
						sale_new.coupons.push(coupon_new);
					}
					//Llamo al servicio del banco.
					//UN request a alguna url que responda con un json de confirmacion, nada mas.
					deal.sales.push(sale_new);
					deal.save(function (err) {
							app.emit("sale", deal, req.session.user, sale_new);
							res.redirect('/sales/'+sale_new._id);
						});						
								
				 }else{
					console.log('No encontro el deal en buy.')
				}
			}else{
				console.log('Error en buy.')
			}
		});
		
	});


	//Muestra la lista de compras del usuario logueado
	// YA EXISTE EN EL PROFILE
	// NO ES NECESARIO 
	// bengui
	// app.get('/sales/my', CheckAuth.user, function(req, res){
	// 	DealModel.aggregate()
	// 	.unwind('sales')
	// 	.match({ 'sales.user' : mongoose.Types.ObjectId(req.session.user._id)})
	// 	.exec(function(err, deals){
	// 		if (err) throw err;

	// 		res.render('sales/my', {
	// 			title 		: 'Mis Compras',
	// 			deals 		: deals
	// 		});
	// 	});

	// });
	

	app.get('/sales/view/:id', function (req, res, next) {
		DealModel.findOne({"sales._id" :req.params.id}).populate("store").populate("images").exec( function(err, deal){
			if(!err){
				if(deal){
				
				callback = function(){
					
					res.render('sales/view', {title: 'Detalle de ventas', deal : deal, id:req.params.id})}

					 UserModel.populate(deal, {
					    path: 'sales.user',
					    select: 'name',
					  },function(){ CouponModel.populate(deal, {
					    path: 'sales.coupons',
					    select: 'name'},callback)
					});

					 	}else{
				 // res.render('sales/checkout', {title: 'Error'});
				}
			}else{
			}
		});
	});


	app.get('/sales/view_pdf/:id', function (req, res, next) {
		DealModel.findOne({"sales._id" :req.params.id}).exec( function(err, deal){
			if(!err){
				if(deal){
					callback = function(){
						console.log(sale)
						var doc = new PDFDocument

						doc.fontSize(20)
						doc.text(deal.name,{align:'left'})
						doc.text(deal.description)
						doc.fontSize(12)
						doc.text("$"+(deal.special_price * sale.coupons.length),{align:'left'})
						doc.text(sale.user.name)
						for (var i = sale.coupons.length - 1; i >= 0; i--) {
							doc.text(sale.coupons[i].code)
						};
						doc.text(sale.created)
						doc.output(function(string) {
							  res.end(string,'binary');
							});
					}
				var sale = new SaleModel();
				for (var i = deal.sales.length - 1; i >= 0; i--) {
					if(deal.sales[i]._id == req.params.id){
						sale = deal.sales[i];
					}else{
						//console.log("NO encontro ninguna venta que coincida con las del deal")
					}
				};

				UserModel.populate(sale, {
					    path: 'user',
					    select: 'name',
					  },function(){ StoreModel.populate(deal, {
					    path: 'store'},callback)
					});
					 	}else{
				 // res.render('sales/checkout', {title: 'Error'});
				}
			}	
		});
	});

	app.get('/sales/closure/:id',  function (req, res, next) {
		DealModel.findById(req.params.id).exec( function(err, deal){
			if(!err){
				if(deal){
					callback = function(){
						var doc = new PDFDocument
						doc.fontSize(20)
						doc.text(deal.title,{align:'left'})
						doc.text(deal.characteristics, {align:'left'})
				//		doc.text(deal.store.name,{align:'left'})
						doc.fontSize(12)
						for (var i = deal.sales.length - 1; i >= 0; i--) {
							doc.text(deal.sales[i].user.name,{align:'left'})
							doc.text("$"+(deal.special_price * deal.sales[i].coupons.length))
							for (var j = deal.sales[i].coupons.length - 1; j >= 0; j--) {
								doc.text(deal.sales[i].coupons[j].code )
							};
							doc.text(deal.sales[i].created)
						};
						doc.output(function(string) {
							  res.end(string,'binary');
							});
					}
				UserModel.populate(deal, {
					    path: 'sales.user',
					    select: 'name',
					  },function(){ StoreModel.populate(deal, {
					    path: 'store',
						select: '*'},callback)
					});
					 	}else{
				 // res.render('sales/checkout', {title: 'Error'});
				}
			}	
		});
	});

	/**
		 * Lista de ventas realizadas.
		 * @id del la venta, no de la oferta
		 * @return void
		 * @author Nicolas Ronchi
	**/
	app.get('/sales/:id',CheckAuth.user , function (req, res, next) {
		DealModel.findOne({"sales._id" :req.params.id}).populate("images").exec(function(err, deal){
			if(!err){
				if(deal){
					res.render('sales/view', {title: 'Detalle de venta', deal : deal, id:req.params.id});
				}else{
				 res.send("Compra no encontrada")
				}
			}else{
			}
		});
	});

	//ESTADISITICAS
	//amount_per_month
	exports.amount_per_month = function (req, res, next) {
		DealModel.find( {} ).populate('sales.user').skip(0).exec( function(err, deals){
			if(!err){
				if(deals){
					console.log(deals)
					var users_array = new Array();
					res.writeHead(200, { 'Content-Type': 'application/json' });   
					for (var i = docs.length - 1; i >= 0; i--) {
						var user= docs[i];
						var username = user.username
						users_array[i] = username 
					}; 
					res.write(JSON.stringify(users_array));
					res.end();
				}else{
				 // res.render('sales/checkout', {title: 'Error'});
				}
			}else{
			}
		});
	}
}