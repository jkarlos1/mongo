var CurrencyModel = require('../models/currency').CurrencyModel;
var CurrencyValueModel = require('../models/currency_value').CurrencyValueModel;

module.exports = function(app){
	app.get('/currencies/initialize', function(req, res){
		CurrencyModel.remove().exec(function(err,currencies){
			console.log(currencies.length)

			CurrencyModel.find().exec(function(err,currencies){
				console.log(currencies.length)
			})
			CurrencyModel.remove({});
			var currency_value = new CurrencyValueModel();
			currency_value.value = 7.8
			var currencies = new CurrencyModel();
			currencies.name = 'Peso Argentino'
			currencies.iso = "ARS"
			currencies.symbol = "$"
			currencies.currency_values.push(currency_value)
			currencies.save(function(err){
				if(!err){
					console.log(currencies);
				} else {
					console.log("Error: - " + err);
				}
			}); 

		})
	})
}