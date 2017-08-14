$(document).ready(function(){

    clearNews();

    socket.emit('news.start');

    socket.on('news.new', function(data){
            $('#without-news').hide();
            var li = $('<li role="presentation"></li>');
            var element = $('<p class="bg-success"></p>').text(data.message);
            var element = $('<p></p>').text(data.message);
            if(data.title){
                var title = $('<strong class="text-info"></strong>').text(data.title);
                element.prepend($('<br />'));
                element.prepend(title);
            }
            li.append($('<small class="text-muted pull-right"></small>').text(data.date));
            li.append(element);
            $('.feed_container').prepend(li);
            //$('#feed_button').removeClass( "disabled" );
            $('#feed_button').removeClass( "btn-default" ).addClass( "btn-success" );
    });

    $('#feed_button').click(function(){
        $(this).removeClass( "btn-success" ).addClass( "btn-default" );
        socket.emit('news.informed');
    });

    function clearNews(){
        $('.feed_container').empty();
        $('.feed_container').prepend($('<p id="without-news" class="text-center text-muted">No hay noticias nuevas<p>'));
    }


});
