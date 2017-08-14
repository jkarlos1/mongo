$(document).ready(function(){

	var closureMessage = "<br/><hr/>Click <a href='/users/turnOffHelpMode'>aquí</a> si considera que los mensajes de ayuda ya no son necesarios"
	//Ejemplo de tooltip
	$('#allDeals').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Acceda aquí para ver la lista de todas las ofertas'+closureMessage
    });

    $('.filtered_deals').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Acceda aquí para ver la lista de todas las ofertas bajo este filtro'+closureMessage
    });

    $('#logo_giombu').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Este es nuestro logo. ¿Todavia no nos conoce?. Visite nuestro <a href="/nosotros"> perfil.</a>'+closureMessage
    });

    $('.news').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Novedades relacionadas con el usuario'+closureMessage
    });

    $('.my_profile').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Aquí podrás acceder a tu perfil de usuario'+closureMessage
    });

    $('.my_stores').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Mis comercios cargados'+closureMessage
    });

    $('.my_deals').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Mis ofertas cargadas'+closureMessage
    });

    $('.invitations').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Invita gente a formar parte de nuestra comunidad!'+closureMessage
    });

    $('#misofertas').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Ofertas que has comprado'+closureMessage
    });

    $('#missuscripciones').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Franquicias a las que estas suscrito'+closureMessage
    });

    $('#miscomisiones').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Comisiones ganadas!'+closureMessage
    });

    $('#misbonos').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Bonos ganados como promotor!'+closureMessage
    });

    $('.summary_button').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Resumen de la oferta, detalles de compras'+closureMessage
    });

});