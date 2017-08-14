
var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
	name		: { type: String , required: true, unique:true},
	body		: { type: String , required: true},
	type		: { type: String },
	created    	:  {type: Date, default: Date.now },
	modified    :  {type: Date, default: Date.now }
})

exports.EventModel = mongoose.model('Event', EventSchema);