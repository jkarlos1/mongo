
var crypto = require('crypto'), 
    assert = require('assert');
var algorithm = 'aes256';
var key = '))(#%Giombu&&EJA%eaeapepe#$wipiwipi$';


exports.encrypt = function (data_to_crypt) {
  var cipher = crypto.createCipher(algorithm, key);  
  var encrypted = cipher.update(data_to_crypt, 'utf8', 'hex') + cipher.final('hex');
  return encrypted;
}


exports.decrypt = function (data_to_uncrypt) {
  var decipher = crypto.createDecipher(algorithm, key);
  var decrypted = decipher.update(data_to_uncrypt, 'hex', 'utf8') + decipher.final('utf8');
  return decrypted;
}

exports.random_text_code = function (){
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 10;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}