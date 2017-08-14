var email = require('mandrill-send')('RZ3cOiUSZOU6gT0xclxt0Q');

//Mails es un array de strings con los destinatarios, from, deberia ser el mail de donde salen y el nombre giombu + franquicia.
exports.send_mail = function( mails , subject, body, from_name, from_mail, html_content){
    email({
        from: from_name+' <'+from_mail+'>',
        html: body+html_content,
        subject: subject,
        track_opens: true,
        track_clicks: true,
        auto_text: true,
        merge: true,
        async: true,
        to: mails
    }, function(err){
      if (err) console.error(err);
      return true
    });
     
}