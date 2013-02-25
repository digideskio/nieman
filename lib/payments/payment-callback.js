var dao = require('../dao');
var record_user = require('../twitter/record-user.js');
var send_welcome = require('../email/send-welcome-email.js');
var send_notif = require('../email/send-new-user-notif.js');

module.exports = function(err, customer, req, res){

  if (err){

    console.error(err);
    res.redirect('/payment/create?plan='+req.body.plan||req.query.plan+'&error=true');

  } else {

    res.render('thanks', {email:req.session.email, owner:req.owner});

    var user = {
      plan:req.body.plan||req.query.plan,
      targets:req.session.targets, // if we're updating...
      token:req.session.auth_data.token,
      secret:req.session.auth_data.secret,
      screen_name:req.session.auth_data.data.screen_name,
      email:req.session.email,
      id:req.session.auth_data.id,
      owner_name:req.owner.name
    };
    
    record_user(user.id, user.token, user.secret, function(){
      dao.setUser(user.id, user, function(){
        send_welcome(user.id, user.plan);
        send_notif(user.id, user.plan);
      });
    });
    
    dao.setCustomer(req.session.auth_data.id, customer);
    dao.addPremium(req.session.auth_data.id);
  }
}
