$(document).ready(function($){
	
$('.countdown').each(function () {
		var endDate = new Date($(this).attr('data-end'));
		var id = $(this).attr('id');
		var gmt = $(this).attr('data-gmt');
		countDown(id, endDate, gmt)
	});

});
function countDown (deal_id, deal_end_time, city_gmt) {
	var dealEndDate = new Date(deal_end_time);
	var today = new Date();
	var difference_ms = Math.abs(today.getTime() - dealEndDate.getTime());
 	var days = Math.round(difference_ms/(1000 * 60 * 60 * 24));
	if (days > 1) {
		$('#'+deal_id).countdown({until: dealEndDate, format: 'DHM', timezone: city_gmt});
	}
	else {
		$('#'+deal_id).countdown({until: dealEndDate, format: 'HMS', timezone: city_gmt});
	}
}