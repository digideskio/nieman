var send = require('email-toolkit');

module.exports = function(e){
  var email = {
    to:'myles@followgen.com',
    from:'app@followgen.com',
    title:'App Error '+e.message,
    text:e.stack
  };

  send (email, function(){
    console.log('email sent:', arguments);
  });
}

