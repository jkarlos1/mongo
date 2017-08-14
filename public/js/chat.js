$(document).ready(function(){
	$('#open_conversations').hide();
	$('#open_conversations').show();
	$('#conversations_div').load('/conversations/chat_window',function(){
		$('#close_conversations').click(function(){
			$('#open_conversations').show();
			$('#conversations_div').animate({right: -310});
		});
		$('#open_conversations').click(function(){
			$('#open_conversations').hide();
			$('#close_conversations').show();
			$('#conversations_div').animate({right: -70}, function(){
				$('#btn_message').addClass('btn-inverse');
				$('#btn_message').removeClass('btn-warning');	
			});
		});
	});	
	$('.feed_container').load('/news/feed_container',function(){
		
	});	
});