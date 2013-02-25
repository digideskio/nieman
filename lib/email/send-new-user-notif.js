var dao = require('../dao');
var send = require('email-toolkit');

module.exports = function(uid, plan){
  dao.getUser(uid, function(e, u){
    var text = u.name+'\n';
    text += u.description+'\n';
    text += 'Followers:'+u.followers_count+'\n';
    text += 'Following:'+u.friends_count+'\n';
    u.targets.forEach(function(target){
      text += target+'\n';
    });
    text += u.email+'\n';
    text += 'http://twitter.com/'+u.screen_name;
    var title = '['+plan+'] new user: '+u.name+' '+new Date();

    var email = {
      to:'myles@followgen.com',
      from:'app@followgen.com',
      title:title,
      text:text
    };

    send(email, function(){
      console.log('email sent:', arguments);
    });
  });
}
