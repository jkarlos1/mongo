var mongoose = require('mongoose');

var MessageSchema = require('./message').MessageSchema;

var ConversationSchema = new mongoose.Schema({
  	participants 	     	: [String],
    participants_hide		: [String],
  	messages 		      	: [MessageSchema],
    unread              	: [String],
  	created			       	: { type: Date, required: true, default: Date.now },
    modified            	: { type: Date, required: true, default: Date.now }
});

exports.ConversationModel = mongoose.model('Conversation', ConversationSchema);