$(document).ready(function(){

	$('.deal_status_selector').click(function(){
		var that=this;
		$.ajax({
			type 		: 'GET',
			url 		: $(that).attr("url") ,
			success 	: function(data){
				$("#"+data.id+" .status_selector").removeClass("active draft closed");
				$("#"+data.id+" .status_selector").addClass(data.status);
				var status = "";
				if(data.status === "draft"){
					status = "Borrador";
				}else if(data.status == "active") {
					status = "Activa";
				}else {
					status = "Cerrada";
				}	
				$("#"+data.id+" .status_selector .status").html(status)
			}
		});
	});
});