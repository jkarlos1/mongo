var InvitationModel = require('../models/invitation').InvitationModel;
var Mailer = require('../helpers/mailer');
var CountryModel = require('../models/country').CountryModel;
var StateModel = require('../models/state').StateModel;
var CityModel = require('../models/city').CityModel;

module.exports = function (app){
 
  app.get('/invitations/create',  function (req, res, next) {
    console.log(req.headers.host)
    res.render('invitations/create', {title: 'Invitar personas a unirse a giombu'});
  });

  app.post('/invitations/add', function (req, res, next) {
   var invitation_new = new InvitationModel(req.param('invitation'));
    invitation_new.invite_user = req.session.user._id;
   // var invitation = new InvitationModel(req.param('invitation'));

    InvitationModel.findOne({ user: req.session.user._id }).where('email').equals(invitation_new.email).exec(function (err, invitation) {
       if(!err){
          if (invitation){
         res.render('invitations/create', {title: 'Cargar Invitacion' , messagge : "Ya Has invitado a: "+ invitation_new.email});
        }else{
          invitation_new.save(function(err){
          if(!err){
               var body = "<p>Has sido invitado a formar parte de la comunidad Giombu, una comunidad de comercio electrónico en pleno crecimiento. ¡Esperamos que tu tambien quieras formar parte de esto! Para ingresar, por favor sigue el link debajo.";
               body += '"'+ invitation_new.body +'"';
               var html_content = "<a href='http://"+req.headers.host+"/invitations/accept/"+invitation_new._id+"'>Click Aquí para comenzar a ser parte de GIOMBU</a></p>";
               var subject = invitation_new.subject;
               var mails = invitation_new.email;
               var from_name = req.session.user.name ;
               var from_mail = req.session.user.email ;
               Mailer.send_mail( mails , subject, body, from_name, from_mail, html_content);
               console.log(html_content)
              console.log(invitation_new);
              res.locals.expose.message = "La invitacion ha sido enviada con éxito a "+mails
              res.redirect('/invitations');
            } else {
              console.log("Error: - " + err);
              res.redirect('/invitations')
            }
          });
         }
       } else {
          console.log("Error: - " + err);
           res.redirect('back');
     
        }
       
    });
  });


  app.get('/invitations', function(req, res, next){
    InvitationModel.find().where('invite_user').equals(req.session.user._id).exec(function(err, invitations){
      if(!err){
        if(invitations){
          console.log('invitation - list - Se envian los invitations encontrados');
          console.log(invitations);
          res.render('invitations/list', {title: 'Lista de Invitaciones',invitations : invitations});
        }else{
          res.render('invitations/list', {title: 'Lista de Invitaciones', error: "No se han encontrado invitaciones"});
        }
      }else{
        console.log('invitation - list - '.red.bold + err);
      }
    });
  });

  app.get('/invitations/:id',function(req, res, next){
    InvitationModel.findById( req.params.id , function(err, invitation){
      if(!err){
        if(invitation){
          console.log('invitations - view - Se encontro el invitation ( ' + req.params.id +' )');
          res.render('invitations/view', { title: 'invitation',
                          invitation : invitation
                        });
        }else{
          console.log('invitations - view - No se encontro el invitation ( ' + req.params.id +' )');
        }
      }else{
        console.log('invitations - view - '.red.bold + err);
      }
    });
  });

  app.get('/invitations/accept/:id' , function (req, res, next) {
        InvitationModel.findOne({ _id: req.params.id }).populate("invite_user").exec(function (err, invitation) {
            if (invitation){
                console.log(invitation)
                CountryModel.find({}, function(err, countries){
                    if (err) throw err;

                    StateModel.find({}, function(err, states){
                        if (err) throw err;

                        CityModel.find({}, function(err, cities){
                            if (err) throw err;
                            res.render('invitations/accept', {
                                title: 'Ingresa tus Datos', 
                                invitation  : invitation,
                                countries   : countries,
                                states      : states,
                                cities      : cities
                            });

                        });
                        
                    });

                });
            }else{
                console.log("Error: - " + err);
            }
        });
    })

}