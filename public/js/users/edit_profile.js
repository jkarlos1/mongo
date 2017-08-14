(function(){

	$('#country_selector').change(function(element){

		$.ajax({
			type 		: 'GET',
			url 		: '/states/' + $(this).val() + '.json',
			success : function(states){
						$('#state_selector').empty();
						for (var i = states.length - 1; i >= 0; i--) {
							$('#state_selector').append(
								'<option value="' + states[i]._id + '" >' + states[i].name + '</option>'
								);
						}
						$('#state_selector').trigger('change');			
					},
			error   : function(jqXHR, textStatus, errorThrown ){
				console.log('AJAX states - ' + textStatus + ' - ' + errorThrown);
			}
		});
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
				}
			},
			error 		: function(jqXHR, textStatus, errorThrown ){
					console.log('AJAX cities - ' + textStatus + ' - ' + errorThrown);
				}
		});
	});


})();