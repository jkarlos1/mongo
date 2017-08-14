

(function(){
	var input = $('#branch_partner');
	var formValidateUser = $('#validate-user');
	var checkIcon = $('#check-icon');
	var isUserValid = false;
	checkIcon.hide();
	function validateUser(){
		isUserValid = false;
		$.ajax({
			type 		: 'GET',
			url 		: '/users/validate/' + input.val(),
			success 	: function(response){
				isUserValid = response;
				if(response){
					formValidateUser.removeClass('has-error');
					formValidateUser.addClass('has-success');
					checkIcon.show();
				}else{
					formValidateUser.removeClass('has-success');
					formValidateUser.addClass('has-error');
					checkIcon.hide();
				}
			},
			error   : function(jqXHR, textStatus, errorThrown ){
					console.log('AJAX states - ' + textStatus + ' - ' + errorThrown);
				}
		});
	}
	input.keyup(validateUser);
	input.focusout(validateUser);
	$('#form_create_branch').submit(function(){
		return isUserValid;
	});


	$('#state_selector').change(function(element){

		$.ajax({
			type 		: 'GET',
			url 		: '/states/cities/' + $('#state_selector').val(),
			success 	: function(cities){
				$('#city_selector').empty();
				for (var i = cities.length - 1; i >= 0; i--) {
					$('#city_selector').append(
						'<option value="' + cities[i]._id + '" >' + cities[i].name + '</option>'
						);
				};
			},
			error 		: function(jqXHR, textStatus, errorThrown ){
					console.log('AJAX cities - ' + textStatus + ' - ' + errorThrown);
				}
		});
	});

	$('#state_selector').trigger('change');
	validateUser();
	$('#form_create_branch').validate({})
})();


