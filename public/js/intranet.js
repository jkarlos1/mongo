
$(document).ready(function() {

	var socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);
 
	
	var robot_feed = function() {

		socket.emit('check_feed');
	}

	setInterval(robot_feed,10000);

	
	//CHAT VIEW --------------------------------
	var FeedView = Backbone.View.extend({
		el: '.feed_container',
		scroll: 0,
		events: {
			//'click .renovar_feed': 'actualizar'
		},

		initialize: function() {
			_.bindAll(this);
			socket.on('new_feed', this.new_feed);
			socket.on('new_new', this.new_new);
			socket.on('add_news_to_feed', this.add_news_to_feed);
			socket.on('add_new_in_feed', this.add_new_in_feed);
			//Id de la conversacion actual
			
			this.new_feed();
		},
	
		new_feed: function(data){
			var user_id = $('.conversation_container').attr('id');
			socket.emit('new_feed_back', {
				user_id: user_id
			});
		},


		new_new: function(){
			alert("new EVENTO");
		},

		add_news_to_feed: function(news_strings) {
			for (var i = news_strings.length - 1; i >= 0; i--) {	
				$("#feed_list").append('<li>'+news_strings[i]+'</li>')
			};
			
		},

		add_new_in_feed: function(message) {
			$("#feed_list").append('<li style="display:none;">'+message.message+'</li>');
			$( "#feed_list li:last-child" ).fadeIn( "slow", function() {});		
			if($("#feed_list li").length > 10 ){
					$( "#feed_list li:first-child" ).fadeOut( "slow", function() {
					$("#feed_list li:first-child").remove();
					
				});
			}
		}

});
var feed = new FeedView();
});