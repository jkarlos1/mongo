
$(document).ready(function() {
	$.ajax({
		  url:'/users.json', success:function(result){$('.typeahead').typeahead({name: 'users', local:result})}, async:false,type: "get",
		 });

});