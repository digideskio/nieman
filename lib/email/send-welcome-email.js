var dao = require('../dao');
var send = require('email-toolkit');

module.exports = function(uid, plan){

  dao.getUser(uid, function(e, u){
    var name = u.name.split(' ')[0];
    var text = 'Hi '+name+' - and welcome to Followgen.\n\n';
    text += 'I just wanted to let you know that I\'m here to answer any questions you may have.\n\n';
    text += 'Your targeting terms are:\n\n ';
    u.targets.forEach(function(target, i){
      text+=target+'\n ';
    });
    text+='\n\n';
    text += 'You can log in and change them, or view your stats at any time.\n\n';
    text += 'Have a great day :-)\n\n';
    text += 'http://followgen.com';
    var email = {
      to:u.email,
      from:'myles@followgen.com',
      title:'Hi '+name,
      text:text
    };

    send(email, function(){
      console.log('email sent:', arguments);
    });

  });
}
