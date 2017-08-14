$(document).ready(function($){
	var q = $('#quantity').val();
	var price = $('#special_price').html();
	$('#total_of_sale').html(q*price);

	$('#quantity').change(function() {
		var q = $('#quantity').val();
		var price = $('#special_price').html();
		$('#total_of_sale').html(q*price);
	})
});