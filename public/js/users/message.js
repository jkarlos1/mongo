(function(){
    $('#send_button').click(send_message);

    $('#message_box').keypress(function( event ) {
        if ( event.which == 13 ) {
            event.preventDefault();
            send_message();
        }
    });
    
})();

function send_message(){
    var user_id = $('#user_select').val();
    var message = $('#message_box').val();
    socket.emit('message', {
        user_id      : user_id,
        message      : message
    });
    $('#message_box').val('');
}
