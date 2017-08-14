(function(){

	socket.emit('countries.get');
	socket.on('countries.get', function(data){
		var countries_select = $('#countries_select');
		for (var i = 0; i < data.length; i++) {
			countries_select.append($('<option value="'+data[i]._id+'">'+data[i].name+'</option>'));
		};
		$('#countries_select').trigger('change');
	});


	$('#countries_select').change(function(){
		$('#franchises_select').empty();
		socket.emit('countries.get_franchises', $('#countries_select').val());
	});

	socket.on('countries.get_franchises', function(data){
		var franchises_select = $('#franchises_select');
		franchises_select.append($('<option value="0">Seleccione una franquicia</option>'));
		for (var i = 0; i < data.length; i++) {
			franchises_select.append($('<option value="'+data[i]._id+'">'+data[i].name+'</option>'));
		};
	});

	$('#franchise_select_form').submit(function(event){
		if(parseInt($('#franchises_select').val()) != 0){
			return;
		}
		event.preventDefault();
	});

	socket.emit('cities.get');
	socket.on('cities.get', function(data){
		var cities_select = $('#franchise_subscription');
		for (var i = 0; i < data.length; i++) {
			cities_select.append($('<option value="'+data[i]._id+'">'+data[i].name+'</option>'));
		};
	});

	$('#email_subscriber').focus(function(){
		$('#email_subscriber').parent().removeClass('has-error');
	});

	$('#name_subscription').focus(function(){
		$('#name_subscription').parent().removeClass('has-error');
	});

	$('#franchise_subscription_form').submit(function(event){
		var email = $('#email_subscriber');
		var name = $('#name_subscription');
		if(!IsEmail(email.val())){
			email.parent().addClass('has-error');
			event.preventDefault();
		}

		if(name.val().trim().length == 0){
			name.parent().addClass('has-error');
			event.preventDefault();
		}

	});

	function IsEmail(email) {
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(email);
	}
	 
})();