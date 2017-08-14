$(document).ready(inicio);



//Acciones que se deben ejecutar cuando se carga la pagina
function inicio(){
 	$('#selectAll').click(function(event) {  
        if(this.checked) { 
            $('.select_list').each(function() { 
                this.checked = true;             
            });
        }else{
            $('.select_list').each(function() { 
                this.checked = false;                      
            });        
        }
    });
     $('.create_payment').click(function(){
		var total_amount=0;
		$('.select_list').each(function() { 
			if(this.checked){
				total_amount = parseFloat($(this).attr("amount")) + total_amount;
			}
        });
        if(total_amount < 20){
        	alert("El monto del pago debe ser superior a $20 para poder realizar el depósito.");
        }else{
			document.create_payment.submit();
        }
        
	})
	
    if($("#franchise_filter").length > 0){
        $("#franchise_filter").change(function(){
            $(".franchise_subscription").each(function( index ) {
                $(this).show();
                if($("#franchise_filter").val().toString() !== "Todas"){
                    if(typeof $( this ).find(".franchise_name").html() !== "undefined"){
                        if($( this ).find(".franchise_name").html().toString() !== $("#franchise_filter").val().toString()){
                            $(this).hide();
                        }
                    }else{
                        $(this).hide();                     
                    }
                }
            });
        })
    }
 }