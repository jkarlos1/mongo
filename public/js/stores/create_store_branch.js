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


		$.ajax({
			type 		: 'GET',
			url 		: '/franchisors/json/' + $(this).val(),
			success : function(franchisors){
						$('#franchisor_selector').empty();
						for (var i = franchisors.length - 1; i >= 0; i--) {
							$('#franchisor_selector').append(
								'<option value="' + franchisors[i]._id + '" >' + franchisors[i].name + '</option>'
								);
						}
						$('#franchisor_selector').trigger('change');
					},
			error   : function(jqXHR, textStatus, errorThrown ){
				console.log('AJAX states - ' + textStatus + ' - ' + errorThrown);
			}
		});


	});


	$('#franchisor_selector').change(function(element){
		console.log('/franchises/json/' + $(this).val());
		$.ajax({
			type 		: 'GET',
			url 		: '/franchises/json/' + $(this).val(),
			success : function(franchises){
						console.log(franchises);
						$('#franchise_selector').empty();
						for (var i = franchises.length - 1; i >= 0; i--) {
							$('#franchise_selector').append(
								'<option value="' + franchises[i]._id + '" >' + franchises[i].name + '</option>'
								);
						}		
					},
			error   : function(jqXHR, textStatus, errorThrown ){
				console.log('AJAX franchises - ' + textStatus + ' - ' + errorThrown);
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


	$('#form_create_store_branch').validate({});

})();